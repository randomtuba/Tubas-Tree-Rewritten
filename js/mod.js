let modInfo = {
	name: "Tuba's Tree Rewritten",
	id: "tt_rewrite2",
	author: "randomtuba",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0.2.1",
	name: "Ascension Part One",
}

let changelog = `<h1>Tuba's Tree Rewritten Changelog</h1><br><span style="color:red;"><b>WARNING: SPOILERS!</b></span><br><br>
<span style="color:#D2D900;">
<b style="font-size: 20px;">v0.0.2.1</b><br>
-Fixed a game-breaking bug<br>
-Fixed a bug where the 3rd prestige buyables appears when you Ascend.<br><br><br>
<b style="font-size: 20px;">v0.0.2: Ascension Part One</b><br>
-Added a new prestige layer, Ascension!<br>
-Added 3 new prestige upgrades and a 3rd prestige buyable.<br>
-Added 8 ascension upgrades.<br>
-Added 4 ascension milestones.<br>
-Added 8 achievements.<br>
-Added Boosters, which multiply points and are unaffected by taxes!<br>
-Added 3 booster upgrades.<br><br><br></span>
</span>
<span style="color:#0070CC;"><b style="font-size: 20px;">v0.0.1: Prestige</b><br>
-Released the game (again).<br>
-Added 4 Point Buyables: Generators, Time Accelerators, Duplicators, and Accelerator Boosts.<br>
-Added 3 Point Upgrades. More are coming soon!
-Added 10 prestige upgrades.<br>
-Added 2 prestige buyables.<br>
-Added 5 prestige milestones.<br>
-Added 14 achievements. Some of them have rewards!<br>
-Added 2 Skills! Level them up with experience, gained from all main prestige layers.<br>
-This is not a Synergism clone I swear<br><br><br></span>`

let winText = `@randomtuba#8432 You litte f**ker<br>You made a shit of piece with your trash rewrite it's f**King Bad this trash game I will become back my money I hope you will in your next time a cow on a trash farm you sucker`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0)
  gain = gain.add(buyableEffect("n",11))
  gain = gain.mul(buyableEffect("n",12))
  gain = gain.mul(buyableEffect("n",13))
  if(hasUpgrade("n",11)) gain = gain.mul(5)
  if(hasUpgrade("p",11)) gain = gain.mul(8)
  if(hasUpgrade("p",12)) gain = gain.mul(4)
  if(hasUpgrade("p",13)) gain = gain.mul(upgradeEffect("p",13))
  gain = gain.mul(buyableEffect("p",11))
  if(hasUpgrade("p",22)) gain = gain.mul(1e10)
  if(hasUpgrade("p",23)) gain = gain.mul(upgradeEffect("p",23))
  if(hasUpgrade("p",24)) gain = gain.mul(upgradeEffect("p",24))
  gain = gain.mul(buyableEffect("p",13))
  if(gain.gte(1e25)) gain = gain.pow(hasUpgrade("p",25) ? (hasUpgrade("p",32) ? 0.575 : 0.55) : 0.5).mul(new Decimal(1e25).pow(hasUpgrade("p",25) ? (hasUpgrade("p",32) ? 0.575 : 0.55) : 0.5))
  if(gain.gte(1e100)) gain = gain.pow(0.5).mul(new Decimal(1e100).pow(0.5))
  gain = gain.mul(boosterEffect())
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [`<span>Current Endgame: 1e2550 points</span>`,
        () => player.points.gte("1e25") ? '<span style="color:orange">Your points have been (softcapped) due to taxes</span>' : '',
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("1e2550"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}