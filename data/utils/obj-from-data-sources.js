import fs from 'fs';
import csv from 'csvtojson';

const dirname = process.cwd();

export async function getObjFromLocalCsvFile(file) {
  const inputFilename = `${dirname}/${file}`;
  const content = await csv().fromFile(inputFilename);
  return content;
}

export async function getObjFromLocalJsonFile(file) {
  const inputFilename = `${dirname}/${file}`;
  const content = await fs.promises.readFile(inputFilename, 'utf-8');
  return JSON.parse(content);
}

export async function writeJsonToFile(file, obj) {
  const outputFilename = `${dirname}/${file}`;
  await fs.promises.writeFile(outputFilename, JSON.stringify(obj), 'utf-8');
}
