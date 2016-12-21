$(document).ready(function(){
	
	var g = {};
	g.width = 300;
	g.height = 300;
	
	g.noOfRows = 6;
	g.gridArr = [];
	g.gridWidth = g.width/g.noOfRows;
	
	g.images = [];
	g.reqdImages = 0;
	g.loadedImages = 0;
	
	g.relX = -1;
	g.relY = -1;
	
	g.bgContext = document.getElementById('bgCanvas').getContext('2d');
	g.fgContext = document.getElementById('fgCanvas').getContext('2d');
	g.imContext = document.getElementById('imCanvas').getContext('2d');
	g.fgContext.font = "15px Verdana";
	
	g.incomingLinju = -1;
	
	g.score = 0;
	
	g.blocksArr = [];
	for(i=0; i<14; i++){	//hardcoded
		g.blocksArr.push({
			sNo: i,
			visible: true
		});
	}
	
	//console.log('grid width is ' + g.gridWidth);
	for(i=0; i<g.noOfRows; i++){
		g.gridArr[i]=[];
	}
	
	for(i=0; i<g.noOfRows; i++){
		for(j=0; j<g.noOfRows; j++){
			g.gridArr[i].push({
				canBeOccupied: true,
				x: j*g.gridWidth,
				y: i*g.gridWidth,
				r: i,
				c: j,
				val: 0,
				id: 'none',
				neighbor: 0,
				freeSides: 4
			});
		}
	}
	
	function getRandomNoBw(numA,numB){
		//console.log('creating a random no between ' + numA + ' and ' + numB);
		return Math.floor(Math.random()*(numB-numA+1)+numA);
	}
	
	/**
	 * Randomize array element order in-place.
	 * Using Fisher-Yates shuffle algorithm.
	 */
	function shuffleArray(array) {
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	}
	
	function uploadImage(imageName){
		g.reqdImages++;
		var image = new Image;
		image.src = 'images/' + imageName + '.png';
		g.images.push({
			pic: image,
			w: -1,
			h: -1,
			id: imageName
		});
		image.onload = function(){
			g.loadedImages++;
		};
	}
	
	function verifyUploadOfImages(){
		if(g.loadedImages == g.reqdImages){
			init();
		}
		else {
			setTimeout(function(){ verifyUploadOfImages(); }, 500);
		}
	}
	
	function updateImageIds(){
		for(i in g.images){
			if(i<12){
				g.images[i].id = Math.floor(i/4) + 3;
				//console.log('assigned id ' + g.images[i].id + ' to image ' + i);
			}
			if(i==12){
				g.images[i].id = 12;
				//console.log('assigned id ' + g.images[i].id + ' to image ' + i);
			}
			if(i==13){
				g.images[i].id = 20;
				//console.log('assigned id ' + g.images[i].id + ' to image ' + i);
			}
		}
	}
	
	function drawImagesInImCanvas(){
		var imCanvasOffset = $('#imCanvas').offset();
		var relX = -1;
		var relY = -1;
		var col = -1;
		var row = -1;
		for(i=0;i<g.blocksArr.length;i++){
			//console.log('image id is ' + g.blocksArr[i].sNo);
			var r = Math.floor(i/g.noOfRows);
			var c = i%g.noOfRows;
			g.imContext.drawImage(g.images[g.blocksArr[i].sNo].pic,g.gridWidth*c,g.gridWidth*r);
		}
		
		$('#imCanvas').click(function(e) {
			relX = e.pageX - imCanvasOffset.left;
			relY = e.pageY - imCanvasOffset.top;
			col = Math.floor(relX/g.gridWidth);
			row = Math.floor(relY/g.gridWidth);
			var tempNum = row*g.noOfRows+col;
			//console.log('you clicked in row,col - ' + tempNum);
			if(tempNum<14 && g.blocksArr[tempNum].visible){
				g.incomingLinju = g.images[g.blocksArr[tempNum].sNo];
				g.blocksArr[tempNum].visible = false;
				g.imContext.clearRect(col*g.gridWidth,row*g.gridWidth,g.gridWidth,g.gridWidth);
				//console.log('treated row and col ' + row + ',' + col);
			}
		});
	}
	
	function init(){
		//console.log('boo, init is here');
		updateImageIds();
		var cvOffset = $('#bgCanvas').offset();
		//console.log('canvas coordinates are ' + cvOffset.top + ',' + cvOffset.left);
		for(i=0; i<g.noOfRows; i++){
			for(j=0; j<g.noOfRows; j++){	
				g.fgContext.drawImage(g.images[14].pic,g.gridArr[i][j].x,g.gridArr[i][j].y);
				g.fgContext.fillText(g.gridArr[i][j].val,g.gridArr[i][j].x+g.gridWidth/2-5,g.gridArr[i][j].y+g.gridWidth/2);
			}
		}
		shuffleArray(g.blocksArr);
		drawImagesInImCanvas();
		$('#fgCanvas').click(function(e){
			g.relX = e.pageX - cvOffset.left;
			g.relY = e.pageY - cvOffset.top;
			//console.log('relative position of mouse click is  ' + g.relX + ',' + g.relY);
			createImageInClickedBox(g.relX,g.relY);
			//console.log('total score is ' + g.score);
			g.score = 0;
			for(i in g.gridArr){
				for(j in g.gridArr[i]){
					g.score += g.gridArr[i][j].val;
				}
			}
			$('#scoreSpan').html('Score: ' + g.score);
		});		
	}
	
	function createImageInClickedBox(x,y){
		if(g.incomingLinju == -1){ return; }
		var col = Math.floor(x/g.gridWidth);
		var row = Math.floor(y/g.gridWidth);
		//g.gridArr[row][col].id = g.incomingLinju.id;
		if(g.incomingLinju.id != -1 && validateClick(row,col)){
			g.fgContext.drawImage(g.incomingLinju.pic,col*g.gridWidth,row*g.gridWidth);
			//updateCellsAroundCell(row,col);
			findNeighborsForEachCell(row,col);
		}
	}
	
	function findNeighborsForEachCell(r,c){
		if(r+1>=g.noOfRows){
			if(g.gridArr[r-1][c].id != 'none') {
				g.gridArr[r][c].freeSides--;
				g.gridArr[r-1][c].freeSides--;
				createScoresForEachCell(r-1,c,false);
			}
		}
		else if(r-1<0){
			if(g.gridArr[r+1][c].id != 'none') {
				g.gridArr[r][c].freeSides--;
				g.gridArr[r+1][c].freeSides--;
				createScoresForEachCell(r+1,c,false);
			}
		}
		else{
			if(g.gridArr[r-1][c].id != 'none') {
				g.gridArr[r][c].freeSides--;
				g.gridArr[r-1][c].freeSides--;
				createScoresForEachCell(r-1,c,false);
			}
			if(g.gridArr[r+1][c].id != 'none') {
				g.gridArr[r][c].freeSides--;
				g.gridArr[r+1][c].freeSides--;
				createScoresForEachCell(r+1,c,false);
			}
		}
		
		if(c+1>=g.noOfRows){
			if(g.gridArr[r][c-1].id != 'none') {
				g.gridArr[r][c].freeSides--;
				g.gridArr[r][c-1].freeSides--;
				createScoresForEachCell(r,c-1,false);
			}
		}
		else if(c-1<0){
			if(g.gridArr[r][c+1].id != 'none') {
				g.gridArr[r][c].freeSides--;
				g.gridArr[r][c+1].freeSides--;
				createScoresForEachCell(r,c+1,false);
			}
		}
		else{
			if(g.gridArr[r][c-1].id != 'none') {
				g.gridArr[r][c].freeSides--;
				g.gridArr[r][c-1].freeSides--;	
				createScoresForEachCell(r,c-1,false);
			}
			if(g.gridArr[r][c+1].id != 'none') {
				g.gridArr[r][c].freeSides--;
				g.gridArr[r][c+1].freeSides--;
				createScoresForEachCell(r,c+1,false);
			}
		}
		createScoresForEachCell(r,c,true);
	}
	
	function createScoresForEachCell(r,c,isNew){
		var influence = (5 - g.gridArr[r][c].freeSides);
		//var influence = 1;
		//console.log('influence is ' + influence);
		if(r+1>=g.noOfRows){
			if(g.gridArr[r-1][c].id == 'none') {
				if(isNew){
					g.gridArr[r-1][c].val += influence;
				}
				else {
					g.gridArr[r-1][c].val++;
				}
				//g.gridArr[r-1][c].val = Math.max(0, g.gridArr[r-1][c].val-1);
				//console.log('reduced to ' + g.gridArr[r-1][c].val);
				//g.gridArr[r-1][c].val += influence;
				g.fgContext.drawImage(g.images[14].pic,g.gridArr[r-1][c].x,g.gridArr[r-1][c].y);
				g.fgContext.fillText(g.gridArr[r-1][c].val,g.gridArr[r-1][c].x+g.gridWidth/2-5,g.gridArr[r-1][c].y+g.gridWidth/2);
			}
		}
		else if(r-1<0){
			if(g.gridArr[r+1][c].id == 'none') {
				if(isNew){
					g.gridArr[r+1][c].val += influence;
				}
				else {
					g.gridArr[r+1][c].val++;
				}

				//g.gridArr[r+1][c].val += influence;
				//g.gridArr[r+1][c].val = Math.max(0, g.gridArr[r+1][c].val-1);
				//console.log('reduced to ' + g.gridArr[r+1][c].val);
				//g.gridArr[r+1][c].val += influence;
				g.fgContext.drawImage(g.images[14].pic,g.gridArr[r+1][c].x,g.gridArr[r+1][c].y);
				g.fgContext.fillText(g.gridArr[r+1][c].val,g.gridArr[r+1][c].x+g.gridWidth/2-5,g.gridArr[r+1][c].y+g.gridWidth/2);
			}
		}
		else{
			if(g.gridArr[r-1][c].id == 'none') {
				if(isNew){
					g.gridArr[r-1][c].val += influence;
				}
				else {
					g.gridArr[r-1][c].val++;
				}			
				//g.gridArr[r-1][c].val += influence;
				//g.gridArr[r-1][c].val = Math.max(0, g.gridArr[r-1][c].val-1);
				//console.log('reduced to ' + g.gridArr[r-1][c].val);
				//g.gridArr[r-1][c].val += influence;
				g.fgContext.drawImage(g.images[14].pic,g.gridArr[r-1][c].x,g.gridArr[r-1][c].y);
				g.fgContext.fillText(g.gridArr[r-1][c].val,g.gridArr[r-1][c].x+g.gridWidth/2-5,g.gridArr[r-1][c].y+g.gridWidth/2);
			}
			if(g.gridArr[r+1][c].id == 'none') {
				if(isNew){
					g.gridArr[r+1][c].val += influence;
				}
				else {
					g.gridArr[r+1][c].val++;
				}			
				//g.gridArr[r+1][c].val += influence;
				//g.gridArr[r+1][c].val = Math.max(0, g.gridArr[r+1][c].val-1);
				//console.log('reduced to ' + g.gridArr[r+1][c].val);
				//g.gridArr[r+1][c].val += influence;
				g.fgContext.drawImage(g.images[14].pic,g.gridArr[r+1][c].x,g.gridArr[r+1][c].y);
				g.fgContext.fillText(g.gridArr[r+1][c].val,g.gridArr[r+1][c].x+g.gridWidth/2-5,g.gridArr[r+1][c].y+g.gridWidth/2);
			}
		}
		
		if(c+1>=g.noOfRows){
			if(g.gridArr[r][c-1].id == 'none') {
				if(isNew){
					g.gridArr[r][c-1].val += influence;
				}
				else {
					g.gridArr[r][c-1].val++;
				}			
				//g.gridArr[r][c-1].val = Math.max(0, g.gridArr[r][c-1].val-1);
				//console.log('reduced to ' + g.gridArr[r][c-1].val);
				//g.gridArr[r][c-1].val += influence;
				g.fgContext.drawImage(g.images[14].pic,g.gridArr[r][c-1].x,g.gridArr[r][c-1].y);
				g.fgContext.fillText(g.gridArr[r][c-1].val,g.gridArr[r][c-1].x+g.gridWidth/2-5,g.gridArr[r][c-1].y+g.gridWidth/2);
			}
		}
		else if(c-1<0){
			if(g.gridArr[r][c+1].id == 'none') {
				if(isNew){
					g.gridArr[r][c+1].val += influence;
				}
				else {
					g.gridArr[r][c+1].val++;
				}				
				//g.gridArr[r][c+1].val = Math.max(0, g.gridArr[r][c+1].val);
				//console.log('reduced to ' + g.gridArr[r][c+1].val);
				//g.gridArr[r][c+1].val += influence;
				g.fgContext.drawImage(g.images[14].pic,g.gridArr[r][c+1].x,g.gridArr[r][c+1].y);
				g.fgContext.fillText(g.gridArr[r][c+1].val,g.gridArr[r][c+1].x+g.gridWidth/2-5,g.gridArr[r][c+1].y+g.gridWidth/2);
			}
		}
		else{
			if(g.gridArr[r][c-1].id == 'none') {
				if(isNew){
					g.gridArr[r][c-1].val += influence;
				}
				else {
					g.gridArr[r][c-1].val++;
				}				
				//g.gridArr[r][c-1].val = Math.max(0, g.gridArr[r][c-1].val-1);
				//console.log('reduced to ' + g.gridArr[r][c-1].val);
				//g.gridArr[r][c-1].val += influence;
				g.fgContext.drawImage(g.images[14].pic,g.gridArr[r][c-1].x,g.gridArr[r][c-1].y);
				g.fgContext.fillText(g.gridArr[r][c-1].val,g.gridArr[r][c-1].x+g.gridWidth/2-5,g.gridArr[r][c-1].y+g.gridWidth/2);
			}
			if(g.gridArr[r][c+1].id == 'none') {
				if(isNew){
					g.gridArr[r][c+1].val += influence;
				}
				else {
					g.gridArr[r][c+1].val++;
				}				
				g.fgContext.drawImage(g.images[14].pic,g.gridArr[r][c+1].x,g.gridArr[r][c+1].y);
				g.fgContext.fillText(g.gridArr[r][c+1].val,g.gridArr[r][c+1].x+g.gridWidth/2-5,g.gridArr[r][c+1].y+g.gridWidth/2);
			}
		}		
	}
	
	function ifDifferentIds(id1,id2){
		if((id1 == 3 && id2 == 3) || (id1 == 3 && id2 == 12) || (id1 == 12 && id2 == 3) || (id1 == 4 && id2 == 4) || (id1 == 4 && id2 == 12) || (id1 == 12 && id2 == 4) || (id1 == 4 && id2 == 20) || (id1 == 20 && id2 == 4) || (id1 == 5 && id2 == 5) || (id1 == 5 && id2 == 20) || (id1 == 20 && id2 == 5)){
			return false;
		}
		return true;
	}
	
	function validateClick(row,col){
		//console.log('row and col of clicked cell are ' + row + ',' + col);
		if(row+1>=g.noOfRows){
			if(g.gridArr[row-1][col].id != 'none' && ifDifferentIds(g.gridArr[row-1][col].id,g.incomingLinju.id)){
				return false;
			}
		}
		else if(row-1<0){
			if(g.gridArr[row+1][col].id != 'none' && ifDifferentIds(g.gridArr[row+1][col].id,g.incomingLinju.id)){
				return false;
			}		
		}
		else{
			if((g.gridArr[row-1][col].id != 'none' && ifDifferentIds(g.gridArr[row-1][col].id,g.incomingLinju.id)) || (g.gridArr[row+1][col].id != 'none' && ifDifferentIds(g.gridArr[row+1][col].id,g.incomingLinju.id))){
				return false;
			}
		}
		
		if(col+1>=g.noOfRows){
			if(g.gridArr[row][col-1].id != 'none' && ifDifferentIds(g.gridArr[row][col-1].id,g.incomingLinju.id)){
				return false;
			}
		}
		else if(col-1<0){
			if(g.gridArr[row][col+1].id != 'none' && ifDifferentIds(g.gridArr[row][col+1].id,g.incomingLinju.id)){
				return false;
			}		
		}
		else{
			if((g.gridArr[row][col-1].id != 'none' && ifDifferentIds(g.gridArr[row][col-1].id,g.incomingLinju.id)) || (g.gridArr[row][col+1].id != 'none' && ifDifferentIds(g.gridArr[row][col+1].id,g.incomingLinju.id))){
				return false;
			}
		}
		g.gridArr[row][col].id = g.incomingLinju.id;
		g.gridArr[row][col].val = 0;
		g.incomingLinju.id = -1;
		return true;
	}
	
	function updateAllCells(){
		for(i in g.gridArr){
			for(j in g.gridArr[i]){
				//if right left up down ids none then calculate linjus and score 
				if(i == g.noOfRows - 1){ 	//last row
				
				}
				else if (i == 0){			//first row
				
				}
				else{
				
				}
				

			}
		}
	}
	
	function updateCellsAroundCellv2(r,c){
		var br = r-1;
		var ar = r+1;
		var bc = c-1;
		var ac = c+1;
		
		g.gridArr[r][c].val = g.gridArr[r][c].freeSides*(g.gridArr[r][c].neighbor+1);
	}
	
	function updateCellsAroundCell(r,c){
		//console.log('updating cells around ' + r + ',' + c);
		if(r+1>=g.noOfRows){
			if(g.gridArr[r-1][c].id == 'none'){
				g.fgContext.drawImage(g.images[14].pic,g.gridArr[r-1][c].x,g.gridArr[r-1][c].y);
				g.gridArr[r-1][c].val++;
				g.score++;
				g.fgContext.fillText(g.gridArr[r-1][c].val,g.gridArr[r-1][c].x+g.gridWidth/2-5,g.gridArr[r-1][c].y+g.gridWidth/2);
			}
		}
		else if(r-1<0){
			if(g.gridArr[r+1][c].id == 'none'){
				g.fgContext.drawImage(g.images[14].pic,g.gridArr[r+1][c].x,g.gridArr[r+1][c].y);
				g.gridArr[r+1][c].val++;
				g.score++;
				g.fgContext.fillText(g.gridArr[r+1][c].val,g.gridArr[r+1][c].x+g.gridWidth/2-5,g.gridArr[r+1][c].y+g.gridWidth/2);
			}
		}
		else{
			if(g.gridArr[r-1][c].id == 'none'){
				g.fgContext.drawImage(g.images[14].pic,g.gridArr[r-1][c].x,g.gridArr[r-1][c].y);
				g.gridArr[r-1][c].val++;
				g.score++;
				g.fgContext.fillText(g.gridArr[r-1][c].val,g.gridArr[r-1][c].x+g.gridWidth/2-5,g.gridArr[r-1][c].y+g.gridWidth/2);
			}
			if(g.gridArr[r+1][c].id == 'none'){
				g.fgContext.drawImage(g.images[14].pic,g.gridArr[r+1][c].x,g.gridArr[r+1][c].y);
				g.gridArr[r+1][c].val++;
				g.score++;
				g.fgContext.fillText(g.gridArr[r+1][c].val,g.gridArr[r+1][c].x+g.gridWidth/2-5,g.gridArr[r+1][c].y+g.gridWidth/2);
			}
		}
		if(c+1>=g.noOfRows){
			if(g.gridArr[r][c-1].id == 'none'){
				g.fgContext.drawImage(g.images[14].pic,g.gridArr[r][c-1].x,g.gridArr[r][c-1].y);
				g.gridArr[r][c-1].val++;
				g.score++;
				g.fgContext.fillText(g.gridArr[r][c-1].val,g.gridArr[r][c-1].x+g.gridWidth/2-5,g.gridArr[r][c-1].y+g.gridWidth/2);
			}
		}
		else if(c-1<0){
			if(g.gridArr[r][c+1].id == 'none'){
				g.fgContext.drawImage(g.images[14].pic,g.gridArr[r][c+1].x,g.gridArr[r][c+1].y);
				g.gridArr[r][c+1].val++;
				g.score++;
				g.fgContext.fillText(g.gridArr[r][c+1].val,g.gridArr[r][c+1].x+g.gridWidth/2-5,g.gridArr[r][c+1].y+g.gridWidth/2);
			}
		}
		else{
			if(g.gridArr[r][c-1].id == 'none'){
				g.fgContext.drawImage(g.images[14].pic,g.gridArr[r][c-1].x,g.gridArr[r][c-1].y);
				g.gridArr[r][c-1].val++;
				g.score++;
				g.fgContext.fillText(g.gridArr[r][c-1].val,g.gridArr[r][c-1].x+g.gridWidth/2-5,g.gridArr[r][c-1].y+g.gridWidth/2);
			}
			if(g.gridArr[r][c+1].id == 'none'){
				g.fgContext.drawImage(g.images[14].pic,g.gridArr[r][c+1].x,g.gridArr[r][c+1].y);
				g.gridArr[r][c+1].val++;
				g.score++;
				g.fgContext.fillText(g.gridArr[r][c+1].val,g.gridArr[r][c+1].x+g.gridWidth/2-5,g.gridArr[r][c+1].y+g.gridWidth/2);
			}
		}
		g.incomingLinju = -1;
	}
	for(k=0;k<14;k++){
		uploadImage(k);
	}
	uploadImage('block');
	verifyUploadOfImages();
	//init();
});