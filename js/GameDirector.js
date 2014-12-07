/**
 * Controls entity spawn, collisions and updates
 **/
AAO.GameDirector = function(gameState, entityGroup) {
  this.game_ = gameState.game;
  this.gameState_ = gameState;
  this.player_ = null;
  this.lastUpdate_ = null;
  this.lastShot_ = null;
  this.gunAmmo_ = 10;
  this.gunReloading_ = false;
  this.entityGroup_ = entityGroup;
  this.gameTime_ = 1000 * 60 * 5; // 5 minutes
  this.zombieKills_ = 0;

  // Groups
  this.mobileZombiesGroup_ =  null;
  this.staticZombiesGroup_ = null;
  this.deadZombiesGroup_ = null;
  this.projectilesGroup_ = null;
  this.playerGroup_ = null;

  // Psuedo static vars
  this.ZOMBIE_INITIAL_STATIC_COUNT = 50;
  this.ZOMBIE_STATIC_ANIMATION_SPEED = 4;
  this.ZOMBIE_MOBILE_SPEED = 0.8;
  this.ZOMBIE_INITIAL_MOBILE_COUNT = 25;
  this.ZOMBIE_MOBILE_ANIMATION_SPEED = 6;
  this.ZOMBIE_MOBILE_ANIMATION_DYING_SPEED = 6;
  this.ZOMBIE_INITIAL_MOBILE_SPAWN_RADIUS = 350; // In pixels
  this.ZOMBIE_ACTIVATION_CHANCE = 2.0; // Per second chance

  this.GUN_BULLET_SPEED = 1000; // Pixels per second
  this.GUN_COCK_SPEED = 50; // Min number of ms between shots
  this.GUN_RELOAD_TIME = 200;
  this.GUN_CLIP_SIZE = 7;
}

AAO.GameDirector.prototype.init = function() {
  this.lastUpdate_ = new Date().getTime();
  this.lastShot_ = new Date().getTime();
  this.setupGroups_();
  this.setupPhysics_();
  this.spawnPlayer_();
  this.spawnZombies_();
  this.setupTimer_();
}

AAO.GameDirector.prototype.setupGroups_ = function() {
  console.debug("GameDirector.setupGroups_()");

  this.mobileZombiesGroup_ = this.game_.add.group();
  this.staticZombiesGroup_ = this.game_.add.group();
  this.deadZombiesGroup_ = this.game_.add.group();
  this.projectilesGroup_ = this.game_.add.group();
  this.playerGroup_ = this.game_.add.group();
  this.entityGroup_.add(this.mobileZombiesGroup_);
  this.entityGroup_.add(this.staticZombiesGroup_);
  this.entityGroup_.add(this.projectilesGroup_);
  this.entityGroup_.add(this.deadZombiesGroup_);
  this.entityGroup_.add(this.playerGroup_);
}

AAO.GameDirector.prototype.setupPhysics_ = function() {
  console.debug("GameDirector.setupPhysics_()");

  this.projectilesGroup_.physicsBodyType = Phaser.Physics.ARCADE;
  this.projectilesGroup_.enableBody = true;

  this.playerGroup_.physicsBodyType = Phaser.Physics.ARCADE;
  this.playerGroup_.enableBody = true;

  this.projectilesGroup_.createMultiple(50, 'bullet');
  this.projectilesGroup_.setAll('checkWorldBounds', true);
  this.projectilesGroup_.setAll('outOfBoundsKill', true);
}

AAO.GameDirector.prototype.setupTimer_ = function() {
  timer = this.game_.time.create(false);
  timer.loop(1000, this.updateTime_.bind(this), this);
  timer.start();
}

AAO.GameDirector.prototype.spawnPlayer_ = function() {
  this.player_ = this.playerGroup_.create(
        this.game_.world.centerX,
        this.game_.world.centerY, 'player');
  this.player_.anchor.set(0.5);
  this.player_.body.immovable = true;
  this.player_.body.setSize(90, 90, 0, 0);
}

