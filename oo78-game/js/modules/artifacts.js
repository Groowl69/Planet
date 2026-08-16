/**
 * artifacts.js - Артефакты всех редкостей
 * Основано на разделах 5-8 "Артефакты" из ТЗ
 */

import { CONFIG } from './config.js';

export const ARTIFACTS = {
    // Обычные артефакты (раздел 5)
    ADAMANT_CUBE: {
        id: 1,
        name: 'Адамантовый куб',
        description: 'DMG +10%, HP +10%',
        rarity: CONFIG.ARTIFACT_RARITY.COMMON,
        type: 'passive',
        effects: {
            damageMultiplier: 0.1,
            healthMultiplier: 0.1
        },
        slot: 'passive'
    },
    
    HELL_PARTICLE: {
        id: 3,
        name: 'Частица ада',
        description: 'Равноценный обмен - связывает случайный артефакт с персонажем',
        rarity: CONFIG.ARTIFACT_RARITY.COMMON,
        type: 'passive',
        effects: {
            bindArtifact: true
        },
        slot: 'passive'
    },
    
    KNUCKLES: {
        id: 4,
        name: 'Кастет',
        description: 'Фанат уличных потасовок, DMG +100',
        rarity: CONFIG.ARTIFACT_RARITY.COMMON,
        type: 'passive',
        effects: {
            flatDamage: 100
        },
        slot: 'passive'
    },
    
    BANDAGE: {
        id: 5,
        name: 'Бинт',
        description: 'Иммобилизация конечности, HP +270',
        rarity: CONFIG.ARTIFACT_RARITY.COMMON,
        type: 'passive',
        effects: {
            flatHealth: 270
        },
        slot: 'passive'
    },
    
    METAL_SHEET: {
        id: 6,
        name: 'Металлический лист',
        description: 'Объект 1... +10% скорости, -10% интервала атаки',
        rarity: CONFIG.ARTIFACT_RARITY.COMMON,
        type: 'passive',
        effects: {
            speedMultiplier: 0.1,
            attackSpeedMultiplier: -0.1
        },
        slot: 'passive'
    },
    
    // Редкие артефакты (раздел 6)
    SECOND_LIFE: {
        id: 1,
        name: 'Вторая жизнь',
        description: 'Бесплатная прокачка - воскрешает при смерти',
        rarity: CONFIG.ARTIFACT_RARITY.RARE,
        type: 'passive',
        effects: {
            revive: true
        },
        slot: 'passive',
        consumable: true
    },
    
    OCTAGONAL_LILYPAD: {
        id: 7,
        name: 'Восьмиугольная кувшинка',
        description: 'Хорошо держится на воде - иммунитет к утоплению, +10% скорости в воде',
        rarity: CONFIG.ARTIFACT_RARITY.RARE,
        type: 'passive',
        effects: {
            waterImmunity: true,
            waterSpeedBonus: 0.1
        },
        slot: 'passive'
    },
    
    SINGLE_BLASTER: {
        id: 13,
        name: 'Один бластер',
        description: 'Почему один? - заменяет левую руку на бластер',
        rarity: CONFIG.ARTIFACT_RARITY.RARE,
        type: 'passive',
        effects: {
            replaceAttack: 'blaster'
        },
        slot: 'passive'
    },
    
    // Артефакты особого назначения (раздел 7)
    TUNGSTEN_CHAINS: {
        id: 8,
        name: 'Вольфрамовые цепи',
        description: 'Кулаки на цепях - атака на 66px, урон по пути возвращения',
        rarity: CONFIG.ARTIFACT_RARITY.SPECIAL,
        type: 'passive',
        effects: {
            chainAttack: true,
            chainLength: 66,
            attackSpeedPenalty: 0.2
        },
        slot: 'passive'
    },
    
    LITHIUM_CHAINS: {
        id: 9,
        name: 'Литиевые цепи',
        description: 'Взрывная обмотка - взрыв R=20px, отбрасывание 10px',
        rarity: CONFIG.ARTIFACT_RARITY.SPECIAL,
        type: 'passive',
        effects: {
            explosionAttack: true,
            explosionRadius: 20,
            knockback: 10,
            armorPenetration: 0.1,
            airDamageReduction: 0.5
        },
        slot: 'passive'
    },
    
    U92: {
        id: 12,
        name: 'U92',
        description: 'Фонит... - радиоактивный круг R=150px, -3% HP врагам',
        rarity: CONFIG.ARTIFACT_RARITY.SPECIAL,
        type: 'passive',
        effects: {
            radiationAura: true,
            auraRadius: 150,
            radiationDamage: 0.03,
            immunityToRadiation: true
        },
        slot: 'passive'
    },
    
    // Древние артефакты (раздел 8)
    LOST_TIME: {
        id: 2,
        name: 'Потерянное время',
        description: '7 секунд - откат времени на 7 секунд назад',
        rarity: CONFIG.ARTIFACT_RARITY.ANCIENT,
        type: 'active',
        effects: {
            timeRewind: true,
            rewindSeconds: 7,
            chargesRequired: 100
        },
        slot: 'active',
        cooldown: 300
    },
    
    LIGHT_SOURCE: {
        id: 10,
        name: 'Источник света',
        description: 'Кто отбросит тень? - первый убитый враг становится союзником',
        rarity: CONFIG.ARTIFACT_RARITY.ANCIENT,
        type: 'passive',
        effects: {
            summonShadow: true,
            maxShadows: 1
        },
        slot: 'passive'
    },
    
    BLACK_MOON: {
        id: 11,
        name: 'Черная луна',
        description: 'Ничего не видно этой ночью - только ясная погода, нет временных эффектов',
        rarity: CONFIG.ARTIFACT_RARITY.ANCIENT,
        type: 'passive',
        effects: {
            clearWeatherOnly: true,
            noTemporaryEffects: true,
            darkerNight: 0.1
        },
        slot: 'passive'
    },
    
    // Босс артефакты
    FOREST_BOSS_ARTIFACT: {
        id: 101,
        name: 'Сердце леса',
        description: 'Артефакт босса Радиоактивного леса',
        rarity: CONFIG.ARTIFACT_RARITY.ANCIENT,
        type: 'passive',
        effects: {
            radiationImmunity: true,
            mutationImmunity: true,
            nightLight: 100,
            nightDebuff: 0.05
        },
        slot: 'passive'
    },
    
    VALLEY_BOSS_ARTIFACT: {
        id: 102,
        name: 'Ядро долины',
        description: 'Артефакт босса Коварной долины',
        rarity: CONFIG.ARTIFACT_RARITY.ANCIENT,
        type: 'passive',
        effects: {
            trapImmunity: true,
            teslaImmunity: true
        },
        slot: 'passive'
    },
    
    SEA_BOSS_ARTIFACT: {
        id: 103,
        name: 'Глубинный кристалл',
        description: 'Артефакт босса Моря раздора',
        rarity: CONFIG.ARTIFACT_RARITY.ANCIENT,
        type: 'passive',
        effects: {
            swimImmunity: true,
            waterSpeed: 1.5,
            drowningImmunity: true
        },
        slot: 'passive'
    },
    
    BURNING_BOSS_ARTIFACT: {
        id: 104,
        name: 'Пепельное сердце',
        description: 'Артефакт босса Горящих земель',
        rarity: CONFIG.ARTIFACT_RARITY.ANCIENT,
        type: 'passive',
        effects: {
            fireImmunity: true,
            lavaImmunity: true,
            burnImmunity: true
        },
        slot: 'passive'
    },
    
    DEVIL_ARTIFACT: {
        id: 200,
        name: 'Дар Дьявола',
        description: 'Награда за победу над Дьяволом',
        rarity: CONFIG.ARTIFACT_RARITY.ANCIENT,
        type: 'passive',
        effects: {
            allStatsBoost: 0.5,
            devilPower: true
        },
        slot: 'passive'
    }
};

