MyGame.asteroids = (function(graphics){
	'use strict';
	var canvas = document.getElementById('canvas-main'),
		context = canvas.getContext('2d');
	let asteroids = [];
	let asteroidTexture = [];
	var numAsteroids = 0;
	var randRotation = 0;
	var randTexture = 0;
	var circleVector = 0;

	function Asteroids(){
		var that  = {};

		that.initAsteroids = function(){
			//asteroidTexture = null;
			asteroids = [];
			var asteroidTexture1 = graphics.Texture({
				image: 'images/spaceMeteors_001.png',
			});
			asteroidTexture.push(asteroidTexture1);

			var asteroidTexture2= graphics.Texture({
				image: 'images/spaceMeteors_002.png',
			});
			asteroidTexture.push(asteroidTexture2);

			var asteroidTexture3 = graphics.Texture({
				image: 'images/spaceMeteors_003.png',
			});
			asteroidTexture.push(asteroidTexture3);

			var asteroidTexture4 = graphics.Texture({
				image: 'images/spaceMeteors_004.png',
			});
			asteroidTexture.push(asteroidTexture4);


		  numAsteroids = Random.nextRange(1,2);
			randRotation = Random.nextRange(2,4);
			randTexture = Random.nextRange(0,3);
			circleVector = Random.nextCircleVector();

			createLargeAsteroids(numAsteroids, randRotation, randTexture, circleVector);

			numAsteroids = Random.nextRange(1,2);
			randRotation = Random.nextRange(2,4);
			randTexture = Random.nextRange(0,3);
			circleVector = Random.nextCircleVector();
			createMediumAsteroids(numAsteroids, randRotation, randTexture, circleVector);

			numAsteroids = Random.nextRange(1,2);
			randRotation = Random.nextRange(2,4);
			randTexture = Random.nextRange(0,3);
			circleVector = Random.nextCircleVector();
			createSmallAsteroids(numAsteroids, randRotation, randTexture, circleVector);
		}
		that.getAsteroids = function(){
			return asteroids;
		}

		
		//--------------------------------------------
		// Makes one or two large and slow asteroids
		//--------------------------------------------
		function createLargeAsteroids(numAsteroids, randRotation, randTexture,circleVector){
			for(var i = 0; i < numAsteroids; i++){
				var singleAsteroid = {
					texture: asteroidTexture[randTexture],
					dx: circleVector.x,
					dy: circleVector.y,
					speed: 1,
					type: 'large',
					rotation: 0,
					center: {x:Random.nextRange(0, canvas.width/2), y:Random.nextRange(0,canvas.height/2)},
					width: 100,
					height: 100,
					ballRadius: 50,
					rotateRate : 3.14159 / randRotation,
					asteroidPoints : 100,
				};
				asteroids.push(singleAsteroid);
			}	
		}

		function createMediumAsteroids(numAsteroids, randRotation, randTexture,circleVector){
			for(var i = 0; i < numAsteroids; i++){
				var singleAsteroid = {
					//texture: asteroidTexture,
					texture: asteroidTexture[randTexture],
					center : {x: Random.nextRange(0, (canvas.width/2)), y:Random.nextRange(0,canvas.height/2)},
					dx: circleVector.x,
					dy: circleVector.y,
					speed: 2,
					type: 'medium',
					width: 80,
					height: 80,
					ballRadius: 40,
					rotation: 0,
					rotateRate : 3.14159 / randRotation,
					asteroidPoints : 50,
				};
				asteroids.push(singleAsteroid);
			}
		}

		function createSmallAsteroids(numAsteroids, randRotation, randTexture, circleVector){
			for(var i = 0; i < numAsteroids; i++){
				var singleAsteroid = {
					texture: asteroidTexture[randTexture],
					center : {x: Random.nextRange(0, (canvas.width/2)), y:Random.nextRange(0,canvas.height/2)},
					dx: circleVector.x,
					dy: circleVector.y,
					speed: 3,
					type : 'small',
					width: 50,
					height: 50,
					ballRadius: 25,
					rotation: 0,
					rotateRate : 3.14159 / randRotation,
					asteroidPoints : 25,
				};
				asteroids.push(singleAsteroid);
			}
		}

		that.checkAsteroidType = function(asteroid,i){
			var circleVector1 = Random.nextCircleVector();
			var circleVector2 = Random.nextCircleVector();
			var randTexture = Random.nextRange(0,3);

			var randRotation1 = Random.nextRange(2,4);
			var randRotation2 = Random.nextRange(2,4);

			if(asteroid.type == 'large'){
				var asteroid1 = {
					//texture: asteroidTexture,
					texture: asteroidTexture[randTexture],
					center : {x: asteroid.center.x, y: asteroid.center.y},
					dx: circleVector1.x,
					dy: circleVector1.y,
					speed: 2,
					type: 'medium',
					width: 80,
					height: 80,
					ballRadius: 40,
					rotation: 0,
					rotateRate : 3.14159 / randRotation1,
					asteroidPoints : 50,
				};
				var asteroid2 = {
					//texture: asteroidTexture,
					texture: asteroidTexture[randTexture],
					center : {x: asteroid.center.x, y: asteroid.center.y},
					dx: circleVector2.x,
					dy: circleVector2.y,
					speed: 2,
					type: 'medium',
					width: 80,
					height: 80,
					ballRadius: 40,
					rotation: 0,
					rotateRate : 3.14159 / randRotation2,
					asteroidPoints : 50,
				};
				asteroids.splice(i,1);
				asteroids.push(asteroid1);
				asteroids.push(asteroid2);
			}
			else if(asteroid.type == 'medium'){
				var asteroid1 = {
					//texture: asteroidTexture,
					texture: asteroidTexture[randTexture],
					center : {x: asteroid.center.x, y: asteroid.center.y},
					dx: circleVector1.x,
					dy: circleVector1.y,
					speed: 3,
					type: 'small',
					width: 50,
					height: 50,
					ballRadius: 25,
					rotation: 0,
					rotateRate : 3.14159 / randRotation1,
					asteroidPoints : 25,
				};
				var asteroid2 = {
					//texture: asteroidTexture,
					texture: asteroidTexture[randTexture],
					center : {x: asteroid.center.x, y: asteroid.center.y},
					dx: circleVector2.x,
					dy: circleVector2.y,
					speed: 3,
					type: 'small',
					width: 50,
					height: 50,
					ballRadius: 25,
					rotation: 0,
					rotateRate : 3.14159 / randRotation2,
					asteroidPoints : 25,
				};
				asteroids.splice(i,1);
				asteroids.push(asteroid1);
				asteroids.push(asteroid2);
			}
			else{
				asteroids.splice(i,1);
			}
		}

		that.draw = function(){
			for(var i = 0; i < asteroids.length; i++){
		    asteroids[i].texture.draw(asteroids[i].center, asteroids[i].rotation, asteroids[i].width, asteroids[i].height);
			}
		}

		that.update = function(elapsedTime){
			//base on momentum eventually
			for(var i = 0; i < asteroids.length; i++){
				asteroids[i].center.x += asteroids[i].dx * asteroids[i].speed;
				asteroids[i].center.y += asteroids[i].dy * asteroids[i].speed;

				if(asteroids[i].center.y  < 0 ){
					asteroids[i].center.y = canvas.height;
				}
				if(asteroids[i].center.y > canvas.height){
					asteroids[i].center.y = 0;
				}
				if(asteroids[i].center.x < 0){
					asteroids[i].center.x = canvas.width;
				}
				if(asteroids[i].center.x > canvas.width){
					asteroids[i].center.x = 0;
				}
				asteroids[i].rotation += asteroids[i].rotateRate * (elapsedTime / 1000);
			}
			if(asteroids.length == 0){
				that.initAsteroids();
			}
		}

		return that;
	}
	return{
		Asteroids : Asteroids
	}
}(MyGame.graphics));