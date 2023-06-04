import { Level } from "../components/Level.js"
import { Player } from "../components/Player.js"

export class Preload extends Level {
	constructor(){
		super("Preload")
	}

	preload(){
		// load images
		this.load.image("placeholder", "assets/imgs/placeholder.png");

		this.load.image("spike", "assets/imgs/spike.png");

		this.load.image("bed", "assets/imgs/bed.png");

		this.load.image("ladder", "assets/imgs/ladder.png");

		this.load.image("orb", "assets/imgs/orb.png");

		this.load.image("player_dark_wall", "assets/imgs/player/dark_wall.png");
		this.load.image("player_dark_dash", "assets/imgs/player/dark_dash.png");

		// load spritesheets
		this.load.spritesheet("orb_boing", "assets/imgs/orb_boing.png", 
			{frameWidth: 16, frameHeight: 16});
		
		this.load.spritesheet("pill", "assets/imgs/pill.png", 
			{frameWidth: 32, frameHeight: 32});
		this.load.spritesheet("pill_particle", "assets/imgs/pill_particle.png", 
			{frameWidth: 32, frameHeight: 32});

		this.load.spritesheet("player_bright_run", "assets/imgs/player/bright_run.png", 
			{frameWidth: 32, frameHeight: 32});
		this.load.spritesheet("player_dark_run", "assets/imgs/player/dark_run.png",
			{frameWidth: 32, frameHeight: 32});
		this.load.spritesheet("player_bright_idle", "assets/imgs/player/bright_idle.png", 
			{frameWidth: 32, frameHeight: 32});
		this.load.spritesheet("player_dark_idle", "assets/imgs/player/dark_idle.png",
			{frameWidth: 32, frameHeight: 32});
		this.load.spritesheet("dash_boing", "assets/imgs/dash_boing.png",
			{frameWidth: 16, frameHeight: 32});
		this.load.spritesheet("player_dark_air", "assets/imgs/player/dark_air.png", 
			{frameWidth: 32, frameHeight: 32});
		this.load.spritesheet("player_dark_jump", "assets/imgs/player/dark_jump.png", 
			{frameWidth: 32, frameHeight: 32});
		this.load.spritesheet("player_dark_land", "assets/imgs/player/dark_land.png", 
			{frameWidth: 32, frameHeight: 32});
		this.load.spritesheet("player_dark_climb", "assets/imgs/player/dark_climb.png", 
			{frameWidth: 32, frameHeight: 32});
		this.load.spritesheet("player_death", "assets/imgs/player/death.png", 
			{frameWidth: 32, frameHeight: 32});

		this.load.spritesheet("orb_particles", "assets/imgs/orb_particles.png",
			{frameWidth: 16, frameHeight: 16});
		this.load.spritesheet("land_particles", "assets/imgs/player/land_particles.png",
			{frameWidth: 32, frameHeight: 32});
		this.load.spritesheet("wall_particles", "assets/imgs/player/wall_particles.png",
			{frameWidth: 32, frameHeight: 32});

		//load shader
		this.load.glsl("shader_thing", "assets/shaders/frag.glsl");

		// load audio
		this.load.audio("dash", "assets/audio/dash.wav");
		this.load.audio("jump", "assets/audio/jump.wav");
		this.load.audio("walk", "assets/audio/walk2.wav");
		this.load.audio("pickup", "assets/audio/pickup.wav");
		this.load.audio("death", "assets/audio/death.wav");
		this.load.audio("dream", "assets/audio/music/dream.mp3");
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
		this.anims.create({
			key : 'dark_jump',
			frames : this.anims.generateFrameNumbers('player_dark_jump',
				{start : 0, end : 5}),
			frameRate : 20,
			repeat : 0
		});
		this.anims.create({
			key : 'dark_air',
			frames : this.anims.generateFrameNumbers('player_dark_air',
				{start : 0, end : 7}),
			frameRate : 10,
			repeat : -1
		});
		this.anims.create({
			key : 'dark_climb',
			frames : this.anims.generateFrameNumbers('player_dark_climb',
				{start : 0, end : 7}),
			frameRate : 10,
			repeat : -1
		});
		this.anims.create({
			key : 'dark_land',
			frames : this.anims.generateFrameNumbers('player_dark_land',
				{start : 0, end : 5}),
			frameRate : 20,
			repeat : 0
		});
		this.anims.create({
			key : 'dark_death',
			frames : this.anims.generateFrameNumbers('player_death',
				{start : 0, end : 7}),
			frameRate : 10,
			repeat : 0
		});
		this.anims.create({
			key: 'dark_wall',
			frames: [ { key: 'player_dark_wall', frame: 0 } ],
			frameRate: 1,
			repeat: -1
		});
		this.anims.create({
			key: 'dark_dash',
			frames: [ { key: 'player_dark_dash', frame: 0 } ],
			frameRate: 1,
			repeat: -1
		});
		this.anims.create({
			key : 'boing',
			frames : this.anims.generateFrameNumbers('dash_boing',
				{start : 0, end : 7}),
			frameRate : 15,
			repeat : -1
		});

		this.anims.create({
			key : 'orb_anim',
			frames : this.anims.generateFrameNumbers('orb_particles',
				{start : 0, end : 7}),
			frameRate : 10,
			repeat : -1
		});
		this.anims.create({
			key : 'orb_boing_anim',
			frames : this.anims.generateFrameNumbers('orb_boing',
				{start : 0, end : 7}),
			frameRate : 15,
			repeat : 0
		});

		this.anims.create({
			key : 'pill_anim',
			frames : this.anims.generateFrameNumbers('pill',
				{start : 0, end : 7}),
			frameRate : 6,
			repeat : -1
		});
		this.anims.create({
			key : 'pill_particle_anim',
			frames : this.anims.generateFrameNumbers('pill_particle',
				{start : 0, end : 11}),
			frameRate : 10,
			repeat : 0
		});

		this.anims.create({
			key : 'land_particles_anim',
			frames : this.anims.generateFrameNumbers('land_particles',
				{start : 0, end : 5}),
			frameRate : 10,
			repeat : 0
		});

		this.anims.create({
			key : 'wall_particles_anim',
			frames : this.anims.generateFrameNumbers('wall_particles',
				{start : 0, end : 5}),
			frameRate : 10,
			repeat : 0
		});

		this.player = new Player(this, 0, 0).setVisible(false);
		this.player.canDash = false;

		this.scene.start("Menu", {
			gamepad: this.player.gamepad,
		});
	}
}
