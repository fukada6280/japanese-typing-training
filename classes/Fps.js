class Fps {
    constructor(setFrameRate, visible) {
        this.visible = visible;
        frameRate(setFrameRate);
    }

    update() {
        if (this.visible) {
            this.draw();
        }
    }

    draw() {
        // 右下にfpsを表示
        fill(0, 0, 0, 100);
        stroke(0, 0, 0, 0);
        textSize(12);
        textAlign(RIGHT, BOTTOM);
        text("fps: " + int(frameRate()), width - 5, height);

        // 現在指し示している座標を表示
        text("mouse=(" + mouseX + ", " + mouseY + ")", width - 5, height - 18);
        text(
            "reverse_mouse=(" +
                (width - mouseX) +
                ", " +
                (height - mouseY) +
                ")",
            width - 5,
            height - 36
        );
    }
}
