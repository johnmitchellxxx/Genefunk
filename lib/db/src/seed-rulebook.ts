import { db } from "./index";
import {
  rulebookClassesTable,
  rulebookBackgroundsTable,
  rulebookGenomesTable,
  rulebookCadresTable,
} from "./schema/rulebook";

const cadres = [
  {
    name: "Mercenary",
    affiliation: "Independent",
    description: "A for-hire cadre that takes contracts from whoever pays — corporations, governments, or underground factions. No loyalty except to the mission and each other.",
  },
  {
    name: "Corporate Black Ops",
    affiliation: "Corporate",
    description: "A covert unit operating under a megacorp's banner, running deniable operations: espionage, asset recovery, wetwork, and competitive sabotage.",
  },
  {
    name: "Underground Crew",
    affiliation: "Criminal",
    description: "Operating in the cracks of society — smugglers, hackers, thieves, and fixers who work the black market and owe allegiance to no government or corp.",
  },
  {
    name: "Special Forces",
    affiliation: "Military",
    description: "Government or military-backed operatives conducting high-risk missions behind enemy lines, enforcing order, or eliminating high-value targets.",
  },
  {
    name: "Research Collective",
    affiliation: "Scientific",
    description: "A team of scientists and field operatives pursuing cutting-edge research — often in dangerous territory. Gene labs, ancient ruins, and active war zones are all just fieldwork.",
  },
  {
    name: "Intelligence Cell",
    affiliation: "Espionage",
    description: "Spies, analysts, and field agents working for a clandestine agency. Information is the currency; loyalty and cover identities are the tools.",
  },
  {
    name: "Medical Rescue",
    affiliation: "Medical",
    description: "A rapid-response cadre specializing in crisis medicine, organ recovery, trauma surgery in the field, and navigating the brutal economics of healthcare in 2090.",
  },
  {
    name: "Anarchist Collective",
    affiliation: "Resistance",
    description: "Anti-corporate, anti-government operatives striking at systems of control — saboteurs, liberators, and propagandists fighting for a world the megacorps haven't bought yet.",
  },
  {
    name: "Freelance",
    affiliation: "Independent",
    description: "No single affiliation. This cadre takes work where they find it, builds their own reputation, and answers to no organization. Pure free agents in a corporate world.",
  },
];

