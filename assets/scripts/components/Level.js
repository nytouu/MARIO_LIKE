import { Spike } from "../components/Spike.js"
import { Orb } from "../components/Orb.js"

export class Level extends Phaser.Scene {
	init() {
		this.shouldPause = false;
		this.isPaused = false;

		this.cameras.main.fadeIn(700, 0, 0, 0);

		this.spikes = this.physics.add.group();
		this.orbs = this.physics.add.group();
	}

	preload() {}

	create() {}

	update() {
		if (this.shouldPause && !this.isPaused) {
			this.pause();
		}
	}

	pause() {
		this.physics.pause();
		this.isPaused = true;
	}

	unpause() {
		this.physics.resume();
		this.isPaused = false;
	}

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
		const spikes = map.getObjectLayer("orbs");
		spikes.objects.forEach(orb => {
			this.orbs.add(new Orb(this, orb.x, orb.y));
		})

		this.orbs.children.each(orb => {
			orb.setImmovable(true);
		})
	}

	killPlayer(player){
		if (player.alive){
			player.alive = false;

			if (player.isDashing || player.isHyperDashing){
				// in case max velocity is reset after a dash
				player.interruptDash();
			}

			player.anims.stop();
			player.anims.play("dark_death");
			player.setTint(0xffffff);

			this.cameras.main.shake(250, 0.002);
			
			player.setMaxVelocity(0);
			player.setVelocity(0);
			player.setGravity(0);
			player.setImmovable(true);

			setTimeout(() => {
				this.cameras.main.fadeOut(200, 0, 0, 0);
				player.setAlpha(0);
				player.destroy();
			}, 800);
			setTimeout(() => {
				this.scene.start(this.key)
			}, 1000);
		}
	}

	handleOrbs(player){
		player.isNearOrb = true;
	}

	boingOrb(player, orb){
		if (player.isJumping && player.jumpTimer == 1)
			orb.anims.play("orb_boing_anim",true);
	}
}
