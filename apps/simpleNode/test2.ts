import fs from "fs";

import sharp from "sharp";

const dimensions = async (imageBuffer: Buffer) => {
    const meta = await sharp(imageBuffer).metadata();

    return {
        width: meta.width,
        height: meta.height,
        format: meta.format
    };
};

const imageUrls = [
    "https://cdn.chatly.imagine.art/chatly-web/images/image-gen-dashboard/images/presets/poster-1.webp",
    "https://cdn.chatly.imagine.art/chatly-web/images/image-gen-dashboard/images/presets/product-1.webp",
    "https://cdn.chatly.imagine.art/chatly-web/images/image-gen-dashboard/images/presets/social-media-1.webp",
    "https://cdn.chatly.imagine.art/chatly-web/images/image-gen-dashboard/images/presets/cards-1.webp",
    "https://cdn.chatly.imagine.art/chatly-web/images/image-gen-dashboard/images/presets/character-1.webp",
    "https://cdn.chatly.imagine.art/chatly-web/images/image-gen-dashboard/images/presets/comic-1.webp",
    "https://cdn.chatly.imagine.art/chatly-web/images/image-gen-dashboard/images/presets/logo-1.webp",
    "https://cdn.chatly.imagine.art/chatly-web/images/image-gen-dashboard/images/presets/sticker-1.webp",
    "https://cdn.chatly.imagine.art/chatly-web/images/image-gen-dashboard/images/presets/wallpaper-1.webp",
    "https://cdn.chatly.imagine.art/chatly-web/images/image-gen-dashboard/images/presets/home-1.webp"
];
// Fetch original image from CDN
for (const image of imageUrls) {
    const downloadedImage = await fetch(image);
    const buffer = await downloadedImage.arrayBuffer();
    const imageBuffer = Buffer.from(buffer);
    const {width, height} = await dimensions(imageBuffer);
    const optimized = await sharp(imageBuffer)
        .resize({
            width: Number((width * 0.5).toFixed(0)),
            height: Number((height * 0.5).toFixed(0)),
            withoutEnlargement: true
        })
        .webp({quality: 75})
        .toBuffer();

    const optimizedBuffer = Buffer.from(optimized);

    const imageName = image.split("/").pop()?.split(".")[0]?.split("-").slice(0, -1).join("-");
    if (!imageName) continue;
    fs.mkdirSync(`./optimized_images`, {recursive: true});
    fs.writeFileSync(`./optimized_images/${imageName}-3.webp`, optimizedBuffer);
}
