MyGame.screens['high-scores'] = (function(game,scoreHandler) {
	'use strict';
	
	function initialize() {
		document.getElementById('id-high-scores-back').addEventListener(
			'click',
			function() { game.showScreen('main-menu'); });
	}
	
	function run() {
		var node = document.getElementById('highScores');
		node.innerHTML = '';
		node.innerHTML = '<br/>'

		for(var i = 0; i < scoreHandler.getHighScores().length; i++){	
			node.innerHTML += i+1+'.  '+scoreHandler.getHighScores()[i].name+' '+scoreHandler.getHighScores()[i].score+'<br/>';	
		}
	}
	
	return {
		initialize : initialize,
		run : run
	};
}(MyGame.game, MyGame.scoreHandler));
