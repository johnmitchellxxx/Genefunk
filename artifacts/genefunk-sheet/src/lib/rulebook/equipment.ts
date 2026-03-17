// ─── CH4: ARMOR ───────────────────────────────────────────────────────────────

export type ArmorCategory = 'Light' | 'Medium' | 'Heavy';

export interface ArmorData {
  name: string;
  category: ArmorCategory;
  cost: string;
  mass: number;
  conspicuous: 'None' | 'Concealable' | 'Obvious';
  strengthReq: number | null;
  stealthDisadvantage: boolean;
  acFormula: string;
  dr: number;
}

export const ARMOR: ArmorData[] = [
  // Light Armor
  { name: "Heavy Clothing",         category: "Light",   cost: "シ200",     mass: 2,  conspicuous: "None",        strengthReq: null, stealthDisadvantage: false, acFormula: "11 + Dex",         dr: 0 },
  { name: "Reinforced Clothing",    category: "Light",   cost: "シ600",     mass: 2,  conspicuous: "None",        strengthReq: null, stealthDisadvantage: false, acFormula: "12 + Dex",         dr: 0 },
  { name: "Armor Vest",             category: "Light",   cost: "シ2,500",   mass: 2,  conspicuous: "None",        strengthReq: null, stealthDisadvantage: false, acFormula: "13 + Dex",         dr: 0 },
  { name: "Nanofiber Vest",         category: "Light",   cost: "シ6,000",   mass: 3,  conspicuous: "None",        strengthReq: null, stealthDisadvantage: false, acFormula: "14 + Dex",         dr: 0 },
  { name: "Durile Outfit",          category: "Light",   cost: "シ7,000",   mass: 6,  conspicuous: "None",        strengthReq: null, stealthDisadvantage: false, acFormula: "13 + Dex",         dr: 2 },
  { name: "Bushiweave Vest",        category: "Light",   cost: "シ12,000",  mass: 3,  conspicuous: "None",        strengthReq: null, stealthDisadvantage: false, acFormula: "15 + Dex",         dr: 0 },
  { name: "Spyder Sylk Outfit",     category: "Light",   cost: "シ15,000",  mass: 2,  conspicuous: "None",        strengthReq: null, stealthDisadvantage: false, acFormula: "14 + Dex",         dr: 2 },
  { name: "SharkSkin Vest",         category: "Light",   cost: "シ35,000",  mass: 2,  conspicuous: "None",        strengthReq: null, stealthDisadvantage: false, acFormula: "16 + Dex",         dr: 0 },
  { name: "Bushiweave Outfit",      category: "Light",   cost: "シ60,000",  mass: 5,  conspicuous: "None",        strengthReq: null, stealthDisadvantage: false, acFormula: "15 + Dex",         dr: 4 },
  { name: "SharkSkin Outfit",       category: "Light",   cost: "シ100,000", mass: 3,  conspicuous: "None",        strengthReq: null, stealthDisadvantage: false, acFormula: "16 + Dex",         dr: 4 },
  { name: "Atomos Outfit",          category: "Light",   cost: "シ300,000", mass: 5,  conspicuous: "None",        strengthReq: null, stealthDisadvantage: false, acFormula: "17 + Dex",         dr: 6 },
  // Medium Armor
  { name: "Kevlar Body Armor",      category: "Medium",  cost: "シ2,500",   mass: 10, conspicuous: "Concealable", strengthReq: 13,   stealthDisadvantage: true,  acFormula: "17 + Dex (max +2)", dr: 2 },
  { name: "Plate Vest",             category: "Medium",  cost: "シ2,500",   mass: 5,  conspicuous: "Concealable", strengthReq: null, stealthDisadvantage: false, acFormula: "15 + Dex (max +4)", dr: 0 },
  { name: "Durile Assault Suit",    category: "Medium",  cost: "シ15,000",  mass: 8,  conspicuous: "Concealable", strengthReq: null, stealthDisadvantage: false, acFormula: "16 + Dex (max +4)", dr: 2 },
  { name: "Ceramic Plate Body Armor",category: "Medium", cost: "シ18,000",  mass: 12, conspicuous: "Concealable", strengthReq: 13,   stealthDisadvantage: true,  acFormula: "17 + Dex (max +2)", dr: 4 },
  { name: "Durile Plate Body Armor",category: "Medium",  cost: "シ30,000",  mass: 12, conspicuous: "Concealable", strengthReq: 13,   stealthDisadvantage: true,  acFormula: "18 + Dex (max +2)", dr: 4 },
  { name: "Bushiweave Body Armor",  category: "Medium",  cost: "シ75,000",  mass: 8,  conspicuous: "Concealable", strengthReq: null, stealthDisadvantage: false, acFormula: "18 + Dex (max +4)", dr: 4 },
  { name: "Spyder Sylk Assault Suit",category: "Medium", cost: "シ75,000",  mass: 11, conspicuous: "Concealable", strengthReq: 13,   stealthDisadvantage: true,  acFormula: "19 + Dex (max +3)", dr: 6 },
  { name: "SharkSkin Assault Suit", category: "Medium",  cost: "シ150,000", mass: 9,  conspicuous: "Concealable", strengthReq: 13,   stealthDisadvantage: true,  acFormula: "20 + Dex (max +3)", dr: 6 },
  { name: "Atomos Assault Suit",    category: "Medium",  cost: "シ450,000", mass: 12, conspicuous: "Concealable", strengthReq: 13,   stealthDisadvantage: true,  acFormula: "21 + Dex (max +3)", dr: 8 },
  // Heavy Armor
  { name: "Worn Plate Suit",        category: "Heavy",   cost: "シ3,000",   mass: 16, conspicuous: "Obvious",     strengthReq: 15,   stealthDisadvantage: true,  acFormula: "18",               dr: 4 },
  { name: "Ballistic Plate Suit",   category: "Heavy",   cost: "シ10,000",  mass: 16, conspicuous: "Obvious",     strengthReq: 15,   stealthDisadvantage: true,  acFormula: "20",               dr: 4 },
  { name: "Ballistic Shield",       category: "Heavy",   cost: "シ10,000",  mass: 5,  conspicuous: "Obvious",     strengthReq: 15,   stealthDisadvantage: true,  acFormula: "+2 (reaction)",    dr: 0 },
  { name: "Hard Shell Suit",        category: "Heavy",   cost: "シ20,000",  mass: 18, conspicuous: "Obvious",     strengthReq: 15,   stealthDisadvantage: true,  acFormula: "21",               dr: 4 },
  { name: "Heavy Battle Suit",      category: "Heavy",   cost: "シ60,000",  mass: 16, conspicuous: "Obvious",     strengthReq: 13,   stealthDisadvantage: true,  acFormula: "22",               dr: 6 },
  { name: "Turtletek Battle Suit",  category: "Heavy",   cost: "シ170,000", mass: 21, conspicuous: "Obvious",     strengthReq: 15,   stealthDisadvantage: true,  acFormula: "23",               dr: 8 },
  { name: "Atomos Battle Suit",     category: "Heavy",   cost: "シ500,000", mass: 23, conspicuous: "Obvious",     strengthReq: 15,   stealthDisadvantage: true,  acFormula: "24",               dr: 10 },
  { name: "Artemis Battle Suit",    category: "Heavy",   cost: "シ950,000", mass: 25, conspicuous: "Obvious",     strengthReq: 15,   stealthDisadvantage: true,  acFormula: "25",               dr: 10 },
];

