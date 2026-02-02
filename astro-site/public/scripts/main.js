		<script>
			/*== javascript ==*/
      const button = document.getElementById("menuButton");
      const menu = document.getElementById("menu");


		// ===== スライダー =====
const track = document.getElementById("sliderTrack");
const dotsWrap = document.getElementById("sliderDots");
const dots = Array.from(dotsWrap.querySelectorAll(".dot"));

const slides = Array.from(document.querySelectorAll(".slide"));
const slideCount = slides.length;           // コピー込みの枚数
const realTotal = dots.length;              // 本物の枚数

let current = 1;                            // 本物1枚目から開始（コピーが0）
let timer = null;

// 初期位置
track.style.transform = `translateX(-${current * 100}%)`;

// ドット更新（current → 本物indexに変換）
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

// コピー位置に行ったら瞬間移動
track.addEventListener("transitionend", () => {
  // 一番右のコピー（最後）に来たら、本物1へ瞬間移動
  if (current === slideCount - 1) {
    track.style.transition = "none";
    current = 1;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
  }

  // 一番左のコピー（最初）に来たら、本物最後へ瞬間移動
  if (current === 0) {
    track.style.transition = "none";
    current = slideCount - 2;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
  }
});

// ドットクリック（本物index → currentへ）
dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    moveTo(i + 1);   // 本物1枚目が current=1
    start();
  });
});

// 起動
updateDots();
start();


// ===== スワイプ対応（タッチで左右移動）=====
let startX = 0;
let startY = 0;
let deltaX = 0;
let isSwiping = false;

const slider = document.querySelector(".slider"); // スライダー全体

function onStart(x, y) {
  if (document.body.classList.contains("menu-open")) return;

  startX = x;
  startY = y;
  deltaX = 0;
  isSwiping = true;
  stop(); // 触ったら自動送りを止める
}

function onMove(x, y) {
  if (!isSwiping) return;

  const dx = x - startX;
  const dy = y - startY;

  // 縦スクロールが勝ってたらスワイプを諦める
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
    prev(); // ← 無限ループ版に合わせる
  } else if (deltaX < -threshold) {
    next(); // ← 無限ループ版に合わせる
  } else {
    moveTo(current); // 元に戻す
  }

  start();
}

// タッチ
slider.addEventListener(
  "touchstart",
  (e) => {
    const t = e.touches[0];
    onStart(t.clientX, t.clientY);
  },
  { passive: true }
);

slider.addEventListener(
  "touchmove",
  (e) => {
    const t = e.touches[0];

    // 横スワイプ中はスクロールを止める（これが効く）
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    if (Math.abs(dx) > Math.abs(dy)) e.preventDefault();

    onMove(t.clientX, t.clientY);
  },
  { passive: false }
);

slider.addEventListener("touchend", onEnd);

// マウス（PCドラッグ）
slider.addEventListener("mousedown", (e) => onStart(e.clientX, e.clientY));
window.addEventListener("mousemove", (e) => onMove(e.clientX, e.clientY));
window.addEventListener("mouseup", onEnd);
			const overlay = document.getElementById("overlay");

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

		</script>
