AAO.Preloader = function(game){
  console.debug("Preloader()");

  // define width and height of the game
  AAO.GAME_WIDTH = 1280;
  AAO.GAME_HEIGHT = 720;
};

AAO.Preloader.prototype.preload = function() {
  console.debug("Preloader.preload()");

  // set background color and preload image
  this.stage.backgroundColor = '#000';

  // Load sprites
  this.load.image('bullet', 'img/bullet.png');
  this.load.spritesheet('player', 'img/player.png', 50, 95, 2);
  this.load.image('player-shoot', 'img/player-shoot.png');
  this.load.spritesheet('zombie', 'img/zombie.png', 128, 128, 24);
  
  this.load.image('background', 'img/background.jpg');
  this.load.image('darkness', 'img/darkness.png');
  this.load.image('darkness-alpha-mask', 'img/darkness-alpha-mask.png');
  this.load.image('game-over-overlay', 'img/game-over-overlay.png');

  // Load filters
  this.game.load.script('filter', 'filters/Pixelate.js');

  // Load audio
  this.game.load.audio('menu-background',
    ['sound/music/menu-background.mp3','sound/music/menu-background.ogg']);
  this.game.load.audio('gameplay-background',
    ['sound/music/gameplay-background.mp3','sound/music/gameplay-background.ogg']);

  this.game.load.audio('zombie-shuffle',
    ['sound/sfx/zombie_shuffle.mp3','sound/sfx/zombie_shuffle.ogg']);

  this.game.load.audio('gunshot',
    ['sound/sfx/gunshot.mp3','sound/sfx/gunshot.ogg']);


  /* this.game.load.audio('in-game', ['sounds/in-game.mp3', 'sounds/in-game.ogg']);
  this.game.load.audio('ping', ['sounds/ping.mp3', 'sounds/ping.ogg']);
  this.game.load.audio('pong', ['sounds/pong.mp3', 'sounds/pong.ogg']);
  this.game.load.audio('point', ['sounds/point.mp3', 'sounds/point.ogg']); */

  // Add file loaded callback
  this.load.onFileComplete.add(this.onFileComplete_.bind(this));
}

AAO.Preloader.prototype.create = function() {
  console.debug("Preloader.create()");

  // start the MainMenu state
  document.body.classList.add("ready");
  this.state.start('Game');
}

AAO.Preloader.prototype.onFileComplete_ = function() {
  console.debug("Preloader.onFileComplete_()");
    /* this.spriteLoadingBar.crop(new Phaser.Rectangle(
          0, 0, this.cacheLoadingBar.width * (progress / 100),
          this.spriteLoadingBar.height)); */
}
