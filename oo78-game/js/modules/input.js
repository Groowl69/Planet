/**
 * input.js - Обработка ввода (клавиатура, мышь)
 */

export class InputHandler {
    constructor() {
        this.keys = {};
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseButtons = { left: false, right: false };
        this.keyBindings = {
            up: ['KeyW', 'ArrowUp'],
            down: ['KeyS', 'ArrowDown'],
            left: ['KeyA', 'ArrowLeft'],
            right: ['KeyD', 'ArrowRight'],
            attack: 'MouseLeft',
            ability: 'ShiftLeft',
            artifact: 'Space',
            inventory: 'Tab',
            pause: 'Escape',
            skillMenu: 'KeyQ',
            interact: 'KeyE',
            minimap: 'KeyM'
        };
        
        this.setupListeners();
    }
    
    setupListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            e.preventDefault();
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        window.addEventListener('mousedown', (e) => {
            if (e.button === 0) this.mouseButtons.left = true;
            if (e.button === 2) this.mouseButtons.right = true;
        });
        
        window.addEventListener('mouseup', (e) => {
            if (e.button === 0) this.mouseButtons.left = false;
            if (e.button === 2) this.mouseButtons.right = false;
        });
        
        window.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    getMovementDirection() {
        let dx = 0;
        let dy = 0;
        
        if (this.isKeyDown(this.keyBindings.left)) dx -= 1;
        if (this.isKeyDown(this.keyBindings.right)) dx += 1;
        if (this.isKeyDown(this.keyBindings.up)) dy -= 1;
        if (this.isKeyDown(this.keyBindings.down)) dy += 1;
        
        return { dx, dy };
    }
    
    isKeyDown(key) {
        if (Array.isArray(key)) {
            return key.some(k => this.keys[k]);
        }
        return this.keys[key];
    }
    
    isAttacking() {
        return this.mouseButtons.left;
    }
    
    isUsingAbility() {
        return this.isKeyDown(this.keyBindings.ability);
    }
    
    isActivatingArtifact() {
        return this.isKeyDown(this.keyBindings.artifact);
    }
    
    isOpeningInventory() {
        return this.isKeyDown(this.keyBindings.inventory);
    }
    
    isPausing() {
        return this.isKeyDown(this.keyBindings.pause);
    }
    
    isOpeningSkillMenu() {
        return this.isKeyDown(this.keyBindings.skillMenu);
    }
    
    isInteracting() {
        return this.isKeyDown(this.keyBindings.interact);
    }
    
    isOpeningMinimap() {
        return this.isKeyDown(this.keyBindings.minimap);
    }
    
    reset() {
        this.keys = {};
        this.mouseButtons = { left: false, right: false };
    }
}

export default InputHandler;
