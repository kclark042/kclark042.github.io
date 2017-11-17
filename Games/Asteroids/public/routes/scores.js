//------------------------------------------------------------------
//
// This is some dummy score data
//
//------------------------------------------------------------------
	var scores = [ {
		id : 0,
		name : '_ _ _',
		score: 0,
	}, {
		id : 1,
		name : '_ _ _',
		score : 0,
	}, {
		id: 2,
		name : '_ _ _',
		score : 0,
	},{
		id: 3,
		name : '_ _ _',
		score : 0,
	},{
		id: 4,
		name : '_ _ _',
		score : 0,
	}];

var fs = require('fs');
//------------------------------------------------------------------
//
// Report all people back to the requester.
//
//------------------------------------------------------------------
exports.all = function(request, response) {

	response.writeHead(200, {'content-type': 'application/json'});
	let jsonData = fs.readFileSync('highScore.json','utf8');

	if(jsonData != null){
		scores = JSON.parse(jsonData);
	}

	response.end(JSON.stringify(scores));
};

//------------------------------------------------------------------
//
// Add a new person to the server data.
//
//------------------------------------------------------------------
exports.add = function(request, response) {

	var data = {
		id : parseInt(request.query.id),
		name : request.query.name,
		score : parseInt(request.query.scores),
	}

	scores.splice(data.id, 0 ,data);
	scores.pop();

	for(var i = 0; i < scores.length; i++){
		scores[i].id = i;
	}

	fs.writeFile('highScore.json',JSON.stringify(scores), function(err){
		if(err){
			console.log(err);
		}
		console.log("successful write");
	});
	

	response.writeHead(200);
	response.end();
};
