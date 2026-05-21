/* change JS error message to a loading message */
$('#colorPreviewText').html('Loading...');

const isMobileUserAgent = () => {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

if (isMobileUserAgent()) {
	alert("WARNING!\nHueblocks-GTNH is designed for Desktop use.\nMobile use is not supported.\nPlease keep this in mind while using Hueblocks-GTNH.");

}
else {
	//alert("WARNING!\nHueblocks-GTNH is designed for Desktop use.\nMobile use is not supported.\nPlease keep this in mind while using Hueblocks-GTNH.");

}


/* colour picker with gradient preview */
let color1, color2;

function updateColors() {
	color1 = $('#colorSel1').val();
	color2 = $('#colorSel2').val();
	$('#colorPreviewText').html(color1 + '　→　' + color2);
	$('#colorPreview').css({'background': 'linear-gradient(90deg, ' + color1 + ', ' + color2 + ')'});
}

$('#colorSel1,#colorSel2').on('change', () => updateColors());

/* copy colour on right click */
$('#colorBtn1').bind('contextmenu', (cmenu) => {
    cmenu.preventDefault();
	navigator.clipboard.writeText(color1);
	$('#colorPreviewText').html('＊COPIED!＊' + '　→　' + color2);
	setTimeout(() => updateColors(), 500);
});
$('#colorBtn2').bind('contextmenu', (cmenu) => {
    cmenu.preventDefault();
	navigator.clipboard.writeText(color2);
	$('#colorPreviewText').html(color1 + '　→　' + '＊COPIED!＊');
	setTimeout(() => updateColors(), 500);
});





/* random colours */
function rndColors() {
	const hexNums = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'];

	let rndColorValues = ['',''];

	/* count values for color1 and color2 at the same time */
	while (rndColorValues[0].length + rndColorValues[1].length < 12) {
		rndColorValues[0] += hexNums[Math.round( Math.random() * 15 )];
		rndColorValues[1] += hexNums[Math.round( Math.random() * 15 )];
	}
	$('#colorSel1').val('#' + rndColorValues[0]);
	$('#colorSel2').val('#' + rndColorValues[1]);

	updateColors();
}

$('#rndColorsBtn').on('click', () => rndColors());





/* swap colours */
function swapColors() {
	let swapColorsTemp = [color1,color2];

	$('#colorSel1').val(swapColorsTemp[1]);
	$('#colorSel2').val(swapColorsTemp[0]);

	updateColors();
}

$('#swapColorsBtn').on('click', () => swapColors());





/* compact HEX <--> RGB converter I found on stackoverflow */
function hexToRgb(h){return['0x'+h[1]+h[2]|0,'0x'+h[3]+h[4]|0,'0x'+h[5]+h[6]|0]}
function rgbToHex(r,g,b){return"#"+((1<<24)+(r<<16)+(g<<8)+ b).toString(16).slice(1);}





/* calculate steps */
let steps = [], stepLen = 5;

/* change cLenght back to default value */
function cLenghtDefaulter() {
	if ($('#cLenght3').is(':checked')) {
		stepLen = 9;
		$('#cLenght3').prop("checked", false);
		$('#cLenght1').prop("checked", true);
		setTimeout(() => $('#cLenghtBtn3').html('Custom...'), 1);
}}

/* make sure "Custom..." cLenght btn is never selected at start to prevent errors */
cLenghtDefaulter();

/* create a prompt when "Custom..." cLenght btn is clicked */
$('#cLenght3').on('click', () => {
	($('#cLenghtBtn3').html() != "Custom...") ?
		stepLen = prompt('Please enter a custom length (any integer equal or more than 3)', parseInt( $('#cLenghtBtn3').html().replace("Custom (", "").replace(")", "") ))
		: stepLen = prompt('Please enter a custom length (any integer equal or more than 3)', stepLen);

	/* process normal numbers */
	stepLen = parseInt(stepLen);

	/* process amogus */
	if (stepLen == 'amogus' | stepLen == 'sus') {
		alert('OH MY GOD THE CHAIN IS SUS HAHA :D :D LOL AMOGUS MEME SO FUNNY SUS SUS SUSSY LMAO HAHAHAHAHA :DDDDD');
		$("#ggBtn, label, h1, h2, a, em").html("ｓｕｓ");
		cLenghtDefaulter();
	}

	/* process null */
	if (stepLen == null) cLenghtDefaulter();

	/* process invalid non-numeral input values */
	if (isNaN(stepLen)) {
		alert('Enter a NUMBER you goof >_<');
		cLenghtDefaulter();
	}

	/* process invalid numeral input values */
	if (stepLen < 3) {
		alert('The entered number is too small; please enter at least 3 or bigger.');
		stepLen = 3;
	}
	if (stepLen > 999) {
		let stepLenWarning = confirm('Woah! ' + stepLen + ' is a really big number, are you sure your browser can handle it?\n\nPress "OK" to confirm or "Cancel" to change the number to 999.');
		if (stepLenWarning == false) {
			stepLen = 999;
	}}

	/* display value on cLenght button */
	if (Number.isInteger(stepLen) == true) {
		$('#cLenghtBtn3').html('Custom (' + stepLen + ')');

		/* handler for values more than 99999 to be displayed correctly */
		if (stepLen > 99999) {
			$('#cLenghtBtn3').html('Custom (99999+)');
		}
	}
});

/* update steps */
function updateSteps() {
	console.log('[c] Calculating colours for every step... ');

	/* take steps count from non-custom button (must be at least 3, otherwise just makes no sense) */
	if ($('#cLenght1').is(':checked')) stepLen = 9;
	if ($('#cLenght2').is(':checked')) stepLen = 25;
	if ($('#cLenght4').is(':checked')) stepLen = 99;


	/* wipe previous steps */
	steps = [];

	/* the first step is just color1, no need to count it */
	steps.push(hexToRgb(color1));
	for (let bsCnt = 1; bsCnt < stepLen - 1; bsCnt++) {
		/* math sorcery goes here (daaamn i hate math >_<).
		in a nutshell: since we already know first and last steps, we're starting from the second (1) step and counting until the pre-last one (this is why we're substracting 1 from stepLen).

		since every step in a chain as a sum of color1 and color2 in some proportion (i.e. second step in 9-step-long chain has 87.5% of color1 and 12.5% of color2), we can calculate step X's formula as (color1*(L-X) + color2*X); L is the chain length.

		thus, we multiply first colour on its per-step percentage (i.e. 8-1/8 = 7/8 = 0.875) and add to it the second colour multiplied on its per-step percentage (i.e. 1/8 = 0.125). perform this for Red, Green and Blue values and voila! */
		steps.push([
			( hexToRgb(color1)[0] * (((stepLen - 1) - bsCnt) / (stepLen - 1)) )
			+ ( hexToRgb(color2)[0] * (bsCnt / (stepLen - 1)) ),
			( hexToRgb(color1)[1] * (((stepLen - 1) - bsCnt) / (stepLen - 1)) )
			+ ( hexToRgb(color2)[1] * (bsCnt / (stepLen - 1)) ),
			( hexToRgb(color1)[2] * (((stepLen - 1) - bsCnt) / (stepLen - 1)) )
			+ ( hexToRgb(color2)[2] * (bsCnt / (stepLen - 1)) )
		]);
	}
	/* and the last step is just color2, no need to count it either */
	steps.push(hexToRgb(color2));
}





/* block generation */
let stepLeaders = [], stepCount = 0;

function genBlocks() {
	console.log('[g] Starting blocks gradient generation... ');

	/* wipe all the blocks previously visualised if "optRKeep" is NOT enabled */
	if (! $('#optRKeep').is(':checked')) $( ".visImg" ).remove();

	/* wipe previous step leaders */
	stepLeaders = [];

	/* compare all the blocks from list to a given step */
	for (stepCount = 0; stepCount <= (stepLen - 1); stepCount += 1) {
		let currentStep = steps[stepCount], stepLeaderboard = ["missingNo", 0];

		for (let blockCount = blockData.length -1; blockCount >= 0; ) {
			let currentBlock = blockData[blockCount];

			/* count similarity for Red, Green and Blue */
			var calcR = ( 255 - Math.abs(currentStep[0] - currentBlock.rgb[0]) ) / 255,
				calcG = ( 255 - Math.abs(currentStep[1] - currentBlock.rgb[1]) ) / 255,
				calcB = ( 255 - Math.abs(currentStep[2] - currentBlock.rgb[2]) ) / 255;

			/* 0.0 means 'completely opposite colour', 1.0 means 'same colour';
			values <0.8 in 99% of cases are junk */
			var currentComparison = [currentBlock.id, (calcR + calcG + calcB) / 3];

			blockCount -= 1;

			/* update the "leaderboard" if results are higher than previous */
			if (currentComparison[1] > stepLeaderboard[1]) stepLeaderboard = currentComparison;
		}

	/* write current step leader to a corresponding stepLeaderX variable */
	stepLeaders.push(stepLeaderboard[0]);
	//console.log('[g -- step ' + stepCount + '] AAAND THE WINNER IS "' + stepLeaders[stepCount] + '" !!!');

	/* check for duplicates if "optNodub" is enabled and visualise block */
	if ($('#optNodub').is(':checked') && stepCount > 0)
		{ if (stepLeaders[stepCount] != stepLeaders[stepCount -1]) blockVis(); }
		else blockVis();
	}
	console.log('[v] Blocks gradient visualised.');
}





/* block visualisation */
function blockVis() {
	let stepVis = $('<img class="visImg" onclick="$(this).hide(200);" onmouseover="showPopup(this);" onmouseout="hidePopup(this);">');
	const id = stepLeaders[stepCount];
	const item = blockData.find(i => i.id === id.replace(".png"));
	//Yes we have to do this terribly, yes it'll probally get slower as more mods are added
	//I don't care, it works
	//vanilla
	if ($('#blocksPresetDD').val() == 'blocks_vanilla') {
		
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset + '/' + stepLeaders[stepCount]);
	}
	//biomes o plenty
	if ($('#blocksPresetDD').val() == 'blocks_biomes_o_plenty') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_biomes_o_plenty + '/' + stepLeaders[stepCount]);
	}
	//Ztones
	if ($('#blocksPresetDD').val() == 'blocks_Ztones') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Ztones+ '/' + stepLeaders[stepCount]);
	}
	//all
	if ($('#blocksPresetDD').val() == 'blocks_all') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_all+ '/' + stepLeaders[stepCount]);
	}
	//chisel
	if ($('#blocksPresetDD').val() == 'blocks_chisel') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_chisel+ '/' + stepLeaders[stepCount]);
	}
	//et fut base
	if ($('#blocksPresetDD').val() == 'blocks_et_futurum_requiem_base') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_et_futurum_requiem_base+ '/' + stepLeaders[stepCount]);
	}
	//et fut matal barrels
	if ($('#blocksPresetDD').val() == 'blocks_et_futurum_requiem_metal_barrels') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_et_futurum_requiem_metal_barrels+ '/' + stepLeaders[stepCount]);
	}
	//natura
	if ($('#blocksPresetDD').val() == 'blocks_natura') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_natura+ '/' + stepLeaders[stepCount]);
	}
	//witchery
	if ($('#blocksPresetDD').val() == 'blocks_witchery') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_witchery+ '/' + stepLeaders[stepCount]);
	}
	//witchery
	if ($('#blocksPresetDD').val() == 'blocks_tinkers_construct') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_tinkers_construct+ '/' + stepLeaders[stepCount]);
	}
	//extra utilities
	if ($('#blocksPresetDD').val() == 'blocks_extra_utilities') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_extra_utilities + '/' + stepLeaders[stepCount]);
	}
	//botania
	if ($('#blocksPresetDD').val() == 'blocks_botania') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_botania+ '/' + stepLeaders[stepCount]);
	}
	//project_red_exploration
	if ($('#blocksPresetDD').val() == 'blocks_project_red_exploration') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_project_red_exploration+ '/' + stepLeaders[stepCount]);
	}
	//thaumcraft
	if ($('#blocksPresetDD').val() == 'blocks_thaumcraft') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_thaumcraft+ '/' + stepLeaders[stepCount]);
	}
	//Amun-Ra
	if ($('#blocksPresetDD').val() == 'Blocks_Amun_Ra') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Amun_Ra+ '/' + stepLeaders[stepCount]);
	}
	//Applied_Energistics_2
	if ($('#blocksPresetDD').val() == 'Blocks_Applied_Energistics_2') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Applied_Energistics_2+ '/' + stepLeaders[stepCount]);
	}
	//Automagy
	if ($('#blocksPresetDD').val() == 'Blocks_Automagy') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Automagy+ '/' + stepLeaders[stepCount]);
	}
	//Avaritia
	if ($('#blocksPresetDD').val() == 'Blocks_Avaritia') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Avaritia+ '/' + stepLeaders[stepCount]);
	}
	//BartWorks
	if ($('#blocksPresetDD').val() == 'Blocks_BartWorks') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_BartWorks+ '/' + stepLeaders[stepCount]);
	}
	//Blood_Magic
	if ($('#blocksPresetDD').val() == 'Blocks_Blood_Magic') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Blood_Magic+ '/' + stepLeaders[stepCount]);
	}
	//Botany
	if ($('#blocksPresetDD').val() == 'Blocks_Botany') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Botany+ '/' + stepLeaders[stepCount]);
	}
	//Cooking_For_Blockheads
	if ($('#blocksPresetDD').val() == 'Blocks_Cooking_For_Blockheads') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Cooking_For_Blockheads+ '/' + stepLeaders[stepCount]);
	}
	//Draconic_Evolution
	if ($('#blocksPresetDD').val() == 'Blocks_Draconic_Evolution') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Draconic_Evolution+ '/' + stepLeaders[stepCount]);
	}
	//Ender_IO
	if ($('#blocksPresetDD').val() == 'Blocks_Ender_IO') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Ender_IO+ '/' + stepLeaders[stepCount]);
	}
	//Forbidden_Magic
	if ($('#blocksPresetDD').val() == 'Blocks_Forbidden_Magic') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Forbidden_Magic+ '/' + stepLeaders[stepCount]);
	}
	//Forestry
	if ($('#blocksPresetDD').val() == 'Blocks_Forestry') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Forestry+ '/' + stepLeaders[stepCount]);
	}
	//Galacticraft_Asteroids
	if ($('#blocksPresetDD').val() == 'Blocks_Galacticraft_Asteroids') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Galacticraft_Asteroids+ '/' + stepLeaders[stepCount]);
	}
	//Galacticraft_Core
	if ($('#blocksPresetDD').val() == 'Blocks_Galacticraft_Core') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Galacticraft_Core+ '/' + stepLeaders[stepCount]);
	}
	//Galacticraft_Mars
	if ($('#blocksPresetDD').val() == 'Blocks_Galacticraft_Mars') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Galacticraft_Mars+ '/' + stepLeaders[stepCount]);
	}
	//Galacticraft_Moon
	if ($('#blocksPresetDD').val() == 'Blocks_Galacticraft_Moon') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Galacticraft_Moon+ '/' + stepLeaders[stepCount]);
	}
	//Galaxy_Space
	if ($('#blocksPresetDD').val() == 'Blocks_Galaxy_Space') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Galaxy_Space+ '/' + stepLeaders[stepCount]);
	}//GT_New_Horizons_Core_Mod
	if ($('#blocksPresetDD').val() == 'Blocks_GT_New_Horizons_Core_Mod') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_GT_New_Horizons_Core_Mod+ '/' + stepLeaders[stepCount]);
	}
	//Hardcore_Ender_Expansion
	if ($('#blocksPresetDD').val() == 'Blocks_Hardcore_Ender_Expansion') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Hardcore_Ender_Expansion+ '/' + stepLeaders[stepCount]);
	}
	//IndustrialCraft_2
	if ($('#blocksPresetDD').val() == 'Blocks_IndustrialCraft_2') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_IndustrialCraft_2+ '/' + stepLeaders[stepCount]);
	}
	//LootGames
	if ($('#blocksPresetDD').val() == 'Blocks_LootGames') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_LootGames+ '/' + stepLeaders[stepCount]);
	}
	//Magic_Bees
	if ($('#blocksPresetDD').val() == 'Blocks_Magic_Bees') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Magic_Bees+ '/' + stepLeaders[stepCount]);
	}
	//Open_Modular_Turrets
	if ($('#blocksPresetDD').val() == 'Blocks_Open_Modular_Turrets') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Open_Modular_Turrets+ '/' + stepLeaders[stepCount]);
	}
	//Pams_Harvest_The_Nether
	if ($('#blocksPresetDD').val() == 'Blocks_Pams_Harvest_The_Nether') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Pams_Harvest_The_Nether+ '/' + stepLeaders[stepCount]);
	}
	//Railcraft
	if ($('#blocksPresetDD').val() == 'Blocks_Railcraft') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Railcraft+ '/' + stepLeaders[stepCount]);
	}
	//Random_things
	if ($('#blocksPresetDD').val() == 'Blocks_Random_Things') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Random_Things+ '/' + stepLeaders[stepCount]);
	}
	//SG_Craft
	if ($('#blocksPresetDD').val() == 'Blocks_SG_Craft') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_SG_Craft+ '/' + stepLeaders[stepCount]);
	}
	//Tainted_Magic
	if ($('#blocksPresetDD').val() == 'Blocks_Tainted_Magic') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Tainted_Magic+ '/' + stepLeaders[stepCount]);
	}
	//Thaumic_Bases
	if ($('#blocksPresetDD').val() == 'Blocks_Thaumic_Bases') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Thaumic_Bases+ '/' + stepLeaders[stepCount]);
	}
	//Thaumic_Horizons
	if ($('#blocksPresetDD').val() == 'Blocks_Thaumic_Horizons') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Thaumic_Horizons+ '/' + stepLeaders[stepCount]);
	}
	//Thaumic_Tinkerer
	if ($('#blocksPresetDD').val() == 'Blocks_Thaumic_Tinkerer') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Thaumic_Tinkerer+ '/' + stepLeaders[stepCount]);
	}
	//Tinkers_Defence
	if ($('#blocksPresetDD').val() == 'Blocks_Tinkers_Defence') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Tinkers_Defence+ '/' + stepLeaders[stepCount]);
	}
	//Twilight_Forest
	if ($('#blocksPresetDD').val() == 'Blocks_Twilight_Forest') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Twilight_Forest+ '/' + stepLeaders[stepCount]);
	}
	//Witching_Gadgets
	if ($('#blocksPresetDD').val() == 'Blocks_Witching_Gadgets') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_Witching_Gadgets+ '/' + stepLeaders[stepCount]);
	}




