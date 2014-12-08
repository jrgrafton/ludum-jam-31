AAO.MainMenu = function(game){
  this.menuMusic_ = null;

  this.clouds_ = [];

  this.CLOUD_ANIMATION_SPEED = 25000; // MS to animate to one side
}

AAO.MainMenu.prototype.create = function() {
  // Add sprite and button
  this.game.add.sprite(0, 0, "menu-background");

  this.menuMusic_ = this.game.add.audio('menu-background');
  this.menuMusic_.play('',0,1,true);
  this.buttonClick_ = this.game.add.audio('select');

  this.clouds_.push(this.game.add.image(this.game.width/2 + 640 / 2 , this.game.height,"smoke"));
  this.clouds_.push(this.game.add.image(-640,0,"smoke"));

  // Inverse first cloud
  this.clouds_[0].anchor.setTo(.5, 1);
  this.clouds_[0].scale.x = -1;

  // Animate clouds
  this.game.add.tween(this.clouds_[0]).to(
      {x: 640 / 2}, 
      this.CLOUD_ANIMATION_SPEED*0.62,
      Phaser.Easing.EaseInOut,
      true,
      0,
      -1,
      true);
  this.game.add.tween(this.clouds_[1]).to(
      {x: 0}, 
      this.CLOUD_ANIMATION_SPEED*0.38,
      Phaser.Easing.EaseInOut,
      true,
      0,
      -1,
      true);

  // Add button
  this.add.button(this.game.world.centerX,
      this.game.world.centerY + 200, 'start-button',
      this.startGame_.bind(this), this, 1, 0, 1, 1).anchor.setTo(0.5);
};

AAO.MainMenu.prototype.startGame_ = function() {
  this.state.start('Game');
  this.menuMusic_.stop();
  this.buttonClick_.play();
};
