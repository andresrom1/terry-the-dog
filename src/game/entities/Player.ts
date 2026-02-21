import Phaser from 'phaser';
import { Fireball } from './Fireball';

export class Player extends Phaser.Physics.Arcade.Sprite {
    private moveSpeed: number = 200;
    private jumpForce: number = 400;

    public lives: number = 6;
    public healthBars: number = 10;
    public maxHealthBars: number = 10;

    public fireballUnlocked: boolean = false;
    private lastFired: number = 0;
    private fireRate: number = 500; // ms

    private biteHitbox: Phaser.GameObjects.Rectangle;
    private alreadyHit: Set<Phaser.GameObjects.GameObject> = new Set();

    public lastDirection: number = 1; // 1 for right, -1 for left

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string = 'terry') {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCollideWorldBounds(true);
        // Ensure the sprite is visible
        this.setOrigin(0.5, 0.5);
        this.setDisplaySize(30, 30);

        this.biteHitbox = scene.add.rectangle(0, 0, 30, 30, 0xffffff, 0);
        scene.physics.add.existing(this.biteHitbox);
        (this.biteHitbox.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        this.biteHitbox.setActive(false);
        this.biteHitbox.setVisible(false);
    }

    update(input: { left: boolean, right: boolean, jump: boolean, bite: boolean, fireball: boolean, ice: boolean, combo: boolean }) {
        if (input.left) {
            this.body.setVelocityX(-this.moveSpeed);
            this.lastDirection = -1;
            this.setFlipX(true);
        } else if (input.right) {
            this.body.setVelocityX(this.moveSpeed);
            this.lastDirection = 1;
            this.setFlipX(false);
        } else {
            this.body.setVelocityX(0);
        }

        if (input.jump && this.body.blocked.down) {
            this.body.setVelocityY(-this.jumpForce);
            this.scene.tweens.add({
                targets: this,
                scaleY: 1.2,
                scaleX: 0.8,
                duration: 100,
                yoyo: true
            });
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

        this.biteHitbox.setPosition(this.x + (this.lastDirection * 30), this.y);
        this.biteHitbox.setActive(true);
        this.alreadyHit.clear();

        // Brief bite animation effect (placeholder)
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
            const fireball = new Fireball(this.scene, this.x, this.y, this.lastDirection);
            const mainScene = this.scene as any;
            if (mainScene.fireballs) {
                mainScene.fireballs.add(fireball);
                // Re-set velocity after adding to group to be absolutely sure
                if (fireball.body) {
                    fireball.body.allowGravity = false;
                    fireball.body.setVelocityX(this.lastDirection * 400);
                    fireball.body.setVelocityY(0);
                }
            }
            this.lastFired = now;
        }
    }

    getBiteHitbox() {
        return this.biteHitbox;
    }

    takeDamage() {
        this.healthBars--;
        // Visual feedback for damage
        this.setTint(0xff0000);
        this.scene.cameras.main.shake(100, 0.01);
        this.scene.time.delayedCall(200, () => this.clearTint());

        if (this.healthBars <= 0) {
            this.loseLife();
        }
    }

    loseLife() {
        if (this.lives > 0) {
            this.lives--;
            this.healthBars = this.maxHealthBars;
            // Respawn at start or current position
            this.setPosition(this.x, this.y - 100);
        } else {
            // Trigger Revive minigame (handled in MainScene)
            this.emit('gameOver');
        }
    }
}