const classes = [
  {
    name: "Biohacker",
    description:
      "Biohackers are scientists who manipulate biology at the molecular level, using genetic engineering and biochemistry to alter living organisms — including themselves.",
    hitDie: 8,
    primaryAbility: "Intelligence",
    savingThrows: ["Intelligence", "Wisdom"],
    armorProficiencies: ["Light armor"],
    weaponProficiencies: ["Simple weapons", "Hyposprays"],
    skillChoices: [
      "Computers",
      "Insight",
      "Investigation",
      "Life Science",
      "Medicine",
      "Physical Science",
    ],
    numSkillChoices: 2,
    subclasses: [
      {
        name: "Cytomancer",
        description:
          "Cytomancers specialize in manipulating cells and tissues, creating biological constructs and healing allies at the cellular level.",
      },
      {
        name: "Dr. Frankenstein",
        description:
          "Dr. Frankensteins push the boundaries of biological modification, creating monstrous augmentations and chimeric organisms.",
      },
      {
        name: "Protean Grinder",
        description:
          "Protean Grinders focus on self-modification, constantly adapting their own biology to meet any challenge.",
      },
    ],
    featuresByLevel: {
      "1": [
        {
          name: "Hacking",
          description:
            "You gain the ability to run biohacks — biological programs that manipulate living tissue.",
        },
        {
          name: "Biohack Focus",
          description:
            "You use a hypospray or biological toolkit as your hacking focus for biohacks.",
        },
      ],
      "2": [
        {
          name: "Genetic Intuition",
          description:
            "You can add your proficiency bonus to any Life Science check related to genetics or biochemistry.",
        },
      ],
      "3": [
        {
          name: "Archetype",
          description:
            "Choose your Biohacker archetype: Cytomancer, Dr. Frankenstein, or Protean Grinder.",
        },
      ],
      "4": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "5": [
        {
          name: "Enhanced Biohacks",
          description:
            "Your biohacks become more potent, gaining additional effects at higher levels.",
        },
      ],
      "8": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "12": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "16": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "19": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "20": [
        {
          name: "Master Biohacker",
          description:
            "You reach the pinnacle of biological manipulation, gaining mastery over your biohacks.",
        },
      ],
    },
  },
  {
    name: "Codehacker",
    description:
      "Codehackers are digital warriors who manipulate software, networks, and electronic systems. They are the masters of the digital realm.",
    hitDie: 8,
    primaryAbility: "Intelligence",
    savingThrows: ["Intelligence", "Dexterity"],
    armorProficiencies: ["Light armor"],
    weaponProficiencies: ["Simple weapons", "Sidearms"],
    skillChoices: [
      "Computers",
      "Deception",
      "Investigation",
      "Perception",
      "Stealth",
      "Streetwise",
    ],
    numSkillChoices: 2,
    subclasses: [
      {
        name: "Cracker",
        description:
          "Crackers specialize in breaking into secure systems, bypassing firewalls, and stealing data.",
      },
      {
        name: "Puppeteer",
        description:
          "Puppeteers manipulate drones, robots, and electronic devices, turning the battlefield's technology against their enemies.",
      },
      {
        name: "Synergist",
        description:
          "Synergists enhance their allies' capabilities through digital buffs and network coordination.",
      },
    ],
    featuresByLevel: {
      "1": [
        {
          name: "Hacking",
          description:
            "You gain the ability to run codehacks — software programs that manipulate electronic systems.",
        },
        {
          name: "Codehack Focus",
          description:
            "You use a cyberdeck or similar device as your hacking focus for codehacks.",
        },
      ],
      "2": [
        {
          name: "Digital Ghost",
          description:
            "You can add your proficiency bonus to any Computers check related to hacking or digital intrusion.",
        },
      ],
      "3": [
        {
          name: "Archetype",
          description:
            "Choose your Codehacker archetype: Cracker, Puppeteer, or Synergist.",
        },
      ],
      "4": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "5": [
        {
          name: "Enhanced Codehacks",
          description:
            "Your codehacks become more potent, gaining additional effects at higher levels.",
        },
      ],
      "8": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "12": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "16": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "19": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "20": [
        {
          name: "Master Codehacker",
          description:
            "You reach the pinnacle of digital manipulation, gaining mastery over your codehacks.",
        },
      ],
    },
  },
  {
    name: "Crook",
    description:
      "Crooks are skilled criminals who rely on cunning, stealth, and deception. They excel at infiltration, theft, and social manipulation.",
    hitDie: 8,
    primaryAbility: "Dexterity",
    savingThrows: ["Dexterity", "Intelligence"],
    armorProficiencies: ["Light armor"],
    weaponProficiencies: [
      "Simple weapons",
      "Sidearms",
      "Martial melee weapons with the light property",
    ],
    skillChoices: [
      "Acrobatics",
      "Athletics",
      "Deception",
      "Insight",
      "Intimidation",
      "Investigation",
      "Perception",
      "Performance",
      "Persuasion",
      "Sleight of Hand",
      "Stealth",
      "Streetwise",
    ],
    numSkillChoices: 4,
    subclasses: [
      {
        name: "Dealer",
        description:
          "Dealers are masters of illicit trade, managing networks of contacts and moving contraband.",
      },
      {
        name: "Hitman",
        description:
          "Hitmen are professional assassins who specialize in eliminating targets quickly and quietly.",
      },
      {
        name: "Robber",
        description:
          "Robbers specialize in heists, breaking and entering, and acquiring valuables through theft.",
      },
    ],
    featuresByLevel: {
      "1": [
        {
          name: "Expertise",
          description:
            "Choose two of your skill proficiencies. Your proficiency bonus is doubled for those skills.",
        },
        {
          name: "Sneak Attack",
          description:
            "Once per turn, you can deal extra damage to one creature you hit with an attack if you have advantage on the attack roll.",
        },
        {
          name: "Illicit Contact",
          description:
            "You gain an illicit contact — a criminal associate you can call upon for help once per session.",
        },
      ],
      "2": [
        {
          name: "Cunning Action",
          description:
            "You can take a bonus action to Dash, Disengage, or Hide.",
        },
      ],
      "3": [
        {
          name: "Archetype",
          description:
            "Choose your Crook archetype: Dealer, Hitman, or Robber.",
        },
      ],
      "4": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "5": [
        {
          name: "Uncanny Dodge",
          description:
            "When an attacker you can see hits you with an attack, you can use your reaction to halve the damage.",
        },
      ],
      "7": [
        {
          name: "Evasion",
          description:
            "When subjected to an effect that allows a Dexterity saving throw for half damage, you take no damage on a success and half on a failure.",
        },
      ],
      "8": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "12": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "16": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "19": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "20": [
        {
          name: "Master Crook",
          description:
            "You reach the pinnacle of criminal expertise, becoming a legendary figure in the underworld.",
        },
      ],
    },
  },
  {
    name: "Engineer",
    description:
      "Engineers are masters of technology, building and modifying equipment, vehicles, drones, and robots. They combine technical expertise with combat capability.",
    hitDie: 8,
    primaryAbility: "Intelligence",
    savingThrows: ["Constitution", "Intelligence"],
    armorProficiencies: ["Light armor", "Medium armor"],
    weaponProficiencies: ["Simple weapons", "Sidearms"],
    skillChoices: [
      "Computers",
      "Investigation",
      "Life Science",
      "Mechanics",
      "Medicine",
      "Physical Science",
    ],
    numSkillChoices: 2,
    subclasses: [
      {
        name: "Gadgeteer",
        description:
          "Gadgeteers create specialized tools and devices that give them an edge in and out of combat.",
      },
      {
        name: "Gearhead",
        description:
          "Gearheads specialize in vehicles and heavy machinery, becoming expert pilots and mechanics.",
      },
      {
        name: "Roboticist",
        description:
          "Roboticists build and control robots, deploying mechanical allies to assist in combat and exploration.",
      },
    ],
    featuresByLevel: {
      "1": [
        {
          name: "Hacking",
          description:
            "You gain the ability to run engineer hacks — technical programs that manipulate devices and machinery.",
        },
        {
          name: "Technical Proficiency",
          description:
            "You can add your proficiency bonus to any Mechanics check to repair or modify equipment.",
        },
      ],
      "2": [
        {
          name: "Tool Expertise",
          description:
            "Your proficiency bonus is doubled for any ability check that uses your tool proficiencies.",
        },
      ],
      "3": [
        {
          name: "Archetype",
          description:
            "Choose your Engineer archetype: Gadgeteer, Gearhead, or Roboticist.",
        },
      ],
      "4": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "5": [
        {
          name: "Enhanced Engineering",
          description:
            "Your engineering hacks become more potent, gaining additional effects at higher levels.",
        },
      ],
      "8": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "12": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "16": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "19": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "20": [
        {
          name: "Master Engineer",
          description:
            "You reach the pinnacle of engineering, creating masterwork devices and machines.",
        },
      ],
    },
  },
  {
    name: "Gunfighter",
    description:
      "Gunfighters are combat specialists who excel with firearms. They are deadly marksmen and tactical fighters, dominating the battlefield at range.",
    hitDie: 10,
    primaryAbility: "Dexterity",
    savingThrows: ["Strength", "Dexterity"],
    armorProficiencies: ["Light armor", "Medium armor", "Heavy armor"],
    weaponProficiencies: [
      "Simple weapons",
      "Martial weapons",
      "All firearms",
    ],
    skillChoices: [
      "Acrobatics",
      "Athletics",
      "Drive",
      "Insight",
      "Intimidation",
      "Perception",
      "Streetwise",
    ],
    numSkillChoices: 2,
    subclasses: [
      {
        name: "Gunslinger",
        description:
          "Gunslingers are flashy, fast-drawing fighters who excel with pistols and close-range firearms.",
      },
      {
        name: "Sniper",
        description:
          "Snipers are patient, precise shooters who eliminate targets from extreme range.",
      },
      {
        name: "Soldier",
        description:
          "Soldiers are disciplined, versatile fighters trained in military tactics and heavy weapons.",
      },
    ],
    featuresByLevel: {
      "1": [
        {
          name: "Fighting Style",
          description:
            "Choose a fighting style specialization for your combat approach.",
        },
        {
          name: "Second Wind",
          description:
            "You have a limited well of stamina. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your gunfighter level.",
        },
      ],
      "2": [
        {
          name: "Action Surge",
          description:
            "You can push yourself beyond your normal limits. On your turn, you can take one additional action. Once used, you must finish a short or long rest to use it again.",
        },
      ],
      "3": [
        {
          name: "Archetype",
          description:
            "Choose your Gunfighter archetype: Gunslinger, Sniper, or Soldier.",
        },
      ],
      "4": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "5": [
        {
          name: "Extra Attack",
          description:
            "You can attack twice, instead of once, whenever you take the Attack action on your turn.",
        },
      ],
      "6": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "8": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "11": [
        {
          name: "Extra Attack (2)",
          description:
            "You can attack three times whenever you take the Attack action on your turn.",
        },
      ],
      "12": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "14": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "16": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "19": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "20": [
        {
          name: "Extra Attack (3)",
          description:
            "You can attack four times whenever you take the Attack action on your turn.",
        },
      ],
    },
  },
  {
    name: "Hardcase",
    description:
      "Hardcases are tough, resilient fighters who thrive in close-quarters combat. They absorb punishment and dish it out with brutal efficiency.",
    hitDie: 12,
    primaryAbility: "Strength",
    savingThrows: ["Strength", "Constitution"],
    armorProficiencies: ["Light armor", "Medium armor"],
    weaponProficiencies: ["Simple weapons", "Martial weapons"],
    skillChoices: [
      "Athletics",
      "Acrobatics",
      "Intimidation",
      "Perception",
      "Streetwise",
      "Drive",
    ],
    numSkillChoices: 2,
    subclasses: [
      {
        name: "Damage Sponge",
        description:
          "Damage Sponges specialize in absorbing punishment, becoming nearly indestructible in combat.",
      },
      {
        name: "Gangster",
        description:
          "Gangsters are street-hardened fighters who combine brutality with intimidation.",
      },
      {
        name: "Unarmed Fighter",
        description:
          "Unarmed Fighters are martial arts experts who turn their bodies into lethal weapons.",
      },
    ],
    featuresByLevel: {
      "1": [
        {
          name: "Unarmored Defense",
          description:
            "While you are not wearing any armor, your AC equals 10 + your Dexterity modifier + your Constitution modifier.",
        },
        {
          name: "Rage",
          description:
            "You can enter a rage as a bonus action, gaining bonus damage and resistance to physical damage.",
        },
      ],
      "2": [
        {
          name: "Reckless Attack",
          description:
            "You can throw aside all concern for defense to attack with fierce desperation, gaining advantage on melee attack rolls but granting advantage to attackers.",
        },
        {
          name: "Danger Sense",
          description:
            "You gain advantage on Dexterity saving throws against effects you can see.",
        },
      ],
      "3": [
        {
          name: "Archetype",
          description:
            "Choose your Hardcase archetype: Damage Sponge, Gangster, or Unarmed Fighter.",
        },
      ],
      "4": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "5": [
        {
          name: "Extra Attack",
          description:
            "You can attack twice, instead of once, whenever you take the Attack action on your turn.",
        },
      ],
      "8": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "12": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "16": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "19": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "20": [
        {
          name: "Unstoppable",
          description:
            "You become nearly impossible to kill, gaining extraordinary resilience in combat.",
        },
      ],
    },
  },
  {
    name: "Samurai",
    description:
      "Samurai are disciplined melee combatants who blend martial prowess with spiritual focus. They follow a code of honor and wield bladed weapons with deadly precision.",
    hitDie: 10,
    primaryAbility: "Dexterity",
    savingThrows: ["Dexterity", "Wisdom"],
    armorProficiencies: ["Light armor", "Medium armor"],
    weaponProficiencies: [
      "Simple weapons",
      "Martial melee weapons",
      "Sidearms",
    ],
    skillChoices: [
      "Acrobatics",
      "Athletics",
      "Insight",
      "Intimidation",
      "Perception",
      "Stealth",
    ],
    numSkillChoices: 2,
    subclasses: [],
    featuresByLevel: {
      "1": [
        {
          name: "Fighting Style",
          description:
            "Choose a melee fighting style specialization for your combat approach.",
        },
        {
          name: "Bushido",
          description:
            "Your disciplined training grants you benefits when fighting with honor and focus.",
        },
      ],
      "2": [
        {
          name: "Ki",
          description:
            "Your training allows you to harness your inner energy, or ki, granting supernatural combat abilities.",
        },
      ],
      "3": [
        {
          name: "Deflect Missiles",
          description:
            "You can use your reaction to deflect or catch projectiles when you are hit by a ranged weapon attack.",
        },
      ],
      "4": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "5": [
        {
          name: "Extra Attack",
          description:
            "You can attack twice, instead of once, whenever you take the Attack action on your turn.",
        },
      ],
      "8": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "12": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "16": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "19": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "20": [
        {
          name: "Perfect Self",
          description:
            "You achieve perfect harmony of body and spirit, gaining extraordinary combat abilities.",
        },
      ],
    },
  },
  {
    name: "Suit",
    description:
      "Suits are charismatic leaders, negotiators, and social manipulators. They leverage connections, favors, and social influence to achieve their goals.",
    hitDie: 8,
    primaryAbility: "Charisma",
    savingThrows: ["Wisdom", "Charisma"],
    armorProficiencies: ["Light armor"],
    weaponProficiencies: ["Simple weapons", "Sidearms"],
    skillChoices: [
      "Bureaucracy",
      "Deception",
      "Insight",
      "Intimidation",
      "Investigation",
      "Perception",
      "Performance",
      "Persuasion",
      "Social Science",
    ],
    numSkillChoices: 3,
    subclasses: [
      {
        name: "Commander",
        description:
          "Commanders are tactical leaders who inspire and direct their allies in combat.",
      },
      {
        name: "G-Man",
        description:
          "G-Men are government agents or corporate operatives who leverage institutional power.",
      },
      {
        name: "Shark",
        description:
          "Sharks are ruthless negotiators and businesspeople who use social manipulation as a weapon.",
      },
    ],
    featuresByLevel: {
      "1": [
        {
          name: "Contacts",
          description:
            "You gain contacts — influential associates you can call upon for favors and information.",
        },
        {
          name: "Call in a Favor",
          description:
            "Once per session, you can call in a favor from one of your contacts for assistance.",
        },
      ],
      "2": [
        {
          name: "Inspiring Leader",
          description:
            "You can spend 10 minutes inspiring your companions, granting them temporary hit points.",
        },
      ],
      "3": [
        {
          name: "Archetype",
          description:
            "Choose your Suit archetype: Commander, G-Man, or Shark.",
        },
      ],
      "4": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "5": [
        {
          name: "Enhanced Influence",
          description:
            "Your social abilities become more potent, and your contacts become more reliable.",
        },
      ],
      "8": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "12": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "16": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "19": [
        {
          name: "Ability Score Improvement",
          description:
            "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat.",
        },
      ],
      "20": [
        {
          name: "Master of Influence",
          description:
            "You become a legendary social force, commanding respect and loyalty from all who encounter you.",
        },
      ],
    },
  },
];

