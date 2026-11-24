/* 페이지를 다시 열면 마지막으로 보던 위치로 돌아가기 (이 기기의 브라우저에만 저장) */
(function () {
  var KEY = 'scrollpos:' + decodeURIComponent(location.pathname);
  function get() { try { return +localStorage.getItem(KEY) || 0; } catch (e) { return 0; } }
  function save() { try { localStorage.setItem(KEY, String(Math.round(window.scrollY))); } catch (e) {} }
  try { history.scrollRestoration = 'manual'; } catch (e) {}

  var y = location.hash ? 0 : get();   // 주소에 #이 있으면 그 위치를 우선
  var restoring = y > 0, timer;
  function go() { if (restoring) window.scrollTo(0, y); }
  function stop() { restoring = false; }

  // 사용자가 직접 움직이면 되돌리기를 멈춤
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (ev) {
    window.addEventListener(ev, stop, { passive: true, once: true });
  });
  window.addEventListener('scroll', function () {
    clearTimeout(timer); timer = setTimeout(save, 250);
  }, { passive: true });
  window.addEventListener('pagehide', save);

  if (!restoring) return;
  go();
  window.addEventListener('load', go);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
  setTimeout(go, 400);
  setTimeout(stop, 1500);
})();
