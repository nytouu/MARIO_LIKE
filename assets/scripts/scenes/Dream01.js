import { Player } from "../components/Player.js"
import { Level } from "../components/Level.js"

export class Dream01 extends Level {
	constructor(){
		super("Dream01")
	}

	preload(){
		this.load.tilemapTiledJSON("dream01_map", "assets/tiled/dream01.json");
		this.load.image("dream01_tileset", "assets/imgs/scenes/dream01/dream01.png");
	}

	create(){
		this.shader = this.add.shader('shader_thing', 0, 0, 1280, 720);

		const map = this.add.tilemap("dream01_map");
		const tileset = map.addTilesetImage("dream01", "dream01_tileset");
		this.layer = map.createLayer("tiles", tileset);

		this.loadSpikes(map);

		this.physics.world.setBounds(0, 0, this.layer.width, this.layer.height)

		this.layer.setCollisionByProperty({isSolid: true});
		this.currentScreen = 0;

		this.player = new Player(this, 345, 132);

		this.physics.add.collider(this.player, this.layer);
		this.physics.add.collider(this.player, this.spikes, this.killPlayer, null, this, this.player);

		this.player.setCollideWorldBounds(true);

		this.cameras.main.setZoom(2);
		this.cameras.main.pan(SCREEN_WIDTH * 1.5, SCREEN_HEIGHT / 2 + TILE_WIDTH, 0)
	}

    update(){
		if (this.player.x <= SCREEN_WIDTH && this.currentScreen == 0){
			this.currentScreen = -1;
			this.cameras.main.pan(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + TILE_WIDTH, TRANSITION_TIME, "Power2");
			this.transitionPause();
		} else if (this.player.x >= SCREEN_WIDTH && this.currentScreen == -1){
			this.currentScreen = 0;
			this.cameras.main.pan(SCREEN_WIDTH * 1.5, SCREEN_HEIGHT / 2 + TILE_WIDTH, TRANSITION_TIME, "Power2");
			this.transitionPause();
		}
    }
}
