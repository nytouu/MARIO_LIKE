import { Player } from "../components/Player.js"
import { Level } from "../components/Level.js"
import { Ladder } from "../components/Ladder.js";
import { Table } from "../components/Table.js";

export class House02 extends Level {
	constructor(){
		super("House02")
	}

	init(data){
		this.loadGamepad = false;
		if (data.gamepad){
			this.loadGamepad = true;
		}
	}

	preload(){
		this.load.tilemapTiledJSON("house01_map", "assets/tiled/house01.json");
		this.load.image("house02_tileset", "assets/imgs/scenes/house02.png");
		this.load.image("bed", "assets/imgs/bed2.png");
	}

	create(){
		super.create();

		const map = this.add.tilemap("house01_map");
		const tileset = map.addTilesetImage("tileset", "house02_tileset");
		this.layer = map.createLayer("tiles", tileset);
		
		this.physics.world.setBounds(0, 0, this.layer.width, this.layer.height)

		this.layer.setCollisionByProperty({isSolid: true});

		this.loadBed(map);

		this.ladder = new Ladder(this, 48, 32);

		this.table = new Table(this, 128, 56);
		this.table.hidePills();

		this.player = new Player(this, 148, 56);
		if (this.loadGamepad) { this.player.gamepadEventConnect() };

		// this.text = this.add.text(64, 152, TEXT_H1,
		// 	{fontFamily: "scientifica", fontSize: "6px", resolution: 10})
		// 	.setDepth(1000)
		// 	.setAlpha(0);
		//
		// setTimeout(() => {
		// 	this.tweens.add({
		// 		targets: this.text,
		// 		alpha: 1,
		// 		duration: 500,
		// 		ease: 'Power2'
		// 	});
		// }, 1000);

		this.physics.add.collider(this.player, this.layer);
		this.physics.add.overlap(this.player, this.ladder, this.handleLadders, null, this.player);
		this.physics.add.overlap(this.player, this.bed, this.bed.highlightBed, null, this.bed);

		this.cameras.main.startFollow(this.player, false, LERP, LERP);
		this.cameras.main.setZoom(2);
		this.cameras.main.setBounds(-40, -8, this.layer.width, this.layer.height, true);
	}

	update(){
		this.player.canDash = false;

		if (this.physics.overlap(this.player, this.bed)){
			if (this.player.interract){
				this.text.setText(TEXT_H01_2);
			}
		} else {
			if (this.bed.tintFill){
				this.bed.highlightBed();
			}
		}

		this.player.canClimbLadder = false;
		this.player.isClimbingLadder = false;
	}
}
