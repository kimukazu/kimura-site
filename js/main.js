/* =========================================================
   木村インダストリー株式会社 コーポレートサイト
   共通スクリプト（フェードイン / ヘッダー挙動 / お問い合わせフォーム）
   ========================================================= */

// JSが有効なことを示すため、真っ先に no-js クラスを外す
// （読み込み・実行に失敗した場合は no-js のままとなり、CSS側で全コンテンツを表示する）
document.documentElement.classList.remove("no-js");

(function () {
  "use strict";

  var toArray = function (nodeList) {
    return Array.prototype.slice.call(nodeList);
  };

  /* ---------------------------------------------------------
     1. スクロールフェードイン (IntersectionObserver)
     大きな要素（SERVICESなど）は threshold を満たせないまま
     opacity:0 が続いてしまうことがあるため、
     しきい値は 0（1pxでも見えたら発火）にし、
     rootMargin で少し早めに発火させる。
     --------------------------------------------------------- */
  var fadeTargets = document.querySelectorAll(".fade-in");

  if ("IntersectionObserver" in window && fadeTargets.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -10% 0px"
      }
    );

    toArray(fadeTargets).forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // 非対応ブラウザ（IE11含む）では即座に表示する
    toArray(fadeTargets).forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------------------------------------------------------
     2. ヘッダー挙動
     - ヘッダーは透明・fixedで浮いており、ロゴ／ナビ各リンクは
       CSS側で白いチップとして表示される（背景色の切り替えはなし）
     - ヘッダーの実際の高さを測定して CSS変数 --header-h に反映
       （アンカー移動時の scroll-margin-top と、contact.html の
        ヒーロー見出しのオフセットの両方がこの変数を参照している）
     --------------------------------------------------------- */
  var header = document.getElementById("siteHeader");

  if (header) {
    var updateHeaderHeight = function () {
      var h = header.offsetHeight;
      if (h > 0) {
        document.documentElement.style.setProperty("--header-h", h + "px");
      }
    };

    updateHeaderHeight();

    if ("ResizeObserver" in window) {
      // フォント読み込み完了によるナビの折り返し変化なども自動で検知できる
      var headerResizeObserver = new ResizeObserver(updateHeaderHeight);
      headerResizeObserver.observe(header);
    } else {
      window.addEventListener("resize", updateHeaderHeight);
      window.addEventListener("load", updateHeaderHeight);
      window.addEventListener("orientationchange", updateHeaderHeight);
    }
  }

  /* ---------------------------------------------------------
     3. お問い合わせフォーム（mailto 送信）
     --------------------------------------------------------- */
  var contactForm = document.getElementById("contactForm");

  // mailto URL の長さの目安上限。多くのメールソフト／OSは
  // 約2000文字前後で本文が切れる／開けなくなるため、余裕を見て制限する。
  var MAILTO_MAX_LENGTH = 1800;

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // ブラウザ標準のバリデーション（required属性）で未入力を止める
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      var name = contactForm.querySelector("#name").value.trim();
      var company = contactForm.querySelector("#company").value.trim();
      var email = contactForm.querySelector("#email").value.trim();
      var tel = contactForm.querySelector("#tel").value.trim();
      var message = contactForm
        .querySelector("#message")
        .value.trim()
        .replace(/\r?\n/g, "\r\n"); // 改行コードをCRLFに統一

      var bodyLines = [
        "お名前：" + name,
        "会社名・団体名：" + (company || "（未入力）"),
        "メールアドレス：" + email,
        "電話番号：" + (tel || "（未入力）"),
        "",
        "お問い合わせ内容：",
        message
      ];

      var subject = encodeURIComponent("【お問い合わせ】" + name);
      var body = encodeURIComponent(bodyLines.join("\r\n"));

      var mailtoUrl =
        "mailto:info@kimuraindustry.jp?subject=" + subject + "&body=" + body;

      if (mailtoUrl.length > MAILTO_MAX_LENGTH) {
        alert(
          "内容が長いため、お手数ですが info@kimuraindustry.jp へ直接メールでご連絡ください。"
        );
        return;
      }

      window.location.href = mailtoUrl;
    });
  }
})();
