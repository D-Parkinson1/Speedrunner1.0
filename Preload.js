Game.Preload = function(game) {
	this.preloadBar = null;//The preloadBar sprite
	//Webfont code from phaser tutorial:  http://phaser.io/examples/v2/text/google-webfonts
	//  The Google WebFont Loader will look for this object, so create it before loading the script.
	WebFontConfig = {
			active: function() {console.log("Font Loaded");},
			//  The Google Fonts we want to load (specify as many as you like in the array)
			google: {
				families: ['Faster One', 'Stalinist One']
			}
	
	};
};

//LocalStorage name if localSotrage was implemented
var localStorageName = "SPEEDRUNNER";
//Levels Object idea is from: http://thoughts.amphibian.com/2015/12/more-levels-fewer-states.html
var tutorial = {
	map:'Tut',//Map to load
	starTime: 30,//Time to get the third star
	devAllStar: 16,//The dev's time (my time) to complete level with all stars
	devNoStar: 10,//The dev's time to complete the level with no stars
	gotStar: [false, false, false],//Array showing if the stars are gotten or not
	locked: false,//Is the level locked(true) or unlocked(false)
	playerTime: 100//The player's best Time Default of 100
}

var level1 = {
	map: 'Lvl1',
	starTime: 30,
	devAllStar: 15,
	devNoStar: 3,
	gotStar: [false,false,false],
	locked: true,
	playerTime: 100
}

var level2 = {
	map: 'Lvl2',
	starTime: 30,
	devAllStar: 12,
	devNoStar: 9,
	gotStar: [false,false,false],
	locked: true,
	playerTime: 100
}


var level3 = {
	map: 'Lvl3',
	starTime: 30,
	devAllStar: 13,
	devNoStar: 2,
	gotStar: [false,false,false],
	locked: true,
	playerTime: 100
}

var level4 = {
	map: 'Lvl4',
	starTime: 30,
	devAllStar: 15,
	devNoStar: 5,
	gotStar: [false,false,false],
	locked: true,
	playerTime: 100
}

var level5 = {
	map: 'Lvl5',
	starTime: 25,
	devAllStar: 11,
	devNoStar: 5,
	gotStar: [false,false,false],
	locked: true,
	playerTime: 100
}

var level6 = {
	map: 'Lvl6',
	starTime: 40,
	devAllStar: 20,
	devNoStar: 5,
	gotStar: [false,false,false],
	locked: true,
	playerTime: 100
}

var level7 = {
	map: 'Lvl7',
	starTime: 40,
	devAllStar: 19,
	devNoStar: 5,
	gotStar: [false,false,false],
	locked: true,
	playerTime: 100
}

var level8 = {
	map: 'Lvl8',
	starTime: 60,
	devAllStar: 32,
	devNoStar: 2,
	gotStar: [false,false,false],
	locked: true,
	playerTime: 100
}

var level9 = {
	map: 'Lvl9',
	starTime:50,
	devAllStar: 23,
	devNoStar: 5,
	gotStar: [false,false,false],
	locked: true,
	playerTime: 100
}

//The levels in the game
Game.Levels = {
	levels: [],//Array to hold the levels
	currentLevel: 'Tut',//Current level
	levelsComplete: [false,false,false,false,false,false,false,false,false,false]//Array to see if the levels are complete
};

//Adding levels to the levels array
Game.Levels.levels[0] = tutorial;
Game.Levels.levels[1] = level1;
Game.Levels.levels[2] = level2;
Game.Levels.levels[3] = level3;
Game.Levels.levels[4] = level4;
Game.Levels.levels[5] = level5;
Game.Levels.levels[6] = level6;
Game.Levels.levels[7] = level7;
Game.Levels.levels[8] = level8;
Game.Levels.levels[9] = level9;


//Function to add text over a generic button sprite
	//Copied from phaser tutorial: https://www.youtube.com/watch?v=F8DzoVIHoIc&list=PL9iYZZWgVwsfNdldSzmYev0tbVKjeov6w&index=13
Game.createButton = function(game,string,x,y,w,h,callback){
		var button1 = game.add.button(x,y,'Button', callback,this,0,1,2);
		button1.anchor.setTo(0.5);
		button1.width = w;
		button1.height = h;
		
		var txt = game.add.text(button1.x, button1.y, string, {font:"18px Stalinist One", fill:"#fff", align: "center"});
		txt.anchor.setTo(0.5);
	}
	
Game.Preload.prototype = {
		
	//Load in assets and set loading screen
	preload: function() {
		//Making the preload bar
		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY,'preloadBar');
		this.preloadBar.anchor.setTo(0.5);
		this.time.advancedTiming = true;
		this.load.setPreloadSprite(this.preloadBar);
		
		///////////////////
		//LOAD ALL ASSETS//
		///////////////////
		
		//Tilemaps
		this.load.tilemap('Tut', "Assets/tutorial.json", null, Phaser.Tilemap.TILED_JSON);
		
		for(var i =1; i< Game.Levels.levels.length; i++) {
			var imgKey = 'Lvl' + i.toString();
			var filePath = "Assets/Level"+ i.toString() +".json";
			this.load.tilemap(imgKey, filePath, null, Phaser.Tilemap.TILED_JSON);	
		}
		
		//Images
		this.load.image('GroundTiles', "Assets/GroundTiles.png");
		this.load.image('Objects', "Assets/Objects.png");
		this.load.image('Sky', "Assets/Sky.png");
		this.load.image('Clouds', "Assets/Clouds.png");
		this.load.image('exit', "Assets/Door.png");
		this.load.image('spike', "Assets/Spike.png");
		this.load.image('door', "Assets/Door.png");
		this.load.image('pause', "Assets/pauseMenu.png");
		
		//Spritesheets
		this.load.spritesheet('thumbnail', "Assets/Thumbnail.png", 64,64);
		this.load.spritesheet('star', "Assets/Stars.png", 20,20);
		this.load.spritesheet('sound', "Assets/SoundButtons.png", 64,64);
		this.load.spritesheet('enemy', "Assets/Enemy.png", 32,32);
		this.load.spritesheet('Button', "Assets/Button.png",200,50);
		this.load.spritesheet('flyEnemy', "Assets/Flying_Enemy.png", 25,23);
		this.load.spritesheet('player', "Assets/Player.png", 16, 32);
		this.load.spritesheet('coin', "Assets/Coin.png", 16, 16);
		this.load.spritesheet('movePlatform', "Assets/MovingPlatform.png", 64,32);
		
		//Sounds
		this.load.audio('starSnd', ["Assets/getStar.mp3", "Assets/getStar.ogg"]);
		
		
		//  Load the Google WebFont Loader script
		//NOTE: Load after the images or some won't load on first try
		this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
	},
	
	create: function() {
		this.state.start("MainMenu")
	}
}