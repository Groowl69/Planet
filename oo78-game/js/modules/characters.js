/**
 * characters.js - Персонажи и их характеристики
 * Основано на разделе 3 "Персонажи и враги" из ТЗ
 */

import { CONFIG } from './config.js';

export const CHARACTERS = {
    PROTAGON: {
        id: 'protagon',
        name: 'Протагон',
        description: 'Базовый персонаж, сбалансированные характеристики',
        locked: false,
        baseStats: {
            damage: 50,
            health: 500,
            regen: 5,
            energy: 100,
            energyRegen: 10,
            agility: 10,
            speed: 125,
            secondLife: 0,
            resistance: 0,
            lifeSteal: 0,
            battery: 100,
            combatZone: 2,
            geneticMastery: 0
        },
        skills: [
            { name: 'Базовый удар', key: 'LMB', description: 'Обычный удар кулаком' },
            { name: 'Рывок', key: 'Shift', description: 'Быстрое перемещение вперед' }
        ],
        evolutions: {
            25: [
                { id: 'evol_p_25_1', name: 'Усиленные кулаки', description: '+20% урона' },
                { id: 'evol_p_25_2', name: 'Быстрые руки', description: '-10% интервал атаки' }
            ],
            50: [
                { id: 'evol_p_50_1', name: 'Стальные мышцы', description: '+30% здоровья' },
                { id: 'evol_p_50_2', name: 'Энергетик', description: '+25% энергии' }
            ],
            78: [
                { id: 'evol_p_78_1', name: 'Совершенство', description: '+50% ко всем характеристикам' },
                { id: 'evol_p_78_2', name: 'Мастер боя', description: 'Удвоенный эффект артефактов' }
            ]
        },
        color: '#4CAF50'
    },
    
    OBJECT_15: {
        id: 'object15',
        name: 'Объект 15',
        description: 'Экспериментальный боец с бластерами',
        locked: true,
        unlockCondition: 'Достичь 15 уровня в Радиоактивном лесу',
        baseStats: {
            damage: 60,
            health: 450,
            regen: 4,
            energy: 120,
            energyRegen: 12,
            agility: 9,
            speed: 130,
            secondLife: 0,
            resistance: 0,
            lifeSteal: 0,
            battery: 115,
            combatZone: 4,
            geneticMastery: 15
        },
        skills: [
            { name: 'Бластеры', key: 'LMB', description: 'Стрельба энергетическими снарядами' },
            { name: 'Залп', key: 'Shift', description: 'Мощный выстрел по области' }
        ],
        evolutions: {
            25: [
                { id: 'evol_o15_25_1', name: 'Перезарядка', description: '+20% скорости восстановления энергии' },
                { id: 'evol_o15_25_2', name: 'Точность', description: '+15% критического урона' }
            ],
            50: [
                { id: 'evol_o15_50_1', name: 'Двойной залп', description: 'Шанс 20% выстрелить дважды' },
                { id: 'evol_o15_50_2', name: 'Щит', description: '+20% брони' }
            ],
            78: [
                { id: 'evol_o15_78_1', name: 'Плазменное оружие', description: 'Урон игнорирует 30% брони' },
                { id: 'evol_o15_78_2', name: 'Ядерный реактор', description: 'Энергия не тратится при движении' }
            ]
        },
        color: '#2196F3'
    },
    
    SHADOW: {
        id: 'shadow',
        name: 'Тень',
        description: 'Скрытный убийца с бонусами к скорости',
        locked: true,
        unlockCondition: 'Победить босса Коварной долины',
        baseStats: {
            damage: 70,
            health: 400,
            regen: 3,
            energy: 90,
            energyRegen: 8,
            agility: 12,
            speed: 140,
            secondLife: 0,
            resistance: 5,
            lifeSteal: 10,
            battery: 90,
            combatZone: 6,
            geneticMastery: 30
        },
        skills: [
            { name: 'Удар из тени', key: 'LMB', description: 'Критический удар из скрытности' },
            { name: 'Невидимость', key: 'Shift', description: 'Временная невидимость (10 сек)' }
        ],
        evolutions: {
            25: [
                { id: 'evol_s_25_1', name: 'Маскировка', description: 'Скрытность работает лучше' },
                { id: 'evol_s_25_2', name: 'Отравление', description: 'Атаки накладывают яд' }
            ],
            50: [
                { id: 'evol_s_50_1', name: 'Фантом', description: 'Шанс уклониться 25%' },
                { id: 'evol_s_50_2', name: 'Вампиризм', description: '+15% похищения здоровья' }
            ],
            78: [
                { id: 'evol_s_78_1', name: 'Владыка теней', description: 'Призыв теневых клонов' },
                { id: 'evol_s_78_2', name: 'Бессмертие', description: 'Шанс 10% избежать смерти' }
            ]
        },
        color: '#9C27B0'
    },
    
    TITAN: {
        id: 'titan',
        name: 'Титан',
        description: 'Танк с высоким здоровьем и броней',
        locked: true,
        unlockCondition: 'Достичь 30 уровня',
        baseStats: {
            damage: 40,
            health: 700,
            regen: 8,
            energy: 80,
            energyRegen: 6,
            agility: 6,
            speed: 100,
            secondLife: 0,
            resistance: 10,
            lifeSteal: 0,
            battery: 80,
            combatZone: 8,
            geneticMastery: 0
        },
        skills: [
            { name: 'Сокрушительный удар', key: 'LMB', description: 'Мощный удар по площади' },
            { name: 'Щит', key: 'Shift', description: 'Временный щит (50% HP на 5 сек)' }
        ],
        evolutions: {
            25: [
                { id: 'evol_t_25_1', name: 'Броня', description: '+30% брони' },
                { id: 'evol_t_25_2', name: 'Регенерация', description: '+50% регенерации' }
            ],
            50: [
                { id: 'evol_t_50_1', name: 'Отражение', description: '20% урона возвращается врагу' },
                { id: 'evol_t_50_2', name: 'Гигант', description: '+20% размера и здоровья' }
            ],
            78: [
                { id: 'evol_t_78_1', name: 'Непоколебимый', description: 'Иммунитет к оглушению' },
                { id: 'evol_t_78_2', name: 'Землетрясение', description: 'Удар по всей арене' }
            ]
        },
        color: '#FF5722'
    },
    
    PHOENIX: {
        id: 'phoenix',
        name: 'Феникс',
        description: 'Мастер огня с иммунитетом к горению',
        locked: true,
        unlockCondition: 'Победить босса Горящих земель',
        baseStats: {
            damage: 55,
            health: 480,
            regen: 6,
            energy: 110,
            energyRegen: 11,
            agility: 10,
            speed: 135,
            secondLife: 1,
            resistance: 5,
            lifeSteal: 0,
            battery: 110,
            combatZone: 4,
            geneticMastery: 15
        },
        skills: [
            { name: 'Огненный шар', key: 'LMB', description: 'Запуск огненного снаряда' },
            { name: 'Возрождение', key: 'Shift', description: 'Мгновенное лечение 50% HP' }
        ],
        evolutions: {
            25: [
                { id: 'evol_ph_25_1', name: 'Пламя', description: 'Атаки поджигают врагов' },
                { id: 'evol_ph_25_2', name: 'Пепел', description: 'Скорость +20% при низком HP' }
            ],
            50: [
                { id: 'evol_ph_50_1', name: 'Бессмертие', description: 'Вторая жизнь восстанавливает 100% HP' },
                { id: 'evol_ph_50_2', name: 'Жар', description: 'Враги рядом получают урон' }
            ],
            78: [
                { id: 'evol_ph_78_1', name: 'Вечный огонь', description: 'Горение не может быть потушено' },
                { id: 'evol_ph_78_2', name: 'Солнце', description: 'Огромный урон по площади вокруг' }
            ]
        },
        color: '#FFC107'
    },
    
    HERO: {
        id: 'hero',
        name: 'Герой',
        description: 'Секретный персонаж с уникальными способностями',
        locked: true,
        unlockCondition: 'Победить Дьявола',
        hidden: true,
        baseStats: {
            damage: 100,
            health: 1000,
            regen: 10,
            energy: 200,
            energyRegen: 20,
            agility: 15,
            speed: 150,
            secondLife: 1,
            resistance: 10,
            lifeSteal: 10,
            battery: 200,
            combatZone: 15,
            geneticMastery: 120
        },
        skills: [
            { name: 'Божественный удар', key: 'LMB', description: 'Удар, наносящий огромный урон' },
            { name: 'Благословение', key: 'Shift', description: 'Все эффекты удвоены' }
        ],
        evolutions: {
            25: [
                { id: 'evol_h_25_1', name: 'Сила героя', description: '+100% урона' },
                { id: 'evol_h_25_2', name: 'Защита героя', description: '+100% здоровья' }
            ],
            50: [
                { id: 'evol_h_50_1', name: 'Скорость героя', description: '+50% скорости' },
                { id: 'evol_h_50_2', name: 'Энергия героя', description: '+100% энергии' }
            ],
            78: [
                { id: 'evol_h_78_1', name: 'Легенда', description: 'Все характеристики максимальны' },
                { id: 'evol_h_78_2', name: 'Бог', description: 'Бессмертие' }
            ]
        },
        color: '#FFFFFF'
    }
};

