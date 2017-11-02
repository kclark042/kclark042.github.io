// adapted from https://www.w3schools.com/w3css/w3css_slideshow.asp

var Indexes = {
	'books':0,
	'movies':0,
	'podcasts':0,
	'games':0
}

function plusDivs(n, className) {
  showDivs(Indexes[className] += n, className);
}

function showDivs(n, className) {
  var x = document.getElementsByClassName(className);
  if (n == x.length) {
  	Indexes[className] = 0;
  }
  if (n < 0) {
  	Indexes[className] = x.length-1;
  } 
  for (var i = 0; i < x.length; i++) {
      x[i].style.display = "none";
  }
  x[Indexes[className]].style.display = "block";
}

