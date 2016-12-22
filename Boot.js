var Game = {};

Game.Boot = function(game) {};

var text = null;
Game.Boot.prototype = {
	//Initialise game area and load assets for preloadbar
	init: function() {
			//Only allow one input pointer(Touch inputs). 
			//Not huge issue on computers, but important for mobiles if multiTouch support is not wanted
			this.input.maxPointers = 1;
			//Making the screen work in different orientations on different devices
			this.scale.pageAlignHorizontally = true;
			this.scale.pageAlignVertically = true;
			//this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			//If the player clicks outside the game, it continues running - anti-cheating
			this.stage.disableVisibiltyChange = true;
			//crisp rendering to maintain pixel style on scaling
			this.game.renderer.renderSession.roundPixels = true;
			Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
			this.fontLoaded;
	},
			
	preload: function() {
		//Load the image for the preload bar
		this.load.image('preloadBar', "Assets/PreloadBar.png");
	},
	
	create: function() {
		this.state.start("Preload");
	}
}