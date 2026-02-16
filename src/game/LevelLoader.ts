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

        // Create platforms
        const platforms = this.scene.physics.add.staticGroup();
        data.platforms.forEach(p => {
            const platform = this.scene.add.rectangle(p.x + p.width / 2, p.y + p.height / 2, p.width, p.height, 0x00ff00);
            this.scene.physics.add.existing(platform, true);
            platforms.add(platform);
        });

        // Create items
        const items = this.scene.physics.add.staticGroup();
        data.items.forEach(i => {
            let color = 0xffffff;
            if (i.type === 'red_bone') color = 0xff0000;
            const item = this.scene.add.rectangle(i.x, i.y, 30, 15, color);
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
