(function(){
	$(document).ready(
		function(){
			var game = {};
			var handle = {};
			var totalPairs = 2;
			game.type = [];
			game.targetChars = [];
			game.type[1] = 'l2r2';
			game.type[2] = 'l2r2';
			game.targetChars[1] = '解';
			game.targetChars[2] = '體';
			game.type[3] = 'l2r1';
			game.type[4] = 'l2r1';
			game.targetChars[3] = '鼓';
			game.targetChars[4] = '勵';			
			
			function init(){
				reDrawCanvas();
				loop();
			}
			
			function reDrawCanvas(){
				game.charContext.clearRect(0,0,game.width,game.height);
				game.bgContext.clearRect(0,0,game.width,game.height);
				for (i in game.images){
					if (game.images[i].showOnStart){
						game.charContext.drawImage(game.images[i].pic,game.images[i].x,game.images[i].y);
					}
				}
			}
			
			function loop(){
				handle = requestAnimFrame(function() { loop() });
				update();
			}
			
			function update(){
				var i = getPlayerId(game.mobileImageId);
				
				if (game.keys[37] && game.images[i].x > 0){//left arrow
					game.mobileImageLastx = game.images[i].x;
					game.mobileImageLasty = game.images[i].y;
					game.images[i].x -= game.speed;
					updateCodeThatRepeatsOften(i,'left');
				}
				
				if (game.keys[39] && game.images[i].x < (game.width - game.images[i].width)){//right arrow
					game.mobileImageLastx = game.images[i].x;
					game.mobileImageLasty = game.images[i].y;
					game.images[i].x += game.speed;
					updateCodeThatRepeatsOften(i,'right');
				}
				
				if (game.keys[38] && game.images[i].y > 0){//up arrow
					game.mobileImageLastx = game.images[i].x;
					game.mobileImageLasty = game.images[i].y;
					game.images[i].y -= game.speed;
					updateCodeThatRepeatsOften(i,'up');
				}
				
				if (game.keys[40] && game.images[i].y < (game.height - game.images[i].height)){//down arrow
					game.mobileImageLastx = game.images[i].x;
					game.mobileImageLasty = game.images[i].y;
					game.images[i].y += game.speed;
					updateCodeThatRepeatsOften(i,'down');
				}
			}
			
			function updateCodeThatRepeatsOften(i,direction){
				for(n in game.images)
				{
					if(n != i && game.images[n].showOnStart)
					{
						if(detectCollision(game.images[i],game.images[n],direction))
						{
							game.images[i].showOnStart = false;
							game.images[n].showOnStart = false;
							var parentId = getPlayerId(game.images[i].parent);
							game.images[parentId].showOnStart = true;
							game.images[parentId].x = game.images[n].x;
							game.images[parentId].y = game.images[n].y;
							game.mobileImageLastx = game.images[n].x;
							game.mobileImageLasty = game.images[n].y;
							game.mobileImageId = game.images[parentId].id;
							reDrawCanvas();
							break;
						}
					}
				}
				if(game.images[i].showOnStart)
				{
					renderMobileImage(i,game.mobileImageLastx,game.mobileImageLasty,game.images[i].width,game.images[i].height);
				}
			}
			
			function renderMobileImage(mobileImageId,oldPosx,oldPosy,imageWidth,imageHeight){
				game.charContext.clearRect(oldPosx,oldPosy,imageWidth,imageHeight);
				game.charContext.drawImage(game.images[mobileImageId].pic,game.images[mobileImageId].x,game.images[mobileImageId].y);
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
						game.images.splice(getPlayerId(game.mobileImageId),1);
						//game.images[getPlayerId(game.mobileImageId)].showOnStart = false;
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
					}
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
					}
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
					}
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
					game.bgContext.font = "bold 20px monaco";
					game.bgContext.fillStyle = "black";
					game.bgContext.fillText('Game Over!', game.width/2-50,game.height/2-50);
					game.speed = 0;
					cancelRequestAnimFrame(handle);
				}
			}
			
			function createImageNames(charSNo,charType){
				if(charType.indexOf('l2') >= 0){
					loadImage(charSNo+'lt',true,charSNo+'l','down');
					loadImage(charSNo+'lb',true,charSNo+'l','up');
					loadImage(charSNo+'l',false,charSNo+charType,'right');
				} else
				if(charType.indexOf('l1') >= 0){
					loadImage(charSNo+'l',true,charSNo+charType,'right');
				}
				if(charType.indexOf('r2') >= 0){
					loadImage(charSNo+'rt',true,charSNo+'r','down');
					loadImage(charSNo+'rb',true,charSNo+'r','up');
					loadImage(charSNo+'r',false,charSNo+charType,'left');
				}
				if(charType.indexOf('r1') >= 0){
					loadImage(charSNo+'r',true,charSNo+charType,'left');
				}
				if(charType.indexOf('t2') >= 0){
					loadImage(charSNo+'tl',true,charSNo+'t','right');
					loadImage(charSNo+'tr',true,charSNo+'t','left');
					loadImage(charSNo+'t',false,charSNo+charType,'down');
				} else
				if(charType.indexOf('t1') >= 0){
					loadImage(charSNo+'t',true,charSNo+charType,'down');
				}
				if(charType.indexOf('b2') >= 0){
					loadImage(charSNo+'bl',true,charSNo+'b','right');
					loadImage(charSNo+'br',true,charSNo+'b','left');
					loadImage(charSNo+'b',false,charSNo+charType,'up');
				}
				if(charType.indexOf('b1') >= 0){
					loadImage(charSNo+'b',true,charSNo+charType,'up');
				}
				loadImage(charSNo+charType,false,'none','none');
			}
			
			function loadImage(imageName,displayOnStart,parentName,combineWhenDirectionIs){
				var image = new Image;
				image.src = 'images/'+imageName+'.png';
				var i = game.reqdImages;
				var xLoc = (Math.floor(game.gridArray[i]/10))*game.gridWidth;
				var yLoc = (game.gridArray[i]%10)*game.gridHeight;
				game.reqdImages++;
				game.images.push({
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
				game.images[i].pic.onload = function()
				{
					game.images[i].width = image.width;
					game.images[i].height = image.height;
					game.doneImages++; 
				}
			}
			
			function checkImages(){
				if(game.reqdImages <= game.doneImages){
					init();
				}
				else{
					setTimeout(function()
						{ checkImages(); },1);
				}
			}
			
			function getPlayerId(idName){
				for(i in game.images){
					if(game.images[i].id == idName){ return i; }
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
			
			function fitToMerge(movingInDirection,canCombineInDirection,mobileImageParent,staticImageParent){
				if(movingInDirection == canCombineInDirection && mobileImageParent == staticImageParent){
					return true;
				}
				return false
			}
			
			function letsGetRolling(int1, type1, int2, type2){
				//var game = {};
				game.width = 400;
				game.height = game.width;

				game.images = [];
				//game.imageIds = [];
				game.doneImages = 0;
				game.reqdImages = 0;
				
				game.mobileImageId = 'player';
				game.mobileImagex = 10;
				game.mobileImagey = 10;
				game.mobileImageLastx = game.mobileImagex;
				game.mobileImageLasty = game.mobileImagey;
				
				game.keys = [];
				game.speed = 5;
				
				game.gridWidth = game.width/10;
				game.gridHeight = game.gridWidth;
				game.gridArray = [];
				for(i=0;i<100;i++){
					game.gridArray.push(i);
				}
				shuffleArray(game.gridArray);
				
				game.bgContext = document.getElementById('bgCanvas').getContext('2d');
				game.charContext = document.getElementById('charCanvas').getContext('2d');
				
				
				$(document).keydown(function(e){
					game.keys[e.keyCode ? e.keyCode : e.which] = true;
				});
				$(document).keyup(function(e){
					delete game.keys[e.keyCode ? e.keyCode : e.which];
				});
				loadImage('player',true,'none','none');
				//console.log(int1 +','+ type1 +','+ int2 +','+ type2);
				createImageNames(int1,type1);
				createImageNames(int2,type2);
				$('#tb1').text(game.targetChars[int1]);
				$('#tb2').text(game.targetChars[int2]);
				checkImages();
			}
			
			$('#newGame').click(function(){
				var rand = Math.floor(Math.random()*totalPairs);
				rand *= 2;
				rand++;
				cancelRequestAnimFrame(handle);
				letsGetRolling(rand,game.type[rand],rand+1,game.type[rand]);
			});
			letsGetRolling(1,game.type[1],2,game.type[2]);
			
		
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