/* template for new mods, replace *MOD* with chosen mod name
if ($('#blocksPresetDD').val() == 'blocks_*MOD*') {
		stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset_*MOD*+ '/' + stepLeaders[stepCount]);
	}
*/


	stepVis.attr('blockname', stepLeaders[stepCount].replace('.png', '').replace(/[-._]/g, ' '));
	stepVis.css({'width': visSize + 'px', 'height': visSize + 'px'});

	stepVis.appendTo('#visResult');
}





/* visualisation upscale/downscale buttons */
let visSize = 64;

$('#visDownscale').on('click', () => { if (visSize > 16) {
	visSize /= 2;
	$('.visImg').css({'width': visSize + 'px', 'height': visSize + 'px'})
}});
$('#visUpscale').on('click', () => { if (visSize < 256) {
	visSize /= 0.5;
	$('.visImg').css({'width': visSize + 'px', 'height': visSize + 'px'})
}});

/* update and show popup when block is hovered */
function showPopup(block) {
	$('#visPopup').html($(block).attr('blockname'));
	$('#visPopup').css('left', block.x + 4).css('top', block.y + 4);
	$('#visPopup').show();
}

/* hide popup when block is not hovered */
function hidePopup() {
	$('#visPopup').html('MissingNo');
	$('#visPopup').hide();
}




