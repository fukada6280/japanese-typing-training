// 問題の作成と管理を行うクラス
class QuestionManager {
    constructor(hiraganaTable, questionsTable) {
      this.hiraganaMap = this.loadHiraganaMap(hiraganaTable);
      this.questionsTable = questionsTable;
    }
  
    loadHiraganaMap(hiraganaTable) {
      const hiraganaMap = new Map();
  
      for (let i = 0; i < hiraganaTable.getRowCount(); i++) {
        const row = hiraganaTable.getRow(i);
        const hiragana = row.getString(0); // ひらがな文字
        const romajiList = [];
  
        for (let j = 1; j < row.arr.length; j++) {
          const value = row.getString(j);
          if (value && value !== "") {
            romajiList.push(value);
          }
        }
  
        hiraganaMap.set(hiragana, romajiList);
      }
  
      return hiraganaMap;
    }
  
    createQuestion() {
      const rowCount = this.questionsTable.getRowCount();
      const currentQuestionIndex = Math.floor(random(rowCount));
      const questionRow = this.questionsTable.getRow(currentQuestionIndex);
  
      const sentence = questionRow.getString("表示");
      const furigana = questionRow.getString("ふりがな");
  
      if (!sentence || !furigana) {
        console.error("質問データの取得に失敗しました。");
        return new Question("", "");
      }
  
      return new Question(sentence, furigana);
    }
  
    convertToRomajiList(hiraganaText) {
      let romajiList = [""];  // 初期状態の空のローマ字リスト
  
      for (let i = 0; i < hiraganaText.length;) {
        let found = false;
  
        if (hiraganaText.charAt(i) === 'ん') {
          let newRomajiList = [];
          let followedByVowel = (i + 1 < hiraganaText.length) && "あいうえお".includes(hiraganaText.charAt(i + 1));
          for (let baseRomaji of romajiList) {
            if (followedByVowel) {
              newRomajiList.push(baseRomaji + "nn");
            } else {
              newRomajiList.push(baseRomaji + "n");
              newRomajiList.push(baseRomaji + "nn");
            }
          }
          romajiList = newRomajiList;
          i++;
          continue;
        }
  
        for (let j = 3; j > 0; j--) {
          if (i + j <= hiraganaText.length) {
            let hiraganaSubstr = hiraganaText.substring(i, i + j);
            if (this.hiraganaMap.has(hiraganaSubstr)) {
              let newRomajiList = [];
              let romajiCandidates = this.hiraganaMap.get(hiraganaSubstr);
  
              for (let baseRomaji of romajiList) {
                for (let romaji of romajiCandidates) {
                  newRomajiList.push(baseRomaji + romaji);
                }
              }
  
              romajiList = newRomajiList;
              i += j;
              found = true;
              break;
            }
          }
        }
  
        if (!found) {
          i++;
        }
      }
  
      if (hiraganaText.endsWith("ん")) {
        for (let i = 0; i < romajiList.length; i++) {
          let romaji = romajiList[i];
          if (romaji.endsWith("n")) {
            romajiList[i] = romaji + "n";
          }
        }
      }
  
      return romajiList;
    }
  }
  