const fs = require('fs');

class WordMorph{

  makeNeighborsRegex(root) {
    const length = root.length
    let regex = []
    if(length == 1) regex.push(`(?![${root}])[a-z]`);
    else if (length == 2) regex.push(`${root[0]}(?![${root[1]}])[a-z]|(?!${root[0]})[a-z]${root[1]}`);
    else {
      regex.push(`(?!${root[0]})[a-z]${root.slice(1, length)}`);
      regex.push(`${root.slice(0, length-1)}(?!${root.slice(-1)[0]})[a-z]`);
      for(let i = 0; i < length - 2 ; i++) {
        const before = root.slice(0, i+1);
        const not = root.slice(i+1 ,i+2);
        const after = root.slice(i+2, length)
        regex.push(`${before}(?!${not})[a-z]${after}`);
      }
    }

    return new RegExp(regex.join('|'));
  }

  neighbors(rootIndex, dictionary, visited) {
    const root = dictionary[rootIndex];
    const regex = this.makeNeighborsRegex(root);    
    const matches = [];
    dictionary.forEach((word, index) => {
      if (visited[index]) return;
      if (word.match(regex)) {
        matches.push(index);
        visited[index] = true;
      }
    });

  return matches;
  }

  morph(start, end, dictionary = null) {
    if(start.length !== end.length) return 'START and END words must be of the some length!.';
    
    if(dictionary === null) {
      const length = start.length;
      if(length < 2 || length > 12) return '2- to 12-letter words only!';
      dictionary = fs.readFileSync(`dic/${length}.txt`).toString().split("\r\n");
    }
    
		let startIndex = dictionary.indexOf(start);
		if(startIndex === -1) {
			dictionary.push(start);
			startIndex = dictionary.indexOf(start);
		}

		let endIndex = dictionary.indexOf(end);
		if(endIndex === -1) {
			dictionary.push(end);
			endIndex = dictionary.indexOf(end);
		}

    const visited = Array(dictionary.length).fill(false);
    const parents = Array(dictionary.length).fill(-1);

    visited[startIndex] = true;
    const queue = [startIndex];
    let found = false;

    while(!found && queue.length) {
      const wordIndex = queue.shift();
      const wordNeighborsIndices = this.neighbors(wordIndex, dictionary, visited);
      wordNeighborsIndices.forEach(neighborIndex => {
        parents[neighborIndex] = wordIndex;
        queue.push(neighborIndex);
        if (neighborIndex === endIndex) found = true;
      });
    }

    if(found) {
      let pathOfIndices = [];
      let currentIndex = endIndex;
      while(currentIndex !== -1) {
        pathOfIndices.push(currentIndex);
        currentIndex = parents[currentIndex];
      }
      
      pathOfIndices.reverse();
      return this.translateIndices(pathOfIndices, dictionary);
    }
    
    return [];
  }

  translateIndices(indices, dictionary) {
    const words = [];
    indices.forEach(i => {
      words.push(dictionary[i]);
    });

    return words;
  }

  clusters(input) {
    let dictionary;
    if(typeof input === 'number' && input >= 2 && input <= 12) {
      dictionary = fs.readFileSync(`dic/${input}.txt`).toString().split("\r\n");
    } else {
      dictionary = input;
    }
    
  }
}

module.exports = WordMorph;
