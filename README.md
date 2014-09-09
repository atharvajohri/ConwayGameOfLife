Conway's Game Of Life
================

http://en.wikipedia.org/wiki/Conway's_Game_of_Life

A implementation of Conway's Game Of Life on the browser using HTML5 canvas and JavaScript.

Instructions:<br>
 - Click on a cell to toggle it's status.. Or use a random seed to generate a random seed.
 - Click start to start the Game of Life.
 - Click clear to clear the board.
 - Click Stop to stop the Game of Life.
 
Usage:<br>
 The code is packed into a jQuery plugin, so loading jQuery before the plugin files is necessary.
 
Basic:<br>
  $(document).ready(function(){<br>
      $("#life-container").life();<br>
  });<br>
 
 Options:<br>
  	scale: Default 50 - defines the scale of the board, ie, number of cells in each row/column.<br>
	width: Default 900 - Width of the canvas on which the board is drawn<br>
	height: Default 800 - Width of the canvas on which the board is drawn<br>
	boardStrokeColor: Default black - color with which each cell is bordered<br>
	cellFillStyle: Default 'black' - color with which a live cell is filled<br>
	drawInterval: Default 100 - number of milliseconds in which the canvas is refreshed<br><br>
	
Example:<br>
	$("#life-container").life({<br>
		  scale: 60,<br>
		  cellFillStyle: 'blue'<br>
	});
