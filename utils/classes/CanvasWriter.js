const Canvas = require('canvas');
const Image = Canvas.Image;
const fs = require('fs');

class CanvasWriter {
    /**
     * Creates a CanvasWriter.
     * @param {Canvas} canvas Canvas to use.
     */
    constructor(canvas){
        /** Canvas of the CanvasWriter. */
        this.canvas = canvas;

        /** CanvasRenderingContext2D of the Canvas. */
        this.ctx = canvas.getContext('2d');
        this.ctx.save();

        /** The current y coord to write text on. */
        this.line = 0;

        /** The current line number. */
        this.lineNumber = 0;

        /** Text that has been written on the Canvas and the options used for them. */
        this.texts = [];
    }

    /** The first write operation on this CanvasWriter. */
    get firstWrite(){
        return this.texts[0];
    }

    /** The previous write operation on this CanvasWriter. */
    get lastWrite(){
        return this.texts.slice(-1)[0];
    }

    /** The current line count. */
    get lineCount(){
        return this.texts.length;
    }

    /** Lowest x value and highest x value in the text written. */
    get rangeX(){
        let furthest = this.texts.map(t => {
            if (t.writeOptions.rotate === 0 || !t.writeOptions.rotate) return t.x + t.measure.width;

            let pivot = 0;
            let x = t.x + t.measure.width;
            let y = t.y + t.measure.emHeightDescent;
            let angle = -t.writeOptions.rotate * Math.PI / 180;

            let rotatedX = pivot + (x - pivot) * Math.cos(angle) + (y - pivot) * Math.sin(angle);
            return rotatedX;
        }).sort((a, b) => a - b);

        return [furthest[0], furthest.slice(-1)[0]];
    }

    /** Lowest y value and highest y value in the text written. */
    get rangeY(){
        let furthest = this.texts.map(t => {
            if (t.writeOptions.rotate === 0 || !t.writeOptions.rotate) return t.y + t.measure.emHeightDescent;

            let pivot = 0;
            let x = t.x + t.measure.width;
            let y = t.y + t.measure.emHeightDescent;
            let angle = -t.writeOptions.rotate * Math.PI / 180;

            let rotatedY = pivot - (x - pivot) * Math.sin(angle) + (y - pivot) * Math.cos(angle);
            return rotatedY;
        }).sort((a, b) => a - b);

        return [furthest[0], furthest.slice(-1)[0]];
    }

    /**
     * Restores the drawing state. Recommended to use if you changed some options for other things and want to reset to default for writing text.
     * @return This CanvasWriter.
     */
    restore(){
        this.ctx.restore();
        return this;
    }

    /**
     * Draws a background.
     * @param {string|object} style Style to fill with. Can be a color, gradient, etc.
     * @return This CanvasWriter.
     */
    drawBackground(style){
        this.ctx.save();

        this.ctx.fillStyle = style;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.restore();
        return this;
    }

    /**
     * Draws an image.
     * @param {Buffer} buffer A buffer.
     * @param {number} x x coordinate.
     * @param {number} y y coordinate.
     * @param {number} width The width.
     * @param {number} height The height.
     * @return This CanvasWriter.
     */
    drawImage(buffer, x, y, width, height){
        this.ctx.save();

        let image = new Image();
        image.src = buffer;
        this.ctx.drawImage(image, x, y, width, height);

        this.ctx.restore();
        return this;
    }

