MyGame.screens['game-play'] = (function(game) {
	'use strict';
	
	// variables used to play the game
	var cancelNextRequest = false;
	let timeStamp;
	let prevTimeStamp = 0;
	let diff;
	let accumulatedTime = 0;

	let canvas = null;
	let context = null;

	var balls = [];

	var changeSpeed = false;
	var ball1 = {
		ballRadius: 10,
		x: null,
		y: null,
		dx: 3,
		dy: -3,
		speed: 2
	}

	// var ball2 = {
	// 	ballRadius: 10,
	// 	x: null,
	// 	y: null,
	// 	dx: 3,
	// 	dy: -3,
	// 	speed: 2
	// }
	var addBall = false;
	var deleteBall = false;

	var originalPaddleWidth = 200;
	var halfPaddleWidth = originalPaddleWidth /2;
	var paddleHeight = 10;
	var paddleWidth = originalPaddleWidth;
	var paddleX = null;
	var halfPaddle = false;

	var rightPressed = false;
	var leftPressed = false;

	var brickRowCount = 8;
	var brickColumnCount = 14;
	var totalBricks = brickRowCount * brickColumnCount;
	var brickWidth = 75;
	var brickHeight = 20;
	var brickPadding = 2;
	var brickOffsetTop = 70;
	var brickOffsetLeft = 2;

	var ready = false;
	var gameOver = false;

	var score = 0;
	var lives = 3;

	var checkHighScores = false;

	var c;
	var r;
	var bricks = [];

	var particles = null;
	let imgLives = new Image();
	imgLives.isReady = false;
	imgLives.onload = function() {
		this.isReady = true;
	};
	imgLives.src = 'heart.png';
	
	
	
	//---------------------------------------------------------------------
	// Resets the game variables. Used when the player selects a new game
	//---------------------------------------------------------------------
	function resetVariables(){

		timeStamp = 0;
		prevTimeStamp = window.performance.now();
		diff = 0;
		accumulatedTime = 0;

	 	changeSpeed = false;

		ball1.dx = 3;
		ball1.dy = -3;
		ball1.speed = 2;

		// ball2.dx = 3;
		// ball2.dy = -3;
		// ball2.speed = 2;

		addBall = false;
		deleteBall = false;

		halfPaddle = false;

		rightPressed = false;
		leftPressed = false;

	  totalBricks = brickRowCount * brickColumnCount;

	  ready = false;
	  gameOver = false;

	  score = 0;
	  lives = 3;

	  balls = [];

	  checkHighScores = false;
	  ball1.x = canvas.width/2;
	  ball1.y = canvas.height-30;
	  // ball2.x = paddleX + paddleWidth/2;
	  // ball2.y = canvas.height-paddleHeight-10;
    balls.push(ball1);
	  paddleX = ((canvas.width-paddleWidth)/2);
	  bricks = [];
	  initBricks();
	}

	//--------------------------------
	// initializes the bricks
	//--------------------------------
	function initBricks(){
		for(c=0; c<brickColumnCount; c++) {
	    bricks[c] = [];
	    for(r=0; r<brickRowCount; r++) {
	        if(r == 0 || r== 1){
	          bricks[c][r] = { x: 0, y: 0, status: 1, color: 'green', point: 5 };
	          
	        }
	        else if(r == 2 || r == 3){
	          bricks[c][r] = { x: 0, y: 0, status: 1, color: 'blue', point: 3 };
	          
	        }
	        else if(r == 4 || r == 5){
	          bricks[c][r] = { x: 0, y: 0, status: 1, color: 'orange', point: 2 };
	        }
	        else{
	          bricks[c][r] = { x: 0, y: 0, status: 1, color: 'yellow', point: 1 };
	        }
	    }
		}
	}

	//-------------------------------------------------------------------------------------------------
	// initializes both of the ball's x and y coordinates and puts only the first one into the array
	//-------------------------------------------------------------------------------------------------
	function initialize() {

		initBricks();
		canvas = document.getElementById('canvas-main');
		context = canvas.getContext('2d');
		timeStamp = window.performance.now();	
	  ball1.x = canvas.width/2;
	  ball1.y = canvas.height-30;
	 //  ball2.x = paddleX + paddleWidth/2;
		// ball2.y = canvas.height-paddleHeight-10;
	  balls.push(ball1);
	  paddleX = ((canvas.width-paddleWidth)/2);
	  
	  
		document.getElementById('id-game-play-back').addEventListener(
		'click',
		function() {
			cancelNextRequest = true;
			game.showScreen('main-menu'); 
		});

		CanvasRenderingContext2D.prototype.clear = function() {
			this.save();
			this.setTransform(1, 0, 0, 1, 0, 0);
			this.clearRect(0, 0, canvas.width, canvas.height);
			this.restore();
		};

		window.addEventListener('keydown', function(event) {
			movePaddle(event.keyCode);
		});
	  window.addEventListener('keyup', function(event){
	    stopPaddle(event.keyCode);
	  });
	}

	//-------------------------
	// Handles the game loop
	//-------------------------
	function gameLoop() {
		
		if (!cancelNextRequest) {
			timeStamp = window.performance.now();
			diff = timeStamp - prevTimeStamp;
			prevTimeStamp = timeStamp;
			update(diff);
			render();
			requestAnimationFrame(gameLoop);
		}
	}
	

	function run() {
		// Start the animation loop
		cancelNextRequest = false;

		// if the player chooses to start a new game, then reset the variables and start the game loop
		if(!continueGame){
			resetVariables();
		}
		requestAnimationFrame(gameLoop);
	}


	function movePaddle(keyCode) {
	  if(keyCode === 39){
	    rightPressed = true;
	  }
	  else if(keyCode === 37){
	    leftPressed = true;
	  }
	}

	function stopPaddle(keyCode) {
	  if(keyCode === 39){
	    rightPressed = false;
	  }
	  else if(keyCode === 37){
	    leftPressed = false;
	  }
	}

	//-------------------------------------------------------------------------------------------
	// 																	Start of Updating Functions
	//-------------------------------------------------------------------------------------------

	function collisionDetection(ball) {
    for(c=0; c<brickColumnCount; c++) {
    	for(r=0; r<brickRowCount; r++) {
	      var b = bricks[c][r];
	      if(b.status == 1) {
          if(ball.x > b.x && ball.x < b.x+brickWidth && ball.y > b.y && ball.y < b.y+brickHeight) {
            ball.dy = -ball.dy;
            b.status = 0;
            var oldScore = score;
            score += bricks[c][r].point;
            totalBricks--;
            var eliminatedBricks = 0;

            particles = ParticleSystem( {
            		fill: {color: b.color},
								center: {x:  b.x + brickWidth/2, y: b.y + brickHeight/2},
								speed: {mean: 50, stdev: 25},
								lifetime: {mean: .2, stdev: 1} 
							},
							MyGame.graphics);
            
            for(var i = 0; i < brickColumnCount; i++){
            	if(bricks[i][r].status == 0){
            		eliminatedBricks++;
            	}
            }
            if(eliminatedBricks == brickColumnCount){
            	score+=25;
            }
   					if(balls.length == 1){
   						if(score  >= 100 && score <= 100 + (score-oldScore) || 
   							score  >= 200 && score <= 200 + (score-oldScore) ||
   							score  >= 300 && score <= 300 + (score-oldScore) || 
   							score  >= 400 && score <= 400 + (score-oldScore)
   							){
   							addBall = true;
   						}
   					}

            if(addBall){
            	var newBall = {
								ballRadius: 10,
								x: paddleX + paddleWidth/2,
								y: canvas.height-paddleHeight-10,
								dx: 3,
								dy: -3,
								speed: ball.speed
							}
							balls.push(newBall);
							addBall = false;
            }

            //checks to see if the speed needs to be increased
            if((brickRowCount * brickColumnCount) - 4 == totalBricks ||
							 (brickRowCount * brickColumnCount) - 12 == totalBricks ||
							 (brickRowCount * brickColumnCount) - 36 == totalBricks ||
							 (brickRowCount * brickColumnCount) - 62 == totalBricks){
            	changeSpeed = true;
            }
            // checks to see if the paddle needs to be halved in size
            if(r == 0){
            	halfPaddle = true;
            }
            // if the player deleted the last brick then the game is over and the player wins
            if(totalBricks <= 0) {
                gameOver = true;
                checkHighScores = true;
                gameStarted = false;
	              continueGame = false;
            }
            return b;
          }
	      }
	  	}
    }
	}

	function updatePaddlePosition(){
		// changes the position of the paddle based on the event trigger
	  // can still change the paddle position even if the game is over or the countdown is running
	  if(rightPressed && paddleX < canvas.width-paddleWidth) {
	      paddleX += 15;
	  }
	  else if(leftPressed && paddleX > 0) {
	      paddleX -= 15;
	  }
	}

	//------------------------------------------------------------------------------------
	// calls the collision detection and updates the position of each ball on the screen
	//------------------------------------------------------------------------------------
	function updateBallPositions(){
		for(var i = 0; i < balls.length; i++){
			collisionDetection(balls[i]);
			updatePositions(balls[i],i);
		}
	}

	//------------------------------------------------------------------------------------------------------------
	// Moves the ball and provides check to see if the paddle should be halved or if all of the bricks are gone
	//------------------------------------------------------------------------------------------------------------
	function updatePositions(ball,i){
		//if the game is not over then update the position of the ball  
	  if(!gameOver){
	  	// if the ball has reached either the left or right side of the screen
	    if(ball.x + ball.dx > canvas.width-ball.ballRadius || ball.x + ball.dx < ball.ballRadius) {
	    	ball.dx = -ball.dx;
	    }
	    //if the ball has reached the top of the screen
	    if(ball.y + ball.dy < ball.ballRadius) {
	      ball.dy = -ball.dy;
	    }
	    //if the ball has reached the the bottom of the screen
	    else if(ball.y + ball.dy > canvas.height-ball.ballRadius) {
	    	//if the ball is within the paddle width then change the direction of the ball
	        if(ball.x > paddleX && ball.x < paddleX + paddleWidth) {
	            ball.dy = -ball.dy;
	            ball.dx = (ball.x - (paddleX+(paddleWidth/2)).toFixed(3))/(paddleWidth/2);
	        }
	        //if the ball goes past the paddle parameters then the game is over and the player loses
	        else {
	        	if(balls.length == 2){
							deleteBall = true;
						}
						else{
							lives--;
	            ready = false;
	            timeStamp = 0;
							prevTimeStamp = window.performance.now();
							diff = 0;
							accumulatedTime = 0;
							halfPaddle = false;
						}
            if(lives == -1 ){
            	gameOver = true;
              checkHighScores = true;
              gameStarted = false;
              continueGame = false;
            }
	        }
	    }
	    //only updates the position of the ball if the countdown is over
	    if(ready){
	      ball.x += ball.dx * ball.speed;
	      ball.y += ball.dy * ball.speed;
	    }
	    //otherwise place the ball on top of the paddle
	    else{
	    	ball.x = paddleX + paddleWidth/2;
	    	ball.y = canvas.height-paddleHeight-ball.ballRadius;
	    }
	    if(deleteBall){
	    	balls.splice(i,1);
	    	deleteBall = false;
	    }
	  }
	}

	//----------------------------------
	// increases speed of the main ball
	//----------------------------------
	function updateSpeed(){
		if(changeSpeed){
			balls[0].speed +=.5;
		}
		changeSpeed = false;
	}

	//---------------------------------------------------------
	// determines which paddle width to use based on the flag
	//---------------------------------------------------------
	function updatePaddleWidth(){
		if(halfPaddle){
			paddleWidth = halfPaddleWidth;
		}
		else{
			paddleWidth = originalPaddleWidth;
		}
	}

	function updateHighScores(){
		if(checkHighScores){
			for(var i = 0; i < game.highScores.length; i++){
				if(score >= game.highScores[i]){
					game.highScores.splice(i, 0 ,score);
					game.highScores.pop();
					break;
				}
			}
			localStorage['highScores'] = JSON.stringify(game.highScores);
		}
		checkHighScores = false;
	}

	function update(elapsedTime){
		var particle;
		accumulatedTime += (elapsedTime/1000);
	  updateBallPositions();
	  updatePaddlePosition();
	  updateSpeed();
	  updatePaddleWidth();
	  updateHighScores();

	  //
		// Tell the existing particles to update themselves
		if(particles != null){
			particles.update(elapsedTime);

			for (particle = 0; particle < 1; particle++) {
				particles.create();
			}
		}
	}

	//---------------------------------------------------------------------------------------------------
	// 																Start of Rendering Functions 
	//---------------------------------------------------------------------------------------------------

	//---------------------------------------------
	// Displays a number based on the game time
	//---------------------------------------------
	function renderCountDown(){
	  if(!gameOver){
	  	context.font = "30px Arial";
	  	context.fillStyle = "white";
			context.textAlign = "center";
	  	if(accumulatedTime < 1){
	    	context.fillText("3", canvas.width/2, canvas.height/2);
		  }
		  else if(accumulatedTime < 2 && accumulatedTime > 1){
		    context.fillText("2", canvas.width/2, canvas.height/2);
		  }
		  else if(accumulatedTime < 3 && accumulatedTime  > 2){
		    context.fillText("1", canvas.width/2, canvas.height/2);
		  }
		  else if(accumulatedTime < 4 && accumulatedTime > 3){
		    context.fillText("Go!", canvas.width/2, canvas.height/2);
		  }
		  else{
		    ready = true;
		    context.fillText("", canvas.width/2, canvas.height/2);
		  }
	  } 
	}

	function renderWin(){
	  if(gameOver){
	  	context.font = "30px Arial";
	  	context.fillStyle = "white";
			context.textAlign = "center";
			context.fillText("Game Over", canvas.width/2, canvas.height/2);
	  }
	}

	function renderScore(){
	  var node;
	  node = document.getElementById('score');
	  node.innerHTML = "Score: "+score.toString();
	}

	function render() {
		MyGame.graphics.clear();
	  context.clear();
	  draw();
	  renderScore();
	  renderCountDown();
	  renderWin();

	  if(particles != null){
			particles.render();
	  }
	}

	//---------------------------------------------------------------------------------------------------
	// 																Start of Drawing Functions 
	//---------------------------------------------------------------------------------------------------


	function drawBricks(){
	  for(c=0; c<brickColumnCount; c++) {
      for(r=0; r<brickRowCount; r++) {
        if(bricks[c][r].status == 1) {
          var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
          var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          context.beginPath();
          context.rect(brickX, brickY, brickWidth, brickHeight);
          context.fillStyle = bricks[c][r].color;
          context.fill();
          context.closePath();
        }
      }
	  }
	}

	function drawLives(){
		let w = (canvas.width /brickWidth) + 20;
		let h = canvas.height/brickHeight;
		for(var i = 0; i < lives; i++){
	  	if(imgLives.isReady){
	  		context.drawImage(imgLives, (i*(brickWidth+brickPadding)), 
	  			(0*(brickHeight+brickPadding)), w,h);
	  	}
		}
	}

	function drawBalls(){
		if(!gameOver){
			for(var i = 0; i < balls.length; i++){
				drawSingleBall(balls[i]);
			}
		}
	}

	//-----------------------------------------------
	// Only draws the ball if the game is not over.
	// Called in drawBalls function
	//-----------------------------------------------
	function drawSingleBall(ball) {
    context.beginPath();
    context.arc(ball.x,ball.y,ball.ballRadius,0,2*Math.PI);
    context.fillStyle="white";
    context.fillStroke="white";
    context.Stroke="10"
    context.fill();
    context.closePath();
	}


	function drawPaddle() {
	    context.beginPath();
	    context.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
	    context.fillStyle = "#0095DD";
	    context.fill();
	    context.closePath();
	}

	function draw() {
	  context.clearRect(0, 0, canvas.width, canvas.height);
	  drawBricks();
	  drawPaddle();
	  drawBalls();
	  drawLives();
	}
	
	return {
		initialize : initialize,
		run : run
	};
}(MyGame.game));
