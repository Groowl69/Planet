/**
 * player.js - Игрок и его механики
 * Основано на разделах 2 "Механики" и 3 "Персонажи" из ТЗ
 */

import { CONFIG } from './config.js';
import { calculateStats } from './characters.js';
import { applyArtifactEffects } from './artifacts.js';

export class Player {
    constructor(character, startX, startY) {
        this.character = character;
        this.x = startX;
        this.y = startY;
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 100;
        
        // Базовые характеристики
        this.baseStats = { ...character.baseStats };
        this.stats = calculateStats(character, 1);
        
        // Текущие значения
        this.currentHealth = this.stats.health;
        this.currentEnergy = this.stats.energy;
        
        // Состояния
        this.isMoving = false;
        this.isAttacking = false;
        this.isHidden = false;
        this.isInvincible = false;
        this.invincibleUntil = 0;
        this.hasSecondLife = true;
        this.usedSecondLife = false;
        
        // Инвентарь
        this.inventory = [];
        this.activeArtifact = null;
        this.passiveArtifacts = [];
        this.maxInventorySlots = 8;
        
        // Навыки
        this.skills = [...character.skills];
        this.evolutions = [];
        this.skillPoints = 0;
        
        // Атаки
        this.lastAttackTime = 0;
        this.attackCooldown = 0.5;
        this.comboCount = 0;
        this.lastComboTime = 0;
        
        // Эффекты
        this.buffs = [];
        this.debuffs = [];
        
        // Позиция мыши для атаки
        this.mouseX = 0;
        this.mouseY = 0;
        
        // Спавн защита
        this.spawnProtection = true;
        this.spawnProtectionUntil = 0;
        
        // Движение
        this.velocityX = 0;
        this.velocityY = 0;
        this.speedMultiplier = 1;
        
        // Статистика забега
        this.kills = 0;
        this.damageDealt = 0;
        this.damageTaken = 0;
        this.timePlayed = 0;
    }
    
    /**
     * Обновить характеристики на основе уровня и артефактов
     */
    updateStats() {
        // Пересчитать базовые статы от уровня
        this.stats = calculateStats(this.character, this.level);
        
        // Применить эффекты артефактов
        let modifiedStats = { ...this.stats };
        for (const artifact of this.passiveArtifacts) {
            modifiedStats = applyArtifactEffects(modifiedStats, artifact);
        }
        
        // Применить баффы/дебаффы
        for (const buff of this.buffs) {
            if (buff.effects) {
                modifiedStats = applyArtifactEffects(modifiedStats, { effects: buff.effects });
            }
        }
        
        for (const debuff of this.debuffs) {
            if (debuff.effects) {
                // Дебаффы работают в обратную сторону
                const negativeEffects = {};
                for (const key in debuff.effects) {
                    negativeEffects[key] = -debuff.effects[key];
                }
                modifiedStats = applyArtifactEffects(modifiedStats, { effects: negativeEffects });
            }
        }
        
        this.stats = modifiedStats;
        
        // Ограничить текущее здоровье максимальным
        if (this.currentHealth > this.stats.health) {
            this.currentHealth = this.stats.health;
        }
        if (this.currentEnergy > this.stats.energy) {
            this.currentEnergy = this.stats.energy;
        }
    }
    
    /**
     * Получить опыт
     */
    gainXp(amount) {
        if (this.level >= CONFIG.MAX_LEVEL) {
            return false; // Максимальный уровень достигнут
        }
        
        this.xp += amount;
        
        while (this.xp >= this.xpToNextLevel && this.level < CONFIG.MAX_LEVEL) {
            this.xp -= this.xpToNextLevel;
            this.levelUp();
        }
        
        this.updateStats();
        return true;
    }
    
    /**
     * Повышение уровня
     */
    levelUp() {
        this.level++;
        this.skillPoints++;
        this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.2);
        
        // Восстановить здоровье и энергию при повышении уровня
        this.currentHealth = this.stats.health;
        this.currentEnergy = this.stats.energy;
        
