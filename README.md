# japanese-typing-training

日常使い（トレーニング）を想定した、Web 版日本語タイピング

[ここから遊べます（OpenProcessing リンク）](https://openprocessing.org/sketch/2335458)

![image](/assets/image.gif)

## 制作軸

#### １人用（トレーニング用）タイピングゲーム

-   対戦モードは設けません。
-   起動したらすぐにエンドレスで出題され、特に区切りは行いません。

#### 納得感のある UI

-   押したキーとタイミングを表示する仕組みを取り入れます。
-   この UI は自分のミスを正しく確認できて納得感があります。
-   この UI は QWERTY 配列に依存せず、どの配列でも使用できます。

#### 分析可能

-   いつでも任意に入力履歴の生データをエクスポートできます。
-   いつでも統計情報を見ることができ、苦手キー・得意キー・改善点を可視化します。

## 環境要件

-   npm を使ってセットアップ。必要なライブラリは p5.js のみです。

#### インストール方法

```
$ cd japanese-typing-training
$ npm install
```

## 予定

タイピングの練習効率化に寄与するものを優先的に実装します。

希望の機能があればお気軽にお知らせください。

-   [x] 起動したらすぐにトレーニングモードが始まります。問題を答え終わってどこかで止まることはありません。
-   [x] S キーで入力履歴を保存します。(ProcessingJava によるローカルアプリでは自動保存で実装)
-   [x] CSV を置き換えることで問題セットを自作できます。
-   [] 入力履歴から統計を計算。得意な運指、苦手な運指を出してくれます。

## 謝辞

このリポジトリは averak くんの [sushi-term](https://github.com/averak/sushi-term) から作成し始めたものです。

assets の一部はこのリポジトリから流用しています。
