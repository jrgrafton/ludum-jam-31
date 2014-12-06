var AAL = {};
AAL.Boot = function(game){ console.debug("Boot()"); };

AAL.Boot.prototype.preload = function() {
    console.debug("Boot.preload()");
    // preload assets needed for loading screen
    this.load.image('loading-bar-frame', 'img/loading-bar-frame.png');
    this.load.image('loading-bar', 'img/loading-bar.png');
    this.load.image('logo', 'img/logo.png');
    //this.load.bitmapFont('kindly-rewind', 'fonts/kindly-rewind.png',
    //    'fonts/kindly-rewind.xml');
}

AAL.Boot.prototype.create = function() {
    console.debug("Boot.create()");
    // set input options
    this.input.maxPointers = 1;
    
    // start the Preloader state
    this.state.start('Preloader');
}