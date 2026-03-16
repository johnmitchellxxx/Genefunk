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
  mandatorySkills?: string[];
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
  // ─── ENGINEERED ──────────────────────────────────────────────────────────────
  {
    name: "Canary",
    description: "A Hexie-designed genome built for deep-mine labor and heavy manual work under harsh conditions. Despite the gentle name, Canaries are among the toughest humans alive — engineered to survive poisonous gas, crushing injuries, and sustained physical punishment. Many have found their talents useful in professional fighting, stunt work, the military, and hired muscle.",
    abilityBonuses: { strength: 4, constitution: 4 },
    senses: {},
    traits: [
      { name: "Healing Factor", description: "You regain 1 hit point at the start of each turn, auto-stabilize at 0 HP, and regain all your hit points whenever you take a short rest. You also count as having two fewer levels of exhaustion. You need access to extra food after a combat that uses this feature, or it won't function in the next combat." },
      { name: "Toxin Resilience", description: "You have advantage on saving throws against poison, and you have resistance against poison damage." },
      { name: "Tough as Nails", description: "At first level, and whenever you gain a level, your hit point maximum increases by an additional 2 hit points." },
      { name: "Bioluminescence", description: "Your skin produces blue fluorescent proteins, making you glow in the dark with a soft azure hue. You have disadvantage on Dexterity (Stealth) checks unless covered head to toe, and you have a strange appearance." },
      { name: "Musk (Flaw)", description: "Your sweat glands produce a sharp-smelling rusty odor. You have disadvantage on Dexterity (Stealth), Charisma (Persuasion), and Charisma (Performance) checks if the target can smell you." },
    ],
    speed: 9,
  },
  {
    name: "Coelhomortos",
    description: "Illegally developed in the Amazon basin for transgenic blood sports, the rabbit-like Coelhomortos were engineered to be prey for more predatory genomes in brutal games of capture the flag. Toughened up over successive production lines, they developed a fierce reputation. In 2090 they excel in mainstream athletics, team sports, and any field requiring speed and teamwork.",
    abilityBonuses: { dexterity: 3, strength: 3 },
    senses: {},
    traits: [
      { name: "Athleticism", description: "You gain proficiency in the Athletics and Acrobatics skills." },
      { name: "Blind Loyalty", description: "You have absolute devotion to a small group you identify as your pack (almost always your cadre) and will put yourself in harm's way to protect any one of them, even if you think it's hopeless." },
      { name: "Danger Sense", description: "You gain a +5 bonus to initiative, you can't be surprised while conscious, and other people don't gain advantage on attack rolls against you as a result of being hidden from you." },
      { name: "Pack Tactics", description: "You have advantage on attack rolls against a target if at least one of your allies is within 1.5 meters of the target and that ally isn't incapacitated." },
      { name: "Prey Instincts", description: "As a free action on your turn, you can take the Dash, Disengage, or Hide action. After you use Prey Instincts, you can't use it again until you complete a short or long rest." },
      { name: "Rabbit Feet", description: "Your speed increases by 3 meters. You can use the Dash action as a bonus action. When you Dash, difficult terrain doesn't cost you extra movement until end of turn. You multiply your jump distance by 4, and can fall 6 meters without taking damage. As a bonus action, you can rabbit-kick a creature within 1.5 meters (3d4 bludgeoning, scaling at levels 5/11/17)." },
      { name: "Short Lived (Flaw)", description: "Your telomeres are shorter than they should be. Your expected life span is 25–30 years; you reach adulthood at 15." },
      { name: "Simple Minded (Flaw)", description: "Your Intelligence and Wisdom scores are decreased by 2." },
      { name: "Inhuman Appearance (Flaw)", description: "You are completely covered in soft fur, have a rabbit-like face, and digitigrade legs." },
      { name: "Upgrade Intolerant (Flaw)", description: "Your body doesn't take well to implants and biohacks. The maximum number of upgrades you may have is limited to 6." },
    ],
    speed: 9,
  },
  {
    name: "Companion",
    description: "Designed for sex work, entertainment, social manipulation, and media communication. Their beauty and presence drive people to cooperation and loyalty. Seen in high-class brothels, exotic dancing, media, music, acting, and politics. Their charm is a precision instrument.",
    abilityBonuses: { intelligence: 2, wisdom: 2, charisma: 4 },
    senses: {},
    traits: [
      { name: "Chemical Dependence (Flaw)", description: "In addition to regular food, you must consume a nutrient supplement called Median every day. Failure counts as not eating. Available in most cities covered by lifestyle; costs シ25/day for field rations." },
      { name: "Enchanting", description: "You gain proficiency in Persuasion (expertise if already proficient). You can charm a person after a brief conversation: make a Charisma (Persuasion) check contested by the target's Wisdom (Insight). On success the target is charmed for 1 minute. Cannot be used during combat." },
      { name: "Performance Artist", description: "You gain proficiency in Performance (expertise if already proficient). You can use performance to occupy a target's attention: make a Charisma (Performance) check contested by the target's Wisdom (Insight). On success the target makes DEX, INT, and WIS checks with disadvantage while perceiving your performance." },
      { name: "Pheromones", description: "You produce scents that make people trust you. Whenever you make Insight, Deception, Persuasion, or Performance checks, you can roll with advantage as long as the target is within 6 meters and can smell you." },
    ],
    speed: 9,
  },
  {
    name: "Espion",
    description: "Designed for covert intelligence and subverting rival syndicate employees. Expert actors and manipulators who can read what people want and extract secrets with nothing more than words. Used as assassins, spies, actors, salespeople, lawyers, and police.",
    abilityBonuses: { dexterity: 2, intelligence: 2, wisdom: 3, charisma: 3 },
    senses: {},
    traits: [
      { name: "Emotionally Intuitive", description: "You gain proficiency in Insight (expertise if already proficient). As an action, make a Wisdom (Insight) check contested by the target's Charisma (Deception). On success, you have advantage on attack rolls and ability checks against the target until end of your next turn." },
      { name: "Social Chameleon", description: "You have advantage on Deception and Performance checks to pass yourself off as a different person. You can mimic speech patterns and tone — after studying someone's speech for a few minutes, listeners must succeed on a Wisdom (Insight) check contested by your Charisma (Deception) to see through the impression." },
    ],
    speed: 9,
  },
  {
    name: "Eucypher",
    description: "Engineered by Omnitech to be the ultimate hackers. Augmented mental abilities allow them to navigate code with uncanny ease. Their frail physique makes violent cadre work challenging, but their great intellect usually compensates. Useful in most professions that reward intelligence.",
    abilityBonuses: { dexterity: 1, intelligence: 4, wisdom: 3 },
    senses: {},
    traits: [
      { name: "Marfan Syndrome (Flaw)", description: "You have a variant form of Marfan: your limbs and digits are extremely long and you are unusually tall and slender. This gives you a strange appearance." },
      { name: "Multitasker", description: "You can run an additional hack or upgrade that requires concentration (you may concentrate on one more effect than normal)." },
      { name: "Natural Coder", description: "You learn four 1st-level software hacks of your choice. Without hack slots, they must be run using the taking your time feature." },
      { name: "Weak (Flaw)", description: "Your Strength score decreases by 2." },
    ],
    speed: 9,
  },
  {
    name: "Feral",
    description: "A variant of the Traceur genome that pushes the border between humans and mammalian carnivores. Completely covered in hair with vicious claws and fangs. Stronger and faster than average, but prone to rage. Developed in the 2050s for military applications and entertainment. Common in the military, professional fighting, guides, and entertainment.",
    abilityBonuses: { strength: 3, dexterity: 3 },
    senses: { acuteOlfaction: true },
    traits: [
      { name: "Acute Olfaction", description: "You can recognize people's unique scent, track them easily (unless it has rained), and gain details about anything you eat or drink. While tracking, you learn the exact number, sizes, and how long ago they passed. If downwind, it is impossible for someone to hide from you or maintain a disguise without major scent alteration. Advantage on Perception checks that rely on smell." },
      { name: "Animal Rage (Flaw)", description: "When someone provokes you, you can't help but engage in dominance play. You must make a Wisdom saving throw (DC 5–10 depending on the provocation) and attack or shove the offender on a failed save." },
      { name: "Carnivore (Flaw)", description: "You are unable to digest plant-based sugars and must subsist on a purely meat diet." },
      { name: "Claws", description: "Razor-sharp retractable claws — a light finesse simple melee weapon that deals 2d4 armor-piercing slashing damage (plus STR or DEX modifier). Damage increases to 2d6 at level 6, 2d8 at level 11, and critical hit on 18–20 at level 17." },
      { name: "Simple Minded (Flaw)", description: "Your Intelligence and Charisma scores are decreased by 2." },
      { name: "Natural Scout", description: "You gain proficiency in Stealth (expertise if already proficient). You can attempt to hide when only lightly obscured. If unseen, you can move up to 4 meters in the open without revealing yourself if you end the move in cover." },
      { name: "Swift Feet", description: "When you Dash, difficult terrain doesn't cost you extra movement and you don't elicit opportunity attacks. Your speed increases by 3 meters." },
      { name: "Predatory Form (Flaw)", description: "You are completely covered in hair and have claws, fangs, and a canine nose. You have an inhuman appearance." },
    ],
    speed: 9,
  },
  {
    name: "Leviathan",
    description: "Developed by Ronin International's J41 project for security and military applications. Leviathans have a distinctly crocodilian appearance — leathery scales, hulking frame, and frightening toothy maws. Their terrifying appearance deters interlopers by fear alone. Found working as bodyguards, bouncers, mafia enforcers, professional athletes, and samurai.",
    abilityBonuses: { strength: 4, constitution: 2 },
    senses: { darkvision: true },
    traits: [
      { name: "Acute Senses", description: "You gain proficiency in Perception (expertise if already proficient) and can see in dim light within 18 meters as if it were bright light, and in darkness as if it were dim light." },
      { name: "Carnivore (Flaw)", description: "You are unable to digest plant-based sugars and must subsist on a purely meat diet." },
      { name: "Leathery Scales", description: "Your AC can't be less than 18 and your DR vs. slashing/piercing/bludgeoning can't be less than 4, regardless of armor worn. You suffer disadvantage on Stealth checks and can't add your DEX modifier to AC. The minimum AC increases by 1 at levels 3, 6, 9, 12, 15, and 17; minimum DR increases by 2 at levels 7 and 15." },
      { name: "Menacing Maw", description: "You can make Strength (Intimidation) checks instead of Charisma (Intimidation) checks against targets within 6 meters, with advantage if grappling them. You can also bite grappled targets: armor-piercing simple melee, 2d6 piercing + STR modifier (2d8 at level 6, 2d10 at level 11, 2d12 at level 17)." },
      { name: "Reptile Brain", description: "Mind hackers have a hard time cracking in. You gain advantage on saving throws against any mind hacks." },
      { name: "Simple Minded (Flaw)", description: "Your Charisma score is decreased by 2 and your Wisdom score is decreased by 1." },
      { name: "Slow (Flaw)", description: "Your lumbering body shape isn't designed for quick movement. Your base speed is 6 meters." },
      { name: "Crocodilian Form (Flaw)", description: "You are completely covered in hard leathery scales, have reptilian features, bright eyes with vertical slit pupils, and an abnormally large toothy mouth. You have an inhuman appearance." },
    ],
    speed: 6,
  },
  {
    name: "OsaLaska",
    description: "Developed in Russia by GenSTADA for assassinations. Immediately recognizable by their small size, snout-like nose, and transparent skin that lays muscle and bone bare beneath a wet-looking clear dermis — perhaps the most horrifying appearance of any genome. They can climb walls, paralyze enemies with venom, track like a bloodhound, and change the color and texture of their normally transparent skin.",
    abilityBonuses: { dexterity: 3, intelligence: 2 },
    senses: { acuteOlfaction: true },
    traits: [
      { name: "Acute Olfaction", description: "You can recognize people's unique scent, track them easily (unless it has rained), and gain details about anything you eat or drink. While tracking, you learn the exact number, sizes, and how long ago they passed. If downwind, it is impossible for someone to hide from you or maintain a disguise without major scent alteration. Advantage on Perception checks that rely on smell." },
      { name: "Adrenaline Surge", description: "Once per long rest, use a bonus action to activate this ability for one minute. While active: +2 bonus to AC, advantage on Dexterity saving throws, and an additional action each turn (usable only for Attack (one weapon attack), Dash, Disengage, Hide, or Use an Object). When the effect ends, you can't move or take actions until after your next turn." },
      { name: "Awkward (Flaw)", description: "Social situations make you squirm. Your Charisma score is decreased by 2." },
      { name: "Chromatophores", description: "You gain proficiency in Stealth (expertise if already proficient). You can attempt to hide when only lightly obscured. If hidden, you can move up to 4 meters in the open without revealing yourself if you end the move not clearly visible." },
      { name: "Nematocysts", description: "Your hands are laden with stinging cells that launch envenomed barbs. Can be triggered while grappling, making unarmed strikes, or touching your target (free action). Target must make a Constitution save (DC = 11 + proficiency bonus) or become poisoned for 1 hour. If failed by 5+, the subject becomes unconscious. If failed by 10+, they die. Use twice before a short rest." },
      { name: "Short Lived (Flaw)", description: "Your expected life span is 25–30 years; you reach adulthood at 15." },
      { name: "Small Frame (Flaw)", description: "Your size is Small instead of Medium. You are less than 1.5 meters tall and weigh less than 40 kg. Your maximum Strength score is decreased by 6." },
      { name: "Terrifying Form (Flaw)", description: "Your transparent skin and animalistic snout leave you looking like a creature from a horror movie. You have an inhuman appearance." },
      { name: "Wall Crawling", description: "Skin on your hands, feet, legs, and arms can shift into microscopic fractalling, allowing you to cling to walls like a gecko. Gain a climbing speed equal to your regular speed. You can climb sheer surfaces without requiring a Strength (Athletics) check." },
    ],
    speed: 9,
  },
  {
    name: "Sherlock",
    description: "Named after Conan Doyle's detective, this Omnitech-produced variant of the Eucypher genome was designed for investigative work. Sherlocks combine powerful intellect with heightened senses, reading people through pheromones and body language. Unlike their fictional namesake, this genome comes with significant physical ailments. Used as detectives, CSIs, investigators, and corporate intelligence analysts.",
    abilityBonuses: { intelligence: 4, wisdom: 4, dexterity: 1 },
    senses: { darkvision: true },
    traits: [
      { name: "Astute Perception", description: "You gain expertise in Perception and proficiency in Investigation (expertise if already proficient). You can take the Search action as a bonus action. You can lipread (longer distances may require a check). You have a +5 bonus to passive Perception and passive Investigation scores." },
      { name: "Darkvision", description: "You can see in dim light within 18 meters of you as if it were bright light, and in darkness as if it were dim light." },
      { name: "Emotionally Intuitive", description: "You gain proficiency in Insight (expertise if already proficient). As an action, make a Wisdom (Insight) check contested by the target's Charisma (Deception). On success, you have advantage on attack rolls and ability checks against the target until end of your next turn." },
      { name: "Albinism (Flaw)", description: "Your skin and hair are completely white, lacking any pigment. Your eyes are pink or blue. You suffer a level of exhaustion for each hour spent in direct sunlight unless well covered or shaded. You have a strange appearance." },
      { name: "Hemophiliac (Flaw)", description: "When you take any damage, you lose 1 hit point at the start of each of your turns until an ability, hack, item, or upgrade allows you to regain hit points (which stops the bleeding)." },
      { name: "Musculoskeletal Misalignment (Flaw)", description: "Your base speed is 6 meters. If you roll a 1 on any Strength or Dexterity ability check or melee attack roll, you are at disadvantage on all rolls until you take a short or long rest." },
      { name: "Weak (Flaw)", description: "Your Strength score decreases by 2." },
    ],
    speed: 6,
  },
  {
    name: "Spartan-Infantry",
    description: "Created by Apollo Laboratories to produce the ultimate soldier and among the oldest designed genomes. Many nations mass-produce this genome in state foster homes (crèches) to seed their militaries with highly competent killers. Spartan Infantry haul more gear, detect enemies more easily, shoot more accurately, and march longer than unmodified soldiers. Immediately recognizable by their maroon skin, bright yellow eyes with a cat-like tapetum lucidum, and enlarged ears.",
    abilityBonuses: { strength: 3, dexterity: 3, constitution: 3 },
    senses: { darkvision: true },
    traits: [
      { name: "Enhanced Senses", description: "You gain proficiency in the Perception skill and can see in dim light within 18 meters as if it were bright light, and in darkness as if it were dim light." },
      { name: "Tough as Nails", description: "At first level, and whenever you gain a level, your hit point maximum increases by an additional 2 hit points." },
      { name: "Inhuman Appearance (Flaw)", description: "You are a deep maroon color, have large ears, and sport bright yellow eyes with no whites." },
      { name: "Short Lived (Flaw)", description: "Your expected life span is 25–30 years; you reach adulthood at 15." },
    ],
    speed: 9,
  },
  {
    name: "Spartan-Naiad",
    description: "A variant of the Spartan Infantry genome designed for amphibious assault. Naiads can breathe underwater and swim like a fish. Their skin tone is light blue with mottled or striped patterns; completely hairless like a dolphin, with large pointed ears, bright blue eyes, and partially webbed hands and feet. Many find work with navies and marines, as lifeguards, professional surfers, or in any occupation near water.",
    abilityBonuses: { strength: 3, dexterity: 3, constitution: 3 },
    senses: { darkvision: true },
    traits: [
      { name: "Aquatic", description: "You are adapted to a marine environment with webbed limbs and functional gills. You gain a Swim speed of 6 meters and can breathe underwater. When you surface, the lungful of water is expelled through the mouth." },
      { name: "Enhanced Senses", description: "You gain proficiency in the Perception skill and can see in dim light within 18 meters as if it were bright light, and in darkness as if it were dim light." },
      { name: "Inhuman Appearance (Flaw)", description: "Your completely hairless skin is shades of light blue, you have pointed ears, and your eyes are large and bright. Your hands and feet are webbed." },
      { name: "Short Lived (Flaw)", description: "Your expected life span is 25–30 years; you reach adulthood at 15." },
    ],
    speed: 9,
  },
  {
    name: "Spartan-Wraith",
    description: "Designed to act as advanced scouts, trackers, and snipers. They can spot enemies easily, track like a bloodhound, and run like a deer. Being mute makes it difficult for enemies to extract information if captured. They have an enlarged nose, charcoal grey skin, and large yellow eyes with a cat-like tapetum lucidum. Outside of military scouting, Wraiths find work as hunters, guides, and private investigators.",
    abilityBonuses: { dexterity: 3, strength: 1, constitution: 1 },
    senses: { darkvision: true, acuteOlfaction: true },
    traits: [
      { name: "Acute Olfaction", description: "You can recognize people's unique scent, track them easily (unless it has rained), and gain details about anything you eat or drink. While tracking, you learn the exact number, sizes, and how long ago they passed. If downwind, it is impossible for someone to hide from you without major scent alteration. Advantage on Perception checks that rely on smell." },
      { name: "Natural Scout", description: "You gain proficiency in Stealth (expertise if already proficient). You can hide when only lightly obscured. If unseen, you can move up to 4 meters in the open without revealing yourself if you end in cover. When unseen and you make a ranged weapon attack, your position isn't revealed unless you actually hit." },
      { name: "Nocturnal Senses", description: "You gain proficiency in Perception and can see in dim light within 18 meters as if it were bright light, and in darkness as if it were dim light. Dim light doesn't cause disadvantage on your Perception checks." },
      { name: "Swift Feet", description: "When you Dash, difficult terrain doesn't cost you extra movement on that turn. Your speed increases by 3 meters." },
      { name: "Tireless", description: "You always count as having two fewer levels of exhaustion." },
      { name: "Mute (Flaw)", description: "You have no voice box and are unable to speak (though you can still communicate wirelessly through chat apps)." },
      { name: "Simple (Flaw)", description: "Your Intelligence score is decreased by 2." },
      { name: "Short Lived (Flaw)", description: "Your expected life span is 25–30 years; you reach adulthood at 15." },
      { name: "Inhuman Appearance (Flaw)", description: "You have hairless skin in shades of charcoal grey to black, an enormous nose, and large bright yellow or golden eyes." },
    ],
    speed: 9,
  },
  {
    name: "Titan",
    description: "Designed by Unicom for strength-based sports and physical combat. Titans are gigantic, powerfully muscled, extremely tough pounding machines that can take and dish out punishment in equal measure. If not in professional sports or fighting, many Titans work as bouncers, bodyguards, or hired bone breakers.",
    abilityBonuses: { strength: 5, dexterity: 1, constitution: 3 },
    senses: {},
    traits: [
      { name: "Chemical Dependence (Flaw)", description: "In addition to regular food, you must consume a nutrient supplement called Median every day. Failure counts as not eating. Available in most cities covered by lifestyle; costs シ25/day for field rations." },
      { name: "Goon Brain (Flaw)", description: "Your Intelligence and Wisdom scores are decreased by 1." },
      { name: "Inhumanly Large (Flaw)", description: "You are well over 2 meters tall and have a strange appearance due to your large size." },
      { name: "Sturdy Frame", description: "Your entire skeleton is unusually strong. You gain resistance to bludgeoning damage and add the hard-knuckle property to your unarmed strikes (+2 damage)." },
      { name: "Tough as Nails", description: "At first level, and whenever you gain a level, your hit point maximum increases by an additional 2 hit points." },
    ],
    speed: 9,
  },
  {
    name: "Traceur",
    description: "Developed by Unicom for the entertainment industry — specifically stunt work and action movies. Genes for sex appeal, extroversion, and charm were included alongside extreme acrobatics and toughness. Some of the most famous modern action stars are Traceurs. Despite their entertainment origins, their capabilities make them extremely dangerous.",
    abilityBonuses: { dexterity: 4, strength: 1, constitution: 1, charisma: 1 },
    senses: {},
    traits: [
      { name: "Action Star Brain (Flaw)", description: "Your Intelligence and Wisdom scores are decreased by 2." },
      { name: "Chemical Dependence (Flaw)", description: "In addition to regular food, you must consume a nutrient supplement called Median every day. Failure counts as not eating. Available in most cities covered by lifestyle; costs シ25/day for field rations." },
      { name: "Athletic Phenom", description: "Standing up from prone uses only 1.5 meters of movement. Climbing doesn't cost you extra movement. You can make a running long jump or high jump after moving only 1.5 meters on foot rather than 4 meters. You gain proficiency in Acrobatics (expertise if already proficient)." },
      { name: "Natural Leaper", description: "You multiply the amount of distance you can jump by 3, and you can fall 9 meters without taking damage (instead of 3). Doesn't stack with other abilities that increase jumping distance." },
      { name: "Swift Feet", description: "When you Dash, difficult terrain doesn't cost you extra movement and you don't elicit opportunity attacks. Your speed increases by 3 meters." },
      { name: "Tough as Nails", description: "At first level, and whenever you gain a level, your hit point maximum increases by an additional 2 hit points." },
      { name: "Inefficient Metabolism (Flaw)", description: "Your digestion is very poor, and you must consume 5 times the amount of food as most people to sustain yourself." },
    ],
    speed: 9,
  },
  // ─── MUTTS ───────────────────────────────────────────────────────────────────
  {
    name: "Mutts",
    description: "Transgenic admixtures born naturally from genetically engineered parents. Their abilities are wide and varied; they often look strange and lack the predetermined purpose of their parents. Young, strange, and exceptional, mutts are still carving out a niche in the world. They choose 8, 10, or 12 random Genetic Enhancements (with 0, 2, or 4 Genetic Flaws respectively) from the Genetic Enhancements table in Chapter 2.",
    abilityBonuses: {},
    senses: {},
    traits: [
      { name: "Random Genetics", description: "During character creation, choose to have 8 enhancements (0 flaws), 10 enhancements (2 flaws), or 12 enhancements (4 flaws). Roll or choose from the Genetic Enhancements and Genetic Flaws tables in Chapter 2 of the rulebook. Your GM may also allow you to select one flaw while rolling the rest." },
    ],
    speed: 9,
  },
  // ─── OPTIMIZED ───────────────────────────────────────────────────────────────
  {
    name: "Optimized",
    description: "Your genes were selected from the very best your parents had to offer. Genetically optimized humans are generally healthier, longer-lived, faster, more attractive, stronger and smarter than conventionally born children. With roughly 1.5 billion optimized humans on earth by 2090, they represent the economic and social elite, comfortable in the Machiavellian world of the syndicates.",
    abilityBonuses: {},
    senses: {},
    traits: [
      { name: "Ability Score Increase", description: "Three ability scores of your choice increase by 2. All of your other ability scores are increased by 1." },
      { name: "Educated", description: "You gain proficiency in two skills from the following list: Bureaucracy, Computers, Life Science, Mechanics, Performance, Physical Science, and Social Science." },
      { name: "Optimized Immune System", description: "You gain advantage on saving throws against poison or disease." },
      { name: "Silver Spoon", description: "You count as one category higher for your lifestyle granted by your Mosaic score. At 1st level, you start with an additional シ5,000, and every time you gain a level you gain your new level × シ1,000 in cash." },
      { name: "Upgrade Tolerance", description: "You are able to have up to nine cyberware or biohack enhancements instead of the usual eight." },
    ],
    speed: 9,
  },
  // ─── TRANSHUMAN ──────────────────────────────────────────────────────────────
  {
    name: "Transhuman",
    description: "Whatever genome you were born with, you've since transitioned to an almost entirely biosynthetic body through synthetic body conversion — the most serious modification a person can get. Only 5% of your original body remains (parts of the brain and spinal column). Your transhuman body can look any way you desire, allowing any sex, size, or shape the human body can come in. It still needs food and water to survive.",
    abilityBonuses: { strength: 2 },
    senses: {},
    traits: [
      { name: "Ability Score Purchase", description: "Instead of the standard ability score generation methods, you purchase your base ability scores using a シ400,000 budget. Costs: 10=free, 11=シ10k, 12=シ20k, 13=シ30k, 14=シ50k, 15=シ70k, 16=シ100k, 17=シ130k, 18=シ170k. Any unspent money is lost. You cannot buy higher ability scores afterwards except through upgrades." },
      { name: "Cosmetic Flexibility", description: "While human in function and general appearance, many transhumans opt to look cosmetically different — moving wings, color-shifting or furry skin, a moving tail, extra eyes, or whatever else you can imagine. These alterations have no in-game effect outside of aesthetics and fitting in with certain crowds. At your discretion, you may start with either a strange or inhuman appearance." },
    ],
    speed: 9,
  },
  // ─── UNMODIFIED ──────────────────────────────────────────────────────────────
  {
    name: "Unmodified",
    description: "Conventionally conceived and born humans are by far the most common genome on earth — roughly 9 billion of the 11 billion people on earth. Despite the apparent advantages of the genetically engineered, humans are as prosperous as ever. Diversity is an unmodified human's biggest advantage. Humans tend to be curious, adaptive, flexible, and passionate.",
    abilityBonuses: {},
    senses: {},
    traits: [
      { name: "Ability Score Increase", description: "Two ability scores of your choice are increased by 1." },
      { name: "Diverse", description: "You gain one feat of your choice, and proficiency in one skill of your choice." },
      { name: "Upgrade Tolerance", description: "You are able to have up to ten upgrades instead of the usual eight." },
      { name: "Subtype — Destiny's Chosen", description: "(Choose one subtype) You are a statistical anomaly who always seems to prosper. Better Lucky Than Good: when you roll a 1 on an attack, check, or save, you can reroll and must use the new roll; when an opponent rolls a 20 against you, roll a d20 and use that as their roll instead. Statistically Improbable: once per session, when you fail any roll, you can automatically make it a success. Uncanny Survival: once per session, when a roll that targets you succeeds, you can automatically make it fail." },
      { name: "Subtype — Veteran", description: "(Choose one subtype) You start at a higher level than your compatriots (see Veteran Advancement table). Old School: select an additional Background, gaining all associated proficiencies and traits. Cannot be younger than 40. Contact: once per session, call upon a contact to recruit their expertise, abilities, resources, or knowledge (cannot be used in combat). Tools of the Trade: extra starting money based on your starting level." },
      { name: "Subtype — Cyborg", description: "(Choose one subtype) You've undergone significant enhancement since birth. Upgraded: select up to four different upgrades worth up to シ25,000 each. Whenever granted an upgrade through a class feature, you can replace one of your selected upgrades with a qualifying class upgrade. Debt: you owe whoever fronted the money シ100,000 (or an equivalent favor) — they will come calling." },
    ],
    speed: 9,
  },
];

