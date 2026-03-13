export interface GenomeData {
  name: string;
  description: string;
  abilityBonuses: Partial<Record<AbilityKey, number>>;
  senses: Partial<Record<SenseKey, boolean>>;
  traits: { name: string; description: string }[];
  speed: number;
}

export interface ClassData {
  name: string;
  hitDie: number;
  savingThrows: AbilityKey[];
  armorProficiencies: string;
  weaponProficiencies: string;
  skillChoices: string[];
  numSkillChoices: number;
  featuresByLevel: Record<number, { name: string; description: string }[]>;
}

export interface BackgroundData {
  name: string;
  description: string;
  skillProficiencies: string[];
  featureName: string;
  featureDescription: string;
  toolProficiencies?: string;
  languages?: string;
}

export type AbilityKey = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';
export type SenseKey = 'acuteOlfaction' | 'darkvision' | 'macrovision' | 'microvision' | 'penetration' | 'spectrum';

export const GENOMES: GenomeData[] = [
  {
    name: "Baseline",
    description: "Unmodified human genome. Versatile and adaptable, Baselines represent the broad genetic heritage of unaltered humanity.",
    abilityBonuses: { strength: 1, dexterity: 1, constitution: 1, intelligence: 1, wisdom: 1, charisma: 1 },
    senses: {},
    traits: [
      { name: "Versatile", description: "You gain proficiency in one skill of your choice." },
      { name: "Determined", description: "When you fail a saving throw, you can reroll it. You must use the new roll. Once you use this trait, you can't use it again until you finish a long rest." },
    ],
    speed: 30,
  },
  {
    name: "Aquaform",
    description: "Spliced with aquatic DNA, Aquaforms possess gills, webbed digits, and enhanced underwater capabilities.",
    abilityBonuses: { constitution: 2, wisdom: 1 },
    senses: { darkvision: true },
    traits: [
      { name: "Amphibious", description: "You can breathe air and water." },
      { name: "Swim Speed", description: "You have a swimming speed of 30 feet." },
      { name: "Pressure Resistant", description: "You have resistance to cold damage." },
    ],
    speed: 30,
  },
  {
    name: "Avian",
    description: "Engineered with avian genetics, granting hollow bones, enhanced vision, and in some cases vestigial wing membranes.",
    abilityBonuses: { dexterity: 2, wisdom: 1 },
    senses: { macrovision: true },
    traits: [
      { name: "Keen Sight", description: "You have advantage on Wisdom (Perception) checks that rely on sight." },
      { name: "Lightweight Frame", description: "You can use your reaction to reduce falling damage by an amount equal to five times your level." },
      { name: "Talons", description: "Your unarmed strikes deal 1d4 slashing damage." },
    ],
    speed: 30,
  },
  {
    name: "Canid",
    description: "Spliced with canine DNA, Canids possess enhanced olfactory senses, pack instincts, and fierce loyalty.",
    abilityBonuses: { wisdom: 2, constitution: 1 },
    senses: { acuteOlfaction: true, darkvision: true },
    traits: [
      { name: "Keen Smell", description: "You have advantage on Wisdom (Perception) checks that rely on smell." },
      { name: "Pack Tactics", description: "You have advantage on attack rolls against a creature if at least one of your allies is within 5 feet of the creature." },
      { name: "Bite", description: "Your unarmed strikes deal 1d6 piercing damage." },
    ],
    speed: 35,
  },
  {
    name: "Felid",
    description: "Feline genetic splicing grants enhanced reflexes, night vision, and preternatural agility.",
    abilityBonuses: { dexterity: 2, charisma: 1 },
    senses: { darkvision: true },
    traits: [
      { name: "Cat's Grace", description: "You have proficiency in the Acrobatics skill." },
      { name: "Feline Agility", description: "When you move on your turn in combat, you can double your speed until the end of the turn. Once you use this trait, you can't use it again until you move 0 feet on one of your turns." },
      { name: "Retractable Claws", description: "Your unarmed strikes deal 1d4 slashing damage." },
    ],
    speed: 30,
  },
  {
    name: "Insectoid",
    description: "Arthropod DNA integration provides a chitinous exoskeleton, compound visual processing, and enhanced durability.",
    abilityBonuses: { constitution: 2, strength: 1 },
    senses: { spectrum: true },
    traits: [
      { name: "Chitin Plating", description: "When you aren't wearing armor, your AC is 13 + your Dexterity modifier." },
      { name: "Compound Eyes", description: "You have advantage on saving throws against being blinded." },
      { name: "Wall Crawler", description: "You have a climbing speed equal to your walking speed." },
    ],
    speed: 30,
  },
  {
    name: "Lacertid",
    description: "Lizard-genome splicing enables rapid cellular regeneration, thermal regulation, and natural camouflage.",
    abilityBonuses: { constitution: 2, intelligence: 1 },
    senses: { penetration: true },
    traits: [
      { name: "Regeneration", description: "At the start of each of your turns, you regain hit points equal to your proficiency bonus if you have at least 1 hit point and no more than half your hit points." },
      { name: "Cold-Blooded", description: "You have resistance to fire damage but vulnerability to cold damage." },
      { name: "Natural Camouflage", description: "You have advantage on Dexterity (Stealth) checks made to hide in natural environments." },
    ],
    speed: 30,
  },
  {
    name: "Ophidian",
    description: "Serpentine genetics grant flexibility, venomous capability, and heat-sensing perception.",
    abilityBonuses: { dexterity: 1, constitution: 1, charisma: 1 },
    senses: { penetration: true },
    traits: [
      { name: "Serpentine Flexibility", description: "You have advantage on checks and saves to escape grapples and restraints." },
      { name: "Venomous Bite", description: "Your unarmed bite attack deals 1d4 piercing damage plus 1d4 poison damage." },
      { name: "Heat Sense", description: "You can detect the presence of warm-blooded creatures within 30 feet, even through walls up to 1 foot thick." },
    ],
    speed: 30,
  },
  {
    name: "Primate",
    description: "Enhanced primate genetics provide superior grip strength, climbing ability, and raw physical power.",
    abilityBonuses: { strength: 2, constitution: 1 },
    senses: {},
    traits: [
      { name: "Powerful Build", description: "You count as one size larger when determining carrying capacity and the weight you can push, drag, or lift." },
      { name: "Climbing Speed", description: "You have a climbing speed of 30 feet." },
      { name: "Prehensile Feet", description: "You can use your feet to manipulate objects, open doors, and wield weapons, freeing your hands." },
    ],
    speed: 30,
  },
  {
    name: "Ursid",
    description: "Bear-genome splicing creates imposing physiques with enhanced endurance and raw physical might.",
    abilityBonuses: { strength: 2, constitution: 2 },
    senses: { acuteOlfaction: true },
    traits: [
      { name: "Thick Hide", description: "You have resistance to bludgeoning damage from nonmagical attacks." },
      { name: "Powerful Maul", description: "Your unarmed strikes deal 1d6 + your Strength modifier bludgeoning damage." },
      { name: "Hibernation Recovery", description: "When you take a long rest, you regain all spent Hit Dice instead of half." },
    ],
    speed: 30,
  },
  {
    name: "Chiropteran",
    description: "Bat-genome integration enables echolocation, enhanced hearing, and limited gliding capability.",
    abilityBonuses: { dexterity: 2, wisdom: 1 },
    senses: { darkvision: true, spectrum: true },
    traits: [
      { name: "Echolocation", description: "You have blindsight out to 30 feet. You can't use this while deafened." },
      { name: "Keen Hearing", description: "You have advantage on Wisdom (Perception) checks that rely on hearing." },
      { name: "Glide", description: "You can use wing membranes to glide. When falling, you can move 2 feet horizontally for every 1 foot you descend." },
    ],
    speed: 30,
  },
];

