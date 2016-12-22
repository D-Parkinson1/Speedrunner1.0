//Enemy Object
function setFlyEnemy(game,enemy) {
	//Enable physics on the enemy
	game.physics.enable(enemy, Phaser.Physics.ARCADE);
	//Apply properties to enemy
	enemy.body.collideWorldBounds = true;
	enemy.body.allowGravity = false;
	enemy.body.setSize(18,10,0,10);
	enemy.animations.add('fly', flyFrames, 30, true);
	enemy.animations.play('fly');
	var prevY = enemy.y;
	
	//direction is 1 or -1, up or down
	//These properties are defined in the tilemap
	enemy.body.velocity.y = enemy.direction * enemy.speed;
	//Error handling enemy properties from tilemap
	if(Math.abs(enemy.direction) != 1) {
		enemy.direction = 1;
	}
	
	enemy.update = function() {
		//Changing enemy direction using Tiled from: https://gamedevacademy.org/platformer-tutorial-with-phaser-and-tiled/
		//Modified slightly to account for rounding
		//Some enemies spaws with long decimal y values, even when not dfened that way in the tilemap
		if(Math.round(Math.abs(prevY-enemy.y)) == (enemy.Tile_dist*tileSize)) {
			enemy.changeDirection();
		}
	}
	enemy.changeDirection = function() {
		enemy.body.velocity.y *= -1;
		prevY = enemy.y;
	}
};

function setEnemy(game, enemy) {
	game.physics.enable(enemy, Phaser.Physics.ARCADE);
	
	enemy.anchor.setTo(0.5);
	enemy.body.collideWorldBounds = true;
	enemy.animations.add('move');
	enemy.animations.play('move', 10, true);
	enemy.scale.setTo(-enemy.direction,1);
	
	var prevX = enemy.x;
	
	enemy.body.velocity.x = enemy.direction * enemy.speed;
	
	enemy.update = function() {
		/*
		if (Math.round(Math.abs(enemy.x - enemy.prevX)) >= (enemy.Tile_dist*tileSize)) {
        enemy.changeDirection();
    }
		*/
		
		if(enemy.body.blocked.right) {
			enemy.changeDirection();
		}

		if(enemy.body.blocked.down && !enemy.canMove()) {
			enemy.changeDirection();
		}
	}
	
	enemy.changeDirection = function() {
		enemy.scale.setTo(-enemy.scale.x, 1);
		enemy.body.velocity.x *= -1;
		if(enemy.body.velocity.x == 0) {
			enemy.body.velocity.x = -enemy.speed;
		}
		prevX = enemy.x;
	}

	enemy.canMove = function() {
		//Checking tiles in front from tutorial: https://gamedevacademy.org/platformer-tutorial-with-phaser-and-tiled-part-2/
		var direction, checkPos, map, nextTile;
		//If x velocity is less than zero direction is left, else right
		direction = (enemy.body.velocity.x <0) ? -1:1;
		//Check if there is a ground tile in front of the enemy
		//Top of ground tile will be a tilewidth in front of them and a pixel down
		checkPos = new Phaser.Point(enemy.x + (direction*tileSize), enemy.bottom + 1);
		
		map = game.map;
		nextTile = map.getTileWorldXY(checkPos.x, checkPos.y, map.tileWidth, map.tileHeight, groundLayer);
		
		if(checkPos.x == game.world.width-1) {
			enemy.changeDirection();
		}
		
		return nextTile !== null;	
	}
}

function movingPlatform(game, platform) {
	game.physics.enable(platform, Phaser.Physics.ARCADE);
	platform.body.allowGravity = false;
	platform.body.immovable = true;
	platform.animations.add('move');
	platform.animations.play('move', 10, true);
	
	var tween = game.add.tween(platform.position);
	//Use custom properties set in the tilemap to move the platform
	//Convert distance to travel to pixels if not defined give a default value of 4 tiles long (128 pixels)
	var distance = platform.Tile_dist*tileSize;
	var time = platform.moveTime;
	if(platform.Direction == "Up") {
		tween.to({y: platform.position.y - (distance)}, time, Phaser.Easing.Linear.None, true, 0, -1, true);
		
	}
	else if(platform.Direction == "Down") {
		tween.to({y: platform.position.y + (distance)}, time, Phaser.Easing.Linear.None, true, 0, -1, true);	
	}
	else if(platform.Direction == "Left") {
		tween.to({x: platform.position.x - (distance)}, time, Phaser.Easing.Linear.None, true, 0, -1, true);	
	}
	else if(platform.Direction == "Right") {
		tween.to({x: platform.position.x + (distance)}, time, Phaser.Easing.Linear.None, true, 0, -1, true);	
	}
}

