(function(){
	$(document).ready(function(){
		//alert('hola');
		var game = {};
		
		game.width = 292;
		game.height = 292;
		
		game.images = [];
		game.collideImg = [];
		game.loadedImages = 0;
		game.reqdImages = 0;
		
		game.blockImages = [];
		game.loadedBlockImages = 0;
		game.reqdBlockImages = 0;
		
		game.mobileImageId = 'player';
		game.mobileImagex = 2;
		game.mobileImagey = 2;
		game.mobileImageLastx = game.mobileImagex;
		game.mobileImageLasty = game.mobileImagey;		
		
		game.pathWidth = 45;
		game.wallWidth = 3;
		game.innerBlockWidth = 90;
		game.outerWallLen = (2*game.pathWidth)+game.innerBlockWidth+(4*game.wallWidth);
		game.outerWallY = game.outerWallLen + game.pathWidth - game.wallWidth;
		console.log(game.pathWidth+','+game.outerWallY);
		game.passageWidth = 60;
		
		game.innerWallA = (2*game.pathWidth)+game.wallWidth;
		game.innerWallB = game.innerWallA + game.innerBlockWidth + game.wallWidth;
		
		console.log('yo '+ game.innerWallA);
		console.log(Math.floor(game.innerWallA + Math.random()*(game.innerWallB-game.innerWallA)));
		console.log(Math.floor(game.innerWallA + Math.random()*(game.innerWallB-game.innerWallA)));
		console.log(Math.floor(game.innerWallA + Math.random()*(game.innerWallB-game.innerWallA)));
		console.log(Math.floor(game.innerWallA + Math.random()*(game.innerWallB-game.innerWallA)));
		console.log('yo ' + game.innerWallB);
		game.blockLocsX = [];
		game.blockLocsY = [];
		
		game.keys = [];
		game.speed = 3;
		
		game.bgContext = document.getElementById('bgCanvas').getContext('2d');
		game.charContext = document.getElementById('charCanvas').getContext('2d');
		
		$(document).keydown(function(e){
			game.keys[e.keyCode ? e.keyCode : e.which] = true;
		});
		$(document).keyup(function(e){
			delete game.keys[e.keyCode ? e.keyCode : e.which];
		});
		
		function init(){
			i = game.collideImg.length;
			console.log(i);
			var i1,j1,i2,j2;
			
			renderImage(game.blockImages[0],game.blockImages[0].x,game.blockImages[0].y,game.charContext);
			
			i1 = game.innerWallA;
			j1 = game.innerWallA;
			game.collideImg.push({
				pic: game.images[0].pic,
				x1 : game.innerWallA,
				y1 : game.innerWallA,
				x2 : (i1 + game.images[0].w),
				y2 : (j1 + game.images[0].h)
			});
			console.log('inserted wall with coordinates - ' + game.collideImg[i].x1 + ', ' + game.collideImg[i].y1 + ', ' + game.collideImg[i].x2 + ', ' + game.collideImg[i].y2);
			i++;
			renderImage(game.images[0],game.innerWallA,game.innerWallA,game.bgContext);
			
			i1 = game.innerWallA;
			j1 = game.innerWallA;			
			game.collideImg.push({
				pic: game.images[1].pic,
				x1 : game.innerWallA,
				y1 : game.innerWallA,
				x2 : (i1 + game.images[1].w),
				y2 : (j1 + game.images[1].h)
			});
			console.log('inserted wall with coordinates - ' + game.collideImg[i].x1 + ', ' + game.collideImg[i].y1 + ', ' + game.collideImg[i].x2 + ', ' + game.collideImg[i].y2);
			i++;			
			renderImage(game.images[1],game.innerWallA,game.innerWallA,game.bgContext);
			
			i1 = game.innerWallA;
			j1 = game.innerWallB;			
			game.collideImg.push({
				pic: game.images[0].pic,
				x1 : game.innerWallA,
				y1 : game.innerWallB,
				x2 : (i1 + game.images[0].w),
				y2 : (j1 + game.images[0].h)
			});
			console.log('inserted wall with coordinates - ' + game.collideImg[i].x1 + ', ' + game.collideImg[i].y1 + ', ' + game.collideImg[i].x2 + ', ' + game.collideImg[i].y2);
			i++;
			renderImage(game.images[0],game.innerWallA,game.innerWallB,game.bgContext);
			
			i1 = game.innerWallB;
			j1 = game.innerWallA;			
			game.collideImg.push({
				pic: game.images[1].pic,
				x1 : game.innerWallB,
				y1 : game.innerWallA,
				x2 : (i1 + game.images[1].w),
				y2 : (j1 + game.images[1].h)
			});
			console.log('inserted wall with coordinates - ' + game.collideImg[i].x1 + ', ' + game.collideImg[i].y1 + ', ' + game.collideImg[i].x2 + ', ' + game.collideImg[i].y2);
			i++;
			renderImage(game.images[1],game.innerWallB,game.innerWallA,game.bgContext);
			
			randomY1 = Math.floor(game.pathWidth + Math.random()*(game.outerWallY-game.passageWidth-game.pathWidth));
			console.log('random1 is ' + randomY1);
			randomY2 = Math.floor(game.pathWidth + Math.random()*(game.outerWallY-game.passageWidth-game.pathWidth));
			console.log('random2 is ' + randomY2);
			
			i1 = game.pathWidth;
			j1 = game.pathWidth;			
			game.collideImg.push({
				pic: game.images[2].pic,
				x1 : game.pathWidth,
				y1 : game.pathWidth,
				x2 : (i1 + game.images[2].w),
				y2 : (j1 + game.images[2].h)
			});
			console.log('inserted wall with coordinates - ' + game.collideImg[i].x1 + ', ' + game.collideImg[i].y1 + ', ' + game.collideImg[i].x2 + ', ' + game.collideImg[i].y2);
			i++;
			renderImage(game.images[2],game.pathWidth,game.pathWidth,game.bgContext);	//upper horizontal
			
			i1 = game.pathWidth;
			j1 = game.pathWidth;						
			game.collideImg.push({	//upper half of the wall
				pic: game.images[3].pic,
				x1 : game.pathWidth,
				y1 : game.pathWidth,
				x2 : (i1 + game.images[3].w),
				y2 : randomY1
			});
			console.log('inserted wall with coordinates - ' + game.collideImg[i].x1 + ', ' + game.collideImg[i].y1 + ', ' + game.collideImg[i].x2 + ', ' + game.collideImg[i].y2);
			i++;
			game.collideImg.push({	//lower half of the wall
				pic: game.images[3].pic,
				x1 : game.pathWidth,
				y1 : (randomY1+game.passageWidth),
				x2 : (i1 + game.images[3].w),
				y2 : (j1 + game.images[3].h)
			});
			console.log('inserted wall with coordinates - ' + game.collideImg[i].x1 + ', ' + game.collideImg[i].y1 + ', ' + game.collideImg[i].x2 + ', ' + game.collideImg[i].y2);
			i++;
			renderImage(game.images[3],game.pathWidth,game.pathWidth,game.bgContext);	//left vertical
			renderImage(game.images[4],game.pathWidth,randomY1,game.bgContext);			//left passage
			//renderImage(game.images[5],game.pathWidth,randomY1,game.bgContext);			//test image
			//renderImage(game.images[5],game.pathWidth,(randomY1+game.passageWidth),game.bgContext);	//test image
			
			i1 = game.pathWidth;
			j1 = game.outerWallY;			
			game.collideImg.push({
				pic: game.images[2].pic,
				x1 : game.pathWidth,
				y1 : game.outerWallY,
				x2 : (i1 + game.images[2].w),
				y2 : (j1 + game.images[2].h)
			});
			console.log('inserted wall with coordinates - ' + game.collideImg[i].x1 + ', ' + game.collideImg[i].y1 + ', ' + game.collideImg[i].x2 + ', ' + game.collideImg[i].y2);
			i++;			
			renderImage(game.images[2],game.pathWidth,game.outerWallY,game.bgContext);	//lower horizontal
			
			i1 = game.outerWallY;
			j1 = game.pathWidth;						
			game.collideImg.push({	//upper half of the wall
				pic: game.images[3].pic,
				x1 : game.outerWallY,
				y1 : game.pathWidth,
				x2 : (i1 + game.images[3].w),
				y2 : randomY2
			});
			console.log('inserted wall with coordinates - ' + game.collideImg[i].x1 + ', ' + game.collideImg[i].y1 + ', ' + game.collideImg[i].x2 + ', ' + game.collideImg[i].y2);
			i++;
			game.collideImg.push({	//lower half of the wall
				pic: game.images[3].pic,
				x1 : game.outerWallY,
				y1 : (randomY2+game.passageWidth),
				x2 : (i1 + game.images[3].w),
				y2 : (j1 + game.images[3].h)
			});
			console.log('inserted wall with coordinates - ' + game.collideImg[i].x1 + ', ' + game.collideImg[i].y1 + ', ' + game.collideImg[i].x2 + ', ' + game.collideImg[i].y2);
			i++;			
			renderImage(game.images[3],game.outerWallY,game.pathWidth,game.bgContext);	//right vertical
			renderImage(game.images[4],game.outerWallY,randomY2,game.bgContext);		//right passage
			//renderImage(game.images[5],game.outerWallY,randomY2,game.bgContext);			//test image
			//renderImage(game.images[5],game.outerWallY,(randomY2+game.passageWidth),game.bgContext);	//test image
			
			loop();
		}
		
		function loop(){
			requestAnimFrame(function() {
				loop();
			});
			console.log('boo');
			update();
			//continue the game
		}
		
		function update(){
			var i = getPlayerId(game.mobileImageId);
			
			if (game.keys[37] && game.blockImages[i].x > 0){//left arrow
				game.mobileImageLastx = game.blockImages[i].x;
				game.mobileImageLasty = game.blockImages[i].y;
				game.blockImages[i].x -= game.speed;
				//renderMobileImage(i,game.mobileImageLastx,game.mobileImageLasty,game.blockImages[i].width,game.blockImages[i].height);
				updateCodeThatRepeatsOften(i,'left');
			}
			
			if (game.keys[39] && game.blockImages[i].x < (game.width - game.blockImages[i].width)){//right arrow
				game.mobileImageLastx = game.blockImages[i].x;
				game.mobileImageLasty = game.blockImages[i].y;
				game.blockImages[i].x += game.speed;
				//renderMobileImage(i,game.mobileImageLastx,game.mobileImageLasty,game.blockImages[i].width,game.blockImages[i].height);
				updateCodeThatRepeatsOften(i,'right');
			}
			
			if (game.keys[38] && game.blockImages[i].y > 0){//up arrow
				game.mobileImageLastx = game.blockImages[i].x;
				game.mobileImageLasty = game.blockImages[i].y;
				game.blockImages[i].y -= game.speed;
				//renderMobileImage(i,game.mobileImageLastx,game.mobileImageLasty,game.blockImages[i].width,game.blockImages[i].height);
				updateCodeThatRepeatsOften(i,'up');
			}
			
			if (game.keys[40] && game.blockImages[i].y < (game.height - game.blockImages[i].height)){//down arrow
				game.mobileImageLastx = game.blockImages[i].x;
				game.mobileImageLasty = game.blockImages[i].y;
				game.blockImages[i].y += game.speed;
				//renderMobileImage(i,game.mobileImageLastx,game.mobileImageLasty,game.blockImages[i].width,game.blockImages[i].height);
				updateCodeThatRepeatsOften(i,'down');
			}
		}
		
		function updateCodeThatRepeatsOften(i,direction){
			console.log('checking for collision with walls ' + game.collideImg.length);
			
			for(n in game.blockImages){
				if(i!=n && game.blockImages[n].showOnStart == true){
					if (detectCollision(game.blockImages[i],game.blockImages[n],direction)){
						game.blockImages[i].showOnStart = false;
						game.blockImages[n].showOnStart = false;
						var parentId = getPlayerId(game.blockImages[i].parent);
						game.blockImages[parentId].showOnStart = true;
						game.blockImages[parentId].x = game.blockImages[n].x;
						game.blockImages[parentId].y = game.blockImages[n].y;
						game.mobileImageLastx = game.blockImages[n].x;
						game.mobileImageLasty = game.blockImages[n].y;
						game.mobileImageId = game.blockImages[parentId].id;
						reDrawCanvas();
						break;
					}
				}
			}
			
			if(game.blockImages[i].id != 'player'){
				for(n in game.collideImg)
				{
					detectCollisionWithWalls(game.blockImages[i],game.collideImg[n],direction);
					//reDrawCanvas();
					//renderMobileImage(i,game.mobileImageLastx,game.mobileImageLasty,game.blockImages[i].width,game.blockImages[i].height);
				}
			}
			reDrawCanvas();
			//if(game.blockImages[i].showOnStart)
			//{
				//renderMobileImage(i,game.mobileImageLastx,game.mobileImageLasty,game.blockImages[i].width,game.blockImages[i].height);
			//}
			//reDrawCanvas();
		}
		
		function detectCollisionWithWalls(mobileImage, staticImage, direction){
			sy1 = staticImage.y1;
			sy2 = staticImage.y2;
			sx1 = staticImage.x1;
			sx2 = staticImage.x2;
			console.log(sx1 + ',' + sy1 + ',' + sx2 + ',' + sy2);
			my1 = mobileImage.y;
			my2 = mobileImage.y + mobileImage.height;
			//mymid = mobileImage.y + (mobileImage.height/2);
			mx1 = mobileImage.x;
			mx2 = mobileImage.x + mobileImage.width;
			//mxmid = mobileImage.x + (mobileImage.width/2);
			
			if(direction == 'right'){
				if((my2<=sy2 && my2>=sy1) || (my1<=sy2 && my1>=sy1) || (my1<=sy1 && my2>=sy1)){
					if(mx2<=sx2 && mx2>=sx1){
						console.log('collide');
						mx2=sx1-1;
						mobileImage.x = mx2-mobileImage.width;
						return true;
					}
				}
			}
			if(direction == 'left'){
				if((my2<=sy2 && my2>=sy1) || (my1<=sy2 && my1>=sy1) || (my1<=sy1 && my2>=sy1)){
					if(mx1<=sx2 && mx1>=sx1){
						console.log('collide');
						mx1=sx2+1;
						mobileImage.x = mx1;
						return true;
					}
				}
			}
			if(direction == 'down'){
				if((mx2<=sx2 && mx2>=sx1) || (mx1<=sx2 && mx1>=sx1) || (mx1<=sx1 && mx2>=sx1)){
					if(my2<=sy2 && my2>=sy1){
						console.log('collide');
						my2=sy1-1;
						mobileImage.y = my2-mobileImage.height;
						return true;
					}
				}
			}
			if(direction == 'up'){
				if((mx2<=sx2 && mx2>=sx1) || (mx1<=sx2 && mx1>=sx1) || (mx1<=sx1 && mx2>=sx1)){
					if(my1<=sy2 && my1>=sy1){
						console.log('collide');
						my1=sy2+1;
						mobileImage.y = my1;
						return true;
					}
				}
			}			
			return false;
		}
		
		function detectCollision(mobileImage, staticImage, direction){
			sy1 = staticImage.y;
			sy2 = staticImage.y + staticImage.height;
			sx1 = staticImage.x;
			sx2 = staticImage.x + staticImage.width;
			my1 = mobileImage.y;
			my2 = mobileImage.y + mobileImage.height;
			mymid = mobileImage.y + (mobileImage.height/2);
			mx1 = mobileImage.x;
			mx2 = mobileImage.x + mobileImage.width;
			mxmid = mobileImage.x + (mobileImage.width/2);
			
			if (mobileImage.id == 'player'){
					if(((mx1>=sx1 && mx1<=sx2) || (mx2>=sx1 && mx2<=sx2)) && ((my1>=sy1 && my1<=sy2) || (my2>=sy1 && my2<=sy2))){
					game.blockImages.splice(getPlayerId(game.mobileImageId),1);
					game.mobileImageId = staticImage.id;
				}
			}
			else{
				checkIfGameComplete(mobileImage,staticImage);
				if(direction == 'right'){
					if((my2<=sy2 && my2>=sy1) || (my1<=sy2 && my1>=sy1) || (mymid<=sy2 && mymid>=sy1)){
						if(mx2<=sx2 && mx2>=sx1){
							mx2=sx1-1;
							mobileImage.x = mx2-mobileImage.width;
							if(fitToMerge(direction,mobileImage.direction,mobileImage.parent,staticImage.parent)){
								return true;
							}
							else{
								game.mobileImageId = staticImage.id;
								return false;
							}
						}
					}
				} else
				if(direction == 'left'){
					if((my2<=sy2 && my2>=sy1) || (my1<=sy2 && my1>=sy1) || (mymid<=sy2 && mymid>=sy1)){
						if(mx1<=sx2 && mx1>=sx1){
							mx1=sx2+1;
							mobileImage.x = mx1;
							if(fitToMerge(direction,mobileImage.direction,mobileImage.parent,staticImage.parent)){
								return true;
							}
							else{
								game.mobileImageId = staticImage.id;
								return false;
							}
						}
					}					
				} else
				if(direction == 'down'){
					if((mx2<=sx2 && mx2>=sx1) || (mx1<=sx2 && mx1>=sx1) || (mxmid<=sx2 && mxmid>=sx1)){
						if(my2<=sy2 && my2>=sy1){
							my2=sy1-1;
							mobileImage.y = my2-mobileImage.height;
							if(fitToMerge(direction,mobileImage.direction,mobileImage.parent,staticImage.parent)){
								return true;
							}
							else{
								game.mobileImageId = staticImage.id;
								return false;
							}
						}
					}
				} else
				if(direction == 'up'){
					if((mx2<=sx2 && mx2>=sx1) || (mx1<=sx2 && mx1>=sx1) || (mxmid<=sx2 && mxmid>=sx1)){
						if(my1<=sy2 && my1>=sy1){
							my1=sy2+1;
							mobileImage.y = my1;
							if(fitToMerge(direction,mobileImage.direction,mobileImage.parent,staticImage.parent)){
								return true;
							}
							else{
								game.mobileImageId = staticImage.id;
								return false;
							}
						}
					}					
				}
			}
		}
		
		function checkIfGameComplete(mobileImage,staticImage){
			if(mobileImage.parent == 'none' && staticImage.parent == 'none'){
				//updateInstructions('Congratulations, you finished the game successfully!');
				game.bgContext.font = "bold 30px monaco";
				game.bgContext.fillStyle = "black";
				game.bgContext.fillText('Game Over!', game.width/2-50,game.height/2-50);
				game.speed = 0;
			}
		}
		
		function fitToMerge(movingInDirection,canCombineInDirection,mobileImageParent,staticImageParent){
			if(movingInDirection == canCombineInDirection && mobileImageParent == staticImageParent){
				return true;
			}
			return false
		}
		function renderMobileImage(mobileImageId,oldPosx,oldPosy,imageWidth,imageHeight){
			game.charContext.clearRect(oldPosx,oldPosy,imageWidth,imageHeight);
			game.charContext.drawImage(game.blockImages[mobileImageId].pic,game.blockImages[mobileImageId].x,game.blockImages[mobileImageId].y);
		}
		
		function reDrawCanvas(){
			game.charContext.clearRect(0,0,game.width,game.height);
			console.log(game.blockImages.length);
			for (i in game.blockImages){
				if (game.blockImages[i].showOnStart){
					game.charContext.drawImage(game.blockImages[i].pic,game.blockImages[i].x,game.blockImages[i].y);
				}
			}
		}
		
		function getPlayerId(idName){
			for(i in game.blockImages){
				if(game.blockImages[i].id == idName){ return i; }
			}
		}
		
		function renderImage(image, xLoc, yLoc,context){
			//console.log('rendering at ' + xLoc + ' ' + yLoc);
			context.drawImage(image.pic, xLoc, yLoc);
		}
		
		function loadImageFromArr(imageArr){
			game.reqdImages = imageArr.length;
			for(i in imageArr){
				var image = new Image;
				image.src = 'images/' + imageArr[i] + '.png';
				game.images.push({
					pic: image,
					x : -1,
					y : -1,
					w : -1,
					h : -1
				});
				game.images[i].pic.onload = function(){
					game.images[i].w = image.width;
					game.images[i].h = image.height;
					game.loadedImages++;
				};
			}
		}
		
		function verifyUploadOfAllImages(){
			console.log('comparing ' + game.loadedImages + ' with ' + game.reqdImages);
			if(game.loadedImages >= game.reqdImages){
				console.log('yaay, loaded all images');
				resetImageParams();
				loadImage('player',true,'none','none',game.width/2-20,game.height/2-20);
				createImageNames(1,'l2r1',true);
				createImageNames(2,'l2r1',false);
				checkBlockImagesUpload();
			}
			else{
				setTimeout(function(){
					console.log('waiting for images to be loaded ' + console.log(game.loadedImages)+ ',' + game.reqdImages);
					verifyUploadOfAllImages();
				},1);
			}
		}
		
		function resetImageParams(){
			for(i in game.images){
				game.images[i].w = game.images[i].pic.width;
				game.images[i].h = game.images[i].pic.height;
				//console.log('updated an image with parameters' + i + ',' + game.images[i].w + ',' + game.images[i].h);
			}
		
		}
		
		function shuffleArraysInSync(array1,array2) {
			if(array1.length == array2.length){
				for (var i = array1.length - 1; i > 0; i--) {
					var j = Math.floor(Math.random() * (i + 1));
					var temp1 = array1[i];
					array1[i] = array1[j];
					array1[j] = temp1;
					var temp2 = array2[i];
					array2[i] = array2[j];
					array2[j] = temp2;
				}
				return true;
			}
			else{
				return false;
			}
		}
		
		function createImageNames(charSNo,charType,isFirst){
			if(isFirst){
				game.blockLocsX.length=0;
				game.blockLocsY.length=0;
				posA1 = Math.floor(game.innerWallA + Math.random()*(game.innerWallB-game.innerWallA-40));
				game.blockLocsX.push(posA1);
				posA2 = game.innerWallA-game.pathWidth+2;
				game.blockLocsY.push(posA2);
				posB1 = Math.floor(game.pathWidth + Math.random()*(game.outerWallY-game.pathWidth-40)); 
				game.blockLocsX.push(posB1);
				posB2 = game.pathWidth-game.pathWidth+2;
				game.blockLocsY.push(posB2);
				posC1 = game.innerWallB+5;
				game.blockLocsX.push(posC1);
				posC2 = Math.floor(game.innerWallA + Math.random()*(game.innerWallB-game.innerWallA-40));
				game.blockLocsY.push(posC2);
				posD1 = game.outerWallY+5;
				game.blockLocsX.push(posD1);
				posD2 = Math.floor(game.pathWidth + Math.random()*(game.outerWallY-game.pathWidth-40));
				game.blockLocsY.push(posD2);
				shuffleArraysInSync(game.blockLocsX,game.blockLocsY);
			}
			else{
				game.blockLocsX.length=0;
				game.blockLocsY.length=0;
				posA1 = Math.floor(game.innerWallA + Math.random()*(game.innerWallB-game.innerWallA-40)); 
				game.blockLocsX.push(posA1);
				posA2 = game.innerWallB+5;
				game.blockLocsY.push(posA2);
				posB1 = Math.floor(game.pathWidth + Math.random()*(game.outerWallY-game.pathWidth-40));
				game.blockLocsX.push(posB1);
				posB2 = game.outerWallY+5;
				game.blockLocsY.push(posB2);
				posC1 = game.innerWallA-game.pathWidth+2;
				game.blockLocsX.push(posC1);
				posC2 = Math.floor(game.innerWallA + Math.random()*(game.innerWallB-game.innerWallA-40));
				game.blockLocsY.push(posC2);
				posD1 = game.pathWidth-game.pathWidth+2;
				game.blockLocsX.push(posD1);
				posD2 = Math.floor(game.pathWidth + Math.random()*(game.outerWallY-game.pathWidth-40));
				game.blockLocsY.push(posD2);
				shuffleArraysInSync(game.blockLocsX,game.blockLocsY);
			}
			if(charType.indexOf('l2') >= 0){
				loadImage(charSNo+'lt',true,charSNo+'l','down',game.blockLocsX[0],game.blockLocsY[0]);
				loadImage(charSNo+'lb',true,charSNo+'l','up',game.blockLocsX[1],game.blockLocsY[1]);		
				loadImage(charSNo+'l',false,charSNo+charType,'right',0,0);
			} else
			if(charType.indexOf('l1') >= 0){
				loadImage(charSNo+'l',true,charSNo+charType,'right',game.blockLocsX[1],game.blockLocsY[1]);
			}
			if(charType.indexOf('r2') >= 0){
				loadImage(charSNo+'rt',true,charSNo+'r','down',game.blockLocsX[2],game.blockLocsY[2]);
				loadImage(charSNo+'rb',true,charSNo+'r','up',game.blockLocsX[3],game.blockLocsY[3]);
				loadImage(charSNo+'r',false,charSNo+charType,'left',0,0);
			}
			if(charType.indexOf('r1') >= 0){
				loadImage(charSNo+'r',true,charSNo+charType,'left',game.blockLocsX[2],game.blockLocsY[2]);
			}
			if(charType.indexOf('t2') >= 0){
				loadImage(charSNo+'tl',true,charSNo+'t','right',game.blockLocsX[0],game.blockLocsY[0]);
				loadImage(charSNo+'tr',true,charSNo+'t','left',game.blockLocsX[1],game.blockLocsY[1]);
				loadImage(charSNo+'t',false,charSNo+charType,'down',0,0);
			} else
			if(charType.indexOf('t1') >= 0){
				loadImage(charSNo+'t',true,charSNo+charType,'down',game.blockLocsX[0],game.blockLocsY[0]);
			}
			if(charType.indexOf('b2') >= 0){
				loadImage(charSNo+'bl',true,charSNo+'b','right',game.blockLocsX[2],game.blockLocsY[2]);
				loadImage(charSNo+'br',true,charSNo+'b','left',game.blockLocsX[3],game.blockLocsY[3]);
				loadImage(charSNo+'b',false,charSNo+charType,'up',0,0);
			}
			if(charType.indexOf('b1') >= 0){
				loadImage(charSNo+'b',true,charSNo+charType,'up',game.blockLocsX[3],game.blockLocsY[3]);
			}
			loadImage(charSNo+charType,false,'none','none',0,0);
		}
		
		function loadImage(imageName,displayOnStart,parentName,combineWhenDirectionIs,xLoc,yLoc){
			console.log(imageName + ' is gonna load at ' + xLoc + ',' + yLoc);
			var image = new Image;
			image.src = 'images/'+imageName+'.png';
			var i = game.reqdBlockImages;
			//var xLoc = (Math.floor(game.gridArray[i]/10))*game.gridWidth;
			//var yLoc = (game.gridArray[i]%10)*game.gridHeight;
			//var xLoc = game.mobileImagex;
			//var yLoc = game.mobileImagey;
			game.reqdBlockImages++;
			game.blockImages.push({
				pic: image,
				id: imageName,
				x: xLoc,
				y: yLoc,
				width: 0,
				height: 0,
				showOnStart: displayOnStart,
				parent: parentName,
				direction: combineWhenDirectionIs
			});
			
			game.blockImages[i].pic.onload = function()
			{
				game.blockImages[i].width = image.width;
				game.blockImages[i].height = image.height;
				game.loadedBlockImages++; 
			}
		}
		
		function checkBlockImagesUpload(){
			if(game.reqdBlockImages <= game.loadedBlockImages){
				init();
			}
			else{
				setTimeout(function()
					{ checkBlockImagesUpload(); },1);
			}
		}
		
		imageNamesArr = [
		'innerwallH',		//0
		'innerwallV',		//1
		'outerwallH',		//2
		'outerwallV',		//3
		'passageV',			//4
		'tester'			//5
		];
		loadImageFromArr(imageNamesArr);
		verifyUploadOfAllImages();
		
	});

})();

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();