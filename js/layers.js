  addLayer("n", {
    name: "normal", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "N", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal("-30000000"),
    }},
    tabFormat: [
    ["display-text", () => `You have ${format(player.points)} points<br><br>`],
    "buyables",
    "upgrades",
    ],
    tooltip: "Normal",
    color: "#CCCCCC",
    requires: new Decimal(0), // Can be a function that takes requirement increases into account
    resource: "social credit :(", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    automate(){
      if (player.n.auto) {
        setBuyableAmount("n",11,tmp.n.buyables[11].canAfford?player.points.div(10).log(2).floor().add(1):getBuyableAmount("n",11))
      }
      if (player.n.auto2) {
        if(getBuyableAmount("n",12).gte(620)){
          setBuyableAmount("n",12,tmp.n.buyables[12].canAfford?player.points.div("2.29827e435").log(5).sqrt().add(620).floor().add(1):getBuyableAmount("n",12))
        }else{
          setBuyableAmount("n",12,tmp.n.buyables[12].canAfford?player.points.div(100).log(5).floor().add(1).min(620):getBuyableAmount("n",12))}
        }
      if (player.n.auto3) {
        setBuyableAmount("n",13,tmp.n.buyables[13].canAfford?player.points.div(1000).log(10).floor().add(1):getBuyableAmount("n",13))
      }
      if (player.n.auto4) {
        setBuyableAmount("n",21,tmp.n.buyables[21].canAfford?player.points.div(1e25).log(1000).floor().add(1):getBuyableAmount("n",21))
      }
    },
    layerShown(){return true},
    doReset(layer) {

    if (!(layers[layer].row > this.row)) return

    let keep = []
    if(hasMilestone("p",3)) keep.push("upgrades")

    layerDataReset(this.layer, keep)

    },
    upgrades: {
      11: {
        title: "Point Multiplier",
        description: "You figured out a way to gain more points! Multiply point gain by 5.",
        cost: new Decimal(5000),
        unlocked() {return getBuyableAmount("n",13).gte(1) || player.p.total.gte(1) || player.a.total.gte(1)},
        currencyDisplayName: "points",
        currencyInternalName: "points",
      },
      12: {
        title: "Generator Efficiency",
        description: "Generator production is squared by turning the knob to \"Very Fine\".",
        cost: new Decimal(20000),
        unlocked() {return hasUpgrade("n",11) || player.p.total.gte(1) || player.a.total.gte(1)},
        currencyDisplayName: "points",
        currencyInternalName: "points",
      },
      13: {
        title: "Time Warping",
        description: "The Time Accelerator multiplier/purchase is better (1.2x -> 1.25x).",
        cost: new Decimal(1e6),
        unlocked() {return hasUpgrade("n",11) || player.p.total.gte(1) || player.a.total.gte(1)},
        currencyDisplayName: "points",
        currencyInternalName: "points",
      },
      21: {
        title: "Bottle O' Enchanting",
        description: "Gain 4x more experience from all sources!",
        cost: new Decimal("1e450"),
        unlocked() {return hasAchievement("g",42)},
        currencyDisplayName: "points",
        currencyInternalName: "points",
      },
      22: {
        title: "Skill Discounts",
        description: "Reduce cost scaling for the first 3 skills!",
        cost: new Decimal("1e690"),
        unlocked() {return hasAchievement("g",42)},
        currencyDisplayName: "points",
        currencyInternalName: "points",
      },
    },
    buyables: {
    11: {
        title: "Generator",
        cost(x) { return new Decimal(10).mul(new Decimal(2).pow(x)) },
        display() {return `Generates points <i>automagically!</i>\nTimes Bought: ${format(getBuyableAmount(this.layer, this.id))}\nCost: ${format(this.cost())}\nTime Speed: +${format(this.effect())} base points/sec`},
        canAfford() {return player.points.gte(this.cost())},
        buy() {
            player.points = player.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        effect(x) {
          prod = x.add(player.sk.inceptionSkill.mul(100)).pow(new Decimal(hasUpgrade("n",12)?2:1).add(player.sk.inceptionSkill.div(2)))
          return prod
        },
    },
    12: {
        title: "<span style='color: #AA0000'><b>Time Accelerator</b></span>",
        cost(x) { 
          let y = x.sub(620)
          return x.gte(620) ? new Decimal("2.29827e435").mul(new Decimal(5).pow(y.pow(2))) : new Decimal(100).mul(new Decimal(5).pow(x)) },
        display() {return `Speeds up the flow of time!\nTimes Bought: ${format(getBuyableAmount(this.layer, this.id))}\nCost: ${format(this.cost())}\nTime Speed: ${format(this.effect())}x`},
        canAfford() {return player.points.gte(this.cost())},
        buy() {
            player.points = player.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        unlocked() { return getBuyableAmount("n",11).gte(3) || player.p.total.gte(1) || player.a.total.gte(1) },
        effect(x) {
          mult = new Decimal(hasUpgrade("n",13)?1.25:1.2).add(buyableEffect("n",21)).pow(x.add(hasAchievement("g",21)?5:0).add(getBuyableAmount("n",21).mul(5)).add(player.sk.temporalSkill.gte(45) ? new Decimal(67.5).add(player.sk.temporalSkill.sub(45).mul(hasUpgrade("p",33)?0.6:0.4)) : player.sk.temporalSkill.mul(1.5).round()))
          return mult
        },
    },
    13: {
        title: "<span style='color: #0000FF'><b>Duplicator</b></span>",
        cost(x) { return new Decimal(1000).mul(new Decimal(10).pow(x)) },
        display() {return `CTRL+C CTRL+V CTRL+C CTRL+V...\nTimes Bought: ${format(getBuyableAmount(this.layer, this.id))}\nCost: ${format(this.cost())}\nPoint Multiplier: ${format(this.effect())}x`},
        canAfford() {return player.points.gte(this.cost())},
        buy() {
            player.points = player.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        unlocked() { return getBuyableAmount("n",12).gte(2) || player.p.total.gte(1) || player.a.total.gte(1) },
        effect(x) {
          mult = new Decimal(2).pow(x.add(player.sk.cloningSkill.gte(15) ? new Decimal(hasUpgrade("a",14)?30:10).add(player.sk.cloningSkill.sub(15).div(0.1)) : player.sk.cloningSkill.div(hasUpgrade("a",14)?0.5:1.5)))
          return mult
        },
    },
    21: {
        title: "<span style='color: #5E99FF'><b>Accelerator Boost</b></span>",
        cost(x) { return new Decimal(1e25).mul(new Decimal(1000).pow(x)) },
        display() {return `Gain 5 free Time Accelerators, and add 0.02 to the multiplier per Time Accelerator.\nTimes Bought: ${format(getBuyableAmount(this.layer, this.id))}\nCost: ${format(this.cost())}`},
        canAfford() {return player.points.gte(this.cost())},
        buy() {
            player.points = player.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        unlocked() { return hasAchievement("g",23) },
        effect(x) {
          mult = x.add(player.sk.temporalSkill.gte(45) ? new Decimal(90).add(player.sk.temporalSkill.sub(45).div(hasUpgrade("p",33)?7:10).round()) : player.sk.temporalSkill.div(2).round()).div(50)
          return mult
        },
    },
},
})
addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    passiveGeneration(){
      return hasMilestone("a", 2) ? 1 : 0
    },
    color: "#0070CC",
    requires: new Decimal(10000000), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade("p",12)) mult = mult.mul(3)
        if(hasAchievement("g",16)) mult = mult.mul(2)
        mult = mult.mul(buyableEffect("p",12))
        mult = mult.mul(hasUpgrade("a",14) ? (player.sk.cloningSkill.gte(15) ? new Decimal(32768).mul(new Decimal(1.2).pow(player.sk.cloningSkill.sub(15))) : new Decimal(2).pow(player.sk.cloningSkill)) : player.sk.cloningSkill.pow(1.1).add(1))
        if(hasAchievement("g",26)) mult = mult.mul(70)
        if(hasUpgrade("a",11)) mult = mult.mul(upgradeEffect("a",11))
        if(hasUpgrade("b",13)) mult = mult.mul(upgradeEffect("b",13))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        if(hasUpgrade("p",31)) exp = exp.mul(1.1)
        return exp
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    automate(){
      if (player.p.auto) {
        setBuyableAmount("p",11,tmp.p.buyables[11].canAfford?player.p.points.div(100000).log(10).floor().add(1):getBuyableAmount("p",11))
      }
      if (player.p.auto2) {
        setBuyableAmount("p",12,tmp.p.buyables[12].canAfford?player.p.points.div(1e12).log(100).floor().add(1):getBuyableAmount("p",12))
      }
      if (player.p.auto3) {
        setBuyableAmount("p",13,tmp.p.buyables[13].canAfford?player.p.points.div("1e220").log(1e10).floor().add(1):getBuyableAmount("p",13))
      }
    },
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.points.gte(1000000) || player.p.total.gte(1)},
    branches: ["n"],
    onPrestige() {
      if(hasUpgrade("p",21)) player.sk.points = player.sk.points.add(new Decimal(player.p.resetTime).div(2).mul(hasUpgrade("n",21)?4:1).min(new Decimal(1000).mul(hasUpgrade("n",21)?4:1)))
    },
    layerShown(){return hasUpgrade("p",25) || player.a.total.gte(1) || player.t.total.gte(1)},
    doReset(layer) {

    if (!(layers[layer].row > this.row)) return

    let keep = []
    if(hasMilestone("a",0)) keep.push("milestones")
    if(hasMilestone("a",1)) keep.push("upgrades")

    layerDataReset(this.layer, keep)

    },
    upgrades: {
      11: {
        title: "Point Multiplier II",
        description: "You figured out a way to gain <i>even more</i> points! Multiply point gain by 8.",
        cost: new Decimal(1),
      },
      12: {
        title: "Prestige Enhancement",
        description: "Go big or go home! Triple prestige point gain and gain 4x more points.",
        cost: new Decimal(2),
        unlocked() {return hasUpgrade("p",11) || player.a.total.gte(1)}
      },
      13: {
        title: "Prestige Bonus",
        description: "Gain more points based on total prestige points.",
        cost: new Decimal(10),
        unlocked() {return hasUpgrade("p",11) || player.a.total.gte(1)},
        effect(){return player.p.total.gte("1e200") ? new Decimal("1e100").mul(player.p.total.div("1e200").pow(0.2)) : player.p.total.pow(0.5).add(1)},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      14: {
        title: "Synergism be like",
        description: "Gain more points based on total point buyables bought.",
        cost: new Decimal(5000),
        unlocked() {return hasMilestone("p",1) || player.a.total.gte(1)},
        effect(){return getBuyableAmount("n",11).add(getBuyableAmount("n",12)).add(getBuyableAmount("n",13)).add(1)},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      15: {
        title: "Buyable Unlocks",
        description: "It's time to do some science. Unlock 2 new buyables.",
        cost: new Decimal(200000),
        unlocked() {return hasUpgrade("p",14) || player.a.total.gte(1)}
      },
      21: {
        title: "Level Up",
        description: "Unlock Skills.",
        cost: new Decimal(5e12),
        unlocked() {return getBuyableAmount("p",12).gte(1) || player.a.total.gte(1)}
      },
      22: {
        title: "Short & Simple",
        description: "Multiply point gain by 1e10.",
        cost: new Decimal(4.44e44),
        unlocked() {return hasUpgrade("p",21) || player.a.total.gte(1)}
      },
      23: {
        title: "Self-Synergy",
        description: "Gain more points based on points. This is getting meta.",
        cost: new Decimal(1e62),
        unlocked() {return hasUpgrade("p",21) || player.a.total.gte(1)},
        effect(){return player.points.gte("1e320") ? new Decimal("1e48").mul(player.points.div("1e320").pow(0.04)) : player.points.pow(0.15).add(1)},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      24: {
        title: "Virgin Upgrade Bonus",
        description: "Gain more points based on prestige upgrades bought. bad upgrade 1/10",
        cost: new Decimal(1e72),
        unlocked() {return hasUpgrade("p",23) || player.a.total.gte(1)},
        effect(){return new Decimal(hasUpgrade("a",13)?1000:60).pow(player.p.upgrades.length)},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      25: {
        title: "Chad Tax Evasion",
        description: "Slightly weaken the taxes softcap.",
        cost: new Decimal(1e81),
        unlocked() {return hasUpgrade("p",23) || player.a.total.gte(1)},
      },
      31: {
        title: "Prestige Exponential",
        description: "It's time to pull out the exponents. Prestige points ^1.1!",
        cost: new Decimal("1e360"),
        unlocked() {return hasUpgrade("a",23)},
      },
      32: {
        title: "Yoshi Commits Tax Fraud",
        description: "The taxes softcap is weaker (again).",
        cost: new Decimal("1e420"),
        unlocked() {return hasUpgrade("a",23)},
      },
      33: {
        title: "Skill Booster",
        description: "The Temporal Skill is more effective.",
        cost: new Decimal("1e700"),
        unlocked() {return hasUpgrade("a",23)},
      },
    },
    buyables: {
      11: {
        title: "Point Quadrupler",
        cost(x) { return new Decimal(100000).mul(new Decimal(10).pow(x)) },
        display() {return `Quadruple point gain every time you buy this!\nTimes Bought: ${format(getBuyableAmount(this.layer, this.id))}\nCost: ${format(this.cost())}\nEffect: ${format(this.effect())}x points`},
        canAfford() {return player.p.points.gte(this.cost())},
        buy() {
            player.p.points = player.p.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        unlocked() { return hasUpgrade("p",15) || player.a.total.gte(1) },
        effect(x) {
          mult = getBuyableAmount("p",11).gte(25) ? new Decimal(4).pow(25).mul(new Decimal(2.5).pow(x.sub(25))) : new Decimal(4).pow(x)
          return mult
        },
      },
      12: {
        title: "Prestige Point Doubler",
        cost(x) { return new Decimal(1e12).mul(new Decimal(100).pow(x)) },
        display() {return `Double prestige point gain every time you buy this!\nTimes Bought: ${format(getBuyableAmount(this.layer, this.id))}\nCost: ${format(this.cost())}\nEffect: ${format(this.effect())}x prestige points`},
        canAfford() {return player.p.points.gte(this.cost())},
        buy() {
            player.p.points = player.p.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        unlocked() { return hasUpgrade("p",15) || player.a.total.gte(1) },
        effect(x) {
          mult = new Decimal(2).pow(x)
          return mult
        },
      },
      13: {
        title: "Point Booster",
        cost(x) { return new Decimal(1e220).mul(new Decimal(1e10).pow(x)) },
        display() {return `Multiply point gain by 100 every time you buy this!\nTimes Bought: ${format(getBuyableAmount(this.layer, this.id))}\nCost: ${format(this.cost())}\nEffect: ${format(this.effect())}x points`},
        canAfford() {return player.p.points.gte(this.cost())},
        buy() {
            player.p.points = player.p.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        unlocked() { return hasUpgrade("a",15) || player.a.total.gte(1) },
        effect(x) {
          mult = getBuyableAmount("p",13).gte(60) ? new Decimal(100).pow(60).mul(new Decimal(10).pow(x.sub(60))) : new Decimal(100).pow(x)
          return mult
        },
      },
    },
    milestones: {
    0: {
        requirementDescription: "50 prestige points",
        effectDescription: "Autobuy Generators without subtracting from your point amount.",
        done() { return player.p.points.gte(50) },
        toggles: [
          ["n","auto"],
        ]
    },
    1: {
        requirementDescription: "1,000 prestige points",
        effectDescription: "Autobuy Time Accelerators without subtracting from your point amount.",
        done() { return player.p.points.gte(1000) },
        toggles: [
          ["n","auto2"],
        ]
    },
    2: {
        requirementDescription: "100,000 prestige points",
        effectDescription: "Autobuy Duplicators without subtracting from your point amount.",
        done() { return player.p.points.gte(100000) },
        toggles: [
          ["n","auto3"],
        ]
    },
    3: {
        requirementDescription: "500,000 prestige points",
        effectDescription: "Keep Point Upgrades on Prestige.",
        done() { return player.p.points.gte(500000) },
    },
    4: {
        requirementDescription: "1e20 prestige points",
        effectDescription: "Autobuy Accelerator Boosts without subtracting from your point amount.",
        done() { return player.p.points.gte(1e20) },
        unlocked() { return hasUpgrade("p",21) || player.a.total.gte(1) },
        toggles: [
          ["n","auto4"],
        ]
    },
  },
})
addLayer("a", {
    name: "ascension", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#D2D900",
    requires: new Decimal("1e100"), // Can be a function that takes requirement increases into account
    resource: "ascension points", // Name of prestige currency
    baseResource: "prestige points", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.02, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade("a",12)) mult = mult.mul(upgradeEffect("a",12))
        if(hasAchievement("g",35)) mult = mult.mul(5)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "a", description: "A: Reset for ascension points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("p",25) || player.a.total.gte(1)},
    doReset(layer) {

    if (!(layers[layer].row > this.row)) return

    let keep = []

    layerDataReset(this.layer, keep)

    },
    branches: ["p"],
    onPrestige() {
      if(hasAchievement("g",34)) player.sk.points = player.sk.points.add(new Decimal(player.a.resetTime).mul(1.5).mul(hasUpgrade("n",21)?4:1).min(new Decimal(5000).mul(hasUpgrade("n",21)?4:1)))
    },
    upgrades: {
      11: {
        title: "Ascension Bonus",
        description: "Gain more prestige points based on total ascension points.",
        cost: new Decimal(15),
        unlocked() {return hasMilestone("a",2)},
        effect(){return player.a.total.pow(5).add(1)},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      12: {
        title: "Ascended Points",
        description: "Gain more ascension points based on points.",
        cost: new Decimal(40),
        unlocked() {return hasUpgrade("a",11)},
        effect(){return player.points.add(1).log10().div(50).add(1)},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      13: {
        title: "Scott the Woz",
        description: "<i>'It's f*cking Mario Kart again!'</i><br><b>Virgin Upgrade Boost</b> is more effective.",
        cost: new Decimal(300),
        unlocked() {return hasUpgrade("a",12)},
      },
      14: {
        title: "Large-Scale Mitosis",
        description: "The Cloning Skill is more effective.",
        cost: new Decimal(750),
        unlocked() {return hasUpgrade("a",12)},
      },
      15: {
        title: "Buyable Unlock II",
        description: "Unlock the 3rd prestige buyable.",
        cost: new Decimal(10000),
        unlocked() {return hasUpgrade("a",14)},
      },
      21: {
        title: "Advanced Training",
        description: "Unlock a new Skill.",
        cost: new Decimal(400000),
        unlocked() {return hasUpgrade("a",15)},
      },
      22: {
        title: "Boosted",
        description: "Unlock Boosters.",
        cost: new Decimal(1e8),
        unlocked() {return hasUpgrade("n",21)},
      },
      23: {
        title: "The Prestige Key",
        description: "Not to be confused with 'The Prestige Tree'. Unlock 3 new prestige upgrades.",
        cost: new Decimal(2e8),
        unlocked() {return hasUpgrade("a",22)},
      },
    },
    milestones: {
    0: {
        requirementDescription: "2 total ascension points",
        effectDescription: "Keep prestige milestones on Ascension. You earned those, you should keep 'em!",
        done() { return player.a.total.gte(2) },
    },
    1: {
        requirementDescription: "3 total ascension points",
        effectDescription: "Keep prestige upgrades on Ascension and autobuy prestige buyables.",
        done() { return player.a.total.gte(3) },
        toggles: [
          ["p","auto"],
          ["p","auto2"],
        ]
    },
    2: {
        requirementDescription: "5 total ascension points",
        effectDescription: "Generate 100% of prestige point gain every second.",
        done() { return player.a.total.gte(5) },
    },
    3: {
        requirementDescription: "200,000 ascension points",
        effectDescription: "Autobuy the 3rd prestige buyable.",
        done() { return player.a.points.gte(200000) },
        unlocked() { return hasUpgrade("a",15) },
        toggles: [
          ["p","auto3"],
        ]
    },
  },
})
addLayer("b", {
    name: "boosters", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    canBuyMax(){
      return hasMilestone("b", 0) ? 1 : 0
    },
    tabFormat: [
    ["display-text", () => `You have <h2 style="color: #0000FF; text-shadow: 0px 0px 10px #0000FF">${format(player.b.points)}</h2> boosters, multiplying point gain by <h2 style="color: #0000FF; text-shadow: 0px 0px 10px #0000FF">${format(boosterEffect())}</h2>x (unaffected by taxes!)`],
    "prestige-button",
    ["display-text", () => `You have ${format(player.points)} points<br><br>`],
    "milestones",
    "buyables",
    "upgrades",
    ],
    color: "#0000FF",
    requires: new Decimal("1e700"), // Can be a function that takes requirement increases into account
    resource: "boosters", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    base() {
      return new Decimal(1e10)
    },
    exponent: new Decimal(1.5),
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    position: 1,
    hotkeys: [
        {key: "b", description: "B: Reset for boosters", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("a",22) || player.b.total.gte(1)},
    doReset(layer) {

    if (!(layers[layer].row > this.row)) return

    let keep = []

    layerDataReset(this.layer, keep)

    },
    branches: ["p"],
    upgrades: {
      11: {
        title: "Boosting To The Max",
        description: "You gave your boosters better conduction, which triples the booster base.",
        cost: new Decimal(3),
      },
      12: {
        title: "Prestigious Boosters",
        description: "The booster base is multiplied by your prestige points at a reduced rate.",
        cost: new Decimal(5),
        effect(){return player.p.points.add(1).log(10).div(50).add(1)},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      13: {
        title: "Boosting Everything!",
        description: "Boosters also boost prestige point gain at a reduced rate.",
        cost: new Decimal(20),
        unlocked() {return hasUpgrade("b",12)},
        effect(){return boosterEffect().pow(0.1)},
        effectDisplay(){return `x${format(this.effect())}`}
      },
    },
    milestones: {
    0: {
        requirementDescription: "20 boosters",
        effectDescription: "You can buy max boosters.",
        done() { return player.b.points.gte(20) },
    },
  },
})
function boosterEffect() {
  let mult = new Decimal(100)
  if(hasUpgrade("b",11)) mult = mult.mul(3)
  if(hasUpgrade("b",12)) mult = mult.mul(upgradeEffect("b",12))
  mult = mult.pow(player.b.points)
  if(mult.gte(1e100)) mult = mult.pow(0.5).mul(new Decimal(1e50))
  return mult
}