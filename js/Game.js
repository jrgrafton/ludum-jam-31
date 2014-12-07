AAO.Game = function(game){ 
  console.debug("Game()");

  this.player_ = null;
  this.sceneryGroup_ = null;
  this.entityGroup_ = null;
  this.gameDirector_ = null;
};

AAO.Game.prototype.create = function() {
  console.debug("Game.create()");

  // Initialise physics
  this.game.physics.startSystem(Phaser.Physics.ARCADE);

  // Create darkness group
  this.sceneryGroup_ = this.game.add.group();
  this.entityGroup_ = this.game.add.group();

  // Create game director
  this.gameDirector_ = new AAO.GameDirector(this.game, this.entityGroup_);

  // Add sprites and enable Physics
  this.addSprites_();
  this.enablePhysics_();
  this.gameDirector_.init();

  // Pause handlers
  this.game.onPause.add(this.managePause_, this);
  this.game.onResume.add(this.manageResume_, this);

  // Debug functionality
  if(window.DEBUG) {
    // for fps measuring
    this.game.time.advancedTiming = true;
    // override the original render() method 
    this.game.state.onRenderCallback = function() {
      this.game.debug.text('fps: '+ this.game.time.fps, 32, 20);
    }
  }
}
AAO.Game.prototype.update = function() {
  console.debug("Game.update()");
  this.updatePlayer_();
  this.gameDirector_.update();
}

AAO.Game.prototype.updatePlayer_ = function() {
  console.debug("Game.updatePlayer_()");

  var deltaX = this.game.world.centerX - this.game.input.x;
  var deltaY = this.game.world.centerY - this.game.input.y ;
  var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI - 90;

  this.player_.angle = angle;
  this.player_.dirty = true;

  this.darknessMask_.angle = angle;
  this.darkness_.clear();
  this.darkness_.alphaMask(
    this.darknessOverlay_,
    this.darknessMask_,
    new Phaser.Rectangle(0, 0,
        this.darknessOverlay_.width,
        this.darknessOverlay_.height),
    new Phaser.Rectangle(
        this.darknessMask_.width / 2,
        this.darknessMask_.height / 2,
        this.darknessMask_.width,
        this.darknessMask_.height)
  );
  this.darkness_.dirty = true;
};

AAO.Game.prototype.addSprites_ = function() {
  console.debug("Game.addSprites_()");

  this.sceneryGroup_.create(0, 0, 'background');
  this.player_ = this.sceneryGroup_.create(
        this.game.world.centerX,
        this.game.world.centerY, 'player');
  this.player_.anchor.set(0.5);

  var cachedMask = this.game.cache.getImage('darkness-alpha-mask');
  this.darknessOverlay_ =
      this.game.make.bitmapData(cachedMask.width, cachedMask.height);
  this.darknessOverlay_.fill(0, 0, 0, 1);

  this.darknessMask_ = this.game.add.image(0, 0,'darkness-alpha-mask');
  this.darknessMask_.visible = false;
  this.darknessMask_.anchor.set(0.5);

  this.darkness_ =
      this.game.make.bitmapData(cachedMask.width, cachedMask.height);
  this.darkness_.alphaMask(
    this.darknessOverlay_,
    this.darknessMask_,
    new Phaser.Rectangle(0, 0,
        this.darknessOverlay_.width,
        this.darknessOverlay_.height),
    new Phaser.Rectangle(
        this.darknessMask_.width / 2,
        this.darknessMask_.height / 2,
        this.darknessMask_.width,
        this.darknessMask_.height)
  );

  darknessSprite = this.game.add.image(
    this.game.world.centerX,
    this.game.world.centerY,
    this.darkness_).anchor.set(0.5);
};
AAO.Game.prototype.enablePhysics_ = function() {
  console.debug("Game.enablePhysics_()");
};


AAO.Game.prototype.managePause_ = function() {
  console.debug("Game.managePause_()");
};
AAO.Game.prototype.manageResume_ = function() {
  console.debug("Game.manageResume_()");
};

AAO.Game.prototype.reset_ = function() {
  console.debug("Game.reset_()");
};
AAO.Game.prototype.gameOver_ = function() {
  console.debug("Game.gameOver_()");
};