function setSpike(game, spike) {
	spike.body.allowGravity = false;
	spike.body.immovable = true;
	
	spike.rotation = (Math.PI)*spike.angleRotation;
	
	//Repositions collision hitboxes and sprites depending on rotation
	switch(spike.rotation) {
		case 0:
			spike.body.setSize(32,31);
			//Spikes only have collision from the top
			spike.body.checkCollision.right = false;
			spike.body.checkCollision.left = false;
			spike.body.checkCollision.down = false;
			spike.body.checkCollision.up = true;
		break;
		
		case (Math.PI)/2:
			spike.body.setSize(31,32,0,-32);
			spike.x += tileSize;
			spike.y += tileSize;
			spike.scale.setTo(-1,1);
				spike.body.checkCollision.right = true;
				spike.body.checkCollision.down = true;
				spike.body.checkCollision.left = false;
				spike.body.checkCollision.up = true;
		break;
		case (Math.PI):
		spike.body.setSize(32,31,-32,-31);
			spike.y += tileSize;
			spike.scale.setTo(-1,1);
				spike.body.checkCollision.right = true;
				spike.body.checkCollision.left = true;
				spike.body.checkCollision.down = true;
				spike.body.checkCollision.up = false;
		break;
		case (Math.PI) * 1.5:
			spike.body.setSize(31,32,0,-32);
			spike.y += tileSize;
				spike.body.checkCollision.left = true;
				spike.body.checkCollision.down = true;
				spike.body.checkCollision.up = true;
				spike.body.checkCollision.right = false;
		break;				
		default:
			spike.body.setSize(32,31);
			//Spikes only have collision from the top
			spike.body.checkCollision.right = false;
			spike.body.checkCollision.left = false;
			spike.body.checkCollision.down = false;
			spike.body.checkCollision.up = true;
		break;
	}
	
	spike.collision = function() {
			if(spike.body.touching.up||spike.body.touching.down||spike.body.touching.left||spike.body.touching.right) {
				Game.Play.prototype.restartLevel();
			}
		
	}
}

Game.Play = function(game) {
	this.map = null;//A reference to the tilemap
	this.allCoins = null;// Flag to check if all coins are collected
	this.allKilled = null;// Flag to check if all enemies are killed
	this.counter = 0;//timer
	this.sky = null;//sky background
	this.clouds = null;//scrolling clouds
	this.gravity = 1400;//Gravity
};
//____VARIABLES____//
	//Width and height of a single tile in tilemap
	var tileSize = 32;
	
	//Variables with frames for animations
	var spinFrames = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,7,6,5,4,3,2,1,0];
	var walkFrames = [0,1,2,3,4,5,6,7,8,9,10,11,12,13];
	var flyFrames = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,12,11,10,9,8,7,6,5,4,3,2,1];
	
	var groundLayer;//A reference to the groundLayer in the tilemap
	var player;//A reference to the player
	var playerSpeed = 200;//How fast the player moves in pixels/second
	var jumpSpeed = 400;//How fast the player jumps in pixels/second
	var jumpTimer = 0; //A timer 
	var jumping; // Flag if the player is in the air
	var numJumps; //Number of jumps the player can make (i.e. doublejump)
	var touchingGround;//Is the player on the ground
	var enemy1; // A reference to the enemy
	var respawn; // A reference to the spawnpoint
	var coinGroup; // reference to the group containing all the coins
	var platforms;//A group to hold all moving platforms
	var enemyCount = 0;//Number of enemies alive in stage
	var coinCount = 0;//Number of coins in stage
	var star; // Variable to hold the star sprite
	var lvlTimer;//The level timer that acts as a score system
	var timeText;//The text to display the timer
	
