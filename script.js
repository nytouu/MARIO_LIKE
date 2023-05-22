// import { Menu as Menu } from "./assets/scripts/scenes/Menu.js";
import { Preload as Preload } from "./assets/scripts/scenes/Preload.js";
import { Test as Test } from "./assets/scripts/scenes/Test.js";
import { House01 as House01 } from "./assets/scripts/scenes/House01.js";

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
            debug: false
        }
    },
    scene: [ Preload, House01, Test ],
    pixelArt: true,
    input:
    {
        gamepad: true
    },
	fps: {
		target: FRAMERATE,
		forceSetTimeOut: true
	},
};

new Phaser.Game(config);
