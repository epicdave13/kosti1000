// static/js/game.js — ЧАСТЬ 2: СИНХРOНИЗИРOВАННЫЙ ДВИЖОК С ЗАЩИТОЙ ОТ ИНЕРЦИОННЫХ НАЛОЖЕНИЙ

const rollButton = document.getElementById('roll-btn');
const diceContainer = document.getElementById('game-board');
const toastContainer = document.getElementById('toast-container');

function showToast(message, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    let borderColors = "border-amber-400/40 text-amber-400";
    let emoji = "🎉";
    if (type === 'danger') { borderColors = "border-rose-500/40 text-rose-400"; emoji = "🔩"; }

    toast.className = `w-full bg-slate-950/10 backdrop-blur-xl border ${borderColors} p-3 rounded-xl flex items-center gap-2.5 shadow-2xl shadow-slate-950/60 transition-all duration-300 opacity-0 -translate-y-4 scale-95 select-none`;
    toast.innerHTML = `
        <span class="text-base flex-shrink-0">${emoji}</span>
        <p class="text-xs sm:text-sm font-extrabold tracking-wide leading-tight">${message}</p>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.remove('opacity-0', '-translate-y-4', 'scale-95'), 10);
    setTimeout(() => {
        toast.classList.add('opacity-0', '-translate-y-2', 'scale-95');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

if (rollButton && diceContainer) {
    rollButton.disabled = false;

    rollButton.onclick = () => {
        initBoard(); // Сбрасываем кости в центр стола

        rollButton.disabled = true;
        rollButton.classList.add('opacity-40', 'cursor-not-allowed');

        let totalPoints = 0;

        // 🛠 ЖЕСТКИЕ ПАРАМЕТРЫ ДЛЯ СТОПРОЦЕНТНОГО ИСКЛЮЧЕНИЯ НАЛОЖЕНИЙ
        const diceCount = 5;

        // Хитбокс увеличен до 36 пикселей для создания железного зазора с учетом углов куба!
        const diceRadius = 36;
        const tableRadius = 135;

        // Увеличили силу трения (0.93 вместо 0.96), чтобы кубики гасили скорость ровно за 1 секунду (60 кадров)
        const friction = 0.93;

        const balls = [];
        const baseAngles = [0.0, 1.25, 2.5, 3.75, 5.0];

        for (let i = 0; i < diceCount; i++) {
            const cube = document.getElementById(`cube-${i}`);
            const scene = document.getElementById(`scene-${i}`);
            if (!cube || !scene) continue;

            const resultValue = Math.floor(Math.random() * 6) + 1;
            if (resultValue === 1) totalPoints += 10;
            if (resultValue === 5) totalPoints += 5;

            // Запускаем упругое 3D-вращение (теперь длится ровно 1000ms)
            const randomX = (Math.floor(Math.random() * 4) + 2) * 360;
            const randomY = (Math.floor(Math.random() * 4) + 2) * 360;
            const randomZ = Math.floor(Math.random() * 50) - 25;

            setTimeout(() => {
                cube.style.transform = `rotateZ(${randomZ}deg) rotateX(${randomX}deg) rotateY(${randomY}deg) ${faceTransforms[resultValue]}`;
            }, 10);

            // Физический импульс 2D-вылета
            const shootAngle = baseAngles[i] + (Math.random() * 0.4 - 0.2);
            const startSpeed = Math.random() * 4 + 10;

            balls.push({
                id: i,
                sceneElement: scene,
                x: 0,
                y: 0,
                vx: Math.cos(shootAngle) * startSpeed,
                vy: Math.sin(shootAngle) * startSpeed,
                radius: diceRadius,
                mass: 1
            });
        }

        // ⏱ СИНХРOНИЗИРOВАННЫЙ ЦИКЛ ФИЗИКИ (РОВНО 60 КАДРОВ = 1 СЕКУНДА)
        let physicsDuration = 0;
        const maxPhysicsTicks = 60;

        const physicsInterval = setInterval(() => {
            physicsDuration++;

            // 1. Сдвиг координат и сила трения сукна
            balls.forEach(b => {
                b.x += b.vx;
                b.y += b.vy;
                b.vx *= friction;
                b.vy *= friction;

                // 🛢 ОТСКОК ОТ СТЕНКИ СТОЛА (Круглый бортик)
                const distanceFromCenter = Math.sqrt(b.x * b.x + b.y * b.y);
                if (distanceFromCenter + b.radius > tableRadius) {
                    const nx = b.x / distanceFromCenter;
                    const ny = b.y / distanceFromCenter;

                    b.x = nx * (tableRadius - b.radius);
                    b.y = ny * (tableRadius - b.radius);

                    const dotProduct = b.vx * nx + b.vy * ny;
                    b.vx = (b.vx - 2 * dotProduct * nx) * 0.75;
                    b.vy = (b.vy - 2 * dotProduct * ny) * 0.75;
                }
            });

            // 💥 ЧЕСТНЫЕ УПРУГИЕ СТОЛКНОВЕНИЯ КУБИКОВ ДРУГ ОБ ДРУГА
            for (let i = 0; i < balls.length; i++) {
                for (let j = i + 1; j < balls.length; j++) {
                    const b1 = balls[i];
                    const b2 = balls[j];

                    const dx = b2.x - b1.x;
                    const dy = b2.y - b1.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const minDist = b1.radius + b2.radius;

                    if (distance < minDist) {
                        const nx = dx / distance;
                        const ny = dy / distance;

                        const overlap = minDist - distance;
                        b1.x -= nx * (overlap / 2);
                        b1.y -= ny * (overlap / 2);
                        b2.x += nx * (overlap / 2);
                        b2.y += ny * (overlap / 2);

                        const kx = b1.vx - b2.vx;
                        const ky = b1.vy - b2.vy;
                        const p = 2 * (nx * kx + ny * ky) / (b1.mass + b2.mass);

                        b1.vx -= p * b2.mass * nx;
                        b1.vy -= p * b2.mass * ny;
                        b2.vx += p * b1.mass * nx;
                        b2.vy += p * b1.mass * ny;
                    }
                }
            }

            // 📺 Отрисовываем сдвиг на экране
            balls.forEach(b => {
                b.sceneElement.style.transform = `translate3d(${Math.floor(b.x)}px, ${Math.floor(b.y)}px, 0px)`;
            });

            // Полная принудительная фиксация ровно на 60-м кадре
            if (physicsDuration >= maxPhysicsTicks) {
                clearInterval(physicsInterval);
            }

        }, 1000 / 60);

        // Кнопка и уведомление срабатывают ровно через 1050мс — синхронно с остановкой 3D кувырков!
        setTimeout(() => {
            rollButton.disabled = false;
            rollButton.classList.remove('opacity-40', 'cursor-not-allowed');

            if (totalPoints > 0) {
                showToast(`Данил выбросил и набрал +${totalPoints} очков!`, "success");
            } else {
                showToast(`Выпало 0 очков! Данил получает БОЛТ 🔩`, "danger");
            }
        }, 1050);
    };
}
