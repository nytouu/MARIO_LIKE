import { Level } from "../components/Level.js";
import { Player } from "../components/Player.js";

const WIDTH = 640;
const HEIGHT = 360;

export class Menu extends Level {
	constructor(){
		super("Menu")

		this.click = false;
	}

	preload(){
		this.load.image("pill_logo", "assets/imgs/background/pill_logo.png");
		this.load.image("text_dream", "assets/imgs/background/text_dream.png");
		this.load.image("text_pills", "assets/imgs/background/text_pills.png");
		this.load.image("white", "assets/imgs/background/white.png");
		this.load.image("black", "assets/imgs/background/black.png");
	}

	create(){
		this.black = this.add.image(WIDTH / 2, HEIGHT / 2, "black");
		this.white = this.add.image(WIDTH / 2, HEIGHT / 2, "white");
		this.text_pills = this.add.image(WIDTH / 2, HEIGHT / 2, "text_pills");
		this.text_dream = this.add.image(WIDTH / 2, HEIGHT / 2, "text_dream");
		this.pill_logo = this.add.image(WIDTH / 2, HEIGHT / 2, "pill_logo");

		this.white.setScale(1.1);

		this.player = new Player(this, 0, 0).setVisible(false);

        const layer = this.add.layer();
        layer.add([ 
			this.black,
			this.white,
			this.text_pills, 
			this.text_dream,
			this.pill_logo
		])

        this.input.on('pointerdown', () => this.click = true);
	}

    update(){
        const mx = this.input.mousePointer.x;
        const my = this.input.mousePointer.y;

		if (this.player.inputPad.aOnce) { this.click = true };
		this.player.canDash = false;

		this.black.x = WIDTH / 2 + (1 * (mx / 200));
		this.black.y = HEIGHT / 2 + (1 * (my / 200));

		this.white.x = WIDTH / 2 + (1 * mx / 50);
		this.white.y = HEIGHT / 2 + (1 * my / 50);

		this.text_dream.x = WIDTH / 2 + (1 * mx / 100);
		this.text_dream.y = HEIGHT / 2 + (1 * my / 100);

		this.text_pills.x = WIDTH / 2 + (1 * mx / 120);
		this.text_pills.y = HEIGHT / 2 + (1 * my / 120);

		this.pill_logo.x = WIDTH / 2 + (1 * mx / 20);
		this.pill_logo.y = HEIGHT / 2 + (1 * my / 20);

		if (this.click == true){
			this.cameras.main.fadeOut(900, 0, 0, 0);
			this.loadScene("House01", 1000);
		}
		this.click = false;
    }
}
