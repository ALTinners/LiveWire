import * as Phaser from 'phaser';
import * as WebFont from 'webfontloader';
import * as Globals from './globals';
import { Player } from './player';
import { Wavepoint, Energy, Direction } from './wavepoints';

declare function require(url: string): string;

let globalScore = [
	0,0
];


export default class GameState extends Phaser.State {

	players = new Array<Player>();
	scoreTexts = new Array<Phaser.Text>();
	scoreCooldowns = new Array<number>();

	wavepoints = new Array<Wavepoint>();
	wavepointsStrengths = new Array<Phaser.Graphics>();

	wireCollisionGroup: Phaser.Physics.P2.CollisionGroup;
	ballCollisionGroup: Phaser.Physics.P2.CollisionGroup;;
	goalCollisionGroup: Phaser.Physics.P2.CollisionGroup;;

	ballIsStuckCounter = 0;
	ball: Phaser.Sprite;
	endCircle: Phaser.Sprite;
	endText: Phaser.Text;
	ballEmitter: Phaser.Particles.Arcade.Emitter;
	currentBallParticles: string;

	bg: Phaser.TileSprite;

	gameIsEnded = false;

	init() {
		//TODO
	}

	preload() {
		this.players.length = 0;

		this.scoreCooldowns = [0, 0];

		this.physics.startSystem(Phaser.Physics.P2JS);
		this.physics.startSystem(Phaser.Physics.ARCADE);
		//  Turn on impact events for the world, without this we get no collision callbacks
		this.physics.p2.restitution = 1;
		this.physics.p2.friction = 0;
		this.physics.p2.setImpactEvents(true);
		this.physics.p2.applyGravity = true;
	    this.physics.p2.gravity.y = 600;

		this.input.gamepad.start();

		this.wireCollisionGroup = this.physics.p2.createCollisionGroup();
		this.ballCollisionGroup = this.physics.p2.createCollisionGroup();
		this.goalCollisionGroup = this.physics.p2.createCollisionGroup();
		this.physics.p2.updateBoundsCollisionGroup(true);

		this.load.image('1px', require('./assets/images/mushroom2.png'));
		this.load.image('atom', require('./assets/images/atom.png'));
		this.load.image('background', require('./assets/images/background.png'));
		this.load.image('waveform', require('./assets/images/waveform.png'));
		this.load.image('particleBlue', require('./assets/images/particle.png'));
		this.load.image('particleRed', require('./assets/images/particle2.png'));
		this.load.image('particleBlueBig', require('./assets/images/particleBlueBig.png'));
		this.load.image('particleRedBig', require('./assets/images/particleRedBig.png'));
	}

