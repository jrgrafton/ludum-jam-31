AAO.Game = function(game){ 
  console.debug("Game()");

  this.worldGroup_ = null;
  this.sceneryGroup_ = null;
  this.entityGroup_ = null;
  this.gameDirector_ = null;
  this.worldScale = 1;
  this.gameOver = false;
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

  if(!window.DEBUG) { window.stats.begin(); }
  this.updateOverlay_();
  this.gameDirector_.update();


      // zoom
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
      this.worldGroup_.rotation -= 0.05;
        //this.worldScale += 0.05;
    }
    else if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
      this.worldGroup_.rotation += 0.05;

        //this.worldScale -= 0.05;
    }
    

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
      this.game.world.pivot.y -= 5;  
    }
    else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
      this.game.world.pivot.y += 5;
    }
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
      this.game.world.pivot.x -= 5;
    }
    else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
      this.game.world.pivot.x += 5;
    }


    // set a minimum and maximum scale value
    this.worldScale = Phaser.Math.clamp(this.worldScale, 0.25, 3);
    
    // set our world scale as needed
    this.game.world.scale.set(this.worldScale);
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
AAO.Game.prototype.gameOver_ = function() {
  console.debug("Game.gameOver_()");
  
  console.log("game over")
  filter = this.game.add.filter('Pixelate', 10);
  this.entityGroup_.filters = [filter];
  this.game.add.tween(this).to( 
  { worldScale: 5 },
    500,
    Phaser.Easing.EaseOut,
    true
  );

  //this.game.paused = true;
};