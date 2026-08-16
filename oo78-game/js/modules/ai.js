/**
 * ai.js - Искусственный интеллект для противников
 */

import { CONFIG } from './config.js';
import { distance } from './utils.js';

export class AIController {
    constructor(enemy, player) {
        this.enemy = enemy;
        this.player = player;
        this.state = 'idle';
        this.targetX = enemy.x;
        this.targetY = enemy.y;
        this.patrolPoints = [];
        this.lastStateChange = 0;
        this.reactionTime = 0.5; // Задержка реакции
    }
    
    /**
     * Обновить состояние AI
     */
    update(deltaTime) {
        const now = Date.now() / 1000;
        const distToPlayer = distance(this.enemy.x, this.enemy.y, this.player.x, this.player.y);
        
        // Проверка видимости игрока
        const canSeePlayer = distToPlayer < 800 && !this.player.isHidden;
        
        switch (this.enemy.behavior) {
            case CONFIG.BEHAVIOR_PATTERNS.LINEAR_CHASER:
                this.updateLinearChaser(canSeePlayer, deltaTime);
                break;
            case CONFIG.BEHAVIOR_PATTERNS.PATROL:
                this.updatePatrol(canSeePlayer, deltaTime);
                break;
            case CONFIG.BEHAVIOR_PATTERNS.GUARDIAN:
                this.updateGuardian(canSeePlayer, deltaTime);
                break;
            case CONFIG.BEHAVIOR_PATTERNS.CUNNING:
                this.updateCunning(canSeePlayer, deltaTime);
                break;
            case CONFIG.BEHAVIOR_PATTERNS.OBSERVER:
                this.updateObserver(canSeePlayer, deltaTime);
                break;
            case CONFIG.BEHAVIOR_PATTERNS.PEACEFUL:
                this.updatePeaceful(canSeePlayer, deltaTime);
                break;
        }
        
        // Выполнение атаки
        if (distToPlayer < 50 && canSeePlayer) {
            this.performAttack();
        }
    }
    
    /**
     * Линейный преследователь - просто идет к игроку
     */
    updateLinearChaser(canSeePlayer, deltaTime) {
        if (canSeePlayer) {
            this.moveToPlayer(deltaTime);
        } else {
            this.wander(deltaTime);
        }
    }
    
    /**
     * Патрульный - ходит по точкам
     */
    updatePatrol(canSeePlayer, deltaTime) {
        if (canSeePlayer) {
            this.moveToPlayer(deltaTime);
            return;
        }
        
        // Патрулирование
        if (this.patrolPoints.length === 0) {
            this.generatePatrolPoints();
        }
        
        const currentPoint = this.patrolPoints[0];
        const distToPoint = distance(this.enemy.x, this.enemy.y, currentPoint.x, currentPoint.y);
        
        if (distToPoint < 20) {
            this.patrolPoints.shift();
        } else {
            this.moveToPoint(currentPoint.x, currentPoint.y, deltaTime);
        }
    }
    
    /**
     * Охранник - стоит на месте, атакует при приближении
     */
    updateGuardian(canSeePlayer, deltaTime) {
        if (canSeePlayer && distance(this.enemy.x, this.enemy.y, this.player.x, this.player.y) < 300) {
            this.moveToPlayer(deltaTime);
        }
        // Иначе стоит на месте
    }
    
    /**
     * Хитрый - использует тактику
     */
    updateCunning(canSeePlayer, deltaTime) {
        if (!canSeePlayer) {
            this.hide(deltaTime);
            return;
        }
        
        const dist = distance(this.enemy.x, this.enemy.y, this.player.x, this.player.y);
        
        // Если далеко - скрыться и подойти сбоку
        if (dist > 400) {
            this.flankPlayer(deltaTime);
        } else if (dist < 150) {
            // Если близко - атаковать
            this.moveToPlayer(deltaTime);
        } else {
            // Держать дистанцию
            this.maintainDistance(200, deltaTime);
        }
    }
    
