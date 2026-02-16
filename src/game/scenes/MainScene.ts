import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { LevelLoader } from '../LevelLoader';
import { Enemy } from '../entities/Enemy';

export class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    private player!: Player;
    private levelLoader!: LevelLoader;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private keyA!: Phaser.Input.Keyboard.Key;
    private keyC!: Phaser.Input.Keyboard.Key;
    public fireballs!: Phaser.Physics.Arcade.Group;
    private enemies!: Phaser.Physics.Arcade.Group;
    public mobileInput = {
        left: false,
        right: false,
        jump: false,
        bite: false,
        fireball: false
    };
    private currentLevelKey: string = 'level1-1';

    preload() {
        this.load.json('level1-1', 'levels/level1-1.json');
        this.load.json('level1-2', 'levels/level1-2.json');
        this.load.json('level1-3', 'levels/level1-3.json');
        this.load.json('level1-4', 'levels/level1-4.json');
    }

    create() {
        if (!this.scene.isActive('UIScene')) {
            this.scene.launch('UIScene');
        }
        const levelData = this.cache.json.get(this.currentLevelKey);
        this.levelLoader = new LevelLoader(this);
        const { platforms, items, spawnPoint, enemies, goal, nextLevel } = this.levelLoader.loadLevel(levelData);

        this.fireballs = this.physics.add.group();
        this.enemies = this.physics.add.group();

        enemies.forEach((e: any) => {
            const enemy = new Enemy(this, e.x, e.y);
            this.enemies.add(enemy);
        });

        // Create goal
        const goalRect = this.add.rectangle(goal.x, goal.y, 60, 60, 0xffff00, 0.5);
        this.physics.add.existing(goalRect, true);

        this.player = new Player(this, spawnPoint.x, spawnPoint.y);
        this.physics.add.collider(this.player, platforms);
        this.physics.add.collider(this.enemies, platforms);

        this.physics.add.overlap(this.player, items, (p, item) => {
            const playerObj = p as Player;
            const itemObj = item as any;
            if (itemObj.itemType === 'red_bone') {
                playerObj.fireballUnlocked = true;
                this.showMessage("The button C are unlocked");
            } else if (itemObj.itemType === 'life_bone') {
                playerObj.lives++;
                this.showMessage("+1 Life");
            }
            item.destroy();
        });

        // Fireball hits enemy
        this.physics.add.overlap(this.fireballs, this.enemies, (fb, enemy) => {
            (enemy as Enemy).takeDamage(5); // Instantly kills according to requirements
            fb.destroy();
        });

        // Bite hits enemy
        this.physics.add.overlap(this.player.getBiteHitbox(), this.enemies, (_, enemy) => {
            const enemyObj = enemy as Phaser.GameObjects.GameObject;
            if (this.player.canHit(enemyObj)) {
                (enemyObj as Enemy).takeDamage(1);
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
                this.currentLevelKey = nextLevel;
                this.scene.restart();
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
    }

    update() {
        const input = {
            left: this.cursors.left.isDown || this.mobileInput.left,
            right: this.cursors.right.isDown || this.mobileInput.right,
            jump: this.cursors.up.isDown || this.cursors.space.isDown || this.mobileInput.jump,
            bite: Phaser.Input.Keyboard.JustDown(this.keyA) || this.mobileInput.bite,
            fireball: Phaser.Input.Keyboard.JustDown(this.keyC) || this.mobileInput.fireball
        };
        this.player.update(input);

        // Reset justDown equivalents for mobile to avoid repeated triggers if not desired,
        // but for now let's keep it simple.
        // Actually, bite and fireball should probably be reset if they were true.
        if (this.mobileInput.bite) this.mobileInput.bite = false;
        if (this.mobileInput.fireball) this.mobileInput.fireball = false;
        if (this.mobileInput.jump) this.mobileInput.jump = false;

        this.fireballs.getChildren().forEach(f => (f as any).update());
        this.enemies.getChildren().forEach(e => (e as any).update());
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
