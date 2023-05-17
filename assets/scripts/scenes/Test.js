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
		this.loadOrbs(test_map);

		this.physics.world.setBounds(0, 0, this.layer.width, this.layer.height)

		this.layer.setCollisionByProperty({isSolid: true});

		this.player = new Player(this, 100, 256);

		this.physics.add.collider(this.player, this.layer);
		this.physics.add.collider(this.player, this.spikes, this.killPlayer, null, this, this.player);
		this.physics.add.overlap(this.player, this.orbs, this.handleOrbs, this.boingOrb, this, this.player);

		this.player.setCollideWorldBounds(true);

		this.cameras.main.startFollow(this.player, false, LERP, LERP);
		this.cameras.main.setZoom(2);
	}

    update(){
		// reset orb value
		this.player.isNearOrb = false;
    }
}