const backgrounds = [
  {
    name: "Academic",
    description:
      "You spent years in university studying your discipline. Books, research, and learning the mysteries of human nature and the universe are your life. You likely have a masters or doctoral degree in some academic discipline, and you may have even been a professor.",
    skillProficiencies: [
      "Bureaucracy",
      "Life Science",
      "Social Science",
      "Physical Science",
      "Computers",
    ],
    vocationalProficiency: "Academic Specialty",
    featureName: "Research Focus",
    featureDescription:
      "You've spent thousands of hours on literature reviews, so your search-fu is excellent when it comes to finding primary sources of research. If you are looking for information even tangentially related to your specialty, you know exactly where to look and whom to speak to if you want to go deeper.",
    equipment:
      "A vintage print of your favorite book, digital library of 100s of books, glasses, and シ1,000",
    languages: "Two of your choice",
  },
  {
    name: "Artist",
    description:
      "You are a creative spirit, who needs to produce art for an audience. While the details of your art form can vary, you are possessed by the creative muse to bring beauty and soul into this world.",
    skillProficiencies: ["Performance", "Acrobatics", "Persuasion"],
    vocationalProficiency: "Artistic Talent",
    featureName: "Limited Fame",
    featureDescription:
      "For anyone interested in your medium, you are something of a celebrity. People that recognize you are inclined to help you for free, and you have advantage on any Charisma checks made against them. Additionally, you can wrangle up a place to perform quite easily, as long as it is a venue appropriate to your medium.",
    equipment:
      "Supplies necessary to create your art, a folder filled with fan mail, シ1,500",
    languages: null,
  },
  {
    name: "Ideologue",
    description:
      "You have devoted your life to a specific cause, or ideology. It could be religious, political, or social in nature. All of your goals are in some way colored by your passion of this ideology, using it as a lens through which all truth must pass.",
    skillProficiencies: ["Intimidation", "Social Science"],
    vocationalProficiency: "Personal Ideology",
    featureName: "Group Power",
    featureDescription:
      "As a collective, the devotees of your ideology are passionate about the cause and are enthusiastic about aiding any ally that promotes the one true way. You can call upon your group to provide shelter, protection, or to harass and attack your enemies, or provide information about them.",
    equipment:
      "Symbol of your ideology (necklace, armband, tattoo), a manifesto or holy book of your ideology, シ1,000",
    languages: null,
  },
  {
    name: "Investigator",
    description:
      "Investigators are responsible for solving crimes after the fact or determining if there even is a crime in the first place. You might be a police officer, private detective, corporate intelligence agent, insurance fraud investigator, or any other trade that involves uncovering potentially illegal mysteries.",
    skillProficiencies: ["Insight", "Investigation"],
    vocationalProficiency: "Interrogation",
    featureName: "Seasoned Detective",
    featureDescription:
      "Your experience in enforcing the law and dealing with lawbreakers gives you a feel for local laws and criminals. You can easily spot and speak with law enforcement, and just as easily pick out the dens of criminal activity in a community.",
    equipment: "A uniform in the style of your unit and indicative of your rank, a set of handcuffs, シ1,000",
    languages: null,
  },
  {
    name: "Military Veteran",
    description:
      "You've spent years working within a military operation. You've seen battle and bloodshed, and you have been trained and disciplined within your unit to be a lethal killer.",
    skillProficiencies: [
      "Athletics",
      "Drive",
      "Medium Armor",
      "Ranged Martial Weapons",
    ],
    vocationalProficiency: "Military Procedures",
    featureName: "Military Contact",
    featureDescription:
      "You still have a good relationship with an old buddy from your service years, and you can call upon them for help. Once per session, you can call upon the contact to recruit their expertise, abilities, resources, or knowledge, but they cannot be used to aid you in combat.",
    equipment: "An insignia of rank, a uniform, シ1,000",
    languages: null,
  },
  {
    name: "Outlaw",
    description:
      "You have spent a large portion of your life making your living on the wrong side of the law. You are no stranger to theft, murder, fraud, and other felonies.",
    skillProficiencies: ["Intimidation", "Streetwise"],
    vocationalProficiency: "Underworld Etiquette",
    featureName: "Shady Contact",
    featureDescription:
      "You know a guy or gal deeply embedded in the criminal underworld. Once per session, you can call upon the contact to recruit their expertise, abilities, resources, or knowledge, but they cannot be used to aid you in combat.",
    equipment: "A crowbar, prison tattoos, シ1,500",
    languages: null,
  },
  {
    name: "Religious Disciple",
    description:
      "You have spent your life in the service of a temple to a specific god or pantheon of gods. You act as an intermediary between the realm of the holy and the mortal world, performing sacred rites and offering sacrifices.",
    skillProficiencies: ["Insight", "Social Science"],
    vocationalProficiency: "Religion",
    featureName: "Shelter of the Faithful",
    featureDescription:
      "You command the respect of those who share your faith, and you can perform the religious ceremonies of your deity. You and your companions can expect to receive care at a temple, shrine, or other established presence of your faith.",
    equipment: "Religious paraphernalia (holy book, symbol, prayer beads, etc.), vestments, シ1,500",
    languages: null,
  },
  {
    name: "Slum Dog",
    description:
      "You have spent a great deal of time living utterly destitute in a transgenic ghetto, slum, or favela. You learned to look out for number one during that time and to value basic necessities.",
    skillProficiencies: ["Stealth", "Streetwise"],
    vocationalProficiency: "Homeless Rapport",
    featureName: "Slum Savvy",
    featureDescription:
      "You can navigate slums with ease, and you know the secret paths, places to avoid, and areas for shelter. While traveling through a slum, you and your allies can move at double speed (when not in combat). You also get a +5 to Move checks in a Chase as long as it occurs in a slum.",
    equipment: "A small knife, 1 gram of cocaine, シ1,000",
    languages: null,
  },
  {
    name: "Stargazer",
    description:
      "Your prime concern is the true nature of existence and human nature. Philosophy, religion, neuroscience, cosmology, psychology, and other domains that examine the universe and the human condition are your forte.",
    skillProficiencies: ["Insight", "Social Science"],
    vocationalProficiency: "Introspection",
    featureName: "Comfort of the Enlightened",
    featureDescription:
      "Your time examining and reflecting on the universe and your relation to it has immunized you to some of the horrors of it. You have advantage on saving throws versus fear. Additionally, once per session, the GM can give you a clue about a mystery you haven't solved yet.",
    equipment:
      "Spiritual texts (holy book, philosophy textbook, or science journal collection), and clothing or a tattoo that captures your enlightened view, シ1,000",
    languages: null,
  },
  {
    name: "Technician",
    description:
      "You have dedicated a large portion of your life to a craft or trade; be it brewing, genome design, electrician work, coding, carpentry, mechanics, or glass blowing. You are a well-established tradesperson or professional technician.",
    skillProficiencies: [
      "Computers",
      "Insight",
      "Life Science",
      "Physical Science",
      "Mechanics",
      "Performance",
    ],
    vocationalProficiency: "Technician",
    featureName: "Excellent Reputation",
    featureDescription:
      "You have limited fame and perhaps even celebrity status surrounding your craft, and whenever you meet a fan, they are much more willing to help you.",
    equipment: "A set of tools that allow you to ply your trade, a sample of your craft, シ1,500",
    languages: null,
  },
  {
    name: "Trust Fund Kid",
    description:
      "You understand wealth, power, and privilege. Your family owns a great deal of wealth and wields significant political influence. You've grown up in this social class, receiving a private education and a life free of student loans.",
    skillProficiencies: ["Persuasion", "Social Science"],
    vocationalProficiency: "Highbrow Etiquette",
    featureName: "Position of Privilege",
    featureDescription:
      "Thanks to your privileged birth, people are inclined to think the best of you. Your family name precedes you, and you are welcome in high society. You can secure an audience with celebrities and can get into fine restaurants based on your name.",
    equipment: "Fine clothes, シ3,000",
    languages: null,
  },
];

