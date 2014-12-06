/**
 * Controls entity spawn, collisions and updates
 **/
AAL.GameDirector = function(game, entityGroup) {
  this.game_ = game;
  this.entityGroup_ = entityGroup;
  this.startTime_ = null;

  this.mobileZombieCount = 0;
  this.mobileZombies = new LinkedList();
  this.staticZombies = new LinkedList();

  this.projectiles = new LinkedList();

  // Psuedo static vars
  this.INITIAL_ZOMBIE_COUNT = 100;
  this.ZOMBIE_SPAWN_CHANCE = 0.1; // Chance to spawn per second

  // Spawning only in certain areas
  this.STATIC_ZOMBIE_SPAWN_AREAS = [
  // Top strip
  {
    "xmin": 0,
    "xmax": game.width,
    "ymin": 0,
    "ymax": 100
  },
  // Bottom strip
  {
    "xmin": 0,
    "xmax": game.width,
    "ymin": game.height - 100,
    "ymax": game.height,
  },
  // Left patch
  {
    "xmin": 0,
    "xmax": 100,
    "ymin": 100,
    "ymax": game.height - 100
  },
  // Right patch
  {
    "xmin": game.width - 100,
    "xmax": game.width,
    "ymin": 100,
    "ymax": game.height - 100
  }]
}

AAL.GameDirector.prototype.init = function() {
  this.spawnZombies();
}

AAL.GameDirector.prototype.spawnZombies = function() {
  console.debug("GameDirector.spawnZombies()");
  for(var i = 0; i < this.INITIAL_ZOMBIE_COUNT; i++) {
    var spawnAreaIndex = Math.round(
        Math.random() * (this.STATIC_ZOMBIE_SPAWN_AREAS.length - 1));
    var spawnArea = this.STATIC_ZOMBIE_SPAWN_AREAS[spawnAreaIndex];
    var startX =
        (Math.random() * (spawnArea.xmax - spawnArea.xmin)) + spawnArea.xmin;
    var startY =
        (Math.random() * (spawnArea.ymax - spawnArea.ymin)) + spawnArea.ymin;

    this.staticZombies.push(
      this.entityGroup_.create(startX, startY, 'zombie').anchor.set(0.5));
  }

  for(var i = 0; i < this.INITIAL_ZOMBIE_COUNT; i++) {
    
  }
}

AAL.GameDirector.prototype.update = function() {
  var node = this.mobileZombies.getHead();
    while (node !== null) {
      var zombie = node.data;
      zombie.x += Math.random() * 0.2 - 0.1;
      zombie.y += Math.random() * 0.2 - 0.1;

      Phaser.Math.clamp(zombie.x, 0, this.game_.width);
      Phaser.Math.clamp(zombie.y, 0, this.game_.height);

      node = node.next;
    }
}