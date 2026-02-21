import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { LevelLoader } from '../LevelLoader';
import { Enemy } from '../entities/Enemy';

export class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    public player!: Player;
    private levelLoader!: LevelLoader;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private keyA!: Phaser.Input.Keyboard.Key;
    private keyC!: Phaser.Input.Keyboard.Key;
    private keyD!: Phaser.Input.Keyboard.Key;
    private keyE!: Phaser.Input.Keyboard.Key;

    public fireballs!: Phaser.Physics.Arcade.Group;
    private enemies!: Phaser.Physics.Arcade.Group;

    public mobileInput: any = {
        left: false,
        right: false,
        jump: false,
        bite: false,
        fireball: false,
        ice: false,
        combo: false
    };

    private prevInput = {
        bite: false,
        fireball: false,
        ice: false,
        combo: false
    };

    private currentLevelKey: string = 'level1-1';
    private selectedCharacter: string = 'terry';
    public isBonus: boolean = false;
    public timeLeft: number = 0;

    init(data: any) {
        this.loadGame();
        if (data && data.character) {
            this.selectedCharacter = data.character;
        }
        if (data && data.level) {
            this.currentLevelKey = data.level;
        }
    }

    private saveGame(nextLevel?: string) {
        const saveData = {
            level: nextLevel || this.currentLevelKey,
            character: this.selectedCharacter,
            fireballUnlocked: this.player?.fireballUnlocked || false,
            lives: this.player?.lives || 6,
            healthBars: this.player?.healthBars || 10
        };
        localStorage.setItem('terry_save', JSON.stringify(saveData));
    }

    private loadGame() {
        const saved = localStorage.getItem('terry_save');
        if (saved) {
            const data = JSON.parse(saved);
            this.currentLevelKey = data.level;
            this.selectedCharacter = data.character;
            // Note: player state will be applied after player is created
        }
    }

    create() {
        if (!this.scene.isActive('UIScene')) {
            this.scene.launch('UIScene');
        }

        const levelData = this.cache.json.get(this.currentLevelKey);
        this.isBonus = levelData.isBonus || false;
        if (this.isBonus) {
            this.timeLeft = levelData.timer || 60;
            this.time.addEvent({
                delay: 1000,
                callback: () => {
                    this.timeLeft--;
                    if (this.timeLeft <= 0) {
                        // Bonus time up
                        this.scene.restart({ character: this.selectedCharacter, level: 'level1-1' }); // Go back or finish
                    }
                },
                loop: true
            });
        }

        this.levelLoader = new LevelLoader(this);
        const { platforms, items, spawnPoint, enemies, goal, nextLevel } = this.levelLoader.loadLevel(levelData);

        this.fireballs = this.physics.add.group({
            classType: Fireball,
            runChildUpdate: true,
            allowGravity: false
        });

        this.enemies = this.physics.add.group({
            classType: Enemy,
            runChildUpdate: true
        });

        enemies.forEach((e: any) => {
            const enemy = new Enemy(this, e.x, e.y);
            this.enemies.add(enemy);
        });

        // Create goal
        const goalRect = this.add.rectangle(goal.x, goal.y, 60, 60, 0xffff00, 0.5);
        this.physics.add.existing(goalRect, true);

        this.player = new Player(this, spawnPoint.x, spawnPoint.y, this.selectedCharacter);

        this.player.on('gameOver', () => {
            this.scene.start('ReviveScene', { character: this.selectedCharacter, level: this.currentLevelKey });
        });

        // Apply saved state
        const saved = localStorage.getItem('terry_save');
        if (saved) {
            const data = JSON.parse(saved);
            this.player.fireballUnlocked = data.fireballUnlocked;
            this.player.lives = data.lives;
            this.player.healthBars = data.healthBars;
        }

        this.physics.add.collider(this.player, platforms);
        this.physics.add.collider(this.enemies, platforms);

        this.physics.add.overlap(this.player, items, (p, item) => {
            const playerObj = p as Player;
            const itemObj = item as any;
            if (itemObj.itemType === 'red_bone') {
                playerObj.fireballUnlocked = true;
                this.showMessage("The button C are unlocked");
                this.saveGame();
            } else if (itemObj.itemType === 'life_bone') {
                playerObj.lives++;
                this.showMessage("+1 Life");
            }
            item.destroy();
        });

        // Fireball hits enemy
        this.physics.add.overlap(this.fireballs, this.enemies, (fb, enemy) => {
            (enemy as Enemy).takeDamage(5); // Instantly kills
            fb.destroy();
        });

        // Bite hits enemy
        this.physics.add.overlap(this.player.getBiteHitbox(), this.enemies, (_, enemy) => {
            const enemyObj = enemy as Enemy;
            if (this.player.canHit(enemyObj)) {
                enemyObj.takeDamage(1);
            }
        });

        // Enemy bites player
        this.physics.add.overlap(this.player, this.enemies, (p, enemy) => {
            const e = enemy as Enemy;
            if (e.canAttack()) {
                (p as Player).takeDamage();
            }
        });

        // Player reaches goal
        this.physics.add.overlap(this.player, goalRect, () => {
            if (nextLevel) {
                this.saveGame(nextLevel);
                this.scene.restart({ character: this.selectedCharacter, level: nextLevel });
            } else {
                this.add.text(this.player.x, this.player.y - 100, 'Prototype Complete!', {
                    fontSize: '32px',
                    color: '#fff'
                }).setOrigin(0.5);
                this.physics.pause();
            }
        });

        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

        this.cursors = this.input.keyboard!.createCursorKeys();
        this.keyA = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyC = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.keyD = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyE = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    }

    update() {
        const bitePressed = this.keyA.isDown || this.mobileInput.bite;
        const fireballPressed = this.keyC.isDown || this.mobileInput.fireball;
        const icePressed = this.keyD.isDown || this.mobileInput.ice;
        const comboPressed = this.keyE.isDown || this.mobileInput.combo;

        const input = {
            left: this.cursors.left.isDown || this.mobileInput.left,
            right: this.cursors.right.isDown || this.mobileInput.right,
            jump: this.cursors.up.isDown || this.cursors.space.isDown || this.mobileInput.jump,
            bite: bitePressed && !this.prevInput.bite,
            fireball: fireballPressed && !this.prevInput.fireball,
            ice: icePressed && !this.prevInput.ice,
            combo: comboPressed && !this.prevInput.combo
        };

        this.player.update(input);

        this.prevInput.bite = bitePressed;
        this.prevInput.fireball = fireballPressed;
        this.prevInput.ice = icePressed;
        this.prevInput.combo = comboPressed;

        this.enemies.getChildren().forEach(e => (e as Enemy).update());

        if (this.player.y > this.physics.world.bounds.height) {
            this.player.takeDamage();
            if (this.player.lives > 0) {
                this.player.setPosition(100, 100); // Fallback respawn
            }
        }
    }

    private showMessage(text: string) {
        const msg = this.add.text(this.player.x, this.player.y - 50, text, {
            fontSize: '20px',
            color: '#ffff00',
            backgroundColor: '#000000'
        }).setOrigin(0.5);

        this.time.delayedCall(2000, () => msg.destroy());
    }
}
