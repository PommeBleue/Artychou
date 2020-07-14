/**
 * @description ??
 * @param ctx
 * @param image
 * @param color
 * @param x
 * @param y
 * @param width
 * @param height
 */
module.exports.drawImageWithTint = (ctx, image, color, x, y, width, height) => {
    const {fillStyle, globalAlpha} = ctx;
    ctx.fillStyle = color;
    ctx.drawImage(image, x, y, width, height);
    ctx.globalAlpha = 0.5;
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = fillStyle;
    ctx.globalAlpha = globalAlpha;
};

module.exports.shortenText = (ctx, text, maxWidth) => {
    let shorten = false;
    while (ctx.measureText(`${text}...`).width > maxWidth) {
        if (!shorten) shorten = true;
        text = text.substr(0, text.length - 1);
    }
    return shorten ? `${text}...` : text;
};