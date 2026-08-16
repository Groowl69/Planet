/**
 * utils.js - Вспомогательные функции
 */

/**
 * Генерация случайного числа в диапазоне
 */
export function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Генерация случайного целого числа
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Выбор случайного элемента из массива
 */
export function randomChoice(array) {
    if (!array || array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Расчет расстояния между двумя точками
 */
export function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Проверка столкновения кругов
 */
export function circleCollision(x1, y1, r1, x2, y2, r2) {
    return distance(x1, y1, x2, y2) < (r1 + r2);
}

/**
 * Нормализация вектора
 */
export function normalizeVector(x, y) {
    const length = Math.sqrt(x * x + y * y);
    if (length === 0) return { x: 0, y: 0 };
    return { x: x / length, y: y / length };
}

/**
 * Ограничение значения диапазоном
 */
export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * Линейная интерполяция
 */
export function lerp(start, end, t) {
    return start + (end - start) * t;
}

/**
 * Форматирование времени
 */
export function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Форматирование чисел (1000 -> 1k)
 */
export function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

/**
 * Получить цвет по редкости
 */
export function getRarityColor(rarity) {
    const colors = {
        common: '#888888',
        rare: '#4CAF50',
        special: '#2196F3',
        ancient: '#9C27B0'
    };
    return colors[rarity] || '#888888';
}

/**
 * Глубокое копирование объекта
 */
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Задержка выполнения
 */
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Проверка, находится ли точка внутри полигона
 */
export function pointInPolygon(px, py, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;
        
        if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) {
            inside = !inside;
        }
    }
    return inside;
}

/**
 * Анимация плавного появления
 */
export function fadeIn(element, duration = 300) {
    element.style.opacity = 0;
    element.style.transition = `opacity ${duration}ms`;
    
    requestAnimationFrame(() => {
        element.style.opacity = 1;
    });
}

/**
 * Анимация плавного исчезновения
 */
export function fadeOut(element, duration = 300) {
    element.style.transition = `opacity ${duration}ms`;
    element.style.opacity = 0;
    
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
}

/**
 * Создать частицы для эффекта
 */
export function createParticles(count, x, y, color) {
    const particles = [];
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i;
        const speed = randomRange(50, 150);
        particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            color,
            size: randomRange(2, 5)
        });
    }
    return particles;
}

/**
 * Обновить частицы
 */
export function updateParticles(particles, deltaTime) {
    return particles.filter(p => {
        p.x += p.vx * deltaTime;
        p.y += p.vy * deltaTime;
        p.life -= deltaTime * 2;
        p.size *= 0.95;
        return p.life > 0;
    });
}

export default {
    randomRange,
    randomInt,
    randomChoice,
    distance,
    circleCollision,
    normalizeVector,
    clamp,
    lerp,
    formatTime,
    formatNumber,
    getRarityColor,
    deepClone,
    delay,
    pointInPolygon,
    fadeIn,
    fadeOut,
    createParticles,
    updateParticles
};