// ─── CH4: ARMOR UPGRADES ──────────────────────────────────────────────────────

export interface ArmorUpgradeData {
  name: string;
  cost: string;
  mass: number;
  prerequisite: 'None' | 'Medium Armor' | 'Heavy Armor';
  effect: string;
}

export const ARMOR_UPGRADES: ArmorUpgradeData[] = [
  { name: "Artificial Muscles",        cost: "シ15,000",  mass: 2,  prerequisite: "None",         effect: "+2 to Strength score." },
  { name: "Autonomous Environment",    cost: "シ8,000",   mass: 5,  prerequisite: "Medium Armor",  effect: "Sealed environment: immune to breathable/contact poison, gas, can breathe underwater." },
  { name: "Chromomorphic",             cost: "シ300",     mass: 0,  prerequisite: "None",          effect: "Armor can change color and pattern, including transparency, at will." },
  { name: "Cloak",                     cost: "シ50,000",  mass: 0,  prerequisite: "None",          effect: "Armor turns invisible. Has no effect on gear outside the armor." },
  { name: "Electric Discharge, Basic", cost: "シ10,000",  mass: 4,  prerequisite: "Medium Armor",  effect: "Reaction: 5d8 electrical damage (DC 15 Con save for half) to melee attacker. Recharges after 1 hour." },
  { name: "Electric Discharge, Premium",cost: "シ50,000", mass: 6,  prerequisite: "Medium Armor",  effect: "Reaction: 6d10 electrical damage (DC 15 Con save for half) to melee attacker. Recharges after 1 hour." },
  { name: "Electrical Insulation",     cost: "シ5,000",   mass: 12, prerequisite: "Medium Armor",  effect: "Resistance to electrical damage." },
  { name: "Exoskeleton, Light",        cost: "シ75,000",  mass: 10, prerequisite: "Medium Armor",  effect: "Your Strength score becomes 22 (if lower)." },
  { name: "Exoskeleton, Heavy",        cost: "シ300,000", mass: 20, prerequisite: "Heavy Armor",   effect: "Your Strength score becomes 28 (if lower)." },
  { name: "Hyper Jumping, Basic",      cost: "シ20,000",  mass: 3,  prerequisite: "Medium Armor",  effect: "Triple jump distance; fall 10 m without damage." },
  { name: "Hyper Jumping, Premium",    cost: "シ100,000", mass: 6,  prerequisite: "Heavy Armor",   effect: "Jump distance ×6; fall 20 m without damage." },
  { name: "Mechanical Capacitor",      cost: "シ20,000",  mass: 5,  prerequisite: "Medium Armor",  effect: "Store kinetic energy; release as +2d10 melee damage or jump ×6. Recharges after 1 hour." },
  { name: "Medicomp",                  cost: "シ35,000",  mass: 1,  prerequisite: "Medium Armor",  effect: "Holds 20 drug doses; dispense one as a bonus action." },
  { name: "Speed Upgrade, Basic",      cost: "シ20,000",  mass: 4,  prerequisite: "Medium Armor",  effect: "Speed becomes 12 m (if lower)." },
  { name: "Speed Upgrade, Premium",    cost: "シ70,000",  mass: 7,  prerequisite: "Medium Armor",  effect: "Speed becomes 15 m (if lower)." },
  { name: "Speed Upgrade, Ultimate",   cost: "シ250,000", mass: 10, prerequisite: "Medium Armor",  effect: "Speed becomes 18 m (if lower)." },
  { name: "Thermal Insulation",        cost: "シ5,000",   mass: 12, prerequisite: "Medium Armor",  effect: "Resistance to heat and cold damage." },
];