/**
 * Получить артефакт по ID
 */
export function getArtifactById(id) {
    for (const key in ARTIFACTS) {
        if (ARTIFACTS[key].id === id) {
            return ARTIFACTS[key];
        }
    }
    return null;
}

/**
 * Получить случайный артефакт указанной редкости
 */
export function getRandomArtifact(rarity = null) {
    const artifacts = Object.values(ARTIFACTS);
    let filtered = artifacts;
    
    if (rarity) {
        filtered = artifacts.filter(a => a.rarity === rarity);
    }
    
    if (filtered.length === 0) {
        return null;
    }
    
    const randomIndex = Math.floor(Math.random() * filtered.length);
    return filtered[randomIndex];
}

/**
 * Получить артефакты по редкости
 */
export function getArtifactsByRarity(rarity) {
    return Object.values(ARTIFACTS).filter(a => a.rarity === rarity);
}

/**
 * Применить эффекты артефакта к характеристикам
 */
export function applyArtifactEffects(stats, artifact) {
    if (!artifact || !artifact.effects) {
        return stats;
    }
    
    const newStats = { ...stats };
    const effects = artifact.effects;
    
    if (effects.flatDamage) newStats.damage += effects.flatDamage;
    if (effects.flatHealth) newStats.health += effects.flatHealth;
    if (effects.damageMultiplier) newStats.damage *= (1 + effects.damageMultiplier);
    if (effects.healthMultiplier) newStats.health *= (1 + effects.healthMultiplier);
    if (effects.speedMultiplier) newStats.speed *= (1 + effects.speedMultiplier);
    if (effects.attackSpeedMultiplier) newStats.attackSpeed *= (1 + effects.attackSpeedMultiplier);
    
    return newStats;
}

export default ARTIFACTS;
