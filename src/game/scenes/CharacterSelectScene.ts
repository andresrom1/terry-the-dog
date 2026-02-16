import Phaser from 'phaser';

export class CharacterSelectScene extends Phaser.Scene {
    constructor() {
        super('CharacterSelectScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.add.text(width / 2, 100, 'Select Your Character', {
            fontSize: '48px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.createCharacterOption(width / 4, height / 2, 'Terry', 'terry', 0x8B4513);
        this.createCharacterOption(width / 2, height / 2, 'Territo', 'territo', 0xCD853F);
        this.createCharacterOption(3 * width / 4, height / 2, 'Terrino', 'terrino', 0x5D2E0A);

        const saved = localStorage.getItem('terry_save');
        if (saved) {
            const data = JSON.parse(saved);
            const continueBtn = this.add.rectangle(width / 2, height - 50, 200, 50, 0x00aa00).setInteractive();
            this.add.text(width / 2, height - 50, `Continue Level ${data.level}`, { fontSize: '20px', color: '#fff' }).setOrigin(0.5);
            continueBtn.on('pointerdown', () => {
                this.scene.start('MainScene'); // MainScene init will load the save
            });
        }
    }

    createCharacterOption(x: number, y: number, name: string, texture: string, color: number) {
        const bg = this.add.rectangle(x, y, 150, 200, 0x444444).setInteractive();
        const sprite = this.add.sprite(x, y - 20, texture).setDisplaySize(80, 80);
        const label = this.add.text(x, y + 60, name, { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);

        bg.on('pointerover', () => bg.setStrokeStyle(4, 0xffffff));
        bg.on('pointerout', () => bg.setStrokeStyle(0));
        bg.on('pointerdown', () => {
            localStorage.removeItem('terry_save'); // Clear save for new game
            this.scene.start('MainScene', { character: texture, level: 'level1-1' });
        });
    }
}
