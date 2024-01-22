const fs = require('fs');
const path = require('path');

(async function writeFile() {
  await fs.promises.writeFile(path.join(__dirname, 'text.txt'), '');

const { stdout, stdin, exit } = process;
function writeBye() {
  stdout.write('\nGoodbye');
  exit();
}
stdout.write('Hello! Write down your text:\n');
stdin.on('data', (data) => {
  if (data.toString() === 'exit\n') {
    writeBye();
  }
  fs.appendFile(path.join(__dirname, 'text.txt'), data, (err) => {
    if (err) throw err;
    fs.readFile(path.join(__dirname, 'text.txt'), 'utf-8', (err) => {
      if (err) throw err;
    });
  });
});

process.on('SIGINT', writeBye);
})()
