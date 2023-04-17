export class Player extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, hp){
		super(scene, x, y);

		this.setTexture("player");

		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.hp = hp;

		this.initPlayer();
		this.listenUpdate();
	}

	initPlayer(){
		this.body.setMaxVelocityX(XSPEED);
		this.body.setMaxVelocityY(YSPEED);

        this.cursors = this.scene.input.keyboard.createCursorKeys();
		this.canMove = true;
		this.canJump = true;
		this.canDash = true;
		this.isDashing = false;
		this.jumpTimer = 0;

		this.onGround = this.body.blocked.down;
	}

	listenUpdate(){
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this); 
	}

	update(){
		if (!this.active){ return; }

		this.handleInput();
	}

	handleInput(){
		const {left, right, up, down } = this.cursors;
		const upOnce = Phaser.Input.Keyboard.JustDown(up);

		this.onGround = this.body.blocked.down;

		if (this.canMove && left.isDown){
			this.setAccelerationX(-ACCELERATION);
		} else if (this.canMove && right.isDown){
			this.setAccelerationX(ACCELERATION);
		} else {
			if (this.onGround){
				this.setAccelerationX(((this.body.velocity.x > 0) ? -1 : 1) * ACCELERATION * 1.5);
			} else {
				this.setAccelerationX(((this.body.velocity.x > 0) ? -1 : 1) * ACCELERATION / 1.5);
			}
			if (Math.abs(this.body.velocity.x) < 20 && Math.abs(this.body.velocity.x) > -20) {
				this.setVelocityX(0);
				this.setAccelerationX(0);
			}
		}

		if (upOnce && this.canJump && this.onGround){
			this.jumpTimer = 1;
			this.canJump = false;
			this.setVelocityY(-YSPEED);

			setTimeout(() => {
				this.canJump = true;
			}, 100);
		} else if (up.isDown && this.jumpTimer != 0){
			if (this.jumpTimer > 12) {
				this.jumpTimer = 0;
			} else {
				this.jumpTimer++;
				this.setVelocityY(-YSPEED);
			}
		} else if (this.jumpTimer != 0){
			this.jumpTimer = 0;
		}

	}
}
