/**
 * enemies.js - Противники и их характеристики
 * Основано на разделе 3.3 "Противники" из ТЗ
 */

import { CONFIG } from './config.js';

export const ENEMIES = {
    // Базовые противники для первых ОО
    MUSHROOM: {
        id: 'mushroom',
        name: 'Гриб',
        stats: {
            damage: 15,
            health: 80,
            armor: 0,
            speed: 60,
            attackSpeed: 2,
            secondLife: false,
            regen: 0
        },
        abilities: {
            active: null,
            passive: null
        },
        appearance: 'Пятиугольник зеленого цвета с треугольными кулаками',
        xpReward: 30,
        artifactChance: 0.1,
        artifactRarity: 'common',
        status: 'enemy',
        behavior: CONFIG.BEHAVIOR_PATTERNS.LINEAR_CHASER,
        features: 'Нет'
    },
    
    STONE: {
        id: 'stone',
        name: 'Камень',
        stats: {
            damage: 25,
            health: 150,
            armor: 20,
            speed: 40,
            attackSpeed: 2.5,
            secondLife: false,
            regen: 0
        },
        abilities: {
            active: null,
            passive: 'Каменная кожа - снижает урон от немагических атак'
        },
        appearance: 'Шестиугольник серого цвета',
        xpReward: 50,
        artifactChance: 0.15,
        artifactRarity: 'common',
        status: 'enemy',
        behavior: CONFIG.BEHAVIOR_PATTERNS.PATROL,
        features: 'Нет'
    },
    
    FISH: {
        id: 'fish',
        name: 'Рыба',
        stats: {
            damage: 20,
            health: 60,
            armor: 0,
            speed: 100,
            attackSpeed: 1.5,
            secondLife: false,
            regen: 0
        },
        abilities: {
            active: 'Рывок - быстрое приближение к игроку',
            passive: null
        },
        appearance: 'Овал синего цвета с плавниками',
        xpReward: 40,
        artifactChance: 0.1,
        artifactRarity: 'common',
        status: 'enemy',
        behavior: CONFIG.BEHAVIOR_PATTERNS.LINEAR_CHASER,
        features: 'Только в водной среде'
    },
    
    BANDIT: {
        id: 'bandit',
        name: 'Бандит',
        stats: {
            damage: 35,
            health: 120,
            armor: 10,
            speed: 90,
            attackSpeed: 1.8,
            secondLife: false,
            regen: 2
        },
        abilities: {
            active: 'Удар в спину - критический удар при атаке из скрытности',
            passive: 'Скрытность - не виден издалека'
        },
        appearance: 'Человекоподобный с оружием',
        xpReward: 70,
        artifactChance: 0.2,
        artifactRarity: 'common',
        status: 'enemy',
        behavior: CONFIG.BEHAVIOR_PATTERNS.CUNNING,
        features: 'Может украсть артефакт'
    },
    
    OBSERVER: {
        id: 'observer',
        name: 'Наблюдатель',
        stats: {
            damage: 10,
            health: 50,
            armor: 0,
            speed: 30,
            attackSpeed: 3,
            secondLife: false,
            regen: 0
        },
        abilities: {
            active: 'Сигнал - призывает подмогу (2 ближайших врага)',
            passive: 'Разоблачение - снимает скрытность с игрока'
        },
        appearance: 'Глаз с лучами',
        xpReward: 60,
        artifactChance: 0.05,
        artifactRarity: 'rare',
        status: 'enemy',
        behavior: CONFIG.BEHAVIOR_PATTERNS.OBSERVER,
        features: 'Не двигается с места'
    },
    
    // Особые противники по локациям
    RADIOACTIVE_MUTANT: {
        id: 'radioactive_mutant',
        name: 'Радиоактивный мутант',
        stats: {
            damage: 40,
            health: 200,
            armor: 15,
            speed: 70,
            attackSpeed: 2,
            secondLife: false,
            regen: 5
        },
        abilities: {
            active: 'Радиоактивный плевок - накладывает радиацию',
            passive: 'Иммунитет к радиации'
        },
        appearance: 'Деформированное существо зеленого свечения',
        xpReward: 100,
        artifactChance: 0.25,
        artifactRarity: 'rare',
        status: 'enemy',
        behavior: CONFIG.BEHAVIOR_PATTERNS.LINEAR_CHASER,
        features: 'Только в Радиоактивном лесу'
    },
    
    SAW_BOT: {
        id: 'saw_bot',
        name: 'Пилобот',
        stats: {
            damage: 60,
            health: 180,
            armor: 30,
            speed: 80,
            attackSpeed: 1.5,
            secondLife: false,
            regen: 0
        },
        abilities: {
            active: 'Вращение - урон по площади вокруг',
            passive: 'Электромагнитная защита'
        },
        appearance: 'Робот с циркулярными пилами',
        xpReward: 120,
        artifactChance: 0.2,
        artifactRarity: 'special',
        status: 'enemy',
        behavior: CONFIG.BEHAVIOR_PATTERNS.PATROL,
        features: 'Только в Коварной долине'
    },
    
    SHARK: {
        id: 'shark',
        name: 'Акула',
        stats: {
            damage: 80,
            health: 250,
            armor: 20,
            speed: 150,
            attackSpeed: 2,
            secondLife: false,
            regen: 3
        },
        abilities: {
            active: 'Кусь - мощный укус',
            passive: 'Ускорение в воде'
        },
        appearance: 'Большая акула с острыми зубами',
        xpReward: 150,
        artifactChance: 0.15,
        artifactRarity: 'rare',
        status: 'enemy',
        behavior: CONFIG.BEHAVIOR_PATTERNS.LINEAR_CHASER,
        features: 'Только в Море раздора, только в воде'
    },
    
    LAVA_GOLEM: {
        id: 'lava_golem',
        name: 'Лавовый голем',
        stats: {
            damage: 100,
            health: 400,
            armor: 40,
            speed: 50,
            attackSpeed: 3,
            secondLife: false,
            regen: 10
        },
        abilities: {
            active: 'Извержение - создает лавовую зону',
            passive: 'Горящее тело - урон врагам рядом'
        },
        appearance: 'Голем из лавы и камней',
        xpReward: 200,
        artifactChance: 0.3,
        artifactRarity: 'special',
        status: 'enemy',
        behavior: CONFIG.BEHAVIOR_PATTERNS.GUARDIAN,
        features: 'Только в Горящих землях, иммунитет к огню'
    },
    
    // Мини-боссы
    DEMON: {
        id: 'demon',
        name: 'Демон',
        stats: {
            damage: 150,
            health: 1000,
            armor: 25,
            speed: 100,
            attackSpeed: 1.5,
            secondLife: true,
            regen: 15
        },
        abilities: {
            active: 'Огненный шар - урон по площади',
            passive: 'Призыв миньонов'
        },
        appearance: 'Крылатый демон с огнем',
        xpReward: 500,
        artifactChance: 0.5,
        artifactRarity: 'ancient',
        status: 'miniboss',
        behavior: CONFIG.BEHAVIOR_PATTERNS.LINEAR_CHASER,
        features: 'Босс Арены 7'
    },
    
    // Главные боссы локаций
    FOREST_BOSS: {
        id: 'forest_boss',
        name: 'Хранитель Леса',
        stats: {
            damage: 200,
            health: 5000,
            armor: 30,
            speed: 80,
            attackSpeed: 2,
            secondLife: true,
            regen: 50
        },
        abilities: {
            active: 'Радиоактивная буря - урон по всей арене',
            passive: 'Мутация - случайные изменения характеристик игрока'
        },
        appearance: 'Огромное мутировавшее дерево',
        xpReward: 2000,
        artifactChance: 1,
        artifactRarity: 'ancient',
        status: 'boss',
        behavior: CONFIG.BEHAVIOR_PATTERNS.GUARDIAN,
        features: 'Босс Радиоактивного леса, выпадает Сердце леса'
    },
    
    VALLEY_BOSS: {
        id: 'valley_boss',
        name: 'Механический Тиран',
        stats: {
            damage: 250,
            health: 6000,
            armor: 50,
            speed: 60,
            attackSpeed: 1.5,
            secondLife: true,
            regen: 40
        },
        abilities: {
            active: 'Лазерный луч - огромный урон по линии',
            passive: 'Щит - поглощает 50% урона'
        },
        appearance: 'Огромный боевой робот',
        xpReward: 2500,
        artifactChance: 1,
        artifactRarity: 'ancient',
        status: 'boss',
        behavior: CONFIG.BEHAVIOR_PATTERNS.GUARDIAN,
        features: 'Босс Коварной долины, выпадает Ядро долины'
    },
    
    SEA_BOSS: {
        id: 'sea_boss',
        name: 'Левиафан',
        stats: {
            damage: 180,
            health: 7000,
            armor: 20,
            speed: 120,
            attackSpeed: 2.5,
            secondLife: true,
            regen: 60
        },
        abilities: {
            active: 'Цунами - затопляет арену',
            passive: 'Водоворот - притягивает игрока'
        },
        appearance: 'Гигантское морское чудовище',
        xpReward: 3000,
        artifactChance: 1,
        artifactRarity: 'ancient',
        status: 'boss',
        behavior: CONFIG.BEHAVIOR_PATTERNS.LINEAR_CHASER,
        features: 'Босс Моря раздора, выпадает Глубинный кристалл'
    },
    
    BURNING_BOSS: {
        id: 'burning_boss',
        name: 'Повелитель Пламени',
        stats: {
            damage: 300,
            health: 8000,
            armor: 35,
            speed: 90,
            attackSpeed: 1.8,
            secondLife: true,
            regen: 80
        },
        abilities: {
            active: 'Адский огонь - поджигает всю арену',
            passive: 'Лава - создает лавовые озера'
        },
        appearance: 'Огненный гигант',
        xpReward: 4000,
        artifactChance: 1,
        artifactRarity: 'ancient',
        status: 'boss',
        behavior: CONFIG.BEHAVIOR_PATTERNS.GUARDIAN,
        features: 'Босс Горящих земель, выпадает Пепельное сердце'
    },
    
    DEVIL: {
        id: 'devil',
        name: 'Дьявол',
        stats: {
            damage: 500,
            health: 15000,
            armor: 50,
            speed: 110,
            attackSpeed: 1.2,
            secondLife: true,
            regen: 100
        },
        abilities: {
            active: 'Апокалипсис - комбо всех способностей',
            passive: 'Темная аура - ослабляет игрока'
        },
        appearance: 'Темный властелин Ада',
        xpReward: 10000,
        artifactChance: 1,
        artifactRarity: 'ancient',
        status: 'final_boss',
        behavior: CONFIG.BEHAVIOR_PATTERNS.LINEAR_CHASER,
        features: 'Финальный босс в Аду, открывает Героя'
    }
};

/**
 * Получить противника по ID
 */
export function getEnemyById(id) {
    for (const key in ENEMIES) {
        if (ENEMIES[key].id === id) {
            return ENEMIES[key];
        }
    }
    return null;
}

/**
 * Получить случайного противника для локации
 */
export function getRandomEnemyForLocation(location, level) {
    const locationEnemies = {
        'primary': ['mushroom', 'stone'],
        'radioactive': ['radioactive_mutant', 'mushroom'],
        'valley': ['saw_bot', 'stone'],
        'sea': ['shark', 'fish'],
        'burning': ['lava_golem', 'bandit']
    };
    
    const enemyIds = locationEnemies[location] || ['mushroom'];
    const randomId = enemyIds[Math.floor(Math.random() * enemyIds.length)];
    return getEnemyById(randomId);
}

/**
 * Создать экземпляр противника
 */
export function createEnemy(enemyType, x, y) {
    const template = getEnemyById(enemyType);
    if (!template) return null;
    
    return {
        ...template,
        x,
        y,
        currentHealth: template.stats.health,
        state: 'idle',
        targetX: x,
        targetY: y,
        patrolPoints: [],
        lastAttack: 0,
        effects: []
    };
}

export default ENEMIES;