    /**
     * Наблюдатель - не двигается, призывает подмогу
     */
    updateObserver(canSeePlayer, deltaTime) {
        if (canSeePlayer) {
            // Призвать подмогу с задержкой
            if (Date.now() / 1000 - this.lastStateChange > 5) {
                this.callForHelp();
                this.lastStateChange = Date.now() / 1000;
            }
        }
    }
    
    /**
     * Мирный - убегает от игрока
     */
    updatePeaceful(canSeePlayer, deltaTime) {
        if (canSeePlayer && distance(this.enemy.x, this.enemy.y, this.player.x, this.player.y) < 200) {
            this.fleeFromPlayer(deltaTime);
        } else {
            this.wander(deltaTime);
        }
    }
    
    /**
     * Движение к игроку
     */
    moveToPlayer(deltaTime) {
        const dx = this.player.x - this.enemy.x;
        const dy = this.player.y - this.enemy.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 0) {
            const speed = this.enemy.stats.speed * deltaTime;
            this.enemy.x += (dx / dist) * speed;
            this.enemy.y += (dy / dist) * speed;
        }
    }
    
    /**
     * Движение к точке
     */
    moveToPoint(x, y, deltaTime) {
        const dx = x - this.enemy.x;
        const dy = y - this.enemy.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 0) {
            const speed = this.enemy.stats.speed * deltaTime;
            this.enemy.x += (dx / dist) * speed;
            this.enemy.y += (dy / dist) * speed;
        }
    }
    
    /**
     * Блуждание
     */
    wander(deltaTime) {
        // Случайное движение
        if (Math.random() < 0.02) {
            const angle = Math.random() * Math.PI * 2;
            this.targetX = this.enemy.x + Math.cos(angle) * 100;
            this.targetY = this.enemy.y + Math.sin(angle) * 100;
        }
        
        this.moveToPoint(this.targetX, this.targetY, deltaTime);
    }
    
    /**
     * Побег от игрока
     */
    fleeFromPlayer(deltaTime) {
        const dx = this.enemy.x - this.player.x;
        const dy = this.enemy.y - this.player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 0) {
            const speed = this.enemy.stats.speed * deltaTime * 1.2; // Быстрее
            this.enemy.x += (dx / dist) * speed;
            this.enemy.y += (dy / dist) * speed;
        }
    }
    
    /**
     * Скрытность
     */
    hide(deltaTime) {
        // Поиск укрытия (реализация зависит от карты)
        this.enemy.isHidden = true;
    }
    
    /**
     * Обход с фланга
     */
    flankPlayer(deltaTime) {
        // Движение вокруг игрока
        const angle = Math.atan2(this.player.y - this.enemy.y, this.player.x - this.enemy.x);
        const flankAngle = angle + Math.PI / 2;
        const flankDist = 300;
        
        this.targetX = this.player.x + Math.cos(flankAngle) * flankDist;
        this.targetY = this.player.y + Math.sin(flankAngle) * flankDist;
        
        this.moveToPoint(this.targetX, this.targetY, deltaTime);
    }
    
    /**
     * Поддержание дистанции
     */
    maintainDistance(targetDist, deltaTime) {
        const dist = distance(this.enemy.x, this.enemy.y, this.player.x, this.player.y);
        
        if (dist < targetDist - 50) {
            this.fleeFromPlayer(deltaTime);
        } else if (dist > targetDist + 50) {
            this.moveToPlayer(deltaTime);
        }
    }
    
    /**
     * Призыв подмоги
     */
    callForHelp() {
        // Логика призыва союзников
        console.log(`${this.enemy.name} призывает подмогу!`);
    }
    
    /**
     * Атака
     */
    performAttack() {
        const now = Date.now() / 1000;
        if (now - this.enemy.lastAttack >= this.enemy.stats.attackSpeed) {
            // Атака игрока
            this.enemy.lastAttack = now;
            return true;
        }
        return false;
    }
    
    /**
     * Генерация точек патрулирования
     */
    generatePatrolPoints() {
        const centerX = this.enemy.x;
        const centerY = this.enemy.y;
        
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            this.patrolPoints.push({
                x: centerX + Math.cos(angle) * 150,
                y: centerY + Math.sin(angle) * 150
            });
        }
    }
}

export default AIController;