const genomes = [
  {
    name: "Canary",
    category: "Engineered",
    description:
      "Canaries are engineered humans designed for enhanced sensory perception, particularly in detecting environmental hazards and toxins.",
    abilityBonuses: { dexterity: 1, wisdom: 2 },
    senses: ["Acute Olfaction", "Spectrum"],
    traits: [
      {
        name: "Toxin Sensitivity",
        description:
          "You have advantage on saving throws against poison and can detect airborne toxins within 9 meters.",
      },
      {
        name: "Fragile Frame",
        description:
          "Your hit point maximum is reduced by 1 at each level.",
      },
    ],
    speed: 9,
  },
  {
    name: "Coelhomortos",
    category: "Engineered",
    description:
      "Coelhomortos are engineered humans with rabbit-like traits, designed for speed and agility.",
    abilityBonuses: { dexterity: 2, charisma: 1 },
    senses: ["Darkvision"],
    traits: [
      {
        name: "Powerful Legs",
        description:
          "Your jump distance is doubled, and you have advantage on Athletics checks related to jumping.",
      },
      {
        name: "Quick Reflexes",
        description: "You have advantage on initiative rolls.",
      },
    ],
    speed: 12,
  },
  {
    name: "Companion",
    category: "Engineered",
    description:
      "Companions are engineered humans designed for social interaction, empathy, and emotional intelligence.",
    abilityBonuses: { charisma: 2, wisdom: 1 },
    senses: [],
    traits: [
      {
        name: "Empathic Read",
        description:
          "You have advantage on Insight checks to determine a creature's emotional state.",
      },
      {
        name: "Soothing Presence",
        description:
          "Once per short rest, you can calm a hostile creature with a successful Persuasion check.",
      },
    ],
    speed: 9,
  },
  {
    name: "Espion",
    category: "Engineered",
    description:
      "Espions are engineered humans designed for espionage, infiltration, and covert operations.",
    abilityBonuses: { dexterity: 2, intelligence: 1 },
    senses: ["Darkvision"],
    traits: [
      {
        name: "Forgettable Face",
        description:
          "You have advantage on Deception checks to disguise yourself or blend into crowds.",
      },
      {
        name: "Silent Movement",
        description:
          "You have advantage on Stealth checks when moving at half speed or slower.",
      },
    ],
    speed: 9,
  },
  {
    name: "Eucypher",
    category: "Engineered",
    description:
      "Eucyphers are engineered humans with enhanced cognitive abilities, designed for data processing and analysis.",
    abilityBonuses: { intelligence: 2, constitution: 1 },
    senses: ["Microvision"],
    traits: [
      {
        name: "Eidetic Memory",
        description:
          "You can accurately recall anything you have seen or heard within the past 30 days.",
      },
      {
        name: "Data Processing",
        description:
          "You have advantage on Intelligence checks related to analyzing data or patterns.",
      },
    ],
    speed: 9,
  },
  {
    name: "Feral",
    category: "Engineered",
    description:
      "Ferals are engineered humans with animalistic traits, designed for survival in hostile environments.",
    abilityBonuses: { strength: 1, dexterity: 1, constitution: 1 },
    senses: ["Darkvision", "Acute Olfaction"],
    traits: [
      {
        name: "Natural Weapons",
        description:
          "You have retractable claws that deal 1d4 slashing damage as a melee weapon attack.",
      },
      {
        name: "Primal Instinct",
        description:
          "You have advantage on Wisdom (Perception) checks that rely on smell.",
      },
    ],
    speed: 10,
  },
  {
    name: "Leviathan",
    category: "Engineered",
    description:
      "Leviathans are engineered humans designed for aquatic environments, with enhanced swimming capabilities and water-breathing adaptations.",
    abilityBonuses: { strength: 2, constitution: 1 },
    senses: ["Darkvision"],
    traits: [
      {
        name: "Amphibious",
        description: "You can breathe both air and water.",
      },
      {
        name: "Powerful Swimmer",
        description:
          "You have a swimming speed equal to your walking speed, and you have advantage on Athletics checks related to swimming.",
      },
    ],
    speed: 9,
  },
  {
    name: "OsaLaska",
    category: "Engineered",
    description:
      "OsaLaskas are engineered humans with bear-like traits, designed for strength, endurance, and cold-weather survival.",
    abilityBonuses: { strength: 2, constitution: 1 },
    senses: ["Acute Olfaction"],
    traits: [
      {
        name: "Thick Hide",
        description:
          "You gain 1 point of natural Damage Reduction.",
      },
      {
        name: "Cold Resistance",
        description:
          "You have resistance to cold damage and advantage on saving throws against extreme cold.",
      },
    ],
    speed: 9,
  },
  {
    name: "Sherlock",
    category: "Engineered",
    description:
      "Sherlocks are engineered humans designed for enhanced deductive reasoning and observation.",
    abilityBonuses: { intelligence: 2, wisdom: 1 },
    senses: ["Microvision"],
    traits: [
      {
        name: "Deductive Reasoning",
        description:
          "You have advantage on Investigation checks and can use Intelligence instead of Wisdom for Perception checks.",
      },
      {
        name: "Keen Observer",
        description:
          "Your passive Perception and passive Investigation scores each increase by 5.",
      },
    ],
    speed: 9,
  },
  {
    name: "Spartan – Infantry",
    category: "Engineered",
    description:
      "Spartan Infantry are engineered soldiers designed for ground combat, with enhanced physical prowess and combat instincts.",
    abilityBonuses: { strength: 2, constitution: 1 },
    senses: [],
    traits: [
      {
        name: "Combat Training",
        description:
          "You are proficient with medium armor and two martial weapon groups of your choice.",
      },
      {
        name: "Soldier's Endurance",
        description:
          "Once per long rest, you can reroll a failed saving throw against exhaustion.",
      },
    ],
    speed: 9,
  },
  {
    name: "Spartan – Naiad",
    category: "Engineered",
    description:
      "Spartan Naiads are engineered soldiers designed for naval and aquatic combat operations.",
    abilityBonuses: { dexterity: 2, constitution: 1 },
    senses: ["Darkvision"],
    traits: [
      {
        name: "Amphibious",
        description: "You can breathe both air and water.",
      },
      {
        name: "Naval Training",
        description:
          "You are proficient with medium armor and have a swimming speed equal to your walking speed.",
      },
    ],
    speed: 9,
  },
  {
    name: "Spartan – Wraith",
    category: "Engineered",
    description:
      "Spartan Wraiths are engineered soldiers designed for stealth operations and covert warfare.",
    abilityBonuses: { dexterity: 2, wisdom: 1 },
    senses: ["Darkvision"],
    traits: [
      {
        name: "Shadow Training",
        description:
          "You are proficient in Stealth and have advantage on Stealth checks in dim light or darkness.",
      },
      {
        name: "Silent Killer",
        description:
          "Once per short rest, you can add 1d6 to the damage of an attack made while hidden.",
      },
    ],
    speed: 9,
  },
  {
    name: "Titan",
    category: "Engineered",
    description:
      "Titans are engineered humans of massive stature, designed for raw physical power and intimidation.",
    abilityBonuses: { strength: 2, constitution: 1 },
    senses: [],
    traits: [
      {
        name: "Powerful Build",
        description:
          "You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift.",
      },
      {
        name: "Imposing Stature",
        description:
          "You have advantage on Intimidation checks against creatures smaller than you.",
      },
    ],
    speed: 9,
  },
  {
    name: "Traceur",
    category: "Engineered",
    description:
      "Traceurs are engineered humans designed for parkour and urban mobility, with enhanced agility and reflexes.",
    abilityBonuses: { dexterity: 2, strength: 1 },
    senses: [],
    traits: [
      {
        name: "Free Runner",
        description:
          "Climbing doesn't cost you extra movement, and you have advantage on Acrobatics checks.",
      },
      {
        name: "Cat's Grace",
        description:
          "You take half damage from falls of 6 meters or less and can land on your feet.",
      },
    ],
    speed: 12,
  },
  {
    name: "Mutt",
    category: "Mutt",
    description:
      "Mutts are individuals with mixed or uncertain genetic heritage, combining traits from multiple genome lines. They are unpredictable and diverse, representing the majority of the population.",
    abilityBonuses: { strength: 1, dexterity: 1, constitution: 1, intelligence: 1, wisdom: 1, charisma: 1 },
    senses: [],
    traits: [
      {
        name: "Versatile Heritage",
        description:
          "You gain proficiency in one skill of your choice and one language of your choice.",
      },
      {
        name: "Adaptive",
        description:
          "Once per long rest, you can gain advantage on one ability check of your choice.",
      },
    ],
    speed: 9,
  },
  {
    name: "Optimized",
    category: "Optimized",
    description:
      "Optimized humans have undergone subtle genetic enhancements to maximize their natural potential across all areas, without the dramatic specializations of Engineered genomes.",
    abilityBonuses: { strength: 1, dexterity: 1, constitution: 1 },
    senses: [],
    traits: [
      {
        name: "Peak Physiology",
        description:
          "Your body has been fine-tuned for peak performance. You have advantage on saving throws against disease.",
      },
      {
        name: "Optimized Metabolism",
        description:
          "You require only 4 hours of sleep and gain the full benefit of a long rest in 6 hours.",
      },
    ],
    speed: 9,
  },
  {
    name: "Transhuman",
    category: "Transhuman",
    description:
      "Transhumans have embraced cybernetic and biological augmentation, blurring the line between human and machine. They can support more upgrades than most.",
    abilityBonuses: { constitution: 2, intelligence: 1 },
    senses: [],
    traits: [
      {
        name: "Enhanced Upgrade Capacity",
        description:
          "Your maximum number of upgrades (cybernetics and gene mods) is increased by 2.",
      },
      {
        name: "Machine Integration",
        description:
          "You have advantage on saving throws against effects that specifically target organic creatures.",
      },
    ],
    speed: 9,
  },
  {
    name: "Unmodified",
    category: "Unmodified",
    description:
      "Unmodified humans have no genetic engineering or significant augmentation. They represent baseline humanity, relying on natural talent and determination.",
    abilityBonuses: {},
    senses: [],
    traits: [
      {
        name: "Pure Grit",
        description:
          "Your unaugmented willpower gives you advantage on saving throws against being frightened or charmed.",
      },
      {
        name: "Natural Talent",
        description:
          "You gain proficiency in two skills of your choice and one feat of your choice at 1st level.",
      },
      {
        name: "Determined",
        description:
          "When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. You can't use this feature again until you finish a long rest.",
      },
    ],
    speed: 9,
  },
];

export async function seedRulebookData() {
  console.log("Seeding rulebook data...");

  await db
    .insert(rulebookClassesTable)
    .values(classes)
    .onConflictDoNothing({ target: rulebookClassesTable.name });

  await db
    .insert(rulebookBackgroundsTable)
    .values(backgrounds)
    .onConflictDoNothing({ target: rulebookBackgroundsTable.name });

  await db
    .insert(rulebookGenomesTable)
    .values(genomes)
    .onConflictDoNothing({ target: rulebookGenomesTable.name });

  await db
    .insert(rulebookCadresTable)
    .values(cadres)
    .onConflictDoNothing({ target: rulebookCadresTable.name });

  console.log("Rulebook data seeded successfully.");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedRulebookData()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Failed to seed rulebook data:", err);
      process.exit(1);
    });
}