/* default values for block types and data */
//vanilla
var blockset = 'blocks_vanilla';
var blockData = eval('blocks_vanilla');
var presetsLocation = eval('palettes');
//Biomes O Plenty
var blockset_biomes_o_plenty = 'blocks_biomes_o_plenty';
var blockData_biomes_o_plenty = eval('blocks_biomes_o_plenty');
//Ztones
var blockset_Ztones = 'blocks_Ztones';
var blockData_Ztones = eval('blocks_Ztones');
//all
var blockset_all = 'blocks_all';
var blockData_all = eval('blocks_all');
//chisel
var blockset_chisel = 'blocks_chisel';
var blockData_chisel = eval('blocks_chisel')
//et fut base
var blockset_et_futurum_requiem_base = 'blocks_et_futurum_requiem_base';
var blockData_et_futurum_requiem_base = eval('blocks_et_futurum_requiem_base');
//et fut metal battels
var blockset_et_futurum_requiem_metal_barrels = 'blocks_et_futurum_requiem_metal_barrels';
var blockData_et_futurum_requiem_metal_barrels = eval('blocks_et_futurum_requiem_metal_barrels');
//Natura
var blockset_natura = 'blocks_natura';
var blockData_natura = eval('blocks_natura');
//witchery
var blockset_witchery = 'blocks_witchery';
var blockData_witchery = eval('blocks_witchery');
//tinkers constuct
var blockset_tinkers_construct = 'blocks_tinkers_construct';
var blockData_tinkers_construct = eval('blocks_tinkers_construct');
//extra utilities
var blockset_extra_utilities = 'blocks_extra_utilities';
var blockData_extra_utilities = eval('blocks_extra_utilities');
//botania
var blockset_botania = 'blocks_botania';
var blockData_botania = eval('blocks_botania');
//project_red_exploration
var blockset_project_red_exploration = 'blocks_project_red_exploration';
var blockData_project_red_exploration = eval('blocks_project_red_exploration');
//thaumcraft
var blockset_thaumcraft = 'blocks_thaumcraft';
var blockData_thaumcraft = eval('blocks_thaumcraft');
//Amun-Ra
var blockset_Amun_Ra = 'Blocks_Amun_Ra';
var blockData_Amun_Ra = eval('Blocks_Amun_Ra');
//Applied Energistics 2
var blockset_Applied_Energistics_2 = 'Blocks_Applied_Energistics_2';
var blockData_Applied_Energistics_2 = eval('Blocks_Applied_Energistics_2');
//Automagy
var blockset_Automagy = 'Blocks_Automagy';
var blockData_Automagy = eval('Blocks_Automagy');
//Avaritia
var blockset_Avaritia = 'Blocks_Avaritia';
var blockData_Avaritia = eval('Blocks_Avaritia');
//BartWorks
var blockset_BartWorks = 'Blocks_BartWorks';
var blockData_BartWorks = eval('Blocks_BartWorks');
//Blood Magic
var blockset_Blood_Magic = 'Blocks_Blood_Magic';
var blockData_Blood_Magic = eval('Blocks_Blood_Magic');
//Botany
var blockset_Botany = 'Blocks_Botany';
var blockData_Botany = eval('Blocks_Botany');
//Cooking For Blockheads
var blockset_Cooking_For_Blockheads = 'Blocks_Cooking_For_Blockheads';
var blockData_Cooking_For_Blockheads = eval('Blocks_Cooking_For_Blockheads');
//Draconic Evolution
var blockset_Draconic_Evolution = 'Blocks_Draconic_Evolution';
var blockData_Draconic_Evolution = eval('Blocks_Draconic_Evolution');
//Ender IO
var blockset_Ender_IO = 'Blocks_Ender_IO';
var blockData_Ender_IO = eval('Blocks_Ender_IO');
//Forbidden Magic
var blockset_Forbidden_Magic = 'Blocks_Forbidden_Magic';
var blockData_Forbidden_magic = eval('Blocks_Forbidden_Magic');
//Forestry
var blockset_Forestry = 'Blocks_Forestry';
var blockData_Forestry = eval('Blocks_Forestry');
//Galacticraft_Asteroids
var blockset_Galacticraft_Asteroids = 'Blocks_Galacticraft_Asteroids';
var blockData_Galacticraft_Asteroids = eval('Blocks_Galacticraft_Asteroids');
//Galacticraft_Core
var blockset_Galacticraft_Core = 'Blocks_Galacticraft_Core';
var blockData_Galacticraft_Core = eval('Blocks_Galacticraft_Core');
//Galacticraft_Mars
var blockset_Galacticraft_Mars = 'Blocks_Galacticraft_Mars';
var blockData_Galacticraft_Mars = eval('Blocks_Galacticraft_Mars');
//Galacticraft_Moon
var blockset_Galacticraft_Moon = 'Blocks_Galacticraft_Moon';
var blockData_Galacticraft_Moon = eval('Blocks_Galacticraft_Moon');
//Galaxy_Space
var blockset_Galaxy_Space = 'Blocks_Galaxy_Space';
var blockData_Galaxy_Space = eval('Blocks_Galaxy_Space');
//GT_New_Horizons_Core_Mod
var blockset_GT_New_Horizons_Core_Mod = 'Blocks_GT_New_Horizons_Core_Mod';
var blockData_GT_New_Horizons_Core_Mod = eval('Blocks_GT_New_Horizons_Core_Mod');
//Hardcore_Ender_Expansion
var blockset_Hardcore_Ender_Expansion = 'Blocks_Hardcore_Ender_Expansion';
var blockData_Hardcore_Ender_Expansion = eval('Blocks_Hardcore_Ender_Expansion');
//IndustrialCraft_2
var blockset_IndustrialCraft_2 = 'Blocks_IndustrialCraft_2';
var blockData_IndustrialCraft_2 = eval('Blocks_IndustrialCraft_2');
//LootGames
var blockset_LootGames = 'Blocks_LootGames';
var blockData_LootGames = eval('Blocks_LootGames');
//Magic_Bees
var blockset_Magic_Bees = 'Blocks_Magic_Bees';
var blockData_Magic_Bees = eval('Blocks_Magic_Bees');
//Open_Modular_Turrets
var blockset_Open_Modular_Turrets = 'Blocks_Open_Modular_Turrets';
var blockData_Open_Modular_Turrets = eval('Blocks_Open_Modular_Turrets');
//Pams_Harvest_The_Nether
var blockset_Pams_Harvest_The_Nether = 'Blocks_Pams_Harvest_The_Nether';
var blockData_Pams_Harvest_The_Nether = eval('Blocks_Pams_Harvest_The_Nether');
//Railcraft
var blockset_Railcraft = 'Blocks_Railcraft';
var blockData_Railcraft = eval('Blocks_Railcraft');
//Random_Things
var blockset_Random_Things = 'Blocks_Random_Things';
var blockData_Random_Things = eval('Blocks_Random_Things');
//SG_Craft
var blockset_SG_Craft = 'Blocks_SG_Craft';
var blockData_SG_Craft = eval('Blocks_SG_Craft');
//Tainted_magic
var blockset_Tainted_Magic = 'Blocks_Tainted_Magic';
var blockData_Tainted_Magic = eval('Blocks_Tainted_Magic');
//Thaumic_Bases
var blockset_Thaumic_Bases = 'Blocks_Thaumic_Bases';
var blockData_Thaumic_Bases = eval('Blocks_Thaumic_Bases');
//Thaumic_Horizons
var blockset_Thaumic_Horizons = 'Blocks_Thaumic_Horizons';
var blockData_Thaumic_Horizons = eval('Blocks_Thaumic_Horizons');
//Thaumic_Tinkerer
var blockset_Thaumic_Tinkerer = 'Blocks_Thaumic_Tinkerer';
var blockData_Thaumic_Tinkerer = eval('Blocks_Thaumic_Tinkerer');
//Tinkers_Defence
var blockset_Tinkers_Defence = 'Blocks_Tinkers_Defence';
var blockData_Tinkers_Defence = eval('Blocks_Tinkers_Defence');
//Twilight_Forest
var blockset_Twilight_Forest = 'Blocks_Twilight_Forest';
var blockData_Twilight_Forest = eval('Blocks_Twilight_Forest');
//Witching_Gadgets
var blockset_Witching_Gadgets = 'Blocks_Witching_Gadgets';
var blockData_Witching_Gadgets = eval('Blocks_Witching_Gadgets');



