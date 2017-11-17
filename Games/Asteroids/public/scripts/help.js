MyGame.screens['help'] = (function(game,spaceship,texture,graphics) {
	'use strict';
	let helpCanvas = document.getElementById('help-canvas');
	let context = helpCanvas.getContext('2d');

	let helpTexture = null;

	function initialize() {
	 helpTexture = graphics.Texture({
				image : 'images/spaceShips_001.png',
		});
	
		document.getElementById('id-help-back').addEventListener(
			'click',
			function() { game.showScreen('main-menu'); });
	}
	
	function run() {
		//
		// I know this is empty, there isn't anything to do.
		graphics.clear();
		//helpTexture.draw()
		// var pos = { x: helpCanvas.width/2, y: helpCanvas.height/2};
		// helpTexture.draw(pos, 0, 200, 200);
		context.font = "40px Palatino Linotype";
		context.fillStyle = "rgb(224,224,224)";
		context.textAlign = "center";
		context.fillText("How To Play ", helpCanvas.width-450, 50);
		var img = new Image();
		img.src = 'images/spaceShips_001.png';
	
		context.drawImage(img,60,130,40,40);
		context.font = "25px Palatino Linotype";

		context.fillText("Control the ship by rotating left, right, or accelerating. ", helpCanvas.width-360, 160);
		
		var asteroidImg = new Image();
		asteroidImg.src = 'images/spaceMeteors_001.png';

		context.drawImage(asteroidImg,25, 190, 100,100);
		context.fillText("Large Asteroids are worth 100 points and will split into two ", helpCanvas.width-330, 250);
		context.fillText("Medium asteroids when hit with a missle.", helpCanvas.width-360, 280);

		context.drawImage(asteroidImg,30,310, 80,80);
		context.fillText("Medium Asteroids are worth 50 points and will split into two ", helpCanvas.width-330, 350);
		context.fillText("Small asteroids when hit with a missle.", helpCanvas.width-360, 380);

		context.drawImage(asteroidImg,40,420, 50,50);
		context.fillText("Small Asteroids are worth 25 points and will", helpCanvas.width-420, 450);
		context.fillText("explode when hit with a missle.", helpCanvas.width-420, 480);

		var enemyImg = new Image();
		enemyImg.src = 'images/enemyShip.png';

		context.drawImage(enemyImg,35,540, 60,20);
		context.fillText("Small enemy ships move fast and ", helpCanvas.width-440, 540);
		context.fillText("will fire a missle in your direction. These are worth 300 points.", helpCanvas.width-380, 570);

		context.drawImage(enemyImg,30,620, 70,40);
		context.fillText("Large enemy ships move slowly and ", helpCanvas.width-460, 640);
		context.fillText("will fire randomly. These are worth 250 points.", helpCanvas.width-460, 670);

		var invincibleImg = new Image();
		invincibleImg.src = 'images/spaceShips_001_Invincible.png'

		context.drawImage(invincibleImg,30,720, 60,50);
		context.fillText("After you have been hit with a missle or crash into an asteroid, ", helpCanvas.width-360, 740);
		context.fillText("you will have a brief moment of invincibility.", helpCanvas.width-360, 770);

		context.fillText("Every 5000 points you will gain another life.", helpCanvas.width-400, 840);
	}
	
	return {
		initialize : initialize,
		run : run
	};
}(MyGame.game, MyGame.spaceship, MyGame.texture,MyGame.graphics));
