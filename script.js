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
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [  ],
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
