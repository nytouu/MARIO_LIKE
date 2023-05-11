export class Player extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y){
		super(scene, x, y);

		this.texture = "player_dark_idle";
		this.setTexture(this.texture)

		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.initPlayer();
		this.listenUpdate();
	}

	initPlayer(){
		this.setGravity(0,GRAVITY);
		this.setMaxVelocity(XSPEED, YSPEED);
		this.setSize(8, 16);
		this.setOffset(12, 8);

        this.cursors = this.scene.input.keyboard.createCursorKeys();

		this.canMove = true;
		this.canJump = true;
		this.canDash = true;
		this.isDashing = false;
		this.isJumping = false;
		this.hyperDashing = false;
		this.jumpTimer = 0;
		this.dashTrailCounter = 0;
		this.dashBoingCounter = 0;

		this.onGround = this.body.blocked.down;
		this.blockedLeft = this.body.blocked.left;
		this.blockedRight = this.body.blocked.right;

		// groups for dash and "boing" effects
		this.dashTrail = this.scene.add.group();
		this.dashBoing = this.scene.add.group();

		// gamepad controls
		this.inputPad = {
			up: false,
			down: false,
			left: false,
			right: false,
			a: false,
			aOnce: false,
			x: false,
			xOnce: false,
		};

		this.scene.input.gamepad.on('connected', this.gamepadEventConnect, this);
        this.scene.input.gamepad.on('disconnected', this.gamepadEventDisconnect, this);
	}

	gamepadEventConnect() {
		console.log("Controller connected!");
        this.gamepad = this.scene.input.gamepad.pad1;
		
		// setup events
		this.gamepad.on("down", () => {
			this.handleGamepadButtons("down");
		});
		this.gamepad.on("up", () => {
			this.handleGamepadButtons("up");
		});
	}

    gamepadEventDisconnect(){
        console.log("Controller disconnected!");

        // clear the gamepad
        this.gamepad = null;
        this.gamepadConnected = false;

        // resets inputs when disconnected
        this.resetGamepad();
    }

	handleGamepadButtons(event){
		const buttonA = this.gamepad.buttons[BUTTON_A];
		const buttonX = this.gamepad.buttons[BUTTON_X];

		this.inputPad.x = buttonX.value;
		this.inputPad.a = buttonA.value;

		// aOnce and xOnce are true during 1 frame even when holding a or x
		if (event == "down") {
			if (buttonA.value)
				this.inputPad.aOnce = buttonA.value;
			if (buttonX.value)
				this.inputPad.xOnce = buttonX.value;
		}
	}

	handleGamepadAxis(){
		if (this.gamepad){
			// get axis values
			const horizAxis = this.gamepad.axes[HORIZONTAL_AXIS].value;
			const vertAxis = this.gamepad.axes[VERTICAL_AXIS].value;

			// get dpad values
			const dpadHorizAxis = this.gamepad.axes[DPAD_HORIZONTAL_AXIS].value;
			const dpadVertAxis = this.gamepad.axes[DPAD_VERTICAL_AXIS].value;

			// set input values according to axis/dpad values
			if (horizAxis < AXIS_THRESHOLD && horizAxis > -AXIS_THRESHOLD && 
				vertAxis < AXIS_THRESHOLD && vertAxis > -AXIS_THRESHOLD){
				dpadVertAxis < -AXIS_THRESHOLD ? this.inputPad.up = true : this.inputPad.up = false;
				dpadVertAxis > AXIS_THRESHOLD ? this.inputPad.down = true : this.inputPad.down = false;
				dpadHorizAxis > AXIS_THRESHOLD ? this.inputPad.right = true : this.inputPad.right = false;
				dpadHorizAxis < -AXIS_THRESHOLD ? this.inputPad.left = true : this.inputPad.left = false;
			} else {
				vertAxis < -AXIS_THRESHOLD ? this.inputPad.up = true : this.inputPad.up = false;
				vertAxis > AXIS_THRESHOLD ? this.inputPad.down = true : this.inputPad.down = false;
				horizAxis > AXIS_THRESHOLD ? this.inputPad.right = true : this.inputPad.right = false;
				horizAxis < -AXIS_THRESHOLD ? this.inputPad.left = true : this.inputPad.left = false;
			}
		}
	}

	resetGamepad(){
		// avoid ghost inputs when disconnecting gamepad
		this.inputPad = {
			up: false,
			down: false,
			left: false,
			right: false,
			a: false,
			x: false,
			aOnce: false,
			xOnce: false,
		};
	}

	listenUpdate(){
		// "attach" player update with scene update
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this); 
	}

	update(){
		if (!this.active){ return; }
		
		// handle inputs
		this.handleGamepadAxis();
		this.handleInput();

		if (this.isDashing){
			this.drawDashTrail();
		} else if (this.hyperDashing){
			this.hyperDash();
		} else if (this.onGround){
            // FIXME don't do this every frame
			this.setMaxVelocity(XSPEED, YSPEED);
            this.isJumping = false;
			this.hyperDashing = false;
            this.canDash = true;
            this.setTint(0xffffff);
		} else if (this.scaleX != 1 || this.scaleY != 1) {
			this.resetSize();
		}

		// slow down after hyper dash
		if (this.isDashing && this.isJumping && this.onGround){
			setTimeout(() => { 
				!this.isDashing && this.setMaxVelocity(DASH_SPEED / 1.2, YSPEED);
			}, 200);
			setTimeout(() => { 
				!this.isDashing && this.setMaxVelocity(DASH_SPEED / 1.5, YSPEED);
				this.hyperDashing = false;
			}, 400);
			setTimeout(() => {
				!this.isDashing && this.setMaxVelocity(XSPEED, YSPEED);
			}, 600);
			this.interruptDash();
			this.hyperDashing = true;
		}

		this.removeTrail();
		this.removeBoing();

		// reset these values
		this.inputPad.aOnce = 0;
		this.inputPad.xOnce = 0;
	}

	handleInput(){
		// setup keyboard input keys
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

		// set player properties
		this.onGround = this.body.blocked.down;
		this.blockedLeft = this.body.blocked.left;
		this.blockedRight = this.body.blocked.right;

		// handle dash
		if ((keyX || this.inputPad.xOnce) && this.canDash && 
			((keyRight.isDown || keyLeft.isDown || keyUp.isDown || keyDown.isDown) ||
			(this.inputPad.right || this.inputPad.left || this.inputPad.up || this.inputPad.down))){

			var dx = 0, dy = 0;
			
			// dash direction
			if (this.inputPad.right) dx = 1; 
			if (this.inputPad.left) dx = -1; 
			if (this.inputPad.up) dy = -1

			if (keyRight.isDown) dx = 1; 
			if (keyLeft.isDown) dx = -1; 
			if (keyUp.isDown) dy = -1

			// down/right or down/left while on ground are the same as left or right
			if (!this.onGround){
				if (this.inputPad.down) dy = 1;
				if (keyDown.isDown) dy = 1;
			}

			this.dash(dx, dy);
		}

		this.basicMovement(keyLeft, keyRight, keyUp, upOnce);
	}

	basicMovement(keyLeft, keyRight, keyUp, upOnce){
		if (this.canMove){
			if (keyLeft.isDown || this.inputPad.left){
				this.setAccelerationX(-ACCELERATION);
				this.setFlipX(0);
				this.anims.play("dark_run", true);
			} else if (keyRight.isDown || this.inputPad.right){
				this.setAccelerationX(ACCELERATION);
				this.setFlipX(1);
				this.anims.play("dark_run", true);
			} else {
				if (this.onGround){
					// set ground acceleration
					this.setAccelerationX(((this.body.velocity.x > 0) ? -1 : 1) * ACCELERATION * 1.5);
				} else {
					// set air acceleration
					this.setAccelerationX(((this.body.velocity.x > 0) ? -1 : 1) * ACCELERATION / 1.5);
				}

				// reset velocity and acceleration when slow enough
				if (Math.abs(this.body.velocity.x) < 20 && Math.abs(this.body.velocity.x) > -20) {
					this.setVelocityX(0);
					this.setAccelerationX(0);
					this.anims.play("dark_idle", true);
				}
			}
		}

		// handle long jump press
		if ((upOnce || this.inputPad.aOnce) && this.canJump && this.onGround){
			this.jumpTimer = 1;
			this.canJump = false;
			this.isJumping = true;
			this.setVelocityY(-YSPEED);

			setTimeout(() => {
				this.canJump = true;
			}, 100);
		} else if ((keyUp.isDown || this.inputPad.a) && this.jumpTimer != 0 && !this.isDashing){
			if (this.jumpTimer > 12) {
				this.jumpTimer = 0;
			} else {
				// jump higher if holding jump
				this.jumpTimer++;
				this.setVelocityY(-YSPEED);
			}
		} else if (this.jumpTimer != 0){
			this.jumpTimer = 0;
		} else if (upOnce || this.inputPad.aOnce && !this.onGround){
			// handle walljumps
			if (this.blockedRight){
				this.wallJump(LEFT);
			} else if (this.blockedLeft){
				this.wallJump(RIGHT);
			}
		}
	}

	wallJump(dir){
		this.jumpTimer = 1;
		this.canJump = false;
		this.isJumping = true;
		this.hyperDashing = false;

		this.setAccelerationX(dir * WALLJUMP_XSPEED);
		this.setMaxVelocity(WALLJUMP_XSPEED, WALLJUMP_YSPEED);
		this.setVelocity(dir * WALLJUMP_XSPEED, -WALLJUMP_XSPEED);

		// slow down after wall jumping
		setTimeout(() => { 
			this.canJump = true;
			!this.isDashing && this.setMaxVelocity(WALLJUMP_XSPEED / 1.2, WALLJUMP_YSPEED / 1.2);
		}, 100);
		setTimeout(() => { 
			!this.isDashing && this.setMaxVelocity(WALLJUMP_XSPEED / 1.5, YSPEED);
		}, 200);
		setTimeout(() => {
			!this.isDashing && this.setMaxVelocity(XSPEED, YSPEED);
		}, 300);
	}
	
	dash(dx, dy){
		if (dx == 0 && dy == 0)
			return
		else {
			this.isDashing = true;

			this.setGravity(0,1); // y gravity to keep this.onGround true when needed
			this.setAcceleration(0,0);
			this.setMaxVelocity(DASH_SPEED, DASH_SPEED);

			// player is in dash state
			this.isDashing = true;
			this.isJumping = false;
			this.canDash = false;
			this.canMove = false;

			this.setVelocityX(dx * DASH_SPEED);
			this.setVelocityY(dy * DASH_SPEED);

			this.body.velocity.normalize().scale(DASH_SPEED);

			this.scene.cameras.main.shake(150, 0.002);

			setTimeout(() => {
				if (this.onGround){ 
					this.canDash = true;
					this.setTint(0xffffff);
				}
			}, DASH_TIME - DASH_RESET_TIME),

			setTimeout(() => {
				this.interruptDash();
				!this.isJumping && this.setMaxVelocity(XSPEED, YSPEED);
			}, DASH_TIME);

			this.setTint(0x00ffff);
		}
	}

	drawDashTrail(){
		this.dashTrailCounter++;

		if (this.dashTrailCounter % DASH_TRAIL_INTERVAL == 0) {
			const silhouette = this.dashTrail.create(this.x, this.y, this.texture)
				.setDepth(100)
				.setAlpha(0.9);

			// change color for silhouette
			this.scene.tweens.addCounter({
				from: 255,
				to: 80,
				duration: 300,
				onUpdate: function (tween) {
					const G = 255 + Math.floor(Math.floor(tween.getValue())/1.72);
					const RB = Math.floor(tween.getValue());

					silhouette.setTintFill(Phaser.Display.Color.GetColor(RB, G, RB));   
				}
			});
		}
	}


	drawDashBoing(){
		this.dashBoingCounter++;

		if (this.dashBoingCounter % DASH_BOING_INTERVAL == 0) {
			const boing = this.dashBoing.create(this.x, this.y, "dash_boing")
				.setDepth(80)
				.setAlpha(0.8);
			
			// this.body.velocity.angle is in rad but setAngle requires a value in degrees
			boing.setAngle(this.body.velocity.angle() * 180 / PI);

			boing.anims.play("boing");
		}
	}

	removeTrail(){
		this.dashTrail.children.each(function (silhouette) {
			silhouette.alpha -= 0.05;
			silhouette.alpha <= 0 && silhouette.destroy();
		})
	}

	removeBoing(){
		this.dashBoing.children.each(function (boing) {
			boing.alpha -= 0.05;
			boing.alpha <= 0 && boing.destroy();
		})
	}

	interruptDash(){
		this.isDashing = false;
		this.canMove = true;

		this.setGravity(0, GRAVITY);
	}

	hyperDash(){
		// squeeze player sprite
		this.shrinkY();
		this.increaseX();

		this.drawDashBoing() ;
	}

	shrinkX(){
		if (this.scaleX > SHRINK_MIN){
			this.scaleX -= SHRINK_INCREMENT;
		}
	}

	shrinkY(){
		if (this.scaleY > SHRINK_MIN){
			this.scaleY -= SHRINK_INCREMENT;
		}
	}

	increaseX(){
		if (this.scaleX < INCREASE_MAX){
			this.scaleX += SHRINK_INCREMENT;
		}
	}

	increaseY(){
		if (this.scaleY < INCREASE_MAX){
			this.scaleY += SHRINK_INCREMENT;
		}
	}

	resetSize(){
		this.scaleX < 1 ? this.scaleX += SHRINK_INCREMENT : this.scaleX -= SHRINK_INCREMENT;
		this.scaleY < 1 ? this.scaleY += SHRINK_INCREMENT : this.scaleY -= SHRINK_INCREMENT;
	}
}
