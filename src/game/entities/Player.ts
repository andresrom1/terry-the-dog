import Phaser from 'phaser';
import { Fireball } from './Fireball';

export class Player extends Phaser.GameObjects.Rectangle {
    declare public body: Phaser.Physics.Arcade.Body;

    private moveSpeed: number = 200;
    private jumpForce: number = 350;

    public lives: number = 6;
    public healthBars: number = 10;
    public maxHealthBars: number = 10;

    public fireballUnlocked: boolean = false;
    private lastFired: number = 0;
    private fireRate: number = 500; // ms

    private biteHitbox: Phaser.GameObjects.Rectangle;
    private alreadyHit: Set<Phaser.GameObjects.GameObject> = new Set();

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 40, 40, 0x8b4513); // Brown for Terry
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCollideWorldBounds(true);

        this.biteHitbox = scene.add.rectangle(0, 0, 40, 40, 0xffffff, 0);
        scene.physics.add.existing(this.biteHitbox);
        (this.biteHitbox.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        this.biteHitbox.setActive(false);
        this.biteHitbox.setVisible(false);
    }

    update(input: { left: boolean, right: boolean, jump: boolean, bite: boolean, fireball: boolean }) {
        if (input.left) {
            this.body.setVelocityX(-this.moveSpeed);
        } else if (input.right) {
            this.body.setVelocityX(this.moveSpeed);
        } else {
            this.body.setVelocityX(0);
        }

        if (input.jump && this.body.blocked.down) {
            this.body.setVelocityY(-this.jumpForce);
        }

        if (input.bite) {
            this.bite();
        }

        if (input.fireball && this.fireballUnlocked) {
            this.shootFireball();
        }
    }

    bite() {
        if (this.biteHitbox.active) return; // Already biting

        const direction = this.body.velocity.x >= 0 ? 1 : -1;
        this.biteHitbox.setPosition(this.x + (direction * 30), this.y);
        this.biteHitbox.setActive(true);
        this.alreadyHit.clear();

        this.scene.time.delayedCall(200, () => {
            this.biteHitbox.setActive(false);
        });
    }

    canHit(target: Phaser.GameObjects.GameObject): boolean {
        if (this.biteHitbox.active && !this.alreadyHit.has(target)) {
            this.alreadyHit.add(target);
            return true;
        }
        return false;
    }

    shootFireball() {
        const now = this.scene.time.now;
        if (now - this.lastFired > this.fireRate) {
            const direction = this.body.velocity.x >= 0 ? 1 : -1;
            const fireball = new Fireball(this.scene, this.x, this.y, direction);
            (this.scene as any).fireballs.add(fireball);
            this.lastFired = now;
        }
    }

    getBiteHitbox() {
        return this.biteHitbox;
    }

    takeDamage() {
        this.healthBars--;
        if (this.healthBars <= 0) {
            this.loseLife();
        }
    }

    loseLife() {
        if (this.lives > 0) {
            this.lives--;
            this.healthBars = this.maxHealthBars;
            // Handle respawn or death animation
        }
    }
}
