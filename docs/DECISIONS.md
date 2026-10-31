# 意思決定の記録

## 2026-10-22 事業ブロック全体を外部サイトへのリンクにする方法

- 採用: JavaScript ではなく CSS の stretched link（文字リンクの ::after をブロック全体に広げる方法）。
- 理由: `<a>` の入れ子は HTML として不正。JavaScript が無効でも動く。キーボード操作で「公式サイト」「Instagram」の2つのリンクが別々に辿れる。
- トレードオフ: ブロック内の文字をマウスで選択できなくなる。
- 写真は `pointer-events: none` でクリック判定から外す。理由: ホバーで拡大（transform）した写真が `::after` より前面に描画され、クリックを奪うため。`::after` の z-index を上げるだけでは、リンクの opacity による重なり文脈に閉じ込められて効かない。
- ホバー効果は `@media (hover: hover)` に限定。理由: タッチ端末でタップ後に :hover が残り、拡大・半透明のままになるため。

## 2026-10-22 Instagram アイコンの入手方法

- 採用: Simple Icons（CC0）の SVG を `assets/img/icon-instagram.svg` として同梱。
- 理由: 無料・商用利用可、外部 CDN に依存しない。
