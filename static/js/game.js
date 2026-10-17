// static/js/game.js

// 1. Находим кнопку броска по её ID
const rollButton = document.getElementById('roll-btn');
const toastContainer = document.getElementById('toast-container');

// 2. Добавляем проверку, чтобы код не упал, если элементов вдруг нет на странице
if (rollButton && toastContainer) {

    // Включаем кнопку для теста (в HTML она может быть disabled)
    rollButton.disabled = false;
    rollButton.style.cursor = 'pointer';

    // 3. Вешаем событие клика на кнопку
    rollButton.onclick = () => {

        // Создаем плашку уведомления
        const toast = document.createElement('div');

        // Задаем стили:
        // - animate-fade-in-down или кастомный transition для появления
        // - Мы используем CSS-анимацию плавного скольжения сверху вниз
        // static/js/game.js -> ультра-прозрачная строка

        toast.className = "w-full bg-slate-950/10 backdrop-blur-xl border border-emerald-500/20 p-3 rounded-xl flex items-center gap-2.5 shadow-2xl shadow-slate-950/60 transition-all duration-300 opacity-0 -translate-y-4 scale-95 select-none";


        toast.innerHTML = `
            <span class="text-lg flex-shrink-0">🎉</span>
            <p class="text-xs sm:text-sm font-extrabold text-emerald-400 tracking-wide leading-tight">
                Данил набрал +105 очков!
            </p>
        `;

        // Добавляем плашку в контейнер сверху
        toastContainer.appendChild(toast);

        // Магия появления: делаем микро-задержку в 10 миллисекунд, 
        // чтобы браузер успел заметить элемент, а затем убираем прозрачность и сдвиг
        setTimeout(() => {
            toast.classList.remove('opacity-0', '-translate-y-4', 'scale-95');
        }, 10);

        // 4. Логика автоматического удаления через 3 секунды
        setTimeout(() => {
            // Плавный улет обратно вверх и растворение
            toast.classList.add('opacity-0', '-translate-y-2', 'scale-95');
            // Полностью удаляем из HTML-кода страницы после завершения анимации
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };
}
