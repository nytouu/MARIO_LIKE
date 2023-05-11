// import { Menu as Menu } from "./assets/scripts/scenes/Menu.js";
import { Preload as Preload } from "./assets/scripts/scenes/Preload.js";
import { Test as Test } from "./assets/scripts/scenes/Test.js";

var config =
{
    type: Phaser.WEBGL,
	scale: {
        mode: Phaser.Scale.FIT,
        width: 640,
        height: 360
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
