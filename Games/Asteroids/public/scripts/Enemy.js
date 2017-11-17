MyGame.enemy = (function(){
	'use strict';
	var canvas = document.getElementById('canvas-main'),
		context = canvas.getContext('2d');
	function Enemy(spec){
		var that = {};
		var laser = [];
		that.initEnemy = function(){

		}

		that.draw = function(){
			if(spec.hit == false){
				spec.texture.draw(spec.center, spec.rotation, spec.width, spec.height);
			}
		}

		that.getSpecs = function(){
			return spec;
		}

		that.update = function(elapsedTime, playerPos){
			if(spec.hit == false){
				if(spec.center.x < canvas.width+spec.width){
					var x = Math.cos(spec.rotation) ;
					var y = Math.sin(spec.rotation) ;

					var newMissle = {
						x: spec.center.x ,
						y: spec.center.y ,
						rotation: Random.nextRange(0,360),
						speed : spec.speed ,
						lifeTime: 30 * (elapsedTime/1000),
						playerPosition : playerPos,
						fireType : spec.type,
						radius : 5,
						collisionWithPlayer : false,
						momentum: {x: spec.momentum.x, y: spec.momentum.y},
					};


					spec.center.x += ((spec.speed * (elapsedTime / 1000)) * Math.cos(spec.rotation)) * elapsedTime;
					spec.center.y += ((spec.speed * (elapsedTime / 1000)) * Math.sin(spec.rotation)) * elapsedTime;
					MyGame.screens['game-play'].emitEnemyMissle(elapsedTime, newMissle);
				}
				else{
					spec.reachedEndOfScreen = true;
				}
			}
		}
		return that;
	}
	return{
		Enemy : Enemy,
	}
}());