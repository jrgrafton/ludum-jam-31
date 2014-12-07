/**
 * Controls entity spawn, collisions and updates
 **/
AAL.GameDirector = function(game, entityGroup) {
  this.game_ = game;
  this.lastUpdate_ = null;
  this.entityGroup_ = entityGroup;
  this.mobileZombiesGroup_ = this.game_.add.group();
  this.staticZombiesGroup_ = this.game_.add.group();
  this.projectilesGroup_ = this.game_.add.group();

  this.entityGroup_.add(this.mobileZombiesGroup_);
  this.entityGroup_.add(this.staticZombiesGroup_);
  this.entityGroup_.add(this.projectilesGroup_);

  // Psuedo static vars
  this.ZOMBIE_INITIAL_STATIC_COUNT = 800;
  this.ZOMBIE_MOBILE_SPEED = 0.3;
  this.ZOMBIE_INITIAL_MOBILE_COUNT = 100;
  this.ZOMBIE_INITIAL_MOBILE_SPAWN_RADIUS = 350; // In pixels

  this.ZOMBIE_ACTIVATION_CHANCE = 0.1; // Per second chance
}

AAL.GameDirector.prototype.init = function() {
  this.lastUpdate_ = new Date().getTime();
  this.spawnZombies();
}

AAL.GameDirector.prototype.spawnZombies = function() {
  console.debug("GameDirector.spawnZombies()");
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
    zombie.animations.add('walk');
    zombie.animations.play('walk', 4 * Math.random() + 4, true);
    this.staticZombiesGroup_.add(zombie);
  }

  for(var i = 0; i < this.ZOMBIE_INITIAL_MOBILE_COUNT; i++) {
    var radius = this.ZOMBIE_INITIAL_MOBILE_SPAWN_RADIUS;
    var angle = Math.random() * (2 * Math.PI);
    distX = Math.cos(angle) * radius;
    distY = Math.sin(angle) * radius;

    var zombie = this.mobileZombiesGroup_.create(
        this.game_.world.centerX + distX,
        this.game_.world.centerY + distY,
        'zombie');
    zombie.angle = angle;
    zombie.anchor.set(0.5);
    zombie.animations.add('walk');
    zombie.animations.play('walk', 4 * Math.random() + 4, true);
    this.mobileZombiesGroup_.add(zombie);
  }

  this.activateZombie_(this.mobileZombiesGroup_.getAt(0));
}

AAL.GameDirector.prototype.update = function() {
  console.debug("GameDirector.update()");

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
  this.lastUpdate_ = new Date().getTime();
}

AAL.GameDirector.prototype.activateZombie_ = function(zombie) {
  console.debug("GameDirector.activateZombie()");
  console.log("activate");
  var haveActivatedZombie = false;
  this.mobileZombiesGroup_.forEachAlive(function(zombie) {
    if(zombie.state !== "active" && !haveActivatedZombie) { 
      zombie.state = "active"; 
      haveActivatedZombie = true;
    }
  });
}



