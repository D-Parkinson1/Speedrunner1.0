Game.Help = function(game){
	this.title = null;//The title
	this.sky = null;//The sky background
	this.clouds = null;//the clouds scrollign past
	this.backBtn = null;//the button back to the menu
	this.info = null;//Info text
	this.infoText1 = null;//Info
	this.infoText2 = null;//Info
	this.infoText3 = null;//Info
	this.infoText4 = null;//Info
	this.infoStyle = null;//Info
	this.enemy = null;//An example enemy
	this.coin = null;//An example coin
	this.flyEnemy = null;//An example flying enemy
	this.spike = null;//An example spike
	this.player = null;//an example player
	this.player2 = null;//Another example player
};

Game.Help.prototype = {
	create: function(game) {
		self = this;
		//Content of each help text
		this.controlsText = "Click this text to view and modify controls.";
		this.infoText1 = "Complete the levels as fast as you can. \nA fast time earns a star."
		this.infoText2 ="Collect all the coins and kill all the enemies to earn two more stars."
		this.infoText3 ="Use your doublejump to reach high places.\nRun to gain even more height."
		this.infoText4 = "Don't jump on spikes. Walk or run past them.";
		//Styling for help text
		this.infoStyle = {font: '16px Stalinist One', align: "center", wordWrap: true, wordWrapWidth: 700};
		
		//Sky and scrolling background
		this.sky = this.add.image(0,0, 'Sky');
		this.clouds = this.add.tileSprite(0,0,this.game.width,this.game.height,'Clouds');
		this.clouds.autoScroll(-10,0);
		
		//Go back to the previous screen
		this.backBtn = Game.createButton(this, 'Back', 50,50,90,35, this.Menu);
		
		//Add the title
		this.title = this.add.text(this.world.centerX, 50, 'HELP', Game.titleStyle);
		this.title.anchor.setTo(0.5);
		
		////////////////////
		//Explain the game//
		////////////////////
		this.controlInfo =  this.add.text(this.world.centerX, this.world.centerX-240, this.controlsText, this.infoStyle);
		this.controlInfo.anchor.setTo(0.5);
		this.controlInfo.inputEnabled = true;
		this.controlInfo.events.onInputUp.addOnce(this.Options,this);
		//Help text about timed stars
		this.info = this.add.text(this.world.centerX, this.world.centerX-120, this.infoText1, this.infoStyle);
		this.info.anchor.setTo(0.5);
		//Add a star sprite to show what it looks like
		this.star = this.add.image(this.world.centerX, this.world.centerX-90, 'star');
		this.star.frame = 0;
		//Help text about coin and enemy stars
		this.info = this.add.text(this.world.centerX, this.world.centerX-40, this.infoText2, this.infoStyle);
		this.info.anchor.setTo(0.5);
		//Add a coin sprite as an example
		this.coin = this.add.sprite(this.world.centerX, this.world.centerY + 90, 'coin')
		this.coin.animations.add('spin', spinFrames, 10, true);
		this.coin.animations.play('spin');
		//Add an example flying enemy
		this.flyEnemy = this.add.sprite(this.world.centerX - 40, this.world.centerY + 90, 'flyEnemy');
		this.flyEnemy.animations.add('fly', flyFrames, 30, true);
		this.flyEnemy.animations.play('fly');
		//Add an example enemy
		this.enemy = this.add.sprite(this.world.centerX + 40, this.world.centerY + 90, 'enemy');
		this.enemy.animations.add('move');
		this.enemy.animations.play('move', 5, true);
		//Help text about running abd jumping
		this.info = this.add.text(this.world.centerX, this.world.centerY + 150, this.infoText3, this.infoStyle);
		this.info.anchor.setTo(0.5);
		//Add an example player that runs back and forth
		this.player1 = this.add.sprite(100, this.world.centerY + 195, 'player');
		this.player1.animations.add('run', walkFrames, 15, true);
		this.player1.animations.play('run');
		var tween = this.add.tween(this.player1);
		tween.to({x: this.world.width-100}, 1500, Phaser.Easing.Linear.None, true, 0, -1, true);
		tween.onLoop.add(function() {
			this.player1.scale.setTo(-this.player1.scale.x,1);
		},this);
		//Help text about spikes
		this.info = this.add.text(this.world.centerX, this.world.height-64, this.infoText4, this.infoStyle);
		this.info.anchor.setTo(0.5);
		//Add example spikes
		this.spike = this.add.sprite(this.world.centerX-64, this.world.height - 32, 'spike');
		this.spike = this.add.sprite(this.world.centerX-32, this.world.height - 32, 'spike');
		this.spike = this.add.sprite(this.world.centerX, this.world.height - 32, 'spike');
		this.spike = this.add.sprite(this.world.centerX+32, this.world.height - 32, 'spike');
		this.spike = this.add.sprite(this.world.centerX+64, this.world.height - 32, 'spike');
		//Add an example player to walk past the spikes
		this.player2 = this.add.sprite(100, this.world.height-32, 'player');
		this.player2.animations.add('run', walkFrames, 15, true);
		this.player2.animations.play('run');
		var tween = this.add.tween(this.player2);
		tween.to({x: this.world.width-100}, 2500, Phaser.Easing.Linear.None, true, 0, -1, true);
		tween.onLoop.add(function() {
			this.player2.scale.setTo(-this.player2.scale.x,1);
		},this);
	},
	
	
	
	update: function(game) {
		
	},
	
	Menu: function() {
		self.state.start("MainMenu", Phaser.Plugin.StateTransition.Out.SlideRight, Phaser.Plugin.StateTransition.In.SlideRight);
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
		
		self.state.start("Options",Phaser.Plugin.StateTransition.Out.SlideLeft,Phaser.Plugin.StateTransition.In.SlideLeft);
	}
}