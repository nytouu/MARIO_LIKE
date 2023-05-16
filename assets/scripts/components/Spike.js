const OFFSET = 8;
const WIDTH = 16;
const HEIGHT = 2;

export class Spike extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, dir){
		super(scene, x, y);

		this.texture = "spike";
		this.setTexture(this.texture)

		scene.add.existing(this);
		scene.physics.add.existing(this);
		
		this.setup(dir)
	}

	setup(dir){
		switch (dir){
			case "up":
				this.x += OFFSET;
				this.y -= OFFSET;
				this.setSize(WIDTH, HEIGHT)
				this.setOffset(0, WIDTH - HEIGHT)
				break;
			case "down":
				this.setFlipY(true);
				this.x += OFFSET;
				this.y -= OFFSET;
				this.setSize(WIDTH, HEIGHT)
				this.setOffset(0, 0)
				break;
			case "left":
				this.setRotation(-PI / HEIGHT);
				this.x -= OFFSET;
				this.y -= OFFSET;
				this.setSize(HEIGHT, WIDTH)
				this.setOffset(WIDTH - HEIGHT, 0)
				break;
			case "right":
				this.setRotation(PI / HEIGHT);
				this.x += OFFSET;
				this.y += OFFSET;
				this.setSize(HEIGHT, WIDTH)
				this.setOffset(0, 0)
				break;
		}
	}
}
