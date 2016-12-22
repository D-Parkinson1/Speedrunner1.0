Game.Select = function(game) {
	this.title;//The text of the title
	this.sky = null;//The background
	this.clouds = null;//Scrolliung clouds
	this.backBtn = null;//A button to go back to the menu
	this.columns = 5; //Number of columns in thumbnail grid
	this.rows = 2; //Number of rows in thumbnail grids
	this.thumbnailDim = 64;//Width and height of thumbnails
	this.spacing = 30; //Spacing between thumbnails
	this.infoGrp = null; //A group to hold info text
	this.infoTitle = null; //Text displaying level details
	this.helpTxt = null;//Tell the user to hover on a button for details
};

Game.Select.prototype = {
	init: function() {
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
		//Go back to the previous screen
		this.backBtn = Game.createButton(this, 'Back', 50,50,90,35, this.Menu);

		//Add the title
		this.title = this.add.text(this.world.centerX, 50, 'Level Select', Game.titleStyle);
		this.title.anchor.setTo(0.5);
		//Text telling the user what to do
		this.helpTxt = this.add.text(this.world.centerX, this.world.centerY, 'Hover for level information', {font:'16px Stalinist One'});
		this.helpTxt.anchor.setTo(0.5);
		
//Creating the level select Grid
//Modified from example here: http://www.emanueleferonato.com/2016/01/25/create-a-html5-level-select-screen-controlled-by-swipe-without-actually-checking-for-swipes/
		
		//Calculate margins	
		var rowLength = this.thumbnailDim*this.columns+this.spacing*(this.columns-1);
		var sideMargin = (this.game.width - rowLength)/2;
		var colHeight = this.thumbnailDim*this.rows + this.spacing*(this.rows-1);
		var topMargin = (this.game.height/2+this.title.height-colHeight)/2;
		//Allowing for movement after changing sprite anchor
		var anchorErr = (this.thumbnailDim/2)*this.rows;
		
		//Create the grid of thumbnails
		for(var i = 0; i<this.rows; i++) {
			for(var j = 0; j<this.columns;j++) {
				//Calculate the level number
				var lvlNum = i*this.columns+j;
				//Make the thumbnail
				var thumb = this.createThumbnail(this,lvlNum,sideMargin + j*(this.thumbnailDim+this.spacing) + this.thumbnailDim/2,topMargin + i*(this.thumbnailDim+this.spacing)+ this.thumbnailDim/2, this.playGame);
			}
		}
		//Group to hold info text
		this.infoGrp = this.add.group();		
		this.infoGrp.visible = false;
		
		
	},
	//Function for creating the level thumbnials
	createThumbnail: function(game,string,x,y,callback) {
		var thumbnail = game.add.button(x,y, 'thumbnail', callback, this);
		thumbnail.anchor.setTo(0.5);
		thumbnail.levelNumber = string;
		thumbnail.frame = 1;
		
		thumbnail.onInputOver.add(this.lvlInfo, this);
		thumbnail.onInputOut.add(this.removeLvlInfo, this);
		
		var text = game.add.text(thumbnail.x, thumbnail.y-20, string+1, {font:'16px Stalinist One', fill: '#fffff0',align: 'center'});
		text.anchor.setTo(0.5);
		
		if(string < Game.Levels.levels.length) {
			if(Game.Levels.levels[thumbnail.levelNumber].locked) {
				thumbnail.frame = 1;
			}
			else {
				thumbnail.frame = 0;
				var coinStar = game.add.sprite(thumbnail.x-20, thumbnail.y+15, 'star');
				coinStar.anchor.setTo(0.5);
				if(Game.Levels.levels[string].gotStar[0]) {
					coinStar.frame = 0;
				}
				else {
					coinStar.frame = 1;
				}
				
				var enemyStar = game.add.sprite(thumbnail.x, thumbnail.y+15, 'star');
				enemyStar.anchor.setTo(0.5);
				if(Game.Levels.levels[string].gotStar[1]) {
					enemyStar.frame = 0;
				}
				else {
					enemyStar.frame = 1;
				}
				
				var timeStar = game.add.sprite(thumbnail.x+20, thumbnail.y+15, 'star');
				timeStar.anchor.setTo(0.5);
				if(Game.Levels.levels[string].gotStar[2]) {
					timeStar.frame = 0;
				}
				else {
					timeStar.frame = 1;
				}
			}
		}

	},
	
	lvlInfo: function(button) {
		//Show the text
		this.infoGrp.visible = true;	
		//Title of the level
		this.infoTitle = this.add.text(this.world.centerX, this.world.centerY + 40, 'Level ' + (button.levelNumber+1), {font:'16px Stalinist One'}, this.infoGrp);
		this.infoTitle.anchor.setTo(0.5);
		//The time required for the level
		this.infoTime = this.add.text(this.world.centerX, this.world.centerY + 80, 'Star Time: ' + Game.Levels.levels[button.levelNumber].starTime, {font:'16px Stalinist One'}, this.infoGrp);
		this.infoTime.anchor.setTo(0.5);
		//Time it took the dev to get all stars and complete the level
		this.devTimeAll = this.add.text(this.world.centerX, this.world.centerY + 120, 'Dev Time (All Stars): ' + Game.Levels.levels[button.levelNumber].devAllStar, {font:'16px Stalinist One'}, this.infoGrp);
		this.devTimeAll.anchor.setTo(0.5);
		//Time it took the dev to complete the level as fast as possible(no stars)
		this.devTime = this.add.text(this.world.centerX, this.world.centerY + 160, 'Dev Time (No Stars): ' + Game.Levels.levels[button.levelNumber].devNoStar, {font:'16px Stalinist One'}, this.infoGrp);
		this.devTime.anchor.setTo(0.5);
		//Show the player's best time
		this.playerTime = this.add.text(this.world.centerX, this.world.centerY + 200, 'Your Best Time: ' + Game.Levels.levels[button.levelNumber].playerTime, {font:'16px Stalinist One'}, this.infoGrp);
		this.playerTime.anchor.setTo(0.5);
	},
	
	removeLvlInfo: function() {
		//Remove level info text
		this.infoGrp.removeAll();
		this.infoGrp.visible = false;
	},
	
	update: function(game) {
		
	},
	
	Menu: function() {
		self.state.start("MainMenu", Phaser.Plugin.StateTransition.Out.SlideRight, Phaser.Plugin.StateTransition.In.SlideRight);
	},
	
	playGame: function(button) {
		if(button.frame == 0) { 
			// pass level number to Game state
			Game.Levels.currentLevel = button.levelNumber;
			self.state.start('Game')//,Phaser.Plugin.StateTransition.Out.ScaleUp, Phaser.Plugin.StateTransition.In.ScaleUp);
		}
	}
}