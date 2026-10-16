// sgplanetarium
// by VeeArr (#2045369)
//
// Based on spading by Veracity (#121572), Semenar (#3275442), Asmodais (#2071543),
// Crowther (#533281), VeeArr (#2045369), and others.

const kol = require("kolmafia");

const MY_FILENAME="./relay_sgplanetarium.js";

module.exports.main = function main(){	
	let output="";
	
	let fields=kol.formFields();
	let action=fields["action"];
	let config=parseConfig(fields);
	
	output+=handleSearchBar(config);
	debugPrint("action: "+action);
	debugPrint("config: "+JSON.stringify(config));
	if(action=="search"){
		output+=handleSearch(config);
	}
	
	let page="<html><head><title>sgplanetarium</title></head><body><center>\n"+output+"</center></body></html>";
	
	kol.write(page);
}

const FIELD_LABELS={
	"diffAE":"A-E (1 env/0 ele)",
	"diffFI":"F-I (1 env/1 ele)",
	"diffJO":"J-O (2 env/1 ele)",
	"diffPS":"P-S (2 env/2 ele)",
	"diffTY":"T-Y (3 env/2 ele)",
	"diffZ":"Z (3 env/3 ele)",
	"toxicAtmosphere":"Toxic Atmosphere",
	"highGravity":"High Gravity",
	"irradiated":"Irradiated",
	"magneticStorm":"Magnetic Storm",
	"highWinds":"High Winds",
	"hotSolarFlare":"Hot Solar Flare",
	"frigidZones":"Frigid Zones",
	"scaryNoises":"Scary Noises",
	"nastyGasses":"Nasty Gasses",
	"lewdRockFormations":"Lewd Rock Formations",
	"plantsNone":"None",
	"plantsFS":"Friendly Simple",
	"plantsHS":"Hostile Simple",
	"plantsFC":"Friendly Complex",
	"plantsHC":"Hostile Complex",
	"plantsFA":"Friendly Anomalous",
	"plantsHA":"Hostile Anomalous",
	"animalsNone":"None",
	"animalsFS":"Friendly Simple",
	"animalsHS":"Hostile Simple",
	"animalsFC":"Friendly Complex",
	"animalsHC":"Hostile Complex",
	"animalsFA":"Friendly Anomalous",
	"animalsHA":"Hostile Anomalous",
	"aliensNone":"None",
	"aliensFriendly":"Friendly",
	"aliensHostile":"Hostile",
	"itemSpear":"Spear",
	"itemBlowgun":"Blowgun",
	"itemLoincloth":"Loincloth",
	"itemTotem":"Totem",
	"itemNecklace":"Necklace",
	"itemMask":"Mask",
	"itemBooze":"Booze",
	"itemSalad":"Salad",
	"itemMedicine":"Medicine",
	"spantsNone":"None",
	"spantsDrones":"Drones",
	"spantsSoldiers":"Drones + Soldiers",
	"spantsArtifact":"Artifact",
	"murderbotsNone":"None",
	"murderbotsDrones":"Drones",
	"murderbotsSoldiers":"Drones + Soldiers",
	"murderbotsArtifact":"Artifact",
	"questNone":"None",
	"questSpacePirate":"Space Pirate",
	"questProcrastinator":"Procrastinator",
	"questSpaceBaby":"Space Baby",
	"questStep1":"Step 1",
	"questStep2":"Step 2",
	"questStep3":"Step 3",
};
function parseConfig(fields){
	let isSearch=fields.action=="search";
	
	let config={};
	for([field,label] in FIELD_LABELS){
		config[field]=!isSearch||(field in fields);
	}
	
	config.itemPrice=parseInt(fields["itemPrice"]);
	if(isNaN(config.itemPrice)){
		config.itemPrice=0;
	}
	
	return config;
}

