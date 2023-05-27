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
		} else {
			// default camera point
			this.cameraCoords = { x: SCREEN_WIDTH * 1.5, y: SCREEN_HEIGHT * 2.5 + TILE_WIDTH * 3 };
		}

		if (data.currentScreen){

			this.currentScreen = data.currentScreen;
		} else {
			this.currentScreen = 0;
		}

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
		this.shader = this.add.shader('shader_thing', 0, 0, 1920, 1080);

		const map = this.add.tilemap("dream01_map");
		const tileset = map.addTilesetImage("dream01", "dream01_tileset");
		this.layer = map.createLayer("tiles", tileset);

		this.platforms = this.physics.add.staticGroup();

		this.loadSpikes(map);
		this.loadOrbs(map);

		this.player = new Player(this, this.spawnCoords.x, this.spawnCoords.y);

		this.physics.world.setBounds(0, 0, this.layer.width, this.layer.height)
		this.player.setCollideWorldBounds(true);

		if (this.loadGamepad) { this.player.gamepadEventConnect() };

		this.layer.setCollisionByProperty({isSolid: true});

		this.physics.add.collider(this.player, this.layer);
		this.physics.add.collider(this.player, this.platforms);
		this.physics.add.collider(this.player, this.spikes, this.killPlayer, null, this, this.player);
		this.physics.add.overlap(this.player, this.orbs, this.handleOrbs, this.boingOrb, this, this.player);


		this.cameras.main.setZoom(2);
		this.cameras.main.pan(this.cameraCoords.x, this.cameraCoords.y, 0)
		console.log(this.cameraCoords)

		if (this.currentScreen == 2){
			this.platforms.create(this.spawnCoords.x, this.spawnCoords.y, "spike")
				.setSize(48, 2)
				.setOffset(24,16)
				.setVisible(false);
		}
	}

    update(){
		console.log(this.player.x, this.player.y, this.currentScreen)

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
			} else if (this.player.x >= SCREEN_WIDTH * 2 && this.player.y > SCREEN_HEIGHT * 2 + TILE_WIDTH * 3){
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
			if (this.player.x <= SCREEN_WIDTH * 2){
				this.setupScreen(
					3, 
					SCREEN_WIDTH * 1.5,
					SCREEN_HEIGHT * 1.5 + TILE_WIDTH,
					618, 248
				);
			}
		}
		else if (this.currentScreen == 3){
			if (this.player.x > SCREEN_WIDTH * 2){
				this.setupScreen(
					2, 
					SCREEN_WIDTH * 2.5,
					SCREEN_HEIGHT * 1.5 + TILE_WIDTH,
					666, 248
				);
			}
			if (this.player.x < SCREEN_WIDTH){
				this.setupScreen(
					4, 
					SCREEN_WIDTH * 0.5,
					SCREEN_HEIGHT * 1.5 + TILE_WIDTH,
					298, 200
				);
			}
		}
		else if (this.currentScreen == 3){
			if (this.player.x > SCREEN_WIDTH){
				this.setupScreen(
					4, 
					SCREEN_WIDTH * 1.5,
					SCREEN_HEIGHT * 1.5 + TILE_WIDTH,
					334, 200
				);
			}
		}

		// reset orb value
		this.player.isNearOrb = false;
    }
}
