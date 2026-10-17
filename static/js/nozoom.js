// Запрет зума пальцами (Pinch-to-zoom)
document.addEventListener('touchmove', function (event) {
    if (event.scale !== undefined && event.scale !== 1) {
        event.preventDefault();
    }
}, { passive: false });

// Запрет зума при двойном тапе по экрану
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    let now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);