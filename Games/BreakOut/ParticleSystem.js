/*jslint browser: true, white: true */
/*global Random */

//------------------------------------------------------------------
//
// This is the particle system use by the game code
//
//------------------------------------------------------------------
function ParticleSystem(spec, graphics) {
	'use strict';
	var that = {},
		nextName = 0,	// unique identifier for the next particle
		particles = {},	// Set of all active particles
		maxParticles = 20;

	//------------------------------------------------------------------
	//
	// This creates one new particle
	//
	//------------------------------------------------------------------
	that.create = function() {
		var p = {
				fill: spec.fill.color,
				stroke: 'rgba(0, 0, 0, 1)',
				width: 10,
				height: 10,
				position: {x: spec.center.x, y: spec.center.y},
				direction: Random.nextCircleVector(),
				speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev), // pixels per second
				rotation: 0,
				lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),	// How long the particle should live, in seconds
				alive: 0,	// How long the particle has been alive, in seconds

			};
		//
		// Assign a unique name to each particle
		if(nextName < maxParticles){
			particles[nextName] = p;
			nextName++;
		}
		
	};
	
	//------------------------------------------------------------------
	//
	// Update the state of all particles.  This includes removing any that have exceeded their lifetime.
	//
	//------------------------------------------------------------------
	that.update = function(elapsedTime) {
		var removeMe = [],
			particle;
			
		//
		// We work with time in seconds, elapsedTime comes in as milliseconds
		elapsedTime = elapsedTime / 1000;
		
		Object.getOwnPropertyNames(particles).forEach(function(value, index, array) {
			particle = particles[value];
			//
			// Update how long it has been alive
			particle.alive += elapsedTime;
			
			//
			// Update its position
			particle.position.x += (elapsedTime * particle.speed * particle.direction.x);
			particle.position.y += (elapsedTime * particle.speed * particle.direction.y);
			
			//
			// Rotate proportional to its speed
			particle.rotation += particle.speed / 500;
			
			//
			// If the lifetime has expired, identify it for removal
			if (particle.alive > particle.lifetime) {
				removeMe.push(value);
			}
		});
		
		//
		// Remove all of the expired particles
		for (particle = 0; particle < removeMe.length; particle++) {
			delete particles[removeMe[particle]];
		}
		removeMe.length = 0;
	};
	
	//------------------------------------------------------------------
	//
	// Render all particles
	//
	//------------------------------------------------------------------
	that.render = function() {
		Object.getOwnPropertyNames(particles).forEach( function(value, index, array) {
			var particle = particles[value];
			graphics.drawRectangle(particle);
		});
	};
	
	return that;
}