/* template for new blockset and blockData, replace *MOD* with chosen mod name
var blockset_*MOD* = 'blocks_*MOD*';
var blockData_*MOD* = eval('blocks_*MOD*');
*/

/* palettes importer */
function presetImport() {
	/* wipe previous palettes */
	$("option").remove();
	//all
	if (blockset_all == 'blocks_all') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'blocks_all',
				text: 'All Blocks'
		}));
	$('#blocksPresetDD').val('blocks_all');
	blockData_all = eval( $('#blocksPresetDD').val() );
	}
	//vanilla
	if (blockset == 'blocks_vanilla') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'blocks_vanilla',
				text: 'Vanilla Blocks'
		}));
	$('#blocksPresetDD').val('blocks_vanilla');
	blockData = eval( $('#blocksPresetDD').val() );
	}
	//biomes o plenty
	if (blockset_biomes_o_plenty == 'blocks_biomes_o_plenty') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'blocks_biomes_o_plenty',
				text: 'Biomes o Plenty'
		}));
	$('#blocksPresetDD').val('blocks_biomes_o_plenty');
	blockData_biomes_o_plenty = eval( $('#blocksPresetDD').val() );
	}
	//Ztones
	if (blockset_Ztones == 'blocks_Ztones') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'blocks_Ztones',
				text: 'Ztones'
		}));
	$('#blocksPresetDD').val('blocks_Ztones');
	blockData_Ztones = eval( $('#blocksPresetDD').val() );
	}
	//chisel
	if (blockset_chisel == 'blocks_chisel') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'blocks_chisel',
				text: 'Chisel'
		}));
	$('#blocksPresetDD').val('blocks_chisel');
	blockData_chisel = eval( $('#blocksPresetDD').val() );
	}
	//et fut base
	if (blockset_et_futurum_requiem_base == 'blocks_et_futurum_requiem_base') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'blocks_et_futurum_requiem_base',
				text: 'Et Futurum Requiem'
			}));
		$('#blocksPresetDD').val('blocks_et_futurum_requiem_base');
		blockData_et_futurum_requiem_base = eval( $('#blocksPresetDD').val() );
	}
	//et fut metal barrels
	if (blockset_et_futurum_requiem_metal_barrels == 'blocks_et_futurum_requiem_metal_barrels') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'blocks_et_futurum_requiem_metal_barrels',
				text: 'Et Futurum Requiem Metal Barrels'
			}));
		$('#blocksPresetDD').val('blocks_et_futurum_requiem_metal_barrels');
		blockData_et_futurum_requiem_base = eval( $('#blocksPresetDD').val() );
	}
	//Natura
	if (blockset_natura == 'blocks_natura') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'blocks_natura',
				text: 'Natura'
			}));
		$('#blocksPresetDD').val('blocks_natura');
		blockData_natura = eval( $('#blocksPresetDD').val() );
	}
	//witchery
	if (blockset_witchery == 'blocks_witchery') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'blocks_witchery',
				text: 'Witchery'
			}));
		$('#blocksPresetDD').val('blocks_witchery');
		blockData_witchery = eval( $('#blocksPresetDD').val() );
	}
	//tinkers construct
	if (blockset_tinkers_construct == 'blocks_tinkers_construct') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'blocks_tinkers_construct',
				text: 'Tinkers Construct'
			}));
		$('#blocksPresetDD').val('blocks_tinkers_construct');
		blockData_tinkers_construct = eval( $('#blocksPresetDD').val() );
	}
	//extra utilities
	if (blockset_extra_utilities == 'blocks_extra_utilities') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'blocks_extra_utilities',
				text: 'Extra Utilities'
			}));
		$('#blocksPresetDD').val('blocks_extra_utilities');
		blockData_extra_utilities = eval( $('#blocksPresetDD').val() );
	}
	//botania
	if (blockset_botania == 'blocks_botania') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'blocks_botania',
				text: 'Botania'
			}));
		$('#blocksPresetDD').val('blocks_botania');
		blockData_botania = eval( $('#blocksPresetDD').val() );
	}
	//project_red_exploration
	if (blockset_project_red_exploration == 'blocks_project_red_exploration') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'blocks_project_red_exploration',
				text: 'Project Red: Exploration'
			}));
		$('#blocksPresetDD').val('blocks_project_red_exploration');
		blockData_project_red_exploration = eval( $('#blocksPresetDD').val() );
	}
	//thaumcraft
	if (blockset_thaumcraft == 'blocks_thaumcraft') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'blocks_thaumcraft',
				text: 'Thaumcraft'
			}));
		$('#blocksPresetDD').val('blocks_thaumcraft');
		blockData_thaumcraft = eval( $('#blocksPresetDD').val() );
	}
	//Amun-Ra
	if (blockset_Amun_Ra == 'Blocks_Amun_Ra') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Amun_Ra',
				text: 'Amun-Ra'
			}));
		$('#blocksPresetDD').val('Blocks_Amun_Ra');
		blockData_Amun_Ra = eval( $('#blocksPresetDD').val() );
	}
	//Applied_Energistics_2
	if (blockset_Applied_Energistics_2 == 'Blocks_Applied_Energistics_2') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Applied_Energistics_2',
				text: 'Applied Energistics 2'
			}));
		$('#blocksPresetDD').val('Blocks_Applied_Energistics_2');
		blockData_Applied_Energistics_2 = eval( $('#blocksPresetDD').val() );
	}
	//Automagy
	if (blockset_Automagy == 'Blocks_Automagy') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Automagy',
				text: 'Automagy'
			}));
		$('#blocksPresetDD').val('Blocks_Automagy');
		blockData_Automagy = eval( $('#blocksPresetDD').val() );
	}
	//Avaritia
	if (blockset_Avaritia == 'Blocks_Avaritia') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Avaritia',
				text: 'Avaritia'
			}));
		$('#blocksPresetDD').val('Blocks_Avaritia');
		blockData_Avaritia = eval( $('#blocksPresetDD').val() );
	}
	//BartWorks
	if (blockset_BartWorks == 'Blocks_BartWorks') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_BartWorks',
				text: 'BartWorks'
			}));
		$('#blocksPresetDD').val('Blocks_BartWorks');
		blockData_BartWorks = eval( $('#blocksPresetDD').val() );
	}
	//Blood_Magic
	if (blockset_Blood_Magic == 'Blocks_Blood_Magic') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Blood_Magic',
				text: 'Blood Magic'
			}));
		$('#blocksPresetDD').val('Blocks_Blood_Magic');
		blockData_Blood_Magic = eval( $('#blocksPresetDD').val() );
	}
	//Botany
	if (blockset_Botany == 'Blocks_Botany') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Botany',
				text: 'Botany'
			}));
		$('#blocksPresetDD').val('Blocks_Botany');
		blockData_Botany = eval( $('#blocksPresetDD').val() );
	}
	//Cooking_For_Blockheads
	if (blockset_Cooking_For_Blockheads == 'Blocks_Cooking_For_Blockheads') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Cooking_For_Blockheads',
				text: 'Cooking for Blockheads'
			}));
		$('#blocksPresetDD').val('Blocks_Cooking_For_Blockheads');
		blockData_Cooking_For_Blockheads = eval( $('#blocksPresetDD').val() );
	}
	//Draconic_Evolution
	if (blockset_Draconic_Evolution == 'Blocks_Draconic_Evolution') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Draconic_Evolution',
				text: 'Draconic Evolution'
			}));
		$('#blocksPresetDD').val('Blocks_Draconic_Evolution');
		blockData_Draconic_Evolution = eval( $('#blocksPresetDD').val() );
	}
	//Ender_IO
	if (blockset_Ender_IO == 'Blocks_Ender_IO') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Ender_IO',
				text: 'Ender IO'
			}));
		$('#blocksPresetDD').val('Blocks_Ender_IO');
		blockData_Ender_IO = eval( $('#blocksPresetDD').val() );
	}
	//Forbidden_Magic
	if (blockset_Forbidden_Magic == 'Blocks_Forbidden_Magic') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Forbidden_Magic',
				text: 'Forbidden Magic'
			}));
		$('#blocksPresetDD').val('Blocks_Forbidden_Magic');
		blockData_Forbidden_Magic = eval( $('#blocksPresetDD').val() );
	}
	//Forestry
	if (blockset_Forestry == 'Blocks_Forestry') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Forestry',
				text: 'Forestry'
			}));
		$('#blocksPresetDD').val('Blocks_Forestry');
		blockData_Forestry = eval( $('#blocksPresetDD').val() );
	}

	//Galacticraft_Asteroids
	if (blockset_Galacticraft_Asteroids == 'Blocks_Galacticraft_Asteroids') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Galacticraft_Asteroids',
				text: 'Galacticraft Asteroids'
			}));
		$('#blocksPresetDD').val('Blocks_Galacticraft_Asteroids');
		blockData_Galacticraft_Asteroids = eval( $('#blocksPresetDD').val() );
	}
	//Galacticraft_Core
	if (blockset_Galacticraft_Core == 'Blocks_Galacticraft_Core') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Galacticraft_Core',
				text: 'Galacticraft Core'
			}));
		$('#blocksPresetDD').val('Blocks_Galacticraft_Core');
		blockData_Galacticraft_Core = eval( $('#blocksPresetDD').val() );
	}
	//Galacticraft_Mars
	if (blockset_Galacticraft_Mars == 'Blocks_Galacticraft_Mars') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Galacticraft_Mars',
				text: 'Galacticraft Mars'
			}));
		$('#blocksPresetDD').val('Blocks_Galacticraft_Mars');
		blockData_Galacticraft_Mars = eval( $('#blocksPresetDD').val() );
	}
	//Galacticraft_Moon
	if (blockset_Galacticraft_Moon == 'Blocks_Galacticraft_Moon') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Galacticraft_Moon',
				text: 'Galacticraft Moon'
			}));
		$('#blocksPresetDD').val('Blocks_Galacticraft_Moon');
		blockData_Galacticraft_Moon = eval( $('#blocksPresetDD').val() );
	}
	//Galaxy_Space
	if (blockset_Galaxy_Space == 'Blocks_Galaxy_Space') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Galaxy_Space',
				text: 'Galaxy Space'
			}));
		$('#blocksPresetDD').val('Blocks_Galaxy_Space');
		blockData_Galaxy_Space = eval( $('#blocksPresetDD').val() );
	}
	//GT_New_Horizons_Core_Mod
	if (blockset_GT_New_Horizons_Core_Mod == 'Blocks_GT_New_Horizons_Core_Mod') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_GT_New_Horizons_Core_Mod',
				text: 'GT: New Horizons Core Mod'
			}));
		$('#blocksPresetDD').val('Blocks_GT_New_Horizons_Core_Mod');
		blockData_GT_New_Horizons_Core_Mod = eval( $('#blocksPresetDD').val() );
	}
	//Hardcore_Ender_Expansion
	if (blockset_Hardcore_Ender_Expansion == 'Blocks_Hardcore_Ender_Expansion') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Hardcore_Ender_Expansion',
				text: 'Hardcore Ender Expansion'
			}));
		$('#blocksPresetDD').val('Blocks_Hardcore_Ender_Expansion');
		blockData_Hardcore_Ender_Expansion = eval( $('#blocksPresetDD').val() );
	}
	//IndustrialCraft_2
	if (blockset_IndustrialCraft_2 == 'Blocks_IndustrialCraft_2') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_IndustrialCraft_2',
				text: 'IndustrialCraft 2'
			}));
		$('#blocksPresetDD').val('Blocks_IndustrialCraft_2');
		blockData_IndustrialCraft_2 = eval( $('#blocksPresetDD').val() );
	}
	//LootGames
	if (blockset_LootGames == 'Blocks_LootGames') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_LootGames',
				text: 'LootGames'
			}));
		$('#blocksPresetDD').val('Blocks_LootGames');
		blockData_LootGames = eval( $('#blocksPresetDD').val() );
	}
	//Magic_Bees
	if (blockset_Magic_Bees == 'Blocks_Magic_Bees') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Magic_Bees',
				text: 'Magic Bees'
			}));
		$('#blocksPresetDD').val('Blocks_Magic_Bees');
		blockData_Magic_Bees = eval( $('#blocksPresetDD').val() );
	}
	//Open_Modular_Turrets
	if (blockset_Open_Modular_Turrets == 'Blocks_Open_Modular_Turrets') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Open_Modular_Turrets',
				text: 'Open Modular Turrets'
			}));
		$('#blocksPresetDD').val('Blocks_Open_Modular_Turrets');
		blockData_Open_Modular_Turrets = eval( $('#blocksPresetDD').val() );
	}
	//Pams_Harvest_The_Nether
	if (blockset_Pams_Harvest_The_Nether == 'Blocks_Pams_Harvest_The_Nether') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Pams_Harvest_The_Nether',
				text: 'Pams Harvest The Nether'
			}));
		$('#blocksPresetDD').val('Blocks_Pams_Harvest_The_Nether');
		blockData_Pams_Harvest_The_Nether = eval( $('#blocksPresetDD').val() );
	}
	//Railcraft
	if (blockset_Railcraft == 'Blocks_Railcraft') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Railcraft',
				text: 'Railcraft'
			}));
		$('#blocksPresetDD').val('Blocks_Railcraft');
		blockData_Railcraft = eval( $('#blocksPresetDD').val() );
	}
	//Random_Things
	if (blockset_Random_Things == 'Blocks_Random_Things') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Random_Things',
				text: 'Random Things'
			}));
		$('#blocksPresetDD').val('Blocks_Random_Things');
		blockData_Random_Things = eval( $('#blocksPresetDD').val() );
	}
	//SG_Craft
	if (blockset_SG_Craft == 'Blocks_SG_Craft') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_SG_Craft',
				text: 'SG Craft (StarGate Craft)'
			}));
		$('#blocksPresetDD').val('Blocks_SG_Craft');
		blockData_SG_Craft = eval( $('#blocksPresetDD').val() );
	}
	//Tainted_Magic
	if (blockset_Tainted_Magic == 'Blocks_Tainted_Magic') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Tainted_Magic',
				text: 'Tainted Magic'
			}));
		$('#blocksPresetDD').val('Blocks_Tainted_Magic');
		blockData_Tainted_Magic = eval( $('#blocksPresetDD').val() );
	}
	//Thaumic_Bases
	if (blockset_Thaumic_Bases == 'Blocks_Thaumic_Bases') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Thaumic_Bases',
				text: 'Thaumic Bases'
			}));
		$('#blocksPresetDD').val('Blocks_Thaumic_Bases');
		blockData_Thaumic_Bases = eval( $('#blocksPresetDD').val() );
	}
	//Thaumic_Horizons
	if (blockset_Thaumic_Horizons == 'Blocks_Thaumic_Horizons') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Thaumic_Horizons',
				text: 'Thaumic Horizons'
			}));
		$('#blocksPresetDD').val('Blocks_Thaumic_Horizons');
		blockData_Thaumic_Horizons = eval( $('#blocksPresetDD').val() );
	}
	//Thaumic_Tinkerer
	if (blockset_Thaumic_Tinkerer == 'Blocks_Thaumic_Tinkerer') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Thaumic_Tinkerer',
				text: 'Thaumic Tinkerer'
			}));
		$('#blocksPresetDD').val('Blocks_Thaumic_Tinkerer');
		blockData_Thaumic_Tinkerer = eval( $('#blocksPresetDD').val() );
	}
	//Tinkers_Defence
	if (blockset_Tinkers_Defence == 'Blocks_Tinkers_Defence') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Tinkers_Defence',
				text: 'Tinkers Defence'
			}));
		$('#blocksPresetDD').val('Blocks_Tinkers_Defence');
		blockData_Tinkers_Defence = eval( $('#blocksPresetDD').val() );
	}
	//Twilight_Forest
	if (blockset_Twilight_Forest == 'Blocks_Twilight_Forest') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Twilight_Forest',
				text: 'Twilight Forest'
			}));
		$('#blocksPresetDD').val('Blocks_Twilight_Forest');
		blockData_Twilight_Forest = eval( $('#blocksPresetDD').val() );
	}
	//Witching_Gadgets
	if (blockset_Witching_Gadgets == 'Blocks_Witching_Gadgets') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'Blocks_Witching_Gadgets',
				text: 'Witching Gadgets'
			}));
		$('#blocksPresetDD').val('Blocks_Witching_Gadgets');
		blockData_Witching_Gadgets = eval( $('#blocksPresetDD').val() );
	}




