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

	idealX: number;

	index: number;

	lastShot: number;

	powerUp: PowerUp;

	isDead = false;

	polygonOptions = {
		skipSimpleCheck: true,
	};

	constructor(public wireCollisionGroup: Phaser.Physics.P2.CollisionGroup, public ballCollisionGroup: Phaser.Physics.P2.CollisionGroup, public state: Phaser.State, public i: number) {

		this.index = i;

		let yMidpoint = Globals.WireStartHeight;
		let divWidth = Globals.ScreenWidth/Globals.NumberOfParticles;
		let xMidpoint = divWidth * this.index + divWidth/2;

		this.idealX = xMidpoint;

		this.sprite = state.add.sprite(xMidpoint, yMidpoint, 'waveform');

		state.physics.p2.enable(this.sprite, Globals.DebugRender);
		this.body = <Phaser.Physics.P2.Body>this.sprite.body;
		this.body.setCircle(Globals.ParticleRadius, 0, 0);
		// this.body.setRectangle(Globals.ParticleRadius*2, 20, Globals.ParticleRadius, 10);
		this.body.addPolygon(this.polygonOptions, [ [0, 0], [Globals.ParticleRadius*2, 0], [Globals.ParticleRadius*2, Globals.ParticleRadius*2], [0, Globals.ParticleRadius*2]  ]);
		this.body.collideWorldBounds = true;
		this.body.data.gravityScale = 0;
		this.body.mass = Globals.WaveMass;
		this.body.angularVelocity = 0;
		this.body.static = true;

		this.body.setCollisionGroup(wireCollisionGroup);
		this.body.collides([state.physics.p2.boundsCollisionGroup, this.ballCollisionGroup] );
	}

	update(playerEnergy: Array<number>) {
		this.energies = this.newEnergies;

		this.newEnergies = [];
		let playerIndex = (this.index == 0 ? 0 : 1);

		let speed = Globals.PlayerSpeed;
		for (let anEnergy of this.energies) {
			this.energy += anEnergy.strength;
		}

		if (this.energyToAdd != null) {
			playerEnergy[playerIndex] -= Globals.PlayerEnergyUseRate;			
		} 

		if (this.index == 0 && playerIndex == 0 || this.index == (Globals.NumberOfParticles - 1) && playerIndex == 1) {
			if (playerEnergy[playerIndex] < 0) {
				playerEnergy[playerIndex] = 0;
			} else if (playerEnergy[playerIndex] < 20) {
				playerEnergy[playerIndex] += Globals.PlayerEnergyAddRate;
			} 
		}

			
		this.body.applyForce( [0, this.energy * Globals.WaveStrengthMod * Globals.WaveMass], 0, 0 );

		//Test for static physics
		this.body.velocity.y = this.energy * Globals.WaveStrengthMod * -1 * 0.3;

		this.energy *= Globals.EnergyDecay;

		let yMidpoint = Globals.WireStartHeight;

		this.body.data.velocity[0] = 0;

		let lowCutoff = 10;
		if( Math.abs(this.body.y - yMidpoint) > lowCutoff) {
			// this.body.velocity.y = (this.body.velocity.y - (this.body.y - yMidpoint) * 12.5);	//Dynamic
			// this.body.applyDamping(Globals.WaveDampSlow);		//Dynamic
			this.body.velocity.y = (this.body.velocity.y - (this.body.y - yMidpoint) * 8);	//Static
		} 
		if( Math.abs(this.body.y - yMidpoint) > 5 && Math.abs(this.body.y - yMidpoint) < lowCutoff) {
			// this.body.velocity.y = (this.body.velocity.y - (this.body.y - yMidpoint) * 20);	//Dynamic
			// this.body.applyDamping(Globals.WaveDampSettle);		//Dynamic
			this.body.velocity.y = (this.body.velocity.y - (this.body.y - yMidpoint) * 20);	//Static
		} 
	}
	
	setDir(direction: Direction, playerEnergy: Array<number>) {
		let strength = Globals.InitialStrength; 

		let playerIndex = (this.index == 0 ? 0 : 1);

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