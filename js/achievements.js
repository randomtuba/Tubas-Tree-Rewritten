addLayer("g", {
    name: "achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "★", // This appears on the layer's node. Default is the id with the first letter capitalized
    color: "#F5754E",
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    tooltip:"Achievements",
    resource: "achievements", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: "side", // Row the layer is in on the tree (0 is the first row)
tabFormat: [
    ["display-text", () => `You have ${player.g.achievements.length}/14 achievements (${format(new Decimal(player.g.achievements.length).div(14).mul(100))}%)<br><br>`],
    "achievements"
],
    layerShown(){return true},
  achievements: {
    11: {
        name: "Number go brr",
      done(){return getBuyableAmount("n",11).gte(1)},
      tooltip:"Buy the Generator."
    },
    12: {
        name: "I Am Speed",
      done(){return getBuyableAmount("n",12).gte(1)},
      tooltip:"Buy the Time Accelerator."
    },
    13: {
        name: "We've been duped!",
      done(){return getBuyableAmount("n",13).gte(1)},
      tooltip:"Buy the Duplicator."
    },
    14: {
        name: "Nice",
      done(){return player.points.gte(6969)},
      tooltip:"Reach 6,969 points."
    },
    15: {
        name: "Prestigious",
      done(){return player.p.points.gte(1)},
      tooltip:"Prestige."
    },
    16: {
        name: "Super Sonic Racing",
      done(){return getBuyableAmount("n",12).gte(18)},
      tooltip:"<span style='font-size:11px'><b>Reach a time speed of at least 50x. Reward: Gain 2x more prestige points.</b></span>"
    },
    21: {
        name: "Vacillation",
      done(){return player.points.gte(5e13) && getBuyableAmount("n",12).eq(0)},
      tooltip:"Reach 5e13 points without Time Accelerators. Reward: Gain 5 free Time Accelerators."
    },
    22: {
        name: "Ooh, buyables!",
      done(){return hasUpgrade("p",15)},
      tooltip:"Unlock Prestige Buyables."
    },
    23: {
        name: "No Cloning Theorem",
      done(){return hasUpgrade("p",15)},
      tooltip:"Reach 1e20 points without Duplicators. Reward: Unlock Accelerator Boosts."
    },
    24: {
        name: "It's Boostin' Time",
      done(){return getBuyableAmount("n",21).gte(3)},
      tooltip:"Buy 3 Accelerator Boosts."
    },
    25: {
        name: "Nice^10",
      done(){return player.points.gte(2.702e38)},
      tooltip:"Reach 2.70e38 points."
    },
    26: {
        name: "Super-Prestigious",
      done(){return player.p.upgrades.length >= 8},
      tooltip:"Buy 8 Prestige Upgrades. Reward: Gain 70x more prestige points."
    },
    31: {
        name: "When this baby hits 80 mph",
      done(){return player.sk.temporalSkill.gte(20)},
      tooltip:"Reach Level 20 Temporal Skill."
    },
    32: {
        name: "Point Planet",
      done(){return player.points.gte(1e160)},
      tooltip:"Reach 1e160 points."
    },
},
})

addLayer("sk", {
    name: "skills", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "↑", // This appears on the layer's node. Default is the id with the first letter capitalized
    color: "#34EB74",
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    temporalSkill: new Decimal(0),
    cloningSkill: new Decimal(0),
    }},
    tabFormat: [
    ["infobox","lore"],
    "main-display",
    ["display-text", () => `Experience is gained every time you reset, based on what layer and the amount of time spent in the run.<br><br><span style="color: yellow">Temporal Skill:</span> ${player.sk.temporalSkill}/1000<br><span style="color: purple">Cloning Skill:</span> ${player.sk.cloningSkill}/1000`],
    "clickables",
    ["display-text", () => `<span style="color: yellow">Temporal Skill gives free Time Accelerators and Accelerator Boosts</span><br><span style="color: purple">Cloning Skill gives free Duplicators and multiplies prestige point gain</span>`],
    ],
    resource: "experience", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: "side", // Row the layer is in on the tree (0 is the first row)
    position: 1,
    layerShown(){return hasUpgrade("p",21)},
    clickables: {
      11: {
        display() {return `Level up Temporal Skill<br>Cost: ${format(player.sk.temporalSkill.pow(1.5).add(1).floor())} EXP`},
        onClick() {
          player.sk.points = player.sk.points.sub(player.sk.temporalSkill.pow(1.5).add(1).floor())
          player.sk.temporalSkill = player.sk.temporalSkill.add(1)},
        canClick() {return player.sk.points.gte(player.sk.temporalSkill.pow(1.5).add(1).floor())},
      },
      12: {
        display() {return `Level up Cloning Skill<br>Cost: ${format(player.sk.cloningSkill.pow(2.5).add(1).floor())} EXP`},
        onClick() {
          player.sk.points = player.sk.points.sub(player.sk.cloningSkill.pow(2.5).add(1).floor())
          player.sk.cloningSkill = player.sk.cloningSkill.add(1)},
        canClick() {return player.sk.points.gte(player.sk.cloningSkill.pow(2.5).add(1).floor())},
      },
    },
})