// ------------------------------------------------------------------
// 
// This is the game object.  Everything about the game is located in 
// this object.
//
// ------------------------------------------------------------------

var MyGame = {
	screens : {}
};

var gameStarted = false;
var continueGame = false;
var resetScores = false;

MyGame.graphics = (function() {
	'use strict';
	
	var canvas = document.getElementById('canvas-main'),
		context = canvas.getContext('2d');

	//------------------------------------------------------------------
	//
	// Place a 'clear' function on the Canvas prototype, this makes it a part
	// of the canvas, rather than making a function that calls and does it.
	//
	//------------------------------------------------------------------
	CanvasRenderingContext2D.prototype.clear = function() {
		this.save();
		this.setTransform(1, 0, 0, 1, 0, 0);
		this.clearRect(0, 0, canvas.width, canvas.height);
		this.restore();
	};
	
	//------------------------------------------------------------------
	//
	// Public function that allows the client code to clear the canvas.
	//
	//------------------------------------------------------------------
	function clear() {
		context.clear();
	}
	
	//------------------------------------------------------------------
	//
	// This is a rectangle drawing function, rendering according to the spec.
	//
	//------------------------------------------------------------------
	function drawRectangle(spec) {
		context.save();
		context.translate(spec.position.x + spec.width / 2, spec.position.y + spec.height / 2);
		context.rotate(spec.rotation);
		context.translate(-(spec.position.x + spec.width / 2), -(spec.position.y + spec.height / 2));
		
		context.fillStyle = spec.fill;
		context.fillRect(spec.position.x, spec.position.y, spec.width, spec.height);
		
		context.strokeStyle = spec.stroke;
		context.strokeRect(spec.position.x, spec.position.y, spec.width, spec.height);

		context.restore();
	}

	return {
		clear : clear,
		drawRectangle : drawRectangle
	};
}());


MyGame.game = (function(screens) {
	'use strict';
	let highScores = [0,0,0,0,0];
	let prevHighScores = [];

	//------------------------------------------------------------------
	//
	// This function is used to change to a new active screen.
	//
	//------------------------------------------------------------------
	function showScreen(id) {

		var screen = 0,
			active = null;
		//
		// Remove the active state from all screens.  There should only be one...
		active = document.getElementsByClassName('active');
		for (screen = 0; screen < active.length; screen++) {
			active[screen].classList.remove('active');
		}
		//
		// Tell the screen to start actively running
		screens[id].run();

		// if a game has been started then display the continue and end current game buttons
		// otherwise hide both of them.

		if(gameStarted){
			document.getElementById('id-continue-game').style.visibility = 'visible';
			document.getElementById('id-end-game').style.visibility = 'visible';
		}
		else{
			document.getElementById('id-continue-game').style.visibility = 'hidden';
			document.getElementById('id-end-game').style.visibility = 'hidden';
		}
		//
		// Then, set the new screen to be active
		document.getElementById(id).classList.add('active');
	}

	//------------------------------------------------------------------
	//
	// This function performs the one-time game initialization.
	//
	//------------------------------------------------------------------
	function initialize() {
		var screen = null;
		// Go through each of the screens and tell them to initialize

		for (screen in screens) {
			if (screens.hasOwnProperty(screen)) {
				screens[screen].initialize();
			}
		}
		
		// Make the main-menu screen the active one
		showScreen('main-menu');
	}
	
	return { 
		highScores: highScores,
		prevHighScores: prevHighScores,
		initialize : initialize,
		showScreen : showScreen
	};
}(MyGame.screens, MyGame.graphics));


