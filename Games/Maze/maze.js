'use strict'

let mazeSize = 5;
let maze;
let frontiers = [];
let notInMaze = [];
let inMaze = [];
let path = [];

let drawPathEvent = false;
let drawBreadCrumbs = false;
let checkHighScores = false;
let hideScore = false;
let gameOver = false;

let timeStamp;
let prevTimeStamp = 0;
let diff;
let accumulatedTime = 0;

let currentScore = 0;
let highScores = [0,0,0,0,0];

// creating images for the floor, the finish line, breadcrumbs, and the shortest path
// credit to Dean Mathaias

// stone tile image used from this search:
//https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwiDkdrlqKXSAhVC7WMKHebXA18QjRwIBw&url=http%3A%2F%2Fwww.janetjackson-tour.com%2Ftag%2Fstone-seamless-texture-tile%2F&bvm=bv.147448319,d.cGc&psig=AFQjCNHx-IYMjI1JonOLgQq2SkcU4wcNBA&ust=1487908378777544
let imgFloor = new Image();
imgFloor.isReady = false;
imgFloor.onload = function() {
	this.isReady = true;
};
imgFloor.src = 'stoneTile.jpeg';

let imgEnd = new Image();
imgEnd.isReady = false;
imgEnd.onload = function() {
	this.isReady = true;
};
imgEnd.src = 'finish.png';

let pathIcon = new Image();
pathIcon.isReady = false;
pathIcon.onload = function() {
	this.isReady = true;
};
pathIcon.src = 'yellowDot.png';

let bcIcon = new Image();
bcIcon.isReady = false;
bcIcon.onload = function() {
	this.isReady = true;
};
bcIcon.src = 'grayDot.png';

function createCharacter(imageSource, location) {
	let image = new Image();
	image.isReady = false;
	image.onload = function() {
		this.isReady = true;
	};
	image.src = imageSource;
	return {
		location: location,
		image: image
	};
}

// start of functions that are used to create the maze and the maze walls
class Cell{
	constructor(r,c,id){
		this.location = {row: r, col: c}
		this.dirOutOfCell = {N: null, S: null, E: null, W: null};
		this.adjacentCells = [];
		this.id = id;
		this.breadCrumb = false;
		this.isStart = false;
		this.isEnd = false;
		this.path = false;
		this.parent = null;
	}
}

// resets global variables and creates a new maze
function sizeSelection(){
	maze = null;
	frontiers = [];
	notInMaze = [];
	inMaze = [];
	path = [];
	drawPathEvent = false;
	drawBreadCrumbs = false;

	timeStamp = 0;
	prevTimeStamp = window.performance.now();
	diff = 0;
	accumulatedTime = 0;
	
	currentScore = 0;
	checkHighScores = false;
	hideScore = false;
	gameOver = false;

	myCharacter = null;

	var allMazeSizes = document.getElementsByName('mazeSize');
	for(var i = 0; i < allMazeSizes.length; i++){
		if(allMazeSizes[i].checked){
			mazeSize = parseInt(allMazeSizes[i].value);
			createMaze();
		}
	}
	
}

// creates a new maze based on the size from the radio buttons
function createMaze(){
	var id = 0;

	maze = new Array(mazeSize);
	for (var i = 0; i < mazeSize; i++) {
		maze[i] = new Array(mazeSize);
	}
	for(var i = 0; i < mazeSize; i++){
		for(var j = 0; j < mazeSize; j++){
			maze[i][j] = new Cell(i,j,id);
			if(id === 0){
				maze[i][j].isStart = true;
			}
			else if(id == (mazeSize * mazeSize -1)){
				maze[i][j].isEnd = true;
			}
			notInMaze.push(maze[i][j]);
			id++;
		}
	}
	//sets the adjacent cells for each cell
	for(var i = 0; i < mazeSize; i++){
		for(var j = 0; j < mazeSize; j++){
			getAdjacentCells(maze[i][j]);
		}
	}

	
	// start of the prims algorithm
	var randFrontier = null;
	var adjacentInMaze = null;
	var firstSpotRow = randomNumber(mazeSize);
	var firstSpotCol = randomNumber(mazeSize);
	
	addToMaze(maze[firstSpotRow][firstSpotCol]);
	getFrontiers(maze[firstSpotRow][firstSpotCol]);

	while(notInMaze.length != inMaze.length){
		getFrontiers
		randFrontier = getRandomFrontier();
		adjacentInMaze = checkAdjacent(randFrontier.adjacentCells);
		carvePath(randFrontier, adjacentInMaze);
		addToMaze(maze[randFrontier.location.row][randFrontier.location.col]);
		getFrontiers(maze[randFrontier.location.row][randFrontier.location.col]);
	}

	// calls a breadth first search and stores the shortest path
	var path = bfs();

	for(var i = 0; i < path.length; i++){
		var r = path[i].location.row;
		var c = path[i].location.col;
		maze[r][c].path = true;
	}
	// sets the beginning cell to not be a part of the shortest path 
	maze[0][0].path = false;
	// creates a new character and sets it back to the beginning cell
	myCharacter = createCharacter('whiteMage.gif', maze[0][0]);
}

