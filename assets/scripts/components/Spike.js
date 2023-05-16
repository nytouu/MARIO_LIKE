export class Spike extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y){
		super(scene, x, y);

		this.texture = "spike";
		this.setTexture(this.texture)

		scene.add.existing(this);
		scene.physics.add.existing(this);
		
		this.setSize(16,2)
		this.setOffset(0,14)
	}
}
