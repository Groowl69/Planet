/**
 * effects.js - Система эффектов и частиц
 */

export class EffectSystem {
    constructor() {
        this.particles = [];
        this.effects = [];
    }
    
    /**
     * Создать взрыв частиц
     */
    createExplosion(x, y, count, color, size = 5) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
            const speed = 50 + Math.random() * 150;
            
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: 0.5 + Math.random() * 0.5,
                color,
                size: size * (0.5 + Math.random() * 0.5),
                type: 'explosion'
            });
        }
    }
    
    /**
     * Создать след движения
     */
    createTrail(x, y, color) {
        this.particles.push({
            x,
            y,
            vx: 0,
            vy: 0,
            life: 0.3,
            decay: 3,
            color,
            size: 8,
            type: 'trail'
        });
    }
    
    /**
     * Создать эффект удара
     */
    createHitEffect(x, y, damage) {
        // Текст урона
        this.effects.push({
            x,
            y,
            text: `-${damage}`,
            life: 1,
            vy: -50,
            type: 'damage_text',
            color: damage > 100 ? '#f44336' : '#fff'
        });
        
        // Частицы удара
        this.createExplosion(x, y, 8, '#fff', 3);
    }
    
    /**
     * Обновить все эффекты
     */
    update(deltaTime) {
        // Обновление частиц
        this.particles = this.particles.filter(p => {
            p.x += p.vx * deltaTime;
            p.y += p.vy * deltaTime;
            p.life -= p.decay * deltaTime;
            p.size *= 0.95;
            return p.life > 0;
        });
        
        // Обновление эффектов
        this.effects = this.effects.filter(e => {
            if (e.type === 'damage_text') {
                e.y += e.vy * deltaTime;
                e.vy *= 0.9; // Замедление
            }
            e.life -= deltaTime;
            return e.life > 0;
        });
    }
    
    /**
     * Отрисовать эффекты
     */
    render(ctx, cameraX, cameraY, zoom) {
        // Отрисовка частиц
        for (const p of this.particles) {
            const screenX = (p.x - cameraX) * zoom;
            const screenY = (p.y - cameraY) * zoom;
            
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(screenX, screenY, p.size * zoom, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Отрисовка эффектов
        ctx.globalAlpha = 1;
        for (const e of this.effects) {
            const screenX = (e.x - cameraX) * zoom;
            const screenY = (e.y - cameraY) * zoom;
            
            if (e.type === 'damage_text') {
                ctx.font = 'bold 20px Arial';
                ctx.fillStyle = e.color;
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 3;
                ctx.strokeText(e.text, screenX, screenY);
                ctx.fillText(e.text, screenX, screenY);
            }
        }
    }
    
    /**
     * Очистить все эффекты
     */
    clear() {
        this.particles = [];
        this.effects = [];
    }
}

export default EffectSystem;
