import fs from "fs/promises";
import path from "path";

// Get the file path
const getFilePath = (fileName) => path.join(process.cwd(), "data", fileName);

// Read JSON file
export async function readJSON(fileName) {
  try {
    const filePath = getFilePath(fileName);
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error);
    return null;
  }
}

// Write JSON file
export async function writeJSON(fileName, data) {
  try {
    const filePath = getFilePath(fileName);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${fileName}:`, error);
  }
}
