webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(1);
	__webpack_require__(3);
	var Phaser = __webpack_require__(5);
	__webpack_require__(8);
	var Globals = __webpack_require__(10);
	var gameState_1 = __webpack_require__(11);
	var loadingState_1 = __webpack_require__(21);
	new gameState_1.default();
	new loadingState_1.default();
	var SimpleGame = (function () {
	    function SimpleGame() {
	        this.game = new Phaser.Game(Globals.ScreenWidth, Globals.ScreenHeight, Phaser.AUTO, "content");
	        this.game.state.add('loading', loadingState_1.default);
	        this.game.state.add('game', gameState_1.default);
	        this.game.state.start('loading');
	    }
	    return SimpleGame;
	}());
	var game = new SimpleGame();


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 9 */,
/* 10 */
/***/ function(module, exports) {

	"use strict";
	exports.DebugRender = true;
	exports.ScreenWidth = 1600;
	exports.ScreenHeight = 800;
	exports.BorderTopOffset = 0;
	exports.PlayerRadius = 50;
	exports.ParticleRadius = 10;
	exports.ShotRadius = 3;
	exports.ParticleSpeed = 300;
	exports.PlayerEnergy = 20;
	exports.PlayerEnergyUseRate = 1.3;
	exports.PlayerEnergyAddRate = 0.5;
	exports.ScoreToWin = 100;
	exports.ScoreDecay = 0.02;
	exports.ScoreVelocityMultiplier = 1;
	exports.ScoreParticleStartThreshold = 0.5;
	exports.ShotAwayDist = 30;
	exports.PlayerSpeed = 300;
	exports.ShotSpeed = 400;
	exports.SlowDownRange = 150;
	exports.EnergyDecay = 0.80;
	exports.NumberOfParticles = 140;
	exports.WaveStrengthMod = 5.7;
	exports.WaveDampSlow = 5;
	exports.WaveDampSettle = 40;
	exports.InitialStrength = 250;
	exports.GoalWidth = 10;
	exports.GoalHeight = exports.ScreenHeight / 2 - 150;
	exports.GoalSideOffset = 0; //15;
	exports.GoalTopOffset = 350;
	exports.WireStartHeight = exports.GoalTopOffset + exports.GoalHeight + 150;
	exports.WireStartSideOffset = exports.GoalSideOffset;
	exports.BallStartPosX = exports.ScreenWidth / 2;
	exports.BallStartPosY = 90;
	exports.BarColourBlank = 0xDDDDDD;
	exports.BarColourRed = 0xFF2222;
	exports.BarColourBlue = 0x2222FF;
	exports.BarColourPurple = 0xFF22FF;
	exports.WaveMass = 6;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Phaser = __webpack_require__(5);
	var Globals = __webpack_require__(10);
	var wavepoints_1 = __webpack_require__(12);
	var globalScore = [
	    0, 0
	];
	var playerEnergy = [20, 20];
	var GameState = (function (_super) {
	    __extends(GameState, _super);
	    function GameState() {
	        var _this = _super !== null && _super.apply(this, arguments) || this;
	        _this.players = new Array();
	        _this.scoreTexts = new Array();
	        _this.scoreCooldowns = new Array();
	        _this.wavepoints = new Array();
	        _this.wavepointsStrengths = new Array();
	        _this.ballIsStuckCounter = 0;
	        _this.goals = new Array();
	        _this.gameIsEnded = false;
	        return _this;
	    }
	    ;
	    ;
	    GameState.prototype.init = function () {
	        //TODO
	    };
	    GameState.prototype.preload = function () {
	        this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
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
	        this.load.image('1px', __webpack_require__(13));
	        this.load.image('atom', __webpack_require__(14));
	        this.load.image('background', __webpack_require__(15));
	        this.load.image('waveform', __webpack_require__(16));
	        this.load.image('particleBlue', __webpack_require__(17));
	        this.load.image('particleRed', __webpack_require__(18));
	        this.load.image('particleBlueBig', __webpack_require__(19));
	        this.load.image('particleRedBig', __webpack_require__(20));
	        this.scale.startFullScreen(false);
	    };
	    GameState.prototype.create = function () {
	        // this.bg = this.add.tileSprite(0,Globals.BorderTopOffset, Globals.ScreenWidth, Globals.ScreenHeight, 'background');
	        // this.bg.tileScale.x=0.1;
	        // this.bg.tileScale.y=0.1;
	        var _this = this;
	        this.scoreTexts.push(this.add.text(10, 10, '' + playerEnergy[0], { font: '100px Arial', fill: '#ffffff' })); //Player 1
	        this.scoreTexts.push(this.add.text(Globals.ScreenWidth - 80, 10, '' + playerEnergy[1], { font: '100px Arial', fill: '#ffffff' })); //PLayer 2
	        this.goals.push(this.add.graphics(0, 0));
	        this.goals[0].lineStyle(1, 0xFFFFFF, 1);
	        this.goals[0].beginFill(0xffffff, 0.3);
	        this.goals[0].drawRect(Globals.GoalSideOffset, Globals.GoalTopOffset, Globals.GoalWidth, Globals.GoalHeight);
	        this.physics.p2.enable(this.goals[0], Globals.DebugRender);
	        var barBody = this.goals[0].body;
	        barBody.setRectangle(Globals.GoalWidth, Globals.GoalHeight, Globals.GoalWidth / 2, Globals.GoalTopOffset + Globals.GoalHeight / 2);
	        barBody.static = true;
	        barBody.setCollisionGroup(this.goalCollisionGroup);
	        barBody.collides(this.ballCollisionGroup, function () { _this.updateGlobalScore(0); });
	        this.goals.push(this.add.graphics(0, 0));
	        this.goals[1].lineStyle(1, 0xFFFFFF, 1);
	        this.goals[1].beginFill(0xffffff, 0.3);
	        this.goals[1].drawRect(Globals.ScreenWidth - Globals.GoalSideOffset - Globals.GoalWidth, Globals.GoalTopOffset, Globals.GoalWidth, Globals.GoalHeight);
	        this.physics.p2.enable(this.goals[1], Globals.DebugRender);
	        var barBody2 = this.goals[1].body;
	        barBody2.setRectangle(Globals.GoalWidth, Globals.GoalHeight, (Globals.ScreenWidth - Globals.GoalSideOffset - Globals.GoalWidth) + Globals.GoalWidth / 2, Globals.GoalTopOffset + Globals.GoalHeight / 2);
	        barBody2.static = true;
	        barBody2.setCollisionGroup(this.goalCollisionGroup);
	        barBody2.collides(this.ballCollisionGroup, function () { _this.updateGlobalScore(1); });
	        var topBar = this.add.graphics(0, 0);
	        topBar.lineStyle(1, 0xFFFFFF, 1);
	        topBar.beginFill(0xffffff, 0.3);
	        topBar.drawRect(0, 0, Globals.ScreenWidth, Globals.BorderTopOffset);
	        this.physics.p2.enable(topBar, Globals.DebugRender);
	        var topBarBody = topBar.body;
	        topBarBody.setRectangle(Globals.ScreenWidth, Globals.BorderTopOffset, Globals.ScreenWidth / 2, Globals.BorderTopOffset / 2);
	        topBarBody.static = true;
	        topBarBody.setCollisionGroup(this.goalCollisionGroup);
	        topBarBody.collides(this.ballCollisionGroup, function () { });
	        // //Debug bottom bar for ball physics
	        // let bottomBar = this.add.graphics(0, 0);
	        // bottomBar.lineStyle(1, 0xFFFFFF, 1);
	        // bottomBar.beginFill(0xffffff, 0.3);
	        // bottomBar.drawRect(0, Globals.WireStartHeight - 40, Globals.ScreenWidth, Globals.BorderTopOffset);
	        // this.physics.p2.enable(bottomBar, Globals.DebugRender);
	        // let bottomBarBody = <Phaser.Physics.P2.Body>bottomBar.body;
	        // bottomBarBody.setRectangle( Globals.ScreenWidth, Globals.BorderTopOffset, Globals.ScreenWidth/2, Globals.WireStartHeight - 20);
	        // bottomBarBody.static = true;
	        // bottomBarBody.setCollisionGroup(this.goalCollisionGroup);
	        // bottomBarBody.collides(this.ballCollisionGroup, () => { });
	        for (var i = 0; i < Globals.NumberOfParticles; i++) {
	            this.wavepoints.push(new wavepoints_1.Wavepoint(this.wireCollisionGroup, this.ballCollisionGroup, this, i));
	            this.wavepointsStrengths.push(this.add.graphics(i * (Globals.ScreenWidth / Globals.NumberOfParticles), Globals.ScreenHeight - 20));
	        }
	        this.ball = this.add.sprite(Globals.ScreenWidth / 2, 90, 'atom');
	        this.ball.scale.x = 0.175;
	        this.ball.scale.y = 0.175;
	        this.ballEmitter = this.add.emitter(Globals.ScreenWidth / 2, 90, 100);
	        this.ballEmitter.setRotation(0, 0);
	        this.ballEmitter.setXSpeed(-1 * Globals.ParticleSpeed, Globals.ParticleSpeed);
	        this.ballEmitter.setYSpeed(-1 * Globals.ParticleSpeed, Globals.ParticleSpeed);
	        this.ballEmitter.setScale(0.8, 1.2, 0.8, 1.2);
	        this.physics.p2.enable(this.ball, Globals.DebugRender);
	        var ballBody = this.ball.body;
	        ballBody.setCircle(Globals.PlayerRadius, 0, 0);
	        ballBody.collideWorldBounds = true;
	        ballBody.data.gravityScale = 1;
	        ballBody.data.mass = 1;
	        ballBody.damping = 0.3;
	        ballBody.setCollisionGroup(this.ballCollisionGroup);
	        ballBody.collides([this.physics.p2.boundsCollisionGroup, this.wireCollisionGroup, this.goalCollisionGroup]);
	        var ballMaterial = this.physics.p2.createMaterial('ballMaterial', ballBody);
	        var waveMaterial = this.physics.p2.createMaterial('waveMaterial');
	        for (var _i = 0, _a = this.wavepoints; _i < _a.length; _i++) {
	            var wavepoint = _a[_i];
	            wavepoint.body.setMaterial(waveMaterial);
	        }
	        var goalMaterial = this.physics.p2.createMaterial('goalMaterial');
	        this.goals[0].body.setMaterial(goalMaterial);
	        this.goals[1].body.setMaterial(goalMaterial);
	        var worldEdgeMaterial = this.physics.p2.createMaterial('wallMaterial');
	        this.physics.p2.setWorldMaterial(worldEdgeMaterial, true, true, true, true);
	        // ballBody.onBeginContact.add( (body) => console.log(body) );
	        ballBody.onEndContact.add(function (arg) { return console.log(arg); });
	        var waveContactMaterial = this.physics.p2.createContactMaterial(ballMaterial, waveMaterial);
	        waveContactMaterial.friction = 1;
	        waveContactMaterial.restitution = 0.7;
	        var goalContactMaterial = this.physics.p2.createContactMaterial(ballMaterial, goalMaterial);
	        goalContactMaterial.friction = 10;
	        goalContactMaterial.restitution = 2.5;
	        var wallContactMaterial = this.physics.p2.createContactMaterial(ballMaterial, worldEdgeMaterial);
	        wallContactMaterial.friction = 0;
	        wallContactMaterial.restitution = 0.2;
	        this.game.input.keyboard.onDownCallback = function (inputObject) {
	            if (!_this.gameIsEnded) {
	                if (inputObject.keyCode == Phaser.Keyboard.W) {
	                    _this.wavepoints[0].setDir(wavepoints_1.Direction.Up, playerEnergy);
	                }
	                else if (inputObject.keyCode == Phaser.Keyboard.S) {
	                    _this.wavepoints[0].setDir(wavepoints_1.Direction.Down, playerEnergy);
	                }
	                else if (inputObject.keyCode == Phaser.Keyboard.UP) {
	                    _this.wavepoints[Globals.NumberOfParticles - 1].setDir(wavepoints_1.Direction.Up, playerEnergy);
	                }
	                else if (inputObject.keyCode == Phaser.Keyboard.DOWN) {
	                    _this.wavepoints[Globals.NumberOfParticles - 1].setDir(wavepoints_1.Direction.Down, playerEnergy);
	                }
	            }
	            else {
	                if (inputObject.keyCode == Phaser.Keyboard.R) {
	                    console.log("Reset");
	                    _this.resetState();
	                }
	            }
	        };
	        this.game.input.keyboard.onUpCallback = function (inputObject) {
	            if (inputObject.keyCode == Phaser.Keyboard.W) {
	                _this.wavepoints[0].resetDir();
	            }
	            else if (inputObject.keyCode == Phaser.Keyboard.S) {
	                _this.wavepoints[0].resetDir();
	            }
	            else if (inputObject.keyCode == Phaser.Keyboard.UP) {
	                _this.wavepoints[Globals.NumberOfParticles - 1].resetDir();
	            }
	            else if (inputObject.keyCode == Phaser.Keyboard.DOWN) {
	                _this.wavepoints[Globals.NumberOfParticles - 1].resetDir();
	            }
	        };
	    };
	    GameState.prototype.update = function () {
	        if (playerEnergy[0] > 1)
	            this.wavepoints[0].addExtraEnergy();
	        if (playerEnergy[1] > 1)
	            this.wavepoints[Globals.NumberOfParticles - 1].addExtraEnergy();
	        for (var index = 0; index < this.wavepoints.length; ++index) {
	            var leftCount = 0;
	            var rightCount = 0;
	            for (var _i = 0, _a = this.wavepoints[index].energies; _i < _a.length; _i++) {
	                var energy = _a[_i];
	                if (energy.travelling == wavepoints_1.Direction.Left && index > 0) {
	                    leftCount += energy.strength;
	                    this.wavepoints[index - 1].newEnergies.push(energy);
	                }
	                else if (energy.travelling == wavepoints_1.Direction.Right && index < Globals.NumberOfParticles - 1) {
	                    this.wavepoints[index + 1].newEnergies.push(energy);
	                    rightCount += energy.strength;
	                    ;
	                }
	            }
	            var oldColour = this.wavepoints[index].sprite.tint;
	            var newColour = oldColour;
	            if (leftCount != 0 && rightCount != 0) {
	                newColour = Globals.BarColourPurple;
	            }
	            else if (leftCount != 0) {
	                newColour = Globals.BarColourBlue;
	            }
	            else if (rightCount != 0) {
	                newColour = Globals.BarColourRed;
	            }
	            else {
	                newColour = Globals.BarColourBlank;
	            }
	            if (newColour != oldColour) {
	                this.wavepoints[index].sprite.tint = newColour;
	            }
	        }
	        for (var _b = 0, _c = this.wavepoints; _b < _c.length; _b++) {
	            var wavepoint = _c[_b];
	            wavepoint.update(playerEnergy);
	        }
	        for (var i = 0; i < globalScore.length; i++) {
	            if (globalScore[i] > 1) {
	                globalScore[i] -= Globals.ScoreDecay;
	            }
	        }
	        this.recolourBall();
	        if (this.ball.position.y > Globals.WireStartHeight) {
	            this.ballIsStuckCounter++;
	        }
	        else if (this.ballIsStuckCounter > 0) {
	            this.ballIsStuckCounter = 0;
	        }
	        if (this.ball.position.y >= Globals.ScreenHeight - Globals.PlayerRadius / 2) {
	            this.ball.body.x = Globals.BallStartPosX;
	            this.ball.body.y = Globals.BallStartPosY;
	        }
	        for (var index = 0; index < 2; index++) {
	            if (this.scoreCooldowns[index] > 0) {
	                this.scoreCooldowns[index] -= 0.05;
	                if (Math.abs(this.scoreCooldowns[index] - 0.05) < 0.1) {
	                    this.scoreCooldowns[index] = 0;
	                }
	            }
	        }
	        this.ballEmitter.emitX = this.ball.x;
	        this.ballEmitter.emitY = this.ball.y;
	        this.scoreTexts[0].setText(playerEnergy[0].toString());
	        this.scoreTexts[1].setText(playerEnergy[1].toString());
	    };
	    GameState.prototype.updateGlobalScore = function (index) {
	        if (this.gameIsEnded)
	            return;
	        if (this.scoreCooldowns[index] == 0) {
	            globalScore[index] += 20;
	            this.scoreCooldowns[index] = 4;
	            this.recolourBall();
	            if (globalScore[index] >= Globals.ScoreToWin) {
	                this.explodeBallAndEnd(index);
	            }
	        }
	        else {
	            console.log("Cooldown for " + (index + 1).toString());
	        }
	    };
	    GameState.prototype.recolourBall = function () {
	        var colourPointRatio = 0xFF / Globals.ScoreToWin;
	        var scoreDiff = globalScore[0] - globalScore[1];
	        var maxScore = (globalScore[0] > globalScore[1] ? globalScore[0] : globalScore[1]);
	        //If scoreDiff is positive, go more red
	        var blueRatio = 0xAA + scoreDiff;
	        if (blueRatio > 0xFF)
	            blueRatio = 0xFF;
	        if (blueRatio < 0x00)
	            blueRatio = 0x00;
	        var redRatio = 0xAA - scoreDiff;
	        if (redRatio > 0xFF)
	            redRatio = 0xFF;
	        if (redRatio < 0x00)
	            redRatio = 0x00;
	        redRatio = Math.trunc(redRatio);
	        blueRatio = Math.trunc(blueRatio);
	        var greenRatio = (blueRatio < redRatio ? blueRatio : redRatio);
	        var newColour = Math.trunc(redRatio * 0x10000 + greenRatio * 0x100 + blueRatio);
	        this.ball.tint = newColour;
	        var prodNumber = 270 * ((Globals.ScoreToWin - maxScore) / (Globals.ScoreToWin - Globals.ScoreParticleStartThreshold * Globals.ScoreToWin));
	        this.ballEmitter.frequency = prodNumber;
	        if (scoreDiff > 10 && globalScore[0] > (Globals.ScoreParticleStartThreshold * Globals.ScoreToWin) && this.currentBallParticles != "blue") {
	            this.ballEmitter.kill();
	            this.ballEmitter.makeParticles('particleBlue');
	            this.ballEmitter.start(false, 1000, prodNumber);
	            this.currentBallParticles = "blue";
	        }
	        else if (scoreDiff < 10 && globalScore[1] > (Globals.ScoreParticleStartThreshold * Globals.ScoreToWin) && this.currentBallParticles != "red") {
	            this.ballEmitter.kill();
	            this.ballEmitter.makeParticles('particleRed');
	            this.ballEmitter.start(false, 1000, prodNumber);
	            this.currentBallParticles = "red";
	        }
	        else if (globalScore[0] < (Globals.ScoreParticleStartThreshold * Globals.ScoreToWin) && globalScore[1] < (Globals.ScoreParticleStartThreshold * Globals.ScoreToWin)) {
	            this.ballEmitter.kill();
	            this.ballEmitter.removeChildren();
	            this.currentBallParticles = "none";
	        }
	    };
	    GameState.prototype.explodeBallAndEnd = function (winPlayer) {
	        var _this = this;
	        var maxScore = (globalScore[0] > globalScore[1] ? globalScore[0] : globalScore[1]);
	        this.gameIsEnded = true;
	        var endTimer = this.time.create(true);
	        this.ballEmitter.frequency = 10;
	        this.camera.shake(0.01, 20000, true);
	        endTimer.repeat(10, 150, function () {
	            _this.ball.scale.x *= 1.05;
	            _this.ball.scale.y *= 1.05;
	            _this.ball.alpha *= 0.99;
	            var mult = 1.01;
	            _this.ballEmitter.maxParticleSpeed.x *= mult;
	            _this.ballEmitter.minParticleSpeed.x *= mult;
	            _this.ballEmitter.maxParticleSpeed.y *= mult;
	            _this.ballEmitter.minParticleSpeed.y *= mult;
	        });
	        endTimer.add(10 * 150, function () {
	            _this.endCircle = _this.add.sprite(0, 0, (winPlayer == 0 ? 'particleBlueBig' : 'particleRedBig'));
	            _this.endCircle.anchor.x = 0.5;
	            _this.endCircle.anchor.y = 0.5;
	            // console.log(this.world.centerX);
	            _this.endCircle.x = _this.world.centerX;
	            _this.endCircle.y = _this.world.centerY;
	            var circleTimer = _this.time.create(true);
	            circleTimer.repeat(10, 1000, function () {
	                _this.endCircle.scale.x *= 1.05;
	                _this.endCircle.scale.y *= 1.05;
	            });
	            circleTimer.add(10 * 100, function () {
	                var playerName = (winPlayer == 0 ? "Blue Player Wins!\nPress R to Reset" : "Red Player Wins!\nPress R to Reset");
	                _this.endText = _this.add.text(0, 0, playerName, { font: '100px Arial', fill: '#000000' });
	                _this.endText.anchor.x = 0.5;
	                _this.endText.anchor.y = 0.5;
	                _this.endText.x = _this.world.centerX;
	                _this.endText.y = _this.world.centerY;
	            });
	            circleTimer.start();
	            _this.camera.shake(0.2, 500, true);
	            _this.ball.alpha = 0.0;
	            _this.ballEmitter.frequency = 100000;
	        });
	        endTimer.start();
	        // this.camera.shake(500, 0.1);
	    };
	    GameState.prototype.resetState = function () {
	        this.gameIsEnded = false;
	        globalScore = [0, 0];
	        this.endText.destroy();
	        this.ball.body.x = Globals.BallStartPosX;
	        this.ball.body.y = Globals.BallStartPosY;
	        this.ball.body.velocity.x = 0;
	        this.ball.body.velocity.y = 0;
	        this.ball.body.velocity.mx = 0;
	        this.ball.body.velocity.my = 0;
	        this.ball.alpha = 1;
	        this.ball.scale.x = 0.175;
	        this.ball.scale.y = 0.175;
	        this.ballEmitter.setXSpeed(-1 * Globals.ParticleSpeed, Globals.ParticleSpeed);
	        this.ballEmitter.setYSpeed(-1 * Globals.ParticleSpeed, Globals.ParticleSpeed);
	        this.endCircle.destroy();
	        this.endText.destroy();
	        this.recolourBall();
	    };
	    GameState.prototype.render = function () {
	        // if (Globals.DebugRender) {
	        // 	this.players.forEach(p => {
	        // 		this.game.debug.body(p.sprite, p.color);
	        // 	});
	        // 	this.wireCollisionGroup.children.forEach(c => {
	        // 		this.game.debug.body(<any>c, (<any>c).color);
	        // 	})
	        // }
	    };
	    return GameState;
	}(Phaser.State));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = GameState;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Globals = __webpack_require__(10);
	var startPoses = [
	    [100, 100],
	    [Globals.ScreenWidth - 100, 100],
	    [Globals.ScreenWidth - 100, Globals.ScreenHeight - 100],
	    [100, Globals.ScreenHeight - 100]
	];
	var colors = [
	    '#ff0000',
	    '#00ff00',
	    '#0000ff',
	    '#ffffff'
	];
	var PowerUp;
	(function (PowerUp) {
	    //None,
	    PowerUp[PowerUp["Speedy"] = 0] = "Speedy";
	    PowerUp[PowerUp["MachineGun"] = 1] = "MachineGun";
	    PowerUp[PowerUp["SpreadShot"] = 2] = "SpreadShot";
	    PowerUp[PowerUp["Count"] = 3] = "Count";
	})(PowerUp || (PowerUp = {}));
	var Direction;
	(function (Direction) {
	    Direction[Direction["Left"] = 0] = "Left";
	    Direction[Direction["Right"] = 1] = "Right";
	    Direction[Direction["Up"] = 2] = "Up";
	    Direction[Direction["Down"] = 3] = "Down";
	})(Direction = exports.Direction || (exports.Direction = {}));
	var Energy = (function () {
	    function Energy(travel, strengths) {
	        this.travel = travel;
	        this.strengths = strengths;
	        this.strength = 0;
	        this.travelling = travel;
	        this.strength = strengths;
	    }
	    return Energy;
	}());
	exports.Energy = Energy;
	var Wavepoint = (function () {
	    function Wavepoint(wireCollisionGroup, ballCollisionGroup, state, i) {
	        this.wireCollisionGroup = wireCollisionGroup;
	        this.ballCollisionGroup = ballCollisionGroup;
	        this.state = state;
	        this.i = i;
	        this.energies = new Array();
	        this.newEnergies = new Array();
	        this.energy = 0;
	        this.isDead = false;
	        this.polygonOptions = {
	            skipSimpleCheck: true,
	        };
	        this.index = i;
	        var yMidpoint = Globals.WireStartHeight;
	        var divWidth = Globals.ScreenWidth / Globals.NumberOfParticles;
	        var xMidpoint = divWidth * this.index + divWidth / 2;
	        this.idealX = xMidpoint;
	        this.sprite = state.add.sprite(xMidpoint, yMidpoint, 'waveform');
	        state.physics.p2.enable(this.sprite, Globals.DebugRender);
	        this.body = this.sprite.body;
	        this.body.setCircle(Globals.ParticleRadius, 0, 0);
	        // this.body.setRectangle(Globals.ParticleRadius*2, 20, Globals.ParticleRadius, 10);
	        this.body.addPolygon(this.polygonOptions, [[0, 0], [Globals.ParticleRadius * 2, 0], [Globals.ParticleRadius * 2, Globals.ParticleRadius * 2], [0, Globals.ParticleRadius * 2]]);
	        this.body.collideWorldBounds = true;
	        this.body.data.gravityScale = 0;
	        this.body.mass = Globals.WaveMass;
	        this.body.angularVelocity = 0;
	        this.body.static = true;
	        this.body.setCollisionGroup(wireCollisionGroup);
	        this.body.collides([state.physics.p2.boundsCollisionGroup, this.ballCollisionGroup]);
	    }
	    Wavepoint.prototype.update = function (playerEnergy) {
	        this.energies = this.newEnergies;
	        this.newEnergies = [];
	        var playerIndex = (this.index == 0 ? 0 : 1);
	        var speed = Globals.PlayerSpeed;
	        for (var _i = 0, _a = this.energies; _i < _a.length; _i++) {
	            var anEnergy = _a[_i];
	            this.energy += anEnergy.strength;
	        }
	        if (this.energyToAdd != null) {
	            playerEnergy[playerIndex] -= Globals.PlayerEnergyUseRate;
	        }
	        if (this.index == 0 && playerIndex == 0 || this.index == (Globals.NumberOfParticles - 1) && playerIndex == 1) {
	            if (playerEnergy[playerIndex] < 0) {
	                playerEnergy[playerIndex] = 0;
	            }
	            else if (playerEnergy[playerIndex] < 20) {
	                playerEnergy[playerIndex] += Globals.PlayerEnergyAddRate;
	            }
	        }
	        this.body.applyForce([0, this.energy * Globals.WaveStrengthMod * Globals.WaveMass], 0, 0);
	        //Test for static physics
	        this.body.velocity.y = this.energy * Globals.WaveStrengthMod * -1 * 0.3;
	        this.energy *= Globals.EnergyDecay;
	        var yMidpoint = Globals.WireStartHeight;
	        this.body.data.velocity[0] = 0;
	        var lowCutoff = 10;
	        if (Math.abs(this.body.y - yMidpoint) > lowCutoff) {
	            // this.body.velocity.y = (this.body.velocity.y - (this.body.y - yMidpoint) * 12.5);	//Dynamic
	            // this.body.applyDamping(Globals.WaveDampSlow);		//Dynamic
	            this.body.velocity.y = (this.body.velocity.y - (this.body.y - yMidpoint) * 8); //Static
	        }
	        if (Math.abs(this.body.y - yMidpoint) > 5 && Math.abs(this.body.y - yMidpoint) < lowCutoff) {
	            // this.body.velocity.y = (this.body.velocity.y - (this.body.y - yMidpoint) * 20);	//Dynamic
	            // this.body.applyDamping(Globals.WaveDampSettle);		//Dynamic
	            this.body.velocity.y = (this.body.velocity.y - (this.body.y - yMidpoint) * 20); //Static
	        }
	    };
	    Wavepoint.prototype.setDir = function (direction, playerEnergy) {
	        var strength = Globals.InitialStrength;
	        var playerIndex = (this.index == 0 ? 0 : 1);
	        if (direction == Direction.Down) {
	            strength *= -1;
	        }
	        var propogate = Direction.Left;
	        if (this.index == 0) {
	            propogate = Direction.Right;
	        }
	        this.energyToAdd = (new Energy(propogate, strength));
	    };
	    Wavepoint.prototype.resetDir = function () {
	        this.energyToAdd = null;
	    };
	    Wavepoint.prototype.addEnergy = function (moreEnergy) {
	        this.newEnergies.push(moreEnergy);
	    };
	    Wavepoint.prototype.addExtraEnergy = function () {
	        if (this.energyToAdd != null) {
	            this.newEnergies.push(this.energyToAdd);
	        }
	    };
	    return Wavepoint;
	}());
	exports.Wavepoint = Wavepoint;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "bfd7f2fb9488329e9f3e8ca1993118ca.png";

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "981e2fff0b630502cd07560bfc1e77da.png";

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "f2ce1ada9812ac6cfc53baf595c626fe.png";

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "f5f6ead19dab8aa0e27eec824d64401e.png";

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "7812a16c3132063a78e16043ffbdb40d.png";

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "318af06c0a714e80ccd945661abb01ea.png";

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "7b14db85112b714ab7a155d6412da521.png";

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "4862b788ef25c43e94c5cee58461b909.png";

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Phaser = __webpack_require__(5);
	var WebFont = __webpack_require__(22);
	var LoadingState = (function (_super) {
	    __extends(LoadingState, _super);
	    function LoadingState() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    LoadingState.prototype.init = function () {
	        //TODO?
	    };
	    LoadingState.prototype.preload = function () {
	        var _this = this;
	        WebFont.load({
	            google: {
	                families: ['Bangers']
	            },
	            active: function () { return _this.fontsLoaded(); }
	        });
	        var text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', { font: '16px Arial', fill: '#dddddd', align: 'center' });
	        text.anchor.setTo(0.5, 0.5);
	    };
	    LoadingState.prototype.fontsLoaded = function () {
	        this.state.start('game');
	    };
	    return LoadingState;
	}(Phaser.State));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = LoadingState;


/***/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9jc3MvcmVzZXQuY3NzIiwid2VicGFjazovLy8uL2dsb2JhbHMudHMiLCJ3ZWJwYWNrOi8vLy4vZ2FtZVN0YXRlLnRzIiwid2VicGFjazovLy8uL3dhdmVwb2ludHMudHMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2ltYWdlcy9tdXNocm9vbTIucG5nIiwid2VicGFjazovLy8uL2Fzc2V0cy9pbWFnZXMvYXRvbS5wbmciLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2ltYWdlcy9iYWNrZ3JvdW5kLnBuZyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvaW1hZ2VzL3dhdmVmb3JtLnBuZyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvaW1hZ2VzL3BhcnRpY2xlLnBuZyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvaW1hZ2VzL3BhcnRpY2xlMi5wbmciLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2ltYWdlcy9wYXJ0aWNsZUJsdWVCaWcucG5nIiwid2VicGFjazovLy8uL2Fzc2V0cy9pbWFnZXMvcGFydGljbGVSZWRCaWcucG5nIiwid2VicGFjazovLy8uL2xvYWRpbmdTdGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHdCQUFjO0FBQ2Qsd0JBQVk7QUFDWixxQ0FBaUM7QUFDakMsd0JBQXlCO0FBQ3pCLHVDQUFxQztBQUVyQywyQ0FBb0M7QUFDcEMsOENBQTBDO0FBRTFDLEtBQUksbUJBQVMsRUFBRSxDQUFDO0FBQ2hCLEtBQUksc0JBQVksRUFBRSxDQUFDO0FBR25CO0tBS0M7U0FDQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztTQUMvRixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFF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LEVBQUUsRUFBbEIsQ0FBa0I7VUFDaEMsQ0FBQztTQUVGLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztTQUM1SSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDN0IsQ0FBQztLQUVPLGtDQUFXLEdBQW5CO1NBQ0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDMUIsQ0FBQztLQUNGLG1CQUFDO0FBQUQsRUFBQyxDQXBCeUMsTUFBTSxDQUFDLEtBQUssR0FvQnJEIiwiZmlsZSI6Im1haW4uYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdwaXhpJztcclxuaW1wb3J0ICdwMic7XHJcbmltcG9ydCAqIGFzIFBoYXNlciBmcm9tICdwaGFzZXInO1xyXG5pbXBvcnQgJy4vY3NzL3Jlc2V0LmNzcyc7XHJcbmltcG9ydCAqIGFzIEdsb2JhbHMgZnJvbSAnLi9nbG9iYWxzJztcclxuXHJcbmltcG9ydCBHYW1lU3RhdGUgZnJvbSAnLi9nYW1lU3RhdGUnO1xyXG5pbXBvcnQgTG9hZGluZ1N0YXRlIGZyb20gJy4vbG9hZGluZ1N0YXRlJztcclxuXHJcbm5ldyBHYW1lU3RhdGUoKTtcclxubmV3IExvYWRpbmdTdGF0ZSgpO1xyXG5kZWNsYXJlIGZ1bmN0aW9uIHJlcXVpcmUoZmlsZW5hbWU6IHN0cmluZyk6IGFueTtcclxuXHJcbmNsYXNzIFNpbXBsZUdhbWUge1xyXG5cdGdhbWU6IFBoYXNlci5HYW1lO1xyXG5cdGxvZ286IFBoYXNlci5TcHJpdGU7XHJcblx0Y3Vyc29yczogUGhhc2VyLkN1cnNvcktleXM7XHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5nYW1lID0gbmV3IFBoYXNlci5HYW1lKEdsb2JhbHMuU2NyZWVuV2lkdGgsIEdsb2JhbHMuU2NyZWVuSGVpZ2h0LCBQaGFzZXIuQVVUTywgXCJjb250ZW50XCIpO1xyXG5cdFx0dGhpcy5nYW1lLnN0YXRlLmFkZCgnbG9hZGluZycsIExvYWRpbmdTdGF0ZSk7XHJcblx0XHR0aGlzLmdhbWUuc3RhdGUuYWRkKCdnYW1lJywgR2FtZVN0YXRlKTtcclxuXHRcdHRoaXMuZ2FtZS5zdGF0ZS5zdGFydCgnbG9hZGluZycpO1xyXG5cdH1cclxufVxyXG5cclxuY29uc3QgZ2FtZSA9IG5ldyBTaW1wbGVHYW1lKCk7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2luZGV4LnRzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2Nzcy9yZXNldC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGNvbnN0IERlYnVnUmVuZGVyID0gdHJ1ZTtcclxuXHJcbmV4cG9ydCBjb25zdCBTY3JlZW5XaWR0aCA9IDE2MDA7XHJcbmV4cG9ydCBjb25zdCBTY3JlZW5IZWlnaHQgPSA4MDA7XHJcbmV4cG9ydCBjb25zdCBCb3JkZXJUb3BPZmZzZXQgPSAwO1xyXG5cclxuZXhwb3J0IGNvbnN0IFBsYXllclJhZGl1cyA9IDUwO1xyXG5leHBvcnQgY29uc3QgUGFydGljbGVSYWRpdXMgPSAxMDtcclxuZXhwb3J0IGNvbnN0IFNob3RSYWRpdXMgPSAzO1xyXG5cclxuZXhwb3J0IGNvbnN0IFBhcnRpY2xlU3BlZWQgPSAzMDA7XHJcblxyXG5leHBvcnQgY29uc3QgUGxheWVyRW5lcmd5ID0gMjA7XHJcbmV4cG9ydCBjb25zdCBQbGF5ZXJFbmVyZ3lVc2VSYXRlID0gMS4zO1xyXG5leHBvcnQgY29uc3QgUGxheWVyRW5lcmd5QWRkUmF0ZSA9IDAuNTtcclxuXHJcbmV4cG9ydCBjb25zdCBTY29yZVRvV2luID0gMTAwO1xyXG5leHBvcnQgY29uc3QgU2NvcmVEZWNheSA9IDAuMDI7XHJcbmV4cG9ydCBjb25zdCBTY29yZVZlbG9jaXR5TXVsdGlwbGllciA9IDE7XHJcbmV4cG9ydCBjb25zdCBTY29yZVBhcnRpY2xlU3RhcnRUaHJlc2hvbGQgPSAwLjU7XHJcblxyXG5leHBvcnQgY29uc3QgU2hvdEF3YXlEaXN0ID0gMzA7XHJcblxyXG5leHBvcnQgY29uc3QgUGxheWVyU3BlZWQgPSAzMDA7XHJcbmV4cG9ydCBjb25zdCBTaG90U3BlZWQgPSA0MDA7XHJcblxyXG5leHBvcnQgY29uc3QgU2xvd0Rvd25SYW5nZSA9IDE1MDtcclxuXHJcbmV4cG9ydCBjb25zdCBFbmVyZ3lEZWNheSA9IDAuODBcclxuXHJcbmV4cG9ydCBjb25zdCBOdW1iZXJPZlBhcnRpY2xlcyA9IDE0MDtcclxuXHJcbmV4cG9ydCBjb25zdCBXYXZlU3RyZW5ndGhNb2QgPSA1Ljc7XHJcbmV4cG9ydCBjb25zdCBXYXZlRGFtcFNsb3cgPSA1O1xyXG5leHBvcnQgY29uc3QgV2F2ZURhbXBTZXR0bGUgPSA0MDtcclxuXHJcbmV4cG9ydCBjb25zdCBJbml0aWFsU3RyZW5ndGggPSAyNTA7XHJcbmV4cG9ydCBjb25zdCBHb2FsV2lkdGggPSAxMDtcclxuZXhwb3J0IGNvbnN0IEdvYWxIZWlnaHQgPSBTY3JlZW5IZWlnaHQvMiAtIDE1MDtcclxuZXhwb3J0IGNvbnN0IEdvYWxTaWRlT2Zmc2V0ID0gMDsvLzE1O1xyXG5leHBvcnQgY29uc3QgR29hbFRvcE9mZnNldCA9IDM1MDtcclxuXHJcbmV4cG9ydCBjb25zdCBXaXJlU3RhcnRIZWlnaHQgPSBHb2FsVG9wT2Zmc2V0ICsgR29hbEhlaWdodCArIDE1MDtcclxuZXhwb3J0IGNvbnN0IFdpcmVTdGFydFNpZGVPZmZzZXQgPSBHb2FsU2lkZU9mZnNldDtcclxuXHJcbmV4cG9ydCBjb25zdCBCYWxsU3RhcnRQb3NYID0gU2NyZWVuV2lkdGgvMjtcclxuZXhwb3J0IGNvbnN0IEJhbGxTdGFydFBvc1kgPSA5MDtcclxuXHJcbmV4cG9ydCBjb25zdCBCYXJDb2xvdXJCbGFuayA9IDB4REREREREO1xyXG5leHBvcnQgY29uc3QgQmFyQ29sb3VyUmVkICAgPSAweEZGMjIyMjtcclxuZXhwb3J0IGNvbnN0IEJhckNvbG91ckJsdWUgID0gMHgyMjIyRkY7XHJcbmV4cG9ydCBjb25zdCBCYXJDb2xvdXJQdXJwbGUgID0gMHhGRjIyRkY7XHJcblxyXG5leHBvcnQgY29uc3QgV2F2ZU1hc3MgPSA2O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2dsb2JhbHMudHMiLCJpbXBvcnQgKiBhcyBQaGFzZXIgZnJvbSAncGhhc2VyJztcclxuaW1wb3J0ICogYXMgV2ViRm9udCBmcm9tICd3ZWJmb250bG9hZGVyJztcclxuaW1wb3J0ICogYXMgR2xvYmFscyBmcm9tICcuL2dsb2JhbHMnO1xyXG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuL3BsYXllcic7XHJcbmltcG9ydCB7IFdhdmVwb2ludCwgRW5lcmd5LCBEaXJlY3Rpb24gfSBmcm9tICcuL3dhdmVwb2ludHMnO1xyXG5cclxuZGVjbGFyZSBmdW5jdGlvbiByZXF1aXJlKHVybDogc3RyaW5nKTogc3RyaW5nO1xyXG5cclxubGV0IGdsb2JhbFNjb3JlID0gW1xyXG5cdDAsMFxyXG5dO1xyXG5cclxudmFyIHBsYXllckVuZXJneSA9IFsyMCwgMjBdO1xyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lU3RhdGUgZXh0ZW5kcyBQaGFzZXIuU3RhdGUge1xyXG5cclxuXHRwbGF5ZXJzID0gbmV3IEFycmF5PFBsYXllcj4oKTtcclxuXHRzY29yZVRleHRzID0gbmV3IEFycmF5PFBoYXNlci5UZXh0PigpO1xyXG5cdHNjb3JlQ29vbGRvd25zID0gbmV3IEFycmF5PG51bWJlcj4oKTtcclxuXHJcblx0d2F2ZXBvaW50cyA9IG5ldyBBcnJheTxXYXZlcG9pbnQ+KCk7XHJcblx0d2F2ZXBvaW50c1N0cmVuZ3RocyA9IG5ldyBBcnJheTxQaGFzZXIuR3JhcGhpY3M+KCk7XHJcblxyXG5cdHdpcmVDb2xsaXNpb25Hcm91cDogUGhhc2VyLlBoeXNpY3MuUDIuQ29sbGlzaW9uR3JvdXA7XHJcblx0YmFsbENvbGxpc2lvbkdyb3VwOiBQaGFzZXIuUGh5c2ljcy5QMi5Db2xsaXNpb25Hcm91cDs7XHJcblx0Z29hbENvbGxpc2lvbkdyb3VwOiBQaGFzZXIuUGh5c2ljcy5QMi5Db2xsaXNpb25Hcm91cDs7XHJcblxyXG5cdGJhbGxJc1N0dWNrQ291bnRlciA9IDA7XHJcblx0YmFsbDogUGhhc2VyLlNwcml0ZTtcclxuXHRlbmRDaXJjbGU6IFBoYXNlci5TcHJpdGU7XHJcblx0ZW5kVGV4dDogUGhhc2VyLlRleHQ7XHJcblx0YmFsbEVtaXR0ZXI6IFBoYXNlci5QYXJ0aWNsZXMuQXJjYWRlLkVtaXR0ZXI7XHJcblx0Y3VycmVudEJhbGxQYXJ0aWNsZXM6IHN0cmluZztcclxuXHJcblx0Z29hbHMgPSBuZXcgQXJyYXk8UGhhc2VyLkdyYXBoaWNzPigpO1xyXG5cclxuXHRiZzogUGhhc2VyLlRpbGVTcHJpdGU7XHJcblxyXG5cdGdhbWVJc0VuZGVkID0gZmFsc2U7XHJcblxyXG5cdGluaXQoKSB7XHJcblx0XHQvL1RPRE9cclxuXHR9XHJcblxyXG5cdHByZWxvYWQoKSB7XHJcblxyXG5cdFx0dGhpcy5zY2FsZS5mdWxsU2NyZWVuU2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5FWEFDVF9GSVQ7XHJcblxyXG5cdFx0dGhpcy5wbGF5ZXJzLmxlbmd0aCA9IDA7XHJcblxyXG5cdFx0dGhpcy5zY29yZUNvb2xkb3ducyA9IFswLCAwXTtcclxuXHJcblx0XHR0aGlzLnBoeXNpY3Muc3RhcnRTeXN0ZW0oUGhhc2VyLlBoeXNpY3MuUDJKUyk7XHJcblx0XHR0aGlzLnBoeXNpY3Muc3RhcnRTeXN0ZW0oUGhhc2VyLlBoeXNpY3MuQVJDQURFKTtcclxuXHRcdC8vICBUdXJuIG9uIGltcGFjdCBldmVudHMgZm9yIHRoZSB3b3JsZCwgd2l0aG91dCB0aGlzIHdlIGdldCBubyBjb2xsaXNpb24gY2FsbGJhY2tzXHJcblx0XHR0aGlzLnBoeXNpY3MucDIucmVzdGl0dXRpb24gPSAxO1xyXG5cdFx0dGhpcy5waHlzaWNzLnAyLmZyaWN0aW9uID0gMDtcclxuXHRcdHRoaXMucGh5c2ljcy5wMi5zZXRJbXBhY3RFdmVudHModHJ1ZSk7XHJcblx0XHR0aGlzLnBoeXNpY3MucDIuYXBwbHlHcmF2aXR5ID0gdHJ1ZTtcclxuXHQgICAgdGhpcy5waHlzaWNzLnAyLmdyYXZpdHkueSA9IDYwMDtcclxuXHJcblx0XHR0aGlzLmlucHV0LmdhbWVwYWQuc3RhcnQoKTtcclxuXHJcblx0XHR0aGlzLndpcmVDb2xsaXNpb25Hcm91cCA9IHRoaXMucGh5c2ljcy5wMi5jcmVhdGVDb2xsaXNpb25Hcm91cCgpO1xyXG5cdFx0dGhpcy5iYWxsQ29sbGlzaW9uR3JvdXAgPSB0aGlzLnBoeXNpY3MucDIuY3JlYXRlQ29sbGlzaW9uR3JvdXAoKTtcclxuXHRcdHRoaXMuZ29hbENvbGxpc2lvbkdyb3VwID0gdGhpcy5waHlzaWNzLnAyLmNyZWF0ZUNvbGxpc2lvbkdyb3VwKCk7XHJcblx0XHR0aGlzLnBoeXNpY3MucDIudXBkYXRlQm91bmRzQ29sbGlzaW9uR3JvdXAodHJ1ZSk7XHJcblxyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCcxcHgnLCByZXF1aXJlKCcuL2Fzc2V0cy9pbWFnZXMvbXVzaHJvb20yLnBuZycpKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnYXRvbScsIHJlcXVpcmUoJy4vYXNzZXRzL2ltYWdlcy9hdG9tLnBuZycpKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnYmFja2dyb3VuZCcsIHJlcXVpcmUoJy4vYXNzZXRzL2ltYWdlcy9iYWNrZ3JvdW5kLnBuZycpKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnd2F2ZWZvcm0nLCByZXF1aXJlKCcuL2Fzc2V0cy9pbWFnZXMvd2F2ZWZvcm0ucG5nJykpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdwYXJ0aWNsZUJsdWUnLCByZXF1aXJlKCcuL2Fzc2V0cy9pbWFnZXMvcGFydGljbGUucG5nJykpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdwYXJ0aWNsZVJlZCcsIHJlcXVpcmUoJy4vYXNzZXRzL2ltYWdlcy9wYXJ0aWNsZTIucG5nJykpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdwYXJ0aWNsZUJsdWVCaWcnLCByZXF1aXJlKCcuL2Fzc2V0cy9pbWFnZXMvcGFydGljbGVCbHVlQmlnLnBuZycpKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgncGFydGljbGVSZWRCaWcnLCByZXF1aXJlKCcuL2Fzc2V0cy9pbWFnZXMvcGFydGljbGVSZWRCaWcucG5nJykpO1xyXG5cclxuXHRcdHRoaXMuc2NhbGUuc3RhcnRGdWxsU2NyZWVuKGZhbHNlKTtcclxuXHJcblx0fVxyXG5cclxuXHRjcmVhdGUoKSB7XHJcblx0XHQvLyB0aGlzLmJnID0gdGhpcy5hZGQudGlsZVNwcml0ZSgwLEdsb2JhbHMuQm9yZGVyVG9wT2Zmc2V0LCBHbG9iYWxzLlNjcmVlbldpZHRoLCBHbG9iYWxzLlNjcmVlbkhlaWdodCwgJ2JhY2tncm91bmQnKTtcclxuXHRcdC8vIHRoaXMuYmcudGlsZVNjYWxlLng9MC4xO1xyXG5cdFx0Ly8gdGhpcy5iZy50aWxlU2NhbGUueT0wLjE7XHJcblxyXG5cdFx0dGhpcy5zY29yZVRleHRzLnB1c2godGhpcy5hZGQudGV4dCgxMCwgMTAsICcnICsgcGxheWVyRW5lcmd5WzBdLCB7IGZvbnQ6ICcxMDBweCBBcmlhbCcsIGZpbGw6ICcjZmZmZmZmJyB9KSk7XHQvL1BsYXllciAxXHJcblx0XHR0aGlzLnNjb3JlVGV4dHMucHVzaCh0aGlzLmFkZC50ZXh0KEdsb2JhbHMuU2NyZWVuV2lkdGggLSA4MCwgMTAsICcnICsgcGxheWVyRW5lcmd5WzFdLCB7IGZvbnQ6ICcxMDBweCBBcmlhbCcsIGZpbGw6ICcjZmZmZmZmJyB9KSk7XHQvL1BMYXllciAyXHJcblxyXG5cdFx0dGhpcy5nb2Fscy5wdXNoKHRoaXMuYWRkLmdyYXBoaWNzKDAsIDApKTtcclxuXHRcdHRoaXMuZ29hbHNbMF0ubGluZVN0eWxlKDEsIDB4RkZGRkZGLCAxKTtcclxuXHRcdHRoaXMuZ29hbHNbMF0uYmVnaW5GaWxsKDB4ZmZmZmZmLCAwLjMpO1xyXG5cdFx0dGhpcy5nb2Fsc1swXS5kcmF3UmVjdChHbG9iYWxzLkdvYWxTaWRlT2Zmc2V0LCBHbG9iYWxzLkdvYWxUb3BPZmZzZXQsIEdsb2JhbHMuR29hbFdpZHRoLCBHbG9iYWxzLkdvYWxIZWlnaHQpO1xyXG5cdFx0dGhpcy5waHlzaWNzLnAyLmVuYWJsZSh0aGlzLmdvYWxzWzBdLCBHbG9iYWxzLkRlYnVnUmVuZGVyKTtcclxuXHRcdGxldCBiYXJCb2R5ID0gPFBoYXNlci5QaHlzaWNzLlAyLkJvZHk+dGhpcy5nb2Fsc1swXS5ib2R5O1xyXG5cdFx0YmFyQm9keS5zZXRSZWN0YW5nbGUoR2xvYmFscy5Hb2FsV2lkdGgsIEdsb2JhbHMuR29hbEhlaWdodCwgR2xvYmFscy5Hb2FsV2lkdGgvMiwgR2xvYmFscy5Hb2FsVG9wT2Zmc2V0ICsgR2xvYmFscy5Hb2FsSGVpZ2h0LzIpO1xyXG5cdFx0YmFyQm9keS5zdGF0aWMgPSB0cnVlO1xyXG5cdFx0YmFyQm9keS5zZXRDb2xsaXNpb25Hcm91cCh0aGlzLmdvYWxDb2xsaXNpb25Hcm91cCk7XHJcblx0XHRiYXJCb2R5LmNvbGxpZGVzKHRoaXMuYmFsbENvbGxpc2lvbkdyb3VwLCAoKSA9PiB7IHRoaXMudXBkYXRlR2xvYmFsU2NvcmUoMCk7IH0pO1xyXG5cdFx0XHJcblxyXG5cdFx0dGhpcy5nb2Fscy5wdXNoKHRoaXMuYWRkLmdyYXBoaWNzKDAsIDApKTtcclxuXHRcdHRoaXMuZ29hbHNbMV0ubGluZVN0eWxlKDEsIDB4RkZGRkZGLCAxKTtcclxuXHRcdHRoaXMuZ29hbHNbMV0uYmVnaW5GaWxsKDB4ZmZmZmZmLCAwLjMpO1xyXG5cdFx0dGhpcy5nb2Fsc1sxXS5kcmF3UmVjdCggR2xvYmFscy5TY3JlZW5XaWR0aCAtIEdsb2JhbHMuR29hbFNpZGVPZmZzZXQgLSBHbG9iYWxzLkdvYWxXaWR0aCwgR2xvYmFscy5Hb2FsVG9wT2Zmc2V0LCBHbG9iYWxzLkdvYWxXaWR0aCwgR2xvYmFscy5Hb2FsSGVpZ2h0KTtcclxuXHRcdHRoaXMucGh5c2ljcy5wMi5lbmFibGUodGhpcy5nb2Fsc1sxXSwgR2xvYmFscy5EZWJ1Z1JlbmRlcik7XHJcblx0XHRsZXQgYmFyQm9keTIgPSA8UGhhc2VyLlBoeXNpY3MuUDIuQm9keT50aGlzLmdvYWxzWzFdLmJvZHk7XHJcblx0XHRiYXJCb2R5Mi5zZXRSZWN0YW5nbGUoIEdsb2JhbHMuR29hbFdpZHRoLCBHbG9iYWxzLkdvYWxIZWlnaHQsIChHbG9iYWxzLlNjcmVlbldpZHRoIC0gR2xvYmFscy5Hb2FsU2lkZU9mZnNldCAtIEdsb2JhbHMuR29hbFdpZHRoKSArIEdsb2JhbHMuR29hbFdpZHRoLzIsIEdsb2JhbHMuR29hbFRvcE9mZnNldCArIEdsb2JhbHMuR29hbEhlaWdodC8yKTtcclxuXHRcdGJhckJvZHkyLnN0YXRpYyA9IHRydWU7XHJcblx0XHRiYXJCb2R5Mi5zZXRDb2xsaXNpb25Hcm91cCh0aGlzLmdvYWxDb2xsaXNpb25Hcm91cCk7XHJcblx0XHRiYXJCb2R5Mi5jb2xsaWRlcyh0aGlzLmJhbGxDb2xsaXNpb25Hcm91cCwgKCkgPT4geyB0aGlzLnVwZGF0ZUdsb2JhbFNjb3JlKDEpOyB9KTtcclxuXHRcdFxyXG5cdFx0bGV0IHRvcEJhciA9IHRoaXMuYWRkLmdyYXBoaWNzKDAsIDApO1xyXG5cdFx0dG9wQmFyLmxpbmVTdHlsZSgxLCAweEZGRkZGRiwgMSk7XHJcblx0XHR0b3BCYXIuYmVnaW5GaWxsKDB4ZmZmZmZmLCAwLjMpO1xyXG5cdFx0dG9wQmFyLmRyYXdSZWN0KDAsIDAsIEdsb2JhbHMuU2NyZWVuV2lkdGgsIEdsb2JhbHMuQm9yZGVyVG9wT2Zmc2V0KTtcclxuXHRcdHRoaXMucGh5c2ljcy5wMi5lbmFibGUodG9wQmFyLCBHbG9iYWxzLkRlYnVnUmVuZGVyKTtcclxuXHRcdGxldCB0b3BCYXJCb2R5ID0gPFBoYXNlci5QaHlzaWNzLlAyLkJvZHk+dG9wQmFyLmJvZHk7XHJcblx0XHR0b3BCYXJCb2R5LnNldFJlY3RhbmdsZShHbG9iYWxzLlNjcmVlbldpZHRoLCBHbG9iYWxzLkJvcmRlclRvcE9mZnNldCwgR2xvYmFscy5TY3JlZW5XaWR0aC8yLCBHbG9iYWxzLkJvcmRlclRvcE9mZnNldC8yKTtcclxuXHRcdHRvcEJhckJvZHkuc3RhdGljID0gdHJ1ZTtcclxuXHRcdHRvcEJhckJvZHkuc2V0Q29sbGlzaW9uR3JvdXAodGhpcy5nb2FsQ29sbGlzaW9uR3JvdXApO1xyXG5cdFx0dG9wQmFyQm9keS5jb2xsaWRlcyh0aGlzLmJhbGxDb2xsaXNpb25Hcm91cCwgKCkgPT4geyB9KTtcclxuXHJcblx0XHQvLyAvL0RlYnVnIGJvdHRvbSBiYXIgZm9yIGJhbGwgcGh5c2ljc1xyXG5cdFx0Ly8gbGV0IGJvdHRvbUJhciA9IHRoaXMuYWRkLmdyYXBoaWNzKDAsIDApO1xyXG5cdFx0Ly8gYm90dG9tQmFyLmxpbmVTdHlsZSgxLCAweEZGRkZGRiwgMSk7XHJcblx0XHQvLyBib3R0b21CYXIuYmVnaW5GaWxsKDB4ZmZmZmZmLCAwLjMpO1xyXG5cdFx0Ly8gYm90dG9tQmFyLmRyYXdSZWN0KDAsIEdsb2JhbHMuV2lyZVN0YXJ0SGVpZ2h0IC0gNDAsIEdsb2JhbHMuU2NyZWVuV2lkdGgsIEdsb2JhbHMuQm9yZGVyVG9wT2Zmc2V0KTtcclxuXHRcdC8vIHRoaXMucGh5c2ljcy5wMi5lbmFibGUoYm90dG9tQmFyLCBHbG9iYWxzLkRlYnVnUmVuZGVyKTtcclxuXHRcdC8vIGxldCBib3R0b21CYXJCb2R5ID0gPFBoYXNlci5QaHlzaWNzLlAyLkJvZHk+Ym90dG9tQmFyLmJvZHk7XHJcblx0XHQvLyBib3R0b21CYXJCb2R5LnNldFJlY3RhbmdsZSggR2xvYmFscy5TY3JlZW5XaWR0aCwgR2xvYmFscy5Cb3JkZXJUb3BPZmZzZXQsIEdsb2JhbHMuU2NyZWVuV2lkdGgvMiwgR2xvYmFscy5XaXJlU3RhcnRIZWlnaHQgLSAyMCk7XHJcblx0XHQvLyBib3R0b21CYXJCb2R5LnN0YXRpYyA9IHRydWU7XHJcblx0XHQvLyBib3R0b21CYXJCb2R5LnNldENvbGxpc2lvbkdyb3VwKHRoaXMuZ29hbENvbGxpc2lvbkdyb3VwKTtcclxuXHRcdC8vIGJvdHRvbUJhckJvZHkuY29sbGlkZXModGhpcy5iYWxsQ29sbGlzaW9uR3JvdXAsICgpID0+IHsgfSk7XHJcblxyXG5cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpPEdsb2JhbHMuTnVtYmVyT2ZQYXJ0aWNsZXM7IGkrKykge1xyXG5cdFx0XHR0aGlzLndhdmVwb2ludHMucHVzaChuZXcgV2F2ZXBvaW50KHRoaXMud2lyZUNvbGxpc2lvbkdyb3VwLCB0aGlzLmJhbGxDb2xsaXNpb25Hcm91cCwgdGhpcywgaSkpO1xyXG5cclxuXHRcdFx0dGhpcy53YXZlcG9pbnRzU3RyZW5ndGhzLnB1c2godGhpcy5hZGQuZ3JhcGhpY3MoaSAqIChHbG9iYWxzLlNjcmVlbldpZHRoL0dsb2JhbHMuTnVtYmVyT2ZQYXJ0aWNsZXMpLCBHbG9iYWxzLlNjcmVlbkhlaWdodCAtIDIwKSk7XHJcblx0XHRcdC8vIHRoaXMud2F2ZXBvaW50c1N0cmVuZ3Roc1tpXS5saW5lU3R5bGUoMSwgR2xvYmFscy5CYXJDb2xvdXJQdXJwbGUsIDEpO1xyXG5cdFx0XHQvLyB0aGlzLndhdmVwb2ludHNTdHJlbmd0aHNbaV0uYmVnaW5GaWxsKDB4Nzc3Nzc3LCAwLjcpO1xyXG5cdFx0XHQvLyB0aGlzLndhdmVwb2ludHNTdHJlbmd0aHNbaV0uZHJhd1JlY3QoMCwgMCwgR2xvYmFscy5TY3JlZW5XaWR0aC9HbG9iYWxzLk51bWJlck9mUGFydGljbGVzLCAyMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5iYWxsID0gdGhpcy5hZGQuc3ByaXRlKEdsb2JhbHMuU2NyZWVuV2lkdGgvMiAsIDkwLCAnYXRvbScpO1xyXG5cdFx0dGhpcy5iYWxsLnNjYWxlLnggPSAwLjE3NTtcclxuXHRcdHRoaXMuYmFsbC5zY2FsZS55ID0gMC4xNzU7XHJcblxyXG5cdFx0dGhpcy5iYWxsRW1pdHRlciA9IHRoaXMuYWRkLmVtaXR0ZXIoR2xvYmFscy5TY3JlZW5XaWR0aC8yICwgOTAsIDEwMCk7XHJcblx0XHR0aGlzLmJhbGxFbWl0dGVyLnNldFJvdGF0aW9uKDAsIDApO1xyXG5cdFx0dGhpcy5iYWxsRW1pdHRlci5zZXRYU3BlZWQoLTEgKiBHbG9iYWxzLlBhcnRpY2xlU3BlZWQsIEdsb2JhbHMuUGFydGljbGVTcGVlZCk7XHJcblx0XHR0aGlzLmJhbGxFbWl0dGVyLnNldFlTcGVlZCgtMSAqIEdsb2JhbHMuUGFydGljbGVTcGVlZCwgR2xvYmFscy5QYXJ0aWNsZVNwZWVkKTtcclxuXHRcdHRoaXMuYmFsbEVtaXR0ZXIuc2V0U2NhbGUoIDAuOCwxLjIsIDAuOCwxLjIgKTtcclxuXHJcblx0XHR0aGlzLnBoeXNpY3MucDIuZW5hYmxlKHRoaXMuYmFsbCwgR2xvYmFscy5EZWJ1Z1JlbmRlcik7XHJcblx0XHRsZXQgYmFsbEJvZHkgPSA8UGhhc2VyLlBoeXNpY3MuUDIuQm9keT50aGlzLmJhbGwuYm9keTtcclxuXHRcdGJhbGxCb2R5LnNldENpcmNsZShHbG9iYWxzLlBsYXllclJhZGl1cywgMCwgMCk7XHJcblx0XHRiYWxsQm9keS5jb2xsaWRlV29ybGRCb3VuZHMgPSB0cnVlO1xyXG5cdFx0YmFsbEJvZHkuZGF0YS5ncmF2aXR5U2NhbGUgPSAxO1xyXG5cdFx0YmFsbEJvZHkuZGF0YS5tYXNzID0gMTtcclxuXHRcdGJhbGxCb2R5LmRhbXBpbmcgPSAwLjM7XHJcblx0XHRiYWxsQm9keS5zZXRDb2xsaXNpb25Hcm91cCh0aGlzLmJhbGxDb2xsaXNpb25Hcm91cCk7XHJcblx0XHRiYWxsQm9keS5jb2xsaWRlcyhbdGhpcy5waHlzaWNzLnAyLmJvdW5kc0NvbGxpc2lvbkdyb3VwLCB0aGlzLndpcmVDb2xsaXNpb25Hcm91cCwgdGhpcy5nb2FsQ29sbGlzaW9uR3JvdXBdKTtcclxuXHJcblxyXG5cdFx0dmFyIGJhbGxNYXRlcmlhbCA9IHRoaXMucGh5c2ljcy5wMi5jcmVhdGVNYXRlcmlhbCgnYmFsbE1hdGVyaWFsJywgYmFsbEJvZHkpO1xyXG5cdFx0dmFyIHdhdmVNYXRlcmlhbCA9IHRoaXMucGh5c2ljcy5wMi5jcmVhdGVNYXRlcmlhbCgnd2F2ZU1hdGVyaWFsJyk7XHJcblx0XHRmb3IgKGxldCB3YXZlcG9pbnQgb2YgdGhpcy53YXZlcG9pbnRzKSB7XHJcblx0XHRcdHdhdmVwb2ludC5ib2R5LnNldE1hdGVyaWFsKHdhdmVNYXRlcmlhbCk7XHJcblx0XHR9XHJcblx0XHR2YXIgZ29hbE1hdGVyaWFsID0gdGhpcy5waHlzaWNzLnAyLmNyZWF0ZU1hdGVyaWFsKCdnb2FsTWF0ZXJpYWwnKTtcclxuXHRcdHRoaXMuZ29hbHNbMF0uYm9keS5zZXRNYXRlcmlhbChnb2FsTWF0ZXJpYWwpO1xyXG5cdFx0dGhpcy5nb2Fsc1sxXS5ib2R5LnNldE1hdGVyaWFsKGdvYWxNYXRlcmlhbCk7XHJcblx0XHR2YXIgd29ybGRFZGdlTWF0ZXJpYWwgPSB0aGlzLnBoeXNpY3MucDIuY3JlYXRlTWF0ZXJpYWwoJ3dhbGxNYXRlcmlhbCcpO1xyXG5cdFx0dGhpcy5waHlzaWNzLnAyLnNldFdvcmxkTWF0ZXJpYWwod29ybGRFZGdlTWF0ZXJpYWwsIHRydWUsIHRydWUsIHRydWUsIHRydWUpO1xyXG5cclxuXHRcdC8vIGJhbGxCb2R5Lm9uQmVnaW5Db250YWN0LmFkZCggKGJvZHkpID0+IGNvbnNvbGUubG9nKGJvZHkpICk7XHJcblx0XHRiYWxsQm9keS5vbkVuZENvbnRhY3QuYWRkKCAoYXJnKSA9PiBjb25zb2xlLmxvZyhhcmcpICk7XHJcblxyXG5cdFx0dmFyIHdhdmVDb250YWN0TWF0ZXJpYWwgPSB0aGlzLnBoeXNpY3MucDIuY3JlYXRlQ29udGFjdE1hdGVyaWFsKGJhbGxNYXRlcmlhbCwgd2F2ZU1hdGVyaWFsKTtcclxuXHRcdHdhdmVDb250YWN0TWF0ZXJpYWwuZnJpY3Rpb24gPSAxO1xyXG5cdFx0d2F2ZUNvbnRhY3RNYXRlcmlhbC5yZXN0aXR1dGlvbiA9IDAuNztcclxuXHRcdHZhciBnb2FsQ29udGFjdE1hdGVyaWFsID0gdGhpcy5waHlzaWNzLnAyLmNyZWF0ZUNvbnRhY3RNYXRlcmlhbChiYWxsTWF0ZXJpYWwsIGdvYWxNYXRlcmlhbCk7XHJcblx0XHRnb2FsQ29udGFjdE1hdGVyaWFsLmZyaWN0aW9uID0gMTA7XHJcblx0XHRnb2FsQ29udGFjdE1hdGVyaWFsLnJlc3RpdHV0aW9uID0gMi41O1xyXG5cdFx0dmFyIHdhbGxDb250YWN0TWF0ZXJpYWwgPSB0aGlzLnBoeXNpY3MucDIuY3JlYXRlQ29udGFjdE1hdGVyaWFsKGJhbGxNYXRlcmlhbCwgd29ybGRFZGdlTWF0ZXJpYWwpO1xyXG5cdFx0d2FsbENvbnRhY3RNYXRlcmlhbC5mcmljdGlvbiA9IDA7XHJcblx0XHR3YWxsQ29udGFjdE1hdGVyaWFsLnJlc3RpdHV0aW9uID0gMC4yO1xyXG5cclxuXHRcdHRoaXMuZ2FtZS5pbnB1dC5rZXlib2FyZC5vbkRvd25DYWxsYmFjayA9IChpbnB1dE9iamVjdDogYW55KSA9PiB7XHJcblx0XHRcdGlmICghdGhpcy5nYW1lSXNFbmRlZCkge1xyXG5cdFx0XHRcdGlmIChpbnB1dE9iamVjdC5rZXlDb2RlID09IFBoYXNlci5LZXlib2FyZC5XKSB7XHJcblx0XHRcdFx0XHR0aGlzLndhdmVwb2ludHNbMF0uc2V0RGlyKERpcmVjdGlvbi5VcCwgcGxheWVyRW5lcmd5KTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGlucHV0T2JqZWN0LmtleUNvZGUgPT0gUGhhc2VyLktleWJvYXJkLlMpIHtcclxuXHRcdFx0XHRcdHRoaXMud2F2ZXBvaW50c1swXS5zZXREaXIoRGlyZWN0aW9uLkRvd24sIHBsYXllckVuZXJneSk7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChpbnB1dE9iamVjdC5rZXlDb2RlID09IFBoYXNlci5LZXlib2FyZC5VUCkge1xyXG5cdFx0XHRcdFx0dGhpcy53YXZlcG9pbnRzW0dsb2JhbHMuTnVtYmVyT2ZQYXJ0aWNsZXMtMV0uc2V0RGlyKERpcmVjdGlvbi5VcCwgcGxheWVyRW5lcmd5KTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGlucHV0T2JqZWN0LmtleUNvZGUgPT0gUGhhc2VyLktleWJvYXJkLkRPV04pIHtcclxuXHRcdFx0XHRcdHRoaXMud2F2ZXBvaW50c1tHbG9iYWxzLk51bWJlck9mUGFydGljbGVzLTFdLnNldERpcihEaXJlY3Rpb24uRG93biwgcGxheWVyRW5lcmd5KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYgKGlucHV0T2JqZWN0LmtleUNvZGUgPT0gUGhhc2VyLktleWJvYXJkLlIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiUmVzZXRcIik7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdHRoaXMucmVzZXRTdGF0ZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuZ2FtZS5pbnB1dC5rZXlib2FyZC5vblVwQ2FsbGJhY2sgPSAoaW5wdXRPYmplY3Q6IGFueSkgPT4ge1xyXG5cdFx0XHRpZiAoaW5wdXRPYmplY3Qua2V5Q29kZSA9PSBQaGFzZXIuS2V5Ym9hcmQuVykge1xyXG5cdFx0XHRcdHRoaXMud2F2ZXBvaW50c1swXS5yZXNldERpcigpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGlucHV0T2JqZWN0LmtleUNvZGUgPT0gUGhhc2VyLktleWJvYXJkLlMpIHtcclxuXHRcdFx0XHR0aGlzLndhdmVwb2ludHNbMF0ucmVzZXREaXIoKTtcclxuXHRcdFx0fSBlbHNlIGlmIChpbnB1dE9iamVjdC5rZXlDb2RlID09IFBoYXNlci5LZXlib2FyZC5VUCkge1xyXG5cdFx0XHRcdHRoaXMud2F2ZXBvaW50c1tHbG9iYWxzLk51bWJlck9mUGFydGljbGVzLTFdLnJlc2V0RGlyKCk7XHJcblx0XHRcdH0gZWxzZSBpZiAoaW5wdXRPYmplY3Qua2V5Q29kZSA9PSBQaGFzZXIuS2V5Ym9hcmQuRE9XTikge1xyXG5cdFx0XHRcdHRoaXMud2F2ZXBvaW50c1tHbG9iYWxzLk51bWJlck9mUGFydGljbGVzLTFdLnJlc2V0RGlyKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHVwZGF0ZSgpIHtcclxuXHRcdGlmIChwbGF5ZXJFbmVyZ3lbMF0gPiAxKVxyXG5cdFx0XHR0aGlzLndhdmVwb2ludHNbMF0uYWRkRXh0cmFFbmVyZ3koKTtcclxuXHRcdGlmIChwbGF5ZXJFbmVyZ3lbMV0gPiAxKVxyXG5cdFx0XHR0aGlzLndhdmVwb2ludHNbR2xvYmFscy5OdW1iZXJPZlBhcnRpY2xlcy0xXS5hZGRFeHRyYUVuZXJneSgpO1xyXG5cclxuXHRcdGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLndhdmVwb2ludHMubGVuZ3RoOyArK2luZGV4KSB7XHJcblx0XHRcdGxldCBsZWZ0Q291bnQgPSAwO1xyXG5cdFx0XHRsZXQgcmlnaHRDb3VudCA9IDA7XHJcblx0XHRcdGZvciAobGV0IGVuZXJneSBvZiB0aGlzLndhdmVwb2ludHNbaW5kZXhdLmVuZXJnaWVzKSB7XHJcblx0XHRcdFx0aWYgKGVuZXJneS50cmF2ZWxsaW5nID09IERpcmVjdGlvbi5MZWZ0ICYmIGluZGV4ID4gMCkge1xyXG5cdFx0XHRcdFx0bGVmdENvdW50ICs9IGVuZXJneS5zdHJlbmd0aDtcclxuXHRcdFx0XHRcdHRoaXMud2F2ZXBvaW50c1tpbmRleCAtIDFdLm5ld0VuZXJnaWVzLnB1c2goZW5lcmd5KTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGVuZXJneS50cmF2ZWxsaW5nID09IERpcmVjdGlvbi5SaWdodCAmJiBpbmRleCA8IEdsb2JhbHMuTnVtYmVyT2ZQYXJ0aWNsZXMtMSkge1xyXG5cdFx0XHRcdFx0dGhpcy53YXZlcG9pbnRzW2luZGV4ICsgMV0ubmV3RW5lcmdpZXMucHVzaChlbmVyZ3kpO1xyXG5cdFx0XHRcdFx0cmlnaHRDb3VudCArPSBlbmVyZ3kuc3RyZW5ndGg7O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IG9sZENvbG91ciA9IHRoaXMud2F2ZXBvaW50c1tpbmRleF0uc3ByaXRlLnRpbnQ7XHJcblx0XHRcdGxldCBuZXdDb2xvdXIgPSBvbGRDb2xvdXI7XHJcblxyXG5cclxuXHRcdFx0aWYgKGxlZnRDb3VudCAhPSAwICYmIHJpZ2h0Q291bnQgIT0gMCkge1xyXG5cdFx0XHRcdG5ld0NvbG91ciA9IEdsb2JhbHMuQmFyQ29sb3VyUHVycGxlO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGxlZnRDb3VudCAhPSAwKSB7XHJcblx0XHRcdFx0bmV3Q29sb3VyID0gR2xvYmFscy5CYXJDb2xvdXJCbHVlO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHJpZ2h0Q291bnQgIT0gMCkge1xyXG5cdFx0XHRcdG5ld0NvbG91ciA9IEdsb2JhbHMuQmFyQ29sb3VyUmVkO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG5ld0NvbG91ciA9IEdsb2JhbHMuQmFyQ29sb3VyQmxhbms7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChuZXdDb2xvdXIgIT0gb2xkQ29sb3VyKSB7XHJcblx0XHRcdFx0dGhpcy53YXZlcG9pbnRzW2luZGV4XS5zcHJpdGUudGludCA9IG5ld0NvbG91cjtcclxuXHRcdFx0XHQvLyB0aGlzLndhdmVwb2ludHNTdHJlbmd0aHNbaW5kZXhdLmxpbmVTdHlsZSgxLCBuZXdDb2xvdXIsIDEpO1xyXG5cdFx0XHRcdC8vIHRoaXMud2F2ZXBvaW50c1N0cmVuZ3Roc1tpbmRleF0udGludCA9IG5ld0NvbG91cjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRmb3IgKGxldCB3YXZlcG9pbnQgb2YgdGhpcy53YXZlcG9pbnRzKSB7XHJcblx0XHRcdHdhdmVwb2ludC51cGRhdGUocGxheWVyRW5lcmd5KTtcclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKGxldCBpPTA7IGk8Z2xvYmFsU2NvcmUubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKGdsb2JhbFNjb3JlW2ldID4gMSkge1xyXG5cdFx0XHRcdGdsb2JhbFNjb3JlW2ldIC09IEdsb2JhbHMuU2NvcmVEZWNheTtcclxuXHRcdFx0XHQvL3RoaXMuc2NvcmVUZXh0c1tpXS5zZXRUZXh0KGdsb2JhbFNjb3JlW2ldLnRvU3RyaW5nKCkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR0aGlzLnJlY29sb3VyQmFsbCgpO1xyXG5cclxuXHRcdGlmICh0aGlzLmJhbGwucG9zaXRpb24ueSA+IEdsb2JhbHMuV2lyZVN0YXJ0SGVpZ2h0KSB7XHJcblx0XHRcdHRoaXMuYmFsbElzU3R1Y2tDb3VudGVyKys7XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMuYmFsbElzU3R1Y2tDb3VudGVyID4gMCkge1xyXG5cdFx0XHR0aGlzLmJhbGxJc1N0dWNrQ291bnRlciA9IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuYmFsbC5wb3NpdGlvbi55ID49IEdsb2JhbHMuU2NyZWVuSGVpZ2h0IC0gR2xvYmFscy5QbGF5ZXJSYWRpdXMvMikge1xyXG5cdFx0XHR0aGlzLmJhbGwuYm9keS54ID0gR2xvYmFscy5CYWxsU3RhcnRQb3NYO1xyXG5cdFx0XHR0aGlzLmJhbGwuYm9keS55ID0gR2xvYmFscy5CYWxsU3RhcnRQb3NZO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCAyOyBpbmRleCsrKSB7XHJcblx0XHRcdGlmICh0aGlzLnNjb3JlQ29vbGRvd25zW2luZGV4XSA+IDApIHtcclxuXHRcdFx0XHR0aGlzLnNjb3JlQ29vbGRvd25zW2luZGV4XSAtPSAwLjA1O1xyXG5cdFx0XHRcdGlmIChNYXRoLmFicyh0aGlzLnNjb3JlQ29vbGRvd25zW2luZGV4XSAtIDAuMDUpIDwgMC4xKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNjb3JlQ29vbGRvd25zW2luZGV4XSA9IDA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHRoaXMuYmFsbEVtaXR0ZXIuZW1pdFggPSB0aGlzLmJhbGwueDtcclxuXHRcdHRoaXMuYmFsbEVtaXR0ZXIuZW1pdFkgPSB0aGlzLmJhbGwueTtcclxuXHJcblx0XHR0aGlzLnNjb3JlVGV4dHNbMF0uc2V0VGV4dChwbGF5ZXJFbmVyZ3lbMF0udG9TdHJpbmcoKSk7XHJcblx0XHR0aGlzLnNjb3JlVGV4dHNbMV0uc2V0VGV4dChwbGF5ZXJFbmVyZ3lbMV0udG9TdHJpbmcoKSk7XHJcblx0fVxyXG5cclxuXHR1cGRhdGVHbG9iYWxTY29yZShpbmRleDogbnVtYmVyKSB7XHJcblx0XHRpZiAodGhpcy5nYW1lSXNFbmRlZCkgcmV0dXJuO1xyXG5cclxuXHRcdGlmICh0aGlzLnNjb3JlQ29vbGRvd25zW2luZGV4XSA9PSAwKSB7XHJcblx0XHRcdGdsb2JhbFNjb3JlW2luZGV4XSArPSAyMDtcclxuXHRcdFx0dGhpcy5zY29yZUNvb2xkb3duc1tpbmRleF0gPSA0O1xyXG5cclxuXHRcdFx0XHJcblxyXG5cdFx0XHR0aGlzLnJlY29sb3VyQmFsbCgpO1xyXG5cclxuXHRcdFx0aWYgKGdsb2JhbFNjb3JlW2luZGV4XSA+PSBHbG9iYWxzLlNjb3JlVG9XaW4pIHtcclxuXHRcdFx0XHR0aGlzLmV4cGxvZGVCYWxsQW5kRW5kKGluZGV4KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiQ29vbGRvd24gZm9yIFwiICsgKGluZGV4KzEpLnRvU3RyaW5nKCkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmVjb2xvdXJCYWxsKCkge1xyXG5cdFx0bGV0IGNvbG91clBvaW50UmF0aW8gPSAweEZGL0dsb2JhbHMuU2NvcmVUb1dpbjtcclxuXHJcblx0XHRsZXQgc2NvcmVEaWZmID0gZ2xvYmFsU2NvcmVbMF0gLSBnbG9iYWxTY29yZVsxXTtcclxuXHRcdGxldCBtYXhTY29yZSA9IChnbG9iYWxTY29yZVswXSA+IGdsb2JhbFNjb3JlWzFdID8gZ2xvYmFsU2NvcmVbMF0gOiBnbG9iYWxTY29yZVsxXSk7XHJcblx0XHQvL0lmIHNjb3JlRGlmZiBpcyBwb3NpdGl2ZSwgZ28gbW9yZSByZWRcclxuXHJcblx0XHRsZXQgYmx1ZVJhdGlvID0gMHhBQSArIHNjb3JlRGlmZjtcclxuXHRcdGlmIChibHVlUmF0aW8gPiAweEZGKSBibHVlUmF0aW8gPSAweEZGO1xyXG5cdFx0aWYgKGJsdWVSYXRpbyA8IDB4MDApIGJsdWVSYXRpbyA9IDB4MDA7XHJcblx0XHRsZXQgcmVkUmF0aW8gPSAweEFBIC0gc2NvcmVEaWZmO1xyXG5cdFx0aWYgKHJlZFJhdGlvID4gMHhGRikgcmVkUmF0aW8gPSAweEZGO1xyXG5cdFx0aWYgKHJlZFJhdGlvIDwgMHgwMCkgcmVkUmF0aW8gPSAweDAwO1xyXG5cdFx0cmVkUmF0aW8gPSBNYXRoLnRydW5jKHJlZFJhdGlvKTtcclxuXHRcdGJsdWVSYXRpbyA9IE1hdGgudHJ1bmMoYmx1ZVJhdGlvKTtcclxuXHRcdGxldCBncmVlblJhdGlvID0gIChibHVlUmF0aW8gPCByZWRSYXRpbyA/IGJsdWVSYXRpbyA6IHJlZFJhdGlvKTtcclxuXHRcdGxldCBuZXdDb2xvdXIgPSBNYXRoLnRydW5jKHJlZFJhdGlvICogMHgxMDAwMCArIGdyZWVuUmF0aW8gKiAweDEwMCArIGJsdWVSYXRpbyk7XHJcblx0XHR0aGlzLmJhbGwudGludCA9IG5ld0NvbG91cjtcclxuXHJcblx0XHRsZXQgcHJvZE51bWJlciA9IDI3MCooIChHbG9iYWxzLlNjb3JlVG9XaW4gLSBtYXhTY29yZSkgLyAoR2xvYmFscy5TY29yZVRvV2luIC0gR2xvYmFscy5TY29yZVBhcnRpY2xlU3RhcnRUaHJlc2hvbGQqR2xvYmFscy5TY29yZVRvV2luKSApO1xyXG5cdFx0dGhpcy5iYWxsRW1pdHRlci5mcmVxdWVuY3kgPSBwcm9kTnVtYmVyO1x0XHRcclxuXHJcblx0XHRpZiAoc2NvcmVEaWZmID4gMTAgJiYgZ2xvYmFsU2NvcmVbMF0gPiAoR2xvYmFscy5TY29yZVBhcnRpY2xlU3RhcnRUaHJlc2hvbGQqR2xvYmFscy5TY29yZVRvV2luKSAgJiYgdGhpcy5jdXJyZW50QmFsbFBhcnRpY2xlcyAhPSBcImJsdWVcIikge1xyXG5cdFx0XHR0aGlzLmJhbGxFbWl0dGVyLmtpbGwoKTtcclxuXHRcdFx0dGhpcy5iYWxsRW1pdHRlci5tYWtlUGFydGljbGVzKCdwYXJ0aWNsZUJsdWUnKTtcclxuICAgIFx0XHR0aGlzLmJhbGxFbWl0dGVyLnN0YXJ0KGZhbHNlLCAxMDAwLCBwcm9kTnVtYmVyKTtcclxuXHRcdFx0dGhpcy5jdXJyZW50QmFsbFBhcnRpY2xlcyA9IFwiYmx1ZVwiO1xyXG5cdFx0fSBlbHNlIGlmIChzY29yZURpZmYgPCAxMCAmJiBnbG9iYWxTY29yZVsxXSA+IChHbG9iYWxzLlNjb3JlUGFydGljbGVTdGFydFRocmVzaG9sZCpHbG9iYWxzLlNjb3JlVG9XaW4pICAmJiB0aGlzLmN1cnJlbnRCYWxsUGFydGljbGVzICE9IFwicmVkXCIpIHtcclxuXHRcdFx0dGhpcy5iYWxsRW1pdHRlci5raWxsKCk7XHJcblx0XHRcdHRoaXMuYmFsbEVtaXR0ZXIubWFrZVBhcnRpY2xlcygncGFydGljbGVSZWQnKTtcclxuICAgIFx0XHR0aGlzLmJhbGxFbWl0dGVyLnN0YXJ0KGZhbHNlLCAxMDAwLCBwcm9kTnVtYmVyKTtcclxuXHRcdFx0dGhpcy5jdXJyZW50QmFsbFBhcnRpY2xlcyA9IFwicmVkXCI7XHJcblx0XHR9IGVsc2UgaWYgKGdsb2JhbFNjb3JlWzBdIDwgKEdsb2JhbHMuU2NvcmVQYXJ0aWNsZVN0YXJ0VGhyZXNob2xkKkdsb2JhbHMuU2NvcmVUb1dpbikgJiYgZ2xvYmFsU2NvcmVbMV0gPCAoR2xvYmFscy5TY29yZVBhcnRpY2xlU3RhcnRUaHJlc2hvbGQqR2xvYmFscy5TY29yZVRvV2luKSkge1xyXG5cdFx0XHR0aGlzLmJhbGxFbWl0dGVyLmtpbGwoKTtcclxuXHRcdFx0dGhpcy5iYWxsRW1pdHRlci5yZW1vdmVDaGlsZHJlbigpO1xyXG5cdFx0XHR0aGlzLmN1cnJlbnRCYWxsUGFydGljbGVzID0gXCJub25lXCI7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRleHBsb2RlQmFsbEFuZEVuZCh3aW5QbGF5ZXI6IG51bWJlcikge1xyXG5cdFx0bGV0IG1heFNjb3JlID0gKGdsb2JhbFNjb3JlWzBdID4gZ2xvYmFsU2NvcmVbMV0gPyBnbG9iYWxTY29yZVswXSA6IGdsb2JhbFNjb3JlWzFdKTtcclxuXHJcblx0XHR0aGlzLmdhbWVJc0VuZGVkID0gdHJ1ZTtcclxuXHJcblx0XHRsZXQgZW5kVGltZXIgPSB0aGlzLnRpbWUuY3JlYXRlKHRydWUpO1xyXG5cclxuXHRcdHRoaXMuYmFsbEVtaXR0ZXIuZnJlcXVlbmN5ID0gMTA7XHRcdFxyXG5cclxuXHRcdHRoaXMuY2FtZXJhLnNoYWtlKDAuMDEsIDIwMDAwLCB0cnVlKTtcclxuXHJcblx0XHRlbmRUaW1lci5yZXBlYXQoMTAsIDE1MCwgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLmJhbGwuc2NhbGUueCAqPSAxLjA1O1xyXG5cdFx0XHR0aGlzLmJhbGwuc2NhbGUueSAqPSAxLjA1O1xyXG5cdFx0XHR0aGlzLmJhbGwuYWxwaGEgKj0gMC45OTtcclxuXHJcblx0XHRcdGxldCBtdWx0ID0gMS4wMTtcclxuXHRcdFx0dGhpcy5iYWxsRW1pdHRlci5tYXhQYXJ0aWNsZVNwZWVkLnggKj0gbXVsdDtcclxuXHRcdFx0dGhpcy5iYWxsRW1pdHRlci5taW5QYXJ0aWNsZVNwZWVkLnggKj0gbXVsdDtcclxuXHRcdFx0dGhpcy5iYWxsRW1pdHRlci5tYXhQYXJ0aWNsZVNwZWVkLnkgKj0gbXVsdDtcclxuXHRcdFx0dGhpcy5iYWxsRW1pdHRlci5taW5QYXJ0aWNsZVNwZWVkLnkgKj0gbXVsdDtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGVuZFRpbWVyLmFkZCgxMCAqIDE1MCwgKCkgPT4ge1xyXG5cclxuXHRcdFx0dGhpcy5lbmRDaXJjbGUgPSB0aGlzLmFkZC5zcHJpdGUoMCwgMCwgKHdpblBsYXllciA9PSAwID8gJ3BhcnRpY2xlQmx1ZUJpZycgOiAncGFydGljbGVSZWRCaWcnKSk7XHJcblx0XHRcdHRoaXMuZW5kQ2lyY2xlLmFuY2hvci54ID0gMC41O1xyXG5cdFx0XHR0aGlzLmVuZENpcmNsZS5hbmNob3IueSA9IDAuNTtcclxuXHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKHRoaXMud29ybGQuY2VudGVyWCk7XHJcblx0XHRcdFxyXG5cclxuXHRcdFx0dGhpcy5lbmRDaXJjbGUueCA9IHRoaXMud29ybGQuY2VudGVyWDtcclxuXHRcdFx0dGhpcy5lbmRDaXJjbGUueSA9IHRoaXMud29ybGQuY2VudGVyWTtcclxuXHJcblx0XHRcdGxldCBjaXJjbGVUaW1lciA9IHRoaXMudGltZS5jcmVhdGUodHJ1ZSk7XHJcblx0XHRcdGNpcmNsZVRpbWVyLnJlcGVhdCgxMCwgMTAwMCwgKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuZW5kQ2lyY2xlLnNjYWxlLnggKj0gMS4wNTtcclxuXHRcdFx0XHR0aGlzLmVuZENpcmNsZS5zY2FsZS55ICo9IDEuMDU7XHRcdFx0XHRcclxuXHRcdFx0fSk7XHJcblx0XHRcdGNpcmNsZVRpbWVyLmFkZCgxMCAqIDEwMCwgKCkgPT4ge1xyXG5cdFx0XHRcdGxldCBwbGF5ZXJOYW1lID0gKHdpblBsYXllciA9PSAwID8gXCJCbHVlIFBsYXllciBXaW5zIVxcblByZXNzIFIgdG8gUmVzZXRcIiA6IFwiUmVkIFBsYXllciBXaW5zIVxcblByZXNzIFIgdG8gUmVzZXRcIik7XHJcblx0XHRcdFx0dGhpcy5lbmRUZXh0ID0gdGhpcy5hZGQudGV4dCgwLCAwLCBwbGF5ZXJOYW1lLCB7IGZvbnQ6ICcxMDBweCBBcmlhbCcsIGZpbGw6ICcjMDAwMDAwJyB9ICk7XHJcblx0XHRcdFx0IHRoaXMuZW5kVGV4dC5hbmNob3IueCA9IDAuNTtcclxuXHRcdFx0XHQgdGhpcy5lbmRUZXh0LmFuY2hvci55ID0gMC41O1xyXG5cclxuXHRcdFx0XHR0aGlzLmVuZFRleHQueCA9IHRoaXMud29ybGQuY2VudGVyWDtcclxuXHRcdFx0XHR0aGlzLmVuZFRleHQueSA9IHRoaXMud29ybGQuY2VudGVyWTtcclxuXHJcblx0XHRcdFx0XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRjaXJjbGVUaW1lci5zdGFydCgpO1xyXG5cclxuXHJcblx0XHRcdHRoaXMuY2FtZXJhLnNoYWtlKDAuMiwgNTAwLCB0cnVlKTtcclxuXHRcdFx0dGhpcy5iYWxsLmFscGhhID0gMC4wO1xyXG5cdFx0XHR0aGlzLmJhbGxFbWl0dGVyLmZyZXF1ZW5jeSA9IDEwMDAwMDtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGVuZFRpbWVyLnN0YXJ0KCk7XHJcblxyXG5cclxuXHJcblx0XHQvLyB0aGlzLmNhbWVyYS5zaGFrZSg1MDAsIDAuMSk7XHJcblx0fVxyXG5cclxuXHRyZXNldFN0YXRlKCkge1xyXG5cdFx0dGhpcy5nYW1lSXNFbmRlZCA9IGZhbHNlO1xyXG5cdFx0Z2xvYmFsU2NvcmUgPSBbMCwgMF07XHJcblxyXG5cdFx0dGhpcy5lbmRUZXh0LmRlc3Ryb3koKTtcclxuXHJcblx0XHR0aGlzLmJhbGwuYm9keS54ID0gR2xvYmFscy5CYWxsU3RhcnRQb3NYO1xyXG5cdFx0dGhpcy5iYWxsLmJvZHkueSA9IEdsb2JhbHMuQmFsbFN0YXJ0UG9zWTtcclxuXHRcdHRoaXMuYmFsbC5ib2R5LnZlbG9jaXR5LnggPSAwO1xyXG5cdFx0dGhpcy5iYWxsLmJvZHkudmVsb2NpdHkueSA9IDA7XHJcblx0XHR0aGlzLmJhbGwuYm9keS52ZWxvY2l0eS5teCA9IDA7XHJcblx0XHR0aGlzLmJhbGwuYm9keS52ZWxvY2l0eS5teSA9IDA7XHJcblx0XHR0aGlzLmJhbGwuYWxwaGEgPSAxO1xyXG5cdFx0dGhpcy5iYWxsLnNjYWxlLnggPSAwLjE3NTtcclxuXHRcdHRoaXMuYmFsbC5zY2FsZS55ID0gMC4xNzU7XHJcblxyXG5cdFx0dGhpcy5iYWxsRW1pdHRlci5zZXRYU3BlZWQoLTEgKiBHbG9iYWxzLlBhcnRpY2xlU3BlZWQsIEdsb2JhbHMuUGFydGljbGVTcGVlZCk7XHJcblx0XHR0aGlzLmJhbGxFbWl0dGVyLnNldFlTcGVlZCgtMSAqIEdsb2JhbHMuUGFydGljbGVTcGVlZCwgR2xvYmFscy5QYXJ0aWNsZVNwZWVkKTtcclxuXHJcblx0XHR0aGlzLmVuZENpcmNsZS5kZXN0cm95KCk7XHJcblx0XHR0aGlzLmVuZFRleHQuZGVzdHJveSgpO1xyXG5cclxuXHRcdHRoaXMucmVjb2xvdXJCYWxsKCk7XHJcblxyXG5cdH1cclxuXHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdC8vIGlmIChHbG9iYWxzLkRlYnVnUmVuZGVyKSB7XHJcblx0XHQvLyBcdHRoaXMucGxheWVycy5mb3JFYWNoKHAgPT4ge1xyXG5cdFx0Ly8gXHRcdHRoaXMuZ2FtZS5kZWJ1Zy5ib2R5KHAuc3ByaXRlLCBwLmNvbG9yKTtcclxuXHRcdC8vIFx0fSk7XHJcblxyXG5cdFx0Ly8gXHR0aGlzLndpcmVDb2xsaXNpb25Hcm91cC5jaGlsZHJlbi5mb3JFYWNoKGMgPT4ge1xyXG5cdFx0Ly8gXHRcdHRoaXMuZ2FtZS5kZWJ1Zy5ib2R5KDxhbnk+YywgKDxhbnk+YykuY29sb3IpO1xyXG5cdFx0Ly8gXHR9KVxyXG5cdFx0Ly8gfVxyXG5cdH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2dhbWVTdGF0ZS50cyIsImltcG9ydCAqIGFzIEdsb2JhbHMgZnJvbSAnLi9nbG9iYWxzJztcclxuXHJcblxyXG5jb25zdCBzdGFydFBvc2VzID0gW1xyXG5cdFsxMDAsIDEwMF0sXHJcblx0W0dsb2JhbHMuU2NyZWVuV2lkdGggLSAxMDAsIDEwMF0sXHJcblx0W0dsb2JhbHMuU2NyZWVuV2lkdGggLSAxMDAsIEdsb2JhbHMuU2NyZWVuSGVpZ2h0IC0gMTAwXSxcclxuXHRbMTAwLCBHbG9iYWxzLlNjcmVlbkhlaWdodCAtIDEwMF1cclxuXVxyXG5cclxuY29uc3QgY29sb3JzID0gW1xyXG5cdCcjZmYwMDAwJyxcclxuXHQnIzAwZmYwMCcsXHJcblx0JyMwMDAwZmYnLFxyXG5cdCcjZmZmZmZmJ1xyXG5dO1xyXG5cclxuZW51bSBQb3dlclVwIHtcclxuXHQvL05vbmUsXHJcblx0U3BlZWR5LFxyXG5cdE1hY2hpbmVHdW4sXHJcblx0U3ByZWFkU2hvdCxcclxuXHJcblxyXG5cdENvdW50XHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIERpcmVjdGlvbiB7XHJcblx0TGVmdCxcclxuXHRSaWdodCxcclxuXHRVcCxcclxuXHREb3duXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBFbmVyZ3kge1xyXG5cdHN0cmVuZ3RoID0gMDsgXHJcblx0dHJhdmVsbGluZzogRGlyZWN0aW9uO1xyXG5cclxuXHRjb25zdHJ1Y3RvcihwdWJsaWMgdHJhdmVsOiBEaXJlY3Rpb24sIHB1YmxpYyBzdHJlbmd0aHM6IG51bWJlcikge1xyXG5cdFx0dGhpcy50cmF2ZWxsaW5nID0gdHJhdmVsO1xyXG5cdFx0dGhpcy5zdHJlbmd0aCA9IHN0cmVuZ3RocztcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXYXZlcG9pbnQge1xyXG5cdGVuZXJnaWVzID0gbmV3IEFycmF5PEVuZXJneT4oKTtcclxuXHRuZXdFbmVyZ2llcyA9IG5ldyBBcnJheTxFbmVyZ3k+KCk7XHJcblx0ZW5lcmd5ID0gMDtcclxuXHJcblx0ZW5lcmd5VG9BZGQ6IEVuZXJneTtcclxuXHJcblx0Y29sb3I6IGFueTtcclxuXHQvLyBzcHJpdGU6IFBoYXNlci5HcmFwaGljcztcclxuXHRzcHJpdGU6IFBoYXNlci5TcHJpdGU7XHJcblx0bWFzazogUGhhc2VyLkdyYXBoaWNzO1xyXG5cdGJvZHk6IFBoYXNlci5QaHlzaWNzLlAyLkJvZHk7XHJcblxyXG5cdGlkZWFsWDogbnVtYmVyO1xyXG5cclxuXHRpbmRleDogbnVtYmVyO1xyXG5cclxuXHRsYXN0U2hvdDogbnVtYmVyO1xyXG5cclxuXHRwb3dlclVwOiBQb3dlclVwO1xyXG5cclxuXHRpc0RlYWQgPSBmYWxzZTtcclxuXHJcblx0cG9seWdvbk9wdGlvbnMgPSB7XHJcblx0XHRza2lwU2ltcGxlQ2hlY2s6IHRydWUsXHJcblx0fTtcclxuXHJcblx0Y29uc3RydWN0b3IocHVibGljIHdpcmVDb2xsaXNpb25Hcm91cDogUGhhc2VyLlBoeXNpY3MuUDIuQ29sbGlzaW9uR3JvdXAsIHB1YmxpYyBiYWxsQ29sbGlzaW9uR3JvdXA6IFBoYXNlci5QaHlzaWNzLlAyLkNvbGxpc2lvbkdyb3VwLCBwdWJsaWMgc3RhdGU6IFBoYXNlci5TdGF0ZSwgcHVibGljIGk6IG51bWJlcikge1xyXG5cclxuXHRcdHRoaXMuaW5kZXggPSBpO1xyXG5cclxuXHRcdGxldCB5TWlkcG9pbnQgPSBHbG9iYWxzLldpcmVTdGFydEhlaWdodDtcclxuXHRcdGxldCBkaXZXaWR0aCA9IEdsb2JhbHMuU2NyZWVuV2lkdGgvR2xvYmFscy5OdW1iZXJPZlBhcnRpY2xlcztcclxuXHRcdGxldCB4TWlkcG9pbnQgPSBkaXZXaWR0aCAqIHRoaXMuaW5kZXggKyBkaXZXaWR0aC8yO1xyXG5cclxuXHRcdHRoaXMuaWRlYWxYID0geE1pZHBvaW50O1xyXG5cclxuXHRcdHRoaXMuc3ByaXRlID0gc3RhdGUuYWRkLnNwcml0ZSh4TWlkcG9pbnQsIHlNaWRwb2ludCwgJ3dhdmVmb3JtJyk7XHJcblxyXG5cdFx0c3RhdGUucGh5c2ljcy5wMi5lbmFibGUodGhpcy5zcHJpdGUsIEdsb2JhbHMuRGVidWdSZW5kZXIpO1xyXG5cdFx0dGhpcy5ib2R5ID0gPFBoYXNlci5QaHlzaWNzLlAyLkJvZHk+dGhpcy5zcHJpdGUuYm9keTtcclxuXHRcdHRoaXMuYm9keS5zZXRDaXJjbGUoR2xvYmFscy5QYXJ0aWNsZVJhZGl1cywgMCwgMCk7XHJcblx0XHQvLyB0aGlzLmJvZHkuc2V0UmVjdGFuZ2xlKEdsb2JhbHMuUGFydGljbGVSYWRpdXMqMiwgMjAsIEdsb2JhbHMuUGFydGljbGVSYWRpdXMsIDEwKTtcclxuXHRcdHRoaXMuYm9keS5hZGRQb2x5Z29uKHRoaXMucG9seWdvbk9wdGlvbnMsIFsgWzAsIDBdLCBbR2xvYmFscy5QYXJ0aWNsZVJhZGl1cyoyLCAwXSwgW0dsb2JhbHMuUGFydGljbGVSYWRpdXMqMiwgR2xvYmFscy5QYXJ0aWNsZVJhZGl1cyoyXSwgWzAsIEdsb2JhbHMuUGFydGljbGVSYWRpdXMqMl0gIF0pO1xyXG5cdFx0dGhpcy5ib2R5LmNvbGxpZGVXb3JsZEJvdW5kcyA9IHRydWU7XHJcblx0XHR0aGlzLmJvZHkuZGF0YS5ncmF2aXR5U2NhbGUgPSAwO1xyXG5cdFx0dGhpcy5ib2R5Lm1hc3MgPSBHbG9iYWxzLldhdmVNYXNzO1xyXG5cdFx0dGhpcy5ib2R5LmFuZ3VsYXJWZWxvY2l0eSA9IDA7XHJcblx0XHR0aGlzLmJvZHkuc3RhdGljID0gdHJ1ZTtcclxuXHJcblx0XHR0aGlzLmJvZHkuc2V0Q29sbGlzaW9uR3JvdXAod2lyZUNvbGxpc2lvbkdyb3VwKTtcclxuXHRcdHRoaXMuYm9keS5jb2xsaWRlcyhbc3RhdGUucGh5c2ljcy5wMi5ib3VuZHNDb2xsaXNpb25Hcm91cCwgdGhpcy5iYWxsQ29sbGlzaW9uR3JvdXBdICk7XHJcblx0fVxyXG5cclxuXHR1cGRhdGUocGxheWVyRW5lcmd5OiBBcnJheTxudW1iZXI+KSB7XHJcblx0XHR0aGlzLmVuZXJnaWVzID0gdGhpcy5uZXdFbmVyZ2llcztcclxuXHJcblx0XHR0aGlzLm5ld0VuZXJnaWVzID0gW107XHJcblx0XHRsZXQgcGxheWVySW5kZXggPSAodGhpcy5pbmRleCA9PSAwID8gMCA6IDEpO1xyXG5cclxuXHRcdGxldCBzcGVlZCA9IEdsb2JhbHMuUGxheWVyU3BlZWQ7XHJcblx0XHRmb3IgKGxldCBhbkVuZXJneSBvZiB0aGlzLmVuZXJnaWVzKSB7XHJcblx0XHRcdHRoaXMuZW5lcmd5ICs9IGFuRW5lcmd5LnN0cmVuZ3RoO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLmVuZXJneVRvQWRkICE9IG51bGwpIHtcclxuXHRcdFx0cGxheWVyRW5lcmd5W3BsYXllckluZGV4XSAtPSBHbG9iYWxzLlBsYXllckVuZXJneVVzZVJhdGU7XHRcdFx0XHJcblx0XHR9IFxyXG5cclxuXHRcdGlmICh0aGlzLmluZGV4ID09IDAgJiYgcGxheWVySW5kZXggPT0gMCB8fCB0aGlzLmluZGV4ID09IChHbG9iYWxzLk51bWJlck9mUGFydGljbGVzIC0gMSkgJiYgcGxheWVySW5kZXggPT0gMSkge1xyXG5cdFx0XHRpZiAocGxheWVyRW5lcmd5W3BsYXllckluZGV4XSA8IDApIHtcclxuXHRcdFx0XHRwbGF5ZXJFbmVyZ3lbcGxheWVySW5kZXhdID0gMDtcclxuXHRcdFx0fSBlbHNlIGlmIChwbGF5ZXJFbmVyZ3lbcGxheWVySW5kZXhdIDwgMjApIHtcclxuXHRcdFx0XHRwbGF5ZXJFbmVyZ3lbcGxheWVySW5kZXhdICs9IEdsb2JhbHMuUGxheWVyRW5lcmd5QWRkUmF0ZTtcclxuXHRcdFx0fSBcclxuXHRcdH1cclxuXHJcblx0XHRcdFxyXG5cdFx0dGhpcy5ib2R5LmFwcGx5Rm9yY2UoIFswLCB0aGlzLmVuZXJneSAqIEdsb2JhbHMuV2F2ZVN0cmVuZ3RoTW9kICogR2xvYmFscy5XYXZlTWFzc10sIDAsIDAgKTtcclxuXHJcblx0XHQvL1Rlc3QgZm9yIHN0YXRpYyBwaHlzaWNzXHJcblx0XHR0aGlzLmJvZHkudmVsb2NpdHkueSA9IHRoaXMuZW5lcmd5ICogR2xvYmFscy5XYXZlU3RyZW5ndGhNb2QgKiAtMSAqIDAuMztcclxuXHJcblx0XHR0aGlzLmVuZXJneSAqPSBHbG9iYWxzLkVuZXJneURlY2F5O1xyXG5cclxuXHRcdGxldCB5TWlkcG9pbnQgPSBHbG9iYWxzLldpcmVTdGFydEhlaWdodDtcclxuXHJcblx0XHR0aGlzLmJvZHkuZGF0YS52ZWxvY2l0eVswXSA9IDA7XHJcblxyXG5cdFx0bGV0IGxvd0N1dG9mZiA9IDEwO1xyXG5cdFx0aWYoIE1hdGguYWJzKHRoaXMuYm9keS55IC0geU1pZHBvaW50KSA+IGxvd0N1dG9mZikge1xyXG5cdFx0XHQvLyB0aGlzLmJvZHkudmVsb2NpdHkueSA9ICh0aGlzLmJvZHkudmVsb2NpdHkueSAtICh0aGlzLmJvZHkueSAtIHlNaWRwb2ludCkgKiAxMi41KTtcdC8vRHluYW1pY1xyXG5cdFx0XHQvLyB0aGlzLmJvZHkuYXBwbHlEYW1waW5nKEdsb2JhbHMuV2F2ZURhbXBTbG93KTtcdFx0Ly9EeW5hbWljXHJcblx0XHRcdHRoaXMuYm9keS52ZWxvY2l0eS55ID0gKHRoaXMuYm9keS52ZWxvY2l0eS55IC0gKHRoaXMuYm9keS55IC0geU1pZHBvaW50KSAqIDgpO1x0Ly9TdGF0aWNcclxuXHRcdH0gXHJcblx0XHRpZiggTWF0aC5hYnModGhpcy5ib2R5LnkgLSB5TWlkcG9pbnQpID4gNSAmJiBNYXRoLmFicyh0aGlzLmJvZHkueSAtIHlNaWRwb2ludCkgPCBsb3dDdXRvZmYpIHtcclxuXHRcdFx0Ly8gdGhpcy5ib2R5LnZlbG9jaXR5LnkgPSAodGhpcy5ib2R5LnZlbG9jaXR5LnkgLSAodGhpcy5ib2R5LnkgLSB5TWlkcG9pbnQpICogMjApO1x0Ly9EeW5hbWljXHJcblx0XHRcdC8vIHRoaXMuYm9keS5hcHBseURhbXBpbmcoR2xvYmFscy5XYXZlRGFtcFNldHRsZSk7XHRcdC8vRHluYW1pY1xyXG5cdFx0XHR0aGlzLmJvZHkudmVsb2NpdHkueSA9ICh0aGlzLmJvZHkudmVsb2NpdHkueSAtICh0aGlzLmJvZHkueSAtIHlNaWRwb2ludCkgKiAyMCk7XHQvL1N0YXRpY1xyXG5cdFx0fSBcclxuXHR9XHJcblx0XHJcblx0c2V0RGlyKGRpcmVjdGlvbjogRGlyZWN0aW9uLCBwbGF5ZXJFbmVyZ3k6IEFycmF5PG51bWJlcj4pIHtcclxuXHRcdGxldCBzdHJlbmd0aCA9IEdsb2JhbHMuSW5pdGlhbFN0cmVuZ3RoOyBcclxuXHJcblx0XHRsZXQgcGxheWVySW5kZXggPSAodGhpcy5pbmRleCA9PSAwID8gMCA6IDEpO1xyXG5cclxuXHRcdGlmIChkaXJlY3Rpb24gPT0gRGlyZWN0aW9uLkRvd24pIHtcclxuXHRcdFx0c3RyZW5ndGggKj0gLTE7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IHByb3BvZ2F0ZSA9IERpcmVjdGlvbi5MZWZ0O1xyXG5cdFx0aWYgKHRoaXMuaW5kZXggPT0gMCkge1xyXG5cdFx0XHRwcm9wb2dhdGUgPSBEaXJlY3Rpb24uUmlnaHQ7XHJcblx0XHR9XHJcblx0XHR0aGlzLmVuZXJneVRvQWRkID0gKG5ldyBFbmVyZ3koIHByb3BvZ2F0ZSwgc3RyZW5ndGggKSk7XHJcblx0fVxyXG5cclxuXHRyZXNldERpcigpIHtcclxuXHRcdHRoaXMuZW5lcmd5VG9BZGQgPSBudWxsO1xyXG5cdH1cclxuXHJcblx0YWRkRW5lcmd5KG1vcmVFbmVyZ3k6IEVuZXJneSkge1xyXG5cdFx0dGhpcy5uZXdFbmVyZ2llcy5wdXNoKG1vcmVFbmVyZ3kpO1xyXG5cdH1cclxuXHJcblx0YWRkRXh0cmFFbmVyZ3koKSB7XHJcblx0XHRpZiAodGhpcy5lbmVyZ3lUb0FkZCAhPSBudWxsKSB7XHJcblx0XHRcdHRoaXMubmV3RW5lcmdpZXMucHVzaCh0aGlzLmVuZXJneVRvQWRkKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi93YXZlcG9pbnRzLnRzIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiYmZkN2YyZmI5NDg4MzI5ZTlmM2U4Y2ExOTkzMTE4Y2EucG5nXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hc3NldHMvaW1hZ2VzL211c2hyb29tMi5wbmdcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIjk4MWUyZmZmMGI2MzA1MDJjZDA3NTYwYmZjMWU3N2RhLnBuZ1wiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYXNzZXRzL2ltYWdlcy9hdG9tLnBuZ1xuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiZjJjZTFhZGE5ODEyYWM2Y2ZjNTNiYWY1OTVjNjI2ZmUucG5nXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hc3NldHMvaW1hZ2VzL2JhY2tncm91bmQucG5nXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJmNWY2ZWFkMTlkYWI4YWEwZTI3ZWVjODI0ZDY0NDAxZS5wbmdcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2Fzc2V0cy9pbWFnZXMvd2F2ZWZvcm0ucG5nXG4vLyBtb2R1bGUgaWQgPSAxNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCI3ODEyYTE2YzMxMzIwNjNhNzhlMTYwNDNmZmJkYjQwZC5wbmdcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2Fzc2V0cy9pbWFnZXMvcGFydGljbGUucG5nXG4vLyBtb2R1bGUgaWQgPSAxN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCIzMThhZjA2YzBhNzE0ZTgwY2NkOTQ1NjYxYWJiMDFlYS5wbmdcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2Fzc2V0cy9pbWFnZXMvcGFydGljbGUyLnBuZ1xuLy8gbW9kdWxlIGlkID0gMThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiN2IxNGRiODUxMTJiNzE0YWI3YTE1NWQ2NDEyZGE1MjEucG5nXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hc3NldHMvaW1hZ2VzL3BhcnRpY2xlQmx1ZUJpZy5wbmdcbi8vIG1vZHVsZSBpZCA9IDE5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIjQ4NjJiNzg4ZWYyNWM0M2U5NGM1Y2VlNTg0NjFiOTA5LnBuZ1wiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYXNzZXRzL2ltYWdlcy9wYXJ0aWNsZVJlZEJpZy5wbmdcbi8vIG1vZHVsZSBpZCA9IDIwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCAqIGFzIFBoYXNlciBmcm9tICdwaGFzZXInO1xyXG5pbXBvcnQgKiBhcyBXZWJGb250IGZyb20gJ3dlYmZvbnRsb2FkZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9hZGluZ1N0YXRlIGV4dGVuZHMgUGhhc2VyLlN0YXRlIHtcclxuXHRpbml0KCkge1xyXG5cdFx0Ly9UT0RPP1xyXG5cdH1cclxuXHJcblx0cHJlbG9hZCgpIHtcclxuXHRcdFdlYkZvbnQubG9hZCh7XHJcblx0XHRcdGdvb2dsZToge1xyXG5cdFx0XHRcdGZhbWlsaWVzOiBbJ0JhbmdlcnMnXVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRhY3RpdmU6ICgpID0+IHRoaXMuZm9udHNMb2FkZWQoKVxyXG5cdFx0fSlcclxuXHJcblx0XHRsZXQgdGV4dCA9IHRoaXMuYWRkLnRleHQodGhpcy53b3JsZC5jZW50ZXJYLCB0aGlzLndvcmxkLmNlbnRlclksICdsb2FkaW5nIGZvbnRzJywgeyBmb250OiAnMTZweCBBcmlhbCcsIGZpbGw6ICcjZGRkZGRkJywgYWxpZ246ICdjZW50ZXInIH0pO1xyXG5cdFx0dGV4dC5hbmNob3Iuc2V0VG8oMC41LCAwLjUpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBmb250c0xvYWRlZCgpIHtcclxuXHRcdHRoaXMuc3RhdGUuc3RhcnQoJ2dhbWUnKTtcclxuXHR9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9sb2FkaW5nU3RhdGUudHMiXSwic291cmNlUm9vdCI6IiJ9