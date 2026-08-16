/**
 * ui.js - Управление UI и HUD
 */

import { CONFIG } from './config.js';

export class UIManager {
    constructor(game) {
        this.game = game;
        this.elements = {};
        this.setupElements();
    }
    
    setupElements() {
        // HUD элементы
        this.elements = {
            currentLevel: document.getElementById('current-level'),
            xpFill: document.getElementById('xp-fill'),
            currentHp: document.getElementById('current-hp'),
            maxHp: document.getElementById('max-hp'),
            healthFill: document.getElementById('health-fill'),
            currentEnergy: document.getElementById('current-energy'),
            maxEnergy: document.getElementById('max-energy'),
            energyFill: document.getElementById('energy-fill'),
            dayNightIndicator: document.getElementById('day-night-indicator'),
            weatherIndicator: document.getElementById('weather-indicator'),
            gameTime: document.getElementById('game-time'),
            statusEffects: document.getElementById('status-effects'),
            minimap: document.getElementById('minimap'),
            inventorySlots: document.getElementById('inventory-slots')
        };
    }
    
    /**
     * Обновить HUD
     */
    updateHud() {
        if (!this.game.player) return;
        
        const player = this.game.player;
        
        // Уровень и XP
        if (this.elements.currentLevel) {
            this.elements.currentLevel.textContent = player.level;
        }
        if (this.elements.xpFill) {
            const xpPercent = (player.xp / player.xpToNextLevel) * 100;
            this.elements.xpFill.style.width = `${xpPercent}%`;
        }
        
        // Здоровье
        if (this.elements.currentHp) {
            this.elements.currentHp.textContent = Math.floor(player.currentHealth);
        }
        if (this.elements.maxHp) {
            this.elements.maxHp.textContent = Math.floor(player.stats.health);
        }
        if (this.elements.healthFill) {
            const hpPercent = (player.currentHealth / player.stats.health) * 100;
            this.elements.healthFill.style.width = `${hpPercent}%`;
            
            // Красный экран при низком HP
            if (hpPercent < 15) {
                document.body.classList.add('critical-health');
            } else {
                document.body.classList.remove('critical-health');
            }
        }
        
        // Энергия
        if (this.elements.currentEnergy) {
            this.elements.currentEnergy.textContent = Math.floor(player.currentEnergy);
        }
        if (this.elements.maxEnergy) {
            this.elements.maxEnergy.textContent = Math.floor(player.stats.energy);
        }
        if (this.elements.energyFill) {
            const energyPercent = (player.currentEnergy / player.stats.energy) * 100;
            this.elements.energyFill.style.width = `${energyPercent}%`;
        }
        
        // День/ночь
        if (this.elements.dayNightIndicator) {
            this.elements.dayNightIndicator.textContent = this.game.timeOfDay === 'day' ? 'День' : 'Ночь';
        }
        
        // Погода
        if (this.elements.weatherIndicator) {
            const weatherNames = {
                [CONFIG.WEATHER.CLEAR]: 'Ясно',
                [CONFIG.WEATHER.RAIN]: 'Дождь',
                [CONFIG.WEATHER.DOWNPOUR]: 'Ливень',
                [CONFIG.WEATHER.STORM]: 'Шторм',
                [CONFIG.WEATHER.FOG]: 'Туман',
                [CONFIG.WEATHER.THUNDERSTORM]: 'Гроза',
                [CONFIG.WEATHER.EARTHQUAKE]: 'Землетрясение',
                [CONFIG.WEATHER.RED_MOON]: 'Красная луна'
            };
            this.elements.weatherIndicator.textContent = weatherNames[this.game.weather] || 'Ясно';
        }
        
        // Время игры
        if (this.elements.gameTime) {
            const minutes = Math.floor(this.game.gameTime / 60);
            const seconds = Math.floor(this.game.gameTime % 60);
            this.elements.gameTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // Эффекты
        this.updateStatusEffects();
        
        // Инвентарь
        this.updateInventory();
    }
    
    /**
     * Обновить статусные эффекты
     */
    updateStatusEffects() {
        if (!this.elements.statusEffects) return;
        
        this.elements.statusEffects.innerHTML = '';
        
        const player = this.game.player;
        
        // Баффы
        for (const buff of player.buffs) {
            const effectEl = document.createElement('div');
            effectEl.className = 'status-effect';
            effectEl.style.borderColor = '#4CAF50';
            effectEl.textContent = buff.name?.[0] || '+';
            this.elements.statusEffects.appendChild(effectEl);
        }
        
        // Дебаффы
        for (const debuff of player.debuffs) {
            const effectEl = document.createElement('div');
            effectEl.className = 'status-effect';
            effectEl.style.borderColor = '#f44336';
            effectEl.textContent = debuff.name?.[0] || '-';
            this.elements.statusEffects.appendChild(effectEl);
        }
    }
    
    /**
     * Обновить инвентарь
     */
    updateInventory() {
        if (!this.elements.inventorySlots) return;
        
        this.elements.inventorySlots.innerHTML = '';
        
        const player = this.game.player;
        
        // Пассивные артефакты
        for (let i = 0; i < player.maxInventorySlots; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            
            if (player.passiveArtifacts[i]) {
                const artifact = player.passiveArtifacts[i];
                slot.classList.add(`rarity-${artifact.rarity}`);
                slot.title = `${artifact.name}\n${artifact.description}`;
                
                const icon = document.createElement('div');
                icon.className = 'artifact-icon';
                icon.style.background = this.getRarityColor(artifact.rarity);
                slot.appendChild(icon);
            }
            
            this.elements.inventorySlots.appendChild(slot);
        }
        
        // Активный артефакт
        if (player.activeArtifact) {
            const activeSlot = document.createElement('div');
            activeSlot.className = 'inventory-slot active';
            activeSlot.title = `${player.activeArtifact.name} (Активный)`;
            
            const icon = document.createElement('div');
            icon.className = 'artifact-icon';
            icon.style.background = '#9C27B0';
            activeSlot.appendChild(icon);
            
            this.elements.inventorySlots.appendChild(activeSlot);
        }
    }
    
    getRarityColor(rarity) {
        const colors = {
            common: '#888',
            rare: '#4CAF50',
            special: '#2196F3',
            ancient: '#9C27B0'
        };
        return colors[rarity] || '#888';
    }
    
    /**
     * Показать модальное окно
     */
    showModal(title, text) {
        const modal = document.getElementById('modal-overlay');
        const modalTitle = document.getElementById('modal-title');
        const modalText = document.getElementById('modal-text');
        const modalClose = document.getElementById('modal-close');
        
        if (modal && modalTitle && modalText) {
            modalTitle.textContent = title;
            modalText.textContent = text;
            modal.classList.remove('hidden');
            
            modalClose.onclick = () => {
                modal.classList.add('hidden');
            };
        }
    }
    
    /**
     * Добавить сообщение в чат
     */
    addChatMessage(message, type = 'system') {
        const chatBox = document.getElementById('chat-box');
        if (!chatBox) return;
        
        const messageEl = document.createElement('div');
        messageEl.className = 'chat-message';
        messageEl.textContent = message;
        
        if (type === 'error') {
            messageEl.style.color = '#f44336';
        } else if (type === 'success') {
            messageEl.style.color = '#4CAF50';
        } else if (type === 'warning') {
            messageEl.style.color = '#FFC107';
        }
        
        chatBox.appendChild(messageEl);
        chatBox.scrollTop = chatBox.scrollHeight;
        
        // Удалять старые сообщения
        while (chatBox.children.length > 20) {
            chatBox.removeChild(chatBox.firstChild);
        }
    }
    
    /**
     * Скрыть все экраны
     */
    hideAllScreens() {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
    }
    
    /**
     * Показать экран
     */
    showScreen(screenId) {
        this.hideAllScreens();
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
        }
    }
}

export default UIManager;
