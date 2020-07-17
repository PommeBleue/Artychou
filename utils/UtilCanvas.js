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

module.exports.centerImagePart = (data, maxWidth, maxHeight, widthOffset, heightOffest) => {
    let { width, height } = data;
    if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height *= ratio;
    }
    if (height > maxHeight) {
        const ratio = maxHeight / height;
        height = maxHeight;
        width *= ratio;
    }
    const x = widthOffset + ((maxWidth / 2) - (width / 2));
    const y = heightOffest + ((maxHeight / 2) - (height / 2));
    return { x, y, width, height };
};