import { Spike } from "../components/Spike.js"
import { Orb } from "../components/Orb.js"
import { Bed } from "../components/Bed.js"

export class Level extends Phaser.Scene {
	init() {
		this.isPaused = false;
		this.isGoingOut = false;

		this.cameras.main.fadeIn(700, 0, 0, 0);

		this.spikes = this.physics.add.group();
		this.orbs = this.physics.add.group();
		this.bed = false;

		this.spawnCoords = { x: 0, y: 0 };
		this.cameraCoords = { x: 0, y: 0 };
		this.currentScreen = 0;

	}

	preload() {}

	create() {}

	update() {}

	loadSpikes(map){
		const spikes = map.getObjectLayer("spikes");
		spikes.objects.forEach(spike => {
			this.spikes.add(new Spike(this, spike.x, spike.y, spike.properties[0].value));
		})

		this.spikes.children.each(spike => {
			spike.setImmovable(true);
		})
	}

	loadOrbs(map){
		const orbs = map.getObjectLayer("orbs");
		orbs.objects.forEach(orb => {
			this.orbs.add(new Orb(this, orb.x, orb.y));
		})

		this.orbs.children.each(orb => {
			orb.setImmovable(true);
		})
	}

	loadBed(map){
		const bed = map.getObjectLayer("bed");
		bed.objects.forEach(bed => {
			this.bed = new Bed(this, bed.x + 16, bed.y - 8);
		})
	}

	loadScene(key, time){
		if (!this.isGoingOut){
			this.cameras.main.fadeOut(time, 0, 0, 0);
			setTimeout(() => {
				this.scene.start(key, {
					gamepad: this.player.gamepad,
				});
			}, time)
		}
		this.isGoingOut = true;
	}

	killPlayer(player){
		if (player.alive){
			player.alive = false;

			player.anims.stop();
			player.setTint(0xffffff);

			this.cameras.main.shake(250, 0.002);
			
			player.setMaxVelocity(0);
			player.setVelocity(0);
			player.setGravity(0);
			player.body.allowGravity = false;
			player.setImmovable(true);
			player.body = null;

			setTimeout(() => {
				this.cameras.main.fadeOut(200, 0, 0, 0);
				player.setAlpha(0);
				player.destroy();
			}, 800);
			setTimeout(() => {
				this.scene.start(this.key, {
					spawnCoords: this.spawnCoords, 
					cameraCoords: this.cameraCoords, 
					currentScreen: this.currentScreen,
					gamepad: this.player.gamepad,
				});
			}, 1000);
		}

		player.anims.play("dark_death", true);
	}

	handleOrbs(player){
		player.isNearOrb = true;
	}

	handleLadders(player){
		player.canClimbLadder = true;
	}

	boingOrb(player, orb){
		if (player.isJumping && player.jumpTimer == 1){
			orb.anims.play("orb_boing_anim",true);

			player.interruptDash();

			player.canDash = true;
			player.setTint(0xffffff);
		}
	}

	transitionPause(){
		this.physics.pause();
		this.isPaused = true;
		setTimeout(() => {
			this.physics.resume();
			this.isPaused = false;
			
			if (this.player){
				this.player.canDash = true;
				this.player.setTint(0xffffff);
			}
		}, TRANSITION_TIME * 1.2);
	}

	setupScreen(n, cx, cy, px, py){
		console.log("setup screen ", n)
		this.currentScreen = n;
		this.spawnCoords = {
			x: px,
			y: py 
		};
		this.cameraCoords = {
			x: cx,
			y: cy
		};

		this.cameras.main.pan(this.cameraCoords.x, this.cameraCoords.y, TRANSITION_TIME, "Power2");
		this.transitionPause();
	}
}