        return this.level;
    }
    
    /**
     * Получить урон
     */
    takeDamage(amount, damageType = 'physical') {
        if (this.isInvincible || this.spawnProtection) {
            return 0;
        }
        
        // Учесть броню
        const armorReduction = this.stats.armor || 0;
        const actualDamage = amount * (1 - armorReduction / 100);
        
        this.currentHealth -= actualDamage;
        this.damageTaken += actualDamage;
        
        // Проверка на смерть
        if (this.currentHealth <= 0) {
            return this.die();
        }
        
        return actualDamage;
    }
    
    /**
     * Смерть игрока
     */
    die() {
        // Проверка второй жизни
        if (this.hasSecondLife && !this.usedSecondLife) {
            this.usedSecondLife = true;
            this.currentHealth = this.stats.health;
            this.currentEnergy = this.stats.energy;
            return 'revived'; // Воскрешен
        }
        
        return 'dead'; // Мертв
    }
    
    /**
     * Атака
     */
    attack(targetX, targetY, deltaTime) {
        const now = Date.now() / 1000;
        
        // Проверка кулдауна
        if (now - this.lastAttackTime < this.attackCooldown) {
            return null;
        }
        
        // Проверка энергии
        const energyCost = 1 + (this.stats.damage * 0.001);
        if (this.currentEnergy < energyCost) {
            return null;
        }
        
        this.currentEnergy -= energyCost;
        this.lastAttackTime = now;
        this.isAttacking = true;
        
        // Комбо система
        if (now - this.lastComboTime < 0.5) {
            this.comboCount++;
        } else {
            this.comboCount = 1;
        }
        this.lastComboTime = now;
        
        setTimeout(() => {
            this.isAttacking = false;
        }, 200);
        
        return {
            damage: this.stats.damage,
            x: this.x,
            y: this.y,
            targetX,
            targetY,
            comboCount: this.comboCount
        };
    }
    
    /**
     * Использование активной способности
     */
    useAbility(deltaTime) {
        // Реализация зависит от эволюций и артефактов
        return null;
    }
    
    /**
     * Активация активного артефакта
     */
    activateArtifact() {
        if (!this.activeArtifact) {
            return false;
        }
        
        const now = Date.now() / 1000;
        if (this.activeArtifact.lastUsed && now - this.activeArtifact.lastUsed < this.activeArtifact.cooldown) {
            return false;
        }
        
        this.activeArtifact.lastUsed = now;
        return true;
    }
    
    /**
     * Подобрать артефакт
     */
    pickUpArtifact(artifact) {
        if (artifact.type === 'active') {
            this.activeArtifact = artifact;
            return true;
        } else {
            if (this.passiveArtifacts.length < this.maxInventorySlots) {
                this.passiveArtifacts.push(artifact);
                this.inventory.push(artifact);
                this.updateStats();
                return true;
            }
            return false; // Нет места
        }
    }
    
    /**
     * Выбросить артефакт
     */
    dropArtifact(index) {
        if (index >= 0 && index < this.passiveArtifacts.length) {
            const dropped = this.passiveArtifacts.splice(index, 1)[0];
            this.inventory = this.inventory.filter(a => a !== dropped);
            this.updateStats();
            return dropped;
        }
        return null;
    }
    
    /**
     * Движение игрока
     */
    move(dx, dy, deltaTime) {
        if (!dx && !dy) {
            this.isMoving = false;
            this.velocityX = 0;
            this.velocityY = 0;
            return;
        }
        
        this.isMoving = true;
        
        // Нормализация вектора движения
        const length = Math.sqrt(dx * dx + dy * dy);
        if (length > 0) {
            dx /= length;
            dy /= length;
        }
        
        // Применение скорости
        const speed = this.stats.speed * this.speedMultiplier * deltaTime;
        this.velocityX = dx * speed;
        this.velocityY = dy * speed;
        
        // Обновление позиции
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Ограничение ареной
        const distanceFromCenter = Math.sqrt(this.x * this.x + this.y * this.y);
        if (distanceFromCenter > CONFIG.ARENA_RADIUS - CONFIG.PLAYER_RADIUS) {
            const angle = Math.atan2(this.y, this.x);
            this.x = Math.cos(angle) * (CONFIG.ARENA_RADIUS - CONFIG.PLAYER_RADIUS);
            this.y = Math.sin(angle) * (CONFIG.ARENA_RADIUS - CONFIG.PLAYER_RADIUS);
        }
    }
    
    /**
     * Регенерация
     */
    regenerate(deltaTime) {
        // Регенерация здоровья
        if (this.currentHealth < this.stats.health) {
            this.currentHealth += this.stats.regen * deltaTime;
            if (this.currentHealth > this.stats.health) {
                this.currentHealth = this.stats.health;
            }
        }
        
        // Регенерация энергии
        if (this.currentEnergy < this.stats.energy) {
            this.currentEnergy += this.stats.energyRegen * deltaTime;
            if (this.currentEnergy > this.stats.energy) {
                this.currentEnergy = this.stats.energy;
            }
        }
    }
    
    /**
     * Обновление состояния
     */
    update(deltaTime) {
        const now = Date.now() / 1000;
        
        // Проверка инвинсибилити
        if (this.isInvincible && now > this.invincibleUntil) {
            this.isInvincible = false;
        }
        
        // Проверка спавн защиты
        if (this.spawnProtection && now > this.spawnProtectionUntil) {
            this.spawnProtection = false;
        }
        
        // Обновление баффов/дебаффов
        this.buffs = this.buffs.filter(b => b.expiresAt > now);
        this.debuffs = this.debuffs.filter(d => d.expiresAt > now);
        
        // Регенерация
        this.regenerate(deltaTime);
        
        // Время игры
        this.timePlayed += deltaTime;
    }
    
    /**
     * Добавить эффект
     */
    addEffect(effect, isBuff = true) {
        const now = Date.now() / 1000;
        const effectObj = {
            ...effect,
            expiresAt: now + (effect.duration || 0)
        };
        
        if (isBuff) {
            this.buffs.push(effectObj);
        } else {
            this.debuffs.push(effectObj);
        }
        
        this.updateStats();
    }
    
    /**
     * Получить состояние для сохранения
     */
    getSaveData() {
        return {
            characterId: this.character.id,
            x: this.x,
            y: this.y,
            level: this.level,
            xp: this.xp,
            inventory: this.inventory.map(a => a.id),
            activeArtifactId: this.activeArtifact?.id,
            kills: this.kills,
            timePlayed: this.timePlayed
        };
    }
}

export default Player;
