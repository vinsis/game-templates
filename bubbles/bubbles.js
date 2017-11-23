(function(){
	$(document).ready(function(){
		//alert('hola');
		var game = {};


		function resetImageParams(imageArr){
			for(i in imageArr){
				imageArr[i].w = imageArr[i].pic.width;
				imageArr[i].h = imageArr[i].pic.height;
				console.log('updated an image with parameters' + i + ',' + imageArr[i].w + ',' + imageArr[i].h);
			}
		}

		function randBw(a,b){
			if(a>b){
				var t = a;
				a = b;
				b = t;
			}
			var temp = Math.random()*(b-a)+a;
			//console.log(temp);
			return temp;
		}

		function drawTargetLocation(){
			game.tarR = 30;
			var rand = Math.floor(Math.random()*4);
			console.log('rand is '+rand);
			if(rand == 0){//top left
				game.tarX = game.tarR;
				game.tarY = game.tarR;
			}
			else if(rand == 1){//top right
				game.tarX = game.width-game.tarR;
				game.tarY = game.tarR;
			}
			else if(rand == 2){//bottom left
				game.tarX = game.tarR;
				game.tarY = game.height-game.tarR;
			}
			else if(rand == 3){//bottom right
				game.tarX = game.width-game.tarR;
				game.tarY = game.height-game.tarR;
			}
			game.context3.clearRect(0,0,game.width,game.height);
			game.context3.fillStyle = '#175157';
			game.context3.beginPath();
			game.context3.arc(game.tarX,game.tarY,game.tarR,0,2*Math.PI);
			game.context3.fill();
			game.context3.stroke();
		}

		function init(){
			resetImageParams(game.images);
			resetImageParams(game.imagesV2);
			for(i=0;i<game.maxBubbles;i++){
				drawCircle(game.context1);
			}
			game.livePic.pic = game.images[0].pic;
			game.livePic.w = game.images[0].w;
			game.livePic.h = game.images[0].h;
			//var xLoc = randBw(0,game.width);
			//var yLoc = randBw(0,game.width);
			var xLoc = game.bubbles[0].x;
			var yLoc = game.bubbles[0].y;
			game.livePic.x = xLoc;
			game.livePic.y = yLoc;
			game.context2.clearRect(0,0,game.width,game.height);
			game.context2.drawImage(game.livePic.pic,xLoc,yLoc);
			$('#timer span').text(game.playerTime);
			drawTargetLocation();
			loop();
		}

		function closestDist(x,y){
			return Math.min(x,game.width-x,y,game.height-y);
		}

		function drawCircle(context){
			/*if(game.bubbleNo > game.maxBubbles-1){
				return;
			}*/
			context.beginPath();
			var xLoc = randBw(game.radDomain,game.width-game.radDomain);
			var yLoc = randBw(game.radDomain,game.height-game.radDomain);
			context.arc(xLoc,yLoc,game.beginRadius,0,2*Math.PI);
			context.stroke();
			game.bubbles.push({
				x: xLoc,
				y: yLoc,
				r: game.beginRadius,
				max: closestDist(xLoc,yLoc),
				rate: game.width/(2*closestDist(xLoc,yLoc))
			});
			game.bubbleNo++;
		}

		function expandBubbles(context){
			context.clearRect(0,0,game.width,game.height);
			context.lineWidth = 1;
			for(i in game.bubbles){
				if(game.bubbles[i].r >= game.bubbles[i].max){
					game.bubbles[i].x = randBw(game.radDomain,game.width-game.radDomain);
					game.bubbles[i].y = randBw(game.radDomain,game.width-game.radDomain);
					game.bubbles[i].r = game.beginRadius;
					game.bubbles[i].max = closestDist(game.bubbles[i].x,game.bubbles[i].y);
				}
				else{
					game.bubbles[i].r += game.bubbles[i].rate;
				}
					context.beginPath();
					context.arc(game.bubbles[i].x,game.bubbles[i].y,game.bubbles[i].r,0,2*Math.PI);
					context.stroke();

			}
		}

		function checkIfOutside(){
			for (i in game.bubbles){
				var dis = Math.sqrt(Math.pow(game.bubbles[i].x - game.livePic.x, 2) + Math.pow(game.bubbles[i].y - game.livePic.y, 2));
				//console.log('distance is ' + dis);
				if(dis < game.bubbles[i].r){
					game.livePic.pic = game.images[0].pic;
					game.context2.drawImage(game.livePic.pic,game.livePic.x,game.livePic.y);
					return true;
				}
			}
			game.livePic.pic = game.images[1].pic;
			game.context2.drawImage(game.livePic.pic,game.livePic.x,game.livePic.y);
			//game.playerTime--;
			$('#timer span').text(--game.playerTime);
			if(game.playerTime < 0){
				finishGame('Game over! No more time left.');
			}
			return false;
		}

		function loop(){
			game.handle = requestAnimFrame(function() {
				loop();
			});
			//setTimeout(drawCircle(game.context1),1000);
			expandBubbles(game.context1);
			checkIfOutside();
			//console.log(game.livePic.x);
			//console.log(game.livePic.y);
			if (game.keys[37] && game.livePic.x > 0){//left
				console.log('left');
				game.context2.clearRect(game.livePic.x-1,game.livePic.y-1,game.livePic.w+2,game.livePic.h+2);
				game.livePic.x -= game.speed;
				game.context2.drawImage(game.livePic.pic,game.livePic.x,game.livePic.y);
			}
			if (game.keys[39] && game.livePic.x < game.width-game.livePic.w){//right
				game.context2.clearRect(game.livePic.x-1,game.livePic.y-1,game.livePic.w+2,game.livePic.h+2);
				game.livePic.x += game.speed;
				game.context2.drawImage(game.livePic.pic,game.livePic.x,game.livePic.y);
			}
			if (game.keys[38] && game.livePic.y > 0){//up
				game.context2.clearRect(game.livePic.x-1,game.livePic.y-1,game.livePic.w+2,game.livePic.h+2);
				game.livePic.y -= game.speed;
				game.context2.drawImage(game.livePic.pic,game.livePic.x,game.livePic.y);
			}
			if (game.keys[40] && game.livePic.y < game.width-game.livePic.h){//down
				game.context2.clearRect(game.livePic.x-1,game.livePic.y-1,game.livePic.w+2,game.livePic.h+2);
				game.livePic.y += game.speed;
				game.context2.drawImage(game.livePic.pic,game.livePic.x,game.livePic.y);
			}
			var tempdist = Math.sqrt(Math.pow(game.tarX - game.livePic.x, 2) + Math.pow(game.tarY - game.livePic.y, 2));
			if(tempdist < game.tarR-5){
				finishGame('Player reached the target. Well done!');
			}
			//checkIfOutside();
			//console.log('boo');
			//continue the game
		}

		function finishGame(text){
			game.context1.fillText(text,20,game.height/2);
			game.speed = 0;
			console.log('game over');
			// scores.append(game.playerTime);
			$('#scoreboard span').text($('#scoreboard span').text() + game.playerTime + '  ');
			$('#totalscore span').text(parseInt($('#totalscore span').text()) + game.playerTime);
			cancelRequestAnimFrame(game.handle);
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
			game.images = [];
			game.imagesV2 = [];
			game.loadedImages = 0;
			game.reqdImages = 0;
			game.reqdImagesv2 = 0;
			game.loadedImagesv2 = 0;

			game.width = 450;
			game.height = game.width;
			game.bubbleNo = 0;
			game.beginRadius = 20;
			game.bubbles = [];
			game.radDomain = 120;
			game.maxBubbles = 3;
			game.livePic = {};
			game.playerTime = 30;

			game.context1 = document.getElementById('Canvas1').getContext('2d');
			game.context2 = document.getElementById('Canvas2').getContext('2d');
			game.context3 = document.getElementById('Canvas3').getContext('2d');
			game.context4 = document.getElementById('Canvas3').getContext('2d');
			game.context5 = document.getElementById('Canvas3').getContext('2d');
			game.context1.font = "bold 20px monaco";

			/*if the game involves moving player*/
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
			//moving player setup ends here

			imageNamesArr = [
				'origin','outside'
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
