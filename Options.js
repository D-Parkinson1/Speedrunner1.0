Game.Options = function(game) {
	this.soundBtn = null;	//Initialise sound button
	this.keyStyle = null; //styling for text
	this.controlStyle = null;//styling for text
	this.backBtn = null;//the batton to go back to the menu
	this.leftKey = null; //The left key
	this.rightKey = null;//the right key
	this.jumpKey = null; // the jump key
	this.runKey = null; // the run key
	this.restartKey = null; // the restart key
	this.wasd = null; // the button to map controls to WASD
	this.space = null; //Button to map jump to spacebar
	this.arrow = null; //Button to map controls back to arrow keys
};

Game.Options.prototype = {
	create: function(game) {
		self = this;//Reference to Game object
		
		//Font styles
		this.keyStyle = {font: '16px Stalinist One', fill: '#DC143C'};
		this.controlStyle = {font: '16px Stalinist One', fill: '#8FBC8F'};
		
		//Adding sky and scrolling background
		Game.sky = this.add.image(0,0, 'Sky');
		Game.clouds = this.add.tileSprite(0,0,this.game.width,this.game.height,'Clouds');
		Game.clouds.autoScroll(-10,0);
		
		//Displaying the title
		this.title = this.add.text(this.world.centerX, 50, 'Options', Game.titleStyle);
		this.title.anchor.setTo(0.5);
		
		//Go back to the previous screen
		this.backBtn = Game.createButton(this, 'Back', 50,50,90,35, this.Menu);
		
		//Play or mute sound
		this.soundBtn = this.add.button(this.world.centerX, this.world.centerY+250, 'sound', this.changeSound);
		this.soundBtn.anchor.setTo(0.5);
		this.soundBtn.frame = 0;

		//Add text showing the player the controls
		this.leftKey = this.add.text(this.world.centerX,this.world.centerY-160,'Left: '+this.toChar(Game.controls.Left.keyCode), this.keyStyle);
		this.leftKey.anchor.setTo(0.5);
		
		this.rightKey = this.add.text(this.world.centerX, this.world.centerY-110, 'Right: ' + this.toChar(Game.controls.Right.keyCode), this.keyStyle);
		this.rightKey.anchor.setTo(0.5);
		
		this.jumpKey = this.add.text(this.world.centerX, this.world.centerY-60, 'Jump: ' + this.toChar(Game.controls.Jump.keyCode), this.keyStyle);
		this.jumpKey.anchor.setTo(0.5);
		
		this.runKey = this.add.text(this.world.centerX, this.world.centerY-10, 'Run: ' + this.toChar(Game.controls.Run.keyCode), this.keyStyle);
		this.runKey.anchor.setTo(0.5);
		
		this.restartKey = this.add.text(this.world.centerX, this.world.centerY+40, 'Restart: ' + this.toChar(Game.controls.Restart.keyCode), this.keyStyle);
		this.restartKey.anchor.setTo(0.5);
		
		this.pauseKey = this.add.text(this.world.centerX, this.world.centerY+90, 'Pause: ' + this.toChar(Game.controls.Pause.keyCode), this.keyStyle);
		this.pauseKey.anchor.setTo(0.5);
		
		this.wasd = Game.createButton(this,'WASD', this.world.centerX - 250, this.world.centerY+150, 200,50,function(){
			Game.Options.prototype.changeControls(1,0,0);
		});
			
		this.space = Game.createButton(this,'Space to Jump', this.world.centerX, this.world.centerY+ 150, 250,50,function(){
			Game.Options.prototype.changeControls(0,1,0);
		});
			
		this.arrow = Game.createButton(this,'Arrow Keys', this.world.centerX+250, this.world.centerY+150, 200,50,function(){
			Game.Options.prototype.changeControls(0,0,1);
		});		
		
	},
	
	update: function(game) {
		
	},

	changeSound: function() {
		//Logic for muting/playing sound
		if(Game.playSound) {
			Game.playSound = false;
			self.soundBtn.frame = 1;
		}
		else {
			Game.playSound = true;
			self.soundBtn.frame = 0;
		}
	},

	Menu: function() {
		self.state.start("MainMenu", Phaser.Plugin.StateTransition.Out.SlideRight, Phaser.Plugin.StateTransition.In.SlideRight);
	},
	
	changeControls: function(wasd,space,arrow) {
		//Chagne controls depending on the button clicked
		if(wasd) {
			Game.controls.Right = self.input.keyboard.addKey(Phaser.KeyCode.D);
			Game.controls.Left = self.input.keyboard.addKey(Phaser.KeyCode.A);
			Game.controls.Jump = self.input.keyboard.addKey(Phaser.KeyCode.W);
		}
		if(space) {
			Game.controls.Jump = self.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
		}
		if(arrow) {
			Game.controls.Right = self.input.keyboard.addKey(Phaser.KeyCode.RIGHT);
			Game.controls.Left = self.input.keyboard.addKey(Phaser.KeyCode.LEFT);
			Game.controls.Jump = self.input.keyboard.addKey(Phaser.KeyCode.UP);
		}
		
		//Update text to reflect key changes
		self.leftKey.setText('Left: ' + Game.Options.prototype.toChar(Game.controls.Left.keyCode));
		self.rightKey.setText('Right: ' + Game.Options.prototype.toChar(Game.controls.Right.keyCode));
		self.jumpKey.setText('Jump: ' + Game.Options.prototype.toChar(Game.controls.Jump.keyCode));
		self.runKey.setText('Run: ' + Game.Options.prototype.toChar(Game.controls.Run.keyCode));
	},

	//Turns a javascript keycode into the character value
	toChar: function(key) {
		//List of keycodes from: https://github.com/wesbos/keycodes/blob/gh-pages/scripts.js
		//It has been significantly modified so it fits the Phaser.KeyCode key definitions
		var keyCodes = {
			8 : "Backspace",
			9 : "Tab",
			12 : "Clear",
			13 : "Enter",
			16 : "Shift",
			17 : "Control",
			18 : "Alt",
			20 : "Caps_Lock",
			27 : "Esc",
			32 : "Spacebar",
			33 : "Page_Up",
			34 : "Page_Down",
			35 : "End",
			36 : "Home",
			37 : "Left",
			38 : "Up",
			39 : "Right",
			40 : "Down",
			41 : "Select",
			42 : "Print",
			43 : "Plus",
			44 : "Minus",
			45 : "Insert",
			46 : "Delete",
			47 : "Help",
			48 : "Zero",
			49 : "One",
			50 : "Two",
			51 : "Three",
			52 : "Four",
			53 : "Five",
			54 : "Six",
			55 : "Seven",
			56 : "Eight",
			57 : "Nine",
			59 : "Colon",
			65 : "a",
			66 : "b",
			67 : "c",
			68 : "d",
			69 : "e",
			70 : "f",
			71 : "g",
			72 : "h",
			73 : "i",
			74 : "j",
			75 : "k",
			76 : "l",
			77 : "m",
			78 : "n",
			79 : "o",
			80 : "p",
			81 : "q",
			82 : "r",
			83 : "s",
			84 : "t",
			85 : "u",
			86 : "v",
			87 : "w",
			88 : "x",
			89 : "y",
			90 : "z",
			96 : "Numpad_0",
			97 : "Numpad_1",
			98 : "Numpad_2",
			99 : "Numpad_3",
			100 : "Numpad_4",
			101 : "Numpad_5",
			102 : "Numpad_6",
			103 : "Numpad_7",
			104 : "Numpad_8",
			105 : "Numpad_9",
			106 : "Numpad_Multiply",
			107 : "Numpad_Add",
			108 : "Numpad_Enter",
			109 : "Numpad_Subtract",
			110 : "Numpad_Decimal",
			111 : "Numpad_Divide ",
			112 : "F1",
			113 : "F2",
			114 : "F3",
			115 : "F4",
			116 : "F5",
			117 : "F6",
			118 : "F7",
			119 : "F8",
			120 : "F9",
			121 : "F1",
			122 : "F1",
			123 : "F12",
			124 : "F13",
			125 : "F14",
			126 : "F15",
			144 : "Num_lock",
			186 : "Colon",
			187 : "Equals",
			188 : "Comma",
			189 : "Underscore",
			190 : "Period",
			191 : "Question_Mark",
			192 : "Tilde",
			219 : "Open_Bracket",
			220 : "Backward_Slash ",
			221 : "Closed_Bracket ",
			222 : "Quotes"
		};
		if(keyCodes[key]) {
			return keyCodes[key].toUpperCase();
		}
		else {
			return "Invalid";
		}
	},
	
}