/* template, replace *MOD* with chosen mod name
	if (blockset_*MOD* == 'blocks_*MOD*') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'blocks_*MOD*',
				text: '*MOD*'
		}));
	$('#blocksPresetDD').val('blocks_*MOD*');
	blockData_*MOD* = eval( $('#blocksPresetDD').val() );
	}
*/


	var presetImporter = 0;

	presetDefaulter();
// disabled cause it'll cause too much block loading and will rate limit the user. also it only gets vanilla textures.
	/* while (presetImporter < presetsLocation.length) {

		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: presetsLocation[presetImporter]['value'],
				text: presetsLocation[presetImporter]['text']
			}));
		presetImporter += 1;
	}
*/
}
presetImport();

/* palette selector */
$('#blocksPresetDD').change( () => {
	if (!$('#blocksPresetDD').val().includes("custom")) {
		console.log(`[p] Changed preset to "${$('#blocksPresetDD').val()}"`);
		blockData = eval( $('#blocksPresetDD').val() );
}});

/* palette defaulter */
function presetDefaulter() {
	blockset == 'blocks_all' ? $('#blocksPresetDD').val('blocks_all') : $('#blocksPresetDD').val('blocks_all');
	blockData = eval( $('#blocksPresetDD').val() );
	if (blockset == 'blocks_all') presetsLocation = eval('palettes');
}





