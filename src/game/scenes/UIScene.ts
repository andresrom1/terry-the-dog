import Phaser from 'phaser';
import { Player } from '../entities/Player';

import pkg from '../../../package.json';

export class UIScene extends Phaser.Scene {
    private player!: Player;
    private lifeText!: Phaser.GameObjects.Text;
    private timerText!: Phaser.GameObjects.Text;
    private healthBars: Phaser.GameObjects.Rectangle[] = [];
    private joystickPointer: Phaser.Input.Pointer | null = null;

    constructor() {
        super('UIScene');
    }

    create() {
        this.lifeText = this.add.text(20, 20, 'Lives: 6', { fontSize: '24px', color: '#fff' });
        this.timerText = this.add.text(this.cameras.main.width / 2, 20, '', { fontSize: '32px', color: '#ffff00' }).setOrigin(0.5);

        // Version number
        this.add.text(this.cameras.main.width - 10, 10, `v${pkg.version}`, { fontSize: '14px', color: '#888' }).setOrigin(1, 0);

        // Create health bars
        for (let i = 0; i < 10; i++) {
            const bar = this.add.rectangle(20 + (i * 15), 55, 10, 20, 0x00ff00);
            this.healthBars.push(bar);
        }

        this.createMobileControls();
    }

    update() {
        const mainScene = this.scene.get('MainScene') as any;
        if (!this.player) {
            if (mainScene && mainScene.player) {
                this.player = mainScene.player;
            }
            return;
        }

        this.lifeText.setText(`Lives: ${this.player.lives}`);

        if (mainScene.isBonus) {
            this.timerText.setText(`TIME: ${mainScene.timeLeft}`);
        } else {
            this.timerText.setText('');
        }

        for (let i = 0; i < 10; i++) {
            if (i < this.player.healthBars) {
                this.healthBars[i].setVisible(true);
            } else {
                this.healthBars[i].setVisible(false);
            }
        }
    }

    private createMobileControls() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Joystick base (Left side)
        const joystickBase = this.add.circle(120, height - 120, 60, 0x888888, 0.5).setInteractive();
        const joystickThumb = this.add.circle(120, height - 120, 30, 0xcccccc, 0.8).setInteractive();

        this.input.setDraggable(joystickThumb);

        joystickThumb.on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
            this.joystickPointer = pointer;
            const distance = Phaser.Math.Distance.Between(joystickBase.x, joystickBase.y, dragX, dragY);
            const angle = Phaser.Math.Angle.Between(joystickBase.x, joystickBase.y, dragX, dragY);

            const maxDistance = 60;
            if (distance > maxDistance) {
                joystickThumb.x = joystickBase.x + Math.cos(angle) * maxDistance;
                joystickThumb.y = joystickBase.y + Math.sin(angle) * maxDistance;
            } else {
                joystickThumb.x = dragX;
                joystickThumb.y = dragY;
            }

            this.updateJoystickInput(joystickThumb.x - joystickBase.x);
        });

        joystickThumb.on('dragend', () => {
            this.joystickPointer = null;
            joystickThumb.x = joystickBase.x;
            joystickThumb.y = joystickBase.y;
            this.updateJoystickInput(0);
        });

        // Action Buttons (Right side)
        // A: Bite, B: Jump, C: Fireball, D: Ice, E: Combo
        this.createButton(width - 80, height - 80, 'A', 0xff0000, 'bite');
        this.createButton(width - 180, height - 80, 'B', 0x00ff00, 'jump');
        this.createButton(width - 80, height - 180, 'C', 0xffa500, 'fireball'); // Orange for fire
        this.createButton(width - 180, height - 180, 'D', 0x00ffff, 'ice'); // Cyan for ice
        this.createButton(width - 130, height - 260, 'E', 0xff00ff, 'combo'); // Purple for combo
    }

    private createButton(x: number, y: number, label: string, color: number, action: string) {
        const btn = this.add.circle(x, y, 35, color, 0.7).setInteractive();
        this.add.text(x, y, label, { fontSize: '24px', color: '#fff' }).setOrigin(0.5);

        const mainScene = this.scene.get('MainScene') as any;

        btn.on('pointerdown', () => {
            mainScene.mobileInput[action] = true;
        });
        const release = () => {
            mainScene.mobileInput[action] = false;
        };
        btn.on('pointerup', release);
        btn.on('pointerout', release);
    }

    private updateJoystickInput(deltaX: number) {
        const mainScene = this.scene.get('MainScene') as any;
        if (deltaX > 20) {
            mainScene.mobileInput.right = true;
            mainScene.mobileInput.left = false;
        } else if (deltaX < -20) {
            mainScene.mobileInput.left = true;
            mainScene.mobileInput.right = false;
        } else {
            mainScene.mobileInput.left = false;
            mainScene.mobileInput.right = false;
        }
    }
}
