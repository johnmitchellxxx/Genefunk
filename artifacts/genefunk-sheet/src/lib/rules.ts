export function getModifier(score: number): number {
  if (!score) return 0;
  return Math.floor((score - 10) / 2);
}

export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function getProficiencyBonus(level: number): number {
  if (!level) return 2;
  return Math.ceil(level / 4) + 1;
}

export const ABILITIES = [
  { key: 'strength', label: 'STR' },
  { key: 'dexterity', label: 'DEX' },
  { key: 'constitution', label: 'CON' },
  { key: 'intelligence', label: 'INT' },
  { key: 'wisdom', label: 'WIS' },
  { key: 'charisma', label: 'CHA' }
] as const;

export const SKILLS = [
  { key: 'acrobatics', label: 'Acrobatics', ability: 'dexterity' },
  { key: 'athletics', label: 'Athletics', ability: 'strength' },
  { key: 'bureaucracy', label: 'Bureaucracy', ability: 'intelligence' },
  { key: 'computers', label: 'Computers', ability: 'intelligence' },
  { key: 'deception', label: 'Deception', ability: 'charisma' },
  { key: 'drive', label: 'Drive', ability: 'dexterity' },
  { key: 'insight', label: 'Insight', ability: 'wisdom' },
  { key: 'intimidation', label: 'Intimidation', ability: 'charisma' },
  { key: 'investigation', label: 'Investigation', ability: 'intelligence' },
  { key: 'lifeScience', label: 'Life Science', ability: 'intelligence' },
  { key: 'mechanics', label: 'Mechanics', ability: 'intelligence' },
  { key: 'perception', label: 'Perception', ability: 'wisdom' },
  { key: 'performance', label: 'Performance', ability: 'charisma' },
  { key: 'persuasion', label: 'Persuasion', ability: 'charisma' },
  { key: 'physicalScience', label: 'Physical Science', ability: 'intelligence' },
  { key: 'sleightOfHand', label: 'Sleight of Hand', ability: 'dexterity' },
  { key: 'socialScience', label: 'Social Science', ability: 'intelligence' },
  { key: 'stealth', label: 'Stealth', ability: 'dexterity' },
  { key: 'streetwise', label: 'Streetwise', ability: 'intelligence' },
  { key: 'survival', label: 'Survival', ability: 'wisdom' },
] as const;

export function getAttackBonus(
  weaponType: 'melee' | 'ranged',
  isFinesse: boolean,
  strength: number,
  dexterity: number,
  proficiencyBonus: number,
): number {
  const strMod = getModifier(strength);
  const dexMod = getModifier(dexterity);
  let abilityMod: number;
  if (isFinesse) {
    abilityMod = Math.max(strMod, dexMod);
  } else if (weaponType === 'ranged') {
    abilityMod = dexMod;
  } else {
    abilityMod = strMod;
  }
  return abilityMod + proficiencyBonus;
}

export const SENSES = [
  { key: 'acuteOlfaction', label: 'Acute Olfaction' },
  { key: 'darkvision', label: 'Darkvision' },
  { key: 'macrovision', label: 'Macrovision' },
  { key: 'microvision', label: 'Microvision' },
  { key: 'penetration', label: 'Penetration' },
  { key: 'spectrum', label: 'Spectrum' },
] as const;