function handleSearchBar(config){
	let rv="<style>.section{vertical-align:top} .nested{margin:auto}</style>";
	rv+="<form action='"+MY_FILENAME+"'>";
	rv+="<input type='hidden' name='relay' value='true'/>";
	
	rv+="<table border=1><tr>";
	rv+=buildSection(config,"Difficulty","diffAE","diffFI","diffJO","diffPS","diffTY","diffZ");
	rv+=buildStackedSection(config,"Aliens","aliensNone",["aliensFriendly","itemMask","itemBooze","itemSalad","itemMedicine","itemPrice"],["aliensHostile","itemSpear","itemBlowgun","itemLoincloth","itemTotem","itemNecklace"]);
	rv+=buildSection(config,"Spants","spantsNone","spantsDrones","spantsSoldiers","spantsArtifact");
	rv+="</tr><tr>";
	rv+=buildSection(config,"Env. Hazards","toxicAtmosphere","highGravity","irradiated","magneticStorm","highWinds");
	rv+=buildStackedSection(config,"Plants","plantsNone",["plantsFS","plantsFC","plantsFA"],["plantsHS","plantsHC","plantsHA"]);
	rv+=buildSection(config,"Murderbots","murderbotsNone","murderbotsDrones","murderbotsSoldiers","murderbotsArtifact");
	rv+="</tr><tr>";
	rv+=buildSection(config,"Elem. Hazards","hotSolarFlare","frigidZones","scaryNoises","nastyGasses","lewdRockFormations");
	rv+=buildStackedSection(config,"Animals","animalsNone",["animalsFS","animalsFC","animalsFA"],["animalsHS","animalsHC","animalsHA"]);
	rv+=buildStackedSection(config,"Quest","questNone",["questSpacePirate","questProcrastinator","questSpaceBaby"],["questStep1","questStep2","questStep3"]);
	rv+="</tr></table>";
	
	rv+="<br/><i>Note: Searching may take a few seconds; please be patient.</i>";
	rv+="<br/><br/><button type='submit' name='action' value='search'>Search</button></form>";
	
	return rv+"\n";
}

function buildSection(config,title,...settings){
	let rv="<td class='section'><table class='nested'><tr><th>"+title+"</th></tr>";
	for(setting of settings){
		rv+="<tr>"+buildFieldCell(config,setting)+"</tr>";
	}
	rv+="</table></td>";
	return rv;
}

function buildStackedSection(config,title,sharedSetting,colOne,colTwo){
	let rv="<td class='section'><table class='nested'><tr><th colspan=2>"+title+"</th></tr>";
	rv+="<tr>"+buildFieldCell(config,sharedSetting," colspan=2 style='text-align:center'")+"</tr>";
	for(let i=0;i<colOne.length;i++){
		rv+="<tr>";
		rv+=buildFieldCell(config,colOne[i]);
		rv+=buildFieldCell(config,colTwo[i]);
		rv+="</tr>";
	}
	rv+="</table></td>";
	return rv;
}

function buildFieldCell(config,name,extra){
	let rv="<td"+(extra??"")+">";
	if(name=="itemPrice"){
		let initItemPrice=config.itemPrice==0?"":config.itemPrice;
		rv+="<label>Max Price: <input type='text' name='itemPrice' size='7' value='"+initItemPrice+"'/></label>";
	}else{
		rv+=buildCheckbox(config,name);
	}
	rv+="</td>";
	return rv;
}

function buildCheckbox(config,name,label){
	if(label===undefined){
		label=FIELD_LABELS[name];
	}
	return "<label><input type='checkbox' name='"+name+"'"+(config[name]?"checked":"")+"/>"+label+"</label>";
}

function handleSearch(config){
	let planetCoords=searchForPlanet(config);
	
	let rv="<b>Search Results:</b><br/><br/>";
	if(planetCoords===null){
		rv+="No planet matches these specifications.<br/>";
	}else{
		rv+="Matching planet found: <span style='font-family:monospace;font-weight:bolder;font-size:x-large;color:blue'>"+planetCoords+"</span>";
	}
	
	if(planetCoords!==null&&kol.getRevision()>=29373){
		function traitRow(label,data){
			return `<tr><td style='text-align:right'><b>${label}:</b></td><td>${data}</td></tr>`;
		}
		
		let planet=kol.spacegatePlanetInfo(planetCoords);
		rv+="<br/><br/>";
		rv+="<table><tr><th>"+planet.name+"</th></tr>";
		rv+="<tr><td><i>"+planet.description.join("<br/>")+"</i></td></tr><tr></tr>";
		rv+="<tr><td><center><table>";
		rv+=traitRow("Env Hazards",planet.env_hazards.join(", "));
		rv+=traitRow("Elem Hazards",planet.elem_hazards.length==0?"none":planet.elem_hazards.join(", "));
		rv+=traitRow("Plants",planet.plants);
		rv+=traitRow("Animals",planet.animals);
		let aData;
		switch(planet.aliens){
			case "none":
				aData="none";
				break;
			case "friendly":
				aData=`friendly -- ${planet.alien_item.name} @ ${planet.alien_item_price}`;
				break;
			case "hostile":
				aData=`hostile -- ${planet.alien_item.name}`;
				break;
		}
		rv+=traitRow("Aliens",aData);
		rv+=traitRow("Spants",planet.spants);
		rv+=traitRow("Murderbots",planet.murderbots);
		let qData;
		if(planet.quest_type=="none"){
			qData="none";
		}else{
			qData=`${planet.quest_type} stage ${planet.quest_stage}`;
		}
		rv+=traitRow("Quest",qData);
		rv+=traitRow("Rock Level",planet.rocks_level);
		rv+="</table></center></td></tr></table>";
	}
	
	return rv+"\n";
}

