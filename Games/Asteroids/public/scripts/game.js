// ------------------------------------------------------------------
// 
// This is the game object.  Everything about the game is located in 
// this object.
//
// ------------------------------------------------------------------

MyGame.game = (function(screens, scoreHandler) {
	'use strict';

	var highScoreData = {
		name : '_ _ _',
		score : 0,
	}

	let highScores = [highScoreData, highScoreData, highScoreData, highScoreData, highScoreData];

  scoreHandler.getScores();
  //credit for music goes to maxstack on https://opengameart.org/content/through-space
	let audio = new Audio('audio/through space.ogg');
	//found help for the looping audio from here
	//http://stackoverflow.com/questions/3273552/html5-audio-looping
	audio.volume = .05;
	audio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
	}, false);
	audio.play();
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
		//
		// Go through each of the screens and tell them to initialize
		for (screen in screens) {
			if (screens.hasOwnProperty(screen)) {
				screens[screen].initialize();
			}
		}
		highScores = scoreHandler.highScores;
		//
		// Make the main-menu screen the active one
		showScreen('main-menu');
	}
	
	return {
		initialize : initialize,
		showScreen : showScreen,
		highScores : highScores,
	};
}(MyGame.screens, MyGame.scoreHandler));