/* сustom blocksets (a huge thanks to @NobUwU for implementing this) */
const tempCanvas = document.createElement("canvas");

/* create temp canvas */
const tempContext = tempCanvas.getContext('2d');
//console.log('[b] Temporary context created');

function readFile(file) {
	return new Promise((r,j) => {
		const reader = new FileReader();
		reader.onload = function(e) { r(e) };
		reader.onerror = function(e) { j(e) };
		reader.readAsDataURL(file);
	});
}

let customBlocksetTemp = [], customBlockset = [];
async function onDirectoryChange(d) {
	/**
	 * @type {File[]}
	 */
	const files = Array.from(d.files).filter(i => /(image\/png|image\/jpeg)/.test(i.type) && !i.type.includes("gif"));

	if (!files.length) return;
	else {
		/* wipe current blockset only if at least 1 image was uploaded */
		if ($('#CBCustomBlocks').html() == []) { 
			//console.log('[b] Custom blockset wiped successfully.'); 
			blockData = [], customBlockset = []; 
		}

		async function wait(ms) {
			return new Promise((r) => setTimeout(() => r(), ms));
		}

		for (const file of files) {
			try {
				/* await read file */
				const f = await readFile(file);

				/* use base64 data to create new image */
				const image = new Image();
				image.src = f.target.result;

				/* once image is loaded continue */
				image.onload = function () {
					/* draw image to temporary context */
					tempContext.drawImage(image, 0, 0, tempCanvas.width, tempCanvas.height);

					//await wait(2);

					/* get RGBA of image */
					const rgba = tempContext.getImageData(0, 0, 1, 1).data;
					/* get RGB From RGBA */
					const rgb = [rgba[0], rgba[1], rgba[2]];

					/* append image custom blocks view */
					const img = $(`<img class="CBSelVisImg" src="${f.target.result}" alt="${file.name}"/>`);
					img.css({'width': visSize + 'px', 'height': visSize + 'px'});
					img.appendTo("#CBCustomBlocks");

					/* get name remove extension */
					let name = file.name.split(".");
					name.pop();
					name = name.join(".");
					//console.log('[b] Successfully read file "' + file.name + '"');

					/* push data to customBlockset array */
					customBlockset.push({id: name, rgb, imageData: f.target.result});
				}
			} catch(err) { console.log(`[b] Failed to read file "${file.name}" (error: "${err}")`); }
		}
		console.log(`[b] Generated custom blockset out of ${customBlockset.length + 1} block(s):`, customBlockset);

		/* allow confirm if 1 or more images are loaded;
		we add +1 because check happens before picture appends to list, 
		and the least amount possible to upload is 1 image */
		if (customBlockset.length + 1 >= 0) CBConfirmUpdater(false); 

	}
}

