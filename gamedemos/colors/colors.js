(function(){
	$(document).ready(
		function(){
			var g = {};
			g.width = 270;
			g.height = g.width;

			g.keys = [];
			
			g.gridWidth = 30;
			g.gridHeight = g.gridWidth;
			
			g.gridArray = [];
			g.noOfGrids = 9;
			for(i=0;i<(g.noOfGrids*g.noOfGrids);i++){
				g.gridArray.push('bg');
			}
			
			//g.bgContext = document.getElementById('bgCanvas').getContext('2d');
			g.fgContext = document.getElementById('fgCanvas').getContext('2d');
			
			g.fgCol = '#13BD8D';
			g.bgCol = '#0B634A';
			g.baseCol = '#000000';
			g.colPickedForExchange = 'none';
			g.portionPickedForExchange = 'none';
			
			g.colsUsed = {};
			g.charsInTest = ['word 1','word 2','word 3','word 4','word 5','word 6'];
			g.charToCreate = g.charsInTest[Math.floor(Math.random()*6)]
			$('#charToCreate').text(g.charToCreate);
			
			var zheng4Grids = [];
			var shang4Grids = [];
			var zhi3Grids = [];
			for(i=0;i<81;i++){
				if(i<27)
					zheng4Grids.push(i);
				else if (i>=27 && i<54)
					{zhi3Grids.push(i);}
				else
					shang4Grids.push(i);
			}
			
			for(i in zheng4Grids){
				//console.log(i);
				g.gridArray[zheng4Grids[i]]='zheng4';
			}
			//var shang4Grids = [11,12,13,14,15,16,17,];
			for(i in shang4Grids){
				//console.log(i);
				g.gridArray[shang4Grids[i]]='shang4';
			}
			//var zhi3Grids = [38,47,56];
			for(i in zhi3Grids){
				//console.log(i);
				g.gridArray[zhi3Grids[i]]='zhi3';
			}
			var baseGrids = [0,1,2,3,4,5,6,7,8,9,18,27,36,45,54,63,72,73,74,75,76,77,78,79,80,17,26,35,44,53,62,71];
			for(i in baseGrids){
				//console.log(i);
				g.gridArray[baseGrids[i]]='base';
			}

			g.colsUsed['zheng4']=g.fgCol;
			g.colsUsed['shang4']=g.fgCol;
			g.colsUsed['zhi3']=g.fgCol;
			g.colsUsed['bg']=g.bgCol;
			g.colsUsed['base']=g.baseCol;
			
			/*g.hints = ['','','','','',''];
			g.instructionNo = 0;*/
			
			reDrawCanvas();
			
			
			$(document).keydown(function(e){
				g.keys[e.keyCode ? e.keyCode : e.which] = true;
				//showNextInstruction();
			});
			$(document).keyup(function(e){
				delete g.keys[e.keyCode ? e.keyCode : e.which];
			});
			
		/*function showNextInstruction(){
			n = g.hints.length;
			if(g.keys[83]){//s key for next hint
				i = g.instructionNo >= n-1 ? g.instructionNo : ++g.instructionNo;
				//console.log(i + ' ' + g.hints[i]);
				updateInstructions(g.hints[i]);
			}
			if(g.keys[65]){//a key for last hint
				i = g.instructionNo <= 0 ? g.instructionNo : --g.instructionNo;
				//console.log(i + ' ' + g.hints[i]);
				updateInstructions(g.hints[i]);
			}

		}*/
		
		function init(){
			//updateInstructions('Target: Gobble the correct character. Press a/s keys for jumping to next/last pieces of information.');
			var cvOffset = $('#fgCanvas').offset();
			$('#fgCanvas').click(function(e){
				relX = e.pageX - cvOffset.left;
				relY = e.pageY - cvOffset.top;
				console.log('e.x,y are ' + e.pageX + ',' + e.pageY + ',' + cvOffset.left + ',' + cvOffset.top);
				var rClicked = Math.floor(relY/g.gridWidth);
				var cClicked = Math.floor(relX/g.gridWidth);
				console.log('r.c clicked ' + rClicked + ',' + cClicked);
				var gridClicked = rClicked*g.noOfGrids + cClicked;
				var colorClicked = g.colsUsed[g.gridArray[gridClicked]];
				var porClicked = g.gridArray[gridClicked];
				console.log('color and por clicked are ' + colorClicked + ',' + porClicked);
				if(g.colPickedForExchange == 'none' && g.portionPickedForExchange == 'none'){
					g.colPickedForExchange = colorClicked;
					g.portionPickedForExchange = porClicked;
					$('#color').css('backgroundColor',colorClicked);
					$('#whenComplete').html('Game in progress');
					$('#charToCreate').css('background','none');
				}
				else{
					g.colsUsed[porClicked] = g.colPickedForExchange;
					g.colsUsed[g.portionPickedForExchange] = colorClicked;
					console.log(porClicked + ' got the color ' + g.colPickedForExchange);
					console.log(g.portionPickedForExchange + ' got the color ' + colorClicked);
					reDrawCanvas();
					g.colPickedForExchange = 'none';
					g.portionPickedForExchange = 'none';
					$('#color').css('background','none');
					checkIfComplete(g.charToCreate);
				}
			});
			//loop();
		}
		
		/*function loop(){
			requestAnimFrame(function() { loop(); });
			console.log('looping');
			update();
		}*/
		
		function reDrawCanvas(){
			for(i=0;i<(g.noOfGrids*g.noOfGrids);i++){
				var r = Math.floor(i/g.noOfGrids);
				var c = i%g.noOfGrids;
				fillGridWithColor(r,c,g.colsUsed[g.gridArray[i]]);
			}		
		}
		
		/*function updateInstructions(instruction){
			$('#directions span').text(instruction);
		}*/
			
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
		
		/*function getGridCategory(r,c){
			var cat = g.gridArray(g.noOfGrids*r+c);
			console.log('total is ' + total);
			
		}*/
		
		function fillGridWithColor(r,c,color){
			g.fgContext.fillStyle = color;
			g.fgContext.fillRect(c*g.gridWidth,r*g.gridWidth,g.gridWidth,g.gridWidth);
		}
		
		function checkIfComplete(charUsed){
			/*if(g.colsUsed['zheng4'] == g.baseCol || g.colsUsed['shang4'] == g.baseCol || g.colsUsed['zhi3'] == g.baseCol){
				$('#whenComplete').html('Remember, you can not use black color! Keep trying.');
				return;
			}*/
			if(charUsed == 'zheng4' || charUsed == 'main' || charUsed == 'positive'){
				if(g.colsUsed['zheng4'] == g.colsUsed['shang4'] && g.colsUsed['zheng4'] == g.colsUsed['zhi3'] && g.colsUsed['zheng4'] != g.colsUsed['bg']){
					$('#whenComplete').html('Well done! Look at the text on the left and play again.');
					g.charToCreate = g.charsInTest[Math.floor(Math.random()*(g.charsInTest.length))]
					$('#charToCreate').text(g.charToCreate);
					$('#charToCreate').css('backgroundColor','#990000');
				}
			}
			else if(charUsed == 'zhi3' || charUsed == 'to stop' || charUsed == 'to prohibit'){
				if(g.colsUsed['zhi3'] != g.colsUsed['shang4'] && g.colsUsed['zheng4'] == g.colsUsed['bg'] && g.colsUsed['zheng4'] != g.colsUsed['shang4'] && g.colsUsed['zheng4'] != g.colsUsed['zhi3']){
					$('#whenComplete').html('Well done! Look at the text on the left and play again.');
					g.charToCreate = g.charsInTest[Math.floor(Math.random()*(g.charsInTest.length))]
					$('#charToCreate').text(g.charToCreate);
					$('#charToCreate').css('backgroundColor','#990000');
				}			
			}
			else if(charUsed == 'shang4' || charUsed == 'on top' || charUsed == 'above'){
				if(g.colsUsed['zheng4'] == g.colsUsed['zhi3'] && g.colsUsed['zheng4'] == g.colsUsed['bg'] && g.colsUsed['zheng4'] != g.colsUsed['shang4']){
					$('#whenComplete').html('Well done! Try next word.');
					g.charToCreate = g.charsInTest[Math.floor(Math.random()*(g.charsInTest.length))]
					$('#charToCreate').text(g.charToCreate);
					$('#charToCreate').css('backgroundColor','#990000');
				}			
			}
		}
		
		init();
		
	});
})();
/*
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
*/
