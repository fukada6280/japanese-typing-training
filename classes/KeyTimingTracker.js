class KeyTimingTracker {
    constructor(displaySize) {
        this.displaySize = displaySize; // 直近何個の履歴を表示するかのサイズ
        this.keyEntries = []; // 入力履歴を記録するリスト
        this.visible = true;
        this.startNewEntry(true);
    }

    startNewEntry(prevIsCorrectInput) {
        // 新しい入力を開始するためのメソッド
        this.currentEntry = new KeyEntry(prevIsCorrectInput);
    }

    update() {
        if (this.visible) {
            this.draw();
        }
    }

    draw() {
        let displayCount = Math.min(
            this.displaySize,
            this.keyEntries.length + 1
        );
        for (let displayId = 0; displayId < displayCount; displayId++) {
            let entry;
            if (displayId === 0) {
                entry = this.currentEntry; // 現在の入力を表示
                entry.endTime = millis(); // endTimeを更新する
            } else {
                entry = this.keyEntries[this.keyEntries.length - displayId];
            }
            entry.draw(displayId, this.displaySize);
        }
    }

    keyPressed(key, isCorrectInput, endOfSentence) {
        // 現在の入力を完了し、新しい入力を開始するロジック
        // 無視するキーを定義
        if (
            keyCode === SHIFT ||
            keyCode === CONTROL ||
            keyCode === ALT ||
            keyCode === ENTER ||
            keyCode === BACKSPACE ||
            keyCode === UP_ARROW ||
            keyCode === DOWN_ARROW ||
            keyCode === LEFT_ARROW ||
            keyCode === RIGHT_ARROW
        ) {
            return;
        }

        // 現在の入力を完了
        this.currentEntry.setKey(key, isCorrectInput, endOfSentence);
        this.keyEntries.push(this.currentEntry);

        // 新しい入力を開始
        this.startNewEntry(isCorrectInput);
    }

    calculateRecentKPM() {
        // 直近問題のKPMを算出する
        let totalTime = 0;
        let keyPressCount = 0;

        // 直近の文章の開始位置を特定する
        for (let i = this.keyEntries.length - 1; i >= 0; i--) {
            let entry = this.keyEntries[i];
            if (entry.endOfSentence && keyPressCount > 0) {
                break;
            }
            totalTime += entry.getElapsedTime();
            if (entry.isCorrectInput) keyPressCount++;
        }
        return keyPressCount / (totalTime / 60000.0); // 1分あたりのキー入力数
    }

    calculateRecentAccuracy() {
        // 直近問題の正答率を算出する
        let keyPressCount = 0;
        let correctKeyPressCount = 0;

        // 直近の文章の開始位置を特定する
        for (let i = this.keyEntries.length - 1; i >= 0; i--) {
            let entry = this.keyEntries[i];
            if (entry.endOfSentence && keyPressCount > 0) {
                break;
            }
            if (entry.isCorrectInput) correctKeyPressCount++;
            keyPressCount++;
        }
        return (correctKeyPressCount / keyPressCount) * 100.0;
    }

    saveHistoryToCSV() {
        // 勝手に保存されても面倒なので現在は無効化
        // console.log("Saving history...");
        // // ファイル名を生成
        // let date = new Date().toISOString().replace(/[:\-T]/g, '').split('.')[0];
        // let filePath = date + ".csv";  // ファイルパスをシンプルにする
        // let csvContent = "key,isCorrectInput,endOfSentence,elapsedTime\n";
        // for (let entry of this.keyEntries) {
        //   csvContent += `${entry.key},${entry.isCorrectInput},${entry.endOfSentence},${entry.getElapsedTime()}\n`;
        // }
        // // CSVデータをBlobとして作成
        // let blob = new Blob([csvContent], { type: 'text/csv' });
        // // ブラウザで直接保存を促す
        // let a = document.createElement('a');
        // a.href = URL.createObjectURL(blob);
        // a.download = filePath;
        // a.click();
        // console.log("History saved as " + filePath);
    }
}