/* custom blocksets button */
$('#CBBtn').on('click', () => {
		//$('#blocksPresetDD').text() = '(unavailable for custom blocksets)';
		$('#CBSelScreen').fadeIn(300);
		$('#CBSelScreenVis').html('');

		CBConfirmUpdater(true);

		const CBInput = $('<div><input type="file" id="CBSelScreenDirectorySelector" onchange="onDirectoryChange(this)" accept="image/png, image/jpeg" multiple/></div>');
		CBInput.appendTo('#CBSelScreenVis');
		const CBBlock = $('<div id="CBCustomBlocks"></div>');
		CBBlock.appendTo('#CBSelScreenVis');
	}
);

/* custom blocksets confirm button */
$('#CBSelScreenConfirm').on('click', () => {
	$('#CBSelScreen').fadeOut(300);

	CBConfirmUpdater(true);

	blockData = customBlockset;
	console.log('[b] Custom blockset applied.')

	/* disable some stuff and add 'inuse' attr to CBBtn */
	$('#blocksPresetDD').prop('disabled', true);
	$('#blocksetSwitcher').prop('disabled', true);
	$('#CBBtn').attr('inuse', true);

	/* use special palette */
	$('#blocksPresetDD').html('');
	$('#blocksPresetDD').append(
		$(document.createElement('option')).prop({
			value: 'customBlockset',
			text: 'unavailable for custom blocksets'
	}));
});

/* custom blockset cancel button */
$('#CBSelScreenClose').on('click', () => {
	blockData = eval( $('#blocksPresetDD').val() );
	CBConfirmUpdater(true);
	$('#CBSelScreen').fadeOut(300);
	customBlockset = [];
});

/* custom blockset confirm button updater */
function CBConfirmUpdater(i) {
	$('#CBSelScreenConfirm').prop('disabled', i);
}

/* custom blockset reverter */
$('#blocksetSwitcherHandler').on('click', () => {
	if ($('#blocksetSwitcher').is(':disabled')) {
		/* re-import and re-default palettes */
		presetImport();
		presetDefaulter();
		customBlockset = [];

		/* enable everything back and remove 'inuse' attr from CBBtn */
		$('#blocksPresetDD').prop('disabled', false);
		$('#CBBtn').removeAttr('inuse');
		$('#blocksetSwitcher').prop('disabled', false);

		/* do not switch blockset selected before */
		return false;
	}
});





/* custom palette's blocks selection screen */
$('#blocksPresetDD').change(() => {
	if ($('#blocksPresetDD').val() == 'customPreset') {
		presetDefaulter();
		CPBlockUpdater();

		$('#CPSelScreen').fadeIn(300);
		$('#CPSelScreenVis').html('');

		/* visualise all the available blocks in alphabetic order */
		let CPselVisLetter = 'ибражы';
		
		for (let CPSelBlocksVis in blockData) {
			if (CPselVisLetter != blockData[CPSelBlocksVis].id[0]) {

				/* close letter separator */
				if (CPSelBlocksVis != blockData.length -1) {
					CPSelVis = $('</div>');
					CPSelVis.appendTo('#CPSelScreenVis');
				}

				/* create a letter separator */
				CPselVisLetter = blockData[CPSelBlocksVis].id[0];
				var CPSelVis = $('<div class="CPSelVisLetterSeparator" id="CPSelVisLetter' + blockData[CPSelBlocksVis].id[0] + '">');
				CPSelVis.appendTo('#CPSelScreenVis');
			}

			/* create a block selection checkbox */
			var CPSelVis = $('<input type="checkbox" name="' + blockData[CPSelBlocksVis].id + 'Checkbox" class="CPSelVis"]>');
			/* jQuery doesn't work properly with IDs that contains ".", so here's my workaround */
			CPSelVis.attr('id', blockData[CPSelBlocksVis].id.replace('.', '・'));
			CPSelVis.appendTo('#CPSelVisLetter' + blockData[CPSelBlocksVis].id[0]);

			/* create a label for the checkbox */
			var CPSelVis = $('<label for="' + blockData[CPSelBlocksVis].id.replace('.', '・') + '" class="CPSelVisBtn"></label>');
			CPSelVis.appendTo('#CPSelVisLetter' + blockData[CPSelBlocksVis].id[0]);

			/* add an image to the label */
			var CPSelVis2 = $('<img class="CPSelVisImg" id="' + blockData[CPSelBlocksVis].id.replace('.', '・') + 'Img" onclick="CPBlockUpdater(' + "this.getAttribute('blockid'), this.getAttribute('blockrgb')" + ');" onmouseover="showPopup(this);" onmouseout="hidePopup(this);">')

			CPSelVis2.attr('src', './data/blocksets/' + blockset + '/' + blockData[CPSelBlocksVis].id);
			CPSelVis2.attr('blockname', blockData[CPSelBlocksVis].id.replace('.png', '').replace(/\_/g, ' '));
			CPSelVis2.attr('blockid', blockData[CPSelBlocksVis].id);
			CPSelVis2.attr('blockrgb', blockData[CPSelBlocksVis].rgb[0] + '|' + blockData[CPSelBlocksVis].rgb[1] + '|' + blockData[CPSelBlocksVis].rgb[2]);
			CPSelVis2.css({'width': visSize + 'px', 'height': visSize + 'px'});

			CPSelVis2.appendTo(CPSelVis);
}}});

