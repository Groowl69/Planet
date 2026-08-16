/**
 * main.js - Точка входа в приложение
 * Инициализация игры и обработка событий
 */

import { Game } from './modules/game.js';
import { Renderer } from './modules/renderer.js';
import { InputHandler } from './modules/input.js';
import { UIManager } from './modules/ui.js';
import { StorageManager } from './modules/storage.js';
import { CHARACTERS, getAvailableCharacters } from './modules/characters.js';

// Глобальные объекты
let game = null;
let renderer = null;
let input = null;
let ui = null;
let storage = null;

let lastTime = 0;
let animationId = null;

// Советы при загрузке
const loadingTips = [
    'В железных горах алмазы добываются ударами по ним.',
    'Кусты маскируют вас от противников, однако наблюдатели могут вас рассекретить!',
    'Смерть со второй жизнью на пентаграмме может открыть новый контент...',
    'В глубокой воде можно утонуть.',
    'Во время шторма лучше забраться на дерево или стену.',
    'Разные эволюции приводят к разным результатам.'
];

/**
 * Инициализация приложения
 */
function init() {
    console.log('ОО-78: Инициализация...');
    
    // Менеджер хранилища
    storage = new StorageManager();
    
    // Обработчик ввода
    input = new InputHandler();
    
    // Рендерер
    const canvas = document.getElementById('game-canvas');
    if (canvas) {
        renderer = new Renderer(canvas);
    }
    
    // Игра
    game = new Game();
    
    // UI менеджер
    ui = new UIManager(game);
    
    // Настройка кнопок меню
    setupMenuButtons();
    
    // Показать главное меню
    ui.showScreen('main-menu');
    
    console.log('ОО-78: Готово!');
}

/**
 * Настройка кнопок главного меню
 */
function setupMenuButtons() {
    // Кнопка начала игры
    document.getElementById('btn-start')?.addEventListener('click', () => {
        ui.showScreen('character-select');
        updateCharacterDisplay();
    });
    
    // Кнопка настроек
    document.getElementById('btn-settings')?.addEventListener('click', () => {
        ui.showScreen('settings-screen');
        loadSettings();
    });
    
    // Кнопка энциклопедии
    document.getElementById('btn-encyclopedia')?.addEventListener('click', () => {
        showEncyclopedia();
    });
    
    // Навигация персонажей
    document.getElementById('char-prev')?.addEventListener('click', () => {
        navigateCharacters(-1);
    });
    
    document.getElementById('char-next')?.addEventListener('click', () => {
        navigateCharacters(1);
    });
    
    // Подтверждение выбора персонажа
    document.getElementById('btn-confirm-char')?.addEventListener('click', () => {
        startGame();
    });
    
    // Назад в меню
    document.getElementById('btn-back-menu')?.addEventListener('click', () => {
        ui.showScreen('main-menu');
    });
    
    // Сохранение настроек
    document.getElementById('btn-save-settings')?.addEventListener('click', () => {
        saveSettings();
        ui.showScreen('main-menu');
    });
    
    // Назад из настроек
    document.getElementById('btn-back-settings')?.addEventListener('click', () => {
        ui.showScreen('main-menu');
    });
    
    // Назад из энциклопедии
    document.getElementById('btn-back-encyclopedia')?.addEventListener('click', () => {
        ui.showScreen('main-menu');
    });
    
    // Закрыть инвентарь
    document.getElementById('btn-close-inventory')?.addEventListener('click', () => {
        document.getElementById('inventory-screen').classList.add('hidden');
        if (game.state === 'paused') {
            game.pause();
        }
    });
    
    // Продолжить игру
    document.getElementById('btn-resume')?.addEventListener('click', () => {
        game.pause();
        document.getElementById('pause-screen').classList.add('hidden');
    });
    
    // Выйти в меню
    document.getElementById('btn-quit')?.addEventListener('click', () => {
        stopGame();
        ui.showScreen('main-menu');
    });
    
    // Новый забег после смерти
    document.getElementById('btn-restart')?.addEventListener('click', () => {
        ui.showScreen('character-select');
        updateCharacterDisplay();
    });
    
    // В меню после смерти
    document.getElementById('btn-menu-death')?.addEventListener('click', () => {
        ui.showScreen('main-menu');
    });
}

/**
 * Навигация по персонажам
 */
let currentCharIndex = 0;
function navigateCharacters(direction) {
    const characters = getAvailableCharacters();
    currentCharIndex = (currentCharIndex + direction + characters.length) % characters.length;
    updateCharacterDisplay();
}

/**
 * Обновить отображение персонажа
 */
function updateCharacterDisplay() {
    const characters = getAvailableCharacters();
    if (characters.length === 0) return;
    
    const character = characters[currentCharIndex];
    
    document.getElementById('char-name').textContent = character.name;
    document.getElementById('char-desc').textContent = character.description;
    
    // Отрисовка персонажа на canvas
    const charCanvas = document.getElementById('char-canvas');
    if (charCanvas) {
        const ctx = charCanvas.getContext('2d');
        ctx.clearRect(0, 0, charCanvas.width, charCanvas.height);
        
        const centerX = charCanvas.width / 2;
        const centerY = charCanvas.height / 2;
        const radius = 60;
        
        // Тело
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = character.color || '#4CAF50';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Если заблокирован
        if (character.locked) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, charCanvas.width, charCanvas.height);
            
            ctx.fillStyle = '#fff';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🔒', centerX, centerY + 7);
        }
    }
    
    // Статистика
    const statsEl = document.getElementById('char-stats');
    if (statsEl) {
        statsEl.textContent = character.locked 
            ? `Условие: ${character.unlockCondition}`
            : `DMG: ${character.baseStats.damage} | HP: ${character.baseStats.health} | SPD: ${character.baseStats.speed}`;
    }
}