export const CLASSES: ClassData[] = [
  {
    name: "Biohacker",
    hitDie: 8,
    savingThrows: ["intelligence", "dexterity"],
    armorProficiencies: "Light armor",
    weaponProficiencies: "Simple weapons",
    skillChoices: ["bureaucracy", "computers", "deception", "drive", "insight", "investigation", "physicalScience", "mechanics", "socialScience", "survival"],
    numSkillChoices: 2,
    mandatorySkills: ["lifeScience"],
    featuresByLevel: {
      1: [
        { name: "Hacking", description: "You are able to use hacks that alter physiology and anatomy the way a potter molds clay. Intelligence is your hacking ability. Hack save DC = 8 + proficiency bonus + Intelligence modifier. You start knowing three 1st-level hacks of your choice from the Biohacker hack list, as well as the nanodoc and forensic scan hacks. You regain all expended hack slots when you finish a long rest." },
        { name: "Life Scientist", description: "You gain expertise in Life Science — your proficiency bonus is doubled for any ability check you make using this skill. Additionally, forensic scan can be run without expending a hack slot as long as you choose to take 10 minutes longer to run it than normal." },
      ],
      2: [{ name: "Conscientious Focus", description: "You've trained your mind to be especially disciplined. This enables you to run an additional hack or upgrade that requires concentration (you may concentrate on one more effect than normal). This feature stacks with any other ability or implant that allows you to concentrate on additional hacks or upgrades." }],
      3: [{ name: "Biotic Aptitude", description: "The Biotic Aptitude you choose reflects your approach to biohacking. It grants you features at 3rd level and then again at 6th, 10th, 14th, and 17th level. Subtypes: Cytomancer (cellular manipulation and healing), Dr. Frankenstein (reanimation and construct enhancement), Protean Grinder (adaptive genetic mutation)." }],
      4: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      5: [{ name: "Biohacker Contact", description: "You gain a contact with ties to the medical or biohacker community — an EMT, doctor, nurse, biologist, geneticist, bioengineer, or similar. You get an additional contact at levels 13 and 18." }],
      6: [{ name: "Biotic Aptitude Feature", description: "You gain a feature from your Biotic Aptitude archetype." }],
      7: [{ name: "Bioware Upgrade", description: "You acquire an upgrade from Chapter 5: Upgrades through your connection to illicit circles, so you can get upgrades that are restricted or banned. At 7th level you may select an upgrade worth up to シ50,000." }],
      8: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      9: [{ name: "Surgical Strikes", description: "Your knowledge of anatomy and physiology allows you to strike with surgical precision on vital organs. Once on each of your turns when you hit with a weapon attack, you can cause the attack to deal an extra 1d8 damage of the same type dealt by the weapon. When you reach 15th level, the extra damage increases to 2d8." }],
      10: [{ name: "Biotic Aptitude Feature", description: "You gain a feature from your Biotic Aptitude archetype." }],
      11: [{ name: "Bioware Upgrade", description: "You gain an additional upgrade. At 11th level you may select an upgrade worth up to シ100,000. Additionally, you can replace one upgrade you already have with another of equal or lesser value." }],
      12: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      13: [{ name: "Biohacker Contact (2nd)", description: "You gain your second contact with ties to the medical or biohacker community." }],
      14: [{ name: "Biotic Aptitude Feature", description: "You gain a feature from your Biotic Aptitude archetype. Also, at 14th level you may select a Bioware Upgrade worth up to シ200,000." }],
      15: [{ name: "Bioware Upgrade", description: "You gain an additional upgrade. At 15th level you may select an upgrade worth up to シ200,000." }],
      16: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      17: [{ name: "Biotic Aptitude Feature", description: "You gain a feature from your Biotic Aptitude archetype." }],
      18: [{ name: "Bioware Upgrade (any)", description: "You gain an additional upgrade and may select any upgrade regardless of cost. Additionally, you gain your 3rd Biohacker Contact." }],
      19: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      20: [{ name: "Double Helix Guru", description: "You have achieved such mastery over certain hacks that you can run them with ease. Choose two 1st-level and one 2nd-level hacks that you know. You can run those hacks at their lowest level without expending a hack slot." }],
    },
  },
  {
    name: "Codehacker",
    hitDie: 8,
    savingThrows: ["intelligence", "wisdom"],
    armorProficiencies: "Light armor",
    weaponProficiencies: "Simple weapons",
    skillChoices: ["bureaucracy", "deception", "drive", "investigation", "lifeScience", "mechanics", "physicalScience", "socialScience", "stealth"],
    numSkillChoices: 2,
    mandatorySkills: ["computers"],
    featuresByLevel: {
      1: [
        { name: "Adept Coder", description: "You gain expertise in Computers — your proficiency bonus is doubled for any ability check you make using this skill." },
        { name: "Dataport", description: "You start with a dataport upgrade, and can hook up your daemon directly to other devices that have jacks without using wireless. This bypasses attempts to jam or detect wireless signals and is essential to interface with CCTV and sensitive databases that lack wireless capability." },
        { name: "Hacking", description: "You are able to use hacks to cut through anything that has a computer inside, which is pretty much everything, including human minds. Intelligence is your hacking ability. Hack save DC = 8 + proficiency bonus + Intelligence modifier. You start knowing three 1st-level hacks of your choice, as well as the decrypt and unlock hacks. You regain all expended hack slots when you finish a long rest." },
      ],
      2: [
        { name: "Custom OS", description: "You've custom made your own OS, and it runs incredibly efficiently. This enables you to run an additional program or upgrade that requires concentration (you may concentrate on one more effect than normal). This feature stacks with any other ability or implant that allows you to concentrate on additional hacks or upgrades." },
        { name: "Traumatize", description: "You developed a technique to inflict confusion, pain, and psychic trauma on an individual. As an action, target an enemy within 36 meters that you can see. They must make a Wisdom saving throw, and if they fail, they take 1d12 psychic damage. This damage increases to 2d12 at level 6, 3d12 at level 11, and 4d12 at level 17. This feature is considered a mind hack." },
      ],
      3: [{ name: "Hacker Archetype", description: "The hacker archetype you choose reflects your approach to hacking. Your hacker archetype choice grants you features at 3rd level and then again at 6th, 10th, 14th, 17th, and 18th level. Subtypes: Cracker (breaking through digital security), Puppeteer (controlling minds and systems), Synergist (linking minds into a combat network)." }],
      4: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      5: [{ name: "Cyber Contact", description: "You gain a contact with ties to the hacker community — a government white-hat, criminal cracker, Silicon Valley coder, basement troll, or any other hacker. You get an additional contact at levels 9, 13, and 18." }],
      6: [{ name: "Archetype Feature", description: "You gain a feature from your Hacker Archetype." }],
      7: [{ name: "Pirate Upgrade", description: "You acquire an upgrade from Chapter 5: Upgrades through your connection to pirate hacker circles, so you can get upgrades that are restricted or banned. At 7th level you may select an upgrade worth up to シ50,000." }],
      8: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      9: [
        { name: "Cyber Contact (2nd)", description: "You gain your second contact with ties to the hacker community." },
        { name: "Targeting Firmware", description: "You've developed firmware that optimizes your hand-eye coordination when aiming and firing. You gain a damage bonus to all damage rolls equal to your Intelligence modifier." },
      ],
      10: [{ name: "Archetype Feature", description: "You gain a feature from your Hacker Archetype." }],
      11: [{ name: "Pirate Upgrade", description: "You gain an additional upgrade. At 11th level you may select an upgrade worth up to シ100,000. Additionally, you can replace one upgrade you already have with another of equal or lesser value." }],
      12: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      13: [{ name: "Cyber Contact (3rd)", description: "You gain your third contact with ties to the hacker community." }],
      14: [{ name: "Archetype Feature", description: "You gain a feature from your Hacker Archetype." }],
      15: [{ name: "Pirate Upgrade", description: "You gain an additional upgrade and may replace one you already have with a more expensive one." }],
      16: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      17: [{ name: "Archetype Feature", description: "You gain a feature from your Hacker Archetype." }],
      18: [{ name: "Pirate Upgrade (any)", description: "You gain an additional upgrade and may select any upgrade regardless of cost. Additionally, you gain your 4th Cyber Contact." }],
      19: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      20: [{ name: "Codemaster", description: "You have achieved such mastery over certain hacks that you can run them with ease. Choose two 1st-level and one 2nd-level hacks that you know. You can run those hacks at their lowest level without expending a hack slot." }],
    },
  },
  {
    name: "Crook",
    hitDie: 8,
    savingThrows: ["dexterity", "intelligence"],
    armorProficiencies: "Light armor",
    weaponProficiencies: "Simple weapons",
    skillChoices: ["acrobatics", "athletics", "bureaucracy", "computers", "deception", "drive", "insight", "intimidation", "investigation", "mechanics", "perception", "performance", "persuasion", "sleightOfHand", "stealth", "streetwise"],
    numSkillChoices: 4,
    featuresByLevel: {
      1: [
        { name: "Expertise", description: "Choose two of your skill proficiencies. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies." },
        { name: "Sneak Attack", description: "Once per turn you can deal extra damage to one creature you hit with a finesse or ranged weapon if you have advantage on the attack roll. The extra damage is 1d6, and increases as you gain crook levels: 2d6 at 3rd, 3d6 at 5th, 4d6 at 7th, 5d6 at 9th, 6d6 at 11th, 7d6 at 13th, 8d6 at 15th, 9d6 at 17th, 10d6 at 19th. You don't need advantage if another enemy of the target is within 1.5 meters of it." },
      ],
      2: [{ name: "Cunning Action", description: "You can use a bonus action to take the Dash, Disengage, or Hide action." }],
      3: [
        { name: "Crooked Path", description: "You choose a criminal archetype that grants you features at 3rd level and then again at 9th, 13th, and 17th level. Subtypes: Hitman (contract killer and assassin — Assassinate, Prey Dossier), Robber (safecracker and burglar — Pickpocket, Safecracker)." },
        { name: "Shady Contact", description: "You gain a contact with ties to the criminal underworld. You get an additional contact at levels 7, 11, 15, and 18." },
      ],
      4: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      5: [{ name: "Illicit Upgrade", description: "You acquire an upgrade from Chapter 5: Upgrades through your criminal connections, so you can get upgrades that are restricted or banned. You gain additional upgrades at levels 7, 11, 14, and 18." }],
      6: [{ name: "Uncanny Dodge", description: "When an attacker that you can see hits you with an attack, you can use your reaction to halve the attack's damage against you." }],
      7: [
        { name: "Illicit Upgrade", description: "You gain an additional upgrade through your criminal connections." },
        { name: "Shady Contact (2nd)", description: "You gain your second contact with ties to the criminal underworld." },
      ],
      8: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      9: [{ name: "Crooked Path Feature", description: "You gain a feature from your Crooked Path archetype." }],
      10: [
        { name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." },
        { name: "Safe House", description: "You have a safe house — a hideout known only to you and your most trusted allies. Work with your GM to determine its location and what it contains. It provides a secure place to rest, store contraband, and lay low." },
      ],
      11: [
        { name: "Illicit Upgrade", description: "You gain an additional upgrade through your criminal connections." },
        { name: "Shady Contact (3rd)", description: "You gain your third contact with ties to the criminal underworld." },
      ],
      12: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      13: [{ name: "Crooked Path Feature", description: "You gain a feature from your Crooked Path archetype." }],
      14: [{ name: "Illicit Upgrade", description: "You gain an additional upgrade through your criminal connections." }],
      15: [{ name: "Shady Contact (4th)", description: "You gain your fourth contact with ties to the criminal underworld." }],
      16: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      17: [{ name: "Crooked Path Feature", description: "You gain a feature from your Crooked Path archetype." }],
      18: [
        { name: "Illicit Upgrade", description: "You gain an additional upgrade through your criminal connections." },
        { name: "Shady Contact (5th)", description: "You gain your fifth contact with ties to the criminal underworld." },
      ],
      19: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      20: [{ name: "Infamous", description: "Your reputation in the criminal underworld is legendary. Criminals everywhere know your name. You have advantage on all Intimidation and Persuasion checks against members of criminal organizations. Additionally, you can add your proficiency bonus to your Sneak Attack damage once per turn as a flat bonus." }],
    },
  },
  {
    name: "Engineer",
    hitDie: 8,
    savingThrows: ["constitution", "intelligence"],
    armorProficiencies: "Light armor",
    weaponProficiencies: "Simple weapons",
    skillChoices: ["bureaucracy", "computers", "deception", "drive", "investigation", "lifeScience", "physicalScience", "socialScience", "stealth"],
    numSkillChoices: 2,
    mandatorySkills: ["mechanics"],
    featuresByLevel: {
      1: [
        { name: "Hacking", description: "You are able to use hacks to modify, create, and enhance technology. Intelligence is your hacking ability. Hack save DC = 8 + proficiency bonus + Intelligence modifier. You start knowing three 1st-level hacks of your choice from the engineer hack list, as well as the arc drone and tase hacks. You regain all expended hack slots when you finish a long rest." },
        { name: "Technical Expertise", description: "You gain expertise in Mechanics — your proficiency bonus is doubled for any ability check you make that uses this proficiency." },
      ],
      2: [{ name: "Construct Gear", description: "You can fabricate your own devices and gadgets, either repairing second-hand stuff or making it from scratch. Instead of buying any gear item, you can make it yourself paying only half the money. This takes 1 hour per シ1,000 in listed price (minimum 1 hour), and the listed price may not exceed シ5,000 x your engineer level. Cannot be used for weapons or armor. Each time you use crafted DIY gear, roll 1d20 — on a 1, it malfunctions for 1 minute." }],
      3: [{ name: "Engineer Archetype", description: "The engineer archetype you choose reflects your approach to engineering. It grants features at 3rd level and then again at 6th, 10th, 14th, and 17th level. Subtypes: Gadgeteer (experimental device crafter), Gearhead (vehicle and mechanical expert), Roboticist (combat drone and synthetic companion builder)." }],
      4: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      5: [{ name: "Builder Contact", description: "You gain a contact with ties to the engineering and manufacturing world. You get an additional contact at levels 13 and 18." }],
      6: [{ name: "Archetype Feature", description: "You gain a feature from your Engineer Archetype." }],
      7: [{ name: "Tech Upgrade", description: "You acquire an upgrade from Chapter 5: Upgrades through your connections to engineering and manufacturing. At 7th level you may select an upgrade worth up to シ50,000." }],
      8: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      9: [{ name: "Structural Exploit", description: "You have learned to exploit structural weaknesses in technology and machinery. When you hit a droid, drone, or vehicle with a weapon attack, you can deal additional damage equal to your Intelligence modifier." }],
      10: [{ name: "Archetype Feature", description: "You gain a feature from your Engineer Archetype." }],
      11: [{ name: "Tech Upgrade", description: "You gain an additional upgrade. At 11th level you may select an upgrade worth up to シ100,000. Additionally, you can replace one upgrade you already have with another of equal or lesser value." }],
      12: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      13: [{ name: "Builder Contact (2nd)", description: "You gain your second contact with ties to the engineering and manufacturing world." }],
      14: [{ name: "Archetype Feature", description: "You gain a feature from your Engineer Archetype. Also, at 14th level you may select a Tech Upgrade worth up to シ200,000." }],
      15: [{ name: "Tech Upgrade", description: "You gain an additional upgrade worth up to シ200,000." }],
      16: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      17: [{ name: "Archetype Feature", description: "You gain a feature from your Engineer Archetype." }],
      18: [{ name: "Tech Upgrade (any)", description: "You gain an additional upgrade and may select any upgrade regardless of cost. Additionally, you gain your 3rd Builder Contact." }],
      19: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      20: [{ name: "Patented Hacks", description: "You have achieved such mastery over certain hacks that you can run them with ease. Choose two 1st-level and one 2nd-level hacks that you know. You can run those hacks at their lowest level without expending a hack slot." }],
    },
  },
  {
    name: "Gunfighter",
    hitDie: 10,
    savingThrows: ["dexterity", "constitution"],
    armorProficiencies: "All armor",
    weaponProficiencies: "Simple weapons, martial ranged weapons",
    skillChoices: ["acrobatics", "athletics", "computers", "drive", "insight", "intimidation", "mechanics", "perception", "stealth", "streetwise", "survival"],
    numSkillChoices: 2,
    featuresByLevel: {
      1: [
        { name: "Fighting Style", description: "You adopt a particular style of fighting as your specialty. Choose one: Marksman (+2 bonus to attack rolls with ranged weapons), Defense (+1 bonus to AC while wearing armor), Machine Gunner (reduce recoil by 3 when using the auto feature of a firearm), Pistoleer (+2 bonus to damage rolls with firearms with the 'close' property). You can't take the same Fighting Style more than once." },
        { name: "Take Cover", description: "When you are hit by a ranged attack, you can use your reaction to dive for cover, reducing the damage taken. You have one use of this feature. You gain additional uses at 11th level (two uses) and 20th level (three uses)." },
      ],
      2: [{ name: "Action Surge", description: "On your turn, you can take one additional action. Once you use this feature, you must finish a short or long rest before you can use it again. You gain two uses at 13th level and three uses at 20th level." }],
      3: [{ name: "Way of the Gun", description: "The way of the gun you choose reflects your approach to firearms combat. It grants you features at 3rd level and then again at 7th, 10th, 15th, and 18th level. Subtypes: Gunslinger (quick-draw pistol specialist — Improved Handgun Critical, Quickdraw), Sniper (long-range precision — Deadly Aim, targeting body parts), Soldier (military tactics and upgrades — Soldier Military Upgrade, Armored Comfort)." }],
      4: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      5: [{ name: "Extra Attack", description: "You can attack twice, instead of once, whenever you take the Attack action on your turn." }],
      6: [{ name: "Military Upgrade", description: "You acquire an upgrade from Chapter 5: Upgrades through military connections. At 6th level you may select an upgrade worth up to シ30,000." }],
      7: [
        { name: "Way of the Gun Feature", description: "You gain a feature from your Way of the Gun archetype." },
        { name: "Military Contact", description: "You gain a contact with ties to military or law enforcement. You get an additional contact at 13th level." },
      ],
      8: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      9: [
        { name: "Military Upgrade", description: "You gain an additional Military Upgrade worth up to シ75,000." },
        { name: "Evasion", description: "You can nimbly dodge out of the way of certain area effects, such as a grenade blast. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail." },
      ],
      10: [{ name: "Way of the Gun Feature", description: "You gain a feature from your Way of the Gun archetype." }],
      11: [
        { name: "Military Upgrade", description: "You gain an additional Military Upgrade worth up to シ100,000." },
        { name: "Take Cover (two uses)", description: "You can now use your Take Cover feature twice per encounter." },
      ],
      12: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      13: [
        { name: "Action Surge (two uses)", description: "You can now use Action Surge twice before a rest." },
        { name: "Military Contact (2nd)", description: "You gain your second Military Contact." },
      ],
      14: [
        { name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." },
        { name: "Military Upgrade", description: "You gain an additional Military Upgrade worth up to シ200,000." },
      ],
      15: [{ name: "Way of the Gun Feature", description: "You gain a feature from your Way of the Gun archetype." }],
      16: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      17: [{ name: "Military Upgrade (any)", description: "You gain an additional Military Upgrade and may select any upgrade regardless of cost." }],
      18: [{ name: "Way of the Gun Feature", description: "You gain a feature from your Way of the Gun archetype." }],
      19: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      20: [
        { name: "Action Surge (three uses)", description: "You can now use Action Surge three times before a rest." },
        { name: "Take Cover (three uses)", description: "You can now use your Take Cover feature three times per encounter." },
      ],
    },
  },
  {
    name: "Hardcase",
    hitDie: 12,
    savingThrows: ["strength", "constitution"],
    armorProficiencies: "Light armor, medium armor",
    weaponProficiencies: "Simple weapons",
    skillChoices: ["acrobatics", "athletics", "drive", "insight", "intimidation", "perception", "sleightOfHand", "stealth", "streetwise"],
    numSkillChoices: 2,
    featuresByLevel: {
      1: [
        { name: "Unarmored Defense", description: "While you are not wearing any armor, your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier." },
        { name: "Second Wind", description: "On your turn, you can use a bonus action to regain hit points equal to 1d10 + your hardcase level. Once you use this feature, you must finish a short or long rest before you can use it again. You gain 2 uses at 10th level and 3 uses at 15th level." },
        { name: "Pugilist", description: "You are trained in unarmed combat. You can make one unarmed strike or initiate a grapple as a bonus action. Your unarmed strikes deal increased damage as shown on the Hardcase table (1d4 at levels 1–4, 1d6 at 5–8, 1d8 at 9–12, 1d10 at 13–16, 1d12 at 17–20). You can also use your action to attempt to pin a grappled creature." },
        { name: "Brutal Focus (d4)", description: "As a bonus action, you can choose a target you can see within 18 meters and single it out as the total focus of your violent tendencies. You deal an extra 1d4 damage to the target whenever you hit it with a weapon attack. This ability requires concentration. All of your attacks must be directed toward the Brutal Focus target while this is active." },
      ],
      2: [{ name: "Fighting Style", description: "You adopt a particular style of fighting as your specialty. Choose one Fighting Style. You can't take the same Fighting Style option more than once." }],
      3: [{ name: "Brute Specialty", description: "You choose a specialty that reflects your fighting approach. It grants features at 3rd level and then again at 7th, 9th, and 14th level. Subtypes: Damage Sponge (unstoppable tank), Gangster (street enforcer with criminal connections), Unarmed Fighter (bare-knuckle brawler)." }],
      4: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      5: [{ name: "Extra Attack", description: "You can attack twice, instead of once, whenever you take the Attack action on your turn." }],
      6: [
        { name: "Shady Contact", description: "You gain a contact with ties to the criminal underworld. You get an additional contact at levels 13 and 17." },
        { name: "Heavy Hands", description: "When you score a critical hit with an unarmed strike, the target is knocked prone." },
        { name: "Brutal Focus (d6)", description: "Your Brutal Focus bonus damage increases to 1d6." },
      ],
      7: [
        { name: "Illicit Upgrade", description: "You acquire an upgrade from Chapter 5: Upgrades through your criminal connections. At 7th level you may select an upgrade worth up to シ50,000." },
        { name: "Specialty Feature", description: "You gain a feature from your Brute Specialty." },
      ],
      8: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      9: [
        { name: "Indomitable", description: "You can reroll a saving throw that you fail. If you do so, you must use the new roll. You can use this feature once between long rests. You gain 2 uses at 13th level and 3 uses at 17th level." },
        { name: "Specialty Feature", description: "You gain a feature from your Brute Specialty." },
      ],
      10: [
        { name: "Relentless Stamina", description: "When you are reduced to 0 hit points but not killed outright, you can make a DC 10 Constitution saving throw. On a success, you drop to 1 hit point instead. Each time you use this feature after the first, the DC increases by 5. The DC resets when you finish a long rest." },
        { name: "Second Wind (2 uses)", description: "You can now use Second Wind twice per short or long rest." },
      ],
      11: [
        { name: "Illicit Upgrade", description: "You gain an additional upgrade through your criminal connections worth up to シ100,000." },
        { name: "Scary", description: "As an action, you can attempt to frighten a creature within 9 meters. The creature must make a Wisdom saving throw against DC 8 + your proficiency bonus + your Strength modifier or become frightened of you for 1 minute." },
        { name: "Brutal Focus (d8)", description: "Your Brutal Focus bonus damage increases to 1d8." },
      ],
      12: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      13: [
        { name: "Indomitable (2 uses)", description: "You can now use Indomitable twice between long rests." },
        { name: "Shady Contact (2nd)", description: "You gain your second contact with ties to the criminal underworld." },
      ],
      14: [{ name: "Specialty Feature", description: "You gain a feature from your Brute Specialty." }],
      15: [
        { name: "Second Wind (3 uses)", description: "You can now use Second Wind three times per short or long rest." },
        { name: "Illicit Upgrade", description: "You gain an additional upgrade through your criminal connections worth up to シ200,000." },
      ],
      16: [
        { name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." },
        { name: "Brutal Focus (d10)", description: "Your Brutal Focus bonus damage increases to 1d10." },
      ],
      17: [
        { name: "Indomitable (3 uses)", description: "You can now use Indomitable three times between long rests." },
        { name: "Shady Contact (3rd)", description: "You gain your third contact with ties to the criminal underworld." },
      ],
      18: [
        { name: "Unwavering Might", description: "You are nearly impossible to stop. You have advantage on saving throws against being frightened or charmed. Additionally, when you are grappled or restrained, you can use your bonus action to attempt to break free." },
        { name: "Illicit Upgrade (any)", description: "You gain an additional upgrade through your criminal connections and may select any upgrade regardless of cost." },
      ],
      19: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      20: [
        { name: "Rampage", description: "When your Brutal Focus is active, all of your hits against the target of your Brutal Focus are automatically critical hits. Additionally, you add +5 to all Relentless Stamina Constitution saving throws." },
        { name: "Brutal Focus (d12)", description: "Your Brutal Focus bonus damage increases to 1d12." },
      ],
    },
  },
  {
    name: "Samurai",
    hitDie: 10,
    savingThrows: ["strength", "dexterity"],
    armorProficiencies: "Light armor, medium armor",
    weaponProficiencies: "Simple weapons, martial melee weapons",
    skillChoices: ["acrobatics", "athletics", "drive", "insight", "intimidation", "investigation", "perception", "socialScience", "stealth", "streetwise"],
    numSkillChoices: 3,
    featuresByLevel: {
      1: [
        { name: "Unarmored Defense", description: "Starting at 1st level, while you are not wearing any armor, your Armor Class equals 10 + your Dexterity modifier + your Wisdom modifier." },
        { name: "Martial Arts", description: "Your practice of martial arts gives you mastery of combat styles that use unarmed strikes and melee attacks while unarmored or wearing light or medium armor. You can use Dexterity instead of Strength for the attack rolls of your unarmed strikes. Your unarmed strikes inflict increased damage as shown on the Samurai table (1d4 at 1–4, 1d6 at 5–8, 1d8 at 9–12, 1d10 at 13–16, 1d12 at 17–20). You can make an unarmed strike or initiate a grapple as a bonus action, and you can use your action or bonus action to try to pin a grappled creature." },
        { name: "Ki", description: "Your training allows you to harness ki energy. Your samurai level determines the number of ki points you have (1 at level 1, increasing by 1 each level). You regain all spent ki at the end of a short or long rest (you must spend at least 30 minutes meditating). Ki save DC = 8 + proficiency bonus + Wisdom modifier. Starting features: Flurry of Blows (spend 1 ki after Attack action to make two unarmed strikes as bonus action), Patient Defense (spend 1 ki to Dodge as bonus action), Step of the Wind (spend 1 ki to Disengage or Dash as bonus action, jump distance doubled)." },
      ],
      2: [{ name: "Fighting Style", description: "At level 2, you adopt a particular style of fighting as your specialty. Choose one Fighting Style. You can't take the same Fighting Style option more than once." }],
      3: [{ name: "Bujutsu Training", description: "You choose a Bujutsu Training archetype and also learn one technique from the Bujutsu Training list. You gain additional techniques at levels 6, 9, 13, 15, 17, and 20. Each time you get a new Bujutsu Training, you may also replace one technique you know with a different one." }],
      4: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      5: [
        { name: "Extra Attack", description: "Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn. At 20th level, you can attack three times." },
        { name: "Senshi Upgrade", description: "You acquire an upgrade from Chapter 5: Upgrades through your connections to either private, municipal, or national military forces. At 5th level you may select an upgrade worth up to シ25,000." },
      ],
      6: [{ name: "Bujutsu Training", description: "You learn an additional technique from the Bujutsu Training list." }],
      7: [
        { name: "Senshi Upgrade", description: "You gain an additional Senshi Upgrade worth up to シ50,000." },
        { name: "Samurai Contact", description: "You gain a contact that has gone through the Bushido training academy — a samurai working for Bushido as a mercenary, instructor, or administrator, or a free-lance samurai. You get an additional contact at level 14." },
      ],
      8: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      9: [{ name: "Bujutsu Training", description: "You learn an additional technique from the Bujutsu Training list." }],
      10: [{ name: "Calm the Hungry Ghost", description: "By 10th level, you have reduced the nagging effect of your ego, recognizing its emptiness. You gain proficiency in Charisma saving throws." }],
      11: [{ name: "Senshi Upgrade", description: "You gain an additional Senshi Upgrade worth up to シ100,000. Additionally, you can replace one upgrade you already have with another of equal or lesser value." }],
      12: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      13: [{ name: "Bujutsu Training", description: "You learn an additional technique from the Bujutsu Training list." }],
      14: [
        { name: "Senshi Upgrade", description: "You gain an additional Senshi Upgrade worth up to シ200,000." },
        { name: "Samurai Contact (2nd)", description: "You gain your second Samurai Contact." },
      ],
      15: [{ name: "Bujutsu Training", description: "You learn an additional technique from the Bujutsu Training list." }],
      16: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      17: [{ name: "Bujutsu Training", description: "You learn an additional technique from the Bujutsu Training list." }],
      18: [{ name: "Senshi Upgrade (any)", description: "You gain an additional Senshi Upgrade and may select any upgrade regardless of cost." }],
      19: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      20: [
        { name: "Extra Attack (2)", description: "You can now attack three times whenever you take the Attack action on your turn." },
        { name: "Bujutsu Training", description: "You learn an additional technique from the Bujutsu Training list." },
      ],
    },
  },
  {
    name: "Suit",
    hitDie: 8,
    savingThrows: ["wisdom", "charisma"],
    armorProficiencies: "Light armor",
    weaponProficiencies: "Simple weapons",
    skillChoices: ["acrobatics", "athletics", "bureaucracy", "computers", "deception", "drive", "insight", "intimidation", "investigation", "lifeScience", "mechanics", "perception", "performance", "persuasion", "socialScience", "stealth"],
    numSkillChoices: 4,
    featuresByLevel: {
      1: [
        { name: "Inspiration (d6)", description: "You can inspire others through your words and presence. As a bonus action, you can choose one creature other than yourself within 18 meters that can hear you. That creature gains an Inspiration die (d6). Once within the next 10 minutes, the creature can roll the die and add the result to one ability check, attack roll, or saving throw. The Inspiration die increases to d8 at 5th level, d10 at 11th level, and d12 at 15th level." },
        { name: "Power Network", description: "Suits are always backed by a powerful organization. At level 1, decide which power network you associate with and have power in: a government or military agency (FBI, CIA, NSA, INTERPOL, etc.), a major megacorporation (Apex International, Apollo Laboratories, Ronin, Cornucopia, Worldgroup Holdings, Infinity Industries, Unicom, Omnitech, Hexie), or a crime syndicate (Camorra, North Jopok, Ndrangheta, Sinaloa, Solntsevskaya Bratva, Yamaguchi Gumi)." },
        { name: "Call in a Favor", description: "As an important asset, you can tap your relationship with your power network to pull strings. You have 2 favors (shown on the Suit table, increasing each level). At the start of each game session, you regain all favors. Sample favors include: Bodyguard (level 3), Background Check (level 5), Clean Up Crew (level 5), Disable Vehicle (level 9), Extraction Vehicle (any level), Aegis Particle Beam (level 17, costs 3 favors)." },
      ],
      2: [
        { name: "Moxy", description: "You can add your Charisma modifier to saving throws." },
        { name: "Sneak Attack", description: "Beginning at 2nd level, you know how to strike when the moment is right. Once per turn you can deal extra 1d6 damage with a finesse or ranged weapon if you have advantage on the attack roll. Increases to 2d6 at 5th, 3d6 at 8th, 4d6 at 11th, 5d6 at 14th, 6d6 at 17th, 7d6 at 20th." },
      ],
      3: [
        { name: "Career Path", description: "Your career path reflects the type of suit you are. It grants features at 3rd level and again at 6th, 9th, 13th, and 17th level. Subtypes: Commander (tactical leader and squad coordinator), G-Man (federal agent with investigative and enforcement powers), Shark (corporate operative who can also use hacking)." },
        { name: "Contact", description: "You gain a contact through your power network. You get additional contacts at levels 6, 9, 15, and 18." },
      ],
      4: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      5: [
        { name: "Promotion", description: "You have been promoted within your power network, granting you access to greater resources and authority. You gain 3 favors per session instead of 2. You receive additional promotions at levels 11, 14, and 18." },
        { name: "Inspiration (d8)", description: "Your Inspiration die increases to d8." },
      ],
      6: [
        { name: "Career Path Feature", description: "You gain a feature from your Career Path." },
        { name: "Contact (2nd)", description: "You gain your second contact through your power network." },
      ],
      7: [
        { name: "Contagious Moxy", description: "Allies within 9 meters of you can add your Charisma modifier to their saving throws as well." },
        { name: "Adaptive Learning", description: "You can gain proficiency in any skill for 24 hours after spending 10 minutes studying or practicing it. You can only maintain one such temporary proficiency at a time." },
      ],
      8: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      9: [
        { name: "Career Path Feature", description: "You gain a feature from your Career Path." },
        { name: "Contact (3rd)", description: "You gain your third contact through your power network." },
      ],
      10: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      11: [
        { name: "Promotion", description: "You have been promoted again. You now gain 6 favors per session." },
        { name: "Inspiration (d10)", description: "Your Inspiration die increases to d10." },
      ],
      12: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      13: [{ name: "Career Path Feature", description: "You gain a feature from your Career Path." }],
      14: [
        { name: "Promotion", description: "You have been promoted again. You now gain 7 favors per session." },
        { name: "Easy Inspiration", description: "You can now grant Inspiration as a free action (instead of a bonus action) on your turn." },
      ],
      15: [
        { name: "Inspiration (d12)", description: "Your Inspiration die increases to d12." },
        { name: "Contact (4th)", description: "You gain your fourth contact through your power network." },
      ],
      16: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      17: [{ name: "Career Path Feature", description: "You gain a feature from your Career Path." }],
      18: [
        { name: "Promotion", description: "You have been promoted to the highest levels of your network. You now gain 9 favors per session." },
        { name: "Contact (5th)", description: "You gain your fifth contact through your power network." },
      ],
      19: [{ name: "Ability Score Improvement", description: "You can increase one ability score by 2, or two ability scores by 1. You can't increase an ability score above your maximum using this feature." }],
      20: [{ name: "Superior Inspiration", description: "When you roll initiative and you have no Inspiration dice remaining, you regain one Inspiration die. Additionally, when you give a creature Inspiration, you can also give one to yourself." }],
    },
  },
];

export const BACKGROUNDS: BackgroundData[] = [
  {
    name: "Academic",
    description: "You spent years in university studying your discipline. Books, research, and learning the mysteries of human nature and the universe are your life. You likely have a master's or doctoral degree in some academic discipline, and you may have even been a professor. Specialties include: Anthropologist, Biologist, Chemist, Historian, Literature Scholar, Philosopher, Physicist, or Psychologist.",
    skillProficiencies: ["bureaucracy", "lifeScience", "socialScience", "physicalScience", "computers"],
    featureName: "Research Focus",
    featureDescription: "You've spent thousands of hours on literature reviews, so your search-fu is excellent when it comes to finding primary sources of research. If you are looking for information even tangentially related to your specialty, you know exactly where to look and whom to speak to if you want to go deeper. Your GM might rule that the knowledge you seek is behind a paywall, or that it is in a classified database.",
    toolProficiencies: "Vocational Proficiency: Academic Specialty",
    languages: "Two of your choice",
  },
  {
    name: "Artist",
    description: "You are a creative spirit who needs to produce art for an audience. Bringing form to emotion and human experience is the essence of life for you. Art mediums include: Actor, Painter, Comedian, Dancer, Singer, Author, Poet, Musician, Director, or Acrobat. Variant: Professional Fighter (you can replace Acrobatics with Athletics).",
    skillProficiencies: ["performance", "acrobatics", "persuasion"],
    featureName: "Limited Fame",
    featureDescription: "For anyone interested in your medium, you are something of a celebrity. People that recognize you are inclined to help you for free, and you have advantage on any Charisma checks made against them. Additionally, you can wrangle up a place to perform quite easily, as long as it is a venue appropriate to your medium.",
    toolProficiencies: "Vocational Proficiency: Artistic Talent",
  },
  {
    name: "Ideologue",
    description: "You have devoted your life to a specific cause or ideology — religious, political, or social in nature (or all three). All of your goals are colored by your passion for this ideology. You pursue your doctrine with religious zeal. Choose a specific religion or ideology: a political party, social movement, cause, world religion, or philosophy.",
    skillProficiencies: ["intimidation", "socialScience"],
    featureName: "Group Power",
    featureDescription: "As a collective, the devotees of your ideology are passionate about the cause and enthusiastic about aiding any ally who promotes the one true way. You can call upon your group to provide shelter, protection, information, or to harass and attack your enemies. Sometimes this requires you to advance the cause in return.",
    toolProficiencies: "Vocational Proficiency: Personal Ideology",
  },
  {
    name: "Investigator",
    description: "You are responsible for solving crimes after the fact or determining if there even is a crime in the first place. You might be a police officer, private detective, corporate intelligence agent, or insurance fraud investigator — any trade that involves uncovering potentially illegal mysteries.",
    skillProficiencies: ["insight", "investigation"],
    featureName: "Seasoned Detective",
    featureDescription: "Your experience in enforcing the law and dealing with lawbreakers gives you a feel for local laws and criminals. You can easily spot and speak with law enforcement, and just as easily pick out the dens of criminal activity in a community, although you're more likely to be welcome in the former locations rather than the latter. The GM might have law enforcement act more favorably towards you.",
    toolProficiencies: "Vocational Proficiency: Interrogation",
  },
  {
    name: "Military Veteran",
    description: "You've spent years working within a military operation. You've seen battle and bloodshed, and you have been trained and disciplined within your unit to be a lethal killer. Military specialties include: Officer, Navy, Infantry, Cavalry, Mechanic, Medic, Military Police, or Air Force.",
    skillProficiencies: ["athletics", "drive", "intimidation"],
    featureName: "Military Contact",
    featureDescription: "You still have a good relationship with an old buddy from your service years, and you can call upon them for help. Once per session, you can call upon the contact to recruit their expertise, abilities, resources, or knowledge, but they cannot be used to aid you in combat.",
    toolProficiencies: "Vocational Proficiency: Military Procedures. Choose two proficiencies from: Athletics, Drive, Medium Armor, and Ranged Martial Weapons",
  },
  {
    name: "Outlaw",
    description: "You have spent a large portion of your life making your living on the wrong side of the law. You are no stranger to theft, murder, fraud, and other felonies. Your motives could be some combination of profit, desperation, excitement, or power. You very likely are involved with organized crime — bratva, yakuza, triads, Sicilian mafia, or local gangs. Specialties include: Dealer, Burglar, Hustler, Car Jacker, Hired Killer, Forger, Kidnapper, Muscle.",
    skillProficiencies: ["intimidation", "streetwise"],
    featureName: "Criminal Contacts",
    featureDescription: "You have a contact who is part of a criminal organization and can provide shelter, fence stolen goods, provide information, and get you access to illicit equipment. Your contact is a reliable information broker. Work with your GM to determine the exact nature of the organization and your standing within it.",
    toolProficiencies: "Vocational Proficiency: Underworld Etiquette",
  },
  {
    name: "Religious Disciple",
    description: "You have spent your life in the service of a temple to a specific god or pantheon of gods. You act as an intermediary between the realm of the holy and the mortal world, performing sacred rites and offering sacrifices. You are not necessarily a priest or cleric, but you have strong ties to a formal faith.",
    skillProficiencies: ["insight", "socialScience"],
    featureName: "Shelter of the Faithful",
    featureDescription: "As a religious disciple, you command the respect of those who share your faith, and you can perform the religious ceremonies of your deity. You and your companions can expect to receive care at a temple, shrine, or other established presence of your faith. Those who share your religion will support you (but only you) at a modest lifestyle. You might also have ties to a specific temple or church where you have a residence.",
    toolProficiencies: "Vocational Proficiency: Religion",
  },
  {
    name: "Slumdog",
    description: "You have spent a great deal of time living utterly destitute in a transgenic ghetto, slum, or favela. You learned to look out for number one and to value basic necessities. Maybe you were a beggar, thief, street vendor, a prostitute, or a junkie (or some combination). Your home has been rooftops, shanties, alleyways, abandoned warehouses, or similar structures.",
    skillProficiencies: ["stealth", "streetwise"],
    featureName: "Slum Savvy",
    featureDescription: "You can navigate slums with ease, and you know the secret paths, places to avoid, and areas for shelter. While traveling through a slum, you and your allies can move at double speed (when not in combat). You also get a +5 to Move checks in a Chase as long as it occurs in a slum. Additionally, you know of safe nooks and crannies to hide in, such as abandoned warehouses or building projects.",
    toolProficiencies: "Vocational Proficiency: Homeless Rapport",
  },
  {
    name: "Stargazer",
    description: "Your prime concern is the true nature of existence and human nature. Philosophy, religion, neuroscience, cosmology, psychology, and other domains that examine the universe and the human condition are your forte. You might be a priest, shaman, philosopher, hallucinogenic drug enthusiast, scientist, or another vocation with a penchant for soul searching.",
    skillProficiencies: ["insight", "socialScience"],
    featureName: "Comfort of the Enlightened",
    featureDescription: "Your time examining and reflecting on the universe and your relation to it has immunized you to some of the horrors of it. You have advantage on saving throws versus fear. Additionally, once per session, the GM can give you a clue about a mystery you haven't solved yet.",
    toolProficiencies: "Vocational Proficiency: Introspection",
  },
  {
    name: "Technician",
    description: "You have dedicated a large portion of your life to a craft or trade — brewing, genome design, electrician work, coding, carpentry, mechanics, or glass blowing. You are a well-established tradesperson or professional technician with a solid reputation for excellence in niche circles. Variant: Merchant (Insight and Persuasion instead, Merchant vocational proficiency).",
    skillProficiencies: ["computers", "insight", "lifeScience", "physicalScience", "mechanics", "performance"],
    featureName: "Excellent Reputation",
    featureDescription: "You have limited fame and perhaps even celebrity status surrounding your craft, and whenever you meet a fan, they are much more willing to help you.",
    toolProficiencies: "Vocational Proficiency: Technician (based on your specific trade/business)",
  },
  {
    name: "Trust Fund Kid",
    description: "You understand wealth, power, and privilege. Your family owns a great deal of wealth and wields significant political influence. You've grown up in this social class and soaked in all the benefits, receiving a private education and a life free of student loans.",
    skillProficiencies: ["persuasion", "socialScience"],
    featureName: "Position of Privilege",
    featureDescription: "Thanks to your privileged birth, people are inclined to think the best of you. Your family name precedes you, and you are welcome in high society. People assume you have the right to be wherever you are. You can secure an audience with celebrities and can get into fine restaurants based on your name.",
    toolProficiencies: "Vocational Proficiency: Highbrow Etiquette",
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

export interface UpgradeData {
  name: string;
  type: 'bioware' | 'cybernetic' | 'daemon';
  brand: string;
  cost: string;
  effectSummary: string;
  description: string;
  countsAsSlot: boolean;
}

export const UPGRADES: UpgradeData[] = [
  // ─── BIOWARE ────────────────────────────────────────────────────────────────
  {
    name: "Olfactors",
    type: "bioware",
    brand: "TruHound",
    cost: "シ100,000",
    effectSummary: "Able to discern scent to minute detail, and track by scent.",
    description: "Your sense of smell has been biohacked to have countless folds for increased surface area. You can recognize people's unique scent, track them easily (as long as it hasn't rained), and gain incredible details about anything you might eat or drink. While tracking people, you also learn their exact number, their sizes, and how long ago they passed through the area. If you are downwind of someone, it is impossible for them to hide from you, or keep themselves disguised without some major alteration of their scent. Additionally, you have advantage on Wisdom (Perception) checks that rely on smell.",
    countsAsSlot: true,
  },
  {
    name: "Amped Senses",
    type: "bioware",
    brand: "Sentinex",
    cost: "シ40,000",
    effectSummary: "Advantage on Perception and Investigation checks; +5 to passive Perception and Investigation.",
    description: "All of your senses have been biohacked to get a boost, providing you with much more empirical information about your environment. You gain advantage on Wisdom (Perception) and Intelligence (Investigation) ability checks. Additionally, your passive Perception and Investigation gain a +5 bonus.",
    countsAsSlot: true,
  },
  {
    name: "Cellular Rejuvenators",
    type: "bioware",
    brand: "Proteon",
    cost: "シ50,000",
    effectSummary: "It only requires 4 hours to obtain the benefits of a long rest.",
    description: "These handy little biobots swim around your body and streamline the efficiency of rest, speeding along all of the biochemical processes accomplished during sleep. You only need to spend 4 hours of downtime to take a long rest.",
    countsAsSlot: true,
  },
  {
    name: "Cellular Rejuvenators",
    type: "bioware",
    brand: "Hexie",
    cost: "シ200,000",
    effectSummary: "It only requires 2 hours to obtain the benefits of a long rest.",
    description: "These handy little biobots swim around your body and streamline the efficiency of rest. You only need to spend 2 hours of downtime to take a long rest.",
    countsAsSlot: true,
  },
  {
    name: "Cellular Rejuvenators",
    type: "bioware",
    brand: "Apollo",
    cost: "シ600,000",
    effectSummary: "It only requires 2 hours to obtain the benefits of a long rest, and you may take 2 long rests in a 24-hour period.",
    description: "You only need to spend 2 hours of downtime to take a long rest, and you may take 2 long rests in a 24-hour period.",
    countsAsSlot: true,
  },
  {
    name: "Cloakers",
    type: "bioware",
    brand: "Cryptek",
    cost: "シ60,000",
    effectSummary: "Become Invisible (must be naked or wearing transparency-capable clothing).",
    description: "Cloakers are biohacked chromatophores manufactured by Cryptek, residing in every visible surface of your body. They receive light from their environment and transmit it in a fashion that mimics nothing being in the way of the light at all. The effect is perfect camouflage, rendering you Invisible. Your outer surface must not be covered for the cloakers to be effective (you must be naked or wearing clothing with transparency capability), and cloakers have no effect on any of your equipment.",
    countsAsSlot: true,
  },
  {
    name: "Cosmetic Alteration",
    type: "bioware",
    brand: "Varies",
    cost: "シ5,000",
    effectSummary: "Alter your appearance aesthetically (no game-mechanical effect). Does not count as one of your 8 upgrade slots.",
    description: "The increased technological capacity for body alteration has opened up new creative realms. Options include moving angel or bat wings, color-shifting skin or hair, a moving tail, extra eyes, or whatever else the consumer can imagine. These upgrades have no in-game effect outside of their aesthetic and helping you fit in with certain crowds. At the player's discretion it can give you a strange or inhuman appearance. This upgrade does not count as one of your maximum allowed number of upgrades.",
    countsAsSlot: false,
  },
  {
    name: "Electric Organ",
    type: "bioware",
    brand: "Vitruvian",
    cost: "シ30,000",
    effectSummary: "As an action, target within 1.5m takes 10d6 electrical damage (DC 16 Dex save for half). Once per short rest.",
    description: "Like an electric eel or ray, you possess a transgenic organ that can generate an electrical discharge, boosted further by an accompanying implant. As an action, you can target anything within 1.5 meters. The target takes 10d6 electrical damage on a failed Dexterity save (DC 16), or half as much damage on a successful one. After using this ability, you must take a short rest to regain its use.",
    countsAsSlot: true,
  },
  {
    name: "Electric Organ",
    type: "bioware",
    brand: "Tezla",
    cost: "シ100,000",
    effectSummary: "As an action, target within 1.5m takes 10d6+25 electrical damage (DC 19 Dex save for half). Once per short rest.",
    description: "The target takes 10d6+25 electrical damage on a failed Dexterity save (DC 19), or half as much damage on a successful one. After using this ability, you must take a short rest to regain its use.",
    countsAsSlot: true,
  },
  {
    name: "Electric Organ",
    type: "bioware",
    brand: "Apollo",
    cost: "シ300,000",
    effectSummary: "As an action, target within 1.5m takes 10d6+50 electrical damage (DC 21 Dex save for half). Once per short rest.",
    description: "The target takes 10d6+50 electrical damage on a failed Dexterity save (DC 21), or half as much damage on a successful one. After using this ability, you must take a short rest to regain its use.",
    countsAsSlot: true,
  },
  {
    name: "Envenomers, Basic",
    type: "bioware",
    brand: "Proteon",
    cost: "シ60,000",
    effectSummary: "Produce and administer venoms (Hemovenom/Necrovenom/Neurovenom) via nematocysts, venom sac, or natural weapon. Once per short rest.",
    description: "A colony of bioengineered cells manufactures a virulent toxin. Choose your administration method (nematocysts, venom sac, or natural/retractable weapon) and one venom type:\n• Hemovenom: DC 11 Con save, 10 (3d6) poison damage on fail, poisoned for 1 hour; half on success.\n• Necrovenom: DC 11 Con save, 21 (6d6) poison damage on fail, half on success.\n• Neurovenom: DC 13 Con save, poisoned for 1 hour on fail; if failed by 5+, unconscious; if failed by 10+, death.\nYou must take a short rest before using it again.",
    countsAsSlot: true,
  },
  {
    name: "Hyper Reflexes",
    type: "bioware",
    brand: "Vitruvian",
    cost: "シ40,000",
    effectSummary: "+2 AC, advantage on Dexterity saves, additional action (limited) for 1 minute. Activate as bonus action. Once per long rest.",
    description: "This implant and biohack rewires your nervous system, flooding your body with stimulants, dramatically increasing your reflexes. You can use a bonus action to activate this ability, which lasts for one minute. While active, you gain a +2 bonus to AC, have advantage on Dexterity saving throws, and gain an additional action on each of your turns (usable only for Attack (one weapon attack only), Dash, Disengage, Hide, or Use an Object). When the effect ends, you can't move or take actions until after your next turn. You must take a long rest before using this ability again.",
    countsAsSlot: true,
  },
  {
    name: "Hyper Reflexes",
    type: "bioware",
    brand: "Apollo",
    cost: "シ100,000",
    effectSummary: "+2 AC, advantage on Dexterity saves, additional action (limited) for 1 minute. Activate as bonus action. Once per short rest.",
    description: "As Vitruvian Hyper Reflexes, but you must take only a short rest before using this ability again.",
    countsAsSlot: true,
  },
  {
    name: "Medicomp",
    type: "bioware",
    brand: "Nightingale",
    cost: "シ25,000",
    effectSummary: "Auto-stabilize at 0 HP; minimum 5 HP when rolling Hit Dice; advantage and resistance to poison.",
    description: "This system of implants and transgenic nanobots functions as an internal doctor. Benefits: automatic stabilization when knocked unconscious at 0 hit points; when you roll a Hit Die to regain hit points, the minimum number of hit points you regain is 5; advantage on saving throws against poison; resistance against poison damage.",
    countsAsSlot: true,
  },
  {
    name: "Medicomp",
    type: "bioware",
    brand: "Apollo",
    cost: "シ150,000",
    effectSummary: "All Nightingale benefits + store up to 20 drug doses (release as bonus action) + regain all HP on short rest.",
    description: "Includes all Nightingale medicomp benefits, plus: store up to 20 doses of drugs (one dose can be released and activated as a bonus action); all of your hit points are restored when you take a short rest.",
    countsAsSlot: true,
  },
  {
    name: "Pheromones",
    type: "bioware",
    brand: "Guanxi",
    cost: "シ50,000",
    effectSummary: "Proficiency (expertise if already proficient) in Insight, Deception, and Persuasion. Requires target can smell you.",
    description: "You've been biohacked to produce chemical messengers that have beguiling effects on people within smelling range. You gain proficiency in the Insight, Deception, and Persuasion skills. If you're already proficient in these skills, or take any of them later, your proficiency bonus is doubled for any check you make with that skill. This effect doesn't work unless the target is able to smell you.",
    countsAsSlot: true,
  },
  {
    name: "Photosynthesizers",
    type: "bioware",
    brand: "Proteon",
    cost: "シ20,000",
    effectSummary: "Only need sun, CO₂, and water to survive (no food required).",
    description: "Each transgenic cell of this biohack is loaded with chloroplasts and other cellular machinery that allows you to make your own food from sunlight, water, and carbon dioxide. As long as you drink water and have at least one hour of exposure to the sun each day, you do not need to eat.",
    countsAsSlot: true,
  },
  {
    name: "Respirators",
    type: "bioware",
    brand: "Proteon",
    cost: "シ25,000",
    effectSummary: "Ignore 2 levels of exhaustion; advantage on Constitution checks involving endurance.",
    description: "You are biohacked with specialized cells that metabolize lactic acid, reduce muscle exhaustion, and aid respiration and circulation throughout the entire body. This upgrade allows you to ignore 2 levels of exhaustion and gives you advantage on Constitution checks involving endurance.",
    countsAsSlot: true,
  },
  {
    name: "Synth Organs",
    type: "bioware",
    brand: "Nightingale",
    cost: "シ10,000",
    effectSummary: "+5 hit point maximum.",
    description: "Most of your essential organs are now backed up by artificial parallels. Your hit point maximum increases by 5.",
    countsAsSlot: true,
  },
  {
    name: "Synth Organs",
    type: "bioware",
    brand: "Proteon",
    cost: "シ30,000",
    effectSummary: "+10 hit point maximum.",
    description: "Most of your essential organs are now backed up by artificial parallels. Your hit point maximum increases by 10.",
    countsAsSlot: true,
  },
  {
    name: "Synth Organs",
    type: "bioware",
    brand: "Hexie",
    cost: "シ100,000",
    effectSummary: "+25 hit point maximum.",
    description: "Most of your essential organs are now backed up by artificial parallels. Your hit point maximum increases by 25.",
    countsAsSlot: true,
  },
  {
    name: "Synth Organs",
    type: "bioware",
    brand: "Apollo",
    cost: "シ400,000",
    effectSummary: "+45 hit point maximum.",
    description: "Most of your essential organs are now backed up by artificial parallels. Your hit point maximum increases by 45.",
    countsAsSlot: true,
  },
  {
    name: "Wall Crawling",
    type: "bioware",
    brand: "GekTek",
    cost: "シ30,000",
    effectSummary: "Climbing speed equal to regular speed; climb sheer surfaces without an Athletics check.",
    description: "Swathes of skin on your hands, feet, legs, and arms have been modified to shift into a microscopic fractalling surface, exploiting Van der Waals forces to cling to walls like a gecko. You can cause this effect to manifest as a free action, and you gain a climbing speed equal to your regular speed. Additionally, you can climb sheer surfaces without requiring a Strength (Athletics) check.",
    countsAsSlot: true,
  },
  {
    name: "Genetic Tweak",
    type: "bioware",
    brand: "Proteon",
    cost: "シ100,000",
    effectSummary: "You gain any one genetic enhancement of your choice from the genetic enhancement table.",
    description: "You undergo intense gene enhancement therapy, granting yourself a beneficial change. You may select any genetic enhancement from the genetic enhancement table.",
    countsAsSlot: true,
  },
  {
    name: "Genetic Tweak",
    type: "bioware",
    brand: "Apollo",
    cost: "シ300,000",
    effectSummary: "You gain any upgraded version of any genetic enhancement from the genetic enhancement table.",
    description: "You undergo intense gene enhancement therapy. You may select any upgraded version of any genetic enhancement from the genetic enhancement table.",
    countsAsSlot: true,
  },
  // ─── CYBERNETIC ─────────────────────────────────────────────────────────────
  {
    name: "Chemical Sensor",
    type: "cybernetic",
    brand: "TruHound",
    cost: "シ25,000",
    effectSummary: "Discern chemical compositions (including DNA) from anything that touches the sensor. Requires concentration; activated by Use an Object action.",
    description: "A sensor placed on your fingertip or tongue samples all chemicals that come into contact with it (solid, liquid, or gas). Poisons, DNA, and all other chemical compositions can be discerned. With proper authorization or hacking ability, the sampled DNA can be looked up in governmental databases. This upgrade requires concentration and is activated by the Use an Object action.",
    countsAsSlot: true,
  },
  {
    name: "Cyberoptics",
    type: "cybernetic",
    brand: "Vitruvian",
    cost: "シ30,000",
    effectSummary: "Darkvision 36m; microvision (50× magnification, concentration); macrovision (see clearly 1 km away, concentration); flashbang protection via smart lenses.",
    description: "Replaces your original eyes with superior artificial eyes. Abilities: Darkvision (see normally in darkness up to 36 meters); Microvision (magnify up to 50× with conscious thought, powerful enough to see individual cells — requires concentration); Macrovision (built-in binoculars, see clearly up to 1 km — requires concentration); Protection (smart polarized lenses auto-darken against any bright light, including flashbangs).",
    countsAsSlot: true,
  },
  {
    name: "Cyberoptics",
    type: "cybernetic",
    brand: "Sentinex",
    cost: "シ150,000",
    effectSummary: "All Vitruvian benefits + spectrum vision (see invisible, treat lightly obscured as clear) + penetration vision (x-ray up to 15m, requires concentration, disadvantage on attacks/Dex checks).",
    description: "Includes all Vitruvian cyberoptics abilities plus: Spectrum Vision (enhanced visible and nonvisible light, infrared, UV, microwaves — lightly obscured treated as clear, heavily obscured as lightly obscured, see invisible creatures — requires concentration); Penetration Vision (radar/T-ray/infrared/ultrasound triangulation, see through smoke, clothes, flesh, and walls up to 15 meters — requires concentration, imposes disadvantage on attack rolls and Dex checks, move at 3/4 speed).",
    countsAsSlot: true,
  },
  {
    name: "Cybernetic Arm",
    type: "cybernetic",
    brand: "Vitruvian",
    cost: "シ25,000",
    effectSummary: "Strength score considered 14 for one-arm checks; unarmed strikes deal 1d4 (hard-knuckle).",
    description: "One arm and surrounding tissue is replaced with a prosthetic version. The Strength score provided only applies to checks involving one arm (including reducing recoil for one-handed firearms and melee attacks with one-handed weapons). Vitruvian: unarmed strikes deal 1d4 damage with the hard-knuckle trait; Strength ability score is considered 14 for single-arm purposes.",
    countsAsSlot: true,
  },
  {
    name: "Cybernetic Arm",
    type: "cybernetic",
    brand: "Hexie",
    cost: "シ150,000",
    effectSummary: "Strength score considered 22 for one-arm checks; unarmed strikes deal 1d6 (hard-knuckle).",
    description: "One arm and surrounding tissue is replaced with a prosthetic version. Hexie: unarmed strikes deal 1d6 damage with the hard-knuckle trait; Strength ability score is considered 22 for single-arm purposes.",
    countsAsSlot: true,
  },
  {
    name: "Cybernetic Arm",
    type: "cybernetic",
    brand: "Omnitech",
    cost: "シ500,000",
    effectSummary: "Strength score considered 28 for one-arm checks; unarmed strikes deal 1d8 (hard-knuckle).",
    description: "One arm and surrounding tissue is replaced with a prosthetic version. Omnitech: unarmed strikes deal 1d8 damage with the hard-knuckle trait; Strength ability score is considered 28 for single-arm purposes.",
    countsAsSlot: true,
  },
  {
    name: "Dermal Weave",
    type: "cybernetic",
    brand: "Vitruvian",
    cost: "シ8,000",
    effectSummary: "2 Damage Reduction vs. bludgeoning, slashing, and piercing. Does not stack with armor.",
    description: "This biohack produces high-strength synthetic fibers similar to spider silk which are woven throughout your skin. You gain 2 Damage Reduction versus bludgeoning, slashing, and piercing. Does not stack with armor.",
    countsAsSlot: true,
  },
  {
    name: "Dermal Weave",
    type: "cybernetic",
    brand: "Hexie",
    cost: "シ35,000",
    effectSummary: "4 Damage Reduction vs. bludgeoning, slashing, and piercing. Does not stack with armor.",
    description: "High-strength synthetic fibers woven throughout your skin. You gain 4 Damage Reduction versus bludgeoning, slashing, and piercing. Does not stack with armor.",
    countsAsSlot: true,
  },
  {
    name: "Dermal Weave",
    type: "cybernetic",
    brand: "Validerm",
    cost: "シ150,000",
    effectSummary: "6 Damage Reduction vs. bludgeoning, slashing, and piercing. Does not stack with armor.",
    description: "High-strength synthetic fibers woven throughout your skin. You gain 6 Damage Reduction versus bludgeoning, slashing, and piercing. Does not stack with armor.",
    countsAsSlot: true,
  },
  {
    name: "Gills",
    type: "cybernetic",
    brand: "Triton",
    cost: "シ25,000",
    effectSummary: "Breathe underwater (as long as it is oxygenated).",
    description: "Artificial gills allow oxygen consumption from water. A selectively permeable membrane encases the lungs, extracting oxygen from water and allowing gases associated with respiration through but keeping water out. You can breathe underwater as long as it is oxygenated. When you surface, the lungful of water is expelled through the mouth.",
    countsAsSlot: true,
  },
  {
    name: "Hyper Jumping",
    type: "cybernetic",
    brand: "Vitruvian",
    cost: "シ40,000",
    effectSummary: "Jumping distances tripled; fall up to 9m without taking damage.",
    description: "This biohack adds extra spring to your leg muscles through resilin and specialized synthetic muscles. This upgrade doesn't stack with any other ability that increases your jumping distance. Vitruvian: jumping distance is tripled; additionally, these fibers absorb shock from falling, allowing you to fall 9 meters (instead of 3) without taking damage.",
    countsAsSlot: true,
  },
  {
    name: "Hyper Jumping",
    type: "cybernetic",
    brand: "Thumper",
    cost: "シ120,000",
    effectSummary: "Jumping distances tripled; fall up to 9m without damage; any Strength (Athletics) jump check below 20 is automatically raised to 20.",
    description: "All the benefits of Vitruvian Hyper Jumping, plus any Strength (Athletics) checks related to jumping that are below 20 are automatically raised to 20.",
    countsAsSlot: true,
  },
  {
    name: "Muscle Weave",
    type: "cybernetic",
    brand: "Vitruvian",
    cost: "シ20,000",
    effectSummary: "+2 Strength; Strength maximum increases to 22.",
    description: "The muscle weave biohack is a network of ultra-strong musculoskeletal fibers that support and enhance muscle contractions. Your Strength score is increased by +2, and your maximum Strength score is now 22.",
    countsAsSlot: true,
  },
  {
    name: "Muscle Weave",
    type: "cybernetic",
    brand: "Ronin",
    cost: "シ75,000",
    effectSummary: "+4 Strength; Strength maximum increases to 24.",
    description: "The muscle weave biohack is a network of ultra-strong musculoskeletal fibers. Your Strength score is increased by +4, and your maximum Strength score is now 24.",
    countsAsSlot: true,
  },
  {
    name: "Muscle Weave",
    type: "cybernetic",
    brand: "Hexie",
    cost: "シ200,000",
    effectSummary: "+6 Strength; Strength maximum increases to 26.",
    description: "The muscle weave biohack is a network of ultra-strong musculoskeletal fibers. Your Strength score is increased by +6, and your maximum Strength score is now 26.",
    countsAsSlot: true,
  },
  {
    name: "Muscle Weave",
    type: "cybernetic",
    brand: "Omnitech",
    cost: "シ500,000",
    effectSummary: "+8 Strength; Strength maximum increases to 28.",
    description: "The muscle weave biohack is a network of ultra-strong musculoskeletal fibers. Your Strength score is increased by +8, and your maximum Strength score is now 28.",
    countsAsSlot: true,
  },
  {
    name: "Polyguise",
    type: "cybernetic",
    brand: "Omnitech",
    cost: "シ30,000",
    effectSummary: "Alter your face and voice; DC 16 Intelligence (Investigation) to detect the disguise. Can mimic a specific person's face.",
    description: "This biohack enables you to adopt any number of human appearances and voices. Your face and larynx are reconstructed with artificial bones, cartilage, and muscles rearrangeable with conscious thought. Artificial hair can turn any color or length (baldness up to 1 meter), and skin pigment can change to any uniform color. A full turn of concentration initiates a change. You can mimic a specific person's face. To detect your disguise, a person must succeed on an Intelligence (Investigation) check against DC 16 — but this doesn't reveal your true identity. If speaking to subjects who know you (or the person you're imitating), succeed at a Charisma (Deception) check against their passive Insight score.",
    countsAsSlot: true,
  },
  {
    name: "Reinforced Skeleton",
    type: "cybernetic",
    brand: "Hexie",
    cost: "シ75,000",
    effectSummary: "Resistance to bludgeoning damage; unarmed strikes gain the hard-knuckle property (+2 damage).",
    description: "Your skeleton is reinforced with high-strength synthetics and metallic alloys, rendering your bones as strong as nanocarbon steel. This cyberware grants resistance to bludgeoning damage, and grants the hard-knuckle property to your unarmed strikes (+2 damage).",
    countsAsSlot: true,
  },
  {
    name: "Retractable Blade",
    type: "cybernetic",
    brand: "Vitruvian",
    cost: "シ25,000",
    effectSummary: "Light finesse simple melee weapon (wrist nanoblade or fingertip claws). Deals 2d4 armor-piercing piercing or slashing damage.",
    description: "An implanted nanoblade springs from your wrist, or claws unsheathe from your fingertips (your choice). Unsheathable as a free action; they are a light finesse simple melee weapon. Vitruvian: deals 2d4 piercing or slashing armor-piercing damage.",
    countsAsSlot: true,
  },
  {
    name: "Retractable Blade",
    type: "cybernetic",
    brand: "Ronin",
    cost: "シ50,000",
    effectSummary: "Light finesse simple melee weapon. Deals 2d6 armor-piercing piercing or slashing damage.",
    description: "An implanted nanoblade or claw, unsheathable as a free action; light finesse simple melee weapon. Ronin: deals 2d6 piercing or slashing armor-piercing damage.",
    countsAsSlot: true,
  },
  {
    name: "Retractable Blade",
    type: "cybernetic",
    brand: "Hexie",
    cost: "シ100,000",
    effectSummary: "Light finesse simple melee weapon. Deals 2d8 armor-piercing piercing or slashing damage.",
    description: "An implanted nanoblade or claw, unsheathable as a free action; light finesse simple melee weapon. Hexie: deals 2d8 piercing or slashing armor-piercing damage.",
    countsAsSlot: true,
  },
  {
    name: "Retractable Blade",
    type: "cybernetic",
    brand: "Excalibur",
    cost: "シ300,000",
    effectSummary: "Light finesse simple melee weapon. Deals 2d8 armor-piercing damage; critical hit on a roll of 18–20.",
    description: "An implanted nanoblade or claw, unsheathable as a free action; light finesse simple melee weapon. Excalibur: deals 2d8 piercing or slashing armor-piercing damage, and attacks with it score a critical hit on a roll of 18–20.",
    countsAsSlot: true,
  },
  {
    name: "Shock Core",
    type: "cybernetic",
    brand: "Tezla",
    cost: "シ75,000",
    effectSummary: "Melee attacks deal +1d4 electrical damage (unarmed: +1d8) for 1 minute. Activate as bonus action. Once per long rest.",
    description: "You are wired with an internal battery and wiring that allows you to discharge intense electrical shocks through your melee attacks. Activate as a bonus action; remains active for 1 minute; long rest required to use again. While active — Tezla: your melee attacks deal an additional 1d4 electrical damage, or 1d8 electrical damage if they are unarmed strikes.",
    countsAsSlot: true,
  },
  {
    name: "Shock Core",
    type: "cybernetic",
    brand: "Omnitech",
    cost: "シ200,000",
    effectSummary: "Melee attacks deal +1d6 electrical damage (unarmed: +1d12) for 1 minute. Activate as bonus action. Once per long rest.",
    description: "You are wired with an internal battery and wiring that allows you to discharge intense electrical shocks through your melee attacks. Activate as a bonus action; remains active for 1 minute; long rest required to use again. While active — Omnitech: your melee attacks deal an additional 1d6 electrical damage, or 1d12 electrical damage if they are unarmed strikes.",
    countsAsSlot: true,
  },
  {
    name: "Sprint Boost",
    type: "cybernetic",
    brand: "Vitruvian",
    cost: "シ20,000",
    effectSummary: "Speed increases by 3 meters.",
    description: "This augmentation strengthens fast-twitch muscles in your legs. Your Speed increases by 3 meters.",
    countsAsSlot: true,
  },
  {
    name: "Sprint Boost",
    type: "cybernetic",
    brand: "Thumper",
    cost: "シ60,000",
    effectSummary: "Speed increases by 6 meters.",
    description: "This augmentation strengthens fast-twitch muscles in your legs. Your Speed increases by 6 meters.",
    countsAsSlot: true,
  },
  {
    name: "Sprint Boost",
    type: "cybernetic",
    brand: "Omnitech",
    cost: "シ175,000",
    effectSummary: "Speed increases by 9 meters.",
    description: "This augmentation strengthens fast-twitch muscles in your legs. Your Speed increases by 9 meters.",
    countsAsSlot: true,
  },
  {
    name: "Sprint Boost",
    type: "cybernetic",
    brand: "Blitz-Cat",
    cost: "シ500,000",
    effectSummary: "Speed increases by 12 meters.",
    description: "This augmentation strengthens fast-twitch muscles in your legs. Your Speed increases by 12 meters.",
    countsAsSlot: true,
  },
  {
    name: "Stun Knuckles",
    type: "cybernetic",
    brand: "Tezla",
    cost: "シ25,000",
    effectSummary: "Unarmed strikes gain hard-knuckle. On a successful unarmed hit, target makes DC 10 Constitution save or is stunned until end of their turn.",
    description: "Your knuckles, elbows, shins, and other useful impact areas are reinforced with high-strength conductive materials that can deliver muscle-paralyzing shocks. Whenever you successfully hit someone with an unarmed attack, they must make a DC 10 Constitution save, or be stunned until the end of their turn.",
    countsAsSlot: true,
  },
  {
    name: "Subdermal Plates",
    type: "cybernetic",
    brand: "Vitruvian",
    cost: "シ5,000",
    effectSummary: "+3 AC. Counts as Light Armor; use whichever is higher if you also wear armor (does not stack).",
    description: "Vital areas of your body are protected by nanocarbon plates placed under your skin, replacing bone in some cases. These plates count as wearing Light Armor. If you suit up in armor, you use whatever bonus is higher; they do not stack. Vitruvian: your AC increases by 3.",
    countsAsSlot: true,
  },
  {
    name: "Subdermal Plates",
    type: "cybernetic",
    brand: "Ronin",
    cost: "シ25,000",
    effectSummary: "+5 AC. Counts as Light Armor; use whichever is higher if you also wear armor (does not stack).",
    description: "Vital areas of your body are protected by nanocarbon plates placed under your skin. Counts as wearing Light Armor; use whichever is higher if also wearing armor. Ronin: your AC increases by 5.",
    countsAsSlot: true,
  },
  {
    name: "Subdermal Plates",
    type: "cybernetic",
    brand: "Validerm",
    cost: "シ120,000",
    effectSummary: "+7 AC. Counts as Light Armor; use whichever is higher if you also wear armor (does not stack).",
    description: "Vital areas of your body are protected by nanocarbon plates placed under your skin. Counts as wearing Light Armor; use whichever is higher if also wearing armor. Validerm: your AC increases by 7.",
    countsAsSlot: true,
  },
  // ─── DAEMON ─────────────────────────────────────────────────────────────────
  {
    name: "Amped Confidence",
    type: "daemon",
    brand: "Hyperborea",
    cost: "シ25,000",
    effectSummary: "+2 Charisma; Charisma maximum increases to 22.",
    description: "Your brain chemistry is biohacked to provide you with optimal self-assuredness, charm, and debonair. Hyperborea: Charisma score increases by +2, and your maximum Charisma score is now 22.",
    countsAsSlot: true,
  },
  {
    name: "Amped Confidence",
    type: "daemon",
    brand: "Guanxi",
    cost: "シ150,000",
    effectSummary: "+4 Charisma; Charisma maximum increases to 24.",
    description: "Your brain chemistry is biohacked for optimal self-assuredness and charm. Guanxi: Charisma score increases by +4, and your maximum Charisma score is now 24.",
    countsAsSlot: true,
  },
  {
    name: "Cognitive Boost",
    type: "daemon",
    brand: "Hyperborea",
    cost: "シ25,000",
    effectSummary: "+2 Intelligence; Intelligence maximum increases to 22.",
    description: "Your general intellect is enhanced by rewiring key neural pathways, in conjunction with a brain-computer interface chip. Hyperborea: Intelligence score is increased by +2, and your maximum Intelligence score is now 22.",
    countsAsSlot: true,
  },
  {
    name: "Cognitive Boost",
    type: "daemon",
    brand: "Satori",
    cost: "シ150,000",
    effectSummary: "+4 Intelligence; Intelligence maximum increases to 24.",
    description: "Your general intellect is enhanced by rewiring key neural pathways. Satori: Intelligence score is increased by +4, and your maximum Intelligence score is now 24.",
    countsAsSlot: true,
  },
  {
    name: "Daemon Firewall",
    type: "daemon",
    brand: "Hexie",
    cost: "シ5,000",
    effectSummary: "+2 bonus on saving throws vs. mind hacks. Requires concentration.",
    description: "You have some protection versus mind hacking. While active, you gain a +2 bonus on any saving throws made to resist mind hacks. Requires concentration.",
    countsAsSlot: true,
  },
  {
    name: "Daemon Firewall",
    type: "daemon",
    brand: "Omnitech",
    cost: "シ30,000",
    effectSummary: "Advantage on saving throws vs. mind hacks. Requires concentration.",
    description: "You have some protection versus mind hacking. While active, you gain advantage on any saving throws made to resist mind hacks. Requires concentration.",
    countsAsSlot: true,
  },
  {
    name: "Custom Daemon OS",
    type: "daemon",
    brand: "Hexie",
    cost: "シ40,000",
    effectSummary: "Your daemon can run any Bot AI from the Goods & Services chapter (one at a time).",
    description: "Your daemon has been upgraded to accommodate different AI, allowing you to house superior AI than the base one. Hexie: you can purchase and install any of the bot AI described in the Robots section of Chapter 4: Goods and Services. Only one bot may be installed as your AI at any given time.",
    countsAsSlot: true,
  },
  {
    name: "Custom Daemon OS",
    type: "daemon",
    brand: "Omnitech",
    cost: "シ250,000",
    effectSummary: "All Hexie benefits + combat firmware allowing your daemon AI to take control of your body (with Extra Attack, weapon proficiency, and unarmed 1d6+STR).",
    description: "Includes all Hexie Custom Daemon OS benefits. Additionally, your daemon has been upgraded with firmware that allows it to take control of your motor functions. Possession rules: 1 action to transfer control; it can take actions normally; uses your proficiency bonus and STR/DEX/CON scores; cannot use your skill proficiencies or class features; has Extra Attack (as Gunfighter), proficiency in all weapons; as a bonus action during Attack, makes one unarmed strike (1d6+STR). Mind hacks still affect both you and your daemon AI using your saving throws. You retain your senses and can still launch hacks, use telepresence, dive in the WDS, or communicate.",
    countsAsSlot: true,
  },
  {
    name: "Dataport",
    type: "daemon",
    brand: "Varies",
    cost: "シ3,000",
    effectSummary: "Hardline port to connect your daemon directly to devices without wireless. Bypasses wireless jamming/detection.",
    description: "You can hook up your daemon directly to other devices that have jacks without using wireless. Essential to interfacing with computers that lack wireless capability, which is common for CCTV and databases containing sensitive data. This implant bypasses attempts to jam or detect wireless signals.",
    countsAsSlot: true,
  },
  {
    name: "Heightened Focus",
    type: "daemon",
    brand: "Hyperborea",
    cost: "シ25,000",
    effectSummary: "+2 Wisdom; Wisdom maximum increases to 22.",
    description: "You biohack your brain, augmenting pathways and amplifying neurotransmitters and hormones relating to conscious awareness. Hyperborea: Wisdom score increases by +2, and your maximum Wisdom score is now 22.",
    countsAsSlot: true,
  },
  {
    name: "Heightened Focus",
    type: "daemon",
    brand: "Satori",
    cost: "シ150,000",
    effectSummary: "+4 Wisdom; Wisdom maximum increases to 24.",
    description: "You biohack your brain for greater mindfulness, alertness, and awareness. Satori: Wisdom score increases by +4, and your maximum Wisdom score is now 24.",
    countsAsSlot: true,
  },
  {
    name: "Motorchip",
    type: "daemon",
    brand: "Hexie",
    cost: "シ25,000",
    effectSummary: "+2 Dexterity; Dexterity maximum increases to 22.",
    description: "This implant optimizes your motor skills, giving you greater balance and hand-eye coordination. Hexie: Dexterity score is increased by +2, and your maximum Dexterity score is now 22.",
    countsAsSlot: true,
  },
  {
    name: "Motorchip",
    type: "daemon",
    brand: "Omnitech",
    cost: "シ150,000",
    effectSummary: "+4 Dexterity; Dexterity maximum increases to 24.",
    description: "This implant optimizes your motor skills. Omnitech: Dexterity score is increased by +4, and your maximum Dexterity score is now 24.",
    countsAsSlot: true,
  },
  {
    name: "Multitasking Processor",
    type: "daemon",
    brand: "Omnitech",
    cost: "シ75,000",
    effectSummary: "You may concentrate on one additional effect (run one more program that requires concentration than normal).",
    description: "You add a general brain-computer interface processor, enabling you to run an additional program or upgrade that requires concentration (you may concentrate on one more effect than normal).",
    countsAsSlot: true,
  },
  {
    name: "Skill Chip",
    type: "daemon",
    brand: "Hyperborea",
    cost: "シ25,000",
    effectSummary: "Run 1 skillsoft (grants proficiency in that skill). Each skillsoft costs シ1,000 extra. Requires concentration; 10 min to load.",
    description: "This chip implant allows you to run skillsoft — specialized software that grants you competency in a skill. Particular skillsoft must be purchased separately and each costs シ1,000. Hyperborea: while running a particular skillsoft, you gain proficiency in that skill. It takes 10 minutes to load up a particular skillsoft. Requires concentration.",
    countsAsSlot: true,
  },
  {
    name: "Skill Chip",
    type: "daemon",
    brand: "Omnitech",
    cost: "シ100,000",
    effectSummary: "Run 2 skillsoft simultaneously. Each skillsoft costs シ1,000 extra. Requires concentration; 10 min to load.",
    description: "This chip implant allows you to run skillsoft. Omnitech: functions like the Hyperborea Skill Chip, but you can run two skillsoft at once.",
    countsAsSlot: true,
  },
  {
    name: "Targeting Computer",
    type: "daemon",
    brand: "Ronin",
    cost: "シ25,000",
    effectSummary: "+2 bonus to all attack rolls.",
    description: "You get a targeting implant and software that increases your accuracy. Ronin: you gain a +2 bonus to all attack rolls.",
    countsAsSlot: true,
  },
  {
    name: "Targeting Computer",
    type: "daemon",
    brand: "Hexie",
    cost: "シ100,000",
    effectSummary: "+3 bonus to all attack rolls.",
    description: "You get a targeting implant and software that increases your accuracy. Hexie: you gain a +3 bonus to all attack rolls.",
    countsAsSlot: true,
  },
  {
    name: "Targeting Computer",
    type: "daemon",
    brand: "Omnitech",
    cost: "シ400,000",
    effectSummary: "+4 bonus to all attack rolls.",
    description: "You get a targeting implant and software that increases your accuracy. Omnitech: you gain a +4 bonus to all attack rolls.",
    countsAsSlot: true,
  },
];

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

// ─── CH10: HACKS ─────────────────────────────────────────────────────────────

export interface HackData {
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  type: string;
  launchTime: string;
  duration: string;
  description: string;
}

export const BIOHACKER_HACKS: HackData[] = [
  // ── 1st Level ──
  { level: 1, name: "Anesthetize",        type: "Injection",        launchTime: "1 action",             duration: "Instantaneous",          description: "Melee hack attack; Con save or poisoned + unconscious for 1 hour. Wakes on damage or being shaken." },
  { level: 1, name: "Biofilm",            type: "Gadget",           launchTime: "1 action",             duration: "10 minutes",             description: "Throw slick gel up to 18m; 3m radius difficult terrain. Creatures entering or in area make Dex save or fall prone." },
  { level: 1, name: "Blood Dope",         type: "Injection",        launchTime: "1 action",             duration: "1 hour",                 description: "Target gains 1d10+5 temporary hit points for the duration." },
  { level: 1, name: "Blood Fake",         type: "Injection",        launchTime: "1 action",             duration: "Conc., up to 1 hour",    description: "Nanobots fool DNA and blood tests; target presents any desired life signs. Detect with opposed Int (Life Science) roll." },
  { level: 1, name: "Buddha",             type: "Injection",        launchTime: "1 action",             duration: "1 hour",                 description: "Target gains +2 Wis and Cha; must make DC 10 Wis save to take any violent action. Melee hack attack required if unwilling." },
  { level: 1, name: "Carnal",             type: "Injection",        launchTime: "1 action",             duration: "2 hours",                description: "Advantage on Wisdom (Perception) and (Insight) checks; suffer 1 level of exhaustion afterward." },
  { level: 1, name: "Chitin",             type: "Injection",        launchTime: "1 minute",             duration: "1 hour",                 description: "Target's AC can't be less than 18 and DR vs. slashing/piercing/bludgeoning can't be less than 2. Chitinous plates fall off after." },
  { level: 1, name: "Chromatophores",     type: "Injection",        launchTime: "1 minute",             duration: "10 minutes",             description: "Target's skin mimics chromatophore camouflage; target is invisible. Must be unclothed or wearing transparent clothing." },
  { level: 1, name: "Claws",              type: "Gadget",           launchTime: "1 minute",             duration: "8 hours",                description: "Nanocarbon claws on fingertips; light finesse simple melee weapon that deals 2d4 AP slashing damage. Falls off when hack ends." },
  { level: 1, name: "Consume Evidence",   type: "Gadget",           launchTime: "1 action",             duration: "Instantaneous",          description: "Biobots destroy DNA evidence of chosen profiles in a 36m area over 10 minutes. DC 15 Life Science or DC 18 Investigation reveals destruction." },
  { level: 1, name: "Cushion",            type: "Gadget",           launchTime: "1 action / reaction",  duration: "2 rounds",               description: "Throw foam tube up to 18m; 6m radius expanding foam absorbs all fall damage. Dissolves into salty liquid at end." },
  { level: 1, name: "Darkvision",         type: "Injection",        launchTime: "1 action",             duration: "8 hours",                description: "Nanobots form temporary tapetum lucidum in target's eyes; darkvision out to 18m." },
  { level: 1, name: "Detect Biohazards",  type: "Gadget",           launchTime: "1 action",             duration: "Conc., up to 10 minutes", description: "Sense presence, location, and type of poisons, poisonous creatures, and diseases within 9m. Penetrates porous barriers." },
  { level: 1, name: "Detoxify",           type: "Injection",        launchTime: "1 action",             duration: "1 hour",                 description: "Neutralize one known poison; advantage on saving throws against being poisoned; resistance to poison damage for the duration." },
  { level: 1, name: "Enhance Ability",    type: "Injection",        launchTime: "1 action",             duration: "30 minutes",             description: "Choose one ability type: advantage on those checks, plus bonus (Endurance: +2d6 temp HP; Strength: double carry; Dexterity: no fall <6m if not incapacitated)." },
  { level: 1, name: "Extrapolate Form",   type: "Software",         launchTime: "1 action",             duration: "Instantaneous",          description: "Generate accurate 3D image of organism from a DNA sample, at any age. Lifestyle differences may slightly alter appearance." },
  { level: 1, name: "Fireflies",          type: "Gadget",           launchTime: "1 action",             duration: "1 hour",                 description: "Deploy thousands of bioluminescent insects illuminating a 9m radius. Use action to move illuminated area by 9m." },
  { level: 1, name: "Forensic Scan",      type: "Gadget",           launchTime: "1 minute",             duration: "Instantaneous",          description: "Analyze chemical and biological composition of up to a cubic meter. Can sequence individual DNA samples and identify persons via government databases." },
  { level: 1, name: "Gecko Skin",         type: "Gadget",           launchTime: "1 minute",             duration: "1 hour",                 description: "Biobots coat hands, feet, legs, and arms to mimic gecko skin; climb walls and ceilings with hands free. Climbing speed equals walking speed." },
  { level: 1, name: "Gills",              type: "Injection",        launchTime: "1 minute",             duration: "10 hours",               description: "Symbiotic bacterial culture coats bronchioles; target can breathe underwater for the duration." },
  { level: 1, name: "Heat Stabilize",     type: "Injection",        launchTime: "1 action",             duration: "1 hour",                 description: "Resistance to heat and cold damage; survive temperatures from -40 to +60°C without environmental damage." },
  { level: 1, name: "Nanodoc",            type: "Injection",        launchTime: "1 action",             duration: "Instantaneous",          description: "Cocktail of nanobots suture lacerations and act as blood cell analogs; target regains 2d6 + hacking ability modifier hit points." },
  { level: 1, name: "Necrotic Injection", type: "Injection",        launchTime: "1 action",             duration: "Instantaneous",          description: "Melee hack attack; on a hit, target takes 4d10 poison damage." },
  { level: 1, name: "Noxious Cloud",      type: "Gadget",           launchTime: "1 action",             duration: "1 minute",               description: "Throw vial up to 18m; 6m radius nauseating gas. Con save or spend action retching. Creatures not needing to breathe or immune to poison auto-succeed." },
  { level: 1, name: "Perk",               type: "Injection",        launchTime: "1 action",             duration: "Instantaneous",          description: "Clear lactic acid, restore neurotransmitters, provide nutrition; removes 1 level of exhaustion. Can be used multiple times per long rest." },
  { level: 1, name: "Post Mortem",        type: "Injection",        launchTime: "1 action",             duration: "10 minutes",             description: "Inject dead body (less than 48 hours, no massive head trauma); hack its daemon/memories to answer questions. One use only per corpse." },
  { level: 1, name: "Shark",              type: "Injection",        launchTime: "1 action",             duration: "30 minutes",             description: "Drug heightens empathy; target gains +2 Charisma for 30 minutes." },
  { level: 1, name: "Superman",           type: "Injection",        launchTime: "1 action",             duration: "1 minute",               description: "Stimulants drown pain; if reduced to 0 HP and don't die outright, make DC 10 Con save to drop to 1 HP instead. DC increases by 5 each subsequent use." },
  { level: 1, name: "Toxic Jet",          type: "Gadget",           launchTime: "1 action",             duration: "Instantaneous",          description: "Air-jet device fires toxic gas at a creature within 3m; Con save or take 3d12 poison damage." },
  { level: 1, name: "Treat Malady",       type: "Injection",        launchTime: "1 action",             duration: "Instantaneous",          description: "Inject nanobots; end one disease, one poison, or one condition (blinded, deafened, paralyzed, or poisoned) afflicting the target." },
  // ── 2nd Level ──
  { level: 2, name: "Amygdalic Jet",      type: "Gadget",           launchTime: "1 action",             duration: "1 minute",               description: "9m cone; Con save or drop held items, become frightened and poisoned. Con save each turn to end." },
  { level: 2, name: "Amygdalic Mist",     type: "Gadget",           launchTime: "1 action",             duration: "1 minute",               description: "Release nanobot cloud; living creatures within 9m without independent air supply make Cha save or become frightened." },
  { level: 2, name: "Bring 'Em Back",     type: "Injection",        launchTime: "1 action",             duration: "Instantaneous",          description: "Revive a creature dead less than 1 minute; returns with 1 HP at start of next turn but acquires a permanent injury." },
  { level: 2, name: "CNS Stim",           type: "Injection",        launchTime: "1 action",             duration: "Up to 1 minute",         description: "+2 AC, advantage on Dex saves, and an additional action each turn (limited actions). When hack ends, can't move or take actions until after next turn." },
  { level: 2, name: "Enamoring Cloud",    type: "Gadget",           launchTime: "1 action",             duration: "10 minutes",             description: "Release bioactive nanobots; living creatures within 18m without independent air supply make Wis save or become charmed by you." },
  { level: 2, name: "Envenom",            type: "Injection",        launchTime: "1 action",             duration: "Instantaneous",          description: "Melee hack attack; on a hit, choose: Haemovenom (5d10 poison + poisoned 1 hr), Necrovenom (10d10 poison), or Neurovenom (unconscious 1 hr, death if fail by 5+)." },
  { level: 2, name: "Infect",             type: "Injection",        launchTime: "1 action",             duration: "7 days",                 description: "Melee hack attack; afflict with disease (Blinding Sickness, Delirium Tremens, Epidermolysis, Haemorrhagic Fever, Toxic Psychosis, or Wasting Fever). 3 failed Con saves locks in effect; 3 successes cure." },
  { level: 2, name: "Mars",               type: "Injection",        launchTime: "1 action",             duration: "30 minutes",             description: "+2 Strength and +2 Dexterity for 30 minutes. No addiction risk with this concoction." },
  { level: 2, name: "Nootro",             type: "Injection",        launchTime: "1 action",             duration: "30 minutes",             description: "+2 Intelligence, +2 Wisdom, and +2 Charisma for 30 minutes. Check for addiction (see Chapter 4: Drugs)." },
  { level: 2, name: "Paralytic Injection",type: "Injection",        launchTime: "1 action",             duration: "Instantaneous",          description: "Melee hack attack; Con save or poisoned + paralyzed for 1 minute. Con save at end of each turn to end effect." },
  { level: 2, name: "Poisonous Aura",     type: "Gadget",           launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Cloud of airborne nematocysts within 6m; enemies entering or starting turn in cloud take 2d6 poison damage." },
  { level: 2, name: "Razor Cloud",        type: "Gadget",           launchTime: "1 action",             duration: "Conc., up to 10 minutes", description: "Nanobot nimbus in 4.5m radius; enemy speed halved; entering or starting turn in area: Con save or 3d8 AP slashing (half on success)." },
  { level: 2, name: "Recombinant Beast",  type: "Craft Tech",       launchTime: "1 week",               duration: "Permanent",              description: "Create transgenic lifeform from CR ¼ or lower animal in nutrient incubator. 4 random genetic enhancements, 1 genetic flaw. Cost シ10,000. Commands it on your initiative." },
  // ── 3rd Level ──
  { level: 3, name: "Burning Blood",      type: "Gadget",           launchTime: "1 action",             duration: "Instantaneous",          description: "Throw nanobot packet at target within 9m; on impact, burns all ATP. Con save: 10d6 heat + 2 exhaustion on fail, half damage + 1 exhaustion on success." },
  { level: 3, name: "Clone",              type: "Craft Tech",       launchTime: "120 days",             duration: "Permanent",              description: "Grow a fully grown duplicate of a living creature in sealed incubator. No memories or equipment; needs psychomime or AI implant to function. Cost シ10,000." },
  { level: 3, name: "Daemon Killer",      type: "Injection",        launchTime: "1 action",             duration: "Instantaneous",          description: "Melee hack attack; Con save or daemon is destroyed. Target loses all daemon abilities. New daemon costs シ2,000 + long rest." },
  { level: 3, name: "Diagnose Weakness",  type: "Gadget",           launchTime: "1 action",             duration: "Conc., up to 10 minutes", description: "Invisible nanobot cloud in 9m radius; attacks against enemies inside this cloud crit on attack rolls of 18, 19, and 20." },
  { level: 3, name: "Digest",             type: "Gadget",           launchTime: "1 action",             duration: "Instantaneous",          description: "Throw nanobot ball at target within 18m; Con save: 10d10 corrosive + HP max reduced by damage taken on fail; half on success." },
  { level: 3, name: "Ferocity",           type: "Injection",        launchTime: "1 action",             duration: "Conc., up to 10 minutes", description: "50 temp HP, advantage on attacks, +d10 extra damage per hit, all armor/weapon proficiencies, double attack. Can't cast other hacks or use Cha/Int checks (except Intimidation). 2 exhaustion after." },
  { level: 3, name: "Genetic Enhancement",type: "Craft Tech",       launchTime: "1 week",               duration: "Permanent",              description: "Permanently apply any genetic enhancement from Chapter 2 table to target. Must also roll for a genetic flaw. Target is poisoned during the week. Cost シ20,000. Counts as 1 upgrade." },
  { level: 3, name: "Mending Nimbus",     type: "Gadget",           launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Release cloud of bioactive nanobots; all allies (including you) within 6m regain 1d6 hit points at the end of their turns." },
  // ── 4th Level ──
  { level: 4, name: "Daemon Betrayal",    type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Hack target's daemon to attack its host. Wis save; 6d10 corrosive damage on fail (half on success). Damage repeats at end of each your turns." },
  { level: 4, name: "Neurotoxic Nightmare",type: "Injection",       launchTime: "1 action",             duration: "1 hour",                 description: "Melee hack attack; on hit, target is poisoned for 1 hour. Additionally, Con save or die." },
  { level: 4, name: "Perfume",            type: "Gadget",           launchTime: "1 action",             duration: "1 hour",                 description: "Bioactive pheromones; when making a Cha check vs. a target that can smell you, replace the roll with a 15. Additionally, truthfulness effects always show you as truthful." },
  // ── 5th Level ──
  { level: 5, name: "Grey Goo",           type: "Injection",        launchTime: "1 action",             duration: "1 minute",               description: "Melee hack attack; self-replicating nanobots. Con save: 12d6+50 corrosive on fail (half on success). Repeats each round until target succeeds a Con save." },
];

export const CODEHACKER_HACKS: HackData[] = [
  // ── 1st Level ──
  { level: 1, name: "Alert",              type: "Bot",              launchTime: "1 action",             duration: "24 hours",               description: "Create an alert program on one sensor (camera, door, etc.); you receive a silent ping when the trigger condition is detected, even waking you from sleep." },
  { level: 1, name: "Anonymity",          type: "Software",         launchTime: "1 action",             duration: "Conc., up to 24 hours",  description: "Any digital attempt to locate you must first pass an Int check vs. your hack DC before proceeding. Does not block cameras from seeing you." },
  { level: 1, name: "Babel Frog",         type: "Software",         launchTime: "1 action",             duration: "Conc., 1 hour",          description: "Enhanced universal translation of nuance and emotive cues. No disadvantage on Cha checks involving language, even if you don't speak it." },
  { level: 1, name: "Back Door",          type: "Mind / Software",  launchTime: "1 action",             duration: "Permanent, until detected", description: "Target makes Wis save; on fail, your next hack against them auto-succeeds (no save). Each auto-success gives target another Wis save to detect and purge the back door." },
  { level: 1, name: "Bot Lackey",         type: "Bot",              launchTime: "1 action",             duration: "Permanent",              description: "Create a limited AI bot (INT 6, WIS 6, CHA 8) with Deception/Persuasion/Intimidation +3, Investigation/Insight/Computers +2. Only one bot lackey at a time." },
  { level: 1, name: "Camfect",            type: "Mind / Software",  launchTime: "1 action",             duration: "Conc., up to 10 minutes", description: "Wis save; hack into an audiovisual feed such as a camera or someone's eyes/ears. See and hear through that feed, or upload to cloud for later viewing." },
  { level: 1, name: "Cataracts",          type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Wis save or blinded for the duration. Works even on cyberoptics by targeting the visual cortex. Target makes Wis save at end of each turn to end effect." },
  { level: 1, name: "Charm",              type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 1 hour",    description: "Wis save (advantage if fighting you); charmed target regards you as a friendly acquaintance. Target knows it was charmed when hack ends." },
  { level: 1, name: "Command",            type: "Mind",             launchTime: "1 action",             duration: "1 round",                description: "Cha save or follow a one-word command on next turn (Approach, Drop, Flee, Grovel, or Halt). No effect if command is directly harmful." },
  { level: 1, name: "Database Dip",       type: "Software",         launchTime: "1 action",             duration: "Instantaneous",          description: "Int (Computers) check to retrieve mid-level employee data on one subject from a specific database. Fail by 5+ alerts the owner; fail by 10+ reveals your identity." },
  { level: 1, name: "Decrypt",            type: "Software",         launchTime: "1 minute",             duration: "Instantaneous",          description: "Int (Computers) check to crack encryption (base DC 10; secure servers DC 15-25). Fail by 5+ alerts owner; fail by 10+ reveals your identity." },
  { level: 1, name: "Deep Fake",          type: "Mind / Software",  launchTime: "1 action",             duration: "Conc., up to 1 hour",    description: "Appear different (clothing, armor, weapons, height ±30cm, build) to one target. To appear as a specific person, make Cha (Deception) vs. target's passive Perception." },
  { level: 1, name: "Defensive Feedback", type: "Mind",             launchTime: "Reaction",             duration: "Instantaneous",          description: "When targeted by a mind hack, automatically send feedback; attacker makes Wis save, takes 2d12 psychic on fail (half on success)." },
  { level: 1, name: "Detect Minds",       type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Detect all thinking creatures within 9m; reveals presence and location to 1.5m radius. Allows targeting of invisible creatures with mind hacks." },
  { level: 1, name: "Detect Security",    type: "Software",         launchTime: "1 action",             duration: "Instantaneous",          description: "Choose a door, area, safe, window, or vehicle; reveals whether it has electronic security and some details (audible alarm, silent, damaging trap, etc.)." },
  { level: 1, name: "Disable Security",   type: "Software",         launchTime: "1 action",             duration: "Instantaneous",          description: "Int (Computers) check vs. security DC to disable one electronic security measure on the target. If multiple, only one is disabled." },
  { level: 1, name: "Ego Flay",           type: "Mind",             launchTime: "1 action",             duration: "Instantaneous",          description: "Cha save; 1d12 psychic damage and disadvantage on the next attack roll target makes before end of their next turn." },
  { level: 1, name: "Encrypt",            type: "Software",         launchTime: "1 action",             duration: "Permanent",              description: "Protect data (video feed, currency, text, etc.) with encryption. Only you and granted parties can access it. Decrypt DC equals your hack save DC." },
  { level: 1, name: "Erase Memory",       type: "Mind",             launchTime: "1 action",             duration: "Instantaneous",          description: "Wis save; on fail, target loses last 1 minute of memories. Emotional state is unaffected. In combat, target's next attack or check is made with disadvantage." },
  { level: 1, name: "Fear",               type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Up to 2 targets; Wis save or drop held items and become frightened, dashing away each turn. If out of line of sight, target makes Wis save to end effect." },
  { level: 1, name: "Invisibility",       type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 1 hour",    description: "Wis save; if target fails, they cannot see or target you for the duration. Hack ends if you interact with the target in any way." },
  { level: 1, name: "Killer Joke",        type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Wis save or fall prone, incapacitated with fits of laughter. Target makes another Wis save at end of each turn (advantage if triggered by damage)." },
  { level: 1, name: "Linked Battlemind",  type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 10 minutes", description: "Link up to 3 willing creatures within 72m; each can roll a d4 and add to any attack roll or saving throw before the hack ends." },
  { level: 1, name: "Mind Reader",        type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Read target's surface thoughts. Action to probe deeper: target makes Wis save; on fail, learn reasoning, emotional state, and one dominant concern." },
  { level: 1, name: "Pain",               type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Wis save; on fail, target drops concentration, has disadvantage on ability checks and attack rolls for the duration." },
  { level: 1, name: "Probability Analysis",type: "Software",        launchTime: "1 minute",             duration: "Instantaneous",          description: "Stochastic analysis of a proposed action within the next 30 minutes; GM reveals one of: Likely to succeed, Unlikely to succeed, Likely but negative outcomes, or Indeterminate." },
  { level: 1, name: "Satellite Imagery",  type: "Software",         launchTime: "1 action",             duration: "Conc., up to 1 hour",    description: "Live satellite bird's-eye view of up to 5 sq km. Highest zoom covers a 30 sq m radius. Obstructions (buildings, forest canopy) block view." },
  { level: 1, name: "Skim",               type: "Software",         launchTime: "1 hour",               duration: "Instantaneous",          description: "Int (Computers) check to skim money from financial systems: level × check result × ¥20. Once per session without alerting authorities." },
  { level: 1, name: "Sleep",              type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Wis save or fall unconscious. Wakes when hack ends, on taking damage, or if someone uses an action to shake/slap them awake." },
  { level: 1, name: "Sloth",              type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Wis save; halved speed, -2 AC and Dex saves, no reactions, only action or bonus action (not both), max one attack per turn. Target makes Wis save at end of each turn." },
  { level: 1, name: "Surveillance Skim",  type: "Software / Mind",  launchTime: "1 minute",             duration: "Conc., up to 1 hour",    description: "Int (Computers) DC 10 check to track a visible person via global surveillance. Provides live video feed of their current location anywhere on the planet." },
  { level: 1, name: "Synergistic Defense",type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 8 hours",   description: "Link up to 3 willing people within 72m; each target's HP maximum and current HP increase by 5 for the duration." },
  { level: 1, name: "Unlock",             type: "Software",         launchTime: "1 action",             duration: "Instantaneous",          description: "Int (Computers) check vs. lock DC to unlock one electronically locked object (door, safe, padlock, etc.). Multiple locks: only one is unlocked." },
  { level: 1, name: "Ventriloquist",      type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 1 hour",    description: "Transfer a willing guest's Charisma and social skill proficiencies into a willing host's body. Host loses control of speech/gestures; guest's body is unconscious." },
  // ── 2nd Level ──
  { level: 2, name: "Bloodhound",         type: "Bot",              launchTime: "1 action",             duration: "Permanent",              description: "Create tracking AI (INT 8, WIS 8) with Insight/Investigation/Perception/Computers +4 and facial/body recognition. Can use Camfect via taking-your-time software hacking." },
  { level: 2, name: "Calm Emotions",      type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Cha save (target may choose to fail); suppress charmed/frightened effect, or make target indifferent to chosen creatures (ends if they're attacked)." },
  { level: 2, name: "Compulsion",         type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Up to Int-modifier targets; Wis save or compelled to use all movement in a directed direction each turn. Won't move into obvious deadly hazards." },
  { level: 2, name: "Daemon Disruption",  type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Hack and shut down target's daemon; Wis save or they cannot use any daemon functions (upgrades, hacks, features) for the duration." },
  { level: 2, name: "Delusions",          type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Wis save or affected; roll d10 at start of each turn: 1 move randomly, 2-6 do nothing, 7-8 melee attack random adjacent creature, 9-10 act normally. Wis save at end of turn to end." },
  { level: 2, name: "Disable Vehicle",    type: "Software",         launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Remotely shut down a vehicle (must have license plate or line of sight); vehicle makes Wis save to resist. Additional save at start of each round." },
  { level: 2, name: "Drone Snipe",        type: "Mind",             launchTime: "1 action",             duration: "Instantaneous",          description: "Command an overhead drone to shoot one target (must be outdoors, target visible from bird's eye view); attack roll using proficiency + Int modifier; 6d12 AP piercing damage on hit." },
  { level: 2, name: "False ID",           type: "Software",         launchTime: "1 action",             duration: "1 hour",                 description: "Change how a person or object appears in government databases (police, credit, social media). Int (Investigation or Computers) check vs. hack DC to detect." },
  { level: 2, name: "Freeze",             type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Wis save or paralyzed for the duration. Target makes Wis save at end of each turn to end effect." },
  { level: 2, name: "Getaway Car",        type: "Software",         launchTime: "1 action",             duration: "Instantaneous",          description: "Hack a car within 36m; it drives to your location with unlocked doors by start of next turn. Car is stolen (possible legal consequences). Roll d20 for car type." },
  { level: 2, name: "Highlight",          type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 10 minutes", description: "Wis save; all creatures within 3m of a chosen point 72m away that fail are outlined in bright color in AR. Attackers have advantage; invisible benefit negated." },
  { level: 2, name: "Modify Memory",      type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Wis save; charmed + incapacitated. While active, permanently alter target's memory of an event within last 24 hours (up to 10 minutes long): erase, clarify, change details, or implant." },
  { level: 2, name: "Oracle",             type: "Bot",              launchTime: "1 action",             duration: "Permanent",              description: "Create knowledge AI (INT 10) with +5 to Bureaucracy, Life Science, Mechanics, Social Science, and Computers. Only one oracle at a time." },
  { level: 2, name: "Pierce Jamming",     type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Temporarily cut through wireless jamming; use mind hacks and other wireless actions normally for the duration." },
  { level: 2, name: "Pinball Wizard",     type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Cha save or blinded, deafened, and muted (including daemon messaging). Works even on cyberoptics by targeting cortex directly. Cha save at end of each turn to end." },
  { level: 2, name: "Runover",            type: "Mind",             launchTime: "1 action",             duration: "Instantaneous",          description: "Int (Computers) check vs. vehicle security DC; on success, hack a nearby vehicle to ram 30m in a straight line, dealing damage based on vehicle size." },
  { level: 2, name: "Secure Home",        type: "Craft Tech",       launchTime: "48 hours",             duration: "Permanent",              description: "Install security system across 275 sq m: alarms, motion detectors, cameras, and locked doors all at your hack DC. Can livestream or use closed-circuit cameras. Up to 10 doors hidden." },
  { level: 2, name: "Seeming",            type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 8 hours",   description: "Int save; change the apparent appearance of up to 4 targets (including clothing, armor, weapons). You decide the illusory appearances each target perceives." },
  { level: 2, name: "Stunner",            type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Int save or stunned while trying to solve an all-consuming logic puzzle. Int save at end of each turn to end effect." },
  { level: 2, name: "Suggestion",         type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Wis save; target pursues a suggested reasonable course of action. No self-harm commands. Can set conditional triggers. Target unaware they were manipulated at 3rd-level slot." },
  { level: 2, name: "Summoning",          type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 1 hour",    description: "Wis save; implant compulsion to travel to your location by normal means. Target is unaware of why they are traveling to you." },
  // ── 3rd Level ──
  { level: 3, name: "DDR",                type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Target dances in place; uses all movement shuffling. Disadvantage on Dex saves and attacks; others have advantage against them. Wis save (action) to end." },
  { level: 3, name: "Direct",             type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 3 hours",   description: "Wis save; implant compulsion to travel to a specified location by normal means. Won't move into obvious deadly hazard (e.g., volcano caldera edge)." },
  { level: 3, name: "Dominate",           type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Wis save (advantage if fighting); charmed. Issue commands via chat link (no action required). Full control action available. New Wis save on each hit taken." },
  { level: 3, name: "Drone Strafe",       type: "Mind",             launchTime: "1 action",             duration: "Instantaneous",          description: "Command aerial drone to strafe a 6m radius sphere (must be outdoors, visible from bird's eye). 6d10 AP piercing damage; Dex save for half." },
  { level: 3, name: "Ferocity",           type: "Injection",        launchTime: "1 action",             duration: "Conc., up to 10 minutes", description: "50 temp HP, advantage on attacks, +d10 extra damage per hit, all armor/weapon proficiencies, double attack. Can't cast other hacks or non-Intimidation Cha/Int checks. 2 exhaustion after." },
  { level: 3, name: "Hallucination",      type: "Mind / Bot",       launchTime: "1 action",             duration: "Permanent until triggered", description: "Create conditional AI hallucination (up to 9m cube) that activates on a specified trigger. Once activated, interactive for 1 hour. Can act autonomously following general protocols." },
  { level: 3, name: "Manchurian Candidate",type: "Mind",            launchTime: "1 action",             duration: "Permanent, until triggered", description: "Cha save; implant a command triggered by a specified condition. Target must perform the command for one turn when triggered, including attacking their own allies." },
  { level: 3, name: "Mind Killer",        type: "Mind",             launchTime: "1 action",             duration: "1 minute",               description: "Wis save; frightened for duration. At end of each turn, another Wis save: fail takes 4d10 psychic damage; succeed ends hack." },
  { level: 3, name: "Subtle Charm",       type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 1 hour",    description: "Wis save (advantage if fighting); charmed, treated as friendly acquaintance. Unlike Charm, target has no idea they were charmed when hack ends." },
  // ── 4th Level ──
  { level: 4, name: "Daemon Betrayal",    type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Hack target's daemon to lyse its host body; Wis save: 6d10 corrosive (half on success). Damage occurs at end of each of your turns until hack ends." },
  { level: 4, name: "Feeblemind",         type: "Mind",             launchTime: "1 action",             duration: "Instantaneous",          description: "4d6 psychic damage. Int save or Int and Cha drop to 1; can't understand language, run hacks, or use ranged attacks. New save every 30 days." },
  { level: 4, name: "Mass Suggestion",    type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 24 hours",  description: "Suggest reasonable course of action to up to 12 targets. Wis save each. No self-harm commands. Can set conditional triggers." },
  { level: 4, name: "Suicide",            type: "Mind",             launchTime: "1 action",             duration: "1 round",                description: "Take total control of target's motor functions; on their next turn they attack themselves (auto-hit, auto-crit) using their best weapon and all attack bonuses." },
  // ── 5th Level ──
  { level: 5, name: "Aegis Particle Beam",type: "Software",         launchTime: "1 action",             duration: "Instantaneous",          description: "Hack the orbital Aegis network; particle beam hits a 1.5–12m radius cylinder. Dex save: 20d6+70 heat damage on fail, half on success. Always triggers government investigation." },
  { level: 5, name: "Blank Slate",        type: "Mind",             launchTime: "1 action",             duration: "Permanent, until restored", description: "Cha save; on fail, target loses all memories, personality, and purpose. Countered only by successful Int (Computers) check vs. hack DC requiring 1 hr per attempt." },
  { level: 5, name: "Mind Maze",          type: "Mind",             launchTime: "1 action",             duration: "Conc., up to 10 minutes", description: "Target is paralyzed until they solve a mysterious riddle. Action to attempt DC 25 Int check; success ends the hack." },
  { level: 5, name: "Predictive Algorithms",type: "Mind",           launchTime: "1 action",             duration: "Conc., up to 8 hours",   description: "Run intensive probability software; target can't be surprised, has advantage on attack rolls/ability checks/saving throws. Others have disadvantage vs. target." },
  { level: 5, name: "Puppeteer",          type: "Mind",             launchTime: "1 full turn",          duration: "1 round",                description: "Wis save; take total control of target's entire next turn (actions, bonus action, reaction, movement). Can direct them to jump off a building or harm anyone." },
];

export const ENGINEER_HACKS: HackData[] = [
  // ── 1st Level ──
  { level: 1, name: "Alert",                    type: "Bot",          launchTime: "1 action",             duration: "24 hours",               description: "Create an alert program on one sensor; pinged when trigger condition (facial recognition, motion, etc.) is detected. Ping awakens you from sleep." },
  { level: 1, name: "Anonymity",                type: "Software",     launchTime: "1 action",             duration: "Conc., up to 24 hours",  description: "Any digital attempt to locate you must first pass an Int check vs. your hack DC. Does not block cameras from seeing you." },
  { level: 1, name: "AP Ammo",                  type: "Craft Tech",   launchTime: "1 hour",               duration: "Permanent",              description: "Create one magazine of armor-piercing ammunition for one firearm. Requires mechanic's tools and シ50 in materials. Can combine with Explosive or Incendiary Ammo." },
  { level: 1, name: "Arc Drone",                type: "Gadget",       launchTime: "1 bonus action",       duration: "1 minute",               description: "Deploy cat-sized hovering drone within 12m; hack attack, 1d8+Int electrical. Bonus action each turn: move drone 6m and repeat attack on adjacent target. HP 20, AC 18." },
  { level: 1, name: "Armor Plating",            type: "Craft Tech",   launchTime: "8 hours",              duration: "Permanent",              description: "Add +6 AC and +6 DR vs. bludgeoning/slashing/piercing to a wall, door, or vehicle. Cost ¼ the object's original price." },
  { level: 1, name: "Armor Smith",              type: "Craft Tech",   launchTime: "8 hours",              duration: "Permanent",              description: "Reinforce armor for +1 AC. Cost ¼ the armor's original price." },
  { level: 1, name: "Babel Frog",               type: "Software",     launchTime: "1 action",             duration: "Conc., 1 hour",          description: "Enhanced translation of nuance and emotive cues. No disadvantage on Cha checks involving language, even if you don't speak it." },
  { level: 1, name: "Baton Ammo",               type: "Craft Tech",   launchTime: "1 hour",               duration: "Permanent",              description: "Create one magazine of bludgeoning ammunition for one firearm (allows knockout). Requires mechanic's tools and シ50 in materials." },
  { level: 1, name: "Biofilm",                  type: "Gadget",       launchTime: "1 action",             duration: "10 minutes",             description: "Throw slick gel up to 18m; 3m radius difficult terrain. Creatures entering or in area make Dex save or fall prone." },
  { level: 1, name: "Camfect",                  type: "Mind / Software", launchTime: "1 action",          duration: "Conc., up to 10 minutes", description: "Wis save; hack into a camera or someone's eyes/ears. See and hear through that feed, or upload to cloud for later." },
  { level: 1, name: "Consume Evidence",         type: "Gadget",       launchTime: "1 action",             duration: "Instantaneous",          description: "Biobots destroy DNA evidence of chosen profiles in a 36m area over 10 minutes. DC 15 Life Science or DC 18 Investigation reveals destruction." },
  { level: 1, name: "Cushion",                  type: "Gadget",       launchTime: "1 action / reaction",  duration: "2 rounds",               description: "Throw foam tube up to 18m; 6m radius expanding foam absorbs all fall damage. Dissolves at end." },
  { level: 1, name: "Decrypt",                  type: "Software",     launchTime: "1 minute",             duration: "Instantaneous",          description: "Int (Computers) check to crack encryption (base DC 10). Fail by 5+ alerts owner; fail by 10+ reveals identity." },
  { level: 1, name: "Detect Security",          type: "Software",     launchTime: "1 action",             duration: "Instantaneous",          description: "Choose any secured object; reveals whether it has electronic security and some details about the security type." },
  { level: 1, name: "Disable Security",         type: "Software",     launchTime: "1 action",             duration: "Instantaneous",          description: "Int (Computers) check vs. security DC to disable one electronic security measure on the target." },
  { level: 1, name: "Encrypt",                  type: "Software",     launchTime: "1 action",             duration: "Permanent",              description: "Protect data with encryption. Decrypt DC equals your hack save DC." },
  { level: 1, name: "Extinguish",               type: "Gadget",       launchTime: "1 action",             duration: "Instantaneous",          description: "Highly effective fire extinguisher puts out any flame in a 3m radius sphere." },
  { level: 1, name: "Forensic Scan",            type: "Gadget",       launchTime: "1 minute",             duration: "Instantaneous",          description: "Analyze chemical and biological composition of up to a cubic meter. Can sequence individual DNA and identify persons via government databases." },
  { level: 1, name: "Frictionless Spray",       type: "Craft Tech",   launchTime: "2 hours",              duration: "Permanent (10 uses)",    description: "Create lubricant spray can (10 uses, cost シ300). +10 to escape bonds/grabs. Spray on ground: Dex check or fall prone (1d4 bludgeoning). Spray on hands: DC 10 Dex save or drop weapon." },
  { level: 1, name: "Gunsmith",                 type: "Craft Tech",   launchTime: "2d4 hours",            duration: "Permanent",              description: "Modify a firearm with one enhancement (choose one): Increased Damage (1s→2s), Increased Range (+50%), or Shock Absorption (−1 recoil). Cost ¼ firearm's price. One mod per weapon." },
  { level: 1, name: "Incendiary Ammo",          type: "Craft Tech",   launchTime: "1 hour",               duration: "Permanent",              description: "Create one magazine of incendiary ammunition; targets may catch fire (1d6 heat/turn at GM discretion). Materials シ100. Can combine with AP/Explosive Ammo." },
  { level: 1, name: "Linked Battlemind",        type: "Mind",         launchTime: "1 action",             duration: "Conc., up to 10 minutes", description: "Link up to 3 willing creatures within 72m; each adds a d4 to attack rolls and saving throws until hack ends." },
  { level: 1, name: "Noxious Cloud",            type: "Gadget",       launchTime: "1 action",             duration: "1 minute",               description: "Throw vial up to 18m; 6m radius nauseating gas. Con save or spend action retching. Creatures not needing air auto-succeed." },
  { level: 1, name: "Probability Analysis",     type: "Software",     launchTime: "1 minute",             duration: "Instantaneous",          description: "Stochastic analysis of a proposed action; GM reveals: Likely to succeed, Unlikely to succeed, Likely but with negative outcomes, or Indeterminate." },
  { level: 1, name: "Smoke Bomb",               type: "Craft Explosive", launchTime: "2d4 hours",         duration: "Permanent, until detonated", description: "Smoke grenade creates heavily obscured 6m radius for 6 rounds. Moderate wind disperses in 4 rounds; strong wind in 1. Materials シ100." },
  { level: 1, name: "Specialty Detonator",      type: "Craft Tech",   launchTime: "1 hour",               duration: "Permanent, until destroyed", description: "Create specialized detonator for explosives: AV (facial/voice recognition), Specific Weight, Wireless ID, Temperature, or Biometric (fingerprint/retina/DNA)." },
  { level: 1, name: "Tase",                     type: "Gadget",       launchTime: "1 action",             duration: "Instantaneous",          description: "Ranged hack attack against target within 6m; 1 electrical damage on hit + Con save or stunned until end of their next turn." },
  { level: 1, name: "Tough Tires",              type: "Craft Tech",   launchTime: "8 hours",              duration: "Permanent",              description: "Modify vehicle tires to be puncture-proof; immune to piercing damage; spike-strips have no effect. Cost 1/10 of vehicle's price." },
  { level: 1, name: "Toxic Jet",                type: "Gadget",       launchTime: "1 action",             duration: "Instantaneous",          description: "Air-jet device fires concentrated toxic gas at a creature within 3m; Con save or take 3d12 poison damage." },
  { level: 1, name: "Unlock",                   type: "Software",     launchTime: "1 action",             duration: "Instantaneous",          description: "Int (Computers) check vs. lock DC to unlock one electronically locked object. If multiple locks, only one is unlocked." },
  { level: 1, name: "Upgrade Vehicle Handling", type: "Craft Tech",   launchTime: "8 hours",              duration: "Permanent",              description: "Modify a vehicle to gain a +2 bonus to handling. Cost ¼ of the vehicle's original price." },
  { level: 1, name: "Upgrade Vehicle Speed",    type: "Craft Tech",   launchTime: "8 hours",              duration: "Permanent",              description: "Modify a vehicle to increase its speed by up to ¼ (round down). Cost ¼ of the vehicle's original price." },
  { level: 1, name: "Weapon Mount",             type: "Craft Tech",   launchTime: "8 hours",              duration: "Permanent",              description: "Mount a firearm on a vehicle or structure, reducing recoil to 0. Front mount (driver operates, attacks at disadvantage) or rotating turret (passenger operates, 360°). Cost シ10,000." },
  // ── 2nd Level ──
  { level: 2, name: "Amygdalic Jet",      type: "Gadget",         launchTime: "1 action",             duration: "1 minute",               description: "9m cone; Con save or drop held items, become frightened and poisoned. Con save each turn to end." },
  { level: 2, name: "Concussion Bomb",    type: "Craft Explosive",launchTime: "2d4 hours",            duration: "Permanent, until detonated", description: "3m radius; Dex save: 4d6 bludgeoning + stunned until end of next turn on fail, half damage and no stun on success. Materials シ500." },
  { level: 2, name: "Daemon Disruption",  type: "Mind",           launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Wis save; target's daemon shut down—cannot use any daemon functions (upgrades, hacks, features) for duration." },
  { level: 2, name: "Disable Vehicle",    type: "Software",       launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Remotely shut down a vehicle (license plate or line of sight); Wis save to resist, additional save at start of each round." },
  { level: 2, name: "Explosive Ammo",     type: "Craft Tech",     launchTime: "1 hour",               duration: "Permanent",              description: "Create magazine of explosive ammo; treat any 1 or 2 on damage dice as 3. Materials シ500. Can combine with AP and Incendiary Ammo." },
  { level: 2, name: "Flashbang Bomb",     type: "Craft Explosive",launchTime: "2d4 hours",            duration: "Permanent, until detonated", description: "3m radius; Con save or blinded, deafened, and stunned until end of next turn. Materials シ300." },
  { level: 2, name: "Foam Wall",          type: "Gadget",         launchTime: "1 action",             duration: "1 hour",                 description: "Throw device up to 18m; creates a 3×9m foam wall (30cm thick). AC 15, 200 HP. Can be vertical or horizontal (use as bridge/ramp). Dissolves when hack ends." },
  { level: 2, name: "Fragmentation Bomb", type: "Craft Explosive",launchTime: "2d4 hours",            duration: "Permanent, until detonated", description: "6m radius; Dex save: 6d6 piercing on fail, half on success. Materials シ400." },
  { level: 2, name: "Getaway Car",        type: "Software",       launchTime: "1 action",             duration: "Instantaneous",          description: "Hack a car within 36m; drives to your location with unlocked doors (stolen vehicle; possible legal consequences). Roll d20 for car type." },
  { level: 2, name: "Highlight",          type: "Mind",           launchTime: "1 action",             duration: "Conc., up to 10 minutes", description: "Wis save; all creatures within 3m of target point (72m away) glow in AR. Attackers have advantage; invisible benefit negated." },
  { level: 2, name: "Nitro Boost",        type: "Craft Tech",     launchTime: "8 hours",              duration: "Permanent",              description: "Mod vehicle with nitrous oxide; free action to boost speed by ¼ until end of driver's next turn. 5 boosts before recharge needed. Cost シ5,000." },
  { level: 2, name: "Poison Bomb",        type: "Craft Explosive",launchTime: "2d4 hours",            duration: "Permanent, until detonated", description: "6m radius poison cloud; Con save: 5d4 poison + poisoned until start of next turn on fail, half on success. Lasts 10 rounds. Materials シ800." },
  { level: 2, name: "Poisonous Aura",     type: "Gadget",         launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Cloud of nematocysts within 6m; enemies entering or starting turn in cloud take 2d6 poison damage." },
  { level: 2, name: "Razor Cloud",        type: "Gadget",         launchTime: "1 action",             duration: "Conc., up to 10 minutes", description: "Nanobot nimbus in 4.5m radius; enemy speed halved; Con save on entry or start of turn: 3d8 AP slashing on fail (half on success)." },
  { level: 2, name: "Runover",            type: "Mind",           launchTime: "1 action",             duration: "Instantaneous",          description: "Int (Computers) check vs. vehicle security DC; success: hack vehicle to accelerate 30m in a straight line, hitting everything in its path. Damage by vehicle size." },
  { level: 2, name: "Secure Home",        type: "Craft Tech",     launchTime: "48 hours",             duration: "Permanent",              description: "Install security system across 275 sq m: alarms, cameras, locked doors at your hack DC. Can livestream or closed-circuit. Up to 10 doors hidden as walls." },
  { level: 2, name: "Tear Gas Bomb",      type: "Craft Explosive",launchTime: "2d4 hours",            duration: "Permanent, until detonated", description: "6m radius tear gas cloud; Con save or blinded and poisoned until start of next turn. Heavily obscured, lasts 6 minutes. Materials シ200." },
  // ── 3rd Level ──
  { level: 3, name: "Autoturret",         type: "Craft Tech / Bot",launchTime: "8 hours",             duration: "Permanent",              description: "Build autonomous machine gun turret (360°, 1m long, 200 kg). Programs targeting per your orders. 3rd level: 2d12+4 piercing (シ10,000); 4th level: 3d12+6 (シ20,000); 5th level: 4d10+7 (シ30,000)." },
  { level: 3, name: "Booby Traps",        type: "Craft Tech",     launchTime: "1 week",               duration: "Permanent",              description: "Install lethal security across 500 sq m: cameras, alarms, reinforced walls (+5 DR, double HP), up to 10 hidden doors, and up to 10 explosive traps. Materials シ10,000." },
  { level: 3, name: "Drone Swarm",        type: "Gadget",         launchTime: "1 action",             duration: "Conc., up to 1 minute",  description: "Release 10 microdrones (HP 20, AC 18); bonus action to command each within 150m. Attack: +8 to hit, 1d4+4 electrical. Control any or all simultaneously." },
  { level: 3, name: "EMP Bomb",           type: "Craft Explosive",launchTime: "2d6 hours",            duration: "Permanent, until detonated", description: "3m radius burst of electromagnetic radiation; all electronics make save or stop working. Repairing requires DC 10 Int (Mechanics) + 10 min. Daemons have +5 bonus. Materials シ1,000." },
  { level: 3, name: "Incendiary Bomb",    type: "Craft Explosive",launchTime: "2d4 hours",            duration: "Permanent, until detonated", description: "6m radius shower of white-hot phosphorus; Dex save: 6d6 heat on fail, half on success. Heavily obscured for 3 rounds. Combustibles catch fire. Materials シ600." },
  { level: 3, name: "Knockout Bomb",      type: "Craft Explosive",launchTime: "2d4 hours",            duration: "Permanent, until detonated", description: "4m radius anesthetic gas cloud lasting 3 rounds; Con save or fall unconscious for 10 rounds. Wakes on damage or being shaken. Materials シ700." },
  { level: 3, name: "Nanoprint",          type: "Gadget",         launchTime: "1 action",             duration: "Instantaneous",          description: "Release biotic nanobots to fabricate an object from raw materials within 9m. Large or smaller object (3m cube). Metal/stone: max Medium (1.5m cube). Quality matches raw materials." },
  { level: 3, name: "Shaped Charge Bomb", type: "Craft Explosive",launchTime: "2d4 hours",            duration: "Permanent, until detonated", description: "2m cone in a specified direction; Dex save: 9d10 piercing on fail, half on success. Direction fixed at creation. Materials シ900." },
  { level: 3, name: "Shocking Field",     type: "Gadget",         launchTime: "Reaction",             duration: "Instantaneous",          description: "Triggered when melee attacked or touched; attacker makes Con save: 10d10 electrical on fail, half on success." },
  { level: 3, name: "Sticky Bomb",        type: "Craft Explosive",launchTime: "2d4 hours",            duration: "Permanent, until detonated", description: "3m radius thick goo; difficult terrain for 1 hour. Str save or restrained; action to make another Str save to break free. Materials シ800." },
  { level: 3, name: "Upgrade Robot",      type: "Craft Tech",     launchTime: "8 hours",              duration: "Permanent",              description: "Upgrade one robot stat: +2 Strength, +2 Dexterity, +HP (by size), or +1 AC/+1 DR. Cost ¼ of robot's original price. Multiple upgrades allowed; same upgrade not twice." },
  // ── 4th Level ──
  { level: 4, name: "EM Barrier",         type: "Gadget",         launchTime: "Reaction",             duration: "1 round",                description: "Triggered when targeted by a melee attack or touched by metal; gain +10 AC against all metal-source attacks until end of the round." },
  { level: 4, name: "Napalm Bomb",        type: "Craft Explosive",launchTime: "2d4 hours",            duration: "Permanent, until detonated", description: "6m radius fiery gel; Dex save: 10d8 heat on fail, half on success. Failed save: covered in napalm, 5d8 heat each turn for 1 min (extinguisher or full immersion stops it). Materials シ1,000." },
  // ── 5th Level ──
  { level: 5, name: "Nanite Bomb",        type: "Craft Explosive",launchTime: "2d4 hours",            duration: "Permanent, until detonated", description: "6m radius cloud of nanites that devour protein and fat; Con save: 6d10 corrosive per turn on fail, half on success. Heavily obscured for 10 rounds; cloud moves 3m per turn. Materials シ5,000." },
  { level: 5, name: "Predictive Algorithms",type: "Mind",         launchTime: "1 action",             duration: "Conc., up to 8 hours",   description: "Target can't be surprised; advantage on attack rolls, ability checks, and saving throws. Others have disadvantage on attack rolls vs. target." },
];

// Lookup helper: get hacks for a given class
export const HACKS_BY_CLASS: Record<string, HackData[]> = {
  "Biohacker": BIOHACKER_HACKS,
  "Codehacker": CODEHACKER_HACKS,
  "Engineer": ENGINEER_HACKS,
};

// ─── WEAPONS ─────────────────────────────────────────────────────────────────

export interface WeaponData {
  name: string;
  cost: string;
  mass: string;
  damage: string;
  properties: string;
  tier: "generic" | "premium";
  category: "melee" | "firearm";
  proficiency: "simple" | "martial";
  recoil?: number;
  range?: string;
}

export const WEAPONS: WeaponData[] = [
  // ── Generic Melee — Simple ──
  { tier: "generic", category: "melee", proficiency: "simple", name: "Axe",          cost: "シ40",     mass: "3",   damage: "1d6 S",       properties: "Versatile (1d8)" },
  { tier: "generic", category: "melee", proficiency: "simple", name: "Brass Knuckles", cost: "シ20",   mass: "2",   damage: "Unarmed",     properties: "Hard-knuckle" },
  { tier: "generic", category: "melee", proficiency: "simple", name: "Club, small",  cost: "シ20",     mass: "2",   damage: "1d4 B",       properties: "Light" },
  { tier: "generic", category: "melee", proficiency: "simple", name: "Club, large",  cost: "シ40",     mass: "3",   damage: "1d6 B",       properties: "Versatile (1d8)" },
  { tier: "generic", category: "melee", proficiency: "simple", name: "Chainsaw",     cost: "シ300",    mass: "10",  damage: "2d10 S",      properties: "Armor-piercing, two-handed, no Str bonus to damage" },
  { tier: "generic", category: "melee", proficiency: "simple", name: "Knife",        cost: "シ20",     mass: "0.5", damage: "1d4 P or S",  properties: "Finesse, light, thrown (6/18), quick" },
  { tier: "generic", category: "melee", proficiency: "simple", name: "Machete",      cost: "シ40",     mass: "1",   damage: "1d6 S",       properties: "Light" },
  { tier: "generic", category: "melee", proficiency: "simple", name: "Nanoblade",    cost: "シ1,000",  mass: "0.5", damage: "1d6 P or S",  properties: "Armor-piercing, finesse, light, thrown (6/18), quick" },
  { tier: "generic", category: "melee", proficiency: "simple", name: "Sledge Hammer",cost: "シ50",     mass: "6",   damage: "1d10 B",      properties: "Two-handed" },
  { tier: "generic", category: "melee", proficiency: "simple", name: "Stun Baton",   cost: "シ3,000",  mass: "3",   damage: "1 B",         properties: "Finesse, light, DC 10 Con save or stunned until end of next turn" },
  // ── Generic Melee — Martial ──
  { tier: "generic", category: "melee", proficiency: "martial", name: "Nanosword, long",  cost: "シ8,000",  mass: "2", damage: "2d6 S",      properties: "Armor-piercing, versatile (2d8)" },
  { tier: "generic", category: "melee", proficiency: "martial", name: "Nanosword, short", cost: "シ4,000",  mass: "1", damage: "1d10 P or S",properties: "Armor-piercing, finesse, light" },
  { tier: "generic", category: "melee", proficiency: "martial", name: "Sword, great",     cost: "シ2,000",  mass: "3", damage: "2d6 S",      properties: "Two-handed" },
  { tier: "generic", category: "melee", proficiency: "martial", name: "Sword, long",      cost: "シ1,000",  mass: "2", damage: "1d8 S",      properties: "Versatile (1d10)" },
  { tier: "generic", category: "melee", proficiency: "martial", name: "Sword, short",     cost: "シ500",    mass: "1", damage: "1d6 P or S", properties: "Finesse, light" },
  // ── Premium Melee — Simple ──
  { tier: "premium", category: "melee", proficiency: "simple", name: "Jötunn Sap Gloves",    cost: "シ25,000",  mass: "3",   damage: "Unarmed",    properties: "Hard-knuckle, DC 10 Con save or stunned" },
  { tier: "premium", category: "melee", proficiency: "simple", name: "Jötunn Shock Club",    cost: "シ15,000",  mass: "4",   damage: "1d6 B",      properties: "Light, 1d6 E damage" },
  { tier: "premium", category: "melee", proficiency: "simple", name: "Jötunn Storm Maul",    cost: "シ60,000",  mass: "6",   damage: "1d10 B",     properties: "Versatile (2d6), DC 10 Con save or stunned, 1d6 E damage" },
  { tier: "premium", category: "melee", proficiency: "simple", name: "Jötunn Stun Hammer",   cost: "シ20,000",  mass: "6",   damage: "1d10 B",     properties: "Versatile (2d6), DC 10 Con save or stunned" },
  { tier: "premium", category: "melee", proficiency: "simple", name: "Jötunn Thunder Gloves",cost: "シ100,000", mass: "3",   damage: "Unarmed",    properties: "Hard-knuckle, DC 10 Con save or stunned, 1d6 E damage" },
  { tier: "premium", category: "melee", proficiency: "simple", name: "NanoEdge Kerambit",    cost: "シ10,000",  mass: "0.5", damage: "1d8 P or S", properties: "Armor-piercing, finesse, light, quick" },
  // ── Premium Melee — Martial ──
  { tier: "premium", category: "melee", proficiency: "martial", name: "Ronin Long-blade",   cost: "シ30,000",  mass: "1", damage: "2d8 S",       properties: "Armor-piercing, versatile (2d10)" },
  { tier: "premium", category: "melee", proficiency: "martial", name: "Ronin Short-blade",  cost: "シ20,000",  mass: "2", damage: "2d6 P or S",  properties: "Armor-piercing, finesse, light" },
  { tier: "premium", category: "melee", proficiency: "martial", name: "NanoEdge Temno",     cost: "シ100,000", mass: "1", damage: "2d10 S",      properties: "Armor-piercing, versatile (2d12)" },
  { tier: "premium", category: "melee", proficiency: "martial", name: "NanoEdge Gladius",   cost: "シ60,000",  mass: "1", damage: "2d8 P or S",  properties: "Armor-piercing, finesse, light" },
  { tier: "premium", category: "melee", proficiency: "martial", name: "Masamune Katana",    cost: "シ300,000", mass: "1", damage: "2d10 S",      properties: "Armor-piercing, versatile (2d12), critical on 18–20" },
  { tier: "premium", category: "melee", proficiency: "martial", name: "Masamune Wakizashi", cost: "シ200,000", mass: "1", damage: "2d8 P or S",  properties: "Armor-piercing, finesse, light, critical on 18–20" },
  // ── Generic Firearms — Simple ──
  { tier: "generic", category: "firearm", proficiency: "simple", name: "Handgun, 9mm",        cost: "シ600",    mass: "1",  damage: "2d6 P",  recoil: 1, range: "12/36",      properties: "Close, light, reload (15)" },
  { tier: "generic", category: "firearm", proficiency: "simple", name: "Handgun, 10mm",       cost: "シ700",    mass: "1",  damage: "3d4 P",  recoil: 2, range: "13/39",      properties: "Close, light, reload (12)" },
  { tier: "generic", category: "firearm", proficiency: "simple", name: "Handgun, 11mm",       cost: "シ900",    mass: "1.5",damage: "2d8 P",  recoil: 3, range: "14/42",      properties: "Close, reload (10)" },
  { tier: "generic", category: "firearm", proficiency: "simple", name: "Handgun, 12mm",       cost: "シ2,000",  mass: "2",  damage: "3d6 P",  recoil: 4, range: "15/45",      properties: "Close, reload (6)" },
  { tier: "generic", category: "firearm", proficiency: "simple", name: "Hunting Rifle, 5.56mm",cost: "シ1,000", mass: "3",  damage: "2d8 P",  recoil: 0, range: "100/300",    properties: "Reload (6), two-handed" },
  { tier: "generic", category: "firearm", proficiency: "simple", name: "Hunting Rifle, 7.62mm",cost: "シ1,200", mass: "3",  damage: "2d10 P", recoil: 1, range: "120/360",    properties: "Reload (5), two-handed" },
  { tier: "generic", category: "firearm", proficiency: "simple", name: "Hunting Rifle, 9.5mm", cost: "シ2,000", mass: "4", damage: "2d12 P", recoil: 2, range: "150/450",    properties: "Reload (4), two-handed" },
  { tier: "generic", category: "firearm", proficiency: "simple", name: "Shotgun, 12 gauge",   cost: "シ600",    mass: "4",  damage: "2d8 P",  recoil: 1, range: "40/120",     properties: "Reload (8), shotgun, two-handed" },
  { tier: "generic", category: "firearm", proficiency: "simple", name: "Shotgun, 10 gauge",   cost: "シ800",    mass: "5",  damage: "2d10 P", recoil: 2, range: "50/150",     properties: "Reload (8), shotgun, two-handed" },
  // ── Generic Firearms — Martial ──
  { tier: "generic", category: "firearm", proficiency: "martial", name: "Assault Rifle, 5.56mm",cost: "シ2,000",  mass: "3",  damage: "2d8 P",  recoil: 0, range: "150/450",  properties: "Auto, reload (40), two-handed" },
  { tier: "generic", category: "firearm", proficiency: "martial", name: "Assault Rifle, 7.62mm",cost: "シ2,000",  mass: "4",  damage: "2d10 P", recoil: 1, range: "180/540",  properties: "Auto, reload (30), two-handed" },
  { tier: "generic", category: "firearm", proficiency: "martial", name: "CAW, 12 gauge",       cost: "シ2,000",  mass: "6",  damage: "2d8 P",  recoil: 1, range: "40/80",    properties: "Auto, reload (12), shotgun, two-handed" },
  { tier: "generic", category: "firearm", proficiency: "martial", name: "Machine Gun, 7.62mm", cost: "シ5,000",  mass: "9",  damage: "2d12 P", recoil: 3, range: "300/900",  properties: "Auto, reload (200), two-handed" },
  { tier: "generic", category: "firearm", proficiency: "martial", name: "Machine Gun, 12.7mm", cost: "シ20,000", mass: "60", damage: "3d12 P", recoil: 4, range: "1km/2km",  properties: "Auto, mount, reload (200), two-handed" },
  { tier: "generic", category: "firearm", proficiency: "martial", name: "Sniper Rifle, 5.56mm",cost: "シ1,500",  mass: "3",  damage: "2d8 P",  recoil: 0, range: "250/750",  properties: "Two-handed, reload (5)" },
  { tier: "generic", category: "firearm", proficiency: "martial", name: "Sniper Rifle, 7.62mm",cost: "シ2,000",  mass: "3",  damage: "2d10 P", recoil: 1, range: "300/900",  properties: "Two-handed, reload (5)" },
  { tier: "generic", category: "firearm", proficiency: "martial", name: "Sniper Rifle, 12.7mm",cost: "シ10,000", mass: "14", damage: "3d12 P", recoil: 4, range: "1km/2km",  properties: "Mount, two-handed, reload (4)" },
  { tier: "generic", category: "firearm", proficiency: "martial", name: "SMG, 4.6mm",          cost: "シ1,200",  mass: "2",  damage: "1d10 P", recoil: 0, range: "20/60",    properties: "Auto, close, light, reload (50)" },
  { tier: "generic", category: "firearm", proficiency: "martial", name: "SMG, 5.7mm",          cost: "シ1,600",  mass: "3",  damage: "1d12 P", recoil: 0, range: "40/120",   properties: "Auto, close, reload (50)" },
  { tier: "generic", category: "firearm", proficiency: "martial", name: "SMG, 9mm",            cost: "シ2,000",  mass: "3",  damage: "2d6 P",  recoil: 0, range: "70/210",   properties: "Auto, close, reload (40)" },
  // ── Premium Firearms — Simple ──
  { tier: "premium", category: "firearm", proficiency: "simple", name: "Ballista 12 gauge",   cost: "シ18,000",  mass: "5",   damage: "2d12 P",  recoil: 3, range: "50/150",   properties: "Reload (8), shotgun, two-handed" },
  { tier: "premium", category: "firearm", proficiency: "simple", name: "Black Widow 9mm",     cost: "シ10,000",  mass: "1",   damage: "2d6 P",   recoil: 0, range: "12/36",    properties: "Close, light, reload (15), silenced" },
  { tier: "premium", category: "firearm", proficiency: "simple", name: "Drake Gas Gun",       cost: "シ10,000",  mass: "1.5", damage: "—",        recoil: 0, range: "12",       properties: "Reload (4), special" },
  { tier: "premium", category: "firearm", proficiency: "simple", name: "GI Python 12mm",      cost: "シ30,000",  mass: "2",   damage: "2d12 P",  recoil: 4, range: "15/45",    properties: "Close, reload (8)" },
  { tier: "premium", category: "firearm", proficiency: "simple", name: "Urban Ranger 10mm",   cost: "シ18,000",  mass: "1",   damage: "2d8 P",   recoil: 1, range: "13/39",    properties: "Close, light, reload (13)" },
  { tier: "premium", category: "firearm", proficiency: "simple", name: "ZQ Monkey King 11mm", cost: "シ25,000",  mass: "1.5", damage: "3d6 P",   recoil: 2, range: "14/42",    properties: "Close, reload (12)" },
  // ── Premium Firearms — Martial ──
  { tier: "premium", category: "firearm", proficiency: "martial", name: "Ballista 10 gauge",     cost: "シ60,000",  mass: "7",  damage: "4d6 P",  recoil: 4, range: "50/150",  properties: "Reload (8), shotgun, two-handed" },
  { tier: "premium", category: "firearm", proficiency: "martial", name: "Boss Killer 12.7mm",    cost: "シ250,000", mass: "14", damage: "4d10 P", recoil: 4, range: "1km/2km", properties: "Mount, two-handed, reload (4)" },
  { tier: "premium", category: "firearm", proficiency: "martial", name: "Bushwhacker 7.62mm",    cost: "シ25,000",  mass: "3",  damage: "2d12 P", recoil: 0, range: "120/360", properties: "Reload (5), two-handed" },
  { tier: "premium", category: "firearm", proficiency: "martial", name: "Bushwhacker Bola Gun",  cost: "シ10,000",  mass: "3",  damage: "—",       recoil: 0, range: "20",      properties: "Reload (1), special" },
  { tier: "premium", category: "firearm", proficiency: "martial", name: "CinderPro Flamethrower",cost: "シ15,000",  mass: "10", damage: "4d6 H",  recoil: 0, range: "9m",      properties: "Two-handed, reload (3), special" },
  { tier: "premium", category: "firearm", proficiency: "martial", name: "Cypher MK II 5.56mm",   cost: "シ25,000",  mass: "3",  damage: "2d12 P", recoil: 0, range: "250/750", properties: "Two-handed, reload (7), silenced" },
  { tier: "premium", category: "firearm", proficiency: "martial", name: "Diablo 7.62mm",          cost: "シ50,000",  mass: "3",  damage: "4d6 P",  recoil: 2, range: "300/900", properties: "Two-handed, reload (5)" },
  { tier: "premium", category: "firearm", proficiency: "martial", name: "DragonBreath 12 gauge",  cost: "シ16,000",  mass: "4",  damage: "2d8 P",  recoil: 1, range: "40/120",  properties: "Reload (8), shotgun, two-handed, 1d6 H damage" },
  { tier: "premium", category: "firearm", proficiency: "martial", name: "FS-3 Laser Cannon",      cost: "シ200,000", mass: "80", damage: "7d10 H", recoil: 0, range: "1km/2km", properties: "Reload (10), mount" },
  { tier: "premium", category: "firearm", proficiency: "martial", name: "GI Viper 4.6mm",         cost: "シ25,000",  mass: "2",  damage: "2d6 P",  recoil: 0, range: "20/60",   properties: "Auto, close, light, reload (50)" },
  { tier: "premium", category: "firearm", proficiency: "martial", name: "M2 Maxim 12.7mm",        cost: "シ300,000", mass: "60", damage: "4d10 P", recoil: 4, range: "1km/2km", properties: "Auto, mount, two-handed, reload (200)" },
  { tier: "premium", category: "firearm", proficiency: "martial", name: "Manticore Bolter",       cost: "シ120,000", mass: "5",  damage: "1d12 P", recoil: 0, range: "12/24",   properties: "Auto, reload (26), 3d6 Po damage" },
  { tier: "premium", category: "firearm", proficiency: "martial", name: "M2 Rocket Launcher",     cost: "シ15,000",  mass: "8",  damage: "7d10 P", recoil: 2, range: "50/100",  properties: "Armor-piercing, reload (1), special, two-handed" },
  { tier: "premium", category: "firearm", proficiency: "martial", name: "Nova Microwaver",         cost: "シ25,000",  mass: "7",  damage: "—",       recoil: 0, range: "20",      properties: "Reload (10), special, two-handed" },
  { tier: "premium", category: "firearm", proficiency: "martial", name: "Ravager 10 gauge",        cost: "シ50,000",  mass: "6",  damage: "2d12 P", recoil: 1, range: "40/80",   properties: "Auto, reload (12), shotgun, two-handed" },
  { tier: "premium", category: "firearm", proficiency: "martial", name: "SK Grenade Launcher",     cost: "シ3,000",   mass: "6",  damage: "—",       recoil: 0, range: "40",      properties: "Reload (6), two-handed, special" },
  { tier: "premium", category: "firearm", proficiency: "martial", name: "Stingray Shock Rifle",    cost: "シ100,000", mass: "6",  damage: "2d6 P",  recoil: 1, range: "15/30",   properties: "2d6 E damage" },
  { tier: "premium", category: "firearm", proficiency: "martial", name: "Tiamat 10 gauge",         cost: "シ50,000",  mass: "4",  damage: "2d10 P", recoil: 2, range: "50/150",  properties: "Reload (8), shotgun, two-handed, 1d6 H damage" },
  { tier: "premium", category: "firearm", proficiency: "martial", name: "XM Spitfire 5.56mm",      cost: "シ100,000", mass: "9",  damage: "2d12 P", recoil: 3, range: "300/900", properties: "Auto, rapid-fire, reload (200), two-handed" },
  { tier: "premium", category: "firearm", proficiency: "martial", name: "ZQ Blitzer 7.62mm",       cost: "シ60,000",  mass: "4",  damage: "2d12 P", recoil: 1, range: "180/540", properties: "Auto, reload (30), two-handed" },
  { tier: "premium", category: "firearm", proficiency: "martial", name: "ZQ Timberwolf 9mm",       cost: "シ50,000",  mass: "3",  damage: "3d6 P",  recoil: 0, range: "70/210",  properties: "Auto, close, reload (40)" },
  { tier: "premium", category: "firearm", proficiency: "martial", name: "ZQ Wolverine 5.56mm",     cost: "シ40,000",  mass: "3",  damage: "2d10 P", recoil: 0, range: "150/450", properties: "Auto, reload (40), two-handed" },
];

// ─── BUJUTSU TECHNIQUES ──────────────────────────────────────────────────────

export interface BujutsuTechnique {
  name: string;
  prerequisite?: string;
  description: string;
}

export const BUJUTSU_TECHNIQUES: BujutsuTechnique[] = [
  {
    name: "Hard Adept",
    description: "Your unarmed strikes gain increased damage dice as you level (see Hardcase/Samurai table). You also gain two sub-techniques: Sting like a Bee — your unarmed strike deals an additional %d/ damage; and Counterpunch — when someone misses you with a melee attack, you can use your reaction to make an unarmed strike against them.",
  },
  {
    name: "Hard Master",
    prerequisite: "Level 9, Hard Adept",
    description: "When you roll a natural 20 on an unarmed strike, you can spend a ki point to render the target unconscious until the end of your next turn.",
  },
  {
    name: "Iaijutsu Adept",
    description: "Through iaijutsu training you can draw and attack before your opponent reacts. You have advantage on attack rolls against any target that hasn't taken a turn in the current combat. Additionally, you gain a +5 bonus to initiative.",
  },
  {
    name: "Iaijutsu Master",
    prerequisite: "Iaijutsu Adept",
    description: "Your iaijutsu mastery keeps you constantly on guard. You can't be surprised while conscious. You gain a +5 bonus to initiative (does not stack with Iaijutsu Adept). Enemies don't gain advantage on attack rolls against you as a result of being unseen by you.",
  },
  {
    name: "Ittōjutsu Adept",
    prerequisite: "Level 3, Great Weapon Fighting (Fighting Style)",
    description: "When making damage rolls with a melee weapon wielded with two hands, you can spend a ki point to inflict an extra 2d8 damage (usable after the attack roll but before knowing if it hits). At level 6 spend 2 ki for 3d8; level 11 spend 3 ki for 4d8; level 16 spend 4 ki for 5d8.",
  },
  {
    name: "Ittōjutsu Master",
    prerequisite: "Level 9, Ittōjutsu Adept",
    description: "While wielding a melee weapon with two hands you gain +2 AC. Additionally, you may use your reaction and spend a ki point to make a weapon attack with your two-handed weapon against anyone within 1.5 meters who makes a weapon attack against you.",
  },
  {
    name: "Jujutsu Adept",
    description: "You can spend a ki point to perform any of the following unarmed melee attacks: Trip — in addition to regular damage the strike acts as a shove; Takedown — both you and the target become prone and you may initiate a grapple as a free action; Choke — if you begin your turn having the target grappled, the target must succeed on a Con save or become unconscious (regains consciousness at end of their turn after you release); Wrist Strike — the target must make a Str saving throw or drop an object of your choice.",
  },
  {
    name: "Jujutsu Master",
    prerequisite: "Jujutsu Adept",
    description: "You have advantage on attack rolls against a target you are grappling, and they have disadvantage on attack rolls made against you.",
  },
  {
    name: "Ninjutsu Adept",
    prerequisite: "Sneak Attack",
    description: "Your bujutsu focuses on stealth and subtlety. You gain proficiency in the Stealth skill (or double your proficiency bonus if already proficient). If you are unseen, you can move up to 5 meters in the open without revealing yourself if you end the move in an area with cover.",
  },
  {
    name: "Ninjutsu Master",
    prerequisite: "Level 17, Ninjutsu Adept",
    description: "You become a master of instant death. When you attack and hit a target that is surprised, you can spend a ki point; the target must make a Con saving throw. On a failed save, your attack's damage is doubled.",
  },
  {
    name: "Nitōjutsu Adept",
    prerequisite: "Level 9, Two-Weapon Fighting (Fighting Style)",
    description: "When you take the Attack action with a melee weapon or firearm with the close property in one hand, you can spend a ki point to use a bonus action to make two attacks with a different light melee weapon or close firearm in the other hand.",
  },
  {
    name: "Nitōjutsu Master",
    prerequisite: "Level 17, Nitōjutsu Adept",
    description: "When you take the Attack action with a melee weapon or close firearm in one hand, you can spend two ki points to use a bonus action to make three attacks with a different light melee weapon or close firearm in the other hand.",
  },
  {
    name: "Sneak Attack",
    description: "You know how to strike subtly and exploit a foe's distraction. Once per turn, if you spend a ki point you can deal an extra 1d6 damage to one person you hit with an attack if you have advantage on the attack roll (or an ally is within 1.5m of the target, that ally isn't incapacitated, and you don't have disadvantage). The attack must use a finesse or ranged weapon. Damage increases: 2d6 at level 6, 3d6 at level 10, 4d6 at level 13, 5d6 at level 17, 6d6 at level 20.",
  },
  {
    name: "Stunning Strike",
    prerequisite: "Level 6",
    description: "You know several nerve points and muscle attachments you can exploit with your strikes. When you hit someone with a melee attack, you can spend 1 ki point to attempt a stunning strike. The target must succeed on a Con saving throw or be stunned until the end of your next turn.",
  },
  {
    name: "Uncanny Dodge",
    prerequisite: "Level 13",
    description: "When an attacker that you can see hits you with an attack, you can use your reaction to halve the attack's damage against you.",
  },
];

// ─── CONDITIONS ──────────────────────────────────────────────────────────────

export interface ConditionData {
  name: string;
  effects: string[];
}

export const CONDITIONS: ConditionData[] = [
  {
    name: "Blinded",
    effects: [
      "A blinded creature can't see and automatically fails any ability check that requires sight.",
      "Attack rolls against the creature have advantage, and the creature's attack rolls have disadvantage.",
    ],
  },
  {
    name: "Charmed",
    effects: [
      "A charmed creature can't attack the charmer or target them with harmful abilities or magical effects.",
      "The charmer has advantage on any ability check to interact socially with the creature.",
    ],
  },
  {
    name: "Deafened",
    effects: [
      "A deafened creature can't hear and automatically fails any ability check that requires hearing.",
    ],
  },
  {
    name: "Exhaustion",
    effects: [
      "Level 1: Disadvantage on ability checks.",
      "Level 2: Speed halved.",
      "Level 3: Disadvantage on attack rolls and saving throws.",
      "Level 4: Hit point maximum halved.",
      "Level 5: Speed reduced to 0.",
      "Level 6: Death.",
      "Finishing a long rest reduces exhaustion level by 1, provided the creature has also ingested food and drink.",
    ],
  },
  {
    name: "Frightened",
    effects: [
      "A frightened creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight.",
      "The creature can't willingly move closer to the source of its fear.",
    ],
  },
  {
    name: "Grappled",
    effects: [
      "A grappled creature's speed becomes 0, and it can't benefit from any bonus to its speed.",
      "The condition ends if the grappler is incapacitated.",
      "The condition also ends if an effect removes the grappled creature from the reach of the grappler.",
    ],
  },
  {
    name: "Incapacitated",
    effects: [
      "An incapacitated creature can't take actions or reactions.",
    ],
  },
  {
    name: "Invisible",
    effects: [
      "An invisible creature is impossible to see without special senses. For the purpose of hiding, the creature is heavily obscured.",
      "The creature's location can be detected by noise or tracks.",
      "Attack rolls against the creature have disadvantage, and the creature's attack rolls have advantage.",
    ],
  },
  {
    name: "Paralyzed",
    effects: [
      "A paralyzed creature is incapacitated and can't move or speak.",
      "The creature automatically fails Strength and Dexterity saving throws.",
      "Attack rolls against the creature have advantage.",
      "Any attack that hits the creature is a critical hit if the attacker is within 1.5 meters of the creature.",
    ],
  },
  {
    name: "Petrified",
    effects: [
      "A petrified creature is transformed into a solid inanimate substance. Its weight increases by a factor of ten, and it ceases aging.",
      "The creature is incapacitated, can't move or speak, and is unaware of its surroundings.",
      "Attack rolls against the creature have advantage.",
      "The creature automatically fails Strength and Dexterity saving throws.",
      "The creature has resistance to all damage.",
      "The creature is immune to poison and disease, but existing poisons and diseases are suspended.",
    ],
  },
  {
    name: "Poisoned",
    effects: [
      "A poisoned creature has disadvantage on attack rolls and ability checks.",
    ],
  },
  {
    name: "Prone",
    effects: [
      "A prone creature's only movement option is to crawl, unless it stands up (costs half its movement).",
      "The creature has disadvantage on attack rolls.",
      "Attack rolls against the creature have advantage if the attacker is within 1.5 meters. Otherwise, the attack roll has disadvantage.",
      "Reduces recoil by 2 when firing a firearm.",
    ],
  },
  {
    name: "Restrained",
    effects: [
      "A restrained creature's speed becomes 0, and it can't benefit from any bonus to its speed.",
      "Attack rolls against the creature have advantage, and the creature's attack rolls have disadvantage.",
      "The creature has disadvantage on Dexterity saving throws.",
    ],
  },
  {
    name: "Stunned",
    effects: [
      "A stunned creature is incapacitated, can't move, and can speak only falteringly.",
      "The creature automatically fails Strength and Dexterity saving throws.",
      "Attack rolls against the creature have advantage.",
    ],
  },
  {
    name: "Unconscious",
    effects: [
      "An unconscious creature is incapacitated, can't move or speak, and is unaware of its surroundings.",
      "The creature drops whatever it's holding and falls prone.",
      "The creature automatically fails Strength and Dexterity saving throws.",
      "Attack rolls against the creature have advantage.",
      "Any attack that hits the creature is a critical hit if the attacker is within 1.5 meters.",
    ],
  },
];
