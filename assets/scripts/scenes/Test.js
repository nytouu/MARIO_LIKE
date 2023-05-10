import { Player } from "../components/Player.js"
import { Level } from "../components/Level.js"

export class Test extends Level {
	constructor(){
		super("Test")
	}

	preload(){
		this.load.tilemapTiledJSON("test_map", "assets/tiled/test.json");
	}

	create(){
		const test_map = this.add.tilemap("test_map");
		const tileset =
			test_map.addTilesetImage("placeholder", "placeholder");
		const layer = test_map.createLayer("tiles", tileset);

		this.player = new Player(this, 100, 100, 5);
		this.player.setCollideWorldBounds(true);

		layer.setCollisionByProperty({isSolid: true});
		this.physics.add.collider(this.player, layer);

		this.cameras.main.startFollow(this.player, false, LERP, LERP);
		this.cameras.main.setZoom(5);
	}

    update(){

    }
}
