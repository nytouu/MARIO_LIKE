import { Level } from "../components/Level.js"

export class Preload extends Level {
	constructor(){
		super("Preload")
	}

	preload(){
		this.load.image("placeholder", "assets/imgs/placeholder.png");
		this.load.spritesheet("player_bright_run", "assets/imgs/player/bright_run.png", 
			{frameWidth: 32, frameHeight: 32});
		this.load.spritesheet("player_dark_run", "assets/imgs/player/dark_run.png",
			{frameWidth: 32, frameHeight: 32});
		this.load.spritesheet("player_bright_idle", "assets/imgs/player/bright_idle.png", 
			{frameWidth: 32, frameHeight: 32});
		this.load.spritesheet("player_dark_idle", "assets/imgs/player/dark_idle.png",
			{frameWidth: 32, frameHeight: 32});
		this.load.glsl("shader_thing", "assets/shaders/frag.glsl");
	}

	create(){
		this.anims.create({
			key : 'bright_run',
			frames : this.anims.generateFrameNumbers('player_bright_run',
				{start : 0, end : 7}),
			frameRate : 10,
			repeat : -1
		});
		this.anims.create({
			key : 'dark_run',
			frames : this.anims.generateFrameNumbers('player_dark_run',
				{start : 0, end : 7}),
			frameRate : 10,
			repeat : -1
		});
		this.anims.create({
			key : 'bright_idle',
			frames : this.anims.generateFrameNumbers('player_bright_idle',
				{start : 0, end : 7}),
			frameRate : 10,
			repeat : -1
		});
		this.anims.create({
			key : 'dark_idle',
			frames : this.anims.generateFrameNumbers('player_dark_idle',
				{start : 0, end : 7}),
			frameRate : 10,
			repeat : -1
		});

		this.scene.start("Test");
	}
}
