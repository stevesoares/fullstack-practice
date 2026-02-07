const [major, minor] = process.versions.node.split(".").map(Number);

const minMajor = 18;
const minMinor = 17;

const isSupported = major > minMajor || (major === minMajor && minor >= minMinor);

if (!isSupported) {
  console.error(
    `Unsupported Node.js ${process.versions.node}. Project Amelia requires Node.js >= ${minMajor}.${minMinor}.0.`
  );
  console.error("Run: source ~/.nvm/nvm.sh && nvm use");
  process.exit(1);
}
