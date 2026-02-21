import Phaser from 'phaser';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    public health: number = 5;
    private moveSpeed: number = 100;
    private direction: number = 1;
    private lastAttack: number = 0;
    private attackRate: number = 1000; // ms
    private chaseRange: number = 300;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string = 'clone') {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCollideWorldBounds(true);
        this.setDisplaySize(30, 30);
    }

    update() {
        if (!this.body) return;

        const mainScene = this.scene as any;
        const player = mainScene.player;

        if (player) {
            const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

            if (distance < this.chaseRange) {
                // Chase behavior
                this.direction = player.x > this.x ? 1 : -1;
                this.body.setVelocityX(this.direction * this.moveSpeed * 1.5);
            } else {
                // Patrol behavior
                this.body.setVelocityX(this.direction * this.moveSpeed);

                if (this.body.blocked.left || this.body.blocked.right) {
                    this.direction *= -1;
                }
            }
        } else {
            // Patrol behavior
            this.body.setVelocityX(this.direction * this.moveSpeed);

            if (this.body.blocked.left || this.body.blocked.right) {
                this.direction *= -1;
            }
        }

        this.setFlipX(this.direction > 0);
    }

    takeDamage(amount: number) {
        this.health -= amount;
        this.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => this.clearTint());

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