	create() {
		// this.bg = this.add.tileSprite(0,Globals.BorderTopOffset, Globals.ScreenWidth, Globals.ScreenHeight, 'background');
		// this.bg.tileScale.x=0.1;
		// this.bg.tileScale.y=0.1;

		// this.scoreTexts.push(this.add.text(Globals.ScreenWidth - 80, 10, '' + globalScore[1], { font: '100px Arial', fill: '#ffffff' }));	//PLayer 1
		// this.scoreTexts.push(this.add.text(10, 10, '' + globalScore[0], { font: '100px Arial', fill: '#ffffff' }));	//Player 2

		let bar = this.add.graphics(0, 0);
		bar.lineStyle(1, 0xFFFFFF, 1);
		bar.beginFill(0xffffff, 0.3);
		bar.drawRect(Globals.GoalSideOffset, Globals.GoalTopOffset, Globals.GoalWidth, Globals.GoalHeight);
		this.physics.p2.enable(bar);
		let barBody = <Phaser.Physics.P2.Body>bar.body;
		barBody.setRectangle(Globals.GoalWidth, Globals.GoalHeight, Globals.GoalWidth/2, Globals.GoalTopOffset + Globals.GoalHeight/2);
		barBody.static = true;
		barBody.setCollisionGroup(this.goalCollisionGroup);
		barBody.collides(this.ballCollisionGroup, () => { this.updateGlobalScore(0); /*this.scoreTexts[0].setText(globalScore[0].toString());*/ });
		

		let bar2 = this.add.graphics(0, 0);
		bar2.lineStyle(1, 0xFFFFFF, 1);
		bar2.beginFill(0xffffff, 0.3);
		bar2.drawRect( Globals.ScreenWidth - Globals.GoalSideOffset - Globals.GoalWidth, Globals.GoalTopOffset, Globals.GoalWidth, Globals.GoalHeight);
		this.physics.p2.enable(bar2);
		let barBody2 = <Phaser.Physics.P2.Body>bar2.body;
		barBody2.setRectangle( Globals.GoalWidth, Globals.GoalHeight, (Globals.ScreenWidth - Globals.GoalSideOffset - Globals.GoalWidth) + Globals.GoalWidth/2, Globals.GoalTopOffset + Globals.GoalHeight/2);
		barBody2.static = true;
		barBody2.setCollisionGroup(this.goalCollisionGroup);
		barBody2.collides(this.ballCollisionGroup, () => { this.updateGlobalScore(1); /*this.scoreTexts[1].setText(globalScore[1].toString());*/ });
		
		let topBar = this.add.graphics(0, 0);
		topBar.lineStyle(1, 0xFFFFFF, 1);
		topBar.beginFill(0xffffff, 0.3);
		topBar.drawRect(0, 0, Globals.ScreenWidth, Globals.BorderTopOffset);
		this.physics.p2.enable(topBar);
		let topBarBody = <Phaser.Physics.P2.Body>topBar.body;
		topBarBody.setRectangle(Globals.ScreenWidth, Globals.BorderTopOffset, Globals.ScreenWidth/2, Globals.BorderTopOffset/2);
		topBarBody.static = true;
		topBarBody.setCollisionGroup(this.goalCollisionGroup);
		topBarBody.collides(this.ballCollisionGroup, () => { });


		for (let i = 0; i<Globals.NumberOfParticles; i++) {
			this.wavepoints.push(new Wavepoint(this.wireCollisionGroup, this.ballCollisionGroup, this, i));

			this.wavepointsStrengths.push(this.add.graphics(i * (Globals.ScreenWidth/Globals.NumberOfParticles), Globals.ScreenHeight - 20));
			// this.wavepointsStrengths[i].lineStyle(1, Globals.BarColourPurple, 1);
			// this.wavepointsStrengths[i].beginFill(0x777777, 0.7);
			// this.wavepointsStrengths[i].drawRect(0, 0, Globals.ScreenWidth/Globals.NumberOfParticles, 20);
		}

		this.ball = this.add.sprite(Globals.ScreenWidth/2 , 90, 'atom');
		this.ball.scale.x = 0.175;
		this.ball.scale.y = 0.175;

		this.ballEmitter = this.add.emitter(Globals.ScreenWidth/2 , 90, 100);
		this.ballEmitter.setRotation(0, 0);
		this.ballEmitter.setXSpeed(-1 * Globals.ParticleSpeed, Globals.ParticleSpeed);
		this.ballEmitter.setYSpeed(-1 * Globals.ParticleSpeed, Globals.ParticleSpeed);
		this.ballEmitter.setScale( 0.8,1.2, 0.8,1.2 );
		// this.ballEmitter.gravity = -200;

	// this.ballEmitter.makeParticles('particleBlue');
    // 		this.ballEmitter.start(false, 1000, 30 /*, Infinity*/);

		this.physics.p2.enable(this.ball);
		let ballBody = <Phaser.Physics.P2.Body>this.ball.body;
		ballBody.setCircle(Globals.PlayerRadius, 0, 0);
		ballBody.collideWorldBounds = true;
		ballBody.data.gravityScale = 1;
		ballBody.data.mass = 1;
		ballBody.setCollisionGroup(this.ballCollisionGroup);
		ballBody.collides([this.physics.p2.boundsCollisionGroup, this.wireCollisionGroup, this.goalCollisionGroup]);


		var ballMaterial = this.physics.p2.createMaterial('ballMaterial', ballBody);
		var ballMaterial = this.physics.p2.createMaterial('ballMaterial', ballBody);
		var waveMaterial = this.physics.p2.createMaterial('waveMaterial');
		var worldEdgeMaterial = this.physics.p2.createMaterial('wallMaterial');
		var waveContactMaterial = this.physics.p2.createContactMaterial(ballMaterial, waveMaterial);
		var wallContactMaterial = this.physics.p2.createContactMaterial(ballMaterial, worldEdgeMaterial);
		wallContactMaterial.friction = 6;
		wallContactMaterial.restitution = 0.5;
		this.physics.p2.setWorldMaterial(worldEdgeMaterial, true, true, true, true);

		this.game.input.keyboard.onDownCallback = (inputObject: any) => {
			if (!this.gameIsEnded) {
				if (inputObject.keyCode == Phaser.Keyboard.W) {
					this.wavepoints[0].setDir(Direction.Up);
				} else if (inputObject.keyCode == Phaser.Keyboard.S) {
					this.wavepoints[0].setDir(Direction.Down);
				} else if (inputObject.keyCode == Phaser.Keyboard.UP) {
					this.wavepoints[Globals.NumberOfParticles-1].setDir(Direction.Up);
				} else if (inputObject.keyCode == Phaser.Keyboard.DOWN) {
					this.wavepoints[Globals.NumberOfParticles-1].setDir(Direction.Down);
				}
			} else {
				if (inputObject.keyCode == Phaser.Keyboard.R) {
					console.log("Reset");
					
					this.resetState();
				}
			}
		}

		this.game.input.keyboard.onUpCallback = (inputObject: any) => {
			if (inputObject.keyCode == Phaser.Keyboard.W) {
				this.wavepoints[0].resetDir();
			} else if (inputObject.keyCode == Phaser.Keyboard.S) {
				this.wavepoints[0].resetDir();
			} else if (inputObject.keyCode == Phaser.Keyboard.UP) {
				this.wavepoints[Globals.NumberOfParticles-1].resetDir();
			} else if (inputObject.keyCode == Phaser.Keyboard.DOWN) {
				this.wavepoints[Globals.NumberOfParticles-1].resetDir();
			}
		}
	}

