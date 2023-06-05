import { Player } from "../components/Player.js"
import { Level } from "../components/Level.js"
import { Ladder } from "../components/Ladder.js";

export class House01 extends Level {
	constructor(){
		super("House01")
	}

	preload(){
		this.load.tilemapTiledJSON("house01_map", "assets/tiled/house01.json");
		this.load.image("house01_tileset", "assets/imgs/scenes/house01.png");
		this.load.image("door_closed", "assets/imgs/scenes/house01_closed.png");
		this.load.image("door_opened", "assets/imgs/scenes/house01_door_opened.png");
		this.load.spritesheet("door_opening", "assets/imgs/scenes/house01_door_opening.png", 
			{frameWidth: 16, frameHeight: 32});
	}

	create(){
		super.create();

		const map = this.add.tilemap("house01_map");
		const tileset = map.addTilesetImage("tileset", "house01_tileset");
		this.layer = map.createLayer("tiles", tileset);
		
		this.physics.world.setBounds(0, 0, this.layer.width, this.layer.height)

		this.layer.setCollisionByProperty({isSolid: true});

		this.loadBed(map);

		this.ladder = new Ladder(this, 48, 32);
		this.table = new Table(this, 128, 56);
		this.player = new Player(this, 176, 135);

		this.text = this.add.text(64, 152, TEXT_H1,
			{fontFamily: "scientifica", fontSize: "6px", resolution: 10})
			.setDepth(1000)
			.setAlpha(0);

		setTimeout(() => {
			this.tweens.add({
				targets: this.text,
				alpha: 1,
				duration: 500,
				ease: 'Power2'
			});
		}, 1000);

		this.physics.add.collider(this.player, this.layer);
		this.physics.add.overlap(this.player, this.ladder, this.handleLadders, null, this.player);
		this.physics.add.overlap(this.player, this.bed, this.bed.highlightBed, null, this.bed);
		this.physics.add.overlap(this.player, this.table, this.table.highlightTable, null, this.table);

		this.cameras.main.startFollow(this.player, false, LERP, LERP);
		this.cameras.main.setZoom(2);
		this.cameras.main.setBounds(-40, -8, this.layer.width, this.layer.height, true);
	}

	update(){
		this.player.canDash = false;

		this.player.canClimbLadder = false;
		this.player.isClimbingLadder = false;

		if (this.physics.overlap(this.player, this.bed)){
			if (this.player.interract){
				if (this.player.canSleep)
					this.loadScene("Dream01", 1500);
				else 
					this.text.setText(TEXT_H2);
			}
		} else {
			if (this.bed.tintFill){
				this.bed.highlightBed();
			}
		}

		if (this.physics.overlap(this.player, this.table)){
			if (this.player.interract){
				this.table.takePills(this.player);
				this.text.setText(TEXT_H3);
			}
		} else {
			if (this.table.tintFill){
				this.table.highlightTable();
			}
		}
	}
}
