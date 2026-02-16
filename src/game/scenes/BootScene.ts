import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Generate textures for placeholders
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        const drawCharacter = (key: string, color: number) => {
            graphics.clear();
            // Body
            graphics.fillStyle(color);
            graphics.fillRect(0, 0, 30, 30);
            // Eye/Nose to indicate direction (facing right by default)
            graphics.fillStyle(0x000000);
            graphics.fillRect(22, 5, 5, 5); // Eye
            graphics.fillRect(25, 15, 5, 8); // Nose/Muzzle
            graphics.generateTexture(key, 30, 30);
        };

        // Terry (Brown)
        drawCharacter('terry', 0x8B4513);
        // Territo (Light Brown)
        drawCharacter('territo', 0xCD853F);
        // Terrino (Dark Brown)
        drawCharacter('terrino', 0x5D2E0A);

        // Clone (White)
        graphics.clear();
        graphics.fillStyle(0xFFFFFF);
        graphics.fillRect(0, 0, 30, 30);
        graphics.fillStyle(0x000000);
        graphics.fillRect(22, 5, 5, 5);
        graphics.generateTexture('clone', 30, 30);

        // Bones
        const boneWidth = 20;
        const boneHeight = 10;

        graphics.clear();
        graphics.fillStyle(0xFF0000);
        graphics.fillRect(0, 0, boneWidth, boneHeight);
        graphics.generateTexture('red_bone', boneWidth, boneHeight);

        graphics.clear();
        graphics.fillStyle(0x0000FF);
        graphics.fillRect(0, 0, boneWidth, boneHeight);
        graphics.generateTexture('blue_bone', boneWidth, boneHeight);

        graphics.clear();
        graphics.fillStyle(0xFF00FF);
        graphics.fillRect(0, 0, boneWidth, boneHeight);
        graphics.generateTexture('combo_bone', boneWidth, boneHeight);

        graphics.clear();
        graphics.fillStyle(0xFFFFFF);
        graphics.fillRect(0, 0, boneWidth, boneHeight);
        graphics.generateTexture('life_bone', boneWidth, boneHeight);

        // Fireball
        graphics.clear();
        graphics.fillStyle(0xFF4500);
        graphics.fillCircle(5, 5, 5);
        graphics.generateTexture('fireball', 10, 10);

        // Platform (Green)
        graphics.clear();
        graphics.fillStyle(0x228B22);
        graphics.fillRect(0, 0, 32, 32);
        graphics.generateTexture('platform', 32, 32);

        // Ground (Brown/Dark Green)
        graphics.clear();
        graphics.fillStyle(0x556B2F); // Dark Olive Green
        graphics.fillRect(0, 0, 32, 32);
        graphics.generateTexture('ground', 32, 32);

        // Load level data
        this.load.json('level1-1', 'levels/level1-1.json');
        this.load.json('level1-2', 'levels/level1-2.json');
        this.load.json('level1-3', 'levels/level1-3.json');
        this.load.json('level1-4', 'levels/level1-4.json');
    }

    create() {
        // Start the game or character select
        this.scene.start('CharacterSelectScene');
    }
}