    /**
     * Draws a background image.
     * @param {Buffer} buffer A buffer.
     * @return This CanvasWriter.
     */
    drawBackgroundImage(buffer){
        return this.drawImage(buffer, 0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Writes a line of text.
     * @param {string} text Text to write.
     * @param {WriteOptions} writeOptions Options for the drawing of the text.
     * @param {StrokeOptions} strokeOptions Options for the stroke of the text.
     * @return This CanvasWriter.
     */
    writeText(text, writeOptions = {}, strokeOptions){
        this.ctx.save();

        let offsetX = writeOptions.x || 5;
        let offsetY = writeOptions.y || 5;
        let breakSpacing = writeOptions.breakSpacing || 0;
        if (text !== '\n') breakSpacing = 0;

        let spacing = writeOptions.spacing || 0;
        if (this.line === 0) spacing = 0;

        this.ctx.font = writeOptions.font || '10px sans-serif';
        this.ctx.fillStyle = writeOptions.style || 'black';
        this.ctx.textAlign = writeOptions.align || 'left';
        this.ctx.globalAlpha = writeOptions.opacity || 1.0;
        this.ctx.rotate((writeOptions.rotate || 0) * Math.PI / 180);

        this.ctx.shadowColor = writeOptions.shadowColor;
        this.ctx.shadowOffsetX = writeOptions.shadowX || 0;
        this.ctx.shadowOffsetY = writeOptions.shadowY || 0;
        this.ctx.shadowBlur = writeOptions.shadowBlur || 0;

        let measure = this.ctx.measureText(text === '\n' ? '' : text);

        if (strokeOptions){
            this.ctx.strokeStyle = strokeOptions.style;
            this.ctx.lineWidth = strokeOptions.width;
            this.ctx.lineJoin = strokeOptions.join;

            let xSpace = (this.ctx.textAlign === 'center' ? 0 : measure.actualBoundingBoxLeft + this.ctx.lineWidth) + offsetX;
            let ySpace = this.line + measure.actualBoundingBoxAscent + this.ctx.lineWidth + spacing + breakSpacing + offsetY;

            this.texts.push({text, measure, line: this.line, lineNumber: this.lineNumber, x: xSpace, y: ySpace, writeOptions, strokeOptions});

            this.ctx.strokeText(text === '\n' ? '' : text, xSpace, ySpace);
            this.ctx.fillText(text === '\n' ? '' : text, xSpace, ySpace);
            this.line += measure.actualBoundingBoxAscent + measure.emHeightDescent + this.ctx.lineWidth + breakSpacing + spacing;
            this.lineNumber++;

            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.ctx.restore();

            return this;
        }

        let xSpace = (this.ctx.textAlign === 'center' ? 0 : measure.actualBoundingBoxLeft) + offsetX;
        let ySpace = this.line + measure.actualBoundingBoxAscent + spacing + breakSpacing + offsetY;

        this.texts.push({text, measure, line: this.line, lineNumber: this.lineNumber, x: xSpace, y: ySpace, writeOptions, strokeOptions});

        this.ctx.fillText(text === '\n' ? '' : text, xSpace, ySpace);
        this.line += measure.actualBoundingBoxAscent + measure.emHeightDescent + breakSpacing + spacing;
        this.lineNumber++;

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.restore();

        return this;
    }

    /**
     * Writes multiple lines of text.
     * @param {string|Array} lines Lines to write, either in an array or separated by newlines.
     * @param {WriteOptions} writeOptions Options for the drawing of the text.
     * @param {StrokeOptions} strokeOptions Options for the stroke of the text.
     * @return This CanvasWriter.
     */
    writeLines(lines, writeOptions = {}, strokeOptions = {}){
        let texts = lines;
        if (typeof texts === 'string') texts = texts.split('\n').map(t => !t ? '' : t);

        let maxLines = writeOptions.maxLines;
        texts = texts.slice(0, maxLines);

        texts.forEach(t => this.writeText(t, writeOptions, strokeOptions));
        return this;
    }

    /**
     * Writes and wraps a line of text.
     * @param {string|Array} text Text to write.
     * @param {number} maxWidth Maximum text width.
     * @param {WriteOptions} writeOptions Options for the drawing of the text.
     * @param {StrokeOptions} strokeOptions Options for the stroke of the text.
     * @return This CanvasWriter.
     */
    writeWrapped(text, maxWidth = this.canvas.width, writeOptions = {}, strokeOptions){
        this.ctx.font = writeOptions.font || '10px sans-serif';
        let results = [];

        let reduceToFit = (text) => {
            let width = this.ctx.measureText(text).width;

            if (width > maxWidth){
                let section = text;
                let j = 1;

                while (this.ctx.measureText(section).width > maxWidth && section.length > 1){
                    section = section.slice(0, -1);
                    j += 1;
                }

                results.push(section);
                return reduceToFit(text.slice(-j + 1));
            }

            results.push(text);
        };

        reduceToFit(text);
        this.writeLines(results, writeOptions, strokeOptions);
        return this;
    }

    /**
     * Writes and wraps multiple lines of text.
     * @param {string|Array} lines Lines to write, either in an array or separated by newlines.
     * @param {number} maxWidth Maximum text width.
     * @param {WriteOptions} writeOptions Options for the drawing of the text.
     * @param {StrokeOptions} strokeOptions Options for the stroke of the text.
     * @return This CanvasWriter.
     */
    writeWrappedLines(lines, maxWidth = this.canvas.width, writeOptions = {}, strokeOptions){
        let texts = lines;
        if (typeof texts === 'string') texts = texts.split('\n').map(t => !t ? '' : t);

        texts.forEach(t => this.writeWrapped(t, maxWidth, writeOptions, strokeOptions));
        return this;
    }

    /**
     * Writes and wraps a line of text by whitespace.
     * @param {string|Array} text Text to write.
     * @param {number} maxWidth Maximum text width.
     * @param {WriteOptions} writeOptions Options for the drawing of the text.
     * @param {StrokeOptions} strokeOptions Options for the stroke of the text.
     * @return This CanvasWriter.
     */
    writeWordWrapped(text, maxWidth = this.canvas.width, writeOptions = {}, strokeOptions){
        this.ctx.font = writeOptions.font || '10px sans-serif';
        let results = [];

        let reduceToFit = (text) => {
            let width = this.ctx.measureText(text).width;

            if (width > maxWidth){
                let section = text;
                let j = 1;

                while (this.ctx.measureText(section).width > maxWidth && section.length > 1){
                    section = section.slice(0, -1);
                    j += 1;
                }

                results.push(section);
                return text.slice(-j + 1);
            }

            return text;
        };

        let splitToFit = (text) => {
            if (!text) return;

            let words = text.split(' ');
            let width = this.ctx.measureText(words.join(' ')).width;

            if (width > maxWidth){
                let section = words;
                let remainder = [];

                while (this.ctx.measureText(section.join(' ')).width > maxWidth && section.join(' ').length > 1){
                    if (section.length === 1){
                        let extra = reduceToFit(section.join(' '));
                        return splitToFit(extra + ' ' + remainder.join(' '));
                    }

                    remainder.splice(0, 0, section.pop());
                }

                results.push(section.join(' '));
                return splitToFit(remainder.join(' '));
            }

            results.push(text);
        };

        splitToFit(text);
        this.writeLines(results, writeOptions, strokeOptions);
        return this;
    }

    /**
     * Writes and wraps multiple lines of text by whitespace.
     * @param {string|Array} lines Lines to write, either in an array or separated by newlines.
     * @param {number} maxWidth Maximum text width.
     * @param {WriteOptions} writeOptions Options for the drawing of the text.
     * @param {StrokeOptions} strokeOptions Options for the stroke of the text.
     * @return This CanvasWriter.
     */
    writeWordWrappedLines(lines, maxWidth = this.canvas.width, writeOptions = {}, strokeOptions){
        let texts = lines;
        if (typeof texts === 'string') texts = texts.split('\n').map(t => !t ? '\n' : t);

        texts.forEach(t => this.writeWordWrapped(t, maxWidth, writeOptions, strokeOptions));
        return this;
    }

    /**
     * Shortcut to writeWordWrappedLines().
     * @param {string|Array} lines Lines to write, either in an array or separated by newlines.
     * @param {number} maxWidth Maximum text width.
     * @param {WriteOptions} writeOptions Options for the drawing of the text.
     * @param {StrokeOptions} strokeOptions Options for the stroke of the text.
     * @return This CanvasWriter.
     */
    write(lines, maxWidth = this.canvas.width, writeOptions = {}, strokeOptions){
        return this.writeWordWrappedLines(lines, maxWidth, writeOptions, strokeOptions);
    }

    /**
     * Checks if the text fits on the Canvas.
     * @param {string} xOrY Whether to check 'x' or 'y', leave blank for both.
     * @return Whether or not text fits.
     */
    isFitting(xOrY){
        if (xOrY === 'x') return this.rangeX[1] < this.canvas.width || this.rangeX[0] > 0;
        if (xOrY === 'y') return this.rangeY[1] < this.canvas.height || this.rangeY[0] > 0;

        return this.rangeX[1] < this.canvas.width
            || this.rangeX[0] > 0
            || this.rangeY[1] < this.canvas.height
            || this.rangeY[0] > 0;
    }

    /**
     * Clones the text drawn on the given CanvasWriter to this one.
     * @param {CanvasWriter} canvasWriter CanvasWriter to clone from.
     * @param {number} limit How many lines to clone.
     * @return This CanvasWriter.
     */
    cloneFrom(canvasWriter, limit = canvasWriter.texts.length){
        let toClone = canvasWriter.texts.slice(0, limit);

        toClone.forEach(t => {
            this.writeText(t.text, t.writeOptions, t.strokeOptions);
        });

        return this;
    }

    /**
     * Clones the text drawn on the given CanvasWriter to this one with the given options.
     * @param {CanvasWriter} canvasWriter CanvasWriter to clone from.
     * @param {number} limit How many lines to clone.
     * @param {WriteOptions} writeOptions Options for the drawing of the text.
     * @param {StrokeOptions} strokeOptions Options for the stroke of the text.
     * @return This CanvasWriter.
     */
    cloneWith(canvasWriter, limit = canvasWriter.texts.length, writeOptions, strokeOptions){
        let toClone = canvasWriter.texts.slice(0, limit);

        toClone.forEach(t => {
            this.writeText(t.text, writeOptions, strokeOptions);
        });

        return this;
    }

    /**
     * Gets the DataURL of the image.
     * @param {string} type Type of image.
     * @param {object} options Image options.
     * @return A Promise with the DataURL.
     */
    dataURL(type = 'image/png', options = {}){
        return new Promise((resolve, reject) => {
            this.canvas.toDataURL(type, options, (err, url) => {
                if (err) return reject(err);
                resolve(url);
            });
        });
    }

    /**
     * Gets the Buffer of the image.
     * @return A Promise with the Buffer.
     */
    buffer(){
        return new Promise((resolve, reject) => {
            this.canvas.toBuffer((err, buffer) => {
                if (err) return reject(err);
                resolve(buffer);
            });
        });
    }

    /**
     * Saves the Canvas as a file.
     * @param {string} path Path to save to.
     * @param {object} options Options for fs.writeFile().
     * @return A Promise with error or path.
     */
    saveFile(path, options){
        return new Promise((resolve, reject) => {
            this.buffer().then(buffer => {
                fs.writeFile(path, buffer, options, err => {
                    if (err) reject(err);
                    resolve(path);
                });
            });
        });
    }

    /**
     * toString() overwrite.
     * @return The text written on this CanvasWriter.
     */
    toString(){
        return this.texts.map(t => t.text).join('\n');
    }
}

module.exports = CanvasWriter;