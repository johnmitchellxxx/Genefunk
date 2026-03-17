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
