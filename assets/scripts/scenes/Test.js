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
		this.add.shader('shader_thing', 100, 100, 800, 600);

		const test_map = this.add.tilemap("test_map");
		const tileset = test_map.addTilesetImage("placeholder", "placeholder");
		this.layer = test_map.createLayer("tiles", tileset);

		this.player = new Player(this, 100, 100);

		this.layer.setCollisionByProperty({isSolid: true});
		this.physics.add.collider(this.player, this.layer);
		this.player.setCollideWorldBounds(true);

		this.cameras.main.startFollow(this.player, false, LERP, LERP);
		this.cameras.main.setZoom(2);
	}

    update(){
		const tileRight = this.layer.getTileAtWorldXY(this.player.x + 16, this.player.y);
		const tileLeft = this.layer.getTileAtWorldXY(this.player.x - 16, this.player.y);

		if (this.player.getRightCenter().x + WALL_DISTANCE < tileRight.right && tileRight.collides){
			this.player.collideRight = true;
		} else {
			this.player.collideRight = false;
		}
		if (this.player.getLeftCenter().x - WALL_DISTANCE < tileLeft.right + 16 && tileLeft.collides){
			this.player.collideLeft = true;
		} else {
			this.player.collideLeft = false;
		}
    }
}
