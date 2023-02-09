/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {string[]}
 */
const wordBreak = function (s, wordDict) {
  const results = [];

  const words = new Words(wordDict);
  const chains = words.createChains(s);
  const sentences = new Sentences([]);

  chains.forEach((chain) => {
    sentences.addSentence(new Sentence(sentences.sentences, [], chain));
  });

  sentences.sentences.forEach((sentence) => {
    const result = sentence.build();
    if (result) {
      results.push(result);
    }
  });

  return results;
};

class Words {
  words;

  constructor(words) {
    this.words = words;
  }

  checkWord(str, words) {
    let foundWord = null;
    let remainingStr;
    for (let word of words) {
      if (str.indexOf(word) === 0) {
        foundWord = word;
        remainingStr = str.substring(word.length);
        break;
      }
    }

    return [foundWord, remainingStr];
  }

  createChains(str) {
    const chains = [];
    this.words.forEach((word) => {
      if (str.indexOf(word) === 0) {
        chains.push(
          new Word(this.words, word, null, str.substring(word.length))
        );
      }
    });

    return chains;
  }
}

class Word extends Words {
  word;
  prev;
  next = [];
  remaining;

  constructor(words, word, prev, remaining) {
    super(words);
    this.word = word;
    this.prev = prev;
    this.remaining = remaining;
    if (this.remaining) {
      this.createNextWords();
    }
  }

  createNextWords() {
    const testWords = [...this.words];
    while (testWords.length) {
      const [word, remaining] = this.checkWord(this.remaining, testWords);
      testWords.splice(testWords.indexOf(word), 1);
      if (!word) {
        continue;
      }
      this.next.push(new Word(this.words, word, this, remaining));
    }
  }
}

class Sentences {
  sentences;

  constructor(sentences) {
    this.sentences = sentences;
  }

  addSentence(sentence) {
    this.sentences.push(sentence);
  }
}

class Sentence extends Sentences {
  words;
  remaining;

  constructor(sentences, words, chain) {
    super(sentences);
    this.words = words;
    this.addWord(chain.word);
    let nextInChain = chain.next;
    this.remaining = chain.remaining;
    while (nextInChain.length) {
      if (nextInChain.length > 1) {
        for (let i = 1; i < nextInChain.length; i++) {
          this.addSentence(
            new Sentence(this.sentences, [...this.words], nextInChain[i])
          );
        }
      }
      this.addWord(nextInChain[0].word);
      this.remaining = nextInChain[0].remaining;
      nextInChain = nextInChain[0].next;
    }
  }

  addWord(word) {
    this.words.push(word);
  }

  build() {
    if (this.remaining) {
      return null;
    }
    return this.words.join(" ");
  }
}

(function main() {
  console.log(
    wordBreak("pineapplepenapple", [
      "apple",
      "pen",
      "applepen",
      "pine",
      "pineapple",
    ])
  );
})();

// OLD CODE WHEN FIRST TRYING TO SOLVE IT (NOT FULLY WORKING)
//
//
//
// /**
//  * @param {string} s
//  * @param {string[]} wordDict
//  * @return {string[]}
//  */
// const wordBreak = function (s, wordDict) {
//   return composeGivenStr(s, wordDict);
// };

// function composeGivenStr(str, wordArr) {
//   const template = [];
//   let indexCounter = 0;
//   let testStr = str;
//   while (indexCounter < str.length) {
//     [indexCounter, testStr] = checkWordIntegrity(
//       wordArr,
//       testStr,
//       indexCounter,
//       template
//     );

//     if (indexCounter === -1) {
//       break;
//     }
//   }

//   return template.length > 0 ? template.join(" ") : null;
// }

// function checkWordIntegrity(wordArr, str, indexCounter, template) {
//   let counter = indexCounter;
//   let testStr = str;
//   for (let word of wordArr) {
//     if (str.indexOf(word) === 0) {
//       template.push(word);
//       testStr = testStr.substring(word.length);
//       counter += word.length;
//       break;
//     }
//   }

//   if (counter === indexCounter) {
//     counter = -1;
//   }

//   return [counter, testStr];
// }

// (function main() {
//   console.log(
//     wordBreak("pineapplepenapple", [
//       "apple",
//       "pen",
//       "applepen",
//       "pine",
//       "pineapple",
//     ])
//   );
// })();
