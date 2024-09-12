const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Define the directory containing images
const inputDir = './'; // Change this to your directory containing PNG and GIF images
const outputDir = './out'; // Change this to your desired output directory

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Read all files from the input directory
fs.readdir(inputDir, (err, files) => {
  if (err) {
    console.error(`Error reading the input directory: ${err}`);
    return;
  }

  // Filter files to include only PNG and GIF
  const imageFiles = files.filter(file => /\.(png|gif|webp)$/i.test(file));

  // Create a map to track the preferred files
  const preferredFiles = new Map();

  // Rename .gif with a .png extension to an actual .gif
  // imageFiles.forEach(file => {

  //   const inputFilePath = path.join(inputDir, file);
  //   const ext = path.extname(inputFilePath);
  //   const baseName = path.basename(inputFilePath, ext);
  //   // Open the file as a buffer
  //   const fileBuffer = fs.readFileSync(inputFilePath);

  //   // Convert the first few bytes to hexadecimal format
  //   const fileSignature = fileBuffer.toString('hex', 0, 4);

  //   // Check the file signature against known formats
  //   if (fileSignature === '89504e47') {
  //     console.log(`${inputFilePath} is a PNG file. No need to rename.`);
  //   } else if (fileSignature === '47494638') {
  //     console.log(`${inputFilePath} is a GIF file`);

  //     // If the file has a .png extension, rename it to .gif
  //     if (ext !== '.gif') {
  //       const newFilePath = path.join(inputDir, `${baseName}.gif`);
  //       fs.renameSync(inputFilePath, newFilePath);
  //       console.log(`Renamed to: ${newFilePath}`);
  //     } else {
  //       console.log(`File is already a .gif, no need to rename.`);
  //     }
  //   } else {
  //     console.log(`${inputFilePath} has an unknown file format`);
  //   }
  // })

  imageFiles.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    const baseName = path.basename(file, ext);
    if (ext === '.webp') {
      preferredFiles.set(baseName, file);
    }
    else if (ext === '.gif' && !preferredFiles.has(baseName)) {
      // Prefer GIF if it exists
      preferredFiles.set(baseName, file);
    } else if (ext === '.png' && !preferredFiles.has(baseName)) {
      // Only add PNG if there is no GIF with the same name
      preferredFiles.set(baseName, file);
    }
  });

  // Convert each preferred image to WebP
  preferredFiles.forEach((file, baseName) => {
    const inputFilePath = path.join(inputDir, file);
    const outputFilePath = path.join(outputDir, `${baseName}.webp`);

    sharp(inputFilePath, { animated: inputFilePath.endsWith('.gif') || inputFilePath.endsWith('.webp') })
      .toFormat('webp')
      .toFile(outputFilePath, (err, info) => {
        if (err) {
          console.error(`Error converting file ${file}: ${err}`);
        } else {
          console.log(`Converted ${file} to WebP format`);
        }
      });
  });
});