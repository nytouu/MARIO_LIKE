export class Ladder extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y){
		super(scene, x, y);

		this.texture = "ladder";
		this.setTexture(this.texture)

		scene.add.existing(this);
		scene.physics.add.existing(this);
		
		this.setup();
	}

	setup(){
		this.setOrigin(0,0);
		this.setDepth(-1);
	}
}
