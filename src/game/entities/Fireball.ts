import Phaser from 'phaser';

export class Fireball extends Phaser.GameObjects.Rectangle {
    declare public body: Phaser.Physics.Arcade.Body;
    private speed: number = 400;

    constructor(scene: Phaser.Scene, x: number, y: number, direction: number) {
        super(scene, x, y, 10, 10, 0xff0000); // Red for fireball
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setAllowGravity(false);
        this.body.setVelocityX(direction * this.speed);
    }

    update() {
        if (this.x < 0 || this.x > this.scene.physics.world.bounds.width) {
            this.destroy();
        }
    }
}