function searchForPlanet(config){
	let candidates=[null,null,null,null,null,null,null];
	
	let filters=[];
	if(!config.diffAE||!config.diffFI||!config.diffJO||!config.diffPS||!config.diffTY||!config.diffZ){
		filters.push(p=>{switch(p[1]){
			case "A":
			case "B":
			case "C":
			case "D":
			case "E":
				return config.diffAE;
			case "F":
			case "G":
			case "H":
			case "I":
				return config.diffFI;
			case "J":
			case "K":
			case "L":
			case "M":
			case "N":
			case "O":
				return config.diffJO;
			case "P":
			case "Q":
			case "R":
			case "S":
				return config.diffPS;
			case "T":
			case "U":
			case "V":
			case "W":
			case "X":
			case "Y":
				return config.diffTY;
			case "Z":
				return config.diffZ;
			default:
				return false;
		}});
	}
	const HAZARDS={
		"toxicAtmosphere":2,
		"highGravity":3,
		"irradiated":4,
		"magneticStorm":5,
		"highWinds":6,
		"hotSolarFlare":7,
		"frigidZones":8,
		"scaryNoises":9,
		"nastyGasses":10,
		"lewdRockFormations":11
	};
	for([hazardType,idx] in HAZARDS){
		if(!config[hazardType]){
			let aIdx=idx;
			filters.push(p=>p[aIdx]=="0");
		}
	}
	candidates[0]=filterFile("hazards",filters);
	
	function handleWildlife(type){
		const WILDLIFE={
			"None":[0,0],
			"FS":[1,1],
			"HS":[2,1],
			"FC":[1,2],
			"HC":[2,2],
			"FA":[1,3],
			"HA":[2,3],
		};
		let filters=[];
		let filterNeeded=false;
		let allowedParams=[];
		for([wildlifeType,params] in WILDLIFE){
			if(config[type+wildlifeType]){
				allowedParams.push(params);
			}else{
				filterNeeded=true;
			}
		}
		if(filterNeeded){
			let aAllowedParams=allowedParams;
			filters.push(p=>{
				for(aParam of aAllowedParams){
					if(p[2]==aParam[0]&&p[3]==aParam[1]){
						return true;
					}
				}
				return false;
			});
		}
		return filterFile(type,filters);
	}
	candidates[1]=handleWildlife("plants");
	candidates[2]=handleWildlife("animals");
	
	filters=[];
	if(!config.aliensNone||!config.aliensFriendly||!config.aliensHostile){
		filters.push(p=>{switch(p[2]){
			case "0":
				return config.aliensNone;
			case "1":
				return config.aliensFriendly;
			case "2":
				return config.aliensHostile;
			default:
				return false;
		}});
	}
	const ALIEN_ITEMS={
		"itemSpear":5,
		"itemBlowgun":6,
		"itemLoincloth":7,
		"itemTotem":8,
		"itemNecklace":9,
		"itemMask":4,
		"itemBooze":2,
		"itemSalad":1,
		"itemMedicine":3,
	};
	let itemFilterNeeded=false;
	let allowedVals=[];
	for([item,val] in ALIEN_ITEMS){
		if(config[item]){
			allowedVals.push(val);
		}else{
			itemFilterNeeded=true;
		}
	}
	if(itemFilterNeeded){
		let aAllowedVals=allowedVals;
		filters.push(p=>{
			if(p[2]==0){
				return true;
			}
			for(aVal of aAllowedVals){
				if(p[3]==aVal){
					return true;
				}
			}
			return false;
		});
	}
	if(config.itemPrice>0){
		filters.push(p=>{
			return p[2]!=1||parseInt(p[4])<=config.itemPrice;
		});
	}
	candidates[3]=filterFile("aliens",filters);
	
	function handleArmy(type){
		const ARMY_TYPES={
			"None":0,
			"Artifact":1,
			"Drones":2,
			"Soldiers":3,
		};
		let filters=[];
		let filterNeeded=false;
		let allowedVals=[];
		for([armyType,val] in ARMY_TYPES){
			if(config[type+armyType]){
				allowedVals.push(val);
			}else{
				filterNeeded=true;
			}
		}
		if(filterNeeded){
			let aAllowedVals=allowedVals;
			filters.push(p=>{
				for(aVal of aAllowedVals){
					if(p[2]==aVal){
						return true;
					}
				}
				return false;
			});
		}
		return filterFile(type,filters);
	}
	candidates[4]=handleArmy("spants");
	candidates[5]=handleArmy("murderbots");

	filters=[];
	if(!config.questNone||!config.questSpacePirate||!config.questProcrastinator||!config.questSpaceBaby){
		filters.push(p=>{switch(p[2]){
			case "0":
				return config.questNone;
			case "1":
				return config.questSpacePirate;
			case "2":
				return config.questProcrastinator;
			case "3":
				return config.questSpaceBaby;
			default:
				return false;
		}});
	}
	if(!config.questStep1||!config.questStep2||!config.questStep3){
		filters.push(p=>{
			if(p[2]==0){
				return true;
			}
			return config["questStep"+p[3]];
		});
	}
	candidates[6]=filterFile("quest",filters);

	let firstCriterion=-1;
	let remainingCriteria=[];
	for(i=0;i<7;i++){
		if(candidates[i]!==null){
			if(firstCriterion==-1){
				firstCriterion=i;
			}else{
				remainingCriteria.push(i);
			}
		}
	}
	if(firstCriterion==-1){
		return "AAAAAAA";
	}
	
	pseedloop:for(pseed in candidates[firstCriterion]){
		debugPrint("Matching "+pseed);
		for(criterion of remainingCriteria){
			if(!(pseed in candidates[criterion])){
				continue pseedloop;
			}
		}
		
		let restrictions=candidates.map(c=>c===null?null:c[pseed]);
		debugPrint("Calculating "+pseed+" with "+JSON.stringify(restrictions));
		let found=calculatePlanet(pseed,restrictions);
		if(found!=null){
			return found.map(i=>String.fromCharCode(i)).join('');
		}
	}
	return null;
}

