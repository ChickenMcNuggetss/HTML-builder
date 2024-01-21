const fs = require("fs");
const path = require("path");

const newPath = path.join(__dirname, "secret-folder");

fs.promises.readdir(
  newPath,
  {withFileTypes: true}
).then(
  (data) => {
    for (let el of data) {
      if (el.isFile()) {
      const filePath = path.join(newPath, el.name);
      fs.promises.stat(filePath).then((info) => {
        console.log(`${el.name.slice(0, el.name.indexOf("."))} - ${path.extname(el.name).slice(1)} - ${info.size/1024} kb`);
      });
      }
    }
  }
)
