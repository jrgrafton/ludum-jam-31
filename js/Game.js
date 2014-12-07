AAO.Game = function(game){ 
  console.debug("Game()");
  this.gameOver_ = false;

  this.worldGroup_ = null;
  this.sceneryGroup_ = null;
  this.entityGroup_ = null;
  this.gameDirector_ = null;
  this.worldScale_ = 1;
  this.gameOver_Overlay_ = null;
};

AAO.Game.prototype.create = function() {
  console.debug("Game.create()");

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

  // Setup camera
  this.game.world.setBounds (-(this.game.width/2),
    -(this.game.height/2),
    this.game.width,
    this.game.height);
  this.game.world.pivot.x = this.game.width / 2;
  this.game.world.pivot.y = this.game.height / 2;

  if(window.DEBUG) {
    this.game.time.advancedTiming = true;
  }
}
AAO.Game.prototype.update = function() {
  console.debug("Game.update()");
  if(this.gameOver_) return;

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

  this.darknessMask_.angle = angle;
};

AAO.Game.prototype.addSprites_ = function() {
  console.debug("Game.addSprites_()");

  this.sceneryGroup_.create(0, 0, 'background');
  var cachedMask = this.game.cache.getImage('darkness-alpha-mask');
  this.darknessOverlay_ =
      this.game.make.bitmapData(cachedMask.width, cachedMask.height);
  this.darknessOverlay_.fill(5, 9, 5, 1);

  this.darknessMask_ = this.game.add.image(
      this.game.world.centerX,
      this.game.world.centerY,
      'darkness-alpha-mask');
  this.darknessMask_.anchor.set(0.5);
  darknessSprite = this.game.add.image(
    this.game.world.centerX,
    this.game.world.centerY,
    this.darkness_).anchor.set(0.5);
  this.game.add.image(0, 0,'darkness');

  this.gameOver_Overlay_ = this.game.add.sprite(0, 0, "game-over-overlay");
  this.gameOver_Overlay_.visible = false;

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
  console.debug("Game.gameOver()");
  if(this.gameOver_) return;

  this.gameOver_ = true;
  var cameraZoom = 5;
  var animationTime = 2539;

  // Zoom and pixelate
  filter = this.game.add.filter('Pixelate');
  this.entityGroup_.filters = [filter];
  var tween = this.game.add.tween(this);

  tween.onUpdateCallback(function() {
    this.game.world.scale.set(this.worldScale_);
    if(this.worldScale_ > cameraZoom * 0.6) {
      //this.entityGroup_.filters = null;
      this.gameOver_Overlay_.scale = {x: 1 / this.worldScale_, y:1 / this.worldScale_}
      this.gameOver_Overlay_.x = this.game.world.centerX - this.gameOver_Overlay_.width/2;
      this.gameOver_Overlay_.y = this.game.world.centerY - this.gameOver_Overlay_.height/2;

      this.gameOver_Overlay_.visible = true;
      tween.stop();
      this.game.paused = true;
      this.gameOverRestart_();
    }
  }.bind(this));

  tween.to(
    { worldScale_: cameraZoom },
    animationTime,
    Phaser.Easing.Default,
    true
  );
};

AAO.Game.prototype.gameOverRestart_ = function() {

  //this.entityGroup_.filters = null;
  //this.game.paused = true;
}

/* 
* Die list:
  * Pause music
  * Play slowdown SFX
  * Stop timer
* Reset list:
  * Start playing rewind SFX
  * Reset everything
    * Clear projectiles
    * Clear active mobile zombies
    * Clear corpses
    * Reset timer
  * Zoom out
  * Reload gun
    * Restart gameplay music
*/

