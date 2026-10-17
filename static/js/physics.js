// static/js/physics.js — ЧАСТЬ 1: ИСПРАВЛЕННЫЙ ВАРИАНТ БЕЗ ОПЕЧАТОК

const faceTransforms = {
    1: 'rotateX(0deg) rotateY(0deg)',
    6: 'rotateX(180deg) rotateY(0deg)',
    3: 'rotateY(-90deg)',
    4: 'rotateY(90deg)',
    2: 'rotateX(-90deg)',
    5: 'rotateX(90deg)'
};

// Исправили опечатку: теперь строго id="cube-\${id}"
const cubeTemplate = (id) => `
    <div class="absolute w-14 h-14 select-none z-10" id="scene-${id}" style="perspective: 300px; -webkit-perspective: 300px; will-change: transform; transition: none;">
        <div class="w-14 h-14 relative" id="cube-${id}" style="transform-style: preserve-3d; -webkit-transform-style: preserve-3d; transition: transform 1000ms cubic-bezier(0.25, 1, 0.5, 1); will-change: transform;">
            
            <!-- 1 ГРАНЬ -->
            <div class="absolute w-14 h-14 bg-gradient-to-br from-white to-slate-100 border-2 border-slate-800 rounded-xl shadow-inner flex items-center justify-center" style="transform: rotateY(0deg) translateZ(28px); backface-visibility: hidden; -webkit-backface-visibility: hidden;">
                <div class="w-3 h-3 bg-rose-500 rounded-full shadow-inner"></div>
            </div>
            
            <!-- 6 ГРАНЬ -->
            <div class="absolute w-14 h-14 bg-gradient-to-br from-white to-slate-100 border-2 border-slate-800 rounded-xl grid grid-cols-3 grid-rows-3 p-1.5" style="transform: rotateY(180deg) translateZ(28px); backface-visibility: hidden; -webkit-backface-visibility: hidden;">
                <div class="w-2 h-2 bg-slate-900 rounded-full mx-auto my-auto"></div><div></div><div class="w-2 h-2 bg-slate-900 rounded-full mx-auto my-auto"></div>
                <div class="w-2 h-2 bg-slate-900 rounded-full mx-auto my-auto"></div><div></div><div class="w-2 h-2 bg-slate-900 rounded-full mx-auto my-auto"></div>
                <div class="w-2 h-2 bg-slate-900 rounded-full mx-auto my-auto"></div><div></div><div class="w-2 h-2 bg-slate-900 rounded-full mx-auto my-auto"></div>
            </div>
            
            <!-- 3 ГРАНЬ -->
            <div class="absolute w-14 h-14 bg-gradient-to-br from-white to-slate-100 border-2 border-slate-800 rounded-xl grid grid-cols-3 grid-rows-3 p-1.5" style="transform: rotateY(90deg) translateZ(28px); backface-visibility: hidden; -webkit-backface-visibility: hidden;">
                <div class="w-2 h-2 bg-slate-900 rounded-full mx-auto my-auto"></div><div></div><div></div>
                <div></div><div class="w-2 h-2 bg-slate-900 rounded-full mx-auto my-auto"></div><div></div>
                <div></div><div></div><div class="w-2 h-2 bg-slate-900 rounded-full mx-auto my-auto"></div>
            </div>
            
            <!-- 4 ГРАНЬ -->
            <div class="absolute w-14 h-14 bg-gradient-to-br from-white to-slate-100 border-2 border-slate-800 rounded-xl grid grid-cols-3 grid-rows-3 p-1.5" style="transform: rotateY(-90deg) translateZ(28px); backface-visibility: hidden; -webkit-backface-visibility: hidden;">
                <div class="w-2 h-2 bg-slate-900 rounded-full mx-auto my-auto"></div><div></div><div class="w-2 h-2 bg-slate-900 rounded-full mx-auto my-auto"></div>
                <div></div><div></div><div></div>
                <div class="w-2 h-2 bg-slate-900 rounded-full mx-auto my-auto"></div><div></div><div class="w-2 h-2 bg-slate-900 rounded-full mx-auto my-auto"></div>
            </div>
            
            <!-- 2 ГРАНЬ -->
            <div class="absolute w-14 h-14 bg-gradient-to-br from-white to-slate-100 border-2 border-slate-800 rounded-xl grid grid-cols-3 grid-rows-3 p-1.5" style="transform: rotateX(90deg) translateZ(28px); backface-visibility: hidden; -webkit-backface-visibility: hidden;">
                <div class="w-2 h-2 bg-slate-900 rounded-full mx-auto my-auto"></div><div></div><div></div>
                <div></div><div></div><div></div>
                <div></div><div></div><div class="w-2 h-2 bg-slate-900 rounded-full mx-auto my-auto"></div>
            </div>
            
            <!-- 5 ГРАНЬ -->
            <div class="absolute w-14 h-14 bg-gradient-to-br from-white to-slate-100 border-2 border-slate-800 rounded-xl grid grid-cols-3 grid-rows-3 p-1.5" style="transform: rotateX(-90deg) translateZ(28px); backface-visibility: hidden; -webkit-backface-visibility: hidden;">
                <div class="w-2 h-2 bg-slate-900 rounded-full mx-auto my-auto"></div><div></div><div class="w-2 h-2 bg-slate-900 rounded-full mx-auto my-auto"></div>
                <div></div><div class="w-2 h-2 bg-slate-900 rounded-full mx-auto my-auto"></div><div></div>
                <div class="w-2 h-2 bg-slate-900 rounded-full mx-auto my-auto"></div><div></div><div class="w-2 h-2 bg-slate-900 rounded-full mx-auto my-auto"></div>
            </div>
            
        </div>
    </div>
`;

function initBoard() {
    const diceContainer = document.getElementById('game-board');
    if (!diceContainer) return;
    diceContainer.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        diceContainer.innerHTML += cubeTemplate(i);
        const scene = document.getElementById(`scene-${i}`);
        if (scene) {
            scene.style.transform = "translate3d(0px, 0px, 0px)";
        }
    }
}

initBoard();
