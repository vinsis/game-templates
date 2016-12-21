(function(){
	$(document).ready(function(){
		//alert('hola');
		var game = {};
			
		game.width = 360;
		game.height = 360;
		
		game.noOfRows = 6;
		game.gridArr = [];
		game.gridWidth = game.width/game.noOfRows;

		for(i=0; i<game.noOfRows; i++){
			game.gridArr[i]=[];
		}
		
		for(i=0; i<game.noOfRows; i++){
			for(j=0; j<game.noOfRows; j++){
				game.gridArr[i].push({
					x: j*game.gridWidth,
					y: i*game.gridWidth,
					r: i,
					c: j,
					val: 0,
					rad: 'none',
					phone: 'none',
					clicked: 0,
					oneClick: false,
					rowCheck: false,
					colCheck: false
				});
			}
		}

		game.guessMode = true;
		game.guessedChar = 'none';
		game.guessedCharId = -1;
		game.rightGuesses = 0;
		
		game.images = [];
		game.imagesV2 = [];
		game.loadedImages = 0;
		game.reqdImages = 0;
		game.reqdImagesv2 = 0;
		game.loadedImagesv2 = 0;
		game.clickNo = 1;
		
		game.bgContext = document.getElementById('bgCanvas').getContext('2d');
		game.fgContext = document.getElementById('fgCanvas').getContext('2d');
		game.imContext = document.getElementById('imCanvas').getContext('2d');
		
		/*if the game involves moving player*/
		/*
		game.keys = [];
		game.speed = 5;
		
		game.mobileImageLastx = -1;
		game.mobileImageLasty = -1;
		game.mobileImageId = 'player';
		$(document).keydown(function(e){
			game.keys[e.keyCode ? e.keyCode : e.which] = true;
		});
		$(document).keyup(function(e){
			delete game.keys[e.keyCode ? e.keyCode : e.which];
		});
		*/
		//moving player setup ends here
		
		var rads = [
					'hand',		//0
					'metal',	//1
					'mouth',	//2
					'fire'		//3
					];
		var phones = [
					'p1',		//0
					'p2',		//1
					'p3',		//2
					'p4',		//3
					'p5'		//4
					];
		var minNum = Math.min(rads.length,phones.length);
		//game.chart = {};
		game.charsArr = [];
		var hintsShown = 0;
		for(i in rads){
			game.charsArr[i] = [];
		}
		game.charsArr[1][1] = 'metalp2';
		game.charsArr[1][0] = 'metalp1';
		game.charsArr[0][0] = 'handp1';
		game.charsArr[0][3] = 'handp4';
		game.charsArr[2][3] = 'mouthp4';
		game.charsArr[2][2] = 'mouthp3';
		game.charsArr[3][3] = 'firep4';
		game.charsArr[0][4] = 'handp5';
		game.charsArr[3][4] = 'firep5';
		game.charsArr[1][2] = 'metalp3';
		

		
		function resetImageParams(imageArr){
			for(i in imageArr){
				imageArr[i].w = imageArr[i].pic.width;
				imageArr[i].h = imageArr[i].pic.height;
				console.log('updated an image with parameters' + i + ',' + imageArr[i].w + ',' + imageArr[i].h);
			}
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
		
		function init(){
			resetImageParams(game.images);
			resetImageParams(game.imagesV2);
			/*for(i in rads){
				game.charsArr[i] = [];
			}
			game.charsArr[1][1] = 'metalp2';
			game.charsArr[1][0] = 'metalp1';
			game.charsArr[0][0] = 'handp1';
			game.charsArr[0][3] = 'handp4';
			game.charsArr[2][3] = 'mouthp4';
			game.charsArr[2][2] = 'mouthp3';
			game.charsArr[3][3] = 'firep4';
			game.charsArr[0][4] = 'handp5';
			game.charsArr[3][4] = 'firep5';
			game.charsArr[1][2] = 'metalp3';
			*/
			initCanvas();
			//toggleGuessAnswer();
			clickOnCanvas();
			drawImagesInImCanvas();
			//loop();
		}
		
		function initCanvas(){
			for(i=0; i<game.noOfRows; i++){
				for(j=0; j<game.noOfRows; j++){	
					game.fgContext.drawImage(game.images[0].pic,game.gridArr[i][j].x,game.gridArr[i][j].y);
					//game.fgContext.fillText(game.gridArr[i][j].val,game.gridArr[i][j].x+game.gridWidth/2-5,game.gridArr[i][j].y+game.gridWidth/2);
				}
			}
			var tempArr = [];
			for(i=0; i<game.noOfRows*game.noOfRows; i++){
				tempArr[i] = i;
			}
			shuffleArray(tempArr);
			for(i in game.charsArr){
				for(j in game.charsArr[i]){
					if(typeof game.charsArr[i][j] != 'undefined'){
						//loadImageToArr(game.charsArr[i][j],game.imagesV2);
						var row = Math.floor(tempArr[0]/game.noOfRows);
						var col = tempArr[0]%game.noOfRows;
						game.fgContext.drawImage(game.images[1].pic,game.gridArr[row][col].x,game.gridArr[row][col].y);
						game.gridArr[row][col].rad = i;
						game.gridArr[row][col].phone = j;
						game.gridArr[row][col].val = game.charsArr[i][j];
						tempArr.splice(0,1);
					}
				}
			}
		}
		
		function showSiblings(rad,phone,rowCheck,colCheck){
			console.log('rad and phone are ' + rad + ',' + phone);
			for(i in game.gridArr){
				for(j in game.gridArr[i]){
					if(game.gridArr[i][j].clicked < 2){
						//console.log('checkpoint');
						if(!rowCheck && game.gridArr[i][j].rad == rad && game.gridArr[i][j].phone != phone){
							if(game.gridArr[i][j].clicked == 0){
								game.fgContext.fillText(game.clickNo,game.gridArr[i][j].x+game.gridWidth/2-10,game.gridArr[i][j].y+game.gridWidth/2);
								console.log('matched rad ' + rad + ' - '  + i + ',' + j);
							}	
							if(game.gridArr[i][j].clicked == 1){
								game.fgContext.fillText(game.clickNo,game.gridArr[i][j].x+game.gridWidth/2+10,game.gridArr[i][j].y+game.gridWidth/2);
								console.log('matched rad ' + rad + ' - '  + i + ',' + j);
							}
							//console.log('row check is true for rad ' + rad);
							game.gridArr[i][j].rowCheck = true;
							game.gridArr[i][j].clicked++;
						}
						if(!colCheck && game.gridArr[i][j].phone == phone){
							if(game.gridArr[i][j].clicked == 0){
								game.fgContext.fillText(game.clickNo,game.gridArr[i][j].x+game.gridWidth/2-10,game.gridArr[i][j].y+game.gridWidth/2);
								console.log('matched phone ' + phone + ' - ' + i + ',' + j);
							}	
							if(game.gridArr[i][j].clicked == 1){
								game.fgContext.fillText(game.clickNo,game.gridArr[i][j].x+game.gridWidth/2+10,game.gridArr[i][j].y+game.gridWidth/2);
								console.log('matched phone ' + phone + ' - ' + i + ',' + j);
							}							
							//console.log('col check is true for phone ' + phone);
							game.gridArr[i][j].colCheck = true;
							game.gridArr[i][j].clicked++;
						}
					}
					
					/*if((game.gridArr[i][j].rad == rad || game.gridArr[i][j].phone == phone) && game.gridArr[i][j].clicked < 2){
						if(game.gridArr[i][j].clicked == 0){
							game.fgContext.fillText(game.clickNo,game.gridArr[i][j].x+game.gridWidth/2-10,game.gridArr[i][j].y+game.gridWidth/2);
							console.log('matched with rad/phone ' + rad + '/' + phone + ' with value ' + game.clickNo + ' and i,j  = ' + i + ',' + j);
						} else
						if(game.gridArr[i][j].clicked == 1){
							game.fgContext.fillText(game.clickNo,game.gridArr[i][j].x+game.gridWidth/2+10,game.gridArr[i][j].y+game.gridWidth/2);
							console.log('matched click 1 with rad/phone ' + rad + '/' + phone + ' with value ' + game.clickNo + ' and i,j  = ' + i + ',' + j);
						}
						game.gridArr[i][j].clicked++;
					}*/
				}
			}
		}
		
		/*function toggleGuessAnswer(){
			clickOnCanvas();
			$('#ansButton').click(function(){
				game.guessMode = !game.guessMode;
				if(game.guessMode){
					$(this).html('Disclose Characters');
					$('fgCanvas').off('click');
					clickOnCanvas();
				}
				else{
					$(this).html('Keep investigating');
					$('fgCanvas').off('click');
					clickOnCanvas();
				}
			});			
		}*/
		
		function clickOnCanvas(){
			var fgCanvasOffset = $('#fgCanvas').offset();
			var relX = -1;
			var relY = -1;
			var col = -1;
			var row = -1;
			//$('fgCanvas').off('click');

			console.log('guess mode is ' + game.guessMode);
			$('#fgCanvas').click(function(e) {			
				relX = e.pageX - fgCanvasOffset.left;
				relY = e.pageY - fgCanvasOffset.top;
				col = Math.floor(relX/game.gridWidth);
				row = Math.floor(relY/game.gridWidth);

				if(game.guessedChar != 'none'){
					if(game.gridArr[row][col].val == game.guessedChar){
						console.log('yaay, right guess');
						$('#directions span').text('yaay, right guess');
						game.fgContext.drawImage(game.imagesV2[game.guessedCharId].pic,col*game.gridWidth,row*game.gridWidth);
						game.guessedChar = 'none';
						game.rightGuesses++;
						checkIfGameComplete();
					}
					else{
						console.log('Boo, wrong answer');
						$('#directions span').text('Boo, wrong answer');
						game.guessedChar = 'none';
					}
				}
				else{
					if(game.gridArr[row][col].val != 0 && game.gridArr[row][col].clicked < 2 && !game.gridArr[row][col].oneClick){
						showSiblings(game.gridArr[row][col].rad,game.gridArr[row][col].phone,game.gridArr[row][col].rowCheck,game.gridArr[row][col].colCheck);
						/*
						if(game.gridArr[row][col].clicked == 0){
							game.fgContext.fillText(game.clickNo,game.gridArr[row][col].x+game.gridWidth/2-10,game.gridArr[row][col].y+game.gridWidth/2);
						} else
						if(game.gridArr[row][col].clicked == 1){
							game.fgContext.fillText(game.clickNo,game.gridArr[row][col].x+game.gridWidth/2+10,game.gridArr[row][col].y+game.gridWidth/2);
						} */
						game.clickNo++;	
						game.gridArr[row][col].oneClick = true;
						//game.gridArr[row][col].clicked++;
					}
				}
				//var tempNum = row*g.noOfRows+col;
				//console.log('you clicked in row,col - ' + row + ',' + col);
			});	
		}
		/*
		function loop(){
			requestAnimFrame(function() {
				loop();
			});
			console.log('boo');
			//continue the game
		}
		*/
		
		function checkIfGameComplete(){
			if(game.rightGuesses == game.imagesV2.length){
				game.fgContext.font = "bold 30px monaco";
				game.fgContext.fillStyle = "black";
				game.fgContext.fillText('Game Over!', game.width/2-50,game.height/2-50);
				$('#directions span').text('Congrats! You successfully completed the game');
			}
		}
		
		function drawImagesInImCanvas(){
			var imCanvasOffset = $('#imCanvas').offset();
			var relX = -1;
			var relY = -1;
			var col = -1;
			var row = -1;	
			for(i in game.imagesV2){
				//console.log('image id is ' + game.imagesV2[i].id);
				var r = Math.floor(i/game.noOfRows);
				var c = i%game.noOfRows;
				//console.log('drawing image in imCanvas ' + game.gridWidth*c + ',' + game.gridWidth*r);
				//console.log(game.imagesV2[i].w);
				game.imagesV2[i].x = game.gridWidth*c;
				game.imagesV2[i].y = game.gridWidth*r;
				game.imContext.drawImage(game.imagesV2[i].pic,game.gridWidth*c,game.gridWidth*r);
			}
			$('#imCanvas').click(function(e) {
				relX = e.pageX - imCanvasOffset.left;
				relY = e.pageY - imCanvasOffset.top;
				col = Math.floor(relX/game.gridWidth);
				row = Math.floor(relY/game.gridWidth);	
				var tx = col*game.gridWidth;
				var ty = row*game.gridWidth;
				for(i in game.imagesV2){
					if(game.imagesV2[i].x == tx && game.imagesV2[i].y == ty){
						game.guessedChar = game.imagesV2[i].id;
						game.guessedCharId = i;
						console.log('Chose image with ID ' + game.guessedChar);
						break;
					}
				}
			});
		}
		
		function renderImage(image, xLoc, yLoc,context){
			context.drawImage(image.pic, xLoc, yLoc);
		}
		
		function loadImageFromArrToArr(imageArr,targetArr){
			game.reqdImages = imageArr.length;
			game.loadedImages=0;
			for(i in imageArr){
				var image = new Image;
				image.src = 'images/' + imageArr[i] + '.png';
				targetArr.push({
					pic: image,
					id: imageArr[i],
					guestId: -1,
					x : -1,
					y : -1,
					w : -1,
					h : -1,
					covered: false
				});
				targetArr[i].pic.onload = function(){
					//game.images[i].w = image.width;
					//game.images[i].h = image.height;
					game.loadedImages++;
				};
			}
		}		
		
		function loadImageToArr(imageName,imageArr){
			var image = new Image;
			image.src = 'images/'+imageName+'.png';
			var i = game.reqdImagesv2;
			console.log('loading image and i is' + imageName + ',' + i);
			game.reqdImagesv2++;
			imageArr.push({
				pic: image,
				id: imageName,
				x: -1,
				y: -1,
				w: -1,
				h: -1
			});

			imageArr[i].pic.onload = function()
			{
				imageArr[i].width = image.width;
				imageArr[i].height = image.height;
				game.loadedImagesv2++; 
				console.log('images loaded in v2' + imageName + ',' + game.loadedImagesv2);
			}
		}
		
		function verifyUploadOfAllImages(){
			console.log(game.loadedImages + ',' + game.reqdImages);
			console.log(game.loadedImagesv2 + ',' + game.reqdImagesv2);
			if(game.loadedImages == game.reqdImages && game.loadedImagesv2 == game.reqdImagesv2){
				console.log('yay, all images uploaded');
				init();
			}
			else{
				setTimeout(function(){
					verifyUploadOfAllImages();
				},50);
			}
		}
		
		imageNamesArr = [
			'block',
			'shade'
		];
		
		$('#hintButton').html(minNum-hintsShown + ' hint(s) available');
		$('#hintButton').click(function(){
			var temp = minNum-hintsShown;
			if(hintsShown<minNum){
				for(i in game.gridArr){
					for(j in game.gridArr[i]){
						if(game.gridArr[i][j].rad == temp-1 && game.gridArr[i][j].phone == temp-1){
							//game.fgContext.clearRect(game.gridArr[i][j].x,game.gridArr[i][j].y,game.gridWidth,game.gridWidth);
							//game.fgContext.drawImage(game.images[1].pic,game.gridArr[i][j].x,game.gridArr[i][j].y);
							game.fgContext.fillText(game.charsArr[temp-1][temp-1],game.gridArr[i][j].x+game.gridWidth/2-15,game.gridArr[i][j].y+game.gridWidth/2+15);
						}
					}
				}
				hintsShown++;
				$('#hintButton').html(temp-1 + ' hint(s) available');
				if(temp-1 == 0){
					$(this).prop('disabled',true);
				}
			}
			else{
				$(this).prop('disabled',true);
			}
		});
		
		loadImageFromArrToArr(imageNamesArr,game.images);
		for(i in game.charsArr){
			for(j in game.charsArr[i]){
				if(typeof game.charsArr[i][j] != 'undefined'){
					loadImageToArr(game.charsArr[i][j],game.imagesV2);
				}
			}
		}
		verifyUploadOfAllImages();
		
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