AAO.MainMenu = function(game){
  this.menuMusic_ = null;

  this.clouds_ = [];
}

AAO.MainMenu.prototype.create = function() {
  // Add sprite and button
  this.game.add.sprite(0, 0, "menu-background");
  this.add.button(this.game.world.centerX,
        this.game.world.centerY + 200, 'start-button',
        this.startGame_.bind(this), this, 1, 0, 1, 1).anchor.setTo(0.5);

  this.menuMusic_ = this.game.add.audio('menu-background');
  this.menuMusic_.play('',0,1,true);
  this.buttonClick_ = this.game.add.audio('select');

  this.clouds_.push(this.game.add.image(0,0,"smoke"));
};

AAO.MainMenu.prototype.startGame_ = function() {
  this.state.start('Game');
  this.menuMusic_.stop();
  this.buttonClick_.play();
};
