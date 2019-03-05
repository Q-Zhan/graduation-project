const fs = require('fs');
const readline = require('readline')
const path = require('path')

module.exports = function readCensorWord() {
  return new Promise((resolve, reject) => {
    let fRead = fs.createReadStream(path.resolve(__dirname, '../constant/CensorWords.txt'));
    let objReadline = readline.createInterface({
      input: fRead
    });
    let arr = [];
    objReadline.on('line', function (line) {
      arr.push(line);
    });
    objReadline.on('close', function () {
      resolve(arr)
    });
  })
  
}