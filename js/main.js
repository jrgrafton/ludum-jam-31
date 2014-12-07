window.addEventListener('load',function() {
  window.DEBUG = true;

  // Turn off logging when not in debugging
  if(!window.DEBUG) {
    console.log = function() {}
    console.debug = function() {}
    console.info = function() {}
  }
  console.debug = function() {}

  // initialize the framework
  var game = new Phaser.Game({
      width: 1280,
      height: 768,
      renderer: Phaser.AUTO,
      parent: document.getElementById('game'),
      enableDebug: window.DEBUG
  });

  // add game states
  game.state.add('Boot', AAO.Boot);
  game.state.add('Preloader', AAO.Preloader);
  game.state.add('MainMenu', AAO.MainMenu);
  game.state.add('Game', AAO.Game);

  // start the Boot state
  game.state.start('Boot');
});