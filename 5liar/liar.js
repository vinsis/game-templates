(function(){
$(document).ready(function(){
	var attempt = 0;
	var appendTextwrong = '';
	var appendTextright = '';
	var completed = false;
	
	$('#p1').on('click',function(){
		$('#s1 span').html('1) The character for "on top" or "upper" consists of a horizontal base with something "on top" of it - <b>上</b> <br><br> 2) The character for "downwards" or "lower" consists of a horizontal base with something "below" it - <b>下</b>. Both these characters use the same logic.');
		$('#s2 span').text('');
		$('#s3 span').text('');
	});
	$('#p2').on('click',function(){
		$('#s1 span').text('');
		$('#s2 span').html('1) The character for "card" is <b>片</b> since a card is flat and thin. <br><br> 2) The logics for the characters <b>上</b> and <b>下</b> are different. Pig 1 is a liar.');
		$('#s3 span').text('');
	});
	$('#p3').on('click',function(){
		$('#s1 span').text('');
		$('#s2 span').text('');
		$('#s3 span').html('1) The character <b>片</b> (pian4) means thin slice or a flake. It is also used as a classifier for thin objects like CDs tablets etc. It basically represents right half of the character for tree or wood <b>木</b> <br><br> 2) A card is thin and flat. So it practically has only two sides - top and bottom (or front and back). Thus the character for card is formed by combining the characters for top and bottom - <b>上</b> and <b>下</b>.');
	});
	$('.answers').click(function (e){
		attempt++;
		if(completed){
			$('#wrongAns').text('You already answered correctly. Stop fiddling!');
			$('#rightAns').text('');
		}
		else{
			if(attempt > 1){
				appendTextwrong = 'Wrong again!';
				appendTextright = 'Try to get it right in the very first attempt next time';
			}
			if($(this).text() == '卡'){
				$('#rightAns').text('Bingo! ^^. ' + appendTextright);
				$('#wrongAns').text('');
				$('#footnote').html('<b>Footnote:</b> 片 is used as a classifier for 卡. Words you should learn from this exercise are <b>上</b>, <b>下</b>, <b>卡</b> and <b>片</b>');
				completed = true;
			}
			else{
				$('#wrongAns').text('Boo! -_- ' + appendTextwrong);
				$('#rightAns').text('');
			}
		}
	});
});
})();