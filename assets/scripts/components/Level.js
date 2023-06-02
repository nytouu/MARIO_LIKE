import { Spike } from "../components/Spike.js"
import { Orb } from "../components/Orb.js"
import { Bed } from "../components/Bed.js"
import { Pill } from "../components/Pill.js"
import { Particle } from "../components/Particle.js";

const MASK_MIN_SCALE = 0;
const MASK_MAX_SCALE = 2.5;

export class Level extends Phaser.Scene {
	init() {
		this.isPaused = false;
		this.isGoingOut = false;

		this.cameras.main.fadeIn(700, 0, 0, 0);

		this.spikes = this.physics.add.group();
		this.orbs = this.physics.add.group();
		this.pills = this.physics.add.group();
		this.bed = false;

		this.spawnCoords = { x: 0, y: 0 };
		this.cameraCoords = { x: 0, y: 0 };
		this.currentScreen = 0;

	}

	preload() {}

	create() {
		/*
			transition effet from 
			https://dev.to/jorbascrumps/creating-spelunky-style-level-transitions-in-phaser-2ajd
		*/
		const maskShape = new Phaser.Geom.Circle(
			this.sys.game.config.width / 2,
			this.sys.game.config.height / 2,
			this.sys.game.config.height / 2
		);
		const maskGfx = this.add.graphics()
			.fillCircleShape(maskShape)
			.generateTexture('mask');

		this.mask = this.add.image(0, 0, 'mask').setPosition(
				this.sys.game.config.width / 2,
				this.sys.game.config.height / 2,
			);

		this.cameras.main.setMask(new Phaser.Display.Masks.BitmapMask(this, this.mask));

		this.events.on(Phaser.Scenes.Events.CREATE, () => {
			const propertyConfig = {
				ease: 'Expo.easeInOut',
				from: MASK_MIN_SCALE,
				start: MASK_MIN_SCALE,
				to: MASK_MAX_SCALE,
			};

			this.tweens.add({
				delay: 0,
				duration: 600,
				scaleX: propertyConfig,
				scaleY: propertyConfig,
				targets: this.mask,
			});
		});
	}

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

	loadPills(map){
		const pills = map.getObjectLayer("pills");
		pills.objects.forEach(pill => {
			this.pills.add(new Pill(this, pill.x, pill.y));
		})

		this.pills.children.each(pill => {
			pill.setImmovable(true);
		})
	}

	loadBed(map){
		const bed = map.getObjectLayer("bed");
		bed.objects.forEach(bed => {
			this.bed = new Bed(this, bed.x + 16, bed.y - 8);
		})
	}

	sceneTransition(time){
		const propertyConfig = {
			ease: 'Expo.easeInOut',
			from: MASK_MAX_SCALE,
			start: MASK_MAX_SCALE,
			to: MASK_MIN_SCALE,
		};

		this.tweens.add({
			delay: 1000 - time,
			duration: time,
			scaleX: propertyConfig,
			scaleY: propertyConfig,
			targets: this.mask,
		});
	}

	loadScene(key, time){
		if (!this.isGoingOut){
			this.cameras.main.fadeOut(time, 0, 0, 0);
			if (this.scene.key != "Menu"){
				this.sceneTransition(time);
			}
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

			this.sceneTransition(700);
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

	handlePills(player, pill){
		if (pill){
			new Particle(this.scene, pill.x, pill.y, "pill_particle_anim");
			pill.destroy();
		}
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
		console.log("setup screen :", n)
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