export const CLASSES: ClassData[] = [
  {
    name: "Fighter",
    hitDie: 10,
    savingThrows: ["strength", "constitution"],
    armorProficiencies: "All armor, Shields",
    weaponProficiencies: "Simple weapons, Martial weapons",
    skillChoices: ["acrobatics", "athletics", "insight", "intimidation", "perception", "survival", "drive", "mechanics"],
    numSkillChoices: 2,
    featuresByLevel: {
      1: [
        { name: "Fighting Style", description: "You adopt a particular style of fighting as your specialty." },
        { name: "Second Wind", description: "You have a limited well of stamina. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level. Once you use this feature, you must finish a short or long rest before you can use it again." },
      ],
      2: [{ name: "Action Surge", description: "You can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action. Once you use this feature, you must finish a short or long rest before you can use it again." }],
      3: [{ name: "Martial Archetype", description: "You choose an archetype that you strive to emulate in your combat styles and techniques." }],
      4: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      5: [{ name: "Extra Attack", description: "You can attack twice, instead of once, whenever you take the Attack action on your turn." }],
      6: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      7: [{ name: "Archetype Feature", description: "You gain a feature from your martial archetype." }],
      8: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      9: [{ name: "Indomitable", description: "You can reroll a saving throw that you fail. If you do so, you must use the new roll. You can use this feature once." }],
      10: [{ name: "Archetype Feature", description: "You gain a feature from your martial archetype." }],
      11: [{ name: "Extra Attack (2)", description: "You can attack three times whenever you take the Attack action on your turn." }],
      12: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      14: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      16: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      17: [{ name: "Action Surge (2)", description: "You can use Action Surge twice before a rest." }, { name: "Indomitable (3)", description: "You can use Indomitable three times between long rests." }],
      18: [{ name: "Archetype Feature", description: "You gain a feature from your martial archetype." }],
      19: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      20: [{ name: "Extra Attack (3)", description: "You can attack four times whenever you take the Attack action on your turn." }],
    },
  },
  {
    name: "Rogue",
    hitDie: 8,
    savingThrows: ["dexterity", "intelligence"],
    armorProficiencies: "Light armor",
    weaponProficiencies: "Simple weapons, Hand crossbows, Longswords, Rapiers, Shortswords",
    skillChoices: ["acrobatics", "athletics", "deception", "insight", "intimidation", "investigation", "perception", "performance", "persuasion", "sleightOfHand", "stealth", "computers", "streetwise"],
    numSkillChoices: 4,
    featuresByLevel: {
      1: [
        { name: "Expertise", description: "Choose two of your skill proficiencies. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies." },
        { name: "Sneak Attack", description: "Once per turn, you can deal an extra 1d6 damage to one creature you hit with an attack if you have advantage on the attack roll." },
        { name: "Thieves' Cant", description: "You have learned thieves' cant, a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation." },
      ],
      2: [{ name: "Cunning Action", description: "You can use a bonus action to take the Dash, Disengage, or Hide action." }],
      3: [{ name: "Roguish Archetype", description: "You choose an archetype that you emulate in the exercise of your rogue abilities." }],
      4: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      5: [{ name: "Uncanny Dodge", description: "When an attacker that you can see hits you with an attack, you can use your reaction to halve the attack's damage against you." }],
      6: [{ name: "Expertise (2)", description: "Choose two more of your skill proficiencies to gain expertise." }],
      7: [{ name: "Evasion", description: "When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail." }],
      8: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      9: [{ name: "Archetype Feature", description: "You gain a feature from your roguish archetype." }],
      10: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      11: [{ name: "Reliable Talent", description: "Whenever you make an ability check that lets you add your proficiency bonus, you can treat a d20 roll of 9 or lower as a 10." }],
      12: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      13: [{ name: "Archetype Feature", description: "You gain a feature from your roguish archetype." }],
      14: [{ name: "Blindsense", description: "If you are able to hear, you are aware of the location of any hidden or invisible creature within 10 feet of you." }],
      15: [{ name: "Slippery Mind", description: "You have proficiency in Wisdom saving throws." }],
      16: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      17: [{ name: "Archetype Feature", description: "You gain a feature from your roguish archetype." }],
      18: [{ name: "Elusive", description: "No attack roll has advantage against you while you aren't incapacitated." }],
      19: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      20: [{ name: "Stroke of Luck", description: "If your attack misses a target within range, you can turn the miss into a hit. Alternatively, if you fail an ability check, you can treat the d20 roll as a 20." }],
    },
  },
  {
    name: "Monk",
    hitDie: 8,
    savingThrows: ["strength", "dexterity"],
    armorProficiencies: "None",
    weaponProficiencies: "Simple weapons, Shortswords",
    skillChoices: ["acrobatics", "athletics", "insight", "perception", "stealth", "socialScience"],
    numSkillChoices: 2,
    featuresByLevel: {
      1: [
        { name: "Unarmored Defense", description: "While you are wearing no armor and not wielding a shield, your AC equals 10 + your Dexterity modifier + your Wisdom modifier." },
        { name: "Martial Arts", description: "Your practice of martial arts gives you mastery of combat styles that use unarmed strikes and monk weapons (shortswords and simple melee weapons that don't have the two-handed or heavy property)." },
      ],
      2: [
        { name: "Ki", description: "Your training allows you to harness the mystic energy of ki. You have a number of ki points equal to your monk level." },
        { name: "Unarmored Movement", description: "Your speed increases by 10 feet while you are not wearing armor or wielding a shield." },
      ],
      3: [
        { name: "Monastic Tradition", description: "You choose a monastic tradition that shapes your practice of martial arts." },
        { name: "Deflect Missiles", description: "You can use your reaction to deflect or catch the missile when you are hit by a ranged weapon attack." },
      ],
      4: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }, { name: "Slow Fall", description: "You can use your reaction when you fall to reduce any falling damage you take by an amount equal to five times your monk level." }],
      5: [{ name: "Extra Attack", description: "You can attack twice when you take the Attack action." }, { name: "Stunning Strike", description: "You can interfere with the flow of ki in an opponent's body. When you hit another creature with a melee weapon attack, you can spend 1 ki point to attempt a stunning strike." }],
      6: [{ name: "Ki-Empowered Strikes", description: "Your unarmed strikes count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage." }, { name: "Tradition Feature", description: "You gain a feature from your monastic tradition." }],
      7: [{ name: "Evasion", description: "When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed, and only half damage if you fail." }, { name: "Stillness of Mind", description: "You can use your action to end one effect on yourself that is causing you to be charmed or frightened." }],
      8: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      9: [{ name: "Unarmored Movement Improvement", description: "You gain the ability to move along vertical surfaces and across liquids on your turn without falling during the move." }],
      10: [{ name: "Purity of Body", description: "Your mastery of ki flowing through you makes you immune to disease and poison." }],
      11: [{ name: "Tradition Feature", description: "You gain a feature from your monastic tradition." }],
      12: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      14: [{ name: "Diamond Soul", description: "Your mastery of ki grants you proficiency in all saving throws. Additionally, whenever you make a saving throw and fail, you can spend 1 ki point to reroll it and take the second result." }],
      15: [{ name: "Timeless Body", description: "Your ki sustains you so that you suffer none of the frailty of old age." }],
      16: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      17: [{ name: "Tradition Feature", description: "You gain a feature from your monastic tradition." }],
      18: [{ name: "Empty Body", description: "You can use your action to spend 4 ki points to become invisible for 1 minute." }],
      19: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      20: [{ name: "Perfect Self", description: "When you roll for initiative and have no ki points remaining, you regain 4 ki points." }],
    },
  },
  {
    name: "Hacker",
    hitDie: 6,
    savingThrows: ["intelligence", "wisdom"],
    armorProficiencies: "None",
    weaponProficiencies: "Daggers, Darts, Light crossbows, Quarterstaffs",
    skillChoices: ["computers", "investigation", "insight", "mechanics", "perception", "deception", "stealth", "streetwise"],
    numSkillChoices: 3,
    featuresByLevel: {
      1: [
        { name: "Neural Interface", description: "You can interface directly with computer systems, gaining advantage on Intelligence (Computers) checks." },
        { name: "Hack Recovery", description: "You have learned to regain some of your processing power by brief neural defragmentation. Once per day when you finish a short rest, you recover hack slots with a combined level equal to half your Hacker level (rounded up)." },
      ],
      2: [{ name: "Digital Ghost", description: "You can mask your digital footprint. You have advantage on checks to avoid detection while hacking." }],
      3: [{ name: "Hacker Specialty", description: "You choose a specialty that shapes the nature of your hacking abilities." }],
      4: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      5: [{ name: "Overclocked Mind", description: "Your processing speed increases. You can use your bonus action to attempt a hack." }],
      6: [{ name: "Specialty Feature", description: "You gain a feature from your hacker specialty." }],
      7: [{ name: "Firewall", description: "You can erect a digital firewall as a reaction, granting yourself or an ally within 30 feet resistance to damage from a hack or technological attack." }],
      8: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      9: [{ name: "Advanced Intrusion", description: "You can hack systems of greater complexity. You gain access to higher-level hacks." }],
      10: [{ name: "Specialty Feature", description: "You gain a feature from your hacker specialty." }],
      11: [{ name: "Neural Fortress", description: "Your mind becomes fortified against intrusion. You have advantage on saving throws against being charmed or having your mind read." }],
      12: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      14: [{ name: "Specialty Feature", description: "You gain a feature from your hacker specialty." }],
      16: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      18: [{ name: "Master Hack", description: "You can use a powerful hack once per long rest without expending a hack slot." }],
      19: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      20: [{ name: "Singularity", description: "You achieve a transcendent connection with the digital realm. You can cast two hacks per turn." }],
    },
  },
  {
    name: "Medic",
    hitDie: 8,
    savingThrows: ["wisdom", "charisma"],
    armorProficiencies: "Light armor, Medium armor, Shields",
    weaponProficiencies: "Simple weapons",
    skillChoices: ["insight", "lifeScience", "perception", "persuasion", "socialScience", "survival", "mechanics"],
    numSkillChoices: 2,
    featuresByLevel: {
      1: [
        { name: "Field Medicine", description: "You gain proficiency with medical kits. As an action, you can stabilize a creature at 0 HP and restore 1 HP." },
        { name: "Healing Protocols", description: "You know medical procedures that can heal wounds and cure ailments. You gain access to healing hacks." },
      ],
      2: [
        { name: "Combat Medic", description: "You can use a bonus action to administer first aid, allowing a creature within 5 feet to spend a Hit Die to recover hit points." },
        { name: "Channel Bio-Energy", description: "You can channel bio-energy to fuel medical effects." },
      ],
      3: [{ name: "Medical Specialty", description: "You choose a medical specialty that defines your approach to healing." }],
      4: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      5: [{ name: "Destroy Pathogen", description: "You can target biological threats directly. Necrotic and poison damage you deal ignores resistance." }],
      6: [{ name: "Specialty Feature", description: "You gain a feature from your medical specialty." }],
      7: [{ name: "Emergency Protocols", description: "When a creature within 30 feet drops to 0 HP, you can use your reaction to move up to your speed toward that creature and administer emergency care." }],
      8: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      10: [{ name: "Enhanced Healing", description: "When you restore hit points to a creature, the creature regains additional hit points equal to your Wisdom modifier." }],
      12: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      14: [{ name: "Specialty Feature", description: "You gain a feature from your medical specialty." }],
      16: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      17: [{ name: "Specialty Feature", description: "You gain a feature from your medical specialty." }],
      18: [{ name: "Miracle Worker", description: "You can revive a creature that has died within the last minute by expending a high-level hack slot." }],
      19: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      20: [{ name: "Supreme Healer", description: "When you would normally roll dice to restore hit points, you instead use the highest number possible for each die." }],
    },
  },
  {
    name: "Face",
    hitDie: 8,
    savingThrows: ["dexterity", "charisma"],
    armorProficiencies: "Light armor",
    weaponProficiencies: "Simple weapons, Hand crossbows, Longswords, Rapiers, Shortswords",
    skillChoices: ["deception", "insight", "intimidation", "investigation", "perception", "performance", "persuasion", "sleightOfHand", "socialScience", "streetwise", "bureaucracy"],
    numSkillChoices: 3,
    featuresByLevel: {
      1: [
        { name: "Silver Tongue", description: "You gain expertise in one Charisma-based skill of your choice." },
        { name: "Inspiration", description: "You can inspire others through words, music, or performance. You can use a bonus action to give one creature within 60 feet an Inspiration die (d6)." },
      ],
      2: [
        { name: "Jack of All Trades", description: "You can add half your proficiency bonus to any ability check you make that doesn't already include your proficiency bonus." },
        { name: "Song of Rest", description: "During a short rest, you can help revitalize your wounded allies. Each creature that regains HP at the end of the rest regains an extra 1d6 HP." },
      ],
      3: [{ name: "Social Archetype", description: "You choose an archetype that shapes how you use your social abilities." }, { name: "Expertise (2)", description: "Choose two more skills to gain expertise in." }],
      4: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      5: [{ name: "Inspiration (d8)", description: "Your Inspiration die becomes a d8." }, { name: "Font of Inspiration", description: "You regain all of your expended uses of Inspiration when you finish a short or long rest." }],
      6: [{ name: "Countercharm", description: "You can use your performance to create a ward against charming effects. You and allies within 30 feet have advantage on saving throws against being frightened or charmed." }],
      7: [{ name: "Archetype Feature", description: "You gain a feature from your social archetype." }],
      8: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      10: [{ name: "Inspiration (d10)", description: "Your Inspiration die becomes a d10." }, { name: "Expertise (3)", description: "Choose two more skills to gain expertise in." }],
      12: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      14: [{ name: "Archetype Feature", description: "You gain a feature from your social archetype." }],
      15: [{ name: "Inspiration (d12)", description: "Your Inspiration die becomes a d12." }],
      16: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      18: [{ name: "Master Manipulator", description: "When you make a Charisma check, you can treat a d20 roll of 9 or lower as a 10." }],
      19: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      20: [{ name: "Superior Inspiration", description: "When you roll initiative and have no uses of Inspiration remaining, you regain one use." }],
    },
  },
  {
    name: "Soldier",
    hitDie: 12,
    savingThrows: ["strength", "constitution"],
    armorProficiencies: "All armor, Shields",
    weaponProficiencies: "Simple weapons, Martial weapons",
    skillChoices: ["athletics", "intimidation", "perception", "survival", "drive", "mechanics", "acrobatics"],
    numSkillChoices: 2,
    featuresByLevel: {
      1: [
        { name: "Rage", description: "In battle, you fight with primal ferocity. On your turn, you can enter a rage as a bonus action. While raging, you gain bonus damage, resistance to physical damage, and advantage on Strength checks and saves." },
        { name: "Unarmored Defense", description: "While you are not wearing any armor, your AC equals 10 + your Dexterity modifier + your Constitution modifier." },
      ],
      2: [{ name: "Reckless Attack", description: "You can throw aside all concern for defense to attack with fierce desperation. You gain advantage on attack rolls, but attack rolls against you have advantage." }, { name: "Danger Sense", description: "You gain an uncanny sense of when things nearby aren't as they should be. You have advantage on Dexterity saving throws against effects that you can see." }],
      3: [{ name: "Combat Doctrine", description: "You choose a combat doctrine that shapes the nature of your rage." }],
      4: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      5: [{ name: "Extra Attack", description: "You can attack twice when you take the Attack action." }, { name: "Fast Movement", description: "Your speed increases by 10 feet while you aren't wearing heavy armor." }],
      6: [{ name: "Doctrine Feature", description: "You gain a feature from your combat doctrine." }],
      7: [{ name: "Feral Instinct", description: "You have advantage on initiative rolls. Additionally, if you are surprised, you can still act normally on your first turn if you enter a rage." }],
      8: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      9: [{ name: "Brutal Critical", description: "You can roll one additional weapon damage die when determining the extra damage for a critical hit." }],
      10: [{ name: "Doctrine Feature", description: "You gain a feature from your combat doctrine." }],
      11: [{ name: "Relentless Rage", description: "Your rage can keep you fighting despite grievous wounds. If you drop to 0 HP while raging, you can make a DC 10 Constitution saving throw. If you succeed, you drop to 1 HP instead." }],
      12: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      14: [{ name: "Doctrine Feature", description: "You gain a feature from your combat doctrine." }],
      16: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      18: [{ name: "Indomitable Might", description: "If your total for a Strength check is less than your Strength score, you can use that score in place of the total." }],
      19: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      20: [{ name: "Primal Champion", description: "Your Strength and Constitution scores increase by 4. Your maximum for those scores is now 24." }],
    },
  },
  {
    name: "Infiltrator",
    hitDie: 8,
    savingThrows: ["dexterity", "intelligence"],
    armorProficiencies: "Light armor, Medium armor",
    weaponProficiencies: "Simple weapons, Martial weapons",
    skillChoices: ["athletics", "insight", "investigation", "perception", "stealth", "survival", "acrobatics", "computers", "streetwise", "drive"],
    numSkillChoices: 3,
    featuresByLevel: {
      1: [
        { name: "Favored Terrain", description: "You are an expert at navigating specific environments. Choose one type of terrain. You gain benefits when traveling and making checks in that terrain." },
        { name: "Threat Assessment", description: "You can study a creature to learn its capabilities. As an action, you can learn its damage resistances, immunities, and vulnerabilities." },
      ],
      2: [{ name: "Fighting Style", description: "You adopt a particular style of fighting as your specialty." }, { name: "Tactical Hacking", description: "You gain the ability to use basic combat hacks through your neural interface." }],
      3: [{ name: "Infiltrator Archetype", description: "You choose an archetype that defines your approach to infiltration." }, { name: "Primeval Awareness", description: "You can use an action to detect whether certain types of threats are present within 1 mile of you." }],
      4: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      5: [{ name: "Extra Attack", description: "You can attack twice when you take the Attack action." }],
      6: [{ name: "Favored Terrain (2)", description: "You gain an additional favored terrain." }],
      7: [{ name: "Archetype Feature", description: "You gain a feature from your infiltrator archetype." }],
      8: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }, { name: "Land's Stride", description: "Moving through difficult terrain costs you no extra movement." }],
      10: [{ name: "Hide in Plain Sight", description: "You can spend 1 minute camouflaging yourself. You gain a +10 bonus to Stealth checks while you remain motionless." }],
      11: [{ name: "Archetype Feature", description: "You gain a feature from your infiltrator archetype." }],
      12: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      14: [{ name: "Vanish", description: "You can use the Hide action as a bonus action. Also, you can't be tracked by nonmagical means." }],
      16: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      18: [{ name: "Feral Senses", description: "You gain preternatural senses. You don't have disadvantage on attack rolls against creatures you can't see." }],
      19: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1." }],
      20: [{ name: "Foe Slayer", description: "You become an unparalleled hunter. Once on each of your turns, you can add your Wisdom modifier to the attack roll or damage roll against a creature." }],
    },
  },
];

