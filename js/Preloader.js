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

  // Load filters
  this.game.load.script('filter', 'filters/Pixelate.js');

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
