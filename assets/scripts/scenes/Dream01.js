import { Player } from "../components/Player.js"
import { Level } from "../components/Level.js"
import { Ladder } from "../components/Ladder.js"

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
			this.spawnCoords = { x: 336, y: 520 };
		}

		if (data.cameraCoords){
			this.cameraCoords = data.cameraCoords;
		} else {
			// default camera point
			this.cameraCoords = { x: SCREEN_WIDTH * 1.5, y: SCREEN_HEIGHT * 2.5 + TILE_WIDTH * 4 };
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
		super.create();

		this.shader = this.add.shader('shader_thing', 0, 16, 1920, 1080);

		const map = this.add.tilemap("dream01_map");
		const tileset = map.addTilesetImage("dream01", "dream01_tileset");
		this.layer = map.createLayer("tiles", tileset);

		this.platforms = this.physics.add.staticGroup();

		this.loadSpikes(map);
		this.loadOrbs(map);
		this.loadPills(map);

		this.player = new Player(this, this.spawnCoords.x, this.spawnCoords.y);
		this.ladder1 = new Ladder(this, 0, 128);
		this.ladder2 = new Ladder(this, 912, -32);

		this.physics.world.setBounds(0, 0, this.layer.width, this.layer.height)
		this.player.setCollideWorldBounds(true);

		if (this.loadGamepad) { this.player.gamepadEventConnect() };

		this.layer.setCollisionByProperty({isSolid: true});

		this.physics.add.collider(this.player, this.layer);
		this.physics.add.collider(this.player, this.platforms);
		this.physics.add.collider(this.player, this.spikes, this.killPlayer, null, this, this.player);
		this.physics.add.overlap(this.player, this.orbs, this.handleOrbs, this.boingOrb, this, this.player);
		this.physics.add.overlap(this.player, this.pills, this.handlePills, null, this.player);

		this.physics.add.overlap(this.player, this.ladder1, this.handleLadders, null, this.player);
		this.physics.add.overlap(this.player, this.ladder2, this.handleLadders, null, this.player);

		this.cameras.main.setZoom(2);
		this.cameras.main.pan(this.cameraCoords.x, this.cameraCoords.y, 0)

		if (this.currentScreen == 2){
			this.platforms.create(this.spawnCoords.x, this.spawnCoords.y, "spike")
				.setSize(48, 2)
				.setOffset(24,16)
				.setVisible(false);
		} else if (this.currentScreen == 5){
			this.cameras.main.startFollow(this.player, false, LERP, LERP);
			this.cameras.main.setBounds(0, 0, this.layer.width, SCREEN_HEIGHT, true);
		}
	}

    update(){
		// transition for first screen
		if (this.currentScreen == 0){
			if (this.player.x <= SCREEN_WIDTH){
				// entering left bonus screen
				this.setupScreen(
					-1, 
					SCREEN_WIDTH / 2,
					SCREEN_HEIGHT * 2.5 + TILE_WIDTH * 4,
					300, 432
				);
			} else if (this.player.x >= SCREEN_WIDTH * 2 && this.player.y > SCREEN_HEIGHT * 2 + TILE_WIDTH * 4){
				// first orb screen
				this.setupScreen(
					1, 
					SCREEN_WIDTH * 2.5,
					SCREEN_HEIGHT * 2.5 + TILE_WIDTH * 4,
					668, 448
				);
			}
		} 
		// start left bonus screen
		else if (this.currentScreen == -1){
			if (this.player.x >= SCREEN_WIDTH){
				let px, py;
				if (this.player.y < 276){
					px = 336, py = 432 ;
				} else {
					px = 348, py = 528 ;
				}

				this.setupScreen(
					0, 
					SCREEN_WIDTH * 1.5,
					SCREEN_HEIGHT * 2.5 + TILE_WIDTH * 4,
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
					SCREEN_HEIGHT * 2.5 + TILE_WIDTH * 4,
					626, 448
				);
			} else if (this.player.y <= SCREEN_HEIGHT * 2 + TILE_WIDTH * 4){
				// enter first up screen
				this.setupScreen(
					2, 
					SCREEN_WIDTH * 2.5,
					SCREEN_HEIGHT * 1.5 + TILE_WIDTH * 2,
					880, 344
				);
				if (this.player.isDashing || this.player.isHyperDashing){
					this.player.interruptDash();
					this.player.canDash = false;
				}

				this.player.setMaxVelocity(0, YSPEED);
				this.player.setGravity(0);

				setTimeout(() => {
					this.player.setGravityY(GRAVITY);

					if (this.player.y > SCREEN_HEIGHT + TILE_WIDTH){
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
					SCREEN_HEIGHT * 1.5 + TILE_WIDTH * 2,
					618, 264
				);
			}
		}
		else if (this.currentScreen == 3){
			if (this.player.x > SCREEN_WIDTH * 2){
				this.setupScreen(
					2, 
					SCREEN_WIDTH * 2.5,
					SCREEN_HEIGHT * 1.5 + TILE_WIDTH * 2,
					666, 264
				);
			}
			if (this.player.x < SCREEN_WIDTH){
				this.setupScreen(
					4, 
					SCREEN_WIDTH * 0.5,
					SCREEN_HEIGHT * 1.5 + TILE_WIDTH * 2,
					298, 216
				);
			}
		}
		else if (this.currentScreen == 4){
			if (this.player.x > SCREEN_WIDTH){
				this.setupScreen(
					3, 
					SCREEN_WIDTH * 1.5,
					SCREEN_HEIGHT * 1.5 + TILE_WIDTH * 2,
					334, 216
				);
			}
			if (this.player.y < SCREEN_HEIGHT + TILE_WIDTH){
				this.setupScreen(
					5, 
					SCREEN_WIDTH * 0.5,
					SCREEN_HEIGHT * 0.5 + TILE_WIDTH,
					40, 168
				);
				setTimeout(() => {
					if (this.currentScreen == 5){
						this.cameras.main.startFollow(this.player, false, LERP, LERP);
						this.cameras.main.setBounds(0, 0, this.layer.width, SCREEN_HEIGHT, true);
					}
				}, TRANSITION_TIME);
			}
		}
		else if (this.currentScreen == 5){
			if (this.player.y > SCREEN_HEIGHT + TILE_WIDTH){
				this.cameras.main.stopFollow();
				this.cameras.main.removeBounds();
				this.setupScreen(
					4, 
					SCREEN_WIDTH * 0.5,
					SCREEN_HEIGHT * 1.5 + TILE_WIDTH * 2,
					36, 232
				);
			}
			if (this.player.x > 830){
				this.spawnCoords = { x: 816, y: 88 };

				if (this.player.y < 16){
					console.log("gg");
				}
			}
		}

		// reset orb value
		this.player.isNearOrb = false;

		// reset ladder values
		this.player.canClimbLadder = false;
		this.player.isClimbingLadder = false;
    }
}
