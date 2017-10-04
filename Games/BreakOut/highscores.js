MyGame.screens['high-scores'] = (function(game) {
	'use strict';
	
	function initialize() {
		game.prevHighScores = localStorage.getItem('highScores');

	  if(game.prevHighScores !== null){
	  	game.highScores = JSON.parse(game.prevHighScores);
	  }

		document.getElementById('id-high-scores-back').addEventListener(
			'click',
			function() { game.showScreen('main-menu'); });
	}
	
	function run() {
		if(resetScores){
			game.highScores = [0,0,0,0,0];
			localStorage['highScores'] = JSON.stringify(game.highScores);
			resetScores = false;
		}
		var node = document.getElementById('highScores');
		node.innerHTML = '';
		node.innerHTML = '<br/>'
		for(var i = 0; i < game.highScores.length; i++){	
			node.innerHTML += i+1+'.  '+game.highScores[i]+'<br/>';	

		}
	}
	
	return {
		initialize : initialize,
		run : run
	};
}(MyGame.game));