/* check if at least one block is selected (used for confirm button activation/deactivation) */
function CPBlockUpdater() {
	setTimeout( () => {
		$('.CPSelVis:checked').length <= 0
		? $('#CPSelScreenConfirm').prop('disabled', true)
		: $('#CPSelScreenConfirm').prop('disabled', false)
	}, 20);
}



/* selected blocks parser */
function CPBlocksParser() {
	let CPParsedBlocks = [];

	/* get array of all checked blocks */
	let CPSelectedBlocks = $('.CPSelVis:checked'), CPSelectedBlocksPart = [];

	for (let currentCPSelectedBlock = 0; currentCPSelectedBlock <= CPSelectedBlocks.length -1; currentCPSelectedBlock++) {
		/* convert blockrgb and blockid to palette format */
		CPSelectedBlocksPart = {
			id: $('#' + CPSelectedBlocks[currentCPSelectedBlock].id + 'Img').attr('blockid'),
			rgb: [
			parseInt($('#' + CPSelectedBlocks[currentCPSelectedBlock].id + 'Img').attr('blockrgb').split('|')[0]),
			parseInt($('#' + CPSelectedBlocks[currentCPSelectedBlock].id + 'Img').attr('blockrgb').split('|')[1]),
			parseInt($('#' + CPSelectedBlocks[currentCPSelectedBlock].id + 'Img').attr('blockrgb').split('|')[2])
		]}
	CPParsedBlocks.push(CPSelectedBlocksPart);
	}
	console.log(`[p] Parsed ${CPParsedBlocks.length} block(s) as custom palette array: `, CPParsedBlocks);
	return CPParsedBlocks;
}

/* custom palettes confirm button */
$('#CPSelScreenConfirm').on('click', () => {
	$('#CPSelScreen').fadeOut(300);

	let CPBlocks = CPBlocksParser();

	/* push generated array to the custom palette */
	$('#blocksPresetDD').val('customPreset');
	blockData = CPBlocks;

	console.log(`[p] Custom palette generated, changed to "${$('#blocksPresetDD').val()}"`);
	//console.log('[p]', custom);
});

/* custom palettes cancel button */
$('#CPSelScreenClose').on('click', () => {
	console.log('[p] Custom palette cancelled.');
	$('#CPSelScreen').fadeOut(300);
	CPBlockUpdater();
});





/* blockset switcher */
function blocksetSwitch() {
	if ($('#blocksetSwitcher').is(':checked')) blockset = 'blocks_vanilla';

	presetImport();

	console.log(`[p] Blockset changed to "${blockset}", reverted to "${$('#blocksPresetDD').val()}"`);
};

$('#blocksetSwitcher').on('click', () => blocksetSwitch());





/* BPick screen */
var BPickCSV = 'color1';

function colorBPick(color) {
	$('#BPickScreen').fadeIn(300);
	$('#BPickScreenVis').html('');

	/* store selected colour (color1 or color2) value */
	BPickSCV = color;

	/* visualise all the blocks available  */
	var BPickVisLetter = 'ибражы';

	for (let BPickBlocksVis in blockData) {
		if (BPickVisLetter != blockData[BPickBlocksVis].id[0]) {
			if (BPickBlocksVis != blockData.length -1) {
				BPickVis = $('</div>');
				BPickVis.appendTo('#BPickScreenVis');
			}
			BPickVisLetter = blockData[BPickBlocksVis].id[0];
			var BPickVis = $('<div class="BPickVisLetterSeparator" id="BPickVisLetter' + blockData[BPickBlocksVis].id[0] + '">');
			BPickVis.appendTo('#BPickScreenVis');
		}
		var BPickVis = $('<img class="BPickVisImg" onclick="' + "BPickSelect(this.getAttribute('blockid'));" + '" onmouseover="showPopup(this);" onmouseout="hidePopup(this);">');

		/* add essential attributes */
		BPickVis.attr('src', blockData[BPickBlocksVis].imageData ? blockData[BPickBlocksVis].imageData : './data/blocksets/' + blockset + '/' + blockData[BPickBlocksVis].id);
		BPickVis.attr('blockname', blockData[BPickBlocksVis].id.replace('.png', '').replace(/\_/g, ' '));
		BPickVis.attr('blockid', blockData[BPickBlocksVis].id);

		/* add size controls */
		BPickVis.css({'width': visSize + 'px', 'height': visSize + 'px'});

		BPickVis.appendTo('#BPickVisLetter' + blockData[BPickBlocksVis].id[0]);
}}

$('#colorBPick1').on('click', () => colorBPick('color1'));
$('#colorBPick2').on('click', () => colorBPick('color2'));

/* BPick screen block selection */
function BPickSelect(blockid) {
	var BPickSelectedBlockResult = blockData.filter((bdblock) => bdblock.id == blockid);

	if (BPickSCV == 'color1') $('#colorSel1').val(rgbToHex(BPickSelectedBlockResult[0].rgb[0],BPickSelectedBlockResult[0].rgb[1],BPickSelectedBlockResult[0].rgb[2]));
	if (BPickSCV == 'color2') $('#colorSel2').val(rgbToHex(BPickSelectedBlockResult[0].rgb[0],BPickSelectedBlockResult[0].rgb[1],BPickSelectedBlockResult[0].rgb[2]));

	updateColors();
	$('#BPickScreen').fadeOut(300);
}

/* BPick screen cancel button */
$('#BPickScreenClose').on('click', () => $('#BPickScreen').fadeOut(300) );





/* finally, process GG button */
function genGradient() {
	$('#ggBtn').prop('disabled', true);
	updateSteps();
	genBlocks();
	$('#ggBtn').prop('disabled', false);
}

$('#ggBtn').on('click', () => genGradient());





/* init console message */
console.log('*boop* main script initialized');

/* le final countdown */
$(document).ready(function() {
	/* randomize colours on startup if no cached colours available; otherwise just update colours */
	color1 = $('#colorSel1').val();
	color2 = $('#colorSel2').val();
	(color1 == '#000000', color2 == '#000000') ? rndColors() : updateColors();

	/* enable GG button when the script is ready */
	$("#ggBtn").prop("disabled", false);
})

