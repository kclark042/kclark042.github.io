MyGame.screens['game-play'] = (function(game,graphics, input, spaceship, enemy, asteroids, scoreHandler,particleGenerator) {
	'use strict';

	let canvas = document.getElementById('canvas-main');
	let context = canvas.getContext('2d');
	let cancelNextRequest = false;
	let lastTimeStamp = 0;

	var myKeyboard = input.Keyboard();
	let myTexture = null;
	let myShip = null;
	let myAsteroid = null;

	let enemyTexture = null;
	let enemyShip = null;
	let enemyMissles = [];
	let friendlyMissles = [];

	let spawnEnemyTime = null;
	let particles = null;
	let stars = [];
	let resetTime = 1.5;
	let invincibleTime = 1.5;
	let invincibleTexture = null;
	let gamePaused = false;
	let particleArray = [];
	let particlesFire = null;
	let particlesSmoke = null;

	let score = 0;
	let updateScoreCounter = 0;
	let gameOver = false;
	let addLifeRunningTotal = 0;
	let gameTerminated = false; //used to quit and start a new game
	let checkHighScores = false;

	let enterName = false;
	let waitForNameConfirmation = false;
	let userName = "";
	let displayName = "";
	let highScoreLocation = -1;


	
	//laser audio found from https://opengameart.org/content/laser-fire
	// with credit to dklon
	let enemyMissleAudio = new Audio('audio/laser3.wav');
	enemyMissleAudio.volume = .1;

	//audio files, player spaceship image, and asteroids image found here:
	//http://www.kenney.nl/
	let playerShipDestroyedAudio = new Audio('audio/spaceTrash2.mp3');
	playerShipDestroyedAudio.volume = 1;

	let asteroidCollisionAudio = new Audio('audio/laser3.mp3');
	asteroidCollisionAudio.volume = 1;

	let enemyDestoryedAudio = new Audio('audio/spaceTrash4.mp3');
	enemyDestoryedAudio.volume = 1;

	var livesTexture = graphics.Texture({
		image : 'images/spaceShips_001.png',
	});
	//---------------------------------------------------------------------------------------
	//initializes the keyboard
	//gets any mapped keys from the local storage and sets default keys if there are none
	//---------------------------------------------------------------------------------------
	function initKeyboard(){
		myKeyboard = null;
		myKeyboard = input.Keyboard();

		var fireKey = JSON.parse(localStorage.getItem('fireKey'));
		var rotateLeftKey =  JSON.parse(localStorage.getItem('rotateLeftKey'));
		var rotateRightKey = JSON.parse(localStorage.getItem('roateRightKey'));
		var accelKey = JSON.parse(localStorage.getItem('accelKey'));


		if(fireKey != null){
			myKeyboard.registerCommand(fireKey, myShip.fire);
		}
		else{
			localStorage['fireKey'] = JSON.stringify(KeyEvent.DOM_VK_W);
			localStorage['fireChar'] = 'w';
			myKeyboard.registerCommand(KeyEvent.DOM_VK_W, myShip.fire);
		}

		if(rotateLeftKey != null){
			myKeyboard.registerCommand(rotateLeftKey, myShip.rotateLeft);
		}
		else{
			localStorage['rotateLeftKey'] = JSON.stringify(KeyEvent.DOM_VK_A);
			localStorage['rotateLeftChar'] = 'a';
			myKeyboard.registerCommand(KeyEvent.DOM_VK_A, myShip.rotateLeft);
		}

		if(rotateRightKey != null){
			myKeyboard.registerCommand(rotateRightKey, myShip.rotateRight);
		}
		else{
			localStorage['roateRightKey'] = JSON.stringify(KeyEvent.DOM_VK_D);
			localStorage['roateRightChar'] = 'd';
			myKeyboard.registerCommand(KeyEvent.DOM_VK_D, myShip.rotateRight);
		}

		if(accelKey != null){
			myKeyboard.registerCommand(accelKey, myShip.moveUp);
		}
		else{
			localStorage['accelKey'] = JSON.stringify(KeyEvent.DOM_VK_S);
			localStorage['accelChar'] = 's';
			myKeyboard.registerCommand(KeyEvent.DOM_VK_S, myShip.moveUp);
		}
		//register escape key for exit game
		myKeyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE,pauseGame);

		
				
	}

	function quitGame(){
		game.showScreen('main-menu');
		gameTerminated = true;
	}
	function continueGame(){
		if(gamePaused){
			gamePaused = false;
		}
	}

	function newGame(){
		initialize();
	}
	function pauseGame(){
		gamePaused = true;
	}
	//---------------------------------------------
	//initilizes the canvas and the player ship, asteroids, and stars
	//---------------------------------------------
	function initialize() {
		cancelNextRequest = false;
		lastTimeStamp = 0;
	  myKeyboard = null;
	  myTexture = null;
	  myShip = null;
	  myAsteroid = null;
	  enemyTexture = null;
	  enemyShip = null;
	  enemyMissles = [];
	  friendlyMissles = [];
	  spawnEnemyTime = null;
	  particles = null;
	  stars = [];
	  resetTime = 1.5;
	  invincibleTime = 1.5;
	  invincibleTexture = null;
	  gamePaused = false;

		score = 0;
	  updateScoreCounter = 0;
	  gameOver = false;
	  addLifeRunningTotal = 0;
	  gameTerminated = false;

	  checkHighScores = false;

	  enterName = false;
	  waitForNameConfirmation = false;
	  userName = "";
	  displayName = "";
	  highScoreLocation = -1;

		canvas = document.getElementById('canvas-main'),
		context = canvas.getContext('2d');

		lastTimeStamp = performance.now(),
		myTexture = graphics.Texture({
				image : 'images/spaceShips_001.png',
		}),
		enemyTexture = graphics.Texture({
			image : 'images/enemyShip.png',
		}),
		invincibleTexture = graphics.Texture({
			image : 'images/spaceShips_001_Invincible.png',
		}),
		myShip = spaceship.Spaceship({
			texture : myTexture,
			center : { x : canvas.width/2, y : canvas.height/2  }, 
			momentum : {x: 0, y: 0},
			width : 40, height : 40,
			rotation : 0,
			moveRate : 2,			// pixels per second
			rotateRate : 3.14159 * 2,	// Radians per second
			radius : 25,
			lives : 3,
			reset : false,
			hit : false,
			invincible : false,
			invincibleTime : 1.5,
			addLife : false,
		});

		spawnEnemyTime = Random.nextRange(5, 10);
		myAsteroid = asteroids.Asteroids();

		myAsteroid.initAsteroids();
	  initKeyboard();

	  for (var i = 0; i < 500; i++) {
		  stars[i] = {
		    x: Math.random() * canvas.width,
		    y: Math.random() * canvas.height,
		    radius: Math.sqrt(Math.random() * 2),
		    alpha: 1.0,
		    decreasing: true,
		    dRatio: Math.random()*0.05
		  };
		}
	}

	function updateEnemySpawn(elapsedTime){
		if(spawnEnemyTime <= 0 && enemyShip == null){
			var enemyType = Random.nextRange(1,2);
			if(enemyType == 1){ // small and accurate ship
				enemyShip = enemy.Enemy({
					texture : enemyTexture,
					center : { x : 0, y : Random.nextRange(20, (canvas.height) - 20)},  
					momentum : {x: 0, y: 0},
					width : 60, height : 20,
					rotation : 0,
					moveRate : 2,			// pixels per second
					rotateRate : 3.14159 * 2,	// Radians per second
					reachedEndOfScreen : false,
					speed : 12,
					hit : false,
					type : enemyType,
					fireCounter : .8,
					playerPosition : myShip.getSpecs().center,
					radius : 40,
					enemyPoints : 300,
				});
			}
			else{// large and clumsy
				enemyShip = enemy.Enemy({// coundown and then make enemy
					texture : enemyTexture,
					center : { x : 0, y : Random.nextRange(40, (canvas.height) -40)},  
					momentum : {x: 0, y: 0},
					width : 70, height : 40,
					rotation : 0,
					moveRate : 2,			// pixels per second
					rotateRate : 3.14159 * 2,	// Radians per second
					reachedEndOfScreen : false,
					speed : 10,
					hit : false,
					type : enemyType,
					fireCounter : .4,
					playerPosition : myShip.getSpecs().center,
					radius : 60,
					enemyPoints : 250,
				});
			}
			
		}
		else{ //if it is not time to spawn a new enemy, decrease the counter
			spawnEnemyTime -= elapsedTime/1000;
		}
		if(enemyShip != null){ // if an enemy ship has been set
			if(enemyShip.getSpecs().reachedEndOfScreen == true){//if the enemy has reached the other side of the screen
				spawnEnemyTime = Random.nextRange(5, 10);// reset the spawn variable
				enemyShip = null; //delete the old ship
			}
		}
	}

	
//----------------------------------------------------------------------------------------
//																	Enemy Missle Functions
//----------------------------------------------------------------------------------------

	//-----------------------------------------------
	// Renders the enemy missles if there are any
	//-----------------------------------------------
	function renderEnemyMissle(){
		if(enemyMissles.length > 0){
			for(var i = 0; i < enemyMissles.length; i++){
				context.save();
				context.fillStyle="red";
			  context.fillStroke="red";
			  context.translate(enemyMissles[i].x, enemyMissles[i].y);
			  context.rotate(enemyMissles[i].rotation);
			  context.translate(-enemyMissles[i].x, -enemyMissles[i].y);
				context.fillRect(enemyMissles[i].x, enemyMissles[i].y, 10, 5);
	    	context.restore();
			}
		}	
	}
	//-------------------------------------------------------------------------------------------------------------
	// if the enemy is small and smart, the new position of the enemy fire will be based on the player position
	// otherwise the new position will be based on the random direction set in the enemy file
	// also takes the missle object out of the array if the lifetime is less than 0
	//-------------------------------------------------------------------------------------------------------------
	function updateEnemyMissle(elapsedTime){
		for(var i = 0; i < enemyMissles.length; i++){
			if(enemyMissles[i].fireType == 1 && myShip.getSpecs().reset == false){
				var xDiff = myShip.getSpecs().center.x - enemyMissles[i].x;
				var yDiff = myShip.getSpecs().center.y - enemyMissles[i].y;
				var theta = Math.atan2(yDiff, xDiff) ;
				enemyMissles[i].rotation = theta;
			}

			var x = Math.cos(enemyMissles[i].rotation) ;
			var y = Math.sin(enemyMissles[i].rotation) ;

			enemyMissles[i].momentum.x +=  x;
			enemyMissles[i].momentum.y +=  y;
			
			enemyMissles[i].x += enemyMissles[i].momentum.x * (13 * (elapsedTime /1000));
			enemyMissles[i].y += enemyMissles[i].momentum.y * (13 * (elapsedTime /1000));

			enemyMissles[i].lifeTime -= elapsedTime/1000;
			enemyMissleCollisionDetection(enemyMissles[i], elapsedTime);
			if(enemyMissles[i].lifeTime <= 0 || enemyMissles[i].collisionWithPlayer == true){
				enemyMissles.splice(i,1);
			}
		}
	}
	//-----------------------------------------------------------------------------------------------------------------
	// the fire counter is updated and if it is less than 0 then the enemy ship can fire another laser.
	// plays the enemy missle sound, adds it to the missle array, and then resets the counter in order to fire again
	//-----------------------------------------------------------------------------------------------------------------
	function emitEnemyMissle(elapsedTime,item){
		enemyShip.getSpecs().fireCounter -=elapsedTime/1000;;
		if(enemyShip.getSpecs().fireCounter <= 0){
			
			enemyMissleAudio.play(); 
			enemyMissles.push(item);
			enemyShip.getSpecs().fireCounter  = .5;
		}
	}
	//-----------------------------------------------------------------------------------------
	// checks to see if there is a collision with the enemy missle and the player ship
	// if there is a collision, the player ship is reset and the number of lives is decreased
	//-----------------------------------------------------------------------------------------
	function enemyMissleCollisionDetection(missle,elapsedTime){
		var xDiff = myShip.getSpecs().center.x - missle.x;
		var yDiff = myShip.getSpecs().center.y - missle.y;
		var distance = Math.sqrt((xDiff * xDiff) + (yDiff*yDiff)); 

		if(distance < myShip.getSpecs().radius + missle.radius){
	
			particleGenerator.createShipExplosions(elapsedTime, myShip.getSpecs().center);

			missle.collisionWithPlayer = true;
			myShip.getSpecs().hit = true;

			myShip.getSpecs().center.x = canvas.width+20;
			myShip.getSpecs().center.y = canvas.height+20;
			myShip.getSpecs().reset = true;
			playerShipDestroyedAudio.play();
			
		}
	}

//----------------------------------------------------------------------------------------
//																	Player Missle Functions
//----------------------------------------------------------------------------------------

	//-----------------------------------------------
	// Renders the player missles if there are any
	//-----------------------------------------------
	function renderFriendlyMissle(){
		if(friendlyMissles.length > 0){
			for(var i = 0; i < friendlyMissles.length; i++){
				context.save();
				context.fillStyle="green";
			  context.fillStroke="green";
			  context.translate(friendlyMissles[i].x, friendlyMissles[i].y);
			  context.rotate(friendlyMissles[i].rotation);
			  context.translate(-friendlyMissles[i].x, -friendlyMissles[i].y);
				context.fillRect(friendlyMissles[i].x, friendlyMissles[i].y, 10, 5);
	    	context.restore();
			}
		}
	}

	//--------------------------------------------------------------------------------------
	// updates the position of the friendly lasers as well as the lifetime of the laser
	// calls the collision detection method 
	// deletes the laser if it's lifetime is over
	//--------------------------------------------------------------------------------------
	function updateFriendlyMissle(elapsedTime){
		for(var i = 0; i < friendlyMissles.length; i++){
			friendlyMissles[i].x += friendlyMissles[i].momentum.x * (260*elapsedTime /1000);
			friendlyMissles[i].y += friendlyMissles[i].momentum.y * (260*elapsedTime /1000);

			friendlyMissles[i].lifeTime -= elapsedTime/1000;
			friendlyMisslesCollisionDetection(friendlyMissles[i],elapsedTime);
			if(friendlyMissles[i].lifeTime <= 0){
				friendlyMissles.splice(i,1);
			}
		}
	}

	//----------------------------------------------------
	// adds a laser to the array of friendly fire lasers
	//----------------------------------------------------
	function emitFriendlyMissle(item){
			friendlyMissles.push(item);
	}

	//-----------------------------------------------------------------------------------
	// checks for collision with the player's laser and an asteroid or an enemy ship
	//-----------------------------------------------------------------------------------
	function friendlyMisslesCollisionDetection(missle,elapsedTime){
		for(var i = 0; i < myAsteroid.getAsteroids().length; i++){
			var asteroid = myAsteroid.getAsteroids()[i];

			var xDiff = missle.x - asteroid.center.x;
			var yDiff = missle.y - asteroid.center.y;

			var distance = Math.sqrt((xDiff * xDiff) + (yDiff*yDiff));

			if(distance < missle.radius + asteroid.ballRadius){
				asteroidCollisionAudio.play(); 
				asteroidCollisionAudio.play(); 
				particleGenerator.createAsteroidExplosion(asteroid, elapsedTime);

				addToScore(asteroid.asteroidPoints);
				myAsteroid.checkAsteroidType(asteroid,i);
			}
		}
		if(enemyShip != null){
			var xDiff = missle.x - enemyShip.getSpecs().center.x;
			var yDiff = missle.y - enemyShip.getSpecs().center.y;

			var distance = Math.sqrt((xDiff * xDiff) + (yDiff*yDiff));

			if(distance < missle.radius + enemyShip.getSpecs().radius){
				enemyShip.getSpecs().hit = true;


				particleGenerator.createEnemyShipExplosion(elapsedTime,enemyShip.getSpecs().center);
				spawnEnemyTime = Random.nextRange(5, 10);

				addToScore(enemyShip.getSpecs().enemyPoints);
				
				enemyShip = null;
				enemyDestoryedAudio.play();
			}
		}
	}

	//--------------------------------------------------------------
	// checks for collision with the player's ship and an asteroid
	// will take away a player's life if collision occurs
	//--------------------------------------------------------------
	function playerShipAndAsteroidCollisionDetection(elapsedTime){
		if(myShip.getSpecs().invincible == false){
			for(var i = 0; i < myAsteroid.getAsteroids().length; i++){
				var asteroid = myAsteroid.getAsteroids()[i];
				var xDiff = myShip.getSpecs().center.x - asteroid.center.x;
				var yDiff = myShip.getSpecs().center.y - asteroid.center.y;

				var distance = Math.sqrt((xDiff * xDiff) + (yDiff*yDiff));

				if(distance < myShip.getSpecs().radius-10 + asteroid.ballRadius){
					
					particleGenerator.createShipExplosions(elapsedTime,myShip.getSpecs().center);


					myShip.getSpecs().hit = true;
					myShip.getSpecs().center.x = canvas.width+20;
					myShip.getSpecs().center.y = canvas.height+20;
					myShip.getSpecs().reset = true;
					playerShipDestroyedAudio.play();
				}
			}
		}
	}

	//--------------------------------------------------------------
	// checks for collison with the player ship and the enemy ship
	// will take away a player's life if collision occurs
	//--------------------------------------------------------------
	function playerShipAndEnemyCollisionDetection(elapsedTime){
		var xDiff = myShip.getSpecs().center.x - enemyShip.getSpecs().center.x;
		var yDiff = myShip.getSpecs().center.y - enemyShip.getSpecs().center.y;
		var distance = Math.sqrt((xDiff * xDiff) + (yDiff*yDiff));

		if(distance < myShip.getSpecs().radius + enemyShip.getSpecs().radius){
			
			particleGenerator.createShipExplosions(elapsedTime,myShip.getSpecs().center);

			myShip.getSpecs().hit = true;
			myShip.getSpecs().center.x = canvas.width+20;
			myShip.getSpecs().center.y = canvas.height+20;
			myShip.getSpecs().reset = true;
			playerShipDestroyedAudio.play();
		}
	}
	
	function processInput(elapsedTime) {
		myKeyboard.update(elapsedTime);
	}

	//--------------------------------------------------------------------------------------------------
	// Updates the score by 10 every interval so long as the player ship is not destroyed or invincible
	//--------------------------------------------------------------------------------------------------
	function updateScore(elapsedTime){
		if(!myShip.getSpecs().hit && !myShip.getSpecs().invincible){
			var oldCounter = Math.floor(updateScoreCounter);
			updateScoreCounter += elapsedTime/1000;
			var newCounter = Math.floor(updateScoreCounter);

			if(newCounter == oldCounter + 1){
				addToScore(10);
			}
		}
	}

	//---------------------------------------------------------------------
	// If the player is out of lives then set the game to being over and 
	// trigger the check to see if the player got a new high score
	//---------------------------------------------------------------------
	function updateGameOver(elapsedTime){
		if(myShip.getSpecs().lives < 0 ){
			gameOver = true;
			checkHighScores = true;
		}
	}

	//---------------------------------------------------------------------------
	// adds any points from asteroids or enemy ships to the player score and
	// the running total (which is used to see if the player gets another life)
	//---------------------------------------------------------------------------
	function addToScore(points){
		score += points;
		addLifeRunningTotal += points;
	}

	//------------------------------------------------------------------------
	// Adds another life to the player if they have accumulated 5000 points
	// resets the running total so it can be used again 
	//------------------------------------------------------------------------
	function checkForMoreLives(elapsedTime){
		if(addLifeRunningTotal >= 5000){
			myShip.getSpecs().lives += 1;
			addLifeRunningTotal = 0;
		}
	}

	//------------------------------------------------
	// main update function
	// only updates the enemy ship if it is spawned
	//------------------------------------------------
	function update(elapsedTime) {
		
		myAsteroid.update(elapsedTime);
		
		
		myShip.update(elapsedTime,emitFriendlyMissle);

		playerShipAndAsteroidCollisionDetection(elapsedTime);

		if(enemyShip != null){
			enemyShip.update(elapsedTime,myShip.getSpecs().center, emitEnemyMissle);
			playerShipAndEnemyCollisionDetection(elapsedTime);
		}

		updateFriendlyMissle(elapsedTime);
		updateEnemyMissle(elapsedTime);
		updateEnemySpawn(elapsedTime);

		particleGenerator.update(elapsedTime);

		updateScore(elapsedTime);
		updateGameOver(elapsedTime);
		checkForMoreLives(elapsedTime);
		updateHighScores(elapsedTime);
	}

	//---------------------------------------------------------------------
	// Rendering for the stars found here:
	// http://students.cs.ucl.ac.uk/schoolslab/projects/HT5/index.html
	//---------------------------------------------------------------------
	function renderStars() 
	{
	  context.save();
	  context.fillStyle = "#111"
	  context.fillRect(0, 0, canvas.width, canvas.height);
	  for (var i = 0; i < stars.length; i++) {
	    var star = stars[i];
	    context.beginPath();
	    context.arc(star.x, star.y, star.radius, 0, 2*Math.PI);
	    context.closePath();
	    context.fillStyle = "rgba(255, 255, 255, " + star.alpha + ")";
	    if (star.decreasing == true)
	    {
	      star.alpha -= star.dRatio;
	      if (star.alpha < 0.1)
	      { star.decreasing = false; }
	    }
	    else
	    {
	      star.alpha += star.dRatio;
	      if (star.alpha > 0.95)
	      { star.decreasing = true; }
	    }
	    context.fill();
	  }
	  context.restore();
	}

	//-------------------------------
	// Renders the continue message 
	//-------------------------------
	function renderPauseMenu(elapsedTime){
		if(gamePaused){
			context.font = "30px Palatino Linotype";
			context.fillStyle = "white";
			context.textAlign = "center";
			context.fillText("Continue? y/n", canvas.width/2, canvas.height/2);
		}
	}

	function renderScore(elapsedTime){
		context.font = "30px Palatino Linotype";
		context.fillStyle = "white";
		context.textAlign = "center";
		context.fillText(score.toString(), 75, 35);
	}

	function renderLives(elapsedTime){
		for(var i = 1; i <= myShip.getSpecs().lives; i++){
  		var center = {x: i*40, y: 60};
  		livesTexture.draw(center, 0, 20, 20);
		}
	}

	function renderGameOver(elapsedTime){
		context.font = "30px Palatino Linotype";
		context.fillStyle = "white";
		context.textAlign = "center";
		context.fillText("Game Over", canvas.width/2, canvas.height/2);
		context.fillText("Play Again? y/n", (canvas.width/2), (canvas.height/2)+35);
	}
	//------------------------------------------------------------------------
	// Resets the playership to the center of the screen
	// Takes out a life and sets the image to being the ship with the shield
	//------------------------------------------------------------------------
	function resetPlayerShip(){
		myShip.getSpecs().center.x = canvas.width /2;
		myShip.getSpecs().center.y = canvas.height /2;
		myShip.getSpecs().momentum.x = 0;
		myShip.getSpecs().momentum.y = 0;
		myShip.getSpecs().rotation = 0;
		myShip.getSpecs().lives -= 1;
		myShip.getSpecs().reset = false;
		resetTime = 1.5;

		myShip.getSpecs().invincible = true;
		myShip.getSpecs().texture = invincibleTexture;
		myShip.getSpecs().width += 20;
		myShip.getSpecs().height += 10;
		myShip.getSpecs().hit = false;
	}

	function renderPlayerName(elapsedTime,name){
		context.font = "30px Palatino Linotype";
		context.fillStyle = "white";
		context.textAlign = "center";
		context.fillText("New High Score:", canvas.width/2, canvas.height/2);
		context.fillText("Enter Name", (canvas.width/2), (canvas.height/2)+35);
		context.fillText(name, (canvas.width/2), (canvas.height/2)+70);
	}

	//-----------------------------------------------
	// main render
	// will only draw the enemy ship if it is set
	//-----------------------------------------------
	function render(elapsedTime) {
		graphics.clear();
		renderStars();

		if(myShip.getSpecs().reset == false){
			myShip.draw();
		}
		else{
			resetTime -= elapsedTime/1000;
			if(resetTime <=0){
				resetPlayerShip();
			}
		}
		myAsteroid.draw();

		if(enemyShip != null){
			enemyShip.draw();
		}
		renderFriendlyMissle();
		renderEnemyMissle();


	  renderScore(elapsedTime);
	  renderLives(elapsedTime);


	  particleGenerator.render(elapsedTime);
	}

	function updateHighScores(elapsedTime){

		if(checkHighScores){
			for(var i = 0; i < scoreHandler.getHighScores().length; i++){
				if(score >= scoreHandler.getHighScores()[i].score){;
					
					enterName = true;
					highScoreLocation = i;
					break;
				}
			}
		}
		checkHighScores = false;
	}

	

	// function confirmed(elapsedTime){
	// 	waitForNameConfirmation = false;
	// }

	function nameEntered(elapsedTime){
		enterName = false;
		waitForNameConfirmation = true;

		scoreHandler.addScore(score, userName, highScoreLocation);
	}


	//----------------------------------------------------
	// gameloop function
	// only updates and renders if the game is not paused
	//----------------------------------------------------
	function gameLoop(time) {
		var elapsedTime = time - lastTimeStamp;
		lastTimeStamp = time;
		
		if(!gameTerminated){
			if (!gamePaused && !gameOver) {
				processInput(elapsedTime);
				update(elapsedTime);
				render(elapsedTime);
				requestAnimationFrame(gameLoop);
			}
			else if(gameOver){
				renderStars();
				
				if(enterName){

					userName = myKeyboard.enterName();

					if(userName != undefined){
						
						if(userName.length == 1){
							displayName = userName + "_ _";
						}
						else if(userName.length == 2){
							displayName = userName[0] +' '+userName[1]+ '_';
						}
						else if(userName.length == 3){
							displayName = userName[0] +' '+userName[1]+ ' '+userName[2];

							nameEntered(elapsedTime);
						}
					}
					else{
						displayName = "_ _ _";
					}
					renderPlayerName(elapsedTime, displayName);
				}
				// else if(waitForNameConfirmation){
				// 	//console.log('waiting for confirmation');
				// 	//console.log(displayName);
				// 	//myKeyboard.registerCommand(KeyEvent.DOM_VK_RETURN, confirmed);
				// 	renderPlayerName(elapsedTime, displayName);
				// }
				else{
					myKeyboard.registerCommand(KeyEvent.DOM_VK_Y, newGame);
					myKeyboard.registerCommand(KeyEvent.DOM_VK_N, quitGame);
					myKeyboard.continueGame(elapsedTime);

					renderGameOver(elapsedTime);
				}
				
				requestAnimationFrame(gameLoop);


			}
			else{			
				myKeyboard.registerCommand(KeyEvent.DOM_VK_Y, continueGame);
				myKeyboard.registerCommand(KeyEvent.DOM_VK_N, quitGame);
				myKeyboard.continueGame(elapsedTime);

				renderPauseMenu(elapsedTime);
				requestAnimationFrame(gameLoop);
			}
		}
	}
	
	function run() {
		cancelNextRequest = false;
		initialize();
		requestAnimationFrame(gameLoop);
	}
	
	return {
		initialize : initialize,
		run : run,
		initKeyboard : initKeyboard,
		emitEnemyMissle : emitEnemyMissle,
		emitFriendlyMissle : emitFriendlyMissle,
	};
}(MyGame.game, MyGame.graphics, MyGame.input, MyGame.spaceship, MyGame.enemy, MyGame.asteroids, MyGame.scoreHandler, MyGame.particleGenerator));
