let fps;
let typingGame;

function preload() {
    // データをロードし、テーブルオブジェクトを保存
    const hiraganaCsv = "assets/romaji_table.csv";
    const questionsCsv = "assets/questions.csv";

    // テーブルを非同期で読み込む
    this.hiraganaTable = loadTable(
        hiraganaCsv,
        "header",
        onTableLoadSuccess,
        onTableLoadError
    );
    this.questionsTable = loadTable(
        questionsCsv,
        "header",
        onTableLoadSuccess,
        onTableLoadError
    );
}

function setup() {
    createCanvas(640, 460);
    pixelDensity(displayDensity());
    colorMode(HSB, 360, 100, 100, 100); // 360, 100, 100で指定
    smooth();

    // JapaneseTypingGameのインスタンスを初期化
    if (this.hiraganaTable && this.questionsTable) {
        // QuestionManagerを先に初期化し、それをJapaneseTypingGameに渡す
        questionManager = new QuestionManager(
            this.hiraganaTable,
            this.questionsTable
        );
        typingGame = new JapaneseTypingGame(questionManager);
    } else {
        console.error(
            "テーブルがロードされていないため、ゲームを開始できません。"
        );
    }

    fps = new Fps(60, false);
}

// テーブルのロードが成功したときに呼び出される関数
function onTableLoadSuccess(table) {
    console.log(`${table} が正常にロードされました。`);
}

// テーブルのロードが失敗したときに呼び出される関数
function onTableLoadError(err) {
    console.error("テーブルのロード中にエラーが発生しました: ", err);
}

function draw() {
    background(0, 0, 100);
    typingGame.update();
    fps.update();

    textSize(12);
    textAlign(CENTER, BOTTOM);
    text(
        "Ⓒ 2024 https://github.com/fukada6280/japanese-typing-training",
        width / 2,
        height - 5
    );
}

// キーが押されたら
function keyPressed() {
    typingGame.keyPressed(key, keyCode);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function saveHistory() {
    typingGame.saveHistoryToCSV();
}

// p5.jsにはexit()関数がないため、ブラウザ終了前に特定の処理を行う場合は、イベントリスナーを使用
window.addEventListener("beforeunload", saveHistory);
