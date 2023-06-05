export class Table extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y){
		super(scene, x, y);

		this.anims.play("table_with_pills")

		this.pills = true;

		scene.add.existing(this);
		scene.physics.add.existing(this);
	}

	highlightTable(check){
		if (check && this.tintFill != 0xffffff){
			this.setTintFill(0xffffff);
			this.setAlpha(0.5);
		} else if (!check){
			this.clearTint();	
			this.setAlpha(1);
		}
	}

	takePills(player){
		if (this.pills){
			this.anims.play("table_no_pills")

			this.pills = false;
			player.takePills();
		}
	}
}
