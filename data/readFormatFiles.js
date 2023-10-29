const fs = require('fs/promises');

async function readFormatFiles() {
  const allGuidelines = [];
  const fileNames = await fs.readdir(`${__dirname}/guideline-data`);

  for (let i = 0; i < fileNames.length; i++) {
    const fileContents = await fs.readFile(
        `${__dirname}/guideline-data/${fileNames[i]}`,
        'utf-8',
    );

    const parsedContents = JSON.parse(fileContents);

    allGuidelines.push(parsedContents);
  }

  return allGuidelines;
}

module.exports = readFormatFiles;
