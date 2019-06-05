let fs = require('fs');

function neighbors(root) {  
  const regex = new RegExp(`${root[0]}(?![${root[1]}])[a-z]|(?!${root[0]})[a-z]${root[1]}`);
  const matches = [];
  dictionary.forEach(function (word) {
    if(word.match(regex)) {
      matches.push(word);
    }
  });

  matches.forEach(w => {
    let i = dictionary.indexOf(w);
    dictionary.splice(i,1);
  })
  return matches;
}

const dictionary = fs.readFileSync('dic/2.txt').toString().split("\r\n");

const start = 'is';
const end = 'if';

const queue = [ [start] ];
let found = false;

// remove start word from dic.
const startIndex = dictionary.indexOf(start);
if(startIndex) dictionary.splice(startIndex, 1);

while(queue.length && !found) {
  const chain = queue.pop();
  const lastInChain = chain.slice(-1)[0];
  const lastInChainNeighbors = neighbors(lastInChain);

  lastInChainNeighbors.forEach(newWord => {
    
    queue.push([...chain, newWord ]);
    
    if (newWord === end) {
      found = true;
      console.table(queue.slice(-1)[0]);
    }
  });
}
