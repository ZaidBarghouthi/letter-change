class WordChange{
  constructor(dictionary, start, end) {
    this.dictionary = dictionary;
    this.startIndex = this.dictionary.indexOf(start);
    this.endIndex = this.dictionary.indexOf(end);
    this.visited = Array(this.dictionary.length).fill(false);
    this.parents = Array(this.dictionary.length).fill(-1);
  }

  unvisitedNeighbors(rootIndex) {
    const root = this.dictionary[rootIndex];  
    const regex = new RegExp(`${root[0]}(?![${root[1]}])[a-z]|(?!${root[0]})[a-z]${root[1]}`);
    
    const matches = [];
    this.dictionary.forEach((word, index) => {
      if (this.visited[index]) return;
    
      if (word.match(regex)) {
        matches.push(index);
        this.visited[index] = true;
      }
    });

  return matches;
  }

  findPath() {
    const queue = [this.startIndex];
    let found = false;
    this.visited[this.startIndex] = true;
    while(!found && queue.length) {
      const wordIndex = queue.shift();
      const wordNeighborsIndices = this.unvisitedNeighbors(wordIndex);
      wordNeighborsIndices.forEach(neighborIndex => {
        this.parents[neighborIndex] = wordIndex;
        queue.push(neighborIndex);
        if (neighborIndex === this.endIndex) found = true;
      });
    }

    if(found) {
      let pathOfIndices = [];
      let currentIndex = this.endIndex;
      while(currentIndex !== -1) {
        pathOfIndices.push(currentIndex);
        currentIndex = this.parents[currentIndex];
      }
      
      pathOfIndices.reverse();
      return this.translateIndices(pathOfIndices);
    } else {
      return [];
    }

  }

  translateIndices(indices) {
    const words = [];
    indices.forEach(i => {
      words.push(this.dictionary[i]);
    });

    return words;
  }
}


module.exports = WordChange;