function filterFile(filename,filters){
	if(filters.length==0){
		return null;
	}
	
	let fileContents=kol.fileToBuffer("sgplanetarium/"+filename+".csv");
	let rv={};
	lineloop:for(line of kol.splitString(fileContents)){
		let parts=line.split(",");
		for(filter of filters){
			if(!filter(parts)){
				continue lineloop;
			}
		}
		rv[parts[0]]=(rv[parts[0]]??"")+parts[1];
	}
	return rv;
}

function calculatePlanet(pseed,restrictions){
	function toRange(letters){
		res=[];
		for(letter of letters){
			res.push(letter.charCodeAt(0));
		}
		return res;
	}
	
	const ALPHA="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let ranges=restrictions.map(r=>toRange(r??ALPHA));
	return findPlanet(pseed,ranges,[0,0,0,0,0,0,0],0);
}

function findPlanet(remaining,ranges,state,ptr){
	if(ptr>=7){
		return state;
	}
	
	let minReqd=remaining;
	let maxAllowed=remaining;
	for(i=ptr+1;i<7;i++){
		minReqd-=ranges[i][ranges[i].length-1]*(10000+i);
		maxAllowed-=ranges[i][0]*(10000+i);
	}
	
	for(thisOption of ranges[ptr]){
		if(thisOption*(10000+ptr)>=minReqd&&thisOption*(10000+ptr)<=maxAllowed){
			state[ptr]=thisOption;
			let found=findPlanet(remaining-thisOption*(10000+ptr),ranges,state,ptr+1);
			if(found!=null){
				return found;
			}
		}
	}
	
	return null;
}

const DEBUG=(kol.getProperty("sgplanetarium_debug")=="true");
function debugPrint(msg){
	if(DEBUG){
		kol.print(msg,"purple");
	}
}
