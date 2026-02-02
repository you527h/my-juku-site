document.addEventListener("DOMContentLoaded", () => {
  // ===== メニュー =====
  const button = document.getElementById("menuButton");
  const menu = document.getElementById("menu");
  const overlay = document.getElementById("overlay");

  // ===== スライダー =====
  const track = document.getElementById("sliderTrack");
  const dotsWrap = document.getElementById("sliderDots");
  const slider = document.querySelector(".slider");

  // 必須要素が無ければ終了（ページによっては存在しないため）
  if (!button || !menu || !overlay || !track || !dotsWrap || !slider) {
    console.warn("必要な要素が見つからないため main.js を停止しました");
    return;
  }

  const dots = Array.from(dotsWrap.querySelectorAll(".dot"));
  const slides = Array.from(document.querySelectorAll(".slide"));
  const slideCount = slides.length; // コピー込み
  const realTotal = dots.length;    // 本物の枚数

  let current = 1;   // 本物1枚目（コピーが0）
  let timer = null;

  // 初期位置
  track.style.transform = `translateX(-${current * 100}%)`;

  // ドット更新（current → 本物index）
  function updateDots() {
    const realIndex = (current - 1 + realTotal) % realTotal;
    dots.forEach((d, i) => d.classList.toggle("is-active", i === realIndex));
  }

  function moveTo(index) {
    track.style.transition = "transform 400ms ease";
    track.style.transform = `translateX(-${index * 100}%)`;
    current = index;
    updateDots();
  }

  function next() {
    moveTo(current + 1);
  }

  function prev() {
    moveTo(current - 1);
  }

  function start() {
    stop();
    timer = setInterval(next, 3500);
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  // コピー位置に来たら瞬間移動
  track.addEventListener("transitionend", () => {
    if (current === slideCount - 1) {
      track.style.transition = "none";
      current = 1;
      track.style.transform = `translateX(-${current * 100}%)`;
      updateDots();
    }

    if (current === 0) {
      track.style.transition = "none";
      current = slideCount - 2;
      track.style.transform = `translateX(-${current * 100}%)`;
      updateDots();
    }
  });

  // ドットクリック
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      moveTo(i + 1);
      start();
    });
  });

  // 起動
  updateDots();
  start();

  // ===== スワイプ対応 =====
  let startX = 0;
  let startY = 0;
  let deltaX = 0;
  let isSwiping = false;

  function onStart(x, y) {
    if (document.body.classList.contains("menu-open")) return;

    startX = x;
    startY = y;
    deltaX = 0;
    isSwiping = true;
    stop();
  }

  function onMove(x, y) {
    if (!isSwiping) return;

    const dx = x - startX;
    const dy = y - startY;

    // 縦スクロール優先ならやめる
    if (Math.abs(dy) > Math.abs(dx)) {
      isSwiping = false;
      track.style.transition = "transform 400ms ease";
      start();
      return;
    }

    deltaX = dx;

    // 指に追従
    track.style.transition = "none";
    const percent = (deltaX / slider.clientWidth) * 100;
    track.style.transform = `translateX(calc(-${current * 100}% + ${percent}%))`;
  }

  function onEnd() {
    if (!isSwiping) return;
    isSwiping = false;

    track.style.transition = "transform 400ms ease";
    const threshold = slider.clientWidth * 0.2;

    if (deltaX > threshold) {
      prev();
    } else if (deltaX < -threshold) {
      next();
    } else {
      moveTo(current);
    }

    start();
  }

  // タッチ
  slider.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    onStart(t.clientX, t.clientY);
  }, { passive: true });

  slider.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;

    if (Math.abs(dx) > Math.abs(dy)) e.preventDefault();
    onMove(t.clientX, t.clientY);
  }, { passive: false });

  slider.addEventListener("touchend", onEnd);

  // マウス（PCドラッグ）
  slider.addEventListener("mousedown", (e) => onStart(e.clientX, e.clientY));
  window.addEventListener("mousemove", (e) => onMove(e.clientX, e.clientY));
  window.addEventListener("mouseup", onEnd);

  // ===== メニュー開閉 =====
  button.addEventListener("click", () => {
    menu.classList.toggle("open");
    button.classList.toggle("open");
    overlay.classList.toggle("open");
    document.body.classList.toggle("menu-open");
  });

  overlay.addEventListener("click", () => {
    menu.classList.remove("open");
    button.classList.remove("open");
    overlay.classList.remove("open");
    document.body.classList.remove("menu-open");
  });
});