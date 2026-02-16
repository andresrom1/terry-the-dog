import Phaser from 'phaser';

export class Enemy extends Phaser.GameObjects.Rectangle {
    declare public body: Phaser.Physics.Arcade.Body;

    public health: number = 5;
    private moveSpeed: number = 100;
    private direction: number = 1;
    private lastAttack: number = 0;
    private attackRate: number = 1000; // ms

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 40, 40, 0xffffff); // White for Top Malo clones
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCollideWorldBounds(true);
    }

    update() {
        // Simple patrol AI
        this.body.setVelocityX(this.direction * this.moveSpeed);

        if (this.body.blocked.left || this.body.blocked.right) {
            this.direction *= -1;
        }
    }

    takeDamage(amount: number) {
        this.health -= amount;
        if (this.health <= 0) {
            this.destroy();
        }
    }

    canAttack(): boolean {
        const now = this.scene.time.now;
        if (now - this.lastAttack > this.attackRate) {
            this.lastAttack = now;
            return true;
        }
        return false;
    }
}