	update() {
		this.wavepoints[0].addExtraEnergy();
		this.wavepoints[Globals.NumberOfParticles-1].addExtraEnergy();

		for (let index = 0; index < this.wavepoints.length; ++index) {
			let leftCount = 0;
			let rightCount = 0;
			for (let energy of this.wavepoints[index].energies) {
				if (energy.travelling == Direction.Left && index > 0) {
					leftCount += energy.strength;
					this.wavepoints[index - 1].newEnergies.push(energy);
				} else if (energy.travelling == Direction.Right && index < Globals.NumberOfParticles-1) {
					this.wavepoints[index + 1].newEnergies.push(energy);
					rightCount += energy.strength;;
				}
			}

			let oldColour = this.wavepoints[index].sprite.tint;
			let newColour = oldColour;


			if (leftCount != 0 && rightCount != 0) {
				newColour = Globals.BarColourPurple;
			} else if (leftCount != 0) {
				newColour = Globals.BarColourBlue;
			} else if (rightCount != 0) {
				newColour = Globals.BarColourRed;
			} else {
				newColour = Globals.BarColourBlank;
			}

			if (newColour != oldColour) {
				this.wavepoints[index].sprite.tint = newColour;
				// this.wavepointsStrengths[index].lineStyle(1, newColour, 1);
				// this.wavepointsStrengths[index].tint = newColour;
			}
		}
		
		for (let wavepoint of this.wavepoints) {
			wavepoint.update();
		}

		for (let i=0; i<globalScore.length; i++) {
			if (globalScore[i] > 1) {
				globalScore[i] -= Globals.ScoreDecay;
				//this.scoreTexts[i].setText(globalScore[i].toString());
			}
		}
		this.recolourBall();

		if (this.ball.position.y > Globals.WireStartHeight) {
			this.ballIsStuckCounter++;
		} else if (this.ballIsStuckCounter > 0) {
			this.ballIsStuckCounter = 0;
		}

		if (this.ball.position.y >= Globals.ScreenHeight - Globals.PlayerRadius/2) {
			this.ball.body.x = Globals.BallStartPosX;
			this.ball.body.y = Globals.BallStartPosY;
			console.log("Reset")
		}

		for (let index = 0; index < 2; index++) {
			if (this.scoreCooldowns[index] > 0) {
				this.scoreCooldowns[index] -= 0.05;
				if (Math.abs(this.scoreCooldowns[index] - 0.05) < 0.1) {
					this.scoreCooldowns[index] = 0;
				}
			}
		}


		var px = this.ball.body.velocity.x;
		var py = this.ball.body.velocity.y;

		px *= -1;
		py *= -1;

		// emitter.minParticleSpeed.set(px, py);
		// emitter.maxParticleSpeed.set(px, py);

		this.ballEmitter.emitX = this.ball.x;
		this.ballEmitter.emitY = this.ball.y;
	}

	updateGlobalScore(index: number) {
		if (this.gameIsEnded) return;

		if (this.scoreCooldowns[index] == 0) {
			globalScore[index] += 20;
			//this.scoreTexts[index].setText(globalScore[index].toString());
			this.scoreCooldowns[index] = 2;

			this.recolourBall();

			if (globalScore[index] >= Globals.ScoreToWin) {
				this.explodeBallAndEnd(index);
			}

		} else {
			console.log("Cooldown for " + (index+1).toString());
		}
	}

