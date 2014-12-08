AAO.Preloader = function(game){
  console.debug("Preloader()");

  // define width and height of the game
  AAO.GAME_WIDTH = 1280;
  AAO.GAME_HEIGHT = 720;

  this.loadiongBarCache_ = null;
  this.loadingBar_ = null;
};

AAO.Preloader.prototype.preload = function() {
  console.debug("Preloader.preload()");

  // set background color and preload image
  this.stage.backgroundColor = '#000';

  this.game.add.sprite(0, 0, "loading");
  this.loadiongBarCache_ = this.game.cache.getImage('loading-bar');
  this.loadingBar_ = this.game.add.sprite(270, 363, "loading-bar");
  this.loadingBar_.crop(new Phaser.Rectangle(
            0, 0, 0, this.loadingBar_.height))

  // Load sprites
  this.load.image('bullet', 'img/bullet.png');
  this.load.spritesheet('player', 'img/player.png', 50, 95, 2);
  this.load.image('player-shoot', 'img/player-shoot.png');
  this.load.spritesheet('zombie', 'img/zombie.png', 128, 128, 24);
  this.load.image('background', 'img/background.jpg');
  this.load.image('darkness', 'img/darkness.png');
  this.load.image('darkness-alpha-mask', 'img/darkness-alpha-mask.png');
  this.load.image('game-over-overlay', 'img/game-over-overlay.png');
  this.load.image('menu-background', 'img/menu-bg.jpg');
  this.load.image('clip-empty', 'img/clip-empty.png');
  this.load.image('clip-loaded', 'img/clip-loaded.png');
  this.load.image('smoke', 'img/smoke.png');
  this.load.spritesheet('clip-sprite', 'img/clip-sprite.png', 71, 37, 2);

  // Load filters
  this.game.load.script('filter', 'filters/Pixelate.js');

  // Load audio
  this.game.load.audio('menu-background',
    ['sound/music/menu-background.mp3','sound/music/menu-background.ogg'], true);
  this.game.load.audio('gameplay-background',
    ['sound/music/gameplay-background.mp3',
    'sound/music/gameplay-background.ogg'], true);
  this.game.load.audio('zombie-shuffle',
    ['sound/sfx/zombie_shuffle.mp3','sound/sfx/zombie_shuffle.ogg'], true);

  this.game.load.audio('gunshot',
    ['sound/sfx/gunshot.mp3','sound/sfx/gunshot.ogg']);
  this.game.load.audio('gunshot-empty',
    ['sound/sfx/gunshot-empty.mp3','sound/sfx/gunshot-empty.ogg']);
  this.game.load.audio('gunshot-hit',
    ['sound/sfx/gunshot-hit.mp3','sound/sfx/gunshot-hit.ogg']);
  this.game.load.audio('slow-down-to-halt',
    ['sound/sfx/slow_down_to_halt.mp3','sound/sfx/slow_down_to_halt.ogg']);
  this.game.load.audio('rewind',
    ['sound/sfx/rewind.mp3','sound/sfx/rewind.ogg']);
  this.game.load.audio('rewind',
    ['sound/sfx/rewind.mp3','sound/sfx/rewind.ogg']);
  this.game.load.audio('select', ['sound/sfx/radio.mp3',
    'sound/sfx/radio.ogg']);
  this.game.load.audio('reload', ['sound/sfx/reload-fast.mp3',
    'sound/sfx/reload-fast.ogg']);
  this.game.load.audio('zombie-groan', ['sound/sfx/zombie_groan.mp3',
    'sound/sfx/zombie_groan.ogg']);
  this.game.load.audio('lightning', ['sound/sfx/lightning.mp3',
    'sound/sfx/lightning.ogg']);

  // Load buttons
  this.game.load.spritesheet(
      'start-button',
      'img/menu-start-button.png',
      305, 97);
  this.game.load.spritesheet(
      'restart-button',
      'img/game-over-restart-button.png',
      253 , 97);

  // Load fonts
  this.load.bitmapFont('juice-regular', 'fonts/juice-regular.png',
        'fonts/juice-regular.xml');

  // Add file loaded callback
  this.load.onFileComplete.add(this.onFileComplete_.bind(this));
}

AAO.Preloader.prototype.create = function() {
  console.debug("Preloader.create()");

  // Set interval waiting for audio to load
  var soundLoadedInterval = setInterval(function() {
    var audioLoadedProgress = 0;
    audioLoadedProgress += this.cache.isSoundReady("menu-background") * 0.3;
    audioLoadedProgress += this.cache.isSoundReady("gameplay-background") * 0.3;
    audioLoadedProgress += this.cache.isSoundReady("zombie-shuffle") * 0.4;
    var widthLeft = this.loadiongBarCache_.width - this.loadingBar_.width;
    var extraWidth = widthLeft * audioLoadedProgress;

    this.loadingBar_.crop(new Phaser.Rectangle(
          0, 0, this.loadingBar_.width + extraWidth,
          this.loadingBar_.height));

    if(audioLoadedProgress === 1) {
      clearInterval(soundLoadedInterval);
      // start the MainMenu state
      document.body.classList.add("ready");
      this.state.start('MainMenu');
    }
  }.bind(this), 1000);

 
}

AAO.Preloader.prototype.onFileComplete_ = function(progress) {
  console.debug("Preloader.onFileComplete_()");

  // Progress can only get to 60% before audio is loaded
  this.loadingBar_.crop(new Phaser.Rectangle(
          0, 0, this.loadiongBarCache_.width * (progress / 140),
          this.loadiongBarCache_.height));
}
