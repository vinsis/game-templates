(function(){
	$(document).ready(function(){
		//alert('hola');
		var game = {};
		
		game.bgImages = [];
		game.parentImages = [];
		game.mobileImages = [];
		game.loadedImages = 0;
		game.reqdImages = 0;
		game.loadedMobileImages = 0;
		game.reqdMobileImages = 0;
		game.loadedParentImages = 0;
		game.reqdParentImages = 0;
		game.player = [];
		game.loadedPlayerImage = 0;
		game.reqdPlayerImage = 0;
		game.playerPic = -1;
		
		game.bgContext = document.getElementById('bgCanvas').getContext('2d');
		game.charContext = document.getElementById('charCanvas').getContext('2d');
		game.playerContext = document.getElementById('playerCanvas').getContext('2d');
		game.width = 840;
		game.height = 660;
		
		game.keys = [];
		game.speed = 5;
		
		game.mobileImageLastx = -1;
		game.mobileImageLasty = -1;
		game.mobileImageId = 'player';
		
		game.seq = [0,1,2,3,4,5];	//hardcoded
		game.guestBlocks = [];
		game.mobileImagesLocs = [];
		for(i=0;i<game.seq.length;i++){
			game.guestBlocks[i]=[];
			game.mobileImagesLocs[i] = [];
		}
		
		game.dict = {
			p0: "lv3",
			p1: "you2",
			p2: "qi2",
			p3: "zu2",
			p4: "xuan23",
			p5: "shi1",
		};
	/*		
		nBlocks = 7;
		game.regionArr = [];
		for(i=0; i<nBlocks; i++){
			game.regionArr[i] = i;
		}
		game.graphArr = [];
		for(i=0;i<nBlocks;i++){
			game.graphArr[i] = [];
		}		
	
		

		
		for(i=0;i<nBlocks;i++){
			if(i%2==0){
				for(j=0;j<nBlocks;j++){
					game.gridArr[i][j] = j+(nBlocks*i);
					console.log('inserted at ' + i + ',' + j + ' value ' + game.gridArr[i][j]);
				}
			}
			else{
				for(j=nBlocks-1;j>=0;j--){
					game.gridArr[i][j] = (nBlocks-1-j)+(nBlocks*i);
					console.log('inserted at ' + i + ',' + j + ' value ' + game.gridArr[i][j]);
				}
			}
		}
		game.go = false;
	*/	
		$(document).keydown(function(e){
			game.keys[e.keyCode ? e.keyCode : e.which] = true;
			//showNextInstruction();
		});
		$(document).keyup(function(e){
			delete game.keys[e.keyCode ? e.keyCode : e.which];
		});
		
		function resetImageParams(imageArr){
			for(i in imageArr){
				imageArr[i].w = imageArr[i].pic.width;
				imageArr[i].h = imageArr[i].pic.height;
				console.log('updated an image with parameters' + i + ',' + imageArr[i].w + ',' + imageArr[i].h);
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
			//console.log('loading image ' + imageName);
			var image = new Image;
			image.src = 'images/'+imageName+'.png';
			var i = reqdImages;
			//var xLoc = (Math.floor(game.gridArray[i]/10))*game.gridWidth;
			//var yLoc = (game.gridArray[i]%10)*game.gridHeight;
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
		
		function init(){
			resetImageParams(game.bgImages);
			resetImageParams(game.parentImages);
			resetImageParams(game.mobileImages);
			resetImageParams(game.player);
	
			//create the background canvas 
			renderImage(game.bgImages[0],240,240,game.bgContext);	//leftSquare
			renderImage(game.bgImages[1],420,240,game.bgContext);	//rightSqaure
			renderImage(game.bgImages[2],240,120,game.bgContext);	//topRect
			renderImage(game.bgImages[3],240,420,game.bgContext);	//bottomRect
			renderImage(game.bgImages[4],120,120,game.bgContext);		//leftRect
			renderImage(game.bgImages[5],600,120,game.bgContext);	//rightRect
			renderImage(game.bgImages[6],120,0,game.bgContext);		//topOut
			renderImage(game.bgImages[7],120,540,game.bgContext);		//bottomOut
			renderImage(game.bgImages[8],0,0,game.bgContext);		//leftOut
			renderImage(game.bgImages[9],720,0,game.bgContext);	//rightOut
			
			createSequence();
			createLayoutStyle();
			drawGuestsInBlock('leftRect','left');
			drawGuestsInBlock('rightRect','right');
			drawGuestsInBlock('topRect','top');
			drawGuestsInBlock('bottomRect','bottom');
			drawGuestsInBlock('leftSquare','nota');
			drawGuestsInBlock('rightSquare','nota');
			drawBlocksInOuterRing();
			renderImage(game.player[0],game.bgImages[getIndexOfId('rightOut')].x + 5, 100, game.playerContext);
			game.playerPic = game.player[0].pic;
			for(i in game.mobileImagesLocs){
				console.log('number of items in game.mobileImagesLocs array is ' + game.mobileImagesLocs[i].length);
			}
			console.log('player pic w is ' + game.playerPic.width);
			loop();
		}
		
		function loop(){
			requestAnimFrame(function() {
				loop();
			});
			//console.log('boo');
			//continue the game
			update();
			checkIfGameComplete();
		}
		
		function update(){
			var movingImage;
			if(game.mobileImageId == 'player'){
				movingImage = game.player[0];
			}
			else if(game.mobileImageId * 1 < game.seq.length){
				movingImage = game.mobileImages[game.mobileImageId];
			}
			game.mobileImageLastx = movingImage.x;
			game.mobileImageLasty = movingImage.y;
			if (game.keys[37] && movingImage.x > 0){//left arrow
				movingImage.x -= game.speed;
				checkForCollision(movingImage,'left');
				reDrawMovingImage(movingImage,game.mobileImageLastx,game.mobileImageLasty);
			}

			if (game.keys[39] && movingImage.x < (game.width - movingImage.width)){//right arrow
				movingImage.x += game.speed;
				checkForCollision(movingImage,'right');
				reDrawMovingImage(movingImage,game.mobileImageLastx,game.mobileImageLasty);
			}

			if (game.keys[38] && movingImage.y > 0){//up arrow
				movingImage.y -= game.speed;
				checkForCollision(movingImage,'up');
				reDrawMovingImage(movingImage,game.mobileImageLastx,game.mobileImageLasty);
			}

			if (game.keys[40] && movingImage.y < (game.height - movingImage.height)){//down arrow
				movingImage.y += game.speed;
				checkForCollision(movingImage,'down');
				reDrawMovingImage(movingImage,game.mobileImageLastx,game.mobileImageLasty);
			}
		}
		
		function reDrawMovingImage(movingImage,lastXPos,lastYPos){
			//wipeImage(movingImage,game.mobileImageLastx,game.mobileImageLasty,game.playerContext);
			game.playerContext.clearRect(0,0,game.width,game.height);
			renderImage(movingImage,movingImage.x,movingImage.y,game.playerContext);
		}
		
		function checkIfGameComplete(){
			for(image in game.bgImages){
			if(game.bgImages[image].id.indexOf('Out')>=0){ continue; }
			if(game.bgImages[image].id.indexOf('tick')>=0){ continue; }
				if(game.bgImages[image].covered == false){
					return false;
				}
			}
			game.bgContext.fillText('Game Over!', game.width/2-50,game.height/2-50);
			game.speed = 1;
			return true;
		}
		
		function checkForCollision(movingImage,direction){
			mx1 = movingImage.x;
			mx2 = movingImage.x + movingImage.w;
			my1 = movingImage.y;
			my2 = movingImage.y + movingImage.h;
			//console.log('movingImage pars are ' + mx1 + ',' + mx2 + ',' + my1 + ',' + my2);
			for(image in game.bgImages){
				if(game.bgImages[image].id.indexOf('tick')>=0){
					continue;
				}
				sx1 = game.bgImages[image].x;
				sx2 = game.bgImages[image].x + game.bgImages[image].w;
				sy1 = game.bgImages[image].y;
				sy2 = game.bgImages[image].y + game.bgImages[image].h;
				//console.log('bgImage pars are ' + sx1 + ',' + sx2 + ',' + sy1 + ',' + sy2);
				if(direction=='left'){
					if(((mx1>sx1 && mx1<=sx2) && (mx2>sx2)) && ((my1>=sy1 && my1 <= sy2) || (my2>=sy1 && my2 <= sy2))){
						if(game.bgImages[image].guestId != movingImage.id){	
							mx1 = sx2+1;
							movingImage.x = mx1;
						}
						else if(game.bgImages[image].id.indexOf('Out')<0){
							renderImage(game.bgImages[10],sx1+5,sy1+5,game.bgContext);
							game.bgImages[image].covered = true;
						}
					}
				}else
				if(direction=='right'){
					if(((mx2>=sx1 && mx2<sx2) && (mx1<sx1 )) && ((my1>=sy1 && my1 <= sy2) || (my2>=sy1 && my2 <= sy2))){
						if(game.bgImages[image].guestId != movingImage.id){	
							mx2 = sx1-1;
							movingImage.x = mx2 - movingImage.w;
						}
					else if(game.bgImages[image].id.indexOf('Out')<0){
							renderImage(game.bgImages[10],sx1+5,sy1+5,game.bgContext);
							game.bgImages[image].covered = true;
						}						
					}
				}else
				if(direction=='up'){
					if(((my1>=sy1 && my1<=sy2) && (my2>sy2 )) && ((mx1>=sx1 && mx1 <= sx2) || (mx2>=sx1 && mx2 <= sx2))){
						if(game.bgImages[image].guestId != movingImage.id){	
							my1 = sy2+1;
							movingImage.y = my1;
						}
						else if(game.bgImages[image].id.indexOf('Out')<0){
							renderImage(game.bgImages[10],sx1+5,sy1+5,game.bgContext);
							game.bgImages[image].covered = true;
						}						
					}				
				}else
				if(direction=='down'){
					if(((my2>=sy1 && my2<=sy2) && (my1<sy1 )) && ((mx1>=sx1 && mx1 <= sx2) || (mx2>=sx1 && mx2 <= sx2))){
						if(game.bgImages[image].guestId != movingImage.id){	
							my2 = sy1-1;
							movingImage.y = my2-movingImage.h;
						}
						else if(game.bgImages[image].id.indexOf('Out')<0){
							renderImage(game.bgImages[10],sx1+5,sy1+5,game.bgContext);
							game.bgImages[image].covered = true;
						}						
					}				
				}				
			}
			for(parent in game.mobileImagesLocs){
				for(locs=0; locs<game.mobileImagesLocs[parent].length; locs++){
					sx1 = game.mobileImagesLocs[parent][locs];
					sx2 = game.mobileImagesLocs[parent][locs] + game.mobileImages[parent].w;
					locs++;
					sy1 = game.mobileImagesLocs[parent][locs];
					sy2 = game.mobileImagesLocs[parent][locs] + game.mobileImages[parent].h;
					
					if(direction == 'left'){
							if(((mx1>sx1 && mx1<=sx2) && (mx2>sx2)) && ((my1>=sy1 && my1 <= sy2) || (my2>=sy1 && my2 <= sy2))){
							console.log('left collision detected with block with guestID' + parent);
							mx1 = sx2+1;
							movingImage.x = mx1;
							//movingImage.pic = game.mobileImages[parent].pic;
							movingImage.pic = game.parentImages[parent].pic;
							movingImage.id = parent;
						}
					}
					else if(direction == 'right'){
						if(((mx2>=sx1 && mx2<sx2) && (mx1<sx1 )) && ((my1>=sy1 && my1 <= sy2) || (my2>=sy1 && my2 <= sy2))){
							console.log('right collision detected with ' + parent);
							mx2 = sx1-1;
							movingImage.x = mx2 - movingImage.w;
							//movingImage.pic = game.mobileImages[parent].pic;
							movingImage.pic = game.parentImages[parent].pic;
							movingImage.id = parent;
						}
					}
					else if(direction == 'up'){
						if(((my1>=sy1 && my1<=sy2) && (my2>sy2 )) && ((mx1>=sx1 && mx1 <= sx2) || (mx2>=sx1 && mx2 <= sx2))){
							console.log('up collision detected with ' + parent);
							my1 = sy2+1;
							movingImage.y = my1;
							//movingImage.pic = game.mobileImages[parent].pic;
							movingImage.pic = game.parentImages[parent].pic;
							movingImage.id = parent;
						}							
					}
					else if(direction == 'down'){
						if(((my2>=sy1 && my2<=sy2) && (my1<sy1 )) && ((mx1>=sx1 && mx1 <= sx2) || (mx2>=sx1 && mx2 <= sx2))){
							console.log('down collision detected with ' + parent);
							my2 = sy1-1;
							movingImage.y = my2-movingImage.h;
							//movingImage.pic = game.mobileImages[parent].pic;
							movingImage.pic = game.parentImages[parent].pic;
							movingImage.id = parent;
						}						
					}
				}
			}
		}
		
		function createSequence(){
			shuffleArray(game.seq);
			for(i in game.seq){
				console.log('shuffled array is ' + game.seq[i]);
			}
			for(i=0;i<game.seq.length;i++){
				//j=i+1;
				//k=i+2;
				if(i+1<game.seq.length){
					//console.log('going to add to block ' + game.seq[i] + ' block ' + game.seq[i+1]);
					game.guestBlocks[game.seq[i]].push(game.seq[i+1]);
				}
				if(i+2<game.seq.length){
					//console.log('going to add to block ' + game.seq[i] + ' block ' + game.seq[i+2]);
					game.guestBlocks[game.seq[i]].push(game.seq[i+2]);
				}
			}
			//hardcoded assignment of nakli blocks
			game.guestBlocks[game.seq[0]].push(game.seq[3]);
			game.guestBlocks[game.seq[0]].push(game.seq[5]);
			game.guestBlocks[game.seq[1]].push(game.seq[4]);
			game.guestBlocks[game.seq[2]].push(game.seq[5]);
			game.guestBlocks[game.seq[3]].push(game.seq[0]);
			game.guestBlocks[game.seq[4]].push(game.seq[1]);
			game.guestBlocks[game.seq[5]].push(game.seq[0]);
			game.guestBlocks[game.seq[5]].push(game.seq[2]);
			
			for(i in game.guestBlocks){
				for(j in game.guestBlocks[i]){
					console.log('guest for ' + i + ' is ' + game.guestBlocks[i][j]);
				}
			}
		}
		
		function createLayoutStyle(){
			//0	lt
			//1	lb
			//2	rt
			//3	rb
			a = Math.floor(Math.random()*4);
			console.log('a is ' + a);
			game.bgImages[getIndexOfId('leftOut')].guestId = 'player';
			game.bgImages[getIndexOfId('rightOut')].guestId = 'player';
			game.bgImages[getIndexOfId('topOut')].guestId = 'player';
			game.bgImages[getIndexOfId('bottomOut')].guestId = 'player';
			//hardcoded if statements below
			if(a==0){
				game.bgImages[getIndexOfId('leftRect')].guestId = game.seq[0];
				game.bgImages[getIndexOfId('leftSquare')].guestId = game.seq[2];
				game.bgImages[getIndexOfId('topRect')].guestId = game.seq[4];
				game.bgImages[getIndexOfId('bottomRect')].guestId = game.seq[1];
				game.bgImages[getIndexOfId('rightSquare')].guestId = game.seq[3];
				game.bgImages[getIndexOfId('rightRect')].guestId = game.seq[5];	
			} else
			if(a==1){
				game.bgImages[getIndexOfId('leftRect')].guestId = game.seq[0];
				game.bgImages[getIndexOfId('leftSquare')].guestId = game.seq[2];
				game.bgImages[getIndexOfId('bottomRect')].guestId = game.seq[4];
				game.bgImages[getIndexOfId('topRect')].guestId = game.seq[1];
				game.bgImages[getIndexOfId('rightSquare')].guestId = game.seq[3];
				game.bgImages[getIndexOfId('rightRect')].guestId = game.seq[5];								
			} else
			if(a==2){
				game.bgImages[getIndexOfId('rightRect')].guestId = game.seq[0];
				game.bgImages[getIndexOfId('rightSquare')].guestId = game.seq[2];
				game.bgImages[getIndexOfId('topRect')].guestId = game.seq[4];
				game.bgImages[getIndexOfId('bottomRect')].guestId = game.seq[1];
				game.bgImages[getIndexOfId('leftSquare')].guestId = game.seq[3];
				game.bgImages[getIndexOfId('leftRect')].guestId = game.seq[5];				
			} else
			if(a==3){
				game.bgImages[getIndexOfId('rightRect')].guestId = game.seq[0];
				game.bgImages[getIndexOfId('rightSquare')].guestId = game.seq[2];
				game.bgImages[getIndexOfId('bottomRect')].guestId = game.seq[4];
				game.bgImages[getIndexOfId('topRect')].guestId = game.seq[1];
				game.bgImages[getIndexOfId('leftSquare')].guestId = game.seq[3];
				game.bgImages[getIndexOfId('leftRect')].guestId = game.seq[5];								
			} 
			for (i in game.bgImages){
				console.log('guestIDs assigned are ' + game.bgImages[i].guestId);
			}
		}
		
		function writeTextOnCanvas(textToWrite,context,xLoc,yLoc){
			context.font = "bold, 50px, monaco";
			context.fillStyle = "black";
			context.fillText(textToWrite,xLoc,yLoc);
			console.log('wrote ' + textToWrite);
		}
		
		function drawGuestsInBlock(blockId,location){
			parent = game.bgImages[getIndexOfId(blockId)].guestId;
			j = getIndexOfId(blockId);
			console.log('j, its parent and is and its no of guests is ' + j + ',' + parent +  ',' + game.guestBlocks[parent]);
			//xLoc = game.bgImages[j].x;
			//yLoc = game.bgImages[j].y;
			
			if(location == 'left'){
				xLoc = game.bgImages[j].x + 5;	//hardcoded
				yLoc = game.bgImages[j].y + 50;		//hardcoded
				writeTextOnCanvas(game.dict[game.parentImages[parent].id],game.bgContext,xLoc,yLoc-40);
				for(i in game.guestBlocks[parent]){
					var temp = game.guestBlocks[parent][i];
					game.mobileImagesLocs[temp].push(xLoc);
					game.mobileImagesLocs[temp].push(yLoc);
					renderImage(game.mobileImages[temp],xLoc,yLoc,game.charContext);
					yLoc = yLoc + game.mobileImages[temp].h * 1.5;	//hardcoded
				}
			} else
			if(location == 'right'){
				xLoc = game.bgImages[j].x + game.bgImages[j].w - 35;	//hardcoded
				yLoc = game.bgImages[j].y + 50;	//hardcoded
				writeTextOnCanvas(game.dict[game.parentImages[parent].id],game.bgContext,xLoc,yLoc-40);
				for(i in game.guestBlocks[parent]){
					//var temp = game.guestBlocks[parent][i];
					game.mobileImagesLocs[game.guestBlocks[parent][i]].push(xLoc);
					game.mobileImagesLocs[game.guestBlocks[parent][i]].push(yLoc);					
					renderImage(game.mobileImages[game.guestBlocks[parent][i]],xLoc,yLoc,game.charContext);
					yLoc = yLoc + game.mobileImages[game.guestBlocks[parent][i]].h * 1.5;
				}			
			} else
			if(location == 'top'){
				xLoc = game.bgImages[j].x + 80;	//hardcoded
				yLoc = game.bgImages[j].y + 5;	//hardcoded
				writeTextOnCanvas(game.dict[game.parentImages[parent].id],game.bgContext,xLoc-70,yLoc+5);
				for(i in game.guestBlocks[parent]){
					game.mobileImagesLocs[game.guestBlocks[parent][i]].push(xLoc);
					game.mobileImagesLocs[game.guestBlocks[parent][i]].push(yLoc);					
					renderImage(game.mobileImages[game.guestBlocks[parent][i]],xLoc,yLoc,game.charContext);
					xLoc = xLoc + game.mobileImages[game.guestBlocks[parent][i]].w * 1.5;
				}				
			} else			
			if(location == 'bottom'){
				xLoc = game.bgImages[j].x + 70;	//hardcoded
				yLoc = game.bgImages[j].y + game.bgImages[j].h - 35;
				writeTextOnCanvas(game.dict[game.parentImages[parent].id],game.bgContext,xLoc-60,yLoc+30);
				for(i in game.guestBlocks[parent]){
					game.mobileImagesLocs[game.guestBlocks[parent][i]].push(xLoc);
					game.mobileImagesLocs[game.guestBlocks[parent][i]].push(yLoc);					
					renderImage(game.mobileImages[game.guestBlocks[parent][i]],xLoc,yLoc,game.charContext);
					xLoc = xLoc + game.mobileImages[game.guestBlocks[parent][i]].w * 1.5;
				}				
			} else			
			if(location == 'nota'){
				xLoc = game.bgImages[j].x + 50;
				yLoc = game.bgImages[j].y + 50;
				writeTextOnCanvas(game.dict[game.parentImages[parent].id],game.bgContext,xLoc,yLoc+game.bgImages[j].h-60);
				var shiftTemp = -1;
				for(i in game.guestBlocks[parent]){
					game.mobileImagesLocs[game.guestBlocks[parent][i]].push(xLoc);
					game.mobileImagesLocs[game.guestBlocks[parent][i]].push(yLoc);									
					renderImage(game.mobileImages[game.guestBlocks[parent][i]],xLoc,yLoc,game.charContext);
					if(shiftTemp < 0){
						yLoc = yLoc + game.mobileImages[game.guestBlocks[parent][i]].h + 5;
					}
					else{
						xLoc = xLoc + game.mobileImages[game.guestBlocks[parent][i]].w + 5;
					}
					shiftTemp *= -1;
				}				
			}

		}
		
		function drawBlocksInOuterRing(){
			for(i in game.mobileImages){
				if(i%2==0){
					a  = getIndexOfId('topOut');
					xLoc = game.bgImages[a].x;
					yLoc = game.bgImages[a].y;
					game.mobileImagesLocs[i].push(xLoc + i* ( game.mobileImages[i].w ));
					game.mobileImagesLocs[i].push(yLoc + 5);
					renderImage(game.mobileImages[i],xLoc + i* ( game.mobileImages[i].w ), yLoc + 5,game.charContext);	//hardcoded
				}
				else{
					var b  = getIndexOfId('bottomOut');
					xLoc = game.bgImages[b].x;
					yLoc = game.bgImages[b].y;
					game.mobileImagesLocs[i].push(xLoc + i*(game.mobileImages[i].w));
					game.mobileImagesLocs[i].push(yLoc + game.bgImages[b].h - 35);					
					renderImage(game.mobileImages[i],xLoc + i*(game.mobileImages[i].w)  , yLoc + game.bgImages[b].h - 35,game.charContext);	//hardcoded					
				}
			}
		}
		/*
		function reDrawCanvas(){
			game.charContext.clearRect(0,0,game.width,game.height);
			console.log(game.blockImages.length);
			for (i in game.blockImages){
				if (game.blockImages[i].showOnStart){
					game.charContext.drawImage(game.blockImages[i].pic,game.blockImages[i].x,game.blockImages[i].y);
				}
			}
		}*/
		
		function renderImage(image, xLoc, yLoc,context){
			image.x = xLoc;
			image.y = yLoc;
			//console.log(image.x + ',' + image.y);
			context.drawImage(image.pic, xLoc, yLoc);
		}
		
		function wipeImage(image, xLoc, yLoc, context){
			context.clearRect(xLoc,yLoc,image.w,image.h);
		}
		
		function verifyUploadOfAllImages(){
			console.log(game.loadedImages + ',' + game.reqdImages);
			console.log(game.loadedMobileImages + ',' + game.reqdMobileImages);
			if(game.loadedImages == game.reqdImages && game.loadedMobileImages == game.reqdMobileImages && game.loadedParentImages == game.reqdParentImages){
				console.log('yay, all images uploaded');
				init();
			}
			else{
				setTimeout(function(){
					//console.log('waiting for images to be loaded');
					verifyUploadOfAllImages();
				},1);
			}
		}

		function shuffleArray(array) {
			for (var i = array.length - 1; i > 0; i--) {
				var j = Math.floor(Math.random() * (i + 1));
				var temp = array[i];
				array[i] = array[j];
				array[j] = temp;
			}
			return array;
		}		
		
		function getIndexOfId(idName){
			for(k in game.bgImages){
				if(game.bgImages[k].id == idName){ return k; }
			}
		}		
		
		bgImageNamesArr = [
		'leftSquare',
		'rightSquare',
		'topRect',
		'bottomRect',
		'leftRect',
		'rightRect',
		'topOut',
		'bottomOut',
		'leftOut',
		'rightOut',
		'tick'			//10
		];

		for(i=0;i<game.seq.length;i++){
			console.log('calling funciton to log image ' + i);
			loadImageToArr(i,game.mobileImages,game.loadedMobileImages,game.reqdMobileImages);
			loadImageToArr('p'+i,game.parentImages,game.loadedParentImages,game.reqdParentImages);
			loadImageToArr('player',game.player,game.loadedPlayerImage,game.reqdPlayerImage);
		}

		loadImageFromArrToArr(bgImageNamesArr,game.bgImages);
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