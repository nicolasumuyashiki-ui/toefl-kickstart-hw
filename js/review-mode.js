/**
 * review-mode.js — 2回目以降の取り組みを支援する共通ヘルパー
 *
 * 1回目に完了したら localStorage に done フラグ + 最後の答え一式を保存。
 * 2回目以降の訪問時は:
 *   - "📖 解答解説を見る" ボタンを footer に自動注入
 *   - タイマー強制 cut-off を無効化 (ページ側が Review.shouldCutOff() を見る)
 *   - 上部に "復習モード" バナーを表示
 *
 * 解答解説ページは sessionStorage が空なら Review.loadAttempt() に
 * フォールバック ─ タブ閉じても自分の解答と正答を比較できるようになる。
 *
 * すべてのデータは localStorage 上で per-user 名前空間。Auth.getUser()
 * のユーザー ID をプレフィックスに含めて、複数ユーザーが同じ端末を
 * 使った場合にも混じらないようにする。
 */
(function(global){
  function uid(){
    try {
      var u = JSON.parse(sessionStorage.getItem('kickstart_user') || 'null');
      return (u && u.userId) ? u.userId : 'anon';
    } catch(e){ return 'anon'; }
  }
  function doneKey(task, set){    return 'kickstart_done_'    + uid() + '_' + task + '_' + (set || 1); }
  function attemptKey(task, set){ return 'kickstart_attempt_' + uid() + '_' + task + '_' + (set || 1); }

  function markDone(task, set){
    try { localStorage.setItem(doneKey(task, set), new Date().toISOString()); } catch(e){}
  }
  function isDone(task, set){
    try { return !!localStorage.getItem(doneKey(task, set)); } catch(e){ return false; }
  }
  function clearDone(task, set){
    try { localStorage.removeItem(doneKey(task, set)); } catch(e){}
  }

  function saveAttempt(task, set, data){
    try { localStorage.setItem(attemptKey(task, set), JSON.stringify(data || {})); } catch(e){}
  }
  function loadAttempt(task, set){
    try { return JSON.parse(localStorage.getItem(attemptKey(task, set))); } catch(e){ return null; }
  }

  /* Used by task pages with cut-off timer logic to decide whether to
     forcibly submit at time=0. First attempt: yes (real-test feel).
     Second+ attempt: no (let user freely review without losing work). */
  function shouldCutOff(task, set){
    return !isDone(task, set);
  }

  /* Inject the "解答解説を見る" review button into a container element.
     Pages call this on DOMContentLoaded with their task/set + answers URL. */
  function attachReviewControls(opts){
    opts = opts || {};
    var task = opts.task, set = opts.set;
    if (!task) return;
    if (!isDone(task, set)) return;

    // 1) Footer button
    var container = opts.container ||
      (opts.containerSelector ? document.querySelector(opts.containerSelector) : null) ||
      document.querySelector('.footer-right') ||
      document.querySelector('.reading-footer .footer-right') ||
      document.querySelector('.task-footer') ||
      document.querySelector('.bottom-nav') ||
      document.body;

    if (container && !container.querySelector('.review-jump-btn')) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-nav review-jump-btn';
      btn.style.cssText = 'background:#8B5CF6;color:#fff;border:none;border-radius:8px;padding:10px 22px;font-size:.92em;font-weight:700;cursor:pointer;margin-right:10px;font-family:inherit;display:inline-flex;align-items:center;gap:6px';
      btn.innerHTML = '📖 解答解説を見る';
      btn.onclick = function(){
        if (opts.answersUrl) window.location.href = opts.answersUrl;
      };
      container.insertBefore(btn, container.firstChild);
    }

    // 2) Top-of-page banner "復習モード"
    if (!document.getElementById('review-mode-banner')) {
      var banner = document.createElement('div');
      banner.id = 'review-mode-banner';
      banner.style.cssText = 'background:linear-gradient(90deg,#8B5CF6,#A78BFA);color:#fff;padding:8px 16px;font-family:Nunito,system-ui,sans-serif;font-size:.82em;font-weight:600;text-align:center;letter-spacing:.02em';
      banner.innerHTML = '🔄 復習モード — 制限時間切れでも自動 cut-off されません。タスクページ右下の「📖 解答解説を見る」から直接ジャンプも可。';
      document.body.insertBefore(banner, document.body.firstChild);
    }
  }

  global.Review = {
    markDone:        markDone,
    isDone:          isDone,
    clearDone:       clearDone,
    saveAttempt:     saveAttempt,
    loadAttempt:     loadAttempt,
    shouldCutOff:    shouldCutOff,
    attachReviewControls: attachReviewControls
  };
})(window);
