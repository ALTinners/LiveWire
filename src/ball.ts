import * as Globals from './globals';


const startPoses = [
	[100, 100],
	[Globals.ScreenWidth - 100, 100],
	[Globals.ScreenWidth - 100, Globals.ScreenHeight - 100],
	[100, Globals.ScreenHeight - 100]
]

const colors = [
	'#ff0000',
	'#00ff00',
	'#0000ff',
	'#ffffff'
];

enum PowerUp {
	//None,
	Speedy,
	MachineGun,
	SpreadShot,


	Count
}

export enum Direction {
	Left,
	Right,
	Up,
	Down
}

export class Energy {
	strength = 0; 
	travelling: Direction;

	constructor(public travel: Direction, public strengths: number) {
		this.travelling = travel;
		this.strength = strengths;
	}
}

export class BigBall {
	energies = new Array<Energy>();
	newEnergies = new Array<Energy>();
	energy = 0;

	energyToAdd: Energy;

	color: any;
	sprite: Phaser.Sprite;
	body: Phaser.Physics.Arcade.Body;

	index: number;

	lastShot: number;

	powerUp: PowerUp;

	isDead = false;

	constructor(private globalCollisionGroup: Phaser.Group, public add: Phaser.GameObjectFactory, public i: number) {

		this.index = i;

		this.powerUp = Math.floor(Math.random() * PowerUp.Count);

		// pad.deadZone = 0;

		let yMidpoint = Globals.ScreenHeight/2;
		let xMidpoint = 90 + ( (Globals.ScreenWidth - 90 - 90)/Globals.NumberOfParticles ) * this.index; 

		this.sprite = add.sprite(xMidpoint, yMidpoint);
		this.sprite.rotation = Math.PI/2;
		this.sprite.angle =  Math.PI/2;

		(<any>this.sprite).player = this;//HACK
		globalCollisionGroup.add(this.sprite);

		// this.pad.game.physics.arcade.enable(this.sprite);
		this.body = <Phaser.Physics.Arcade.Body>this.sprite.body;
		this.body.setCircle(Globals.PlayerRadius, 0, 0);
		this.body.collideWorldBounds = true;
		this.color = colors[0]; //hack
		this.body.rotation  = Math.PI/2;
		this.body.angle  = Math.PI/2;
	}

	update() {
		// if (!this.pad.connected) return;
		this.energies = this.newEnergies;

		this.newEnergies = [];

		let speed = Globals.PlayerSpeed;
		for (let anEnergy of this.energies) {
			this.energy += anEnergy.strength;
		}
		this.body.velocity.set(0, this.energy);

		this.energy *= Globals.EnergyDecay;

		let yMidpoint = Globals.ScreenHeight/2;

		if(this.body.position.y != yMidpoint) {
			this.body.velocity.set(0, this.body.velocity.y - (this.body.position.y - yMidpoint) * 2.5);
		}
	}
}