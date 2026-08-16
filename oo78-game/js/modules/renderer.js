/**
 * renderer.js - Рендеринг игры на Canvas
 * Отрисовка всех игровых объектов
 */

import { CONFIG } from './config.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cameraX = 0;
        this.cameraY = 0;
        this.zoom = 1;
        
        // Настройка размера canvas
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    
    /**
     * Изменить размер canvas под окно
     */
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    /**
     * Обновить камеру (следовать за игроком)
     */
    updateCamera(playerX, playerY) {
        this.cameraX = playerX - this.canvas.width / 2 / this.zoom;
        this.cameraY = playerY - this.canvas.height / 2 / this.zoom;
    }
    
    /**
     * Преобразовать координаты мира в экранные
     */
    worldToScreen(worldX, worldY) {
        return {
            x: (worldX - this.cameraX) * this.zoom,
            y: (worldY - this.cameraY) * this.zoom
        };
    }
    
    /**
     * Преобразовать экранные координаты в мировые
     */
    screenToWorld(screenX, screenY) {
        return {
            x: screenX / this.zoom + this.cameraX,
            y: screenY / this.zoom + this.cameraY
        };
    }
    
    /**
     * Очистить экран
     */
    clear() {
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Отрисовать арену
     */
    renderArena(currentOO) {
        const center = this.worldToScreen(0, 0);
        
        // Граница арены
        this.ctx.beginPath();
        this.ctx.arc(center.x, center.y, CONFIG.ARENA_RADIUS * this.zoom, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#e94560';
        this.ctx.lineWidth = 5;
        this.ctx.stroke();
        
        // Кольца ОО
        for (let i = 1; i <= 8; i++) {
            const radius = i * CONFIG.ARENA_RING_RADIUS * this.zoom;
            this.ctx.beginPath();
            this.ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(233, 69, 96, ${0.1 + i * 0.05})`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
        
        // Ландшафт текущей ОО
        this.renderTerrain(currentOO);
    }
    
    /**
     * Отрисовать ландшафт
     */
    renderTerrain(oo) {
        // Цвет фона зависит от локации
        const colors = {
            'primary': '#2d5016',
            'radioactive': '#3d6b16',
            'burning': '#8b2500',
            'sea': '#1e3a5f',
            'valley': '#4a4a4a'
        };
        
        this.ctx.fillStyle = colors[oo?.type] || colors['primary'];
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Отрисовать игрока
     */
    renderPlayer(player) {
        const pos = this.worldToScreen(player.x, player.y);
        const radius = CONFIG.PLAYER_RADIUS * this.zoom;
        
        // Тело персонажа
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = player.character.color || '#4CAF50';
        this.ctx.fill();
        
        // Обводка
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // Зрачки
        const pupilRadius = CONFIG.PUPIL_RADIUS * this.zoom;
        const eyeOffset = radius * 0.4;
        
        // Направление взгляда к мыши
        const angle = Math.atan2(player.mouseY - pos.y, player.mouseX - pos.x);
        
        for (let i = -1; i <= 1; i += 2) {
            const eyeX = pos.x + Math.cos(angle) * eyeOffset * i;
            const eyeY = pos.y + Math.sin(angle) * eyeOffset * i;
            
            this.ctx.beginPath();
            this.ctx.arc(eyeX, eyeY, pupilRadius * 2, 0, Math.PI * 2);
            this.ctx.fillStyle = '#fff';
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(eyeX + Math.cos(angle) * pupilRadius, eyeY + Math.sin(angle) * pupilRadius, pupilRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = '#000';
            this.ctx.fill();
        }
        
        // Щит спавн защиты
        if (player.spawnProtection) {
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, radius * 1.5, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(255, 235, 59, ${0.3 + Math.sin(Date.now() / 100) * 0.2})`;
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
        }
        
        // Индикатор невидимости
        if (player.isHidden) {
            this.ctx.globalAlpha = 0.5;
        }
    }
    
    /**
     * Отрисовать врагов
     */
    renderEnemies(enemies) {
        for (const enemy of enemies) {
            const pos = this.worldToScreen(enemy.x, enemy.y);
            const size = (enemy.stats?.health > 500 ? 50 : 25) * this.zoom;
            
            // Цвет зависит от типа
            let color = '#f00';
            if (enemy.status === 'boss') {
                color = '#9C27B0';
            } else if (enemy.status === 'miniboss') {
                color = '#FF5722';
            }
            
            // Тело
            this.ctx.beginPath();
            if (enemy.id === 'fish' || enemy.id === 'shark') {
                // Овал для рыб
                this.ctx.ellipse(pos.x, pos.y, size * 1.5, size, 0, 0, Math.PI * 2);
            } else {
                // Многоугольник для остальных
                const sides = enemy.id === 'stone' ? 6 : 5;
                for (let i = 0; i < sides; i++) {
                    const angle = (i / sides) * Math.PI * 2;
                    const x = pos.x + Math.cos(angle) * size;
                    const y = pos.y + Math.sin(angle) * size;
                    if (i === 0) {
                        this.ctx.moveTo(x, y);
                    } else {
                        this.ctx.lineTo(x, y);
                    }
                }
                this.ctx.closePath();
            }
            
            this.ctx.fillStyle = color;
            this.ctx.fill();
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Полоска здоровья
            if (enemy.currentHealth < enemy.stats.health) {
                const barWidth = size * 2;
                const barHeight = 5;
                const healthPercent = enemy.currentHealth / enemy.stats.health;
                
                this.ctx.fillStyle = '#333';
                this.ctx.fillRect(pos.x - barWidth / 2, pos.y - size - 10, barWidth, barHeight);
                
                this.ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : healthPercent > 0.25 ? '#FFC107' : '#f44336';
                this.ctx.fillRect(pos.x - barWidth / 2, pos.y - size - 10, barWidth * healthPercent, barHeight);
            }
        }
    }
    
    /**
     * Отрисовать точки опыта
     */
    renderXpPoints(points) {
        for (const point of points) {
            const pos = this.worldToScreen(point.x, point.y);
            
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, 8 * this.zoom, 0, Math.PI * 2);
            this.ctx.fillStyle = point.color || '#4CAF50';
            this.ctx.fill();
            
            // Свечение
            this.ctx.shadowColor = point.color || '#4CAF50';
            this.ctx.shadowBlur = 10;
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
        }
    }
    
    /**
     * Отрисовать артефакты на земле
     */
    renderArtifacts(artifacts) {
        for (const artifact of artifacts) {
            const pos = this.worldToScreen(artifact.x, artifact.y);
            
            // Цвет редкости
            const rarityColors = {
                common: '#888',
                rare: '#4CAF50',
                special: '#2196F3',
                ancient: '#9C27B0'
            };
            
            this.ctx.beginPath();
            this.ctx.rect(pos.x - 15 * this.zoom, pos.y - 15 * this.zoom, 30 * this.zoom, 30 * this.zoom);
            this.ctx.fillStyle = rarityColors[artifact.rarity] || '#888';
            this.ctx.fill();
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Пульсация
            const pulse = Math.sin(Date.now() / 200) * 0.2 + 0.8;
            this.ctx.globalAlpha = pulse;
            this.ctx.stroke();
            this.ctx.globalAlpha = 1;
        }
    }
    
    /**
     * Отрисовать эффекты атаки
     */
    renderAttackEffects(attacks) {
        for (const attack of attacks) {
            const fromPos = this.worldToScreen(attack.x, attack.y);
            const toPos = this.worldToScreen(attack.targetX, attack.targetY);
            
            // Линия атаки
            this.ctx.beginPath();
            this.ctx.moveTo(fromPos.x, fromPos.y);
            this.ctx.lineTo(toPos.x, toPos.y);
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${attack.life || 1})`;
            this.ctx.lineWidth = 5 * this.zoom;
            this.ctx.stroke();
            
            // Взрыв в точке попадания
            if (attack.explosion) {
                this.ctx.beginPath();
                this.ctx.arc(toPos.x, toPos.y, attack.explosionRadius * this.zoom, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 100, 0, ${attack.life || 0.5})`;
                this.ctx.fill();
            }
        }
    }
    
    /**
     * Отрисовать погоду
     */
    renderWeather(weather, timeOfDay) {
        const effects = {
            rain: () => this.renderRain(),
            downpour: () => this.renderRain(true),
            storm: () => { this.renderRain(true); this.renderDarkSky(0.3); },
            fog: () => this.renderFog(),
            thunderstorm: () => { this.renderRain(true); this.renderLightning(); },
            red_moon: () => this.renderRedMoon()
        };
        
        if (effects[weather]) {
            effects[weather]();
        }
        
        // Ночь
        if (timeOfDay === 'night') {
            this.renderDarkSky(0.4);
        }
    }
    
    renderRain(heavy = false) {
        this.ctx.strokeStyle = 'rgba(100, 150, 255, 0.5)';
        this.ctx.lineWidth = heavy ? 2 : 1;
        this.ctx.beginPath();
        
        for (let i = 0; i < (heavy ? 200 : 100); i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x - 5, y + 20);
        }
        
        this.ctx.stroke();
    }
    
    renderFog() {
        this.ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    renderDarkSky(alpha = 0.4) {
        this.ctx.fillStyle = `rgba(0, 0, 30, ${alpha})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    renderLightning() {
        if (Math.random() < 0.01) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    renderRedMoon() {
        this.ctx.fillStyle = 'rgba(100, 0, 0, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Отрисовать миникарту
     */
    renderMinimap(minimapCanvas, player, enemies, xpPoints, currentOO) {
        const ctx = minimapCanvas.getContext('2d');
        const size = minimapCanvas.width;
        const scale = size / (CONFIG.ARENA_RADIUS * 2);
        
        // Очистка
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, size, size);
        
        // Центр
        const centerX = size / 2;
        const centerY = size / 2;
        
        // Кольца ОО
        for (let i = 1; i <= 8; i++) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, i * CONFIG.ARENA_RING_RADIUS * scale, 0, Math.PI * 2);
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        
        // Игрок
        const playerX = centerX + player.x * scale;
        const playerY = centerY + player.y * scale;
        
        ctx.beginPath();
        ctx.arc(playerX, playerY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#4CAF50';
        ctx.fill();
        
        // Враги в радиусе видимости
        ctx.fillStyle = '#f00';
        for (const enemy of enemies) {
            const dx = enemy.x - player.x;
            const dy = enemy.y - player.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 1000) { // Радиус видимости
                ctx.beginPath();
                ctx.arc(centerX + enemy.x * scale, centerY + enemy.y * scale, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Граница арены
        ctx.beginPath();
        ctx.arc(centerX, centerY, CONFIG.ARENA_RADIUS * scale, 0, Math.PI * 2);
        ctx.strokeStyle = '#e94560';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    /**
     * Главный метод рендеринга
     */
    render(gameState) {
        this.clear();
        this.updateCamera(gameState.player.x, gameState.player.y);
        
        this.renderArena(gameState.currentOO);
        this.renderXpPoints(gameState.xpPoints);
        this.renderArtifacts(gameState.artifacts);
        this.renderEnemies(gameState.enemies);
        this.renderPlayer(gameState.player);
        this.renderAttackEffects(gameState.attacks);
        this.renderWeather(gameState.weather, gameState.timeOfDay);
        
        // Миникарта
        if (gameState.minimapCanvas) {
            this.renderMinimap(
                gameState.minimapCanvas,
                gameState.player,
                gameState.enemies,
                gameState.xpPoints,
                gameState.currentOO
            );
        }
    }
}

export default Renderer;
