/**
 * optimizeAndGenerateTags.js
 *
 * - Optimizes images (creates multiple .webp sizes if original is bigger).
 * - Generates <img> tags with srcset, lazy loading, and async decoding.
 * - Logs all <img> tags to the console for easy copy & paste into your HTML.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Directories
const INPUT_DIR = path.join(__dirname, 'assets', 'images');
const OUTPUT_DIR = path.join(__dirname, 'assets', 'images', 'optimized');

// Desired widths for responsive images
const TARGET_SIZES = [300, 768, 1024, 1536, 2048];

// Responsive sizes attribute
const SIZES_ATTR =
  '(max-width: 300px) 300px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, (max-width: 1536px) 1536px, 2048px';

// Quality setting for .webp output (adjust to taste)
const WEBP_QUALITY = 80;

async function optimizeAndGenerateTags() {
  // 1. Ensure the output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // 2. Read all files from the input directory
  const files = fs.readdirSync(INPUT_DIR);

  // We'll store which widths were generated for each base filename
  // Example: { "example": [300, 768, 1024], "another_image": [768, 1024] }
  const imageMap = {};

  // 3. Iterate over each file in `assets/images`
  for (const file of files) {
    const inputFilePath = path.join(INPUT_DIR, file);

    // Skip directories or non-image files
    let metadata;
    try {
      metadata = await sharp(inputFilePath).metadata();
    } catch (err) {
      // Not a valid image or some error reading metadata
      console.log(`Skipping file (not an image or unreadable): ${file}`);
      continue;
    }

    // Derive a friendly "base name" from the original file
    // e.g., "example.jpg" -> base = "example"
    const { name: baseName } = path.parse(file);

    // Prepare an array of widths actually generated
    const generatedWidths = [];

    // If the image is *smaller* than 300px in width,
    // generate just one .webp at its original size
    if (metadata.width < 300) {
      const outputFilePath = path.join(
        OUTPUT_DIR,
        `${baseName}-${metadata.width}.webp`
      );

      // Convert & keep same width
      await sharp(inputFilePath)
        .webp({ quality: WEBP_QUALITY })
        .toFile(outputFilePath);

      generatedWidths.push(metadata.width);
      console.log(`Created (original size): ${outputFilePath}`);
    } else {
      // For each target size, only generate if original is bigger
      for (const size of TARGET_SIZES) {
        if (metadata.width > size) {
          const outputFilePath = path.join(
            OUTPUT_DIR,
            `${baseName}-${size}.webp`
          );

          await sharp(inputFilePath)
            .resize({ width: size })
            .webp({ quality: WEBP_QUALITY })
            .toFile(outputFilePath);

          generatedWidths.push(size);
          console.log(`Created: ${outputFilePath}`);
        }
      }
    }

    // Store widths in our map (sort ascending to make building srcset easier)
    if (generatedWidths.length > 0) {
      generatedWidths.sort((a, b) => a - b);
      imageMap[baseName] = generatedWidths;
    }
  }

  // 4. Generate <img> tags for each baseName -> widths array
  console.log('\n--- Responsive <img> Tags (copy/paste) ---\n');

  for (const [baseName, widths] of Object.entries(imageMap)) {
    // The "default" src is the smallest .webp we generated
    const defaultSrc = `assets/images/optimized/${baseName}-${widths[0]}.webp`;

    // Build a srcset string, e.g.: "<file>-300.webp 300w, <file>-768.webp 768w, ..."
    const srcset = widths
      .map((w) => `assets/images/optimized/${baseName}-${w}.webp ${w}w`)
      .join(', ');

    // Generate a simple alt text from the name
    // E.g., "my-cool-photo" -> "my cool photo"
    const altText = baseName.replace(/[-_]/g, ' ');

    // Create the <img> tag
    // Notice the lazy loading, async decoding, and standard sizes attribute
    const imgTag = `
<img
  src="${defaultSrc}"
  srcset="${srcset}"
  sizes="${SIZES_ATTR}"
  loading="lazy"
  decoding="async"
  alt="${altText}"
/>
    `.trim();

    console.log(imgTag, '\n');
  }

  console.log('--- End of Generated <img> Tags ---');
}

optimizeAndGenerateTags().catch((err) => {
  console.error(err);
  process.exit(1);
});
