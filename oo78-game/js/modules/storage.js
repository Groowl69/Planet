/**
 * storage.js - Сохранение и загрузка прогресса
 */

export class StorageManager {
    constructor() {
        this.saveSlots = 3;
        this.currentSlot = 1;
    }
    
    /**
     * Сохранить игру в указанный слот
     */
    saveGame(slot, data) {
        try {
            const key = `oo78_save_${slot}`;
            localStorage.setItem(key, JSON.stringify({
                ...data,
                timestamp: Date.now(),
                slot: slot
            }));
            return true;
        } catch (e) {
            console.error('Ошибка сохранения:', e);
            return false;
        }
    }
    
    /**
     * Загрузить игру из указанного слота
     */
    loadGame(slot) {
        try {
            const key = `oo78_save_${slot}`;
            const saved = localStorage.getItem(key);
            if (saved) {
                return JSON.parse(saved);
            }
            return null;
        } catch (e) {
            console.error('Ошибка загрузки:', e);
            return null;
        }
    }
    
    /**
     * Удалить сохранение из слота
     */
    deleteSave(slot) {
        try {
            const key = `oo78_save_${slot}`;
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Ошибка удаления:', e);
            return false;
        }
    }
    
    /**
     * Получить информацию о всех сохранениях
     */
    getAllSaves() {
        const saves = [];
        for (let i = 1; i <= this.saveSlots; i++) {
            const save = this.loadGame(i);
            if (save) {
                saves.push({
                    slot: i,
                    timestamp: save.timestamp,
                    characterId: save.player?.characterId,
                    level: save.player?.level,
                    gameTime: save.gameTime
                });
            } else {
                saves.push({ slot: i, empty: true });
            }
        }
        return saves;
    }
    
    /**
     * Сохранить настройки
     */
    saveSettings(settings) {
        try {
            localStorage.setItem('oo78_settings', JSON.stringify(settings));
            return true;
        } catch (e) {
            console.error('Ошибка сохранения настроек:', e);
            return false;
        }
    }
    
    /**
     * Загрузить настройки
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem('oo78_settings');
            if (saved) {
                return JSON.parse(saved);
            }
            return this.getDefaultSettings();
        } catch (e) {
            console.error('Ошибка загрузки настроек:', e);
            return this.getDefaultSettings();
        }
    }
    
    /**
     * Настройки по умолчанию
     */
    getDefaultSettings() {
        return {
            language: 'ru',
            musicVolume: 50,
            sfxVolume: 50,
            keyBindings: {
                up: ['KeyW', 'ArrowUp'],
                down: ['KeyS', 'ArrowDown'],
                left: ['KeyA', 'ArrowLeft'],
                right: ['KeyD', 'ArrowRight']
            }
        };
    }
    
    /**
     * Сохранить разблокированный контент
     */
    saveUnlockedContent(unlockedData) {
        try {
            localStorage.setItem('oo78_unlocked', JSON.stringify(unlockedData));
            return true;
        } catch (e) {
            console.error('Ошибка сохранения разблокировок:', e);
            return false;
        }
    }
    
    /**
     * Загрузить разблокированный контент
     */
    loadUnlockedContent() {
        try {
            const saved = localStorage.getItem('oo78_unlocked');
            if (saved) {
                return JSON.parse(saved);
            }
            return {
                unlockedCharacters: ['protagon'],
                defeatedBosses: [],
                collectedArtifacts: []
            };
        } catch (e) {
            console.error('Ошибка загрузки разблокировок:', e);
            return {
                unlockedCharacters: ['protagon'],
                defeatedBosses: [],
                collectedArtifacts: []
            };
        }
    }
    
    /**
     * Очистить все данные
     */
    clearAllData() {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('oo78_')) {
                localStorage.removeItem(key);
                i--;
            }
        }
    }
}

export default StorageManager;
