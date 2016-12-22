Game.Menu = function(game) {
	this.title;//The text of the title
	this.groundGrp = null;//Group of ground tiles on Main menu
	this.player = null;//Reference to the player on the menu
	this.sky = null; //Sky background is accessed in all states
	this.clouds = null; // Scrolling clouds are used in all states
	Game.titleStyle = null;//Font styling for titles
	Game.playSound = true;//Flag for if the game is muted or not
	//Control object holds properties for key controls. Allows for easier key mapping
	Game.controls = { // Controls declared gloably so they can be accessed in multiple states
		Right: '',
		Left: '',
		Jump: '',
		Run: '',
		Restart: '',
		Pause: ''
	}	
};

Game.Menu.prototype = {
	
	init: function(game) {
		//Resizing game world for menu screen after coming from play screen Otherwise, buttons are off-centre
		if(this.world.bounds.width > 800 || this.world.height > 600) {
			this.world.setBounds(0,0,800,600);
		}
	},
	create: function(game) {
		self = this;
		
		//Add a sky background
		this.sky = this.add.image(0,0, 'Sky');
		//Add clouds that scroll past
		this.clouds = this.add.tileSprite(0,0,this.game.width,this.game.height,'Clouds');
		this.clouds.autoScroll(-10,0);
		
		//Styling for the title across all states
		Game.titleStyle = {font:'80px Faster One', fill: '#FFD700', align: 'center', wordWrap: true, wordWrapWidth: 700, stroke: '#B8860B', strokeThickness: 4};
		
		//Add a player running on the menu
		this.player = this.add.sprite(this.world.centerX, this.game.height-64, 'player');
		this.physics.enable(this.player);
		this.player.body.allowGravity = false;
		this.player.animations.add('run', walkFrames, 25, true);
		this.player.animations.play('run');
		
		//Add ground tiles along the bottom of the menu
		for(var i = 0; i < this.game.width; i += 32) {
			this.groundGrp = this.add.group();
			var ground = this.groundGrp.create(i, this.game.height-32, 'GroundTiles');
		}
		
		//The title
		this.title = this.add.text(this.world.centerX, 50, 'SPEEDRUNNER', Game.titleStyle);
		this.title.anchor.setTo(0.5);
		
		//Menu Buttons
		Game.createButton(this,"Play", this.world.centerX, this.world.centerY - 100, 200, 50,this.playGame);
		Game.createButton(this, "Options", this.world.centerX, this.world.centerY, 200, 50, this.Options);
		Game.createButton(this,"Help", this.world.centerX, this.world.centerY + 100, 200, 50,this.helpScreen);
			
	},
	update: function(game) {
		//The player constantly running across the screen
		this.player.body.velocity.x = 250;
		this.game.world.wrap(this.player, this.player.width);
	},
	
	playGame: function() {
		//If the controls have not been set in the options screen, set to a default value
		if(Game.controls.Right == '') {
			Game.controls.Right = self.input.keyboard.addKey(Phaser.KeyCode.RIGHT);
		}
		if(Game.controls.Left == '') {
			Game.controls.Left = self.input.keyboard.addKey(Phaser.KeyCode.LEFT);
		}
		if(Game.controls.Jump == '') {
			Game.controls.Jump = self.input.keyboard.addKey(Phaser.KeyCode.UP);
		}
		if(Game.controls.Run == '') {
			Game.controls.Run = self.input.keyboard.addKey(Phaser.KeyCode.SHIFT);
		}
		if(Game.controls.Restart == '') {
			Game.controls.Restart = self.input.keyboard.addKey(Phaser.KeyCode.R);
		}
		if(Game.controls.Pause == '') {
			Game.controls.Pause = self.input.keyboard.addKey(Phaser.KeyCode.P);
		}
		
		self.state.start("LvlSelect", Phaser.Plugin.StateTransition.Out.SlideLeft, Phaser.Plugin.StateTransition.In.SlideLeft);
	},
	
	helpScreen: function() {
		self.state.start("Help", Phaser.Plugin.StateTransition.Out.SlideLeft, Phaser.Plugin.StateTransition.In.SlideLeft);
	},
	
	Options: function() {
		//Set the controls so they can be changed in the options screen
		if(Game.controls.Right == '') {
			Game.controls.Right = self.input.keyboard.addKey(Phaser.KeyCode.RIGHT);
		}
		if(Game.controls.Left == '') {
			Game.controls.Left = self.input.keyboard.addKey(Phaser.KeyCode.LEFT);
		}
		if(Game.controls.Jump == '') {
			Game.controls.Jump = self.input.keyboard.addKey(Phaser.KeyCode.UP);
		}
		if(Game.controls.Run == '') {
			Game.controls.Run = self.input.keyboard.addKey(Phaser.KeyCode.SHIFT);
		}
		if(Game.controls.Restart == '') {
			Game.controls.Restart = self.input.keyboard.addKey(Phaser.KeyCode.R);
		}
		if(Game.controls.Pause == '') {
			Game.controls.Pause = self.input.keyboard.addKey(Phaser.KeyCode.P);
		}
		
		self.state.start("Options", Phaser.Plugin.StateTransition.Out.SlideLeft, Phaser.Plugin.StateTransition.In.SlideLeft);
	}
}