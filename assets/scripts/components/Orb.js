export class Orb extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y){
		super(scene, x, y);

		this.texture = "orb";
		this.setTexture(this.texture)

		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.setCircle(10);
		this.setOffset(-2, -2);

		this.particles = this.scene.add.sprite(this.x, this.y, "orb_particles");
		this.particles.anims.play("orb_anim");
	}
}
