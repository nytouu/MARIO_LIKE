export class Particle extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, key){
		super(scene, x, y);

		this.texture = key;
		this.setTexture(this.texture)

		this.anims.play(key);

		scene.add.existing(this);
		scene.physics.add.existing(this);

		setTimeout(() => {
			this.destroy();
		}, 500);
	}
}
