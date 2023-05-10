export class Level extends Phaser.Scene {
	init() {

		this.shouldPause = false;
		this.isPaused = false;
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
}
