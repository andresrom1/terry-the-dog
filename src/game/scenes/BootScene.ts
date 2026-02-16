import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Generate textures for placeholders
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Terry (Brown)
        graphics.clear();
        graphics.fillStyle(0x8B4513);
        graphics.fillRect(0, 0, 40, 40);
        graphics.generateTexture('terry', 40, 40);

        // Territo (Light Brown)
        graphics.clear();
        graphics.fillStyle(0xCD853F);
        graphics.fillRect(0, 0, 40, 40);
        graphics.generateTexture('territo', 40, 40);

        // Terrino (Dark Brown)
        graphics.clear();
        graphics.fillStyle(0x5D2E0A);
        graphics.fillRect(0, 0, 40, 40);
        graphics.generateTexture('terrino', 40, 40);

        // Clone (White)
        graphics.clear();
        graphics.fillStyle(0xFFFFFF);
        graphics.fillRect(0, 0, 40, 40);
        graphics.generateTexture('clone', 40, 40);

        // Bones
        const boneWidth = 30;
        const boneHeight = 15;

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
