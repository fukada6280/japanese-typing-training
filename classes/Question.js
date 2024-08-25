class Question {
    constructor(sentence, furigana, romaji = "", kpm = 0.0, accuracy = 0.0) {
      this.sentence = sentence; // 恋愛
      this.furigana = furigana; // れんあい
  
      // 問題回答後に分かる情報
      this.romaji = romaji; // rennai
      this.kpm = kpm;
      this.accuracy = accuracy;
    }
  }
  