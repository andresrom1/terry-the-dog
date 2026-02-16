import Phaser from 'phaser';

export class Fireball extends Phaser.Physics.Arcade.Sprite {
    private speed: number = 400;

    constructor(scene: Phaser.Scene, x: number, y: number, direction: number) {
        super(scene, x, y, 'fireball');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setAllowGravity(false);
        this.body.setVelocityX(direction * this.speed);

        // Ensure it's correctly sized and visible
        this.setDisplaySize(15, 15);
    }

    update() {
        if (this.x < 0 || this.x > this.scene.physics.world.bounds.width) {
            this.destroy();
        }
    }
}
