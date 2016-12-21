(function(){
	$(document).ready(function(){
		var imageDir = 'boxes';
		var imageDisplayed = 0;
		
		var charDefArr = {};
		//boxes
		charDefArr['boxes_kou3']='Let us begin with one of the simplest figures - a rectangle. A simple rectangle gives us the character for "mouth" or "classifier for things with mouths". It actually does look like a mouth.';
		charDefArr['boxes_ri4']='Add a horizontal line to a rectangle and you get the character for "sun" or "day". It apparently represents a window with a view of a sun (obviously) in the daytime outside';
		charDefArr['boxes_zhong1']='Add a vertical line piercing a rectangle and you get the character for "center" or "China" since it was considered the center of the world by its people.';
		charDefArr['boxes_tian2']='A combination of a horizontal and a vertical line gives birth to a character that looks like a "farm" or a "field". The character looks like blocks of farmland.';
		charDefArr['boxes_mu4']='Add another horizontal line to 日. It means "eye" (makes sense if you invert it by 90 degrees) or "a catalogue or a list"';
		charDefArr['boxes_zi4']='Add a small tick to the top of 目. It looks like a body with a small nose on top. It means "self" or "oneself"';
		charDefArr['boxes_bai2']='Add a tick to 日. The tick represents the first ray of the sun. It means "white" or "pure" or "bright".';
		var boxesArr = ['kou3','ri4','zhong1','tian2','mu4','bai2','zi4'];
		
		//modified 
		charDefArr['modified_ju4']='Add two _straight_ legs to the non-existent character in the last pic. You get a character for "tool" or "device" or "equipment".';
		charDefArr['modified_zhi2']='Now remove the legs from the last character. It means "continuously" or "straight".';
		charDefArr['modified_zhen1']='Now add the character for "ten" (remember two perpendicular lines?) on top of the last character. It means "real".';
		charDefArr['modified_tian2']='Let us begin with modifying the character 田. Remember what it means?';
		charDefArr['modified_you2']='Extend the vertical line in 田 upwards out of the box to get a character for "to follow" or "from" or "because of"';
		charDefArr['modified_jia3']='Extend the vertical line in 田 downwards out of the box to get a character for "shell" or "shield". The character does look like a top view of a turtle with a small tail.';
		charDefArr['modified_shen1']='Extend the vertical line in 田 in both directions to get the character for "to state" or "to extend"';
		charDefArr['modified_bei4']='Add two _straight_ legs to 目. It means "cowry" or "shellfish". It is also an archaic character for currency. It is still used as a radical in other characters related to money or currency';
		charDefArr['modified_mu4']='Now let us make some new characters by modifying the character 目. Remember what it means?';
		charDefArr['modified_jian4']='Add two _curved_ legs to 目. It looks like someone standing in front of you. It means "to see" or "to meet" or "to appear".';
		charDefArr['modified_qie3']='Extend the bottommost horizontal line of 目 to cover both the right side and the left side. It means "both .. and .." or "moreover".';
		charDefArr['modified_qi2']='Extend the top edges in 且 and add two _straight_ legs. It means "it" or "his/her". It is commonly used as a phonetic in other characters.';
		charDefArr['modified_undef']='Take a look at this character carefully. Depending on what replaces the question mark (?) in the character, we will get a character with a different meaning. Let us take a look.';
		charDefArr['modified_undefined']='We have been adding a horizontal line to a rectangle again and again to get new characters. Let us do it one last time by adding the fourth horizontal line to 目. The character does not mean anything on its own but we will learn a few characters by modifying it.';
		charDefArr['modified_zuo3']='Replacing "?" with gong1 (工) gives us the character for "left (direction)"';
		charDefArr['modified_you4']='Replacing "?" with kou3 (口) gives us the character for "right (direction)"';
		charDefArr['modified_you3']='Replacing "?" with you4 (又) gives us the character for "friend"';
		charDefArr['modified_tu3']='Remember the meaning of 土? A subtle modification of this character leads us to another very similar character.';
		charDefArr['modified_mu4tree']='Now let us create some characters by modifying the character 木 (remember its meaning?).';
		charDefArr['modified_ben3']='A horizontal line at the base of the tree (木) means "root" or "origin"';
		charDefArr['modified_mo4']='A _long_ horizontal line at the top of the tree (木) means "tip" or "end" or "final stage"';
		charDefArr['modified_shi4']='It is formed by extending the upper horizontal line and trimming the lower horizontalline of the last character. A plus sign with a _short_ base means "scholar" or "first class military rank".';
		charDefArr['modified_wei4']='A _short_ horizontal line at the top of the tree (木) means "not yet".';		
		
		var modArr = ['tian2','you2','jia3','shen1','mu4','bei4','jian4','qie3','qi2','undefined','ju4','zhen1','zhi2','undef','zuo3','you4','you3','tu3','shi4','mu4tree','ben3','mo4','wei4'];
		
		//shapes
		charDefArr['shapes_yue4']='This character represents the crescent of the moon. It means "moon" or "month" (due to use of lunar calendar possibly).';
		charDefArr['shapes_da4']='Character for "big". It looks like a man spreading his legs and arms to describe how "big" big is.';
		charDefArr['shapes_gong1']='A simple character that looks like a thin man with a super thin waist means "work", "profession" or "labor".';
		charDefArr['shapes_wang2']='A labor grows a big waist when he becomes a "king" or "great".';
		charDefArr['shapes_huo3']='It means "fire". It looks like flames of fire. Another form of it (灬) is used as a radical in many characters.';
		charDefArr['shapes_li4']='It looks like the arm of a beefy guy grabbing a neck of a person. It means "power".';
		charDefArr['shapes_li4stand']='Looks like a bin. It means "to establish" or "to set up".';
		charDefArr['shapes_men2']='It is easy to guess this one. It means "door" :)';
		charDefArr['shapes_mu4']='Another character super easy to guess. It looks like and means "tree" or "wood" or "wooden". It is used as a radical in characters with meanings related to wood.';
		charDefArr['shapes_nv3']='The character looks like a person with a heavy bosom walking on thin legs. It means "woman".';
		charDefArr['shapes_shui3']='It is an evolved form of three droplets of water flowing downwards close to each other. It means "water". Other forms (氺,氵) are used as radicals in other characters.';
		charDefArr['shapes_tu3']='A plus sign with a _long_ base means earth or soil.';
		charDefArr['shapes_xiao3']='Character for small. It looks like a man with legs sticking to each other and arms drooping down.';
		charDefArr['shapes_zi3']='Looks like a small kid with arms wide open. It means "son" or "child" and by extension "a small thing".';
		charDefArr['shapes_you4']='Another simple character which represents legs of a walking person continuously stepping forward. It means "again"';
		charDefArr['shapes_xin1']='Character for "heart". I guess it is not too hard to guess since the character looks like a heart.';
		charDefArr['shapes_shan1']='Another easy to guess character. It means "mountain".';
		charDefArr['shapes_shou3']='A character consists of three horizontal lines depicting fingers and a vertical line depicting a forearm. It means "hand".';
		charDefArr['shapes_tian1']='No matter how big a thing is, it is always under the cover of the sky. Adding a horizontal line to the top of the character for big gives us the character for "sky" or "heaven" or "day".';
		charDefArr['shapes_he2']='A curvy line to the top of the tree (木) gives us the character for "grain" or "cereal". It is mostly used as a radical in other characters.';
		var shapesArr = ['mu4','he2','da4','tian1','xiao3','yue4','huo3','shui3','li4','li4stand','nv3','zi3','gong1','wang2','tu3','xin1','shan1','shou3','you4','men2'];
		
		//combinations
		charDefArr['combinations_pin3']='This character is formed by drawing the character kou3 thrice. Something that is consumed by many mouths or people is a "commodity" or "a good".';
		charDefArr['combinations_chang1']='Character formed by drawing a sun over a sun. Two suns = too much brightness. Metaphorically, it means "flourishing" or "thriving".';
		charDefArr['combinations_jing1']='Character formed by drawing three suns. It means "a crystal" with its corners shining like a sun.';
		charDefArr['combinations_peng2']='Character formed by drawing a moon beside a moon. It represents two people standing close to each other, like good friends. The character means "friend". Remember another character that means friend? Usually, in Mandarin friend translates to 朋友';
		charDefArr['combinations_qi1']='Character formed by drawing a moon beside a 其 (remember its meaning?). In this character 其 acts as a phonetic while the moon (月) represents something to do with day or time ( moon here acts as a radical, more on phonetics and radicals later). It means "a period of time."';
		charDefArr['combinations_qiu1']='This character is made by combining grain and fire. When do farmers burn their crops? When the crops have been harvested and they want to get rid of the useless husk. This typically happens in autumn when the trees shed their leaves. The character means "autumn".';
		charDefArr['combinations_nan2']='The character shows power being applied in a field i.e someone working in a field. Typically males used to work in farmlands. The character means "male/man". Do you remember the character for female/woman?';
		charDefArr['combinations_li3']='A field on earth. It tries to represent distance over a land. The character means "a mile" or "500 meters".';
		charDefArr['combinations_jian1']='What do you call something that is small on the top and big at the bottom? "Sharp".';
		charDefArr['combinations_ming2']='Sun and moon together make a character that means "bright" and "clear". It also means "next" (used only in limited context of time - next day and next year for instance).';
		charDefArr['combinations_hao3']='It is always good to have a woman with a kid. So a character with a woman and a kid means "good"';
		charDefArr['combinations_yin1']='A 立 on top of a sun means "noise" or "sound". I do not know why.';
		charDefArr['combinations_an4']='Sun here acts as a radical, and 音 as a phonetic. It is the opposite of 明 - "dark".';
		var combArr = ['pin3','chang1','jing1','peng2','qi1','qiu1','nan2','li3','jian1','ming2','hao3'];
		
		//var seq = ["kou3","ri4","kou3","zhong1","ri4","tian2","you2","jia3","shen1","ri4","yue4","ri4","mu4","zi4","mu4","bei4","jian4","mu4","qie3","qi2","ri4","bai2","undefined","ju4","zhi2","zhen1"];

		$('#p1').on('click',function(){
			imageDir = 'boxes';
			resetCharDes(imageDir,boxesArr);
			$('#topHeading').html('Let us start - Characters with straight lines');
			$('#topSpan').html('This set consists of characters formed by a combination of horizontal and vertical lines. Though there might be no relation between the characters here, it is an interesting phenomenon to observe the evolution of characters and the level of sophistication used.');			
		});
		$('#p2').on('click',function(){
			imageDir = 'shapes';
			resetCharDes(imageDir,shapesArr);
			$('#topHeading').html('Characters resembling their meanings');
			$('#topSpan').html('This set of characters is probably the easiest to remember. The characters look like the objects or things that they mean.');
		});
		$('#p3').on('click',function(){
			imageDir = 'modified';
			resetCharDes(imageDir,modArr);
			$('#topHeading').html('Characters formed after tinkering with simpler characters');
			$('#topSpan').html('We will be making slight modifications to the characters we just learnt in the last two sections. It is easy to remember each of these characters by associating it with the original character modified.');
		});
		$('#p4').on('click',function(){
			imageDir = 'combinations';
			resetCharDes(imageDir,combArr);
			$('#topHeading').html('Characters formed by combining smaller characters');
			$('#topSpan').html('These characters are formed by combining the characters we learnt in the last three sections. Some of the characters obviously logical; others unfortunately are not.');
		});	
		
		
		var seq = boxesArr;
		$('#charImage').attr('src',imageDir + '/' + seq[imageDisplayed] + '.png');
		$('#imgTxtPair').find('h3').text(seq[imageDisplayed]);
		$('#imgTxtPair').find('span').text(charDefArr[imageDir + '_' + seq[imageDisplayed]]);
		$('#leftArrow').on('click',function(){
			imageDisplayed--;
			imageDisplayed = (imageDisplayed+seq.length)%seq.length;
			$('#charImage').attr('src',imageDir + '/' + seq[imageDisplayed] + '.png');
			$('#imgTxtPair').find('h3').text(seq[imageDisplayed]);
			$('#imgTxtPair').find('span').text(charDefArr[imageDir + '_' + seq[imageDisplayed]]);
		});
		$('#rightArrow').on('click',function(){
			imageDisplayed++;
			imageDisplayed = (imageDisplayed+seq.length)%seq.length;
			$('#charImage').attr('src',imageDir + '/' + seq[imageDisplayed] + '.png');
			$('#imgTxtPair').find('h3').text(seq[imageDisplayed]);
			$('#imgTxtPair').find('span').text(charDefArr[imageDir + '_' + seq[imageDisplayed]]);
		});		
		
		function resetCharDes(imageDir,arrName){
			imageDisplayed = 0;
			seq = arrName;
			$('#charImage').attr('src',imageDir + '/' + seq[imageDisplayed] + '.png');
			$('#imgTxtPair').find('h3:first').text(seq[imageDisplayed]);
			$('#imgTxtPair').find('span:first').text(charDefArr[imageDir + '_' + seq[imageDisplayed]]);					
		}
	});
})();