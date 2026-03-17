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

