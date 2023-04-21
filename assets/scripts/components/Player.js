export class Player extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, hp){
		super(scene, x, y);

		this.texture = "player";
		this.setTexture(this.texture);

		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.hp = hp;

		this.initPlayer();
		this.listenUpdate();
	}

	initPlayer(){
		this.setGravity(0,GRAVITY);
		this.setMaxVelocity(XSPEED, YSPEED);

        this.cursors = this.scene.input.keyboard.createCursorKeys();
		this.canMove = true;
		this.canJump = true;
		this.canDash = true;
		this.isDashing = false;
		this.isJumping = false;
		this.jumpTimer = 0;

		this.onGround = this.body.blocked.down;

		this.dashTrail = this.scene.add.group();
	}

	listenUpdate(){
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this); 
	}

	update(){
		if (!this.active){ return; }

		this.handleInput();

		if (this.isDashing){
			this.drawDashTrail() 
		} else if (this.onGround){
			this.setMaxVelocity(XSPEED, YSPEED);
		}
		this.removeTrail();
	}

	handleInput(){
		const {
			left: keyLeft,
			right: keyRight,
			up: keyUp,
			down: keyDown,
		} = this.cursors;
		const upOnce = Phaser.Input.Keyboard.JustDown(keyUp);
        const keyX = Phaser.Input.Keyboard.JustDown(
			this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X)
		);

		this.onGround = this.body.blocked.down;
		this.onGround && (this.isJumping = false);

		if (this.isDashing && this.isJumping && this.onGround){
			this.interruptDash();
		}

		if (keyX && this.canDash && 
			(keyRight.isDown || keyLeft.isDown || keyUp.isDown || keyDown.isDown)){
			this.isDashing = true;

			var dx = 0, dy = 0;

			if (keyRight.isDown) dx = 1; 
			if (keyLeft.isDown) dx = -1; 
			if (keyUp.isDown) dy = -1
			if (keyDown.isDown) dy = 1;

			this.dash(dx, dy);
		}

		this.basicMovement(keyLeft, keyRight, keyUp, upOnce);
	}

	basicMovement(keyLeft, keyRight, keyUp, upOnce){
		if (this.canMove){
			if (keyLeft.isDown){
				this.setAccelerationX(-ACCELERATION);
			} else if (keyRight.isDown){
				this.setAccelerationX(ACCELERATION);
			} else {
				if (this.onGround){
					this.setAccelerationX(((this.body.velocity.x > 0) ? -1 : 1) * ACCELERATION * 1.5);
				} else {
					this.setAccelerationX(((this.body.velocity.x > 0) ? -1 : 1) * ACCELERATION / 1.5);
				}

				// reset velocity and acceleration when slow enough
				if (Math.abs(this.body.velocity.x) < 20 && Math.abs(this.body.velocity.x) > -20) {
					this.setVelocityX(0);
					this.setAccelerationX(0);
				}
			}
		}

		// handle long jump press
		if (upOnce && this.canJump && this.onGround){
			this.jumpTimer = 1;
			this.canJump = false;
			this.isJumping = true;
			this.setVelocityY(-YSPEED);

			setTimeout(() => {
				this.canJump = true;
			}, 100);
		} else if (keyUp.isDown && this.jumpTimer != 0){
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
	
	dash(dx, dy){
		if (dx == 0 && dy == 0)
			return
		else {
			this.setGravity(0,1); // y gravity to keep this.onGround true when needed
			this.setAcceleration(0,0);
			this.setMaxVelocity(DASH_SPEED, DASH_SPEED);

			this.isDashing = true;
			this.isJumping = false;
			this.canDash = false;
			this.canMove = false;

			this.setVelocityX(dx * DASH_SPEED);
			this.setVelocityY(dy * DASH_SPEED);

			this.body.velocity.normalize().scale(DASH_SPEED);

			this.scene.cameras.main.shake(200, 0.0002);

			setTimeout(() => {
				this.interruptDash();
				!this.isJumping && this.setMaxVelocity(XSPEED, YSPEED);
			}, DASH_TIME);

			setTimeout(() => {
				this.canDash = true;
			}, DASH_TIME + 1000);

			this.setTint(0x00ffff);
		}
	}

	drawDashTrail(){
		const silhouette = this.dashTrail.create(this.x, this.y, this.texture)
			.setDepth(100)
			.setAlpha(0.8);
		this.scene.tweens.addCounter({
			from: 255,
			to: 0,
			duration: 300,
			onUpdate: function (tween)
			{
				const valueGB = Math.floor(tween.getValue());
				const valueR = 255 + Math.floor(Math.floor(tween.getValue())/1.82);

				silhouette.setTintFill(Phaser.Display.Color.GetColor(valueR, valueGB, valueGB));   
			}
		});
	}

	removeTrail(){
		this.dashTrail.children.each(function (silhouette) {
			silhouette.alpha -= 0.05;
			silhouette.alpha <= 0 && silhouette.destroy();
		})
	}

	interruptDash(){
		this.isDashing = false;
		this.canMove = true;

		this.setTint(0xffffff);
		this.setGravity(0, GRAVITY);
	}
}
