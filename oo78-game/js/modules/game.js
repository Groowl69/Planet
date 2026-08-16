/**
 * game.js - Основной игровой цикл и состояние игры
 */

import { CONFIG } from './config.js';
import { Player } from './player.js';
import { createEnemy, getRandomEnemyForLocation } from './enemies.js';
import { getRandomArtifact } from './artifacts.js';
import { CHARACTERS, getCharacterById } from './characters.js';

export class Game {
    constructor() {
        this.state = 'menu'; // menu, playing, paused, dead, victory
        this.player = null;
        this.enemies = [];
        this.xpPoints = [];
        this.artifacts = [];
        this.attacks = [];
        this.currentOO = { name: 'Ромашковые поля', type: 'primary', index: 0 };
        this.weather = CONFIG.WEATHER.CLEAR;
        this.timeOfDay = 'day';
        this.gameTime = 0;
        this.dayNightCycle = 0;
        this.lastSpawnTime = 0;
        this.minimapCanvas = null;
        
        // Загрузка сохранений
        this.loadProgress();
    }
    
    /**
     * Начать новую игру
     */
    startGame(characterId) {
        const character = getCharacterById(characterId) || CHARACTERS.PROTAGON;
        this.player = new Player(character, 0, 0);
        this.player.spawnProtectionUntil = Date.now() / 1000 + CONFIG.SPAWN_PROTECTION_TIME;
        
        this.enemies = [];
        this.xpPoints = [];
        this.artifacts = [];
        this.attacks = [];
        this.currentOO = { name: 'Ромашковые поля', type: 'primary', index: 0 };
        this.weather = CONFIG.WEATHER.CLEAR;
        this.timeOfDay = 'day';
        this.gameTime = 0;
        this.dayNightCycle = 0;
        
        this.state = 'playing';
        this.spawnXpPoints();
    }
    
    /**
     * Основной цикл обновления
     */
    update(deltaTime) {
        if (this.state !== 'playing') return;
        
        // Обновление времени
        this.gameTime += deltaTime;
        this.updateDayNightCycle(deltaTime);
        this.updateWeather(deltaTime);
        
        // Обновление игрока
        this.player.update(deltaTime);
        
        // Спавн врагов
        this.spawnEnemies(deltaTime);
        
        // Обновление врагов (AI)
        this.updateEnemies(deltaTime);
        
        // Обновление атак
        this.updateAttacks(deltaTime);
        
        // Сбор XP точек
        this.collectXpPoints();
        
        // Подбор артефактов
        this.collectArtifacts();
        
        // Проверка перехода в следующую ОО
        this.checkOoTransition();
        
        // Проверка смерти
        if (this.player.currentHealth <= 0 && !this.player.usedSecondLife) {
            this.state = 'dead';
            this.saveProgress();
        }
        
        // Проверка победы (достижение края арены после убийства босса)
        const distanceFromCenter = Math.sqrt(this.player.x ** 2 + this.player.y ** 2);
        if (distanceFromCenter >= CONFIG.ARENA_RADIUS - 100 && this.player.level >= CONFIG.MAX_LEVEL) {
            this.state = 'victory';
            this.saveProgress();
        }
    }
    
    /**
     * Обновление цикла дня и ночи
     */
    updateDayNightCycle(deltaTime) {
        this.dayNightCycle += deltaTime;
        const cycleDuration = CONFIG.DAY_DURATION + CONFIG.NIGHT_DURATION;
        
        if (this.dayNightCycle > cycleDuration) {
            this.dayNightCycle = 0;
        }
        
        this.timeOfDay = this.dayNightCycle < CONFIG.DAY_DURATION ? 'day' : 'night';
    }
    
    /**
     * Обновление погоды
     */
    updateWeather(deltaTime) {
        // Погода меняется каждую минуту игрового времени
        if (Math.floor(this.gameTime) % CONFIG.WEATHER_TICK === 0 && 
            Math.floor((this.gameTime - deltaTime)) % CONFIG.WEATHER_TICK !== 0) {
            
            // Первые 10 минут всегда ясно
            if (this.gameTime < 600) {
                this.weather = CONFIG.WEATHER.CLEAR;
                return;
            }
            
            // Шанс смены погоды
            const rand = Math.random() * 100;
            let cumulative = 0;
            
            for (const [weather, chance] of Object.entries(CONFIG.WEATHER_CHANCES)) {
                cumulative += chance;
                if (rand < cumulative) {
                    this.weather = weather;
                    break;
                }
            }
            
            if (rand >= cumulative) {
                this.weather = CONFIG.WEATHER.CLEAR;
            }
        }
    }
    
    /**
     * Спавн врагов
     */
    spawnEnemies(deltaTime) {
        const now = Date.now() / 1000;
        
        // Не спавнить первые 5 секунд
        if (now - this.player.spawnProtectionUntil < 0) return;
        
        // Лимит врагов
        if (this.enemies.length >= CONFIG.MONSTERS_MAX) return;
        
        // Спавн с интервалом
        if (now - this.lastSpawnTime < 3) return;
        
        const enemyTemplate = getRandomEnemyForLocation(this.currentOO.type, this.player.level);
        if (!enemyTemplate) return;
        
        // Спавн на расстоянии от игрока
        const angle = Math.random() * Math.PI * 2;
        const distance = 400 + Math.random() * 200;
        const x = this.player.x + Math.cos(angle) * distance;
        const y = this.player.y + Math.sin(angle) * distance;
        
        // Проверка границ арены
        const distFromCenter = Math.sqrt(x * x + y * y);
        if (distFromCenter > CONFIG.ARENA_RADIUS - 100) return;
        
        const enemy = createEnemy(enemyTemplate.id, x, y);
        if (enemy) {
            this.enemies.push(enemy);
            this.lastSpawnTime = now;
        }
    }
    
