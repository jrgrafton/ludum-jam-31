/**
 * Controls entity spawn, collisions and updates
 **/
AAL.GameDirector = function(game, entityGroup) {
  this.game_ = game;
  this.startTime_ = null;
  this.entityGroup_ = entityGroup;
  this.mobileZombiesGroup_ = this.game_.add.group();
  this.staticZombiesGroup_ = this.game_.add.group();
  this.projectilesGroup_ = this.game_.add.group();

  this.entityGroup_.add(this.mobileZombiesGroup_);
  this.entityGroup_.add(this.staticZombiesGroup_);
  this.entityGroup_.add(this.projectilesGroup_);

  // Psuedo static vars
  this.ZOMBIE_INITIAL_STATIC_COUNT = 5000;
  this.ZOMBIE_MOBILE_SPEED = 0.2;
  this.ZOMBIE_INITIAL_MOBILE_COUNT = 100;
  this.ZOMBIE_INITIAL_MOBILE_SPAWN_RADIUS = 350; // In pixels
}

AAL.GameDirector.prototype.init = function() {
  this.startTime_ = new Date().getTime();
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
    zombie.anchor.set(0.5);
    this.mobileZombiesGroup_.add(zombie);
  }
}

AAL.GameDirector.prototype.update = function() {
  this.mobileZombiesGroup_.forEachAlive(function(zombie) {
      var deltaX = zombie.x - this.game_.world.centerX;
      var deltaY = zombie.y - this.game_.world.centerY;
      var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI - 90;
      zombie.angle = angle;
      
      var vx = Math.cos(angle);
      var vy = Math.sin(angle);
      zombie.x += vx * this.ZOMBIE_MOBILE_SPEED;
      zombie.y += vy * this.ZOMBIE_MOBILE_SPEED;


    }.bind(this));
}