class JapaneseTypingGame {
  constructor(questionManager) {
    this.questionManager = questionManager;
    this.previousQuestions = [];
    this.userInput = "";
    this.visibleRomaji = false;
    this.visibleFurigana = true;
    this.visibleOmoji = false;
    this.keyTimingTracker = new KeyTimingTracker(20);

    this.nextQuestion = this.questionManager.createQuestion();
    this.loadNextQuestion();
  }

  update() {
    this.keyTimingTracker.update();
    this.draw();
  }

  keyPressed(key, keyCode) {
    if (keyCode === SHIFT || 
        keyCode === CONTROL || 
        keyCode === ALT || 
        keyCode === UP_ARROW || 
        keyCode === DOWN_ARROW || 
        keyCode === LEFT_ARROW || 
        keyCode === RIGHT_ARROW || 
        keyCode === ENTER || 
        (keyCode >= 112 && keyCode <= 123)) {
      return;
    }

    // 以後 key のみ使用
    if (key === "Backspace") {
      if (this.userInput.length > 0) {
        this.userInput = this.userInput.substring(0, this.userInput.length - 1);
      }
    } else {
      let isCorrectInput = false;
      let endOfSentence = false;
      this.userInput += key;

      if (this.isValidInput(this.userInput)) {
        isCorrectInput = true;
        if (this.isCorrectAnswer(this.userInput)) {
          endOfSentence = true;
          const kpm = this.keyTimingTracker.calculateRecentKPM();
          const accuracy = this.keyTimingTracker.calculateRecentAccuracy();
          const question = new Question(this.currentQuestion.sentence, this.currentQuestion.furigana, this.userInput, kpm, accuracy);
          this.previousQuestions.push(question);
          this.loadNextQuestion();
        }
      } else {
        this.userInput = this.userInput.substring(0, this.userInput.length - 1);
      }

      this.keyTimingTracker.keyPressed(key, isCorrectInput, endOfSentence);
      this.updateCurrentRomajiDisplay();
    }
  }

  loadNextQuestion() {
    this.currentQuestion = this.nextQuestion;
    this.userInput = "";
    this.currentAnswers = this.questionManager.convertToRomajiList(this.currentQuestion.furigana);
    this.currentRomajiDisplay = this.currentAnswers[0];
    this.nextQuestion = this.questionManager.createQuestion();
  }

  updateCurrentRomajiDisplay() {
    let bestMatch = null;
    let bestMatchLength = 0;

    for (let answer of this.currentAnswers) {
      let matchLength = 0;
      for (let i = 0; i < this.userInput.length && i < answer.length; i++) {
        if (this.userInput.charAt(i) === answer.charAt(i)) {
          matchLength++;
        } else {
          break;
        }
      }
      if (matchLength > bestMatchLength) {
        bestMatch = answer;
        bestMatchLength = matchLength;
      }
    }

    if (bestMatch !== null) {
      this.currentRomajiDisplay = bestMatch;
    }
  }

  isValidInput(input) {
    for (let answer of this.currentAnswers) {
      if (answer.startsWith(input)) {
        return true;
      }
    }
    return false;
  }

  isCorrectAnswer(input) {
    for (let answer of this.currentAnswers) {
      if (answer === input) {
        return true;
      }
    }
    return false;
  }

  draw() {
    textAlign(CENTER, CENTER); // 基準を中央に
    const positionX = width / 2.0;
  
    // 問題文の表示
    fill(0, 0, 0, 100);
    textSize(32);
    text(this.currentQuestion.sentence, positionX, 200);
  
    // 下線を表示
    stroke(0, 0, 80, 100);
    const currentInterval = textWidth("想定する定型文長さです") / 2.0;
    line(width / 2 - currentInterval, 225, width / 2 + currentInterval, 225);
  
    if (this.visibleFurigana) {
      // ふりがな表記を追加
      textSize(18);
      text(this.currentQuestion.furigana, positionX, 170);
    }
  
    // 入力部の表示
    textSize(20);
    if (this.visibleOmoji) {
      this.drawText(this.userInput.toUpperCase(), this.currentRomajiDisplay.toUpperCase(), positionX, 240);
    } else {
      this.drawText(this.userInput, this.currentRomajiDisplay, positionX, 240);
    }
  
    // 前回問題の表示
    if (this.previousQuestions.length > 0) {
      const lastQuestion = this.previousQuestions[this.previousQuestions.length - 1];
      textAlign(CENTER, CENTER);
      fill(0, 0, 20, 100);
      textSize(12);
      text(lastQuestion.furigana, 120, 290);
      textSize(18);
      text(lastQuestion.sentence, 120, 310);
  
      stroke(0, 0, 80, 100);
      const prevInterval = textWidth("想定する定型文長さです") / 2.0;
      line(120 - prevInterval, 330, 120 + prevInterval, 330);
  
      text(`KPM: ${int(lastQuestion.kpm)}`, 120, 350);
      text(`正答率: ${int(lastQuestion.accuracy)}%`, 120, 370);
    }
  
    // Next問題の表示
    fill(0, 0, 20, 100);
    textAlign(CENTER, CENTER);
    textSize(12);
    text(this.nextQuestion.furigana, width-120, 290);
    textSize(18);
    text(this.nextQuestion.sentence, width-120, 310);
  
    // 下線を引く
    stroke(0, 0, 80, 100);
    const nextInterval = textWidth("想定する定型文長さです") / 2.0;
    line(width - 120 - nextInterval, 330, width - 120 + nextInterval, 330);
  }
  
  drawText(input, answer, centerX, centerY) {
    /* 正解と入力の両方を重ねて表示する関数 */
    textAlign(LEFT, CENTER);
    fill(0, 0, 70, 100);
    text(answer, centerX - textWidth(answer) / 2.0, centerY); // 正解表示
    fill(0, 0, 0, 100);
    text(input, centerX - textWidth(answer) / 2.0, centerY); // 入力表示
  }

  saveHistoryToCSV() {
    this.keyTimingTracker.saveHistoryToCSV();
  }
}