    /**
     * Обновление AI врагов
     */
    updateEnemies(deltaTime) {
        for (const enemy of this.enemies) {
            const dx = this.player.x - enemy.x;
            const dy = this.player.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Движение к игроку
            if (distance > 50 && distance < 1000) {
                const speed = enemy.stats.speed * deltaTime;
                enemy.x += (dx / distance) * speed;
                enemy.y += (dy / distance) * speed;
            }
            
            // Атака игрока
            if (distance < 50) {
                const now = Date.now() / 1000;
                if (now - enemy.lastAttack > enemy.stats.attackSpeed) {
                    this.player.takeDamage(enemy.stats.damage);
                    enemy.lastAttack = now;
                }
            }
        }
    }
    
    /**
     * Обновление эффектов атак
     */
    updateAttacks(deltaTime) {
        this.attacks = this.attacks.filter(attack => {
            attack.life -= deltaTime;
            return attack.life > 0;
        });
    }
    
    /**
     * Спавн точек опыта
     */
    spawnXpPoints() {
        // Ночью точки не появляются
        if (this.timeOfDay === 'night') return;
        
        for (let i = 0; i < 10; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 200 + Math.random() * 400;
            const x = this.player.x + Math.cos(angle) * distance;
            const y = this.player.y + Math.sin(angle) * distance;
            
            // Разные цвета для разных типов ОО
            const colors = {
                'primary': ['#fff', '#ffeb3b', '#4CAF50'],
                'radioactive': ['#f44336'],
                'burning': ['#FF5722', '#FFC107'],
                'sea': ['#2196F3', '#00BCD4'],
                'valley': ['#9E9E9E']
            };
            
            const colorList = colors[this.currentOO.type] || colors['primary'];
            this.xpPoints.push({
                x,
                y,
                xp: 10 + Math.floor(Math.random() * 20),
                color: colorList[Math.floor(Math.random() * colorList.length)]
            });
        }
    }
    
    /**
     * Сбор точек опыта
     */
    collectXpPoints() {
        this.xpPoints = this.xpPoints.filter(point => {
            const dx = point.x - this.player.x;
            const dy = point.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < CONFIG.PLAYER_RADIUS + 20) {
                this.player.gainXp(point.xp);
                return false;
            }
            return true;
        });
    }
    
    /**
     * Подбор артефактов
     */
    collectArtifacts() {
        this.artifacts = this.artifacts.filter(artifact => {
            const dx = artifact.x - this.player.x;
            const dy = artifact.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < CONFIG.PLAYER_RADIUS + 30) {
                this.player.pickUpArtifact(artifact);
                return false;
            }
            return true;
        });
    }
    
    /**
     * Проверка перехода между ОО
     */
    checkOoTransition() {
        const requiredLevel = CONFIG.LEVEL_REQUIREMENTS[this.currentOO.index];
        if (this.player.level >= requiredLevel) {
            // Можно перейти в следующую ОО
            // Реализация перехода будет в UI
        }
    }
    
    /**
     * Выполнить атаку игрока
     */
    performAttack(targetX, targetY) {
        const attack = this.player.attack(targetX, targetY, 0.016);
        if (!attack) return;
        
        this.attacks.push({
            ...attack,
            life: 0.2
        });
        
        // Проверка попадания по врагам
        for (const enemy of this.enemies) {
            const dx = enemy.x - attack.x;
            const dy = enemy.y - attack.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) { // Радиус атаки
                const damage = attack.damage;
                enemy.currentHealth -= damage;
                this.player.damageDealt += damage;
                
                // Враг убит
                if (enemy.currentHealth <= 0) {
                    this.player.kills++;
                    
                    // Награда за убийство
                    this.player.gainXp(enemy.xpReward);
                    
                    // Шанс выпадения артефакта
                    if (Math.random() < enemy.artifactChance) {
                        const artifact = getRandomArtifact(enemy.artifactRarity);
                        if (artifact) {
                            this.artifacts.push({
                                ...artifact,
                                x: enemy.x,
                                y: enemy.y
                            });
                        }
                    }
                }
            }
        }
        
        // Удаление мертвых врагов
        this.enemies = this.enemies.filter(e => e.currentHealth > 0);
    }
    
    /**
     * Сохранить прогресс
     */
    saveProgress() {
        const saveData = {
            player: this.player.getSaveData(),
            currentOO: this.currentOO,
            gameTime: this.gameTime,
            unlockedCharacters: this.getUnlockedCharacters()
        };
        localStorage.setItem('oo78_save', JSON.stringify(saveData));
    }
    
    /**
     * Загрузить прогресс
     */
    loadProgress() {
        const saved = localStorage.getItem('oo78_save');
        if (saved) {
            return JSON.parse(saved);
        }
        return null;
    }
    
    /**
     * Получить список открытых персонажей
     */
    getUnlockedCharacters() {
        const unlocked = ['protagon'];
        // Логика разблокировки
        return unlocked;
    }
    
    /**
     * Пауза
     */
    pause() {
        if (this.state === 'playing') {
            this.state = 'paused';
        } else if (this.state === 'paused') {
            this.state = 'playing';
        }
    }
}

export default Game;
