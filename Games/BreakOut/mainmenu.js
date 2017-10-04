MyGame.screens['main-menu'] = (function(game) {
	'use strict';
	
	function initialize() {
		//
		// Setup each of menu events for the screens
		document.getElementById('id-continue-game').addEventListener(
			'click',
			function() {continueGame = true; game.showScreen('game-play'); });
		document.getElementById('id-end-game').addEventListener(
			'click',
			function() {continueGame = false; gameStarted = false; game.showScreen('main-menu');});

		document.getElementById('id-new-game').addEventListener(
			'click',
			function() {continueGame = false; gameStarted = true;game.showScreen('game-play'); });
		
		document.getElementById('id-high-scores').addEventListener(
			'click',
			function() { game.showScreen('high-scores'); });

		document.getElementById('id-high-scores-reset').addEventListener(
			'click',
			function() { resetScores = true; game.showScreen('high-scores');});
		
		document.getElementById('id-help').addEventListener(
			'click',
			function() { game.showScreen('help'); });
		
		document.getElementById('id-about').addEventListener(
			'click',
			function() { game.showScreen('about'); });
	}
	
	function run() {
		//
		// I know this is empty, there isn't anything to do.
	}
	
	return {
		initialize : initialize,
		run : run
	};
}(MyGame.game));
