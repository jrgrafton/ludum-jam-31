var AAO = {};
AAO.Boot = function(game){ console.debug("Boot()"); };

AAO.Boot.prototype.preload = function() {
    console.debug("Boot.preload()");
    // preload assets needed for loading screen
    this.load.image('loading', 'img/loading.png');
    this.load.image('loading-bar', 'img/loading-bar.png');
}

AAO.Boot.prototype.create = function() {
    console.debug("Boot.create()");
    // set input options
    this.input.maxPointers = 1;
    
    // start the Preloader state
    this.state.start('Preloader');
}