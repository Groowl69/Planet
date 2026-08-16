/**
 * config.js - Глобальные константы и конфигурация игры
 * Основано на разделе 11 "Глобальные константы" из ТЗ
 */

export const CONFIG = {
    // Размеры арены
    ARENA_RADIUS: 25000,
    PLAYER_RADIUS: 25,
    FIST_RADIUS: 12,
    PUPIL_RADIUS: 2.5,
    ARENA_RING_RADIUS: 1250,
    LAKE_RADIUS_MIN: 150,
    LAKE_RADIUS_MAX: 500,
    
    // Движение
    BASE_SPEED: 125, // Px/сек
    ACCELERATION_TIME: 0.2, // сек до максимальной скорости
    
    // Размеры NPC
    NPC_SIZE_MIN: 12.5,
    NPC_SIZE_MAX: 75,
    
    // Уровни и переходы между ОО
    LEVEL_REQUIREMENTS: [8, 15, 22, 29, 36, 43, 50, 57, 64, 71],
    MAX_LEVEL: 78,
    LEVELS_PER_OO: 8,
    
    // Цикл дня и ночи
    DAY_DURATION: 600, // 10 минут в секундах
    NIGHT_DURATION: 300, // 5 минут в секундах
    WEATHER_TICK: 60, // 1 минута игрового времени
    
    // Спавн монстров
    MONSTERS_MIN: 5,
    MONSTERS_MAX: 7,
    TRAPS_MIN: 3,
    TRAPS_MAX: 4,
    SPAWN_PROTECTION_TIME: 5, // секунд
    
    // Характеристики по умолчанию
    DEFAULT_STATS: {
        baseDamage: 50,
        baseHealth: 500,
        baseRegen: 5,
        baseEnergy: 100,
        baseEnergyRegen: 10,
        baseAgility: 10,
        baseSpeed: 125,
        armor: 0,
        resistance: 0,
        lifeSteal: 0
    },
    
    // Формулы характеристик (раздел 3.1)
    FORMULAS: {
        damage: (base, level) => base + 9.031 * level + 0.969 * level ** 2,
        health: (base, level) => base + 47.94 * level + 2.06 * level ** 2,
        regen: (base, level) => base + 5 * level,
        energy: (base, level) => base + level,
        energyRegen: (base, level) => base + 0.5 * level,
        agility: (base, level) => Math.max(7, base - 0.03 * level),
        speed: (base, level) => Math.min(5, base + 10 * level / 125),
        resistance: (level) => Math.min(7, level),
        lifeSteal: (level) => Math.min(7, level * 5)
    },
    
    // Типы локаций
    LOCATIONS: {
        PRIMARY: 'primary',
        RADIOACTIVE_FOREST: 'radioactive',
        BURNING_LANDS: 'burning',
        SEA_OF_STRIFE: 'sea',
        CUNNING_VALLEY: 'valley'
    },
    
    // Названия ОО
    OO_NAMES: [
        'Ромашковые поля',
        'Речные луга',
        'Холмы',
        'Железные горы',
        'Радиоактивный лес',
        'Горящие земли',
        'Море раздора',
        'Коварная долина'
    ],
    
    // Погодные явления
    WEATHER: {
        CLEAR: 'clear',
        RAIN: 'rain',
        DOWNPOUR: 'downpour',
        STORM: 'storm',
        FOG: 'fog',
        THUNDERSTORM: 'thunderstorm',
        EARTHQUAKE: 'earthquake',
        RED_MOON: 'red_moon'
    },
    
    // Шансы погоды
    WEATHER_CHANCES: {
        rain: 2,
        downpour: 1,
        storm: 0.5,
        fog: 0.5,
        thunderstorm: 4,
        earthquake: 1,
        red_moon: 0.5
    },
    
    // Редкость артефактов
    ARTIFACT_RARITY: {
        COMMON: 'common',
        RARE: 'rare',
        SPECIAL: 'special',
        ANCIENT: 'ancient'
    },
    
    // Паттерны поведения противников
    BEHAVIOR_PATTERNS: {
        LINEAR_CHASER: 'linear_chaser',
        PATROL: 'patrol',
        GUARDIAN: 'guardian',
        CUNNING: 'cunning',
        OBSERVER: 'observer',
        PEACEFUL: 'peaceful'
    },
    
    // Dev команды
    DEV_COMMANDS: {
        LEVEL_UP: 'ъ',
        TOGGLE_GOD_MODE: 'х',
        KILL_ALL_ENEMIES: 'щ',
        TELEPORT_CLICK: 'Клик по мини-карте'
    }
};

export default CONFIG;
