/*
 * This is a JS implementation of Conway's Game of Life  http://en.wikipedia.org/wiki/Conway's_Game_of_Life 
 * Rendered with the help of jQuery and HTML5 canvas.
 * 
 * Instructions:
 * - Click on a cell to toggle it's status.. Or use a random seed to generate a random seed.
 * - Click start to start the Game of Life.
 * - Click clear to clear the board.
 * - Click Stop to stop the Game of Life.
 * 
 * Feel free to add or modify the code as you please. If you want to collaborate with me, drop a mail on johri.atharva@gmail.com!
 * 
 * Live free, stay curious, tolerate all.
 * 
 */

(function($){
	
	var lifeStatus = {
		state: "init",
		interval: null
	};
	
	$.fn.life = function(options){
		if (!this || !this[0]){
			return;
		}
		
		//insert canvas into element
		var canvas = document.createElement("canvas");
		canvas.innerHTML = "Y u no use cool browsers? You need a cool browser to run this thing.<br><br> " +
				"<a target='_blank' href='https://www.google.co.in/chrome/browser/'>Chrome Download</a> <br> " +
				"<a target='_blank' href='https://www.mozilla.org/en-US/firefox/new/'>Firefox Download</a> <br>" + 
				"<a target='_blank' href='http://support.apple.com/downloads/#safari'>Safari Download</a> <br> ";
		canvas.setAttribute("id", "lf-life-canvas");
		this[0].appendChild(canvas);
		
		//insert options
		this.prepend(getOptionsMenuHTML());
		
		canvas = $(canvas);
		var context = canvas[0].getContext("2d");
		
		var settings = $.extend({
			scale: 50,
			width: 900,
			height: 800,
			boardStrokeColor: 'black',
			cellFillStyle: 'black',
			drawInterval: 100
		}, options);
		
		settings.boardStrokeWidth = 1;
		
		setupCanvas(canvas, context, settings); //sets up canvas dimensions and event handlers
		settings.cells = setupLifeCells(canvas, context, settings); //generates an array of cells to show on the board
		drawCellsOnBoard(canvas, context, settings); //draw the cells
		
		readySteps(canvas, context, settings); //initialize the canvas refresh interval
	};
	
	function readySteps(canvas, context, settings){
		lifeStatus.interval = setInterval(function(){
			if (lifeStatus.state !== "init"){
				drawCellsOnBoard(canvas, context, settings); //if state is not init, draw current state of cells
				calculateNextStep(settings); //calculate state of all cells for next step
			}
		}, settings.drawInterval);	
	}
	
	/*
		Any live cell with fewer than two live neighbours dies, as if caused by under-population.
		Any live cell with two or three live neighbours lives on to the next generation.
		Any live cell with more than three live neighbours dies, as if by overcrowding.
		Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
	*/
	
	function calculateNextStep(settings){
		for (var i=0;i<settings.cells.length;i++){
			var cell = settings.cells[i];
			var surroundingLiveCellCount = getSurroundingFilledCellCount(cell, settings);
			if (surroundingLiveCellCount < 2 || surroundingLiveCellCount > 3){
				cell.filled = false;
			}else if (surroundingLiveCellCount === 3){
				cell.filled = true;
			}
		}
	}
	
	function getSurroundingFilledCellCount(cell, settings){ //check how many of the surrounded 8 cells of a particular cell is filled
		var c_columnIndex = cell.id.columnIndex;
		var c_rowIndex = cell.id.rowIndex;
		
		var filledCount = 0;
		var surroundedCell = getCellById(new CellIdentifier(c_columnIndex-1, c_rowIndex-1), settings);
		(surroundedCell && surroundedCell.filled) ? filledCount++ : filledCount;
		
		var surroundedCell = getCellById(new CellIdentifier(c_columnIndex, c_rowIndex-1), settings);
		(surroundedCell && surroundedCell.filled) ? filledCount++ : filledCount;
		
		var surroundedCell = getCellById(new CellIdentifier(c_columnIndex+1, c_rowIndex-1), settings);
		(surroundedCell && surroundedCell.filled) ? filledCount++ : filledCount;
		
		var surroundedCell = getCellById(new CellIdentifier(c_columnIndex+1, c_rowIndex), settings);
		(surroundedCell && surroundedCell.filled) ? filledCount++ : filledCount;
		
		var surroundedCell = getCellById(new CellIdentifier(c_columnIndex+1, c_rowIndex+1), settings);
		(surroundedCell && surroundedCell.filled) ? filledCount++ : filledCount;
		
		var surroundedCell = getCellById(new CellIdentifier(c_columnIndex, c_rowIndex+1), settings);
		(surroundedCell && surroundedCell.filled) ? filledCount++ : filledCount;
		
		var surroundedCell = getCellById(new CellIdentifier(c_columnIndex-1, c_rowIndex+1), settings);
		(surroundedCell && surroundedCell.filled) ? filledCount++ : filledCount;
		
		var surroundedCell = getCellById(new CellIdentifier(c_columnIndex-1, c_rowIndex), settings);
		(surroundedCell && surroundedCell.filled) ? filledCount++ : filledCount;
		
		return filledCount;
	}
	
	function getCellById(id, settings){ //get a cell by its coulmn and row indices
		var returnedCell = null;
		for (var i = 0;i<settings.cells.length;i++){
			if ( settings.cells[i].id.columnIndex === id.columnIndex && settings.cells[i].id.rowIndex === id.rowIndex ){
				returnedCell = settings.cells[i];
				break;
			}
		}
		
		return returnedCell;
	}
	
	function stopSteps(){
		clearInterval(lifeStatus.interval);
	}
	
	function setupCanvas(canvas, context, settings){
		canvas.attr("width", settings.width);
		canvas.attr("height", settings.height);
		canvas.addClass("life-canvas");
		
		canvas.on("click", function(e){
			if (lifeStatus.state === "init"){
				invertCellFill(canvas, e, settings, context);
			}
		});
		
		$("#lf-toggle").click(function(){
			if ($(this).text() === "Start Life"){
				lifeStatus.state = "progress";
				$(this).text("Stop Life");
			}else{
				lifeStatus.state = "init";
				$(this).text("Start Life");
			}
		});
		
		$("#lf-clear").click(function(){
			drawCellsOnBoard(canvas, context, settings, true);
		});
		
		$("#lf-random").click(function(){
			drawCellsOnBoard(canvas, context, settings, true);
			for (var i = 0;i<settings.cells.length;i++){
				if (i%Math.floor(Math.random()*100) === 0){
					settings.cells[i].filled = true;
				}
			}
			drawCellsOnBoard(canvas, context, settings);
		});
	}
	
	function invertCellFill(canvas, e, settings, context){ //inverts a cell's status
		var mousePosition = getMousePositionInCanvas(canvas[0], e);
		for (var i = 0;i<settings.cells.length;i++){
			var cell = settings.cells[i];
			if (	mousePosition.x > cell.x && mousePosition.x < (cell.x+cell.width) && 
					mousePosition.y > cell.y && mousePosition.y < (cell.y+cell.height)	){
				cell.filled = !cell.filled;
				break;
			}
		}
		drawCellsOnBoard(canvas, context, settings);
	}
	
	function setupLifeCells(canvas, context, settings){ //returns array of cells which are populated on the board
		var cellWidth = (settings.width + settings.boardStrokeWidth) / (settings.scale);
		var cellHeight = (settings.height + settings.boardStrokeWidth) / (settings.scale);
		var cells = [];
		
		for (var i=0;i<settings.scale; i++){
			for (var j=0;j<settings.scale; j++){
				cells.push ( new Cell( (new CellIdentifier(i, j)), i*cellWidth+1, j*cellHeight+1, (cellWidth - 3*settings.boardStrokeWidth), (cellHeight - 3*settings.boardStrokeWidth), false) );				
			};
		}
		
		return cells;
	}
	
	function drawCellsOnBoard(canvas, context, settings, clear){ //draw cells on board
		context.clearRect(0, 0, canvas.width(), canvas.height());
		for (var i = 0;i<settings.cells.length;i++){
			context.beginPath();
			context.rect(settings.cells[i].x, settings.cells[i].y, settings.cells[i].width, settings.cells[i].height);
			if (clear){
				settings.cells[i].filled = false;
			}
			if (settings.cells[i].filled){
				context.fillStyle = settings.cellFillStyle;
				context.fill();	
			}
			context.lineWidth = settings.boardStrokeWidth;
			context.strokeStyle = settings.boardStrokeColor;
			context.stroke();
		}
	}
	
	function getOptionsMenuHTML(){
		return  "<div class='lf-options-container'>" +
			"<div class='lf-option' id='lf-toggle'>Start Life</div>" +
			"<div class='lf-option' id='lf-clear'>Clear</div>" +
			"<div class='lf-option' id='lf-random'>Random Seed</div>" +
		"</div>";
	}
	
	function getMousePositionInCanvas(canvas, evt) {
	    var rect = canvas.getBoundingClientRect();
	    return {
	    	x: (evt.clientX - rect.left),
	      	y: (evt.clientY - rect.top)
	    };
	};
	
	function CellIdentifier(columnIndex, rowIndex){
		this.columnIndex = columnIndex;
		this.rowIndex = rowIndex;
	}
	
	function Cell(customId, x, y, width, height, filled){
		this.id = customId;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.filled = filled || false;
	}
}(jQuery));