/**
 * Начать игру
 */
function startGame() {
    const characters = getAvailableCharacters();
    if (characters.length === 0) return;
    
    const character = characters[currentCharIndex];
    
    // Показать экран загрузки
    ui.showScreen('loading-screen');
    const tipIndex = Math.floor(Math.random() * loadingTips.length);
    document.getElementById('loading-tip').textContent = loadingTips[tipIndex];
    
    let progress = 0;
    const progressBar = document.getElementById('loading-progress');
    
    const loadInterval = setInterval(() => {
        progress += 5;
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        if (progress >= 100) {
            clearInterval(loadInterval);
            
            // Скрыть все экраны кроме игрового
            ui.hideAllScreens();
            document.getElementById('game-screen').classList.add('active');
            
            // Инициализировать игру
            game.minimapCanvas = document.getElementById('minimap');
            game.startGame(character.id);
            
            // Запустить игровой цикл
            lastTime = performance.now();
            gameLoop(lastTime);
        }
    }, 50);
}

/**
 * Остановить игру
 */
function stopGame() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    game = new Game();
    input.reset();
}

/**
 * Игровой цикл
 */
function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    
    if (game.state === 'playing') {
        // Обновление игры
        game.update(deltaTime);
        
        // Обработка ввода
        handleInput(deltaTime);
        
        // Рендеринг
        if (renderer && game.player) {
            renderer.render({
                player: game.player,
                enemies: game.enemies,
                xpPoints: game.xpPoints,
                artifacts: game.artifacts,
                attacks: game.attacks,
                currentOO: game.currentOO,
                weather: game.weather,
                timeOfDay: game.timeOfDay,
                minimapCanvas: game.minimapCanvas
            });
        }
        
        // Обновление UI
        ui.updateHud();
    }
    
    animationId = requestAnimationFrame(gameLoop);
}

/**
 * Обработка ввода во время игры
 */
function handleInput(deltaTime) {
    if (!game.player) return;
    
    // Движение
    const direction = input.getMovementDirection();
    game.player.move(direction.dx, direction.dy, deltaTime);
    
    // Позиция мыши в мировых координатах
    if (renderer) {
        const worldPos = renderer.screenToWorld(input.mouseX, input.mouseY);
        game.player.mouseX = worldPos.x;
        game.player.mouseY = worldPos.y;
    }
    
    // Атака
    if (input.isAttacking()) {
        game.performAttack(game.player.mouseX, game.player.mouseY);
    }
    
    // Пауза
    if (input.isPausing()) {
        game.pause();
        const pauseScreen = document.getElementById('pause-screen');
        if (game.state === 'paused') {
            pauseScreen.classList.remove('hidden');
        } else {
            pauseScreen.classList.add('hidden');
        }
    }
    
    // Инвентарь
    if (input.isOpeningInventory()) {
        const invScreen = document.getElementById('inventory-screen');
        invScreen.classList.toggle('hidden');
        if (!invScreen.classList.contains('hidden')) {
            game.pause();
        }
    }
    
    // Активация артефакта
    if (input.isActivatingArtifact()) {
        game.player.activateArtifact();
    }
}

/**
 * Загрузка настроек
 */
function loadSettings() {
    const settings = storage.loadSettings();
    document.getElementById('setting-language').value = settings.language || 'ru';
    document.getElementById('setting-music-volume').value = settings.musicVolume || 50;
    document.getElementById('setting-sfx-volume').value = settings.sfxVolume || 50;
}

/**
 * Сохранение настроек
 */
function saveSettings() {
    const settings = {
        language: document.getElementById('setting-language').value,
        musicVolume: parseInt(document.getElementById('setting-music-volume').value),
        sfxVolume: parseInt(document.getElementById('setting-sfx-volume').value)
    };
    storage.saveSettings(settings);
}

/**
 * Показать энциклопедию
 */
function showEncyclopedia() {
    ui.showScreen('encyclopedia-screen');
    const content = document.getElementById('encyclopedia-content');
    if (content) {
        content.innerHTML = `
            <h3>ОО-78: Область Опасности</h3>
            <p>Экспериментальный проект по созданию совершенного оружия.</p>
            <br>
            <h4>Персонажи:</h4>
            <ul>
                <li>Протагон - базовый персонаж</li>
                <li>Объект 15 - боец с бластерами</li>
                <li>Тень - скрытный убийца</li>
                <li>Титан - танк с высоким здоровьем</li>
                <li>Феникс - мастер огня</li>
                <li>Герой - секретный персонаж</li>
            </ul>
            <br>
            <h4>Управление:</h4>
            <ul>
                <li>WASD / Стрелки - движение</li>
                <li>ЛКМ - атака</li>
                <li>Shift - способность</li>
                <li>Space - активный артефакт</li>
                <li>Tab - инвентарь</li>
                <li>Q - навыки</li>
                <li>Esc - пауза</li>
            </ul>
        `;
    }
}

// Автозапуск при загрузке страницы
window.addEventListener('DOMContentLoaded', init);
