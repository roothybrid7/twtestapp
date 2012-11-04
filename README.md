#ソース説明

index.htmlがアプリケーションのHTMLです。

## 読み込んでいるCSS,JSファイル

- css/main.css
- dist/vendor/jquery-1.7.2.min.js
- dist/main.js

## 使用ライブラリ/フレームワーク

- Sass(CSSメタ拡張言語)
- Compass(Sassフレームワーク)
- jQuery
- Grunt.js(ビルドツール)

## ディレクトリ構成

css/

	scssから変換され結合されたcssファイルを格納(grunt.jsでコンパイル)

dist/

	vendor/以下にjqueryを、直下にはlib/のJavascriptファイルを結合/minifyしたファイルを格納(grunt.jsでコンパイル)

img/

	背景に使用している画像ファイルを格納

lib/

	機能ごとに分割して記述したJavascriptファイルを格納

sass/

	機能ごとに分割して記述したSassファイルを格納

README.md

	このファイル

grunt.js

	Grunt(ビルドツール)の設定ファイル

index.html

	アプリケーションのHTML
