const path = require('path');
const fs = require('fs');

const JASMINE_FILENAME = './node_modules/@jest/core/node_modules/jest-jasmine2/build/index.js';
const LOOK_FOR = 'const esm = runtime.unstable_shouldLoadAsEsm';
const REPLACE_WITH = 'const esm = false; // runtime.unstable_shouldLoadAsEsm';

const filePath = path.join(process.cwd(), JASMINE_FILENAME);
let fileStr = fs.readFileSync(filePath, {
  encoding: "utf8"
});
const regex = new RegExp(LOOK_FOR, "g");
fileStr = fileStr.replace(regex, REPLACE_WITH);
fs.writeFileSync(filePath, fileStr, {
  encoding: "utf8"
});