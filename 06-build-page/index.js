const fs = require('fs');
const path = require('path');

(async function buildPage() {
  await fs.promises.mkdir(path.join(__dirname, 'project-dist'), {
    recursive: true,
  });
  await changeTemplateTags();
  await mergeStyles();
  await copyAssets(
    path.join(__dirname, 'project-dist', 'assets'),
    path.join(__dirname, 'assets'),
  );
})();

async function changeTemplateTags() {
  await fs.promises.writeFile(
    path.join(__dirname, 'project-dist', 'index.html'),
    '',
  );
  const pathTemplateHTML = path.join(__dirname, 'template.html');
  const data = await fs.promises.readFile(pathTemplateHTML);
  await forTemplate(data);
}

async function forTemplate(data) {
  let dataText = data.toString();
  const folder = await fs.promises.readdir(path.join(__dirname, 'components'), {
    withFileTypes: true,
  });
  for (let file of folder) {
    const extensionHTML = path.extname(file.name).slice(1);
    if (file.isFile() && extensionHTML === 'html') {
      const innerFileData = await fs.promises.readFile(
        path.join(__dirname, 'components', file.name),
      );
      let fileData = innerFileData.toString();
      dataText = dataText.replace(
        `{{${file.name.slice(0, file.name.indexOf('.'))}}}`,
        fileData,
      );
    }
  }
  await fs.promises.writeFile(
    path.join(__dirname, 'project-dist', 'index.html'),
    dataText,
  );
}

async function mergeStyles() {
  const stylesPath = path.join(__dirname, 'styles');
  await fs.promises.writeFile(
    path.join(__dirname, 'project-dist', 'style.css'),
    '',
    (err) => {
      if (err) throw err;
    },
  );

  await fs.promises
    .readdir(path.join(__dirname, 'styles'), { withFileTypes: true })
    .then(async (folder) => {
      for (let file of folder) {
        if (file.isFile()) {
          const filePath = path.join(stylesPath, file.name);
          const extensionCss = path.extname(file.name).slice(1);
          if (extensionCss === 'css') {
            fs.readFile(filePath, (err, data) => {
              if (err) throw err;
              let innerData = data;
              fs.appendFile(
                path.join(__dirname, 'project-dist', 'style.css'),
                `${innerData}\n`,
                (err) => {
                  if (err) throw err;
                },
              );
            });
          }
        }
      }
    });
}

async function copyAssets(destination, source) {
  const exist = await fs.promises
    .access(destination)
    .then(() => true)
    .catch(() => false);
  if (exist) {
    await fs.promises.rm(destination, {
      recursive: true,
      force: true,
    });
  }
  await fs.promises
    .mkdir(destination, {
      recursive: true,
    })
    .then(() => {
      readFile(destination, source);
    });
}

async function readFile(destination, source) {
  await fs.promises.readdir(source, { withFileTypes: true }).then((data) => {
    for (let element of data) {
      const pathOriginal = path.join(source, element.name);
      const pathCopiedElement = path.join(destination, element.name);
      if (element.isFile()) {
        fs.promises.copyFile(pathOriginal, pathCopiedElement);
      }
      if (element.isDirectory()) {
        copyAssets(pathCopiedElement, pathOriginal);
      }
    }
  });
}
