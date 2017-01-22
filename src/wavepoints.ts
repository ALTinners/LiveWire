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

export class Wavepoint {
	energies = new Array<Energy>();
	newEnergies = new Array<Energy>();
	energy = 0;

	energyToAdd: Energy;

	color: any;
	// sprite: Phaser.Graphics;
	sprite: Phaser.Sprite;
	mask: Phaser.Graphics;
	body: Phaser.Physics.P2.Body;

	index: number;

	lastShot: number;

	powerUp: PowerUp;

	isDead = false;

	constructor(public wireCollisionGroup: Phaser.Physics.P2.CollisionGroup, public ballCollisionGroup: Phaser.Physics.P2.CollisionGroup, public state: Phaser.State, public i: number) {

		this.index = i;

		this.powerUp = Math.floor(Math.random() * PowerUp.Count);

		// pad.deadZone = 0;

		let yMidpoint = Globals.WireStartHeight;
		let divWidth = Globals.ScreenWidth/Globals.NumberOfParticles;
		let xMidpoint = divWidth * this.index + divWidth/2;

		// this.sprite = state.add.sprite(xMidpoint, yMidpoint);
		// this.sprite = state.add.graphics(xMidpoint, yMidpoint);
		// this.sprite.lineStyle(1, 0xFFFFFF, 1);
		// this.sprite.beginFill(0xffffff, 0.3);
		// this.sprite.drawCircle( 0, 0, Globals.ParticleRadius*2);

		this.sprite = state.add.sprite(xMidpoint, yMidpoint, 'waveform');
		// this.sprite.scale.x = 0.05;
		// this.sprite.scale.y = 0.05;
		// this.sprite.tint = 0xFF00FF;



		// this.sprite.mask = this.mask;

		// this.pad.game.physics.arcade.enable(this.sprite);
		state.physics.p2.enable(this.sprite/*, Globals.DebugRender*/);
		this.body = <Phaser.Physics.P2.Body>this.sprite.body;
		// this.body = <Phaser.Physics.P2.Body>this.sprite.body;
		this.body.setCircle(Globals.ParticleRadius, 0, 0);
		this.color = colors[0]; //hack
		this.body.collideWorldBounds = true;
		this.body.data.gravityScale = 0;
		this.body.mass = Globals.WaveMass;

		this.body.setCollisionGroup(wireCollisionGroup);
		this.body.collides([state.physics.p2.boundsCollisionGroup, this.ballCollisionGroup] );

		// collisionGroup.add(this.sprite);

		// this.body.rotation  = Math.PI/2;
		// this.body.angle  = Math.PI/2;

		// pad.onDownCallback = (inputIndex: number) => {
		// 	//right bumper
		// 	if (inputIndex == 5) {
		// 	}

		// 	if (inputIndex == 9) { //start
		// 		this.pad.game.state.start('game');
		// 	}

		// 	if (inputIndex == Phaser.Gamepad.XBOX360_RIGHT_TRIGGER) {
		// 		this.addExpandingCircle();
		// 	}
		// }

		// let circle = add.graphics(0, 0);
		// this.sprite.addChild(circle);

		// circle.lineStyle(1, this.color, 0.5);
		// circle.beginFill(0xffffff, 0.3);
		// circle.drawCircle(0, 0, Globals.SlowDownRange * 2);
	}

	update() {
		this.energies = this.newEnergies;

		this.newEnergies = [];

		let speed = Globals.PlayerSpeed;
		for (let anEnergy of this.energies) {
			this.energy += anEnergy.strength;
		}

		this.body.applyForce( [0, this.energy * 4 * Globals.WaveMass], 0, 0 );

		this.energy *= Globals.EnergyDecay;

		let yMidpoint = Globals.WireStartHeight;

		this.body.data.velocity[0] = 0;

		if( Math.abs(this.body.y - yMidpoint) > 25) {
			// this.body.applyImpulse( [0, (this.body.y - yMidpoint) * 1.0], 0, 0 );
			this.body.velocity.y = (this.body.velocity.y - (this.body.y - yMidpoint) * 12);
			this.body.applyDamping(7);

			// this.body.velocity.set(0, this.body.velocity.y - (this.body.position.y - yMidpoint) * 2.5);
		} 
		if( Math.abs(this.body.y - yMidpoint) > 10 && Math.abs(this.body.y - yMidpoint) < 25) {
			// this.body.applyImpulse( [0, (this.body.y - yMidpoint) * 1.0], 0, 0 );
			this.body.velocity.y = (this.body.velocity.y - (this.body.y - yMidpoint) * 20);
			this.body.applyDamping(50);
			// console.log(this.body.velocity.y);

			// this.body.velocity.set(0, this.body.velocity.y - (this.body.position.y - yMidpoint) * 2.5);
		} 
	}
	
	setDir(direction: Direction) {
		let strength = Globals.InitialStrength; 
		if (direction == Direction.Down) {
			strength *= -1;
		}
		let propogate = Direction.Left;
		if (this.index == 0) {
			propogate = Direction.Right;
		}
		this.energyToAdd = (new Energy( propogate, strength ));
	}

	resetDir() {
		this.energyToAdd = null;
	}

	addEnergy(moreEnergy: Energy) {
		this.newEnergies.push(moreEnergy);
	}

	addExtraEnergy() {
		if (this.energyToAdd != null) {
			this.newEnergies.push(this.energyToAdd);
		}
	}
}