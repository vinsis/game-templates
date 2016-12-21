(function(){
	$(document).ready(function(){
		var i=0;
		$('#im1').one('click',function(){
			$('#downArr1').attr('src','images/downArr.png');
			$('#im2a').attr('src','images/zhi3.png');
			$('#sp2a').html('<br> Adding a vertical line to the left gives rise to the character for "stop/prohobit".');
			$('#sp1').html('');
			//$('#desc').html('A horizontal line added on the left gives rise to zhi3. It means "to stop" or "prohibit".');
		});
		$('#im2a').on('click',function(){
			if(i==0){
				$('#rightArr1').attr('src','images/rightArr.png');
				$('#im2b').attr('src','images/zu2.png');
				//$('#desc').html('You use the front portion (or mouth) of your foot to stop. So adding a mouth to 止 gives rise to zu2 - the character for "foot". Note that the base of 止 has been slightly modified. However when used as a radical, it is written as ⻊and not 足. Click on 止 again.');
				$('#sp2b').html('<br> Adding a mouth to 止 gives rise to zu2 - the character for "foot". Note that the base of 止 has been slightly modified. However when used as a radical, it is written as ⻊and not 足. Click on 止 again.');
				$('#sp2a').html('');
				i++;
			}
			else if (i==1){
				$('#downArr2').attr('src','images/downArr.png');
				$('#im3a').attr('src','images/zheng4.png');
				//$('#desc').html('Adding a horizontal line to the top of 止 gives us the character for "upright" or "positive" or "correct".');
				$('#sp3a').html('<br> Adding a horizontal line to the top of 止 gives us the character for "upright" or "positive" or "correct".');
				$('#sp2b').html('');
				i++;
			}
		});
		$('#im3a').one('click',function(){
			$('#rightArr2').attr('src','images/rightArr.png');
			$('#im3b').attr('src','images/shi4.png');
			//$('#desc').html('Let us add a sun to the top to represent sun shining on something that is positive or upright. _Maybe_ this used to represent the "current" or "existing" state of affairs and thus became the character for "is" or "to be".');
			$('#sp3a').html('');
			$('#sp3b').html('<br> Let us add a sun to the top to represent sun shining on something that is positive or upright. _Maybe_ this used to represent the "current" or "existing" state of affairs and thus became the character for "is" or "to be".');
		});
	});
})();