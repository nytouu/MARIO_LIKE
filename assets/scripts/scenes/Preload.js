import { Level } from "../components/Level.js"

export class Preload extends Level {
	constructor(){
		super("Preload")
	}

	preload(){
		this.load.image("placeholder", "assets/imgs/placeholder.png")
		this.load.image("player", "assets/imgs/woah.png")
	}

	create(){
		this.scene.start("Test");
	}
}
