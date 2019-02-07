const fs = require("fs");
const path = require("path");

function now() {
  return `[${new Date().toLocaleString()}]`;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getAllFiles(dir) {
  return fs.readdirSync(dir).reduce((files, file) => {
    const name = path.join(dir, file);
    const isDirectory = fs.statSync(name).isDirectory();
    return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name];
  }, []);
}

module.exports = { getAllFiles, now, sleep };
