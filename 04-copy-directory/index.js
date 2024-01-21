const fs = require('fs');
const path = require('path');

(async function makeDirectory() {
  const exist = await fs.promises
    .access(path.join(__dirname, 'files-copy'))
    .then(() => true)
    .catch(() => false);
  if (exist) {
    await fs.promises.rm(path.join(__dirname, 'files-copy'), {
      recursive: true,
      force: true,
    });
  }
  await fs.promises
    .mkdir(path.join(__dirname, 'files-copy'), {
      recursive: true,
    })
    .then(() => {
      readFile();
    });
})();

async function readFile() {
  await fs.promises
    .readdir(path.join(__dirname, 'files'), { withFileTypes: true })
    .then((data) => {
      for (let element of data) {
        if (element.isFile()) {
          const pathOriginal = path.join(__dirname, 'files', element.name);
          const pathCopyFile = path.join(__dirname, 'files-copy', element.name);
          fs.promises.copyFile(pathOriginal, pathCopyFile);
        }
      }
    });
}
