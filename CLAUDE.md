# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 問題ファイルの規則
- ファイル命名: `day{N}/{tasktype}-{set番号}.html`
- 各HTMLは自己完結型（CSS・JSはインライン、音声はbase64）
- 解答ページは `{tasktype}-answers.html` で sessionStorage からスコアを読む
- 全ページで `js/auth.js` を読み込み、未ログインならindex.htmlにリダイレクト

## タスクタイプ一覧
| 略称 | 正式名 | Day | 説明 |
|------|--------|-----|------|
| ctw | Complete the Words | 1 | パッセージの空欄に文字を入力 |
| lcr | Listen, Complete & Repeat | 2 | 音声を聞いて書き取り |
| listening | Listening Tasks | 2 | 多肢選択リスニング |
| writing | Write an Email / Academic Discussion | 3 | ライティング |
| speaking | Take an Interview / Build a Sentence | 4 | スピーキング |

## コミットメッセージの規則
- `feat: add Day1 CTW Set 4` — 新しい問題を追加
- `fix: correct answer key in ctw-2` — 正解の修正
- `style: update header across all pages` — デザイン変更
- `docs: update CLAUDE.md` — ドキュメント更新

## やってはいけないこと
- js/api.js の GAS_URL を変更しない（本番URLが入っている）
- index.html, menu.html の認証ロジックを変更しない
- 既存の問題ファイルの正解を勝手に変更しない（必ず確認を求めること）
