const fs = require('fs');
const path = require('path');

fs.writeFile(path.join(__dirname, 'text.txt'), '', () => {
  console.log('Hello!');
});

const { stdout, stdin, exit } = process;
function writeBye() {
  stdout.write('\nGoodbye');
  exit();
}
stdout.write('Write down your text:\n');
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
