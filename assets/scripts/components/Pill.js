export class Pill extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y){
		super(scene, x, y);

		this.texture = "pill";
		this.setTexture(this.texture)

		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.setCircle(8);
		this.setOffset(8, 8);

		this.anims.play("pill_anim");
	}
}