AAO.GameDirector.prototype.spawnZombies_ = function() {
  console.debug("GameDirector.spawnZombies_()");
  this.spawnStaticZombies_();
  this.spawnMobileZombies_();
  this.activateZombie_(this.mobileZombiesGroup_.getAt(0));
}
AAO.GameDirector.prototype.spawnStaticZombies_ = function() {
  for(var i = 0; i < this.ZOMBIE_INITIAL_STATIC_COUNT; i++) {
    var radius = this.ZOMBIE_INITIAL_MOBILE_SPAWN_RADIUS * 0.8;
    var angle = Math.random() * (2 * Math.PI);
    distX = Math.cos(angle) * radius;
    distY = Math.sin(angle) * radius;

    startX = this.game_.world.centerX
        + Math.cos(angle) * (radius + (Math.random() * 550));
    startY = this.game_.world.centerY
        + Math.sin(angle) * (radius + (Math.random() * 550));

    var cacheZombie = this.game_.cache.getImage('zombie');
    if(startX - cacheZombie.width / 2 > this.game_.width
      || startX + cacheZombie.width / 2  < 0
      || startY - cacheZombie.height / 2 > this.game_.height
      || startY + cacheZombie.height / 2 < 0) {
      continue;
    }
    
    var zombie = this.staticZombiesGroup_.create(startX, startY, 'zombie');
    var deltaX = zombie.x - this.game_.world.centerX;
    var deltaY = zombie.y - this.game_.world.centerY;
    var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI - 90;
    zombie.angle = angle;
    zombie.anchor.set(0.5);
    zombie.animations.add('walk', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
    zombie.animations.play('walk', this.ZOMBIE_STATIC_ANIMATION_SPEED * (Math.random() + 1), true);
  }
}

AAO.GameDirector.prototype.spawnMobileZombies_ = function() {
  for(var i = 0; i < this.ZOMBIE_INITIAL_MOBILE_COUNT; i++) {
    this.spawnMobileZombie_();
  }
}
AAO.GameDirector.prototype.spawnMobileZombie_ = function() {
  var radius = this.ZOMBIE_INITIAL_MOBILE_SPAWN_RADIUS;
  var angle = Math.random() * (2 * Math.PI);
  distX = Math.cos(angle) * radius;
  distY = Math.sin(angle) * radius;

  var zombie = this.mobileZombiesGroup_.create(
      this.game_.world.centerX + distX,
      this.game_.world.centerY + distY,
      'zombie');

  var deltaX = zombie.x - this.game_.world.centerX;
  var deltaY = zombie.y - this.game_.world.centerY;
  var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI - 90;
  zombie.angle = angle;
  zombie.anchor.set(0.5);
  zombie.animations.add('walk', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
  zombie.animations.add('dying', [16,17,18,19,20,21,22,23]);
  zombie.animations.play('walk', this.ZOMBIE_MOBILE_ANIMATION_SPEED * (Math.random() + 1), true);
  zombie.visible = true;
}

AAO.GameDirector.prototype.render = function() {
  this.renderDebug_();
}

AAO.GameDirector.prototype.renderDebug_ = function() {
  var minutes = Math.round(this.gameTime_ / (60 * 1000));
  var seconds = (this.gameTime_ % (60 * 1000)) / 1000;

  this.game_.debug.text('time: '+ minutes + ":" + seconds, 32, 40);
  this.game_.debug.text('bullets: ' + this.gunAmmo_, 32, 60);
  this.game_.debug.text('reloading: '
    + "" + ((this.gunReloading_)? 1 : 0), 32, 80);
  this.game_.debug.text('zombie kills: ' + this.zombieKills_, 32, 100);

  this.game_.debug.body(this.player_);
  this.mobileZombiesGroup_.forEachAlive(function(zombie) {
    this.game_.debug.body(zombie);
  }.bind(this));
}

AAO.GameDirector.prototype.update = function() {
  console.debug("GameDirector.update()");

  this.updatePlayer_();
  this.updateZombies_();
  this.updateProjectiles_();
  this.updateCollisions_();
  this.lastUpdate_ = new Date().getTime();
}

AAO.GameDirector.prototype.updatePlayer_ = function() {
  var deltaX = this.game_.world.centerX - this.game_.input.x;
  var deltaY = this.game_.world.centerY - this.game_.input.y ;
  var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI - 90;

  this.player_.angle = angle;
}

AAO.GameDirector.prototype.updateTime_ = function() {
  this.gameTime_ -= 1000;
}

AAO.GameDirector.prototype.updateCollisions_ = function() {
  // Collide bullets and zombies
  this.game_.physics.arcade.collide(this.projectilesGroup_,
      this.mobileZombiesGroup_,
      this.projectileHitZombie_.bind(this),
      null, this);

  // @TODO - figure out why processEvent is triggered and not collide event...
  this.game_.physics.arcade.collide(this.player_, 
      this.mobileZombiesGroup_,
      null,
      this.zombieHitPlayer_.bind(this), this);
}

AAO.GameDirector.prototype.updateZombies_ = function() {
  this.mobileZombiesGroup_.forEachAlive(function(zombie) {
    if(zombie.state !== "active") { return };

    var deltaX = zombie.x - this.game_.world.centerX;
    var deltaY = zombie.y - this.game_.world.centerY;
    var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI - 90;
    zombie.angle = angle;
    
    var vx = Math.cos(angle);
    var vy = Math.sin(angle);
    zombie.x += vx * this.ZOMBIE_MOBILE_SPEED;
    zombie.y += vy * this.ZOMBIE_MOBILE_SPEED;
  }.bind(this));

  // Activate zombies
  var timeSinceLastUpdate = new Date().getTime() - this.lastUpdate_;
  if((timeSinceLastUpdate / 1000) * this.ZOMBIE_ACTIVATION_CHANCE
      > Math.random()) {
    this.activateZombie_()
  }
}

AAO.GameDirector.prototype.activateZombie_ = function(zombie) {
  console.debug("GameDirector.activateZombie()");
  var haveActivatedZombie = false;
  this.mobileZombiesGroup_.forEachAlive(function(zombie) {
    if(zombie.state !== "active" && !haveActivatedZombie) { 
      zombie.animations.play('walk', this.ZOMBIE_MOBILE_ANIMATION_SPEED * (Math.random() + 1), true);
      zombie.state = "active"; 
      zombie.visible = true;
      haveActivatedZombie = true;

      this.game_.physics.enable(zombie, Phaser.Physics.ARCADE);
      zombie.enableBody = true;
      zombie.body.immovable = true;
      zombie.body.setSize(90, 90, 0, 0);
    }
  }.bind(this));
}

AAO.GameDirector.prototype.updateProjectiles_ = function() {
  // Check for reload request
  if (this.game_.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)
      && !this.gunReloading_) {
      this.reloadGun_();
  }

  // Check for reload complete
  if(this.gunReloading_ &&
      new Date().getTime() - this.gunReloading_ > this.GUN_RELOAD_TIME) {
    this.gunAmmo_ = this.GUN_CLIP_SIZE;
    this.gunReloading_ = false;
  }

  if(this.game_.input.activePointer.isDown
        && !this.gunReloading_
        && new Date().getTime() - this.lastShot_ > this.GUN_COCK_SPEED
        && this.lastShot_ !== this.game_.input.activePointer.timeDown) {

    if(this.gunAmmo_ === 0) {
      // TODO: empty gun SFX
      return;
    }

    var bullet = this.projectilesGroup_.getFirstDead();
    bullet.reset(this.game_.world.centerX, this.game_.world.centerY);
    bullet.anchor.set(0.5);

    var deltaX = bullet.x - this.game_.input.x;
    var deltaY = bullet.y - this.game_.input.y;
    var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI - 90;
    bullet.angle = angle;

    this.game_.physics.arcade.moveToXY(bullet,
      this.game_.input.x,
      this.game_.input.y,
      this.GUN_BULLET_SPEED);

    this.lastShot_ = this.game_.input.activePointer.timeDown;
    --this.gunAmmo_;
  }
}

AAO.GameDirector.prototype.reloadGun_ = function() {
  this.gunReloading_ = new Date().getTime();
}

AAO.GameDirector.prototype.projectileHitZombie_ = function(projectile, zombie) {
  // TODO: Kill zombie
  //zombie.kill();
  //zombie.animations.stop("walk");
  zombie.animations.play("dying", this.ZOMBIE_MOBILE_ANIMATION_DYING_SPEED);
  zombie.body.destroy();
  this.mobileZombiesGroup_.removeChild(zombie);
  this.deadZombiesGroup_.addChild(zombie);
  projectile.kill();
  ++this.zombieKills_
  this.spawnMobileZombie_();
}

AAO.GameDirector.prototype.zombieHitPlayer_ = function(player, zombie) {
  this.gameState_.gameOver_();
}


