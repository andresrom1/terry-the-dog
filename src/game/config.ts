import Phaser from 'phaser';
import { MainScene } from './scenes/MainScene';
import { UIScene } from './scenes/UIScene';
import { BootScene } from './scenes/BootScene';
import { CharacterSelectScene } from './scenes/CharacterSelectScene';
import { ReviveScene } from './scenes/ReviveScene';

export const GameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    parent: 'app',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300, x: 0 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, CharacterSelectScene, MainScene, UIScene, ReviveScene]
};
