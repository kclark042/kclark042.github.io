//the code for drawing the stars and the rocket were found here: http://students.cs.ucl.ac.uk/schoolslab/projects/HT5/index.html

var canvas = document.getElementById("lunarGame");
var context = canvas.getContext("2d");

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                           window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

var req ;

var stars = [];
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
function drawStars() 
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
function drawPlanet(){
	
	//context.clearRect(0, 450, 800,50);
	
	//context.rect(0, 450, 800, 50);
	context.rect(0,canvas.height -50, canvas.width, 50);
	context.fillStyle = "grey";
	context.fill();

}
function drawSpace(){
	//only care about drawing the stars and the planet for the start screen
	drawStars();
	drawPlanet();
	req = requestAnimationFrame(drawSpace);
}


function Game(){
	cancelAnimationFrame(req); //cancles the beginning animation of stars
	function drawEndOfGame(){
		drawStars();
		drawPlanet();
		status();
		drawSpaceship();
		req = requestAnimationFrame(drawEndOfGame);

	}
	var spaceship =
	{
	    color: "red",
	    width: 8,
	    height: 22,
	    position://starting position of the spaceship
	    {
	        x: 300,
	        y: 20
	    },
	    velocity://starting velocity
	    {
	        x: 0,
	        y: 0
	    },
	    thrust:{//starting thrust
	    	x: 0,
	    	y: 0
	    },
	    gravity:{//the gravity of the planet
	    	x:0,
	    	y: -.1622
	    },
	    fuel: 20,//the starting amount of fuel in the tank of the spaceship
	    fuelBurned: 0,
	    angle: 100.5,//starting angle
	    engineOn: false,
	    //rotatingLeft: false, these two left over from when it could rotate
	    //rotatingRight: false,
	    landed: false,
	    MTV: 5.0, //max touch down velocity
	    crashed: false
	}

	function drawSpaceship()
	{
		//draws a rectangle for the spaceship
	    context.save();

	    context.beginPath();
	    context.translate(spaceship.position.x, spaceship.position.y);
	    context.rotate(spaceship.angle);
	    context.rect(spaceship.width * -0.5, spaceship.height * -0.5, spaceship.width, spaceship.height);
	    context.fillStyle = spaceship.color;
	    context.fill();
	    context.closePath();

	    // Draw the flame if engine is on
	    if(spaceship.engineOn)
	    {
	        context.beginPath();
	        context.moveTo(spaceship.width * -0.5, spaceship.height * 0.5);
	        context.lineTo(spaceship.width * 0.5, spaceship.height * 0.5);
	        context.lineTo(0, spaceship.height * 0.5 + Math.random() * 10);
	        context.lineTo(spaceship.width * -0.5, spaceship.height * 0.5);
	        context.closePath();
	        context.fillStyle = "orange";
	        context.fill();
	    }
	    context.restore();
	}

	function updateSpaceship()
	{
		//update the spaceship's position based on the velocity
		spaceship.position.x += -1*spaceship.velocity.x;
	    spaceship.position.y += spaceship.velocity.y;
	    //left over from when rotating abilities were left in 
	    // if(spaceship.rotatingRight)
	    // {
	    //     spaceship.angle += Math.PI / 180;
	    // }
	    // else if(spaceship.rotatingLeft)
	    // {
	    //     spaceship.angle -= Math.PI / 180;
	    // }

	    //if the engine is on
	    if(spaceship.engineOn)
	    {
	    	//if there is no fuel left
	    	if (spaceship.fuel <= 0) {
	    		//make sure that they are both left at zero
	    		spaceship.fuel = 0;	
	    		spaceship.fuelBurned = 0;

	    		//thrust becomes zero
	    		spaceship.thrust.x =  Math.sin(spaceship.angle) * spaceship.fuelBurned;
	    		spaceship.thrust.y =  Math.cos(spaceship.angle) * spaceship.fuelBurned;
	    		
	    		//the velocity is then changed to refelct no thrust
	    		spaceship.velocity.x += (-1 * spaceship.thrust.x) * Math.sin(spaceship.angle);
	        	spaceship.velocity.y += (-1*spaceship.thrust.y )* Math.cos(spaceship.angle);

	    	}else{
	    		//keep track of how much fuel is burned while the engine is on
	    		spaceship.fuelBurned++;
	    		//change the thrust based on fuelburned
	    		spaceship.thrust.x =  Math.sin(spaceship.angle) * spaceship.fuelBurned;
	    		spaceship.thrust.y =  Math.cos(spaceship.angle) * spaceship.fuelBurned;
	    		//subtract the amount burned from what is left in the fuel tank
	    		spaceship.fuel -= spaceship.fuelBurned;

	    		//change the velocity based on the thrust
	    		spaceship.velocity.x += (-1 * spaceship.thrust.x) * Math.sin(spaceship.angle);
	        	spaceship.velocity.y += (-1*spaceship.thrust.y )* Math.cos(spaceship.angle);
	    	}
	    }
	    //add the affects of gravity to the velocity of the spaceship
	    spaceship.velocity.y -= spaceship.gravity.y;

	    //set fuelburned back to being zero for use the next time the engine in on
		spaceship.fuelBurned = 0;
	}
	function status(){
		//context.clearRect(550, 0, 800,100);
		
		//context.rect(550, 0, 800, 100);

		context.rect(canvas.height+50, 0, canvas.width, 100);

		context.fillStyle = "grey";
		context.fill();
		//these two are used to help print the velocity to only 4 decimal points
		var sv = spaceship.velocity.y;
		var vel = sv.toPrecision(4);
	   //prints the current remaining fuel in the status box
	   context.strokeText("Fuel Remaining: "+spaceship.fuel, 620, 30);

	   //prints the current velocity in the status box
	    context.strokeText("Velocity: "+vel, 620, 50);

	    //context.strokeText("position x: "+spaceship.position.x, 620, 70);
	    //context.strokeText("position y: "+spaceship.position.y, 620, 80);
	    //context.restore();
	}


	function explode(){
		//context.rect(0, 450, 800, 50);
	// 	context.moveTo(100, 100);
	// 	context.lineTo(200, 100);
	// 	context.lineTo(100, 200);
	// 	context.lineTo(100, 100);

	// context.fillStyle = "orange";
	// context.fill();
	}
	function draw()
	{
	    // Clear entire screen
	 	
	    context.clearRect(0, 0, canvas.width, canvas.height);
	    
	     //draw the stars
	     drawStars();
	     //draw the planet
	     drawPlanet();
	     //draw the remaining fuel and current velocity
	     status();
	   //update the spaceship with the new position and new velocity
	    updateSpaceship();

	    // Begin drawing
	    drawSpaceship();
	    
	    //animate all of the above
	    req = requestAnimationFrame(draw);

	    //if you have reached the planet's surface
	    if (spaceship.position.y >= 450) {
	    	// if you are coming in faster than the set max touchdown velocity then you crash
	    	if (spaceship.velocity.y > spaceship.MTV) {
	    		spaceship.crashed = true;
	    		//stops drawing the rocket
	    		cancelAnimationFrame(req);
	    		//explode(); I was going to try to animate an explosion but I never got around to it
	    		//show a message saying you crashed
	    		window.alert("You Crashed the Rocket!");
				//draws the stars again with the last position, fuel, and velocity
	    		req = requestAnimationFrame(drawEndOfGame);
	    		
	    		
	    	}
	    	else{
	    		//if you reached the surface and you were less than the mtv then you landed safely
	    		spaceship.landed = true;
	    		//stops drawing the rocket
	    		cancelAnimationFrame(req);
	    		//show a message saying you crashed
	    		window.alert("You Landed Safely!");
	    		//draws the stars again with the last position, fuel, and velocity
	    		req = requestAnimationFrame(drawEndOfGame);

	    	}
	    }

	}

	function keyLetGo(event)
	{
	    console.log(spaceship);
	    switch(event.keyCode)
	    {
	        // case 37:
	        //     // Left Arrow key
	        //     spaceship.rotatingLeft = false;
	        //     break;
	        // case 39:
	        //     // Right Arrow key
	        //     spaceship.rotatingRight = false;
	        //     break;
	        case 32:
	            // Up Arrow key
	            // 38 is Up Arrow key 
	            // 32 is the space bar changed to fix problems with scrolling
	            spaceship.engineOn = false;
	            break;
	    }
	}

	document.addEventListener('keyup', keyLetGo);

	function keyPressed(event)
	{
	    console.log(spaceship);
	    switch(event.keyCode)
	    {
	        // case 37:
	        //     // Left Arrow key
	        //     spaceship.rotatingLeft = true;
	        //     break;
	        // case 39:
	        //     // Right Arrow key
	        //     spaceship.rotatingRight = true;
	        //     break;
	        case 32:
	            // 38 is Up Arrow key 
	            // 32 is the space bar changed to fix problems with scrolling
	            spaceship.engineOn = true;
	            break;
	    }
	}

	document.addEventListener('keydown', keyPressed);
	draw();
}