AAO.Game = function(game){ 
  console.debug("Game()");
  this.gameOver_ = false;

  this.worldGroup_ = null;
  this.sceneryGroup_ = null;
  this.entityGroup_ = null;
  this.gameDirector_ = null;
  this.worldScale_ = 1;
  this.gameOverOverlay_ = null;

  this.music_ = null;
  this.sfx_ = null;

  this.restartButton_ = null;

  this.GAME_OVER_ZOOM_LEVEL = 5;
  this.GAME_OVER_ANIMATION_TIME = 2539;
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
  this.addAudio_();
  this.gameDirector_.init();
  this.addText_();
  this.addButtons_();

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
  this.updateOverlay_();
  this.gameDirector_.update();
}

AAO.Game.prototype.render = function() {
  this.gameDirector_.render();
  if(window.DEBUG) {
    this.game.debug.text('fps: '+ this.game.time.fps, 32, 20);
  }
}


AAO.Game.prototype.updateOverlay_ = function() {
  console.debug("Game.updatePlayer_()");

  var deltaX = this.game.world.centerX - this.game.input.x;
  var deltaY = this.game.world.centerY - this.game.input.y ;
  var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI - 90;

  this.darknessMask_.angle = angle;
};

AAO.Game.prototype.addText_ = function() {
  this.gameTimeTextGameOver_ = this.game.add.bitmapText(
    this.game.world.centerX,
    this.game.world.centerY,
    'juice-regular',
    '5:00',
  60);
  this.gameTimeTextGameOver_.visible = false;
}

AAO.Game.prototype.addButtons_ = function() {
  this.restartButton_ = this.add.button(this.game.world.centerX,
        this.game.world.centerY + 200, 'restart-button',
        this.gameOverRestart_.bind(this), this, 1, 0, 1, 1)
  this.restartButton_.anchor.setTo(0.5);
  this.restartButton_.visible = false;
}

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

  this.gameOverOverlay_ = this.game.add.sprite(0, 0, "game-over-overlay");
  this.gameOverOverlay_.visible = false;
};

AAO.Game.prototype.addAudio_ = function() {
  this.music_ = this.game.add.audio('gameplay-background');
  this.music_.play('',0,1,true);
  this.sfx_ = {};
  this.sfx_["zombie-shuffle"] = this.game.add.audio('zombie-shuffle');
  this.sfx_["zombie-shuffle"].play('',0,1,true);
  this.sfx_["slow-down-to-halt"] = this.game.add.audio('slow-down-to-halt');
  this.sfx_["rewind"] = this.game.add.audio('rewind');
}

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
  this.music_.pause('',0,1,true); // pause music

  // Zoom and pixelate
  filter = this.game.add.filter('Pixelate');
  this.entityGroup_.filters = [filter];
  var tween = this.game.add.tween(this);

  tween.onUpdateCallback(function() {
    this.game.world.scale.set(this.worldScale_);
  }.bind(this));

  tween.onComplete.add(function() {
    this.gameOverOverlay_.scale =
        {x: 1 / this.worldScale_, y:1 / this.worldScale_}
    this.gameOverOverlay_.x =
        this.game.world.centerX - this.gameOverOverlay_.width/2;
    this.gameOverOverlay_.y =
        this.game.world.centerY - this.gameOverOverlay_.height/2;
    this.gameOverOverlay_.visible = true;

    // Game time for game over overlay
    var minutes = Math.floor(this.gameDirector_.gameTime / (60 * 1000));
    var seconds = (this.gameDirector_.gameTime % (60 * 1000)) / 1000;
    this.gameTimeTextGameOver_.text = minutes + ":" + ("0" + (seconds + 1)).slice(-2);;
    this.gameTimeTextGameOver_.scale =
        {x: 1 / this.worldScale_, y:1 / this.worldScale_}
    this.gameTimeTextGameOver_.x =
        this.game.world.centerX - this.gameTimeTextGameOver_.width/2;
    this.gameTimeTextGameOver_.y =
        this.game.world.centerY - this.gameTimeTextGameOver_.height/2;
    this.gameTimeTextGameOver_.visible = true;

    // Restart button
    this.restartButton_.scale =
        {x: 1 / this.worldScale_, y:1 / this.worldScale_}
    this.restartButton_.x =
        this.game.world.centerX;
    this.restartButton_.y =
        this.game.world.centerY + this.restartButton_.height * 2;
    this.restartButton_.visible = true;


    tween.stop();
  }.bind(this));

  tween.to(
    { worldScale_: this.GAME_OVER_ZOOM_LEVEL },
    this.GAME_OVER_ANIMATION_TIME,
    Phaser.Easing.Default,
    true
  );

  // Play slowdown mp3
  this.sfx_["slow-down-to-halt"].play();
};

AAO.Game.prototype.gameOverRestart_ = function() {
  console.log("restart");
  // Reset overlay
  this.gameOverOverlay_.visible = false;
  this.gameTimeTextGameOver_.visible = false;
  this.restartButton_.visible = false;

  // Reset game director
  this.gameDirector_.resetState();

  var tween = this.game.add.tween(this);
  tween.onUpdateCallback(function() {
    this.game.world.scale.set(this.worldScale_);
  }.bind(this));

  tween.onComplete.add(function() {
    // Restart music
    this.music_.play('',0,1,true);

    // Remove filter
    this.entityGroup_.filters = null;

    // Resume game manager state
    this.gameDirector_.resumeState();

    // No longer game over
    this.gameOver_ = false;
  }.bind(this), this);

  // Do tween
  tween.to(
    { worldScale_: 1 },
    this.GAME_OVER_ANIMATION_TIME,
    Phaser.Easing.Default,
    true
  );

  // Play rewind SFX
  this.sfx_["rewind"].play();
}
