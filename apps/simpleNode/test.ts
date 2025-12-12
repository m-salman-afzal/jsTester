import fs from "fs";

import sharp from "sharp";

import inspirations from "./enhanced_inspirations.json" with {type: "json"};

const dimensions = async (imageBuffer: Buffer) => {
    const meta = await sharp(imageBuffer).metadata();

    return {
        width: meta.width,
        height: meta.height,
        format: meta.format
    };
};

// Fetch original image from CDN
for (const inspiration of inspirations) {
    const inputImagesPromises = inspiration.input_images.map((img) => fetch(img));
    const allImages = await Promise.all([fetch(inspiration.image), ...inputImagesPromises]);
    // if (!mainImage.ok) throw new Error("Failed to fetch image");

    for (const [index, img] of allImages.entries()) {
        const buffer = await img.arrayBuffer();
        const imageBuffer = Buffer.from(buffer);
        const {width, height} = await dimensions(imageBuffer);
        const optimized = await sharp(imageBuffer)
            .resize({
                width: Number((width * 0.5).toFixed(0)),
                height: Number((height * 0.5).toFixed(0)),
                withoutEnlargement: true
            })
            .webp({quality: 85})
            .toBuffer();

        const optimizedBuffer = Buffer.from(optimized);

        const imageName =
            index === 0
                ? inspiration.image.split("/").pop()?.split(".")[0]
                : inspiration.input_images[index - 1]?.split("/").pop()?.split(".")[0];
        if (!imageName) continue;
        fs.mkdirSync(`./${inspiration.category}`, {recursive: true});
        fs.writeFileSync(`./${inspiration.category}/${imageName}_w-50p_h-50p_q-85.webp`, optimizedBuffer);
    }
}