// for a specific cell, if the first adjacent cell it finds is in the maze, return that cell that's in the maze
function checkAdjacent(cells){
	for(var i = 0; i < cells.length; i++){
		for(var j = 0; j < inMaze.length; j++){
			if(cells[i].id === inMaze[j].id){
				return inMaze[j];
			}
		}
	}
}

// helper function to add a cell to the maze list
function addToMaze(cell){
	inMaze.push(cell);
}

// puts a copy of an adjacent cell into a list for a specific cell
function getAdjacentCells(cell){
	var cellCopy;
	if(cell.location.row+1 < mazeSize ){ // down
		cellCopy = new Cell(maze[cell.location.row+1][cell.location.col].location.row, maze[cell.location.row+1][cell.location.col].location.col,maze[cell.location.row+1][cell.location.col].id);
		cell.adjacentCells.push(cellCopy);
	}
	if(cell.location.row-1 > -1){ // up
		cellCopy = new Cell(maze[cell.location.row-1][cell.location.col].location.row, maze[cell.location.row-1][cell.location.col].location.col,maze[cell.location.row-1][cell.location.col].id);
		cell.adjacentCells.push(cellCopy);
	}
	if(cell.location.col+1 < mazeSize){ // right  
		cellCopy = new Cell(maze[cell.location.row][cell.location.col+1].location.row, maze[cell.location.row][cell.location.col+1].location.col,maze[cell.location.row][cell.location.col+1].id);
		cell.adjacentCells.push(cellCopy);
	}
	if(cell.location.col-1 > -1){ // left
		cellCopy = new Cell(maze[cell.location.row][cell.location.col-1].location.row, maze[cell.location.row][cell.location.col-1].location.col,maze[cell.location.row][cell.location.col-1].id);
		cell.adjacentCells.push(cellCopy);
	}
}

// if an adjacent cell is not in the frontiers list and not in the maze, add that adjacent cell to the frontiers list
function getFrontiers(cell){
	if(cell.location.row+1 < mazeSize ){ // down
		if(!frontiers.includes(maze[cell.location.row+1][cell.location.col]) && !inMaze.includes(maze[cell.location.row+1][cell.location.col])){
			frontiers.push(maze[cell.location.row+1][cell.location.col]);
		}
	}
	if(cell.location.row-1 > -1){ // up
		if(!frontiers.includes(maze[cell.location.row-1][cell.location.col]) && !inMaze.includes(maze[cell.location.row-1][cell.location.col])){
			frontiers.push(maze[cell.location.row-1][cell.location.col]);
		}
	}
	if(cell.location.col+1 < mazeSize){ // right  
		if(!frontiers.includes(maze[cell.location.row][cell.location.col+1]) && !inMaze.includes(maze[cell.location.row][cell.location.col+1])){
			frontiers.push(maze[cell.location.row][cell.location.col+1]);
		}
	}
	if(cell.location.col-1 > -1){ // left
		if(!frontiers.includes(maze[cell.location.row][cell.location.col-1]) && !inMaze.includes(maze[cell.location.row][cell.location.col-1])){
			frontiers.push(maze[cell.location.row][cell.location.col-1]);
		}
	}
}

