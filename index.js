const fs = require('fs');
const WordChange = require('./WordChange.js');


const dictionary = fs.readFileSync('dic/2.txt').toString().split("\r\n");

let ob = new WordChange(dictionary, 'if', 'he');

console.log(ob.findPath());