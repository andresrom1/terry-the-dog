import Phaser from 'phaser';
import type { LevelData } from './types';

export class LevelLoader {
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    loadLevel(data: LevelData) {
        // Set world bounds
        this.scene.physics.world.setBounds(0, 0, data.width, data.height);
        this.scene.cameras.main.setBounds(0, 0, data.width, data.height);

        // Set background color based on theme
        if (data.theme === 'patio') {
            this.scene.cameras.main.setBackgroundColor('#87CEEB'); // Sky blue
        } else if (data.theme === 'dream') {
            this.scene.cameras.main.setBackgroundColor('#4B0082'); // Indigo
        }

        // Create platforms
        const platforms = this.scene.physics.add.staticGroup();
        data.platforms.forEach(p => {
            const texture = p.type === 'ground' ? 'ground' : 'platform';
            const platform = this.scene.add.tileSprite(p.x + p.width / 2, p.y + p.height / 2, p.width, p.height, texture);
            this.scene.physics.add.existing(platform, true);
            platforms.add(platform);
        });

        // Create items
        const items = this.scene.physics.add.staticGroup();
        data.items.forEach(i => {
            let texture = 'life_bone';
            if (i.type === 'red_bone') texture = 'red_bone';
            else if (i.type === 'blue_bone') texture = 'blue_bone';
            else if (i.type === 'combo_bone') texture = 'combo_bone';

            const item = this.scene.add.sprite(i.x, i.y, texture);
            this.scene.physics.add.existing(item, true);
            (item as any).itemType = i.type;
            items.add(item);
        });

        return {
            platforms,
            items,
            spawnPoint: data.spawnPoint,
            enemies: data.enemies,
            goal: data.goal,
            nextLevel: data.nextLevel
        };
    }
}
