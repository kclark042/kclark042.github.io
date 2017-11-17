//------------------------------------------------------------------
//
// Make a request to the server to obtain the current set of people 
// and show them.
//
//------------------------------------------------------------------
MyGame.scoreHandler = (function() {
	var that = {
		highScores : [],
	};

	that.getHighScores = function(){
		return that.highScores;
	}
	 that.getScores = function() {
		// $.ajax({
		// 	url: 'http://localhost:3000/v1/scores',
		// 	cache: false,
		// 	type: 'GET',
		// 	error: function() { alert('GET failed'); },
		// 	success: function(data) {
		// 		that.highScores = data;

		// 	}
		// });
	}	

	that.addScore = function(score,name,id){
		var data = {
			id : id,
			score : score,
			name : name,
		};

		// $.ajax({
		// 	url: 'http://localhost:3000/v1/scores?scores=' + data.score+'&name='+data.name+'&id='+data.id,
		// 	type: 'POST',
		// 	error: function() { alert('POST failed'); },
		// 	success: function() {
		// 		that.getScores();
		// 	}
		// });
	}

	return that;

}());

