import type { AbilityKey, SenseKey } from './types';

export interface GenomeData {
  name: string;
  description: string;
  abilityBonuses: Partial<Record<AbilityKey, number>>;
  senses: Partial<Record<SenseKey, boolean>>;
  traits: { name: string; description: string }[];
  speed: number;
}


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

