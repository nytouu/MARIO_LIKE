export class Bed extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y){
		super(scene, x, y);

		this.texture = "bed";
		this.setTexture(this.texture)

		scene.add.existing(this);
		scene.physics.add.existing(this);
	}

	highlightBed(check){
		if (check && this.tintFill != 0xffffff){
			this.setTintFill(0xffffff);
			this.setAlpha(0.5);
		} else if (!check){
			this.clearTint();	
			this.setAlpha(1);
		}
	}
}
