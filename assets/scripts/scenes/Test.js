import { Player } from "../components/Player.js"
import { Level } from "../components/Level.js"

export class Test extends Level {
	constructor(){
		super("Test")
	}

	preload(){
		this.load.tilemapTiledJSON("test_map", "assets/tiled/test2.json");
	}

	create(){
		// const bendPipeline = this.renderer.pipelines.get('Bend');
		this.shader = this.add.shader('shader_thing', 0, 0, 1280, 720);

		const test_map = this.add.tilemap("test_map");
		const tileset = test_map.addTilesetImage("tilesex", "placeholder");
		this.layer = test_map.createLayer("tiles", tileset);
		
		this.loadSpikes(test_map);

		this.physics.world.setBounds(0, 0, this.layer.width, this.layer.height)

		this.layer.setCollisionByProperty({isSolid: true});

		this.player = new Player(this, 300, 256);

		this.physics.add.collider(this.player, this.layer);
		this.physics.add.collider(this.player, this.spikes, this.killPlayer, null, this, this.player);

		this.player.setCollideWorldBounds(true);

		this.cameras.main.startFollow(this.player, false, LERP, LERP);
		this.cameras.main.setZoom(2);
	}

    update(){
		// console.log(this.player.x, this.player.y)
    }

	touchSpike(){
		console.log("skljdfkjlsdfjkl")
	}
}
