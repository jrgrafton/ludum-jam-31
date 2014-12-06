AAL.Preloader = function(game){
  console.debug("Preloader()");

  // define width and height of the game
  AAL.GAME_WIDTH = 1280;
  AAL.GAME_HEIGHT = 768;
};

AAL.Preloader.prototype.preload = function() {
  console.debug("Preloader.preload()");

  // set background color and preload image
  this.stage.backgroundColor = '#000';

  // Load sprites
  this.load.image('player', 'img/player.jpg');
  this.load.image('zombie', 'img/zombie.jpg');
  this.load.image('mask', 'img/mask.png');
  this.load.image('mask-test', 'img/mask-test.png');
  
  this.load.image('background', 'img/background.jpg');
  this.load.image('darkness-alpha-mask', 'img/darkness-alpha-mask.png');

  // Add file loaded callback
  this.load.onFileComplete.add(this.onFileComplete_.bind(this));
}

AAL.Preloader.prototype.create = function() {
  console.debug("Preloader.create()");

  // start the MainMenu state
  document.body.classList.add("ready");
  this.state.start('Game');
}

AAL.Preloader.prototype.onFileComplete_ = function() {
  console.debug("Preloader.onFileComplete_()");
    /* this.spriteLoadingBar.crop(new Phaser.Rectangle(
          0, 0, this.cacheLoadingBar.width * (progress / 100),
          this.spriteLoadingBar.height)); */
}