	recolourBall() {
		let colourPointRatio = 0xFF/Globals.ScoreToWin;

		let scoreDiff = globalScore[0] - globalScore[1];
		let maxScore = (globalScore[0] > globalScore[1] ? globalScore[0] : globalScore[1]);
		//If scoreDiff is positive, go more red

		let blueRatio = 0xAA + scoreDiff;
		if (blueRatio > 0xFF) blueRatio = 0xFF;
		if (blueRatio < 0x00) blueRatio = 0x00;
		let redRatio = 0xAA - scoreDiff;
		if (redRatio > 0xFF) redRatio = 0xFF;
		if (redRatio < 0x00) redRatio = 0x00;
		redRatio = Math.trunc(redRatio);
		blueRatio = Math.trunc(blueRatio);
		let greenRatio =  (blueRatio < redRatio ? blueRatio : redRatio);
		let newColour = Math.trunc(redRatio * 0x10000 + greenRatio * 0x100 + blueRatio);
		this.ball.tint = newColour;

		let prodNumber = 270*( (Globals.ScoreToWin - maxScore) / (Globals.ScoreToWin - Globals.ScoreParticleStartThreshold*Globals.ScoreToWin) );
		this.ballEmitter.frequency = prodNumber;		

		if (scoreDiff > 10 && globalScore[0] > (Globals.ScoreParticleStartThreshold*Globals.ScoreToWin)  && this.currentBallParticles != "blue") {
			this.ballEmitter.kill();
			this.ballEmitter.makeParticles('particleBlue');
    		this.ballEmitter.start(false, 1000, prodNumber);
			this.currentBallParticles = "blue";
		} else if (scoreDiff < 10 && globalScore[1] > (Globals.ScoreParticleStartThreshold*Globals.ScoreToWin)  && this.currentBallParticles != "red") {
			this.ballEmitter.kill();
			this.ballEmitter.makeParticles('particleRed');
    		this.ballEmitter.start(false, 1000, prodNumber);
			this.currentBallParticles = "red";
		} else if (globalScore[0] < (Globals.ScoreParticleStartThreshold*Globals.ScoreToWin) && globalScore[1] < (Globals.ScoreParticleStartThreshold*Globals.ScoreToWin)) {
			this.ballEmitter.kill();
			this.ballEmitter.removeChildren();
			this.currentBallParticles = "none";
		}
	}

	explodeBallAndEnd(winPlayer: number) {
		let maxScore = (globalScore[0] > globalScore[1] ? globalScore[0] : globalScore[1]);

		this.gameIsEnded = true;

		let endTimer = this.time.create(true);

		this.ballEmitter.frequency = 10;		

		this.camera.shake(0.01, 20000, true);

		endTimer.repeat(10, 150, () => {
			this.ball.scale.x *= 1.05;
			this.ball.scale.y *= 1.05;
			this.ball.alpha *= 0.99;

			let mult = 1.01;
			this.ballEmitter.maxParticleSpeed.x *= mult;
			this.ballEmitter.minParticleSpeed.x *= mult;
			this.ballEmitter.maxParticleSpeed.y *= mult;
			this.ballEmitter.minParticleSpeed.y *= mult;
		});

		endTimer.add(10 * 150, () => {

			this.endCircle = this.add.sprite(0, 0, (winPlayer == 0 ? 'particleBlueBig' : 'particleRedBig'));
			this.endCircle.anchor.x = 0.5;
			this.endCircle.anchor.y = 0.5;

			// console.log(this.world.centerX);
			

			this.endCircle.x = this.world.centerX;
			this.endCircle.y = this.world.centerY;

			let circleTimer = this.time.create(true);
			circleTimer.repeat(10, 1000, () => {
				this.endCircle.scale.x *= 1.05;
				this.endCircle.scale.y *= 1.05;				
			});
			circleTimer.add(10 * 100, () => {
				let playerName = (winPlayer == 0 ? "Blue Player Wins!\nPress R to Reset" : "Red Player Wins!\nPress R to Reset");
				this.endText = this.add.text(0, 0, playerName, { font: '100px Arial', fill: '#000000' } );
				 this.endText.anchor.x = 0.5;
				 this.endText.anchor.y = 0.5;

				this.endText.x = this.world.centerX;
				this.endText.y = this.world.centerY;

				
			});
			circleTimer.start();


			this.camera.shake(0.2, 500, true);
			this.ball.alpha = 0.0;
			this.ballEmitter.frequency = 100000;
		});

		endTimer.start();



		// this.camera.shake(500, 0.1);
	}

	resetState() {
		this.gameIsEnded = false;
		globalScore = [0, 0];
		this.ball.x = Globals.ScreenWidth/2;
		this.ball.y = 90;
		this.ball.alpha = 1;
		this.ball.scale.x = 0.175;
		this.ball.scale.y = 0.175;

		this.ballEmitter.setXSpeed(-1 * Globals.ParticleSpeed, Globals.ParticleSpeed);
		this.ballEmitter.setYSpeed(-1 * Globals.ParticleSpeed, Globals.ParticleSpeed);

		this.endCircle.destroy();
		this.endText.destroy();

		this.recolourBall();

	}


	render() {
		// if (Globals.DebugRender) {
		// 	this.players.forEach(p => {
		// 		this.game.debug.body(p.sprite, p.color);
		// 	});

		// 	this.wireCollisionGroup.children.forEach(c => {
		// 		this.game.debug.body(<any>c, (<any>c).color);
		// 	})
		// }
	}
}