// ─── CH4: AMMUNITION ─────────────────────────────────────────────────────────

export interface AmmunitionData {
  name: string;
  cost: string;
  effect: string;
}

export const AMMUNITION: AmmunitionData[] = [
  { name: "Regular Magazine",    cost: "シ25",     effect: "Standard ammunition." },
  { name: "Armor-piercing",      cost: "シ200",    effect: "Gains armor-piercing property. Banned in most countries." },
  { name: "Baton",               cost: "シ150",    effect: "Bludgeoning damage instead of piercing." },
  { name: "Cryo",                cost: "シ5,000",  effect: "Shotgun only. Cold damage instead of piercing. Banned in most countries." },
  { name: "Explosive",           cost: "シ1,000",  effect: "Treat 1s and 2s on damage dice as 3s. Banned in almost every country." },
  { name: "HEAP",                cost: "シ3,000",  effect: "Armor-piercing + treat 1s/2s as 3s. Banned in almost every country." },
  { name: "Incendiary",          cost: "シ500",    effect: "Combustible materials catch fire (1d6 heat/turn until extinguished)." },
  { name: "Shock",               cost: "シ1,000",  effect: "Shotgun only. Half damage, electrical type. DC 10 Con save or stunned until end of next turn." },
];

// ─── CH4: GEAR ───────────────────────────────────────────────────────────────

export interface GearData {
  name: string;
  cost: string;
  mass: number | string;
  effect: string;
  category: 'Surveillance' | 'Tools' | 'Medical' | 'Optical' | 'Communication' | 'Mobility' | 'Misc';
}