/**
 * Получить список доступных персонажей
 */
export function getAvailableCharacters(saveData = null) {
    const available = [];
    for (const key in CHARACTERS) {
        const char = CHARACTERS[key];
        if (!char.locked || (saveData && saveData.unlockedCharacters?.includes(char.id))) {
            available.push(char);
        }
    }
    return available;
}

/**
 * Получить персонажа по ID
 */
export function getCharacterById(id) {
    for (const key in CHARACTERS) {
        if (CHARACTERS[key].id === id) {
            return CHARACTERS[key];
        }
    }
    return null;
}

/**
 * Рассчитать характеристики персонажа на уровне
 */
export function calculateStats(character, level) {
    const base = character.baseStats;
    return {
        damage: CONFIG.FORMULAS.damage(base.damage, level),
        health: CONFIG.FORMULAS.health(base.health, level),
        regen: CONFIG.FORMULAS.regen(base.regen, level),
        energy: CONFIG.FORMULAS.energy(base.energy, level),
        energyRegen: CONFIG.FORMULAS.energyRegen(base.energyRegen, level),
        agility: CONFIG.FORMULAS.agility(base.agility, level),
        speed: base.speed + 10 * level,
        resistance: Math.min(7, level),
        lifeSteal: Math.min(7, level * 5 / 100),
        secondLife: Math.min(1, base.secondLife + Math.floor(level / 78)),
        battery: base.battery + 15 * level,
        combatZone: [2, 4, 6, 8, 10, 12, 15][Math.min(6, Math.floor(level / 11))],
        geneticMastery: Math.min(120, base.geneticMastery + 15 * level)
    };
}

export default CHARACTERS;
