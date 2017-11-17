MyGame.screens['options'] = (function(game, input) {
	'use strict';
	
	function initialize() {
		var fireChar = localStorage.getItem('fireChar');
		var rotateLeftChar =  localStorage.getItem('rotateLeftChar');
		var rotateRightChar = localStorage.getItem('roateRightChar');
		var accelChar = localStorage.getItem('accelChar');


		document.getElementById('fire').value = fireChar;
		document.getElementById('rotateLeft').value = rotateLeftChar;
		document.getElementById('roateRight').value = rotateRightChar;
		document.getElementById('accel').value = accelChar;



		document.getElementById('id-options-back').addEventListener(
			'click',
			function() { game.showScreen('main-menu'); });
	}

	function getInput(event, id){
		//makes sure that the input is between 0 and z or the arrow keys
		if((event.keyCode >= KeyEvent.DOM_VK_0 && event.keyCode <= KeyEvent.DOM_VK_Z) 
			|| (event.keyCode >= KeyEvent.DOM_VK_LEFT && event.keyCode <= KeyEvent.DOM_VK_DOWN)){
			
			if(event.keyCode >= KeyEvent.DOM_VK_LEFT && event.keyCode <= KeyEvent.DOM_VK_DOWN){
				localStorage[id+'Key'] = JSON.stringify(event.keyCode );
				
				if(event.keyCode == KeyEvent.DOM_VK_LEFT){
					localStorage[id+'Char'] = "Left Arrow";
					document.getElementById(id).value = "Left Arrow";

				}
				else if(event.keyCode == KeyEvent.DOM_VK_RIGHT){
					localStorage[id+'Char'] = "Right Arrow";
					document.getElementById(id).value = "Right Arrow";
				}
				else if(event.keyCode == KeyEvent.DOM_VK_UP){
					localStorage[id+'Char'] = "Up Arrow";
					document.getElementById(id).value = "Up Arrow";
				}
				else{
					localStorage[id+'Char'] = "Down Arrow";
					document.getElementById(id).value= "Down Arrow";
				}
				MyGame.screens['game-play'].initKeyboard();
			}
			else{
				var text = document.getElementById(id).value;
				document.getElementById(id).value = text[text.length-1];

				localStorage[id+'Key'] = JSON.stringify(event.keyCode );
				localStorage[id+'Char'] = text[text.length-1];
				MyGame.screens['game-play'].initKeyboard();
			}

		}	
		else{
			document.getElementById(id).value = localStorage.getItem(id+'Char');
		}
	}

	function run(){
	}
	
	return {
		initialize : initialize,
		run : run,
		getInput : getInput,
	};
}(MyGame.game, MyGame.input));