// carves a path between two cells depending on their location in the maze
function carvePath(cell1, cell2){
	//cell1 = random frontier, cell2 = adjacent in maze
	if(cell1.location.row === cell2.location.row+1){
		maze[cell1.location.row][cell1.location.col].dirOutOfCell.N = {row: cell2.location.row, col: cell2.location.col}
		maze[cell2.location.row][cell2.location.col].dirOutOfCell.S = {row: cell1.location.row, col: cell1.location.col}
	}
	if(cell1.location.row === cell2.location.row-1){
		maze[cell1.location.row][cell1.location.col].dirOutOfCell.S = {row: cell2.location.row, col: cell2.location.col}
		maze[cell2.location.row][cell2.location.col].dirOutOfCell.N = {row: cell1.location.row, col: cell1.location.col}
	}
	if(cell1.location.col === cell2.location.col+1){
		maze[cell1.location.row][cell1.location.col].dirOutOfCell.W = {row: cell2.location.row, col: cell2.location.col}
		maze[cell2.location.row][cell2.location.col].dirOutOfCell.E = {row: cell1.location.row, col: cell1.location.col}
	}
	if(cell1.location.col === cell2.location.col-1){
		maze[cell1.location.row][cell1.location.col].dirOutOfCell.E = {row: cell2.location.row, col: cell2.location.col}
		maze[cell2.location.row][cell2.location.col].dirOutOfCell.W = {row: cell1.location.row, col: cell1.location.col}
	}
}

// returns a random frontier and removes it from the list
function getRandomFrontier(){
	var i = randomNumber(frontiers.length);
	var f = frontiers[i];
	frontiers.splice(i,1);
	 return f;

}

// returns a random number
function randomNumber(maxSize){
	return Math.floor((Math.random() * maxSize) );
}

// breadth first search that returns a list of the shortest path
function bfs(){
	var queue = [];
	var set = [];
 	queue.push(maze[0][0]);                      

	 while(queue.length != 0){
	 	var current = queue.pop();
	 	if(current.isEnd){
	 		 break;
	 	}
	 	if(current.dirOutOfCell.N != null){
	 		var r = current.dirOutOfCell.N.row;
	 		var c = current.dirOutOfCell.N.col;
	 		if(!set.includes(maze[r][c])){
	 			set.push(maze[r][c]);
	 			maze[r][c].parent = current;
	 			queue.push(maze[r][c]);
	 		}
	 	}
	 	if(current.dirOutOfCell.S != null){
	 		var r = current.dirOutOfCell.S.row;
	 		var c = current.dirOutOfCell.S.col;
	 		if(!set.includes(maze[r][c])){
	 			set.push(maze[r][c]);
	 			maze[r][c].parent = current;
	 			queue.push(maze[r][c]);
	 		}
	 	}
	 	if(current.dirOutOfCell.E != null){
	 		var r = current.dirOutOfCell.E.row;
	 		var c = current.dirOutOfCell.E.col;
	 		if(!set.includes(maze[r][c])){
	 			set.push(maze[r][c]);
	 			maze[r][c].parent = current;
	 			queue.push(maze[r][c]);
	 		}
	 	}
	 	if(current.dirOutOfCell.W != null){
			var r = current.dirOutOfCell.W.row;
	 		var c = current.dirOutOfCell.W.col;
	 		if(!set.includes(maze[r][c])){
	 			set.push(maze[r][c]);
	 			maze[r][c].parent = current;
	 			queue.push(maze[r][c]);
	 		}
	 	}

	 }
	 //once done start at end and follow parents
	 var r = mazeSize-1;
	 var c = mazeSize-1;
	 var path = [];
	 while(!maze[r][c].isStart){
	 	var newr = maze[r][c].parent.location.row;
	 	var newc = maze[r][c].parent.location.col;

	 	r = newr;
	 	c = newc;

	 	path.push(maze[r][c]);
	 }
	 return path;
}

// start of rendering, updating, and gameloop function

// renders each cell of the maze
function renderMaze(){
	for(var i = 0; i < mazeSize; i++){
		for(var j = 0; j < mazeSize; j++){
			renderCell(maze[i][j]);
		}
	}
}

// draws a floor image for each cell. draws the finish line on the end cell.
// draws the shortest path icon if the p key is pressed. draws the breadcrumbs if the b key is pressed
// draws a green line on the cell edges
function renderCell(cell){
	let fillColor;
	let w = canvas.width / (mazeSize);
	let h = canvas.height / (mazeSize);

	let row = cell.location.row;
	let col = cell.location.col;

	if (imgFloor.isReady) {
		context.drawImage(imgFloor,
		col*w, row*h, w,h);
	}
	if(imgEnd.isReady && cell.isEnd){
		context.drawImage(imgEnd,
		col*w, row*h, w,h);
	}

	if(cell.path && !cell.breadCrumb){
		if(drawPathEvent){
			if(pathIcon.isReady){
				context.drawImage(pathIcon,
				col*w, row*h, w,h);
			}	
		}
	}

	if(cell.breadCrumb){
		if(drawBreadCrumbs){
			if(bcIcon.isReady){
				context.drawImage(bcIcon,
				col*w, row*h, w,h);
			}
		}
	}

	if(mazeSize == 20){
		context.lineWidth = 5;
	}
	else if(mazeSize == 15){
		context.lineWidth = 6;
	}
	else if(mazeSize == 10){
		context.lineWidth = 8;
	}
	else{
		context.lineWidth = 10;
	}

	
	context.strokeStyle = 'green';
	if(cell.dirOutOfCell.N === null){
		context.beginPath();
		context.moveTo(col*w, row*h);
		context.lineTo((col+1)*w, row*h);
		context.stroke();
	}

	if(cell.dirOutOfCell.S === null){
		context.beginPath();
	    context.moveTo(col*w, (row+1)*h);
	    context.lineTo((col+1)*w, (row+1)*h);
		context.stroke();
	}
	if(cell.dirOutOfCell.E === null){
		context.beginPath();
		context.moveTo((col+1)*w, row*h);
		context.lineTo((col+1)*w, (row+1)*h);
		context.stroke();
	}

	if(cell.dirOutOfCell.W === null){
		context.beginPath();
		context.moveTo(col*w, row*h);
		context.lineTo((col)*w, (row+1)*h);
		context.stroke();
	}
}

// renders the character based on a location in the maze
// credit to Dean Mathaias 
function renderCharacter(character) {
	let w = canvas.width / (mazeSize);
	let h = canvas.height / (mazeSize);

	if (character.image.isReady) {
		context.drawImage(character.image,
		character.location.location.col * w, character.location.location.row * h, w,h);
	}
}

// updates the character to a new locaton based on input. credit for this one to Dean Mathaias
// marks the old location as being a breadcrumb cell
// updates the score based on proximity to the shortest path
// toggles the breadcrumbs or the shortest path
function moveCharacter(keyCode, character) {
	console.log('keyCode: ', keyCode);
	if(!gameOver){
		var r = character.location.location.row;
		var c = character.location.location.col;

		maze[r][c].breadCrumb = true;
		if (keyCode === 83 || keyCode === 40 || keyCode ===75) {
			if (character.location.dirOutOfCell.S) {
				r = character.location.dirOutOfCell.S.row;
				c = character.location.dirOutOfCell.S.col;
				character.location = maze[r][c];
			}
		}
		if (keyCode === 87 || keyCode === 38 || keyCode === 73) {
			if (character.location.dirOutOfCell.N) {
				r = character.location.dirOutOfCell.N.row;
				c = character.location.dirOutOfCell.N.col;
				character.location = maze[r][c];
			}
		}
		if (keyCode === 68 || keyCode === 39 || keyCode === 76) {
			if (character.location.dirOutOfCell.E) {
				r = character.location.dirOutOfCell.E.row;
				c = character.location.dirOutOfCell.E.col;
				character.location = maze[r][c];
			}
		}
		if (keyCode === 65 || keyCode === 37 || keyCode === 74) {
			if (character.location.dirOutOfCell.W) {
				r = character.location.dirOutOfCell.W.row;
				c = character.location.dirOutOfCell.W.col;
				character.location = maze[r][c];
			}
		}

		if(maze[r][c].path && !maze[r][c].breadCrumb){
			currentScore += 5;
		}
		else if(maze[r][c].isEnd && !maze[r][c].breadCrumb){
			currentScore += 5;
		}
		else if(maze[r][c].breadCrumb === false ){
			if(maze[r][c].dirOutOfCell.N != null ){
				var row = maze[r][c].dirOutOfCell.N.row;
				var col = maze[r][c].dirOutOfCell.N.col;
				if(maze[row][col].path){
					currentScore += 1;
				}
			}

			if(maze[r][c].dirOutOfCell.S != null){
				var row = maze[r][c].dirOutOfCell.S.row;
				var col = maze[r][c].dirOutOfCell.S.col;
				if(maze[row][col].path){
					currentScore += 1;
				}
			}

			if(maze[r][c].dirOutOfCell.E != null){
				var row = maze[r][c].dirOutOfCell.E.row;
				var col = maze[r][c].dirOutOfCell.E.col;
				if(maze[row][col].path){
					currentScore += 1;
				}
			}

			if(maze[r][c].dirOutOfCell.W != null){
				var row = maze[r][c].dirOutOfCell.W.row;
				var col = maze[r][c].dirOutOfCell.W.col;
				if(maze[row][col].path){
					currentScore += 1;
				}
			}
			currentScore -=2;
			
		}
		if(maze[r][c].isEnd){
			checkHighScores = true;
			gameOver = true;
			window.alert('You Solved the Maze!\nSelect a Maze Size to Play Again!');

		}

		if(keyCode === 80){
			drawPathEvent = !drawPathEvent;
		}
		if(keyCode === 66){
			drawBreadCrumbs = !drawBreadCrumbs;
		}
		if(keyCode === 89){
			hideScore = !hideScore;
		}
	}
}

// renders the current score to the canvas
function renderCurrentScore(){
	var node = document.getElementById('currScore');
	if(!hideScore || gameOver){
		node.innerHTML = currentScore;
	}
	else{
		node.innerHTML = '????';
	}
	
}

// renders the high scores to the canvas
function renderHighScores(){
	
	var node = document.getElementById('scores');
	node.innerHTML = '';
	node.innerHTML = '<br/>'
	for(var i = 0; i < highScores.length; i++){	
		node.innerHTML += highScores[i]+'<br/>';	
	}
}

// renders the elapsed time
function renderTime(){
	var node;
	node = document.getElementById('time');
	node.innerHTML = Math.floor(accumulatedTime);
}

// renders the maze, character, time, and high scores
function render() {
	context.clear();


	renderMaze();
	renderCharacter(myCharacter);
	renderTime();
	renderCurrentScore();
	renderHighScores();
}

// if the user has reached the end of the maze, check to see if it higher than another score
// if it is, add it to the maze at that location and pop off the last score leaving only the top 5 scores
// resets the variable at the end
function updateHighScores(){
	if(checkHighScores){
		for(var i = 0; i < highScores.length; i++){
			if(currentScore >= highScores[i]){
				highScores.splice(i, 0 ,currentScore);
				highScores.pop();
				break;
			}
		}
	}
	checkHighScores = false;
}

// adds the new amount of time and convert to seconds, then update the high scores if needed.
function update(elapsedTime){
	if(!gameOver){
		accumulatedTime += (elapsedTime/1000);
	}
	updateHighScores();
	//checkForGameOver();
}

// gets the new time, updates time and high scores, and renders maze, etc.
function gameLoop() {
	timeStamp = window.performance.now();
	diff = timeStamp - prevTimeStamp;
	prevTimeStamp = timeStamp;

	update(diff);

	render();

	requestAnimationFrame(gameLoop);

}

let canvas = null;
let context = null;
let myCharacter;
createMaze(); // initialized the maze to a default of a maze size of 5



function initialize() {
	canvas = document.getElementById('canvas-main');
	context = canvas.getContext('2d');
	timeStamp = window.performance.now();	
	CanvasRenderingContext2D.prototype.clear = function() {
		this.save();
		this.setTransform(1, 0, 0, 1, 0, 0);
		this.clearRect(0, 0, canvas.width, canvas.height);
		this.restore();
	};

	window.addEventListener('keydown', function(event) {
		moveCharacter(event.keyCode, myCharacter);
	});

	requestAnimationFrame(gameLoop);
}