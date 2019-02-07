function now() {
  return `[${new Date().toLocaleString()}]`;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { now, sleep };
