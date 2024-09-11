class KeyEntry {
    /*
    各入力を記録するためのKeyEntryクラス
    このクラスはキー入力、正しい入力かどうか、文章の終わりかどうか、開始時刻、終了時刻を保持する。
    */
    constructor(prevIsCorrectInput) {
        this.key = " "; // key入力時更新
        this.startTime = millis();
        this.endTime = -1; // key入力時更新
        this.prevIsCorrectInput = prevIsCorrectInput; // 前回正しく入力されたか
        this.isCorrectInput = false; // key入力時更新
        this.endOfSentence = false; // key入力時更新

        this.MILLI_SECONDS_PER_FRAME = 16; // 約60FPSを想定
        this.MAX_FRAME = 99; // バーの最大伸び幅
        this.IGNORE_FRAME = 99; // 何フレーム以上だと統計に利用しないか
    }

    setKey(key, isCorrectInput, endOfSentence) {
        this.key = key;
        this.endTime = millis();
        this.isCorrectInput = isCorrectInput;
        this.endOfSentence = endOfSentence;
    }

    isRecover() {
        // 持ち直したかどうか（前回ミスで今回正解したかどうか）
        return !this.prevIsCorrectInput && this.isCorrectInput;
    }

    isSuspend(displayId) {
        // 休止に移行するかどうか
        return displayId == 0 && this.getElapsedFrames() >= this.IGNORE_FRAME;
    }

    getElapsedTime() {
        // 経過時間[ms] を取得
        return this.endTime - this.startTime;
    }

    getElapsedFrames() {
        // 概算経過フレーム[fps] を取得
        return Math.floor(this.getElapsedTime() / this.MILLI_SECONDS_PER_FRAME);
    }

    /**
     * 描画関数
     * @param {number} displayId　直近の入力から数えて何番目か
     * @param {number} displaySize 直近何個の履歴を表示するかのサイズ
     */
    draw(displayId, displaySize) {
        strokeWeight(1); // 線の太さ
        textSize(16);

        let margin = 70; // 端からどれだけ離れた位置に配置するか
        let positionY = 75;
        let barWidth = (width - 2 * margin) / displaySize;
        let positionX = margin + (displaySize - displayId - 0.5) * barWidth;

        push();
        translate(positionX, positionY);

        // 変数を定義
        let elapsedFrames = this.getElapsedFrames();
        if (elapsedFrames > this.MAX_FRAME) elapsedFrames = this.MAX_FRAME; // 最大値を99と仮定

        // フレーム数を描画
        textAlign(CENTER, CENTER); // 基準を中央上に
        fill(0, 0, 20, 100);
        stroke(0, 0, 20, 40);
        text(elapsedFrames, -2, 2); // -2 はフォントズレの補正

        // 入力されたキーを描画
        this.setColor();
        if (this.isSuspend(displayId)) {
            fill(200, 100, 80, 100); // 青色に設定
            stroke(200, 100, 80, 100); // 枠線
        }
        text(this.key, -2, 32); // -2 はフォントズレの補正

        // バーを描画
        let ratio = elapsedFrames / this.MAX_FRAME; // 最大値を99と仮定
        this.drawCenteredBottomRect(0, -10, barWidth * 0.8, ratio * 55.0);

        // 文章終わりの場合、区切りの縦線を描画
        if (this.endOfSentence) {
            stroke(0, 0, 70, 100); // 灰色に指定
            line(barWidth / 2, -66, barWidth / 2, 46);
        }

        pop();

        // 休止中の場合は一時停止マーク(||)を出す
        if (this.isSuspend(displayId)) {
            let positionY = 270;
            fill(200, 100, 80, 0); // 青色に設定
            stroke(200, 100, 80, 30); // 枠線
            strokeWeight(25);
            ellipse(width / 2, positionY, 200, 200);

            rectMode(CENTER);
            fill(200, 100, 80, 30); // 青色に設定
            stroke(200, 100, 80, 0); // 枠線
            rect(width / 2 - 30, positionY, 25, 100);
            rect(width / 2 + 30, positionY, 25, 100);
            strokeWeight(1);

            fill(200, 100, 80, 100); // 青色に設定
            stroke(200, 100, 80, 100); // 枠線
            text(
                "【一時停止】キー入力で再開 この入力は統計に利用されません",
                width / 2,
                138
            );
        }
    }

    setColor() {
        /* 正誤色を設定する関数 */
        if (this.isCorrectInput) {
            if (this.isRecover()) {
                // 前回ミスで今回正しい入力
                fill(150, 100, 80, 100); // 緑色に設定
                stroke(150, 100, 80, 100); // 枠線
            } else {
                // 正しい入力
                fill(0, 0, 20, 100); // 黒に近い灰色に指定
                stroke(0, 0, 20, 100);
            }
        } else {
            // ミス入力
            fill(0, 0, 80, 100); // 灰色に指定
            stroke(0, 0, 80, 100);
        }
    }

    /**
     * 中央下が原点となるようにrectを描画する関数
     * @param {number} x rectの中央X座標
     * @param {number} y rectの下端Y座標
     * @param {number} width rectの幅
     * @param {number} height rectの高さ
     */
    drawCenteredBottomRect(x, y, width, height) {
        rectMode(CENTER); // 中央を基準にする

        // rectの中心が(x, y)になるように調整
        let rectX = x;
        let rectY = y - height / 2; // 中央下を基準にするため、y座標を調整

        rect(rectX, rectY, width, height, 4, 4, 0, 0);
        rectMode(CORNER);
    }
}
