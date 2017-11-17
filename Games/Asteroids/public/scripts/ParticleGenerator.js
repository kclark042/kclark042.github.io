MyGame.particleGenerator = (function(graphics){

	let generator = [];
	var that = {};
	//-----------------------------------------------------------------------------------------------------
	// Creates the particles used for a ship explosion and pushes them onto the particle system array
	//-----------------------------------------------------------------------------------------------------
	 that.createShipExplosions = function(elapsedTime, pos){
		var particlesFire = ParticleSystem( {
			image : 'textures/fire.png',
			center: {x:  pos.x, y: pos.y},
			speed: {mean: 90, stdev: 25},
			lifetime: {mean: 4, stdev: 1},
			totalParticleLifeTime : 43 * elapsedTime/1000,
		},
		graphics);

		var particlesSmoke = ParticleSystem( {
			image : 'textures/smoke.png',
			center: {x:  pos.x, y: pos.y},
			speed: {mean: 90, stdev: 25},
			lifetime: {mean: 4, stdev: 1},
			totalParticleLifeTime : 43 * elapsedTime/1000,
		},
		graphics);

		var shipParticles = ParticleSystem( {
			image : 'textures/spaceEffects_008.png',
			center: {x:  pos.x, y: pos.y},
			speed: {mean: 100, stdev: 1},
			lifetime: {mean: 16, stdev: 1},
			totalParticleLifeTime : 35 * elapsedTime/1000,
		},graphics);


		generator.push(shipParticles);
		generator.push(particlesFire);
		generator.push(particlesSmoke);
	}
	//-----------------------------------------------------------------------------------------------------
	// Creates the particles for an asteroid explosion and pushes them onto the array of particle systems
	//-----------------------------------------------------------------------------------------------------
	that.createAsteroidExplosion = function(asteroid, elapsedTime){
		var particlesFire = ParticleSystem( {
			image : 'textures/fire.png',
			center: {x:  asteroid.center.x + asteroid.ballRadius, y: asteroid.center.y + asteroid.ballRadius},
			speed: {mean: 50, stdev: 25},
			lifetime: {mean: 4, stdev: 1},
			totalParticleLifeTime : 20 * elapsedTime/1000,
		},
		graphics);

		var particlesSmoke = ParticleSystem( {
			image : 'textures/smoke.png',
			center: {x:  asteroid.center.x + asteroid.ballRadius, y: asteroid.center.y + asteroid.ballRadius},
			speed: {mean: 50, stdev: 25},
			lifetime: {mean: 4, stdev: 1},
			totalParticleLifeTime : 20 * elapsedTime/1000,
		},
		graphics);

		var asteroidParticles = ParticleSystem( {
			image : 'images/spaceMeteors_001.png',
			center: {x:  asteroid.center.x + asteroid.ballRadius, y: asteroid.center.y + asteroid.ballRadius},
			speed: {mean: 120, stdev: 1},
			lifetime: {mean: 16, stdev: 1},
			totalParticleLifeTime : 30 * elapsedTime/1000,
		},graphics);


		generator.push(asteroidParticles);
		generator.push(particlesFire);
		generator.push(particlesSmoke);
	}
	
	//-----------------------------------------------------
	// creates an particles for an enemy ship explosion
	//-----------------------------------------------------
	that.createEnemyShipExplosion = function(elapsedTime,pos){
		var particlesFire = ParticleSystem( {
			image : 'textures/fire.png',
			center: {x:  pos.x, y: pos.y},
			speed: {mean: 55, stdev: 25},
			lifetime: {mean: 4, stdev: 1},
			totalParticleLifeTime : 60 * elapsedTime/1000,
		},
		graphics);

		var particlesSmoke = ParticleSystem( {
			image : 'textures/smoke.png',
			center: {x:  pos.x, y: pos.y},
			speed: {mean: 50, stdev: 25},
			lifetime: {mean: 4, stdev: 1},
			totalParticleLifeTime : 30 * elapsedTime/1000,
		},
		graphics);

		generator.push(particlesFire);
		generator.push(particlesFire);

		generator.push(particlesSmoke);
	}

	that.update = function(elapsedTime){
		for(var i = 0; i < generator.length; i++){
			generator[i].update(elapsedTime);
			generator[i].create();
			generator[i].getSpecs().totalParticleLifeTime -= elapsedTime/1000;
			if(generator[i].getSpecs().totalParticleLifeTime <= 0){
				generator.splice(i,1);
			}
		}
	}

	that.render = function(elapsedTime){
		for(var i = 0; i < generator.length; i++){
			generator[i].render();
		}
	}

	return that;
}(MyGame.graphics));