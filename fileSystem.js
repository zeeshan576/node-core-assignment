const fs = require("node:fs/promises");
const path = require("node:path");

const filePath = path.join(__dirname, "data.txt");

async function writeFile(content) {
  await fs.writeFile(filePath, content, "utf8");
  return "File written successfully!";
}

async function readFile() {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      return "File does not exist yet.";
    }

    throw error;
  }
}

module.exports = { writeFile, readFile };