export const BACKGROUNDS: BackgroundData[] = [
  {
    name: "Corporate Agent",
    description: "You served one of the megacorporations that dominate the world of 2090, working as an operative, analyst, or enforcer.",
    skillProficiencies: ["bureaucracy", "persuasion"],
    featureName: "Corporate Connections",
    featureDescription: "You have contacts within corporate networks. You can leverage these connections to gain access to corporate facilities, information, or resources.",
    toolProficiencies: "One type of gaming set",
    languages: "One language of your choice",
  },
  {
    name: "Street Rat",
    description: "You grew up on the streets, learning to survive through wit, cunning, and a healthy dose of paranoia.",
    skillProficiencies: ["stealth", "streetwise"],
    featureName: "Street Cred",
    featureDescription: "You are known in the underground. You can find safe houses, fences for stolen goods, and information brokers in any urban area.",
    toolProficiencies: "Thieves' tools",
  },
  {
    name: "Military Veteran",
    description: "You served in one of the world's military forces, gaining discipline, combat training, and the scars that come with it.",
    skillProficiencies: ["athletics", "intimidation"],
    featureName: "Military Rank",
    featureDescription: "You still carry your rank and can invoke it to gain cooperation from soldiers and veterans. You can also access military installations with proper identification.",
    toolProficiencies: "Vehicles (Land)",
    languages: "One language of your choice",
  },
  {
    name: "Academic",
    description: "You spent years in academic institutions, researching the cutting edge of science and technology.",
    skillProficiencies: ["investigation", "lifeScience"],
    featureName: "Researcher",
    featureDescription: "When you attempt to learn or recall information, if you don't know it, you know where and from whom you can obtain it.",
    languages: "Two languages of your choice",
  },
  {
    name: "Criminal",
    description: "You have a history of breaking the law. You might have been a smuggler, burglar, or enforcer for a criminal syndicate.",
    skillProficiencies: ["deception", "stealth"],
    featureName: "Criminal Contact",
    featureDescription: "You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals.",
    toolProficiencies: "Thieves' tools, one type of gaming set",
  },
  {
    name: "Medtech",
    description: "You trained in medicine and biotechnology, working in hospitals, clinics, or field medical units.",
    skillProficiencies: ["lifeScience", "perception"],
    featureName: "Medical License",
    featureDescription: "You can practice medicine legally and have access to medical supplies at reduced cost. Medical facilities are more likely to cooperate with you.",
    toolProficiencies: "Medical kit, Herbalism kit",
  },
  {
    name: "Fixer",
    description: "You are a dealmaker and information broker, connecting people who need things with people who have things.",
    skillProficiencies: ["insight", "persuasion"],
    featureName: "Contact Network",
    featureDescription: "You maintain an extensive network of contacts across various walks of life. You can find buyers, sellers, and specialists for almost any need.",
    toolProficiencies: "Forgery kit",
    languages: "Two languages of your choice",
  },
  {
    name: "Nomad",
    description: "You lived outside the megacities, traveling the wastes and wilderlands between the urban sprawls.",
    skillProficiencies: ["survival", "drive"],
    featureName: "Wanderer",
    featureDescription: "You have an excellent memory for maps and geography. You can always recall the general layout of terrain, settlements, and other features around you.",
    toolProficiencies: "Vehicles (Land)",
    languages: "One language of your choice",
  },
  {
    name: "Hacker Underground",
    description: "You were part of the digital underground, hacking systems and fighting for data freedom.",
    skillProficiencies: ["computers", "investigation"],
    featureName: "Backdoor Access",
    featureDescription: "You know hidden entry points in common computer systems and networks. You have advantage on the first Computers check you make when attempting to access a new system.",
    toolProficiencies: "Hacking tools",
  },
  {
    name: "Entertainer",
    description: "You made your living performing for others — music, acting, street performance, or digital content creation.",
    skillProficiencies: ["performance", "acrobatics"],
    featureName: "By Popular Demand",
    featureDescription: "You can always find a place to perform. You receive free lodging and food in exchange for performing. Your performances make you something of a local figure.",
    toolProficiencies: "One musical instrument, Disguise kit",
  },
];

export const POINT_BUY_COSTS: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};

export const POINT_BUY_TOTAL = 27;