export const GEAR: GearData[] = [
  { name: "Anti-Surveillance Kit",   cost: "シ30,000",  mass: 5,    category: "Surveillance",    effect: "Detects/blocks wireless transmissions, bugs, and microphones in a 5 m radius." },
  { name: "Ball Bearings",           cost: "シ25",      mass: 2,    category: "Tools",            effect: "Cover 2×2 m area; DC 10 Dex save or fall prone." },
  { name: "Binoculars",              cost: "シ100",     mass: 1,    category: "Optical",          effect: "Zoom up to 1.5 km. Compatible with goggle add-ons." },
  { name: "Biohacking Kit",          cost: "シ1,000",   mass: 2,    category: "Medical",          effect: "20 uses of reagents required to run injection hacks." },
  { name: "Bolt Cutters",            cost: "シ100",     mass: 1,    category: "Tools",            effect: "Cuts wires, padlocks, and chain-link fences." },
  { name: "BCI (Brain-Computer Interface)", cost: "シ200", mass: 0.5, category: "Communication",  effect: "Wearable computer for those without a daemon; provides similar functions." },
  { name: "Breathing Mask",          cost: "シ300",     mass: 1,    category: "Medical",          effect: "30 min breathable air; protects from tear gas and similar inhaled effects." },
  { name: "Bug Detector",            cost: "シ1,500",   mass: 1,    category: "Surveillance",     effect: "Wand that detects hidden recording devices." },
  { name: "Caltrops",                cost: "シ150",     mass: 0.5,  category: "Tools",            effect: "Cover 1 m area; DC 15 Dex save or take 1 piercing damage and speed halved." },
  { name: "Climbing Gear",           cost: "シ200",     mass: 3,    category: "Mobility",         effect: "Rope, rappelling harness, pitons; prevents falling more than 8 m from anchor." },
  { name: "Cloaking Coating",        cost: "シ3,000/kg",mass: 0,    category: "Surveillance",     effect: "Coats objects with perfect camouflage; object becomes invisible on command." },
  { name: "Collapsible Ladder",      cost: "シ50",      mass: 5,    category: "Mobility",         effect: "4 m ladder that collapses to backpack size. Takes 1 turn to assemble." },
  { name: "Crowbar",                 cost: "シ25",      mass: 2,    category: "Tools",            effect: "Advantage on Strength checks where leverage applies." },
  { name: "Disguise Kit",            cost: "シ400",     mass: 4,    category: "Misc",             effect: "Skin pigments, hair dyes, prosthetics. Use Charisma (Deception/Performance) to impersonate." },
  { name: "Distance Microphone",     cost: "シ500",     mass: 2,    category: "Surveillance",     effect: "Listen to events in a 5 m radius up to 100 m (shotgun) or 300 m (parabolic) away." },
  { name: "Faraday Shielding",       cost: "Varies",   mass: 0,    category: "Tools",            effect: "+5 (×1/10 cost), +10 (×1/4 cost), or +15 bonus to saving throw vs. EMP." },
  { name: "First Aid Kit",           cost: "シ50",      mass: 2,    category: "Medical",          effect: "10 uses. Stabilize a creature at 0 hp without a Life Science check." },
  { name: "Flashlight",              cost: "シ25",      mass: 1,    category: "Tools",            effect: "6 m bright light, 6 m dim light (larger models up to 15 m)." },
  { name: "Forensic Field Kit",      cost: "シ500",     mass: 2,    category: "Surveillance",     effect: "Fingerprint tape, chemicals for blood/GSR/DNA detection. Advantage on Investigation." },
  { name: "Forensic Scanner",        cost: "シ20,000",  mass: 2,    category: "Surveillance",     effect: "Determines chemical makeup and DNA sequence of samples in a 1 m³ area." },
  { name: "Freezing Spray",          cost: "シ800",     mass: 2,    category: "Tools",            effect: "Freezes and weakens materials. As weapon: 1d6 cold damage (Dex save for half) within 1.5 m." },
  { name: "Frictionless Spray",      cost: "シ1,000",   mass: 1,    category: "Tools",            effect: "+10 Dex to escape bonds/grabs; 1 m frictionless patch (DC 14 Dex or fall prone); 10 uses." },
  { name: "Gadget Hack Kit",         cost: "シ1,000",   mass: 2,    category: "Tools",            effect: "20 uses of consumable parts needed to run gadget hacks." },
  { name: "Gecko Gear",              cost: "シ15,000",  mass: 2,    category: "Mobility",         effect: "Climbing speed equal to walk speed; climb sheer surfaces without Athletics checks." },
  { name: "Goggles (base)",          cost: "シ25",      mass: 1,    category: "Optical",          effect: "Protects eyes from gases and bright flashes; immune to blinding from those sources." },
  { name: "Goggles — Dark",          cost: "シ500",     mass: 0,    category: "Optical",          effect: "See normally in darkness up to 36 m." },
  { name: "Goggles — Macroscopic",   cost: "シ100",     mass: 0,    category: "Optical",          effect: "Zoom up to 1.5 km; displays exact distance in meters." },
  { name: "Goggles — Penetration",   cost: "シ5,000",   mass: 0,    category: "Optical",          effect: "See through walls up to 30 m. Disadvantage on attacks and Dex checks; speed ÷3." },
  { name: "Goggles — Spectrum",      cost: "シ5,000",   mass: 0,    category: "Optical",          effect: "See in lightly obscured areas normally; heavily obscured as lightly. See invisible things." },
  { name: "GPS Tracking Device",     cost: "シ75",      mass: 0,    category: "Surveillance",     effect: "Track device location within 2 m radius; adhesive, DC 18/20 Perception to spot." },
  { name: "Grappling Hook",          cost: "シ25",      mass: 1,    category: "Mobility",         effect: "Attach to rooftops, ledges, walls. Throw 5 m vertical + 1 m per Str modifier." },
  { name: "Grapnel Launcher",        cost: "シ1,000",   mass: 3,    category: "Mobility",         effect: "Fires grappling hook 30 m; motor hoists 200 kg at 2 m/turn." },
  { name: "Handcuffs",               cost: "シ50",      mass: 1,    category: "Tools",            effect: "DC 30 Str or Dex (Acrobatics) to escape. DC 20 Mechanics to pick. DR 10, 15 hp." },
  { name: "Hypospray",               cost: "シ500",     mass: 1,    category: "Medical",          effect: "Administers drugs through skin/armor. Requires willing, helpless, or unaware target (or feat)." },
  { name: "Jammer — Mini",           cost: "シ1,500",   mass: 1,    category: "Communication",    effect: "Jams wireless communications in 4 m radius." },
  { name: "Jammer — Low Power",      cost: "シ3,000",   mass: 2,    category: "Communication",    effect: "Jams wireless communications in 10 m radius." },
  { name: "Jammer — Medium",         cost: "シ12,500",  mass: 5,    category: "Communication",    effect: "Jams wireless communications in 30 m radius." },
  { name: "Jammer — High",           cost: "シ50,000",  mass: 15,   category: "Communication",    effect: "Jams wireless communications in 100 m radius (1 km with masted antenna)." },
  { name: "Lock Picks",              cost: "シ50",      mass: 0.5,  category: "Tools",            effect: "Tools to pick mechanical locks (not electrical)." },
  { name: "Mechanic's Tools",        cost: "シ1,000",   mass: 6,    category: "Tools",            effect: "Hammer, tape, pliers, mini torch, etc. Can pick mechanical and electrical locks." },
  { name: "Micro-Drone",             cost: "シ3,000",   mass: 0,    category: "Surveillance",     effect: "Insect-sized drone; follows basic directions and records 30 hrs of audio/video." },
  { name: "Mini-Breather",           cost: "シ300",     mass: 1,    category: "Medical",          effect: "10 min of breathable air from beverage-can canister. Extra canisters シ50 each." },
  { name: "Metal Detector",          cost: "シ200",     mass: 1,    category: "Tools",            effect: "Detects metals within 1 m radius." },
  { name: "Parachute Set",           cost: "シ3,000",   mass: 20,   category: "Mobility",         effect: "No falling damage from 50 m+; halves falling damage if deployed below 50 m." },
  { name: "Rope (15 m)",             cost: "シ25",      mass: 4,    category: "Tools",            effect: "2 hp, DC 17 Str to burst. Spyder Sylk version is 10× cost and 1/10 weight." },
  { name: "Scuba Gear",              cost: "シ400",     mass: 10,   category: "Mobility",         effect: "4 hrs of oxygen; +5 to swim Athletics. Premium version breathes underwater to 15 m depth." },
  { name: "Silencer",                cost: "シ500",     mass: 0.5,  category: "Tools",            effect: "Muffles gun. Detected only by passive Perception 15+." },
  { name: "Sleeping Bag",            cost: "シ250",     mass: 2,    category: "Misc",             effect: "Insulated sleeping bag. Premium thermal version (5×) keeps warm in extreme cold." },
  { name: "Spike Strip",             cost: "シ300",     mass: 6,    category: "Tools",            effect: "Deployed across road; punctures vehicle tires, halving speed until repaired." },
  { name: "Tent",                    cost: "シ250",     mass: 10,   category: "Misc",             effect: "Shelter from wind and rain." },
  { name: "Wall Microphone",         cost: "シ500",     mass: 0.5,  category: "Surveillance",     effect: "Hear conversations on the other side of surfaces up to 50 cm thick." },
  { name: "Wingsuit",                cost: "シ1,000",   mass: 1,    category: "Mobility",         effect: "Falling speed 36 m/round; glide speed 18 m. Need parachute for final 50 m." },
];

// Equipment packs (starting gear bundles)
export interface EquipmentPackData {
  name: string;
  cost: string;
  contents: string;
}

export const EQUIPMENT_PACKS: EquipmentPackData[] = [
  { name: "Biohacker's Pack",  cost: "シ2,600",  contents: "Backpack/duffel bag, 2× angel, 2× nanodoc, 2× nootro, 2× perk, biohacking kit, breathing mask, first aid kit, flashlight, forensic field kit, goggles, hypospray." },
  { name: "Gangster's Pack",   cost: "シ1,400",  contents: "Backpack/duffel bag, 2× hype, 2× nanodoc, 2× wrath, bolt cutters, crowbar, freezing spray, handcuffs." },
  { name: "Merc's Pack",       cost: "シ1,300",  contents: "Backpack/duffel bag, binoculars, breathing mask, caltrops, climbing gear, 2× nanodoc, grappling hook, crowbar, flashlight, first aid kit, handcuffs, mini-breather, spike strip." },
  { name: "Spy's Pack",        cost: "シ4,000",  contents: "Backpack/duffel bag, disguise kit, 2× nanodoc, binoculars, bug detector, caltrops, crowbar, distance microphone, flashlight, 2× tracking device, wall microphone." },
  { name: "Tech's Pack",       cost: "シ3,700",  contents: "Backpack/duffel bag, ball bearings, bolt cutters, crowbar, 2× nanodoc, flashlight, freezing spray, frictionless spray, gadget hack kit, goggles, mechanic's tools." },
];

// ─── CH4: DRUGS ──────────────────────────────────────────────────────────────

export interface DrugData {
  name: string;
  cost: string;
  effect: string;
  duration: string;
  downside: string;
  addictionRoll: boolean;
}

export const DRUGS: DrugData[] = [
  { name: "Antipoison",          cost: "シ100",  addictionRoll: true,  duration: "1 hour",      effect: "Neutralizes one poison and grants immunity to that poison for 1 hour.",       downside: "Disadvantage on attacks and ability checks for 1 hour after (nausea)." },
  { name: "Angel",               cost: "シ100",  addictionRoll: true,  duration: "1 hour",      effect: "Regain 2 hp every turn (stabilizes dying); used by medics.",                 downside: "1 level of exhaustion after." },
  { name: "Buddha",              cost: "シ100",  addictionRoll: true,  duration: "1 hour",      effect: "+2 Wisdom and Charisma. Must succeed DC 10 Wisdom save each turn to take a violent action.", downside: "None stated beyond Wisdom save." },
  { name: "Carnal",              cost: "シ100",  addictionRoll: true,  duration: "2 hours",     effect: "Advantage on Wisdom (Perception) and (Insight) checks.",                     downside: "1 level of exhaustion after." },
  { name: "Conventional Drugs",  cost: "シ5–50", addictionRoll: true,  duration: "Varies",      effect: "Alcohol, cannabis, cocaine, MDMA, LSD, heroin. GM-discretion on dis/advantage.", downside: "Varies by drug and level of inebriation." },
  { name: "Euvigil",             cost: "シ100",  addictionRoll: true,  duration: "1 hour",      effect: "Advantage on Constitution saving throws to maintain concentration on hacks/upgrades.", downside: "None stated." },
  { name: "Hype",                cost: "シ100",  addictionRoll: true,  duration: "30 minutes",  effect: "+2 Dexterity.",                                                              downside: "1 level of exhaustion after. Highly addictive." },
  { name: "Mars",                cost: "シ300",  addictionRoll: true,  duration: "30 minutes",  effect: "+2 Dexterity and +2 Strength.",                                              downside: "1 level of exhaustion after." },
  { name: "Nanodoc",             cost: "シ100",  addictionRoll: true,  duration: "Instant",     effect: "Regain 2d6 hit points.",                                                    downside: "None." },
  { name: "Nootro",              cost: "シ100",  addictionRoll: true,  duration: "1 hour",      effect: "+2 Intelligence, +2 Wisdom, +2 Charisma.",                                  downside: "1 level of exhaustion after." },
  { name: "Perk",                cost: "シ300",  addictionRoll: false, duration: "Instant",     effect: "Remove 1 level of exhaustion. Once per long rest.",                         downside: "Not addictive." },
  { name: "Shark",               cost: "シ500",  addictionRoll: false, duration: "30 minutes",  effect: "+2 Charisma.",                                                              downside: "Not addictive." },
  { name: "Superman",            cost: "シ50",   addictionRoll: true,  duration: "1 hour",      effect: "If reduced to 0 hp (and don't die outright): DC 15 Con save to drop to 1 hp instead. DC increases by 5 each subsequent use.", downside: "1 level of exhaustion after." },
  { name: "Wrath",               cost: "シ50",   addictionRoll: true,  duration: "30 minutes",  effect: "+4 Strength, −2 Intelligence, −2 Wisdom.",                                  downside: "2 levels of exhaustion after." },
];

// ─── CH4: POISONS ────────────────────────────────────────────────────────────

export interface PoisonData {
  name: string;
  cost: string;
  type: string;
  dc: number;
  effect: string;
}

export const POISONS: PoisonData[] = [
  { name: "Anesthetic",  cost: "シ1,000",  type: "Ingested / Inhaled / Injury", dc: 15, effect: "Poisoned for 1 hour; if fail by 5+, also unconscious. Wakes on damage or being shaken. Injury DC is 10 (or 15 with hypospray)." },
  { name: "Botulinum",   cost: "シ6,000",  type: "All",                         dc: 16, effect: "Poisoned for 1 hour; if fail by 5+, paralyzed. If fail by 10+, possible death (DM discretion)." },
  { name: "Cyanide",     cost: "シ50",     type: "Ingested / Inhaled",          dc: 16, effect: "4d6 poison damage and poisoned on a failed save." },
  { name: "Grey Goo",    cost: "シ20,000", type: "All",                         dc: 19, effect: "12d6 poison damage on a failed save; half damage on a successful one." },
  { name: "Heavy Metal", cost: "シ50",     type: "Ingested",                    dc: 16, effect: "1d12 poison damage and poisoned on a failed save; repeat save each day." },
  { name: "Hemovenom",   cost: "シ1,000",  type: "Injury",                      dc: 11, effect: "3d6 poison damage on a failed save and poisoned." },
  { name: "Necrovenom",  cost: "シ2,000",  type: "Injury",                      dc: 11, effect: "6d6 poison damage on a failed save; half on a successful one." },
  { name: "Neurovenom",  cost: "シ1,000",  type: "Injury",                      dc: 13, effect: "Poisoned on a failed save; if fail by 5+, unconscious." },
  { name: "Paralytic",   cost: "シ1,000",  type: "Injury",                      dc: 13, effect: "Poisoned and paralyzed on a failed save." },
  { name: "Ricin",       cost: "シ100",    type: "Ingested / Inhaled",          dc: 17, effect: "3d6 poison damage and poisoned on a failed save." },
  { name: "Nerve Agent", cost: "シ5,000",  type: "Ingested / Inhaled",          dc: 18, effect: "Poisoned on fail; if fail by 5+, paralyzed; if fail by 10+, unconscious; possible death." },
  { name: "Wendigo",     cost: "シ10,000", type: "All",                         dc: 17, effect: "9d6 poison damage on a failed save; half on a successful one." },
];

// Starting cash by level (Ch4 table)
export const STARTING_CASH_BY_LEVEL: Record<number, string> = {
  1: "Class starting gold",
  2: "シ25,000",
  3: "シ50,000",
  4: "シ100,000",
  5: "シ150,000",
  6: "シ225,000",
  7: "シ300,000",
  8: "シ400,000",
  9: "シ500,000",
  10: "シ650,000",
  11: "シ800,000",
  12: "シ1,000,000",
  13: "シ1,200,000",
  14: "シ1,500,000",
  15: "シ1,800,000",
  16: "シ2,200,000",
  17: "シ2,500,000",
  18: "シ3,000,000",
  19: "シ3,500,000",
  20: "シ4,000,000",
};

