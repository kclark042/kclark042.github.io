MyGame.spaceship = (function(asteroids, graphics){
	'use strict';
	var canvas = document.getElementById('canvas-main'),
		context = canvas.getContext('2d');
	//laser audio found from https://opengameart.org/content/laser-fire
	// with credit to dklon
	let laserAudio = new Audio('audio/laser1.wav');
	laserAudio.volume = .1;

	function Spaceship(spec){
		var that = {};
		// used to set the image back to normal after the player ship is destroyed and is displaying the invincible ship
		var myTexture = graphics.Texture({
				image : 'images/spaceShips_001.png',
		});
		that.rotateRight = function(elapsedTime) {
			spec.rotation += spec.rotateRate * (elapsedTime / 1000);
		};

		that.rotateLeft = function(elapsedTime) {
			spec.rotation -= spec.rotateRate * (elapsedTime / 1000);
		};
		that.moveUp = function(elapsedTime) {
			
			spec.momentum.x += (spec.moveRate * (elapsedTime / 1000)) * Math.cos(spec.rotation);
			spec.momentum.y += (spec.moveRate * (elapsedTime / 1000)) * Math.sin(spec.rotation);

			var maxX = .15;
			var maxY = .15;
			var minX = -maxX;
			var minY = -maxY;

			if(spec.momentum.x >= maxX  ){
				spec.momentum.x = maxX;
			}
			else if(spec.momentum.x <= minX){
				spec.momentum.x = minX;;
			}
			if(spec.momentum.y >= maxY ){
				spec.momentum.y = maxY;
			}
			else if(spec.momentum.y <= minY){
				spec.momentum.y = minY;
			}

		};
		
		that.fire = function(elapsedTime,keypressed){
			var missleFired = false;
			if(keypressed){
				laserAudio.play();
				var x = Math.cos(spec.rotation) ;
				var y = Math.sin(spec.rotation) ;

				var newMissle = {
					x: spec.center.x ,
					y: spec.center.y ,
					rotation: spec.rotation,
					speed: 20,
					lifeTime: 60 * (elapsedTime/1000),
					radius: 5,
					momentum: {x:spec.momentum.x + x, y:spec.momentum.y + y},
				};

				MyGame.screens['game-play'].emitFriendlyMissle(newMissle);
				missleFired = true;
			}
			return missleFired;
		}
		that.update = function(elapsedTime){
			if(spec.reset == false){
				spec.center.x += spec.momentum.x * elapsedTime;
				spec.center.y += spec.momentum.y * elapsedTime;
				checkBoundary();
			}
			if(spec.invincible == true){
				spec.invincibleTime -= elapsedTime/1000;
				if(spec.invincibleTime <= 0){
					spec.invincible = false;
					spec.invincibleTime = 1.5;
					spec.texture = myTexture;
					spec.height -= 10;
					spec.width -= 20;
				}
			}
		};
		function checkBoundary(){
			if(spec.center.y  < 0 ){
				spec.center.y = canvas.height;
			}
			if(spec.center.y > canvas.height){
				spec.center.y = 0;
			}
			if(spec.center.x < 0){
				spec.center.x = canvas.width;
			}
			if(spec.center.x > canvas.width){
				spec.center.x = 0;
			}
		}
		that.draw = function(){
			spec.texture.draw(spec.center, spec.rotation, spec.width, spec.height);
		}
		that.getSpecs = function(){
			return spec;
		}
	return that;
	}
	return{
		Spaceship : Spaceship
	}
}(MyGame.asteroids, MyGame.graphics));