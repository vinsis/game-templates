(function(){
	$(document).ready(function(){
		//alert('hola');
		var game = {};

		function setTarget(){
			shuffleArray(game.numArr);
			game.numTarget = Math.floor((((game.numArr[0]+game.numArr[1])*game.numArr[2])-game.numArr[4])/game.numArr[3]);
			console.log(game.numArr[0]+','+game.numArr[1]+','+game.numArr[2]+','+game.numArr[4]+','+game.numArr[3]+','+'target is ' + game.numTarget);
			var isBadTarget = false;
			for(i=0;i<8;i++){
				if(game.numArr[i] == game.numTarget){
					isBadTarget = true;
				}
			}
			if(game.numTarget == 0 || isBadTarget){
				setTarget();
			}
			$('#target').text('Target: ' + game.numTarget);
		}

		function resetImageParams(imageArr){
			for(i in imageArr){
				imageArr[i].w = imageArr[i].pic.width;
				imageArr[i].h = imageArr[i].pic.height;
				console.log('updated an image with parameters' + i + ',' + imageArr[i].w + ',' + imageArr[i].h);
			}
		}

		function drawCoords(drawVer,drawHor){
			game.bgContext.clearRect(0,0,game.width,game.width);
			game.bgContext.beginPath();
			//game.bgContext.rect(game.orgX-2,game.orgY-2,4,4);
			//game.bgContext.stroke();
			game.bgContext.fill();
			if(drawVer){
				game.bgContext.moveTo(game.orgX,0);
				game.bgContext.lineTo(game.orgX,game.width);
			}
			if(drawHor){
				game.bgContext.moveTo(0,game.orgY);
				game.bgContext.lineTo(game.width,game.orgY);
			}
			game.bgContext.stroke();
		}

		function updateOperator(){
			if(game.showHor && game.showVer){
				return;
			}
			if(game.showHor){
				if(game.orgY>game.player.y){
					game.numOperator = "-";
				}
				else if(game.orgY<game.player.y){
					game.numOperator = "+";
				}
			}
			else if(game.showVer){
				if(game.orgX>game.player.x){
					game.numOperator = "*";
				}
				else if(game.orgX<game.player.x){
					game.numOperator = "/";
				}
			}
			$('#operator').text('Symbol: ' + game.numOperator);
		}

		function updateNumsOnDisplay(){
			for(i in game.numArr){
				game.numsOnDisplay.push({
					val: game.numArr[i],
					x: -1,
					y: -1,
					used: false
				});
			}
		}

		function displayNumsOnDisplay(){
			game.fgContext.clearRect(0,0,game.width,game.height);
			for(i in game.numsOnDisplay){
				if(game.numsOnDisplay[i].used == false){
					game.fgContext.fillText(game.numsOnDisplay[i].val,game.numsOnDisplay[i].x,game.numsOnDisplay[i].y);
				}
			}
		}

		function changeOrigin(){
			var boundary = game.boundary;
			if(game.orgX<boundary || game.orgX>game.width-boundary){
				game.velX *= -1;
			}
			game.orgX += game.velX;
			if(game.orgY<boundary || game.orgY>game.width-boundary){
				game.velY *= -1;
			}
			game.orgY += game.velY;
			updateOperator();
		}

		function getPlayerRad(){
			var pRad = -1;
			var minRad = 20;
			if(game.showHor && game.showVer){
				return;
			}
			if(game.showHor){
				pRad = game.expansionCoeff*(game.player.y - game.orgY);
				if(pRad < 0){
					pRad *= -1;
				}
			}
			else if(game.showVer){
				pRad = game.expansionCoeff*(game.player.x - game.orgX);
				if(pRad < 0){
					pRad *= -1;
				}
			}
			pRad += minRad;
			return pRad;
		}

		function createPlayerCircle(){
			game.imContext.clearRect(0,0,game.width,game.height);
			game.imContext.beginPath();
			game.imContext.arc(game.player.x,game.player.y,game.player.r,0,2*Math.PI);
			game.imContext.fillText(game.numCurr,game.player.x-5,game.player.y+5);
			game.imContext.stroke();
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

		function updateNumCurrent(){
			for(i in game.numsOnDisplay){
				if(game.numsOnDisplay[i].used == false){
					var dist = Math.sqrt(Math.pow(game.numsOnDisplay[i].x - game.player.x, 2) + Math.pow(game.numsOnDisplay[i].y - game.player.y, 2));
					if(dist < game.player.r){
						game.numsOnDisplay[i].used = true;
						game.numsUsed++;
						game.numCurr = carryOperation(game.numCurr,game.numsOnDisplay[i].val);
						console.log('numCurr updated to ' +','+game.numCurr);
					}
				}
			}
		}

		function carryOperation(valA,valB){
			if(game.numOperator == '-'){
				return (valA-valB);
			}
			else if(game.numOperator == '+'){
				return (valA+valB);
			}
			else if(game.numOperator == '/'){
				return Math.floor(valA/valB);
			}
			else if(game.numOperator == '*'){
				return (valA*valB);
			}
		}

		function init(){
			resetImageParams(game.images);
			resetImageParams(game.imagesV2);
			var cvOffset = $('#fgCanvas').offset();
			$('#imCanvas').click(function(e){
				console.log('cliekc here');
				relX = e.pageX - cvOffset.left;
				relY = e.pageY - cvOffset.top;
				console.log('clicked at ' + relX + ',' + relY);
				if(relX <= game.orgX){
					if(relY <= game.orgY){
						game.quadClicked = 4;
					}
					else{
						game.quadClicked = 3;
					}
				}
				else{
					if(relY <= game.orgY){
						game.quadClicked = 1;
					}
					else{
						game.quadClicked = 2;
					}
				}
				console.log('clicked in quad ' + game.quadClicked);
			});
			setTarget();
			updateNumsOnDisplay();
			var randLoc = Math.random()*game.width;
			game.player.x = game.orgX;
			game.player.y = game.orgY;
			game.player.r = getPlayerRad();
			//console.log('player rad is ' +','+game.player.r);
			createPlayerCircle();
			$('#vertHorTog').unbind('click').click(function(){
				game.showHor = !game.showHor;
				game.showVer = !game.showVer;
			});
			drawCoords(game.showVer,game.showHor);

			//update numsOnDisplay locations
			for(i=0;i<8;i++){
				game.numSeq[i] = i;
			}
			shuffleArray(game.numSeq);
			game.numsOnDisplay[game.numSeq[0]].x = 80;
			game.numsOnDisplay[game.numSeq[0]].y = game.width/3;
			game.numsOnDisplay[game.numSeq[1]].x = 80;
			game.numsOnDisplay[game.numSeq[1]].y = 2*game.width/3;

			game.numsOnDisplay[game.numSeq[2]].x = game.height-80;
			game.numsOnDisplay[game.numSeq[2]].y = game.width/3;
			game.numsOnDisplay[game.numSeq[3]].x = game.height-80;
			game.numsOnDisplay[game.numSeq[3]].y = 2*game.width/3;

			game.numsOnDisplay[game.numSeq[4]].x = game.width/3;
			game.numsOnDisplay[game.numSeq[4]].y = 60;
			game.numsOnDisplay[game.numSeq[5]].x = 2*game.width/3;
			game.numsOnDisplay[game.numSeq[5]].y = 60;

			game.numsOnDisplay[game.numSeq[6]].x = game.width/3;
			game.numsOnDisplay[game.numSeq[6]].y = game.height-60;
			game.numsOnDisplay[game.numSeq[7]].x = 2*game.width/3;
			game.numsOnDisplay[game.numSeq[7]].y = game.height-60;
			//update ends
			displayNumsOnDisplay();
			game.playerTime = 3000;
			loop();
		}

		function loop(){
			game.handle = requestAnimFrame(function() {
				loop();
			});
			changeOrigin();
			if (game.keys[37] && game.player.x > 0){//left
				game.player.x -= game.speed;
			}
			if (game.keys[39] && game.player.x < game.width){//right
				game.player.x += game.speed;
			}
			if (game.keys[38] && game.player.y > 0){//up
				game.player.y -= game.speed;
			}
			if (game.keys[40] && game.player.y < game.height){//down
				game.player.y += game.speed;
			}
			game.player.r = getPlayerRad();
			//createPlayerCircle();
			drawCoords(game.showVer,game.showHor);
			updateNumCurrent();
			displayNumsOnDisplay();
			createPlayerCircle();
			checkIfGameOver();
			$('#timer span').text(--game.playerTime);
		}

		function checkIfGameOver(){
			if(game.numCurr == game.numTarget || game.numsUsed == 8 || game.playerTime < 0){
				game.fgContext.clearRect(0,0,game.width,game.height);
				console.log(game.numCurr);
				if(game.numCurr == game.numTarget){
					game.fgContext.fillText('Well Done!!',game.width/2-10,game.height/2);
					$('#scoreboard span').text($('#scoreboard span').text() + game.playerTime + '  ');
					$('#totalscore span').text(parseInt($('#totalscore span').text()) + game.playerTime);
				}
				else if (game.numsUsed == 8){
					game.fgContext.fillText('No numbers left. Better luck next time!!',20,game.height/2);
					$('#scoreboard span').text($('#scoreboard span').text() + '0' + '  ');
					//$('#totalscore span').text(parseInt($('#totalscore span').text()) + game.playerTime);
				}
				else {
					game.fgContext.fillText('Time over!',game.width/2-10,game.height/2);
					$('#scoreboard span').text($('#scoreboard span').text() + '0' + '  ');
					//$('#totalscore span').text(parseInt($('#totalscore span').text()) + game.playerTime);
				}

				cancelRequestAnimFrame(game.handle);
			}
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

		function loadImageToArr(imageName,imageArr,loadedImages,reqdImages){
			var image = new Image;
			image.src = 'images/'+imageName+'.png';
			var i = reqdImages;
			console.log('loading image and i is' + imageName + ',' + i);
			reqdImages++;
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
				loadedImages++;
				console.log('images loaded ' + imageName + ',' + loadedImages);
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

		function letsGetRolling(){
			game.width = 400;
			game.height = game.width;
			game.orgX = game.width/2;
			game.orgY = game.orgX;
			game.velX = 2;
			game.velY = 3;
			game.quadClicked = -1;
			game.showVer = false;
			game.showHor = true;
			game.expansionCoeff = 0.4;
			game.boundary = 20;

			game.images = [];
			game.imagesV2 = [];
			game.loadedImages = 0;
			game.reqdImages = 0;
			game.reqdImagesv2 = 0;
			game.loadedImagesv2 = 0;

			//numbers settings
			game.numUpperLim = 10;
			game.numArr = [];
			game.numSeq = [];
			for(i=1;i<=game.numUpperLim;i++){
				game.numArr.push(i);
			}
			game.numTarget = -1;
			game.numCurr = 0;
			game.numsOnDisplay = [];
			game.numsUsed = 0;

			game.bgContext = document.getElementById('bgCanvas').getContext('2d');
			game.fgContext = document.getElementById('fgCanvas').getContext('2d');
			game.imContext = document.getElementById('imCanvas').getContext('2d');
			game.fgContext.font = "bold 20px monaco";
			game.fgContext.fillStyle = "black";
			game.bgContext.font = "bold 20px monaco";
			game.bgContext.fillStyle = "black";
			game.imContext.font = "bold 20px monaco";
			game.imContext.fillStyle = "black";
			/*if the game involves moving player*/
			game.keys = [];
			game.speed = 5;

			game.player = {};
			game.player.x = -1;
			game.player.y = -1;
			game.player.lx = -1;
			game.player.ly = -1;
			game.player.r = 0;

			$(document).keydown(function(e){
				game.keys[e.keyCode ? e.keyCode : e.which] = true;
			});
			$(document).keyup(function(e){
				delete game.keys[e.keyCode ? e.keyCode : e.which];
			});
			//moving player setup ends here
			imageNamesArr = [

			];
			loadImageFromArrToArr(imageNamesArr,game.images);
			verifyUploadOfAllImages();
		}

		$('#newGame').click(function(){
			cancelRequestAnimFrame(game.handle);
			letsGetRolling();
		});
		letsGetRolling();
	});

})();

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            return window.setTimeout(callback, 1000 / 60);
          };
})();

window.cancelRequestAnimFrame = ( function() {
    return window.cancelAnimationFrame          ||
        window.webkitCancelRequestAnimationFrame    ||
        window.mozCancelRequestAnimationFrame       ||
        window.oCancelRequestAnimationFrame     ||
        window.msCancelRequestAnimationFrame        ||
        clearTimeout
} )();
