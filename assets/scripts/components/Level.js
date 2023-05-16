import { Spike } from "../components/Spike.js"

export class Level extends Phaser.Scene {
	init() {
		this.shouldPause = false;
		this.isPaused = false;

		this.cameras.main.fadeIn(700, 0, 0, 0);

		this.spikes = this.physics.add.group();
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
		spikes.objects.forEach(spike => { this.spikes.add(new Spike(this, spike.x + 8, spike.y - 8)); })

		this.spikes.children.each(spike => {
			spike.setImmovable(true);
		})
	}

	killPlayer(player){
		if (player.alive){
			player.alive = false;

			player.setTint(0xff0000);

			this.cameras.main.shake(250, 0.002);

			setTimeout(() => {
				this.cameras.main.fadeOut(200, 0, 0, 0);
			}, 400);
			setTimeout(() => {
				this.scene.start(this.key)
			}, 600);
		}
	}
}
