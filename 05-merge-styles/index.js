const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');

(async function mergeStyles() {
  await fs.writeFile(
    path.join(__dirname, 'project-dist', 'bundle.css'),
    '',
    () => {
      console.log('File created');
    },
  );

  await fs.promises
    .readdir(path.join(__dirname, 'styles'), { withFileTypes: true })
    .then(async (folder) => {
      for (let file of folder) {
        if (file.isFile()) {
          const filePath = path.join(stylesPath, file.name);
          const isCss = path.extname(file.name).slice(1);
          if (isCss === 'css') {
            fs.readFile(filePath, (err, data) => {
              if (err) throw err;
              let innerData = data;
              fs.appendFile(
                path.join(__dirname, 'project-dist', 'bundle.css'),
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
})();
