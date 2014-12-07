AAO.Game = function(game){ 
  console.debug("Game()");

  this.sceneryGroup_ = null;
  this.entityGroup_ = null;
  this.gameDirector_ = null;
};

AAO.Game.prototype.create = function() {
  console.debug("Game.create()");

  // Setup camera
  //game.world.setBounds(-this., -200, 500, 400);

  // Initialise physics
  this.game.physics.startSystem(Phaser.Physics.ARCADE);

  // Create darkness group
  this.sceneryGroup_ = this.game.add.group();
  this.entityGroup_ = this.game.add.group();

  // Create game director
  this.gameDirector_ = new AAO.GameDirector(this, this.entityGroup_);

  // Add sprites and enable Physics
  this.addSprites_();
  this.gameDirector_.init();

  // Pause handlers
  this.game.onPause.add(this.managePause_, this);
  this.game.onResume.add(this.manageResume_, this);

  if(window.DEBUG) {
    this.game.time.advancedTiming = true;
  }
}
AAO.Game.prototype.update = function() {
  console.debug("Game.update()");

  if(!window.DEBUG) { window.stats.begin(); }
  this.updateOverlay_();
  this.gameDirector_.update();
}

AAO.Game.prototype.render = function() {
  this.gameDirector_.render();
  this.game.debug.text('fps: '+ this.game.time.fps, 32, 20);

  if(!window.DEBUG) { window.stats.end(); }
}


AAO.Game.prototype.updateOverlay_ = function() {
  console.debug("Game.updatePlayer_()");

  var deltaX = this.game.world.centerX - this.game.input.x;
  var deltaY = this.game.world.centerY - this.game.input.y ;
  var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI - 90;

  //this.darknessMask_.angle = angle;
};

AAO.Game.prototype.addSprites_ = function() {
  console.debug("Game.addSprites_()");

  this.sceneryGroup_.create(0, 0, 'background');
  var cachedMask = this.game.cache.getImage('darkness-alpha-mask');
  this.darknessOverlay_ =
      this.game.make.bitmapData(cachedMask.width, cachedMask.height);
  this.darknessOverlay_.fill(5, 9, 5, 1);

  /*this.darknessMask_ = this.game.add.image(
      this.game.world.centerX,
      this.game.world.centerY,
      'darkness-alpha-mask');
  this.darknessMask_.anchor.set(0.5);
  darknessSprite = this.game.add.image(
    this.game.world.centerX,
    this.game.world.centerY,
    this.darkness_).anchor.set(0.5);
  this.game.add.image(0, 0,'darkness'); */
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
AAO.Game.prototype.gameOver = function() {
  console.debug("Game.gameOver_()");
  this.game.paused = true;

  var point = new Phaser.Point(500,500);
  this.world.scale.setTo(1.5);
  this.camera.setPosition(1000, 1000);         
 
};