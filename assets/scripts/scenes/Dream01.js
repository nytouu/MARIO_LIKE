import { Player } from "../components/Player.js"
import { Level } from "../components/Level.js"

export class Dream01 extends Level {
	constructor(){
		super("Dream01")
	}

	init(data){
		super.init();

		if (data.spawnCoords){
			this.spawnCoords = data.spawnCoords;
		} else {
			// default spawn point
			this.spawnCoords = { x: 336, y: 504 };
		}

		if (data.cameraCoords){
			this.cameraCoords = data.cameraCoords;
			console.log(this.cameraCoords)
		} else {
			// default camera point
			this.cameraCoords = { x: SCREEN_WIDTH * 1.5, y: SCREEN_HEIGHT * 2.5 + TILE_WIDTH * 3 };
		}
		this.currentScreen = data.currentScreen;
		this.platformSpawned = false;

		this.loadGamepad = false;
		if (data.gamepad){
			this.loadGamepad = true;
		}
	}

	preload(){
		this.load.tilemapTiledJSON("dream01_map", "assets/tiled/dream01.json");
		this.load.image("dream01_tileset", "assets/imgs/scenes/dream01/dream01.png");
	}

	create(){
		// this.shader = this.add.shader('shader_thing', 0, 0, 1280, 720);

		const map = this.add.tilemap("dream01_map");
		const tileset = map.addTilesetImage("dream01", "dream01_tileset");
		this.layer = map.createLayer("tiles", tileset);

		this.platforms = this.physics.add.staticGroup();
		// this.platforms.create(this.spawnCoords.x, this.spawnCoords.y, "spike").setSize(16, 2);

		this.loadSpikes(map);
		this.loadOrbs(map);

		this.physics.world.setBounds(0, 0, this.layer.width, this.layer.height)

		this.layer.setCollisionByProperty({isSolid: true});
		this.currentScreen = 0;

		this.player = new Player(this, this.spawnCoords.x, this.spawnCoords.y);

		if (this.loadGamepad) { this.player.gamepadEventConnect() };

		this.physics.add.collider(this.player, this.layer);
		this.physics.add.collider(this.player, this.platforms);
		this.physics.add.collider(this.player, this.spikes, this.killPlayer, null, this, this.player);
		this.physics.add.overlap(this.player, this.orbs, this.handleOrbs, this.boingOrb, this, this.player);

		// this.player.setCollideWorldBounds(true);

		this.cameras.main.setZoom(2);
		this.cameras.main.pan(this.cameraCoords.x, this.cameraCoords.y, 0)
		console.log(this.cameraCoords)
	}

    update(){
		console.log(this.player.x, this.player.y, this.currentScreen)

		// this.shader.x = this.player.x;
		// this.shader.y = this.player.y;

		// transition for first screen
		if (this.currentScreen == 0){
			if (this.player.x <= SCREEN_WIDTH){
				// entering left bonus screen
				this.setupScreen(
					-1, 
					SCREEN_WIDTH / 2,
					SCREEN_HEIGHT * 2.5 + TILE_WIDTH * 3,
					300, 416
				);
			} else if (this.player.x >= SCREEN_WIDTH * 2){
				// first orb screen
				this.setupScreen(
					1, 
					SCREEN_WIDTH * 2.5,
					SCREEN_HEIGHT * 2.5 + TILE_WIDTH * 3,
					668, 432
				);
			}
		} 
		// start left bonus screen
		else if (this.currentScreen == -1){
			if (this.player.x >= SCREEN_WIDTH){
				let px, py;
				if (this.player.y < 260){
					px = 336, py = 416 ;
				} else {
					px = 348, py = 512 ;
				}

				this.setupScreen(
					0, 
					SCREEN_WIDTH * 1.5,
					SCREEN_HEIGHT * 2.5 + TILE_WIDTH * 3,
					px, py
				);
			}
		}
		// first orb screen
		else if (this.currentScreen == 1){
			if (this.player.x <= SCREEN_WIDTH * 2){
				// enter first screen
				this.setupScreen(
					0, 
					SCREEN_WIDTH * 1.5,
					SCREEN_HEIGHT * 2.5 + TILE_WIDTH * 3,
					626, 432
				);
			} else if (this.player.y <= SCREEN_HEIGHT * 2 + TILE_WIDTH * 3){
				// enter first up screen
				this.setupScreen(
					2, 
					SCREEN_WIDTH * 2.5,
					SCREEN_HEIGHT * 1.5 + TILE_WIDTH,
					880, 328
				);
				if (this.player.isDashing || this.player.isHyperDashing){
					this.player.interruptDash();
					this.player.canDash = false;
				}

				this.player.setMaxVelocity(0, YSPEED);
				this.player.setGravity(0);

				setTimeout(() => {
					this.player.setGravityY(GRAVITY);

					if (this.player.y > SCREEN_HEIGHT){
						this.player.y = this.spawnCoords.y;
					}

					// place platform to avoid falling down
					this.platforms.create(this.spawnCoords.x, this.spawnCoords.y, "spike")
						.setSize(48, 2)
						.setOffset(24,16)
						.setVisible(false);
				}, 800);
			}
		}
		else if (this.currentScreen == 2){

		}

		// reset orb value
		this.player.isNearOrb = false;
    }
}
