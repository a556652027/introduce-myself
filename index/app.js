// 互動式紅點：滑鼠靠近時，紅點隨機跳走
(function () {
  const dot = document.getElementById('chase-dot');
  if (!dot) return;

  const minDistance = 90; // 觸發閃避的距離（像素）
  const padding = 16; // 視窗邊界緩衝

  function randomPosition(avoidX, avoidY) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // 將可用範圍縮小以避免溢出
    const minX = padding;
    const maxX = vw - padding;
    const minY = padding;
    const maxY = vh - padding;

    // 迭代找一個離滑鼠夠遠的位置
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * (maxX - minX) + minX;
      const y = Math.random() * (maxY - minY) + minY;
      const dx = x - avoidX;
      const dy = y - avoidY;
      const dist = Math.hypot(dx, dy);
      if (dist > minDistance * 1.8) return { x, y };
    }
    // 退而求其次：跳到視窗的對角附近
    const x = avoidX < vw / 2 ? maxX - 40 : minX + 40;
    const y = avoidY < vh / 2 ? maxY - 40 : minY + 40;
    return { x, y };
  }

  function setDotPosition(x, y) {
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.transform = 'translate(-50%, -50%)';
  }

  // 初始位置
  setTimeout(() => {
    const p = randomPosition(window.innerWidth / 2, window.innerHeight / 2);
    setDotPosition(p.x, p.y);
  }, 0);

  let lastMove = 0;
  window.addEventListener('mousemove', (e) => {
    const now = performance.now();
    if (now - lastMove < 40) return; // 簡單節流，避免過於頻繁
    lastMove = now;

    const rect = dot.getBoundingClientRect();
    const dotX = rect.left + rect.width / 2;
    const dotY = rect.top + rect.height / 2;
    const dx = e.clientX - dotX;
    const dy = e.clientY - dotY;
    const dist = Math.hypot(dx, dy);

    if (dist < minDistance) {
      const p = randomPosition(e.clientX, e.clientY);
      setDotPosition(p.x, p.y);
    }
  });

  // 視窗改變時，避免紅點跑出可視範圍
  window.addEventListener('resize', () => {
    const rect = dot.getBoundingClientRect();
    const x = Math.min(Math.max(rect.left, padding), window.innerWidth - padding);
    const y = Math.min(Math.max(rect.top, padding), window.innerHeight - padding);
    setDotPosition(x, y);
  });
})();

