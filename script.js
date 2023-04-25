// import { Menu as Menu } from "./assets/scripts/scenes/Menu.js";
import { Preload as Preload } from "./assets/scripts/scenes/Preload.js";
import { Test as Test } from "./assets/scripts/scenes/Test.js";

var config =
{
    type: Phaser.AUTO,
	scale: {
        mode: Phaser.Scale.FIT,
        width: 1920,
        height: 1080
    },
    physics:
    {
        default: 'arcade',
        arcade:
        {
            debug: true
        }
    },
    scene: [ Preload, Test ],
    pixelArt: true,
    input:
    {
        gamepad: true
    },
	fps: {
		target: 60,
		forceSetTimeOut: true
	},
};

new Phaser.Game(config);