Game.Play.prototype = {
	
		create: function(game) {
			//Reference to the game object
			self = this;
			
			//Initialize coin and enemy counts
			coinCount = 0;
			enemyCount = 0;
			
			levelMap = Game.Levels.levels[Game.Levels.currentLevel].map;
			//Initialise Tilemap
			this.map = this.add.tilemap(levelMap);
			
			//Background image
			this.sky = this.add.tileSprite(0,0,this.map.width*tileSize,this.map.height*tileSize, 'Sky');
			//Fixes issues when tiling background horizontally
			this.sky.scale.setTo(this.map.width*tileSize/800, this.map.height.tileSize/800);
			//Fixes issues with tiling background vertically
			this.sky.fixedToCamera = true;
			//Clouds that scroll
			this.clouds = this.add.tileSprite(0,0,this.map.width*tileSize,this.map.height*tileSize,'Clouds');
			this.clouds.autoScroll(-10,0);
			
			//Gravity
			this.physics.arcade.gravity.y = this.gravity;
			//Fix an issue with collision when running at a slow framrate
			this.physics.arcade.TILE_BIAS = 32;
			//Make the tweens smoother at lower frame rates
			this.tweens.frameBased = true;
			
			//Add the tileset image
			this.map.addTilesetImage('GroundTiles');
			//Create the layer
			groundLayer = this.map.createLayer('GroundLayer');
			
			//Resize the world to match the layer
			groundLayer.resizeWorld();
			
			//GROUPS
			//Must be after tilemap or they will be drawn behind it.
			respawn = this.add.group();
			exit = this.add.group();
			exit.enableBody = true;
			coinGroup = this.add.group();
			coinGroup.enableBody = true;
			flyingEnemy = this.add.group();
			flyingEnemy.enableBody = true;
			platforms = this.add.physicsGroup();
			platforms.enableBody = true;
			spikes = this.add.group();
			spikes.enableBody = true;
			enemies = this.add.group();
			enemies.enableBody = true;
			
			//Set collision on the ground tiles
			this.map.setCollisionBetween(0,22, true, groundLayer);

			//Creating spikes
			this.map.createFromObjects('Objects', 23, 'spike',0, true, false, spikes);
			//Apply properties to spikes
			spikes.forEach(function(spike) {
				setSpike(this,spike);
			}, this);
			
			//Debugging purposes
			//this.spike = spikes.getFirstAlive();
			
			//Creating a spawn point
			this.map.createFromObjects('Objects', 25, '',0,true,false, respawn);
			//Create Exit
			this.map.createFromObjects('Objects', 28, 'door', 0, true, false, exit);
			//Apply properties to the exit
			exit.forEach(function(exit) {
				exit.body.allowGravity = false;
				exit.body.immovable = true;
			},this);
			
			//Creating coins
			this.map.createFromObjects('Objects', 24, 'coin',0,true,false, coinGroup);
			//Apply properties to all coins
			coinGroup.forEach(function(coin){
				//Make sure the coins don't fall
				coin.body.allowGravity = false;	
				//Adding animations to all coins.
				coin.animations.add('spin', spinFrames, 10, true);
				coin.animations.play('spin');
				coinCount++;
			},this);
			
			
			//Creating flying enemies
			this.map.createFromObjects('Objects', 26, 'flyEnemy',0, true, false, flyingEnemy);
			//Set up the flying enemies
			flyingEnemy.forEach(function(enemy) {
				setFlyEnemy(this, enemy);
				enemyCount++;
			},this);
			
			//Debugging purposes
			//this.enemy = flyingEnemy.getFirstAlive();
			
			//Create ground enemies
			this.map.createFromObjects('Objects', 27, 'enemy', 0, true, false, enemies);
			//Set up groundEnemies
			enemies.forEach(function(enemy) {
				setEnemy(this, enemy);
				enemyCount++;				
			}, this);
			
			//Debugging purposes
			//this.enemy = enemies.getFirstAlive();
			
			//Moving platforms
			this.map.createFromObjects('Objects', 1, 'movePlatform',0, true, false, platforms);
			//Set up moving platforms
			platforms.forEach(function(platform) {
				movingPlatform(this, platform);
			},this);
			
			
			timeText = this.add.text(this.camera.width/2,0, "0", {font: "18px Stalinist One"});
			timeText.anchor.setTo(0.5, 0);
			timeText.fixedToCamera = true;
			
			this.counter = 0;
			lvlTimer = this.time.create(false);
			lvlTimer.loop(Phaser.Timer.SECOND, function(){this.counter++;}, this);
			lvlTimer.start();			
			
			//Set up the Player
			player = this.add.sprite(0,0,'player');
			this.physics.enable(player);
			//Add a walking animation
			player.animations.add('walk', walkFrames, 8, true);
			//Camera follows the player
			this.camera.follow(player);
			//Player collides with world boundaries
			player.body.collideWorldBounds = true;
			//Resizing player hitbox
			player.body.setSize(12,32);
			//Spawn the player
			this.spawn();
			
			this.allCoins = new Phaser.Signal();
			this.allKilled = new Phaser.Signal();
			this.allCoins.addOnce(this.getStar, this);
			this.allKilled.addOnce(this.getStar, this);

			//Restart Key
			Game.controls.Restart.onDown.add(this.restartLevel,this);
			
			//The background of the pause menu
			//It must be added in the create function in order for it to fix to the camera properly
			this.pauseMenu = this.game.add.image(this.camera.width/2, this.camera.height/2, 'pause')
			this.pauseMenu.anchor.setTo(0.5);
			this.pauseMenu.fixedToCamera = true;
			this.pauseMenu.visible = false;
				
			//Pause key
			this.pauseKey = Game.controls.Pause.onDown.addOnce(this.pauseGame,this);
			this.game.input.onDown.add(this.unPause, this);
			
			//Key capture - keys don't effect the browser i.e. spacebar won't scroll the page
			this.input.keyboard.addKeyCapture([Game.controls.Jump, Game.controls.Left, Game.controls.Right, Game.controls.Run]);
		},
		
		update: function(game) {
			//Show the timer
			timeText.setText(this.counter);
			
			//collisions
			this.physics.arcade.collide(player, groundLayer);
			this.physics.arcade.collide(spikes, groundLayer);			
			this.physics.arcade.collide(player, spikes, this.collideSpike, null, this);
			this.physics.arcade.collide(coinGroup, groundLayer);
			this.physics.arcade.collide(enemies, groundLayer);
			this.physics.arcade.collide(flyingEnemy, groundLayer);
			this.physics.arcade.collide(player, platforms, this.lockPlayer, null, this);
			this.physics.arcade.overlap(player, enemies, this.enemyCollide);
			this.physics.arcade.overlap(player, flyingEnemy, this.enemyCollide);
			this.physics.arcade.overlap(player, coinGroup, this.getCoin);
			this.physics.arcade.overlap(player, exit, this.endLevel);
			
			//Check if a player has earned a star
			this.checkStars();
			
			//Check if player is pressing the controls
			this.playerControls();
			
			//Is the player on the ground?
			touchingDown = player.body.onFloor();// || player.body.touching.down;
			
			//Functions called when jumpkey is pressed
			Game.controls.Jump.onDown.add(this.jumpkeyDown);
			Game.controls.Jump.onUp.add(this.jumpkeyUp);
			
			//If the player is locked to a platform or on the ground, they are not jumping so they have two jumps
			if(touchingDown || player.locked) {
				jumping = false;
				numJumps = 2;
			}

		},
		
		checkStars: function() {
			//Check if the player collected all coins
			if(coinCount == 0) {
				this.allCoins.dispatch(1,0);
			}
			//check if the player killed all enemies
			if(enemyCount == 0) {
				this.allKilled.dispatch(0,1);
			}
		},
		
		playerControls: function() {
			
			if(Game.controls.Right.isDown) {
				
				if(player.body.velocity.y == 0) {
					player.animations.play('walk');
				}
				//Make the player face right
				player.scale.setTo(1,1);
				//If run button is held, move faster
				if(Game.controls.Run.isDown) {
					player.body.velocity.x = playerSpeed*2;
				}
				else {
					player.body.velocity.x = playerSpeed;
				}
			}			
			else if(Game.controls.Left.isDown) {
				if(player.body.velocity.y == 0) {
					player.animations.play('walk');
				}
				//Make the player face left
				player.scale.setTo(-1,1);
				if(Game.controls.Run.isDown) {
					player.body.velocity.x = -playerSpeed*2;
				}
				else {
					player.body.velocity.x = -playerSpeed;
				}
			}
			else {
				player.body.velocity.x = 0;
			}
			
			if(player.body.velocity.x == 0 && player.body.velocity.y == 0) {
				player.animations.stop();
				player.frame = 22;
			}
		},
		
		jumpkeyDown: function() {
			if(numJumps > 0) {
				//If player is at a running speed
				//Checking speed so they can't stand in one spot with run button down to jump higher
				if((Math.abs(player.body.velocity.x)) > playerSpeed) {
					player.body.velocity.y = -jumpSpeed * 1.25;
				}
				else {
					player.body.velocity.y = -jumpSpeed;
				}
				player.locked = false;
				jumping = true;
				player.animations.stop();
				player.frame = 9;
			}
		},
		
		jumpkeyUp: function() {
			if(jumping) {
				numJumps--;
				player.body.velocity.y *= 0.5;
				jumping = false;
			}
		},
		
		collideSpike: function(player, spike) {
			spike.collision(spike);
		},
		
		enemyCollide: function(player,enemy) {
			if(enemy.body.touching.up) {
				if(Game.controls.Jump.isDown) {
					player.body.velocity.y = -jumpSpeed;
				}
				else {
					player.body.velocity.y = -(jumpSpeed/4);
				}
				enemy.kill();
				enemyCount--;
			}
			else {
				Game.Play.prototype.restartLevel();
			}
		},
		
		lockPlayer: function(player, platform) {
			if(platform.body.touching.up) {
				if(!player.locked) {
					player.locked = true;
					player.lockedTo = platform;
					player.body.velocity.y = 0;
				}
			}
		},
		
		spawn: function() {
			respawn.forEach(function(spawnPoint){
				player.reset(spawnPoint.x, spawnPoint.y);	
			},this);
		},
		
		getCoin: function(player, coin) {
			coin.kill();
			coinCount--;
			if(Game.playSound) {
				//self.sound.play('coinSnd');
			}
		},
		
		getStar: function(coins,enemy) {
			if(coins) {
				var star = this.add.sprite(this.game.width-60,16 , 'star');
				star.anchor.setTo(0.5);
				star.fixedToCamera = true;
				Game.Levels.levels[Game.Levels.currentLevel].gotStar[0] = true;
				if(Game.playSound) {
					self.sound.play('starSnd');
				}
			}
			if(enemy) {
				var star2 = this.add.sprite(this.game.width-40,16 , 'star');
				star2.anchor.setTo(0.5);
				star2.fixedToCamera = true;
				Game.Levels.levels[Game.Levels.currentLevel].gotStar[1] = true;
				if(Game.playSound) {
					self.sound.play('starSnd');
				}
			}
		},
		
		restartLevel: function() {
			if(!Game.Levels.levelsComplete[Game.Levels.currentLevel]) {
				Game.Levels.levels[Game.Levels.currentLevel].gotStar[0] = false;
				Game.Levels.levels[Game.Levels.currentLevel].gotStar[1] = false;
				Game.Levels.levels[Game.Levels.currentLevel].gotStar[2] = false;
			}
			self.state.start('Game');
		},
		
		endLevel: function() {
			exit.forEach(function(exit){
				if(Game.controls.Jump.isDown) {
					//The level is complete
					Game.Levels.levelsComplete[Game.Levels.currentLevel] = true;
					
					//Save the player's best time
					Game.Levels.levels[Game.Levels.currentLevel].playerTime = Math.min(self.counter, Game.Levels.levels[Game.Levels.currentLevel].playerTime );
					//Was the level completed fast enough to earn a star?
					if(self.counter <= Game.Levels.levels[Game.Levels.currentLevel].starTime) {
						Game.Levels.levels[Game.Levels.currentLevel].gotStar[2] = true;
					}
					//If it was not the final level, increment the current level
					if(Game.Levels.currentLevel < Game.Levels.levels.length-1) {
						Game.Levels.currentLevel++;
						//Unlock the current level
						Game.Levels.levels[Game.Levels.currentLevel].locked = false;
						//go to level select screen
						self.state.start("LvlSelect");
					}
					else {
						//if it was the final level go to the menu
						self.state.start("MainMenu");
					}
				}
			},this);
		},
		
		pauseGame: function() {		
			
			this.game.paused = true;
			
				//if not paused display the pause menu
				//A group to hold elements of the pause menu
				this.pauseMenuGrp = this.game.add.group();
				
				//Make the background of the pause menu visible
				this.pauseMenu.visible = true;
				
				//Title of pause menu
				this.pauseTitle = this.add.text(this.pauseMenu.centerX, this.pauseMenu.top, 'Paused', {font: '22px Stalinist One'});
				this.pauseTitle.anchor.setTo(0.5,0);
			//	this.pauseTitle.fixedToCamera = true;
				
				//Width and height of the menu
				menuWidth = 300;
				menuHeight = 300 - this.pauseTitle.height*2;
				
				//Option 1
				this.option1 = this.add.text(this.pauseMenu.centerX, this.pauseMenu.top + menuHeight/3, 'Resume', {font: '18px Stalinist One'});
				this.option1.anchor.setTo(0.5);
				this.option1.fixedToCamera = true;
				
				//Option2
				this.option2 = this.add.text(this.pauseMenu.centerX, this.pauseMenu.top + 2*menuHeight/3, 'Level Select', {font: '18px Stalinist One'});
				this.option2.anchor.setTo(0.5);
				this.option2.fixedToCamera = true;
				
				//Option 3
				this.option3 = this.add.text(this.pauseMenu.centerX, this.pauseMenu.top + menuHeight, 'Menu', {font: '18px Stalinist One'});
				this.option3.anchor.setTo(0.5);
				this.option3.fixedToCamera = true;
				
				
				//Add the elements to the pausemenu group
				this.pauseMenuGrp.add(this.pauseTitle);
				this.pauseMenuGrp.add(this.option1);
				this.pauseMenuGrp.add(this.option2);
				this.pauseMenuGrp.add(this.option3);
				
		},
		
		
		////////////////////////
		//Pause menu code modified from: 
		//https://phaser.io/examples/v2/misc/pause-menu#gv
		/////////////////////////
		unPause: function(event) {
			if(this.game.paused) {
				//Diagonal corners of menu
				var leftX = this.game.width/2 - menuWidth/2;
				var rightX = this.game.width/2 + menuWidth/2;
				//Allowing for the pause title. The height of pause title is multiplied by two to allow for the text anchor
				var leftY = (this.game.height+this.pauseTitle.height*2)/2 - menuHeight/2;
				var rightY = this.game.height/2 + menuHeight/2;
				
				//Did the user click in the menu
				if(event.x > leftX && event.x < rightX && event.y > leftY && event.y < rightY) {
					//Array holding the menu choices
					var choiceArr = ['Resume','Levels','Menu'];
					
					//coordinates of the click within the menu (0,0) top corner
					var x = event.x - leftX;
					var y = event.y-leftY;
					
					var choice = Math.floor(y/(menuHeight/3));
					
					switch(choiceArr[choice]) {
						case 'Resume':
							this.cleanPause();
						break;
						
						case 'Levels':
							self.state.start("LvlSelect");
							this.game.paused = false;
						break;
						
						case 'Menu':
							self.state.start("MainMenu");
							this.game.paused = false;	
						break;
						
						default:
							this.cleanPause();
						break
					}
				}
				else {
					this.cleanPause();
				}
			}
			
		},
		
		cleanPause: function() {
			//Make pause menu background invisible
			this.pauseMenu.visible = false;
			//destroy pause menu grp
			this.pauseMenuGrp.destroy();
			//Unpause the game
			this.game.paused = false;
			//Add the pausekey again
			this.pauseKey = Game.controls.Pause.onDown.addOnce(this.pauseGame,this);
		},
		//Platform locking code from phaser tutorial:
		//http://phaser.io/tutorials/coding-tips-004
		preRender: function() {
			if(this.game.paused) {
				return;
			}
			
			if(player.locked) {
				if(player.body.right < player.lockedTo.body.x || player.body.x > player.lockedTo.body.right) {
					player.locked = false;
					player.lockedTo = null;
				}
				else {
					player.x += player.lockedTo.deltaX;
					player.y += player.lockedTo.deltaY;
				}
			}
		},
		
		render: function(game) {
		//	Checking hitboxes
		//	game.debug.body(player);
	//	game.debug.body(this.enemy);
		//	game.debug.body(this.spike);
		},
		
		shutdown: function(game) {
			
		}

}