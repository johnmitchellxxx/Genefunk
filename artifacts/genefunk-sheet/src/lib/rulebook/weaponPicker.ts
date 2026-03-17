export interface WeaponRef {
  name: string;
  category: string;
  type: 'melee' | 'ranged';
  proficiency: 'simple' | 'martial';
  tier: 'generic' | 'premium';
  damage: string;
  damageType: string;
  range: string;
  properties: string;
  cost: string;
}

export const WEAPON_CATEGORIES = [
  'Simple Melee',
  'Martial Melee',
  'Premium Simple Melee',
  'Premium Martial Melee',
  'Simple Ranged',
  'Martial Ranged',
  'Premium Simple Ranged',
  'Premium Martial Ranged',
  'Explosives',
] as const;

export const GENEFUNK_WEAPONS: WeaponRef[] = [
  // ── Generic Simple Melee ──
  { name: 'Axe', category: 'Simple Melee', type: 'melee', proficiency: 'simple', tier: 'generic', damage: '1d6', damageType: 'Slashing', range: 'Melee', properties: 'Versatile (1d8)', cost: 'シ40' },
  { name: 'Brass Knuckles', category: 'Simple Melee', type: 'melee', proficiency: 'simple', tier: 'generic', damage: 'Unarmed+2', damageType: 'Bludgeoning', range: 'Melee', properties: 'Hard-knuckle', cost: 'シ20' },
  { name: 'Club (small)', category: 'Simple Melee', type: 'melee', proficiency: 'simple', tier: 'generic', damage: '1d4', damageType: 'Bludgeoning', range: 'Melee', properties: 'Light', cost: 'シ20' },
  { name: 'Club (large)', category: 'Simple Melee', type: 'melee', proficiency: 'simple', tier: 'generic', damage: '1d6', damageType: 'Bludgeoning', range: 'Melee', properties: 'Versatile (1d8)', cost: 'シ40' },
  { name: 'Chainsaw', category: 'Simple Melee', type: 'melee', proficiency: 'simple', tier: 'generic', damage: '2d10', damageType: 'Slashing', range: 'Melee', properties: 'Armor-piercing, two-handed, no Str bonus to dmg', cost: 'シ300' },
  { name: 'Knife', category: 'Simple Melee', type: 'melee', proficiency: 'simple', tier: 'generic', damage: '1d4', damageType: 'Piercing/Slashing', range: 'Melee (thrown 6/18m)', properties: 'Finesse, light, thrown, quick', cost: 'シ20' },
  { name: 'Machete', category: 'Simple Melee', type: 'melee', proficiency: 'simple', tier: 'generic', damage: '1d6', damageType: 'Slashing', range: 'Melee', properties: 'Light', cost: 'シ40' },
  { name: 'Nanoblade', category: 'Simple Melee', type: 'melee', proficiency: 'simple', tier: 'generic', damage: '1d6', damageType: 'Piercing/Slashing', range: 'Melee (thrown 6/18m)', properties: 'Armor-piercing, finesse, light, thrown, quick', cost: 'シ1,000' },
  { name: 'Sledge Hammer', category: 'Simple Melee', type: 'melee', proficiency: 'simple', tier: 'generic', damage: '1d10', damageType: 'Bludgeoning', range: 'Melee', properties: 'Two-handed', cost: 'シ50' },
  { name: 'Stun Baton', category: 'Simple Melee', type: 'melee', proficiency: 'simple', tier: 'generic', damage: '1', damageType: 'Bludgeoning', range: 'Melee', properties: 'Finesse, light, DC 10 Con save or stunned', cost: 'シ3,000' },

  // ── Generic Martial Melee ──
  { name: 'Nanosword (long)', category: 'Martial Melee', type: 'melee', proficiency: 'martial', tier: 'generic', damage: '2d6', damageType: 'Slashing', range: 'Melee', properties: 'Armor-piercing, versatile (2d8)', cost: 'シ8,000' },
  { name: 'Nanosword (short)', category: 'Martial Melee', type: 'melee', proficiency: 'martial', tier: 'generic', damage: '1d10', damageType: 'Piercing/Slashing', range: 'Melee', properties: 'Armor-piercing, finesse, light', cost: 'シ4,000' },
  { name: 'Sword (great)', category: 'Martial Melee', type: 'melee', proficiency: 'martial', tier: 'generic', damage: '2d6', damageType: 'Slashing', range: 'Melee', properties: 'Two-handed', cost: 'シ2,000' },
  { name: 'Sword (long)', category: 'Martial Melee', type: 'melee', proficiency: 'martial', tier: 'generic', damage: '1d8', damageType: 'Slashing', range: 'Melee', properties: 'Versatile (1d10)', cost: 'シ1,000' },
  { name: 'Sword (short)', category: 'Martial Melee', type: 'melee', proficiency: 'martial', tier: 'generic', damage: '1d6', damageType: 'Piercing/Slashing', range: 'Melee', properties: 'Finesse, light', cost: 'シ500' },

  // ── Premium Simple Melee ──
  { name: 'Jötunn Sap Gloves', category: 'Premium Simple Melee', type: 'melee', proficiency: 'simple', tier: 'premium', damage: 'Unarmed+2', damageType: 'Bludgeoning', range: 'Melee', properties: 'Hard-knuckle, DC 10 Con save or stunned', cost: 'シ25,000' },
  { name: 'Jötunn Shock Club', category: 'Premium Simple Melee', type: 'melee', proficiency: 'simple', tier: 'premium', damage: '1d6 + 1d6 E', damageType: 'Bludgeoning + Electrical', range: 'Melee', properties: 'Light', cost: 'シ15,000' },
  { name: 'Jötunn Storm Maul', category: 'Premium Simple Melee', type: 'melee', proficiency: 'simple', tier: 'premium', damage: '1d10 + 1d6 E', damageType: 'Bludgeoning + Electrical', range: 'Melee', properties: 'Versatile (2d6), DC 10 Con save or stunned', cost: 'シ60,000' },
  { name: 'Jötunn Stun Hammer', category: 'Premium Simple Melee', type: 'melee', proficiency: 'simple', tier: 'premium', damage: '1d10', damageType: 'Bludgeoning', range: 'Melee', properties: 'Versatile (2d6), DC 10 Con save or stunned', cost: 'シ20,000' },
  { name: 'Jötunn Thunder Gloves', category: 'Premium Simple Melee', type: 'melee', proficiency: 'simple', tier: 'premium', damage: 'Unarmed+2 + 1d6 E', damageType: 'Bludgeoning + Electrical', range: 'Melee', properties: 'Hard-knuckle, DC 10 Con save or stunned', cost: 'シ100,000' },
  { name: 'NanoEdge Kerambit', category: 'Premium Simple Melee', type: 'melee', proficiency: 'simple', tier: 'premium', damage: '1d8', damageType: 'Piercing/Slashing', range: 'Melee', properties: 'Armor-piercing, finesse, light, quick', cost: 'シ10,000' },

  // ── Premium Martial Melee ──
  { name: 'Ronin Long-blade', category: 'Premium Martial Melee', type: 'melee', proficiency: 'martial', tier: 'premium', damage: '2d8', damageType: 'Slashing', range: 'Melee', properties: 'Armor-piercing, versatile (2d10)', cost: 'シ30,000' },
  { name: 'Ronin Short-blade', category: 'Premium Martial Melee', type: 'melee', proficiency: 'martial', tier: 'premium', damage: '2d6', damageType: 'Piercing/Slashing', range: 'Melee', properties: 'Armor-piercing, finesse, light', cost: 'シ20,000' },
  { name: 'NanoEdge Temno', category: 'Premium Martial Melee', type: 'melee', proficiency: 'martial', tier: 'premium', damage: '2d10', damageType: 'Slashing', range: 'Melee', properties: 'Armor-piercing, versatile (2d12)', cost: 'シ100,000' },
  { name: 'NanoEdge Gladius', category: 'Premium Martial Melee', type: 'melee', proficiency: 'martial', tier: 'premium', damage: '2d8', damageType: 'Piercing/Slashing', range: 'Melee', properties: 'Armor-piercing, finesse, light', cost: 'シ60,000' },
  { name: 'Masamune Katana', category: 'Premium Martial Melee', type: 'melee', proficiency: 'martial', tier: 'premium', damage: '2d10', damageType: 'Slashing', range: 'Melee', properties: 'Armor-piercing, versatile (2d12), crit on 18-20', cost: 'シ300,000' },
  { name: 'Masamune Wakizashi', category: 'Premium Martial Melee', type: 'melee', proficiency: 'martial', tier: 'premium', damage: '2d8', damageType: 'Piercing/Slashing', range: 'Melee', properties: 'Armor-piercing, finesse, light, crit on 18-20', cost: 'シ200,000' },

  // ── Generic Simple Ranged (Firearms) ──
  { name: 'Handgun 9mm', category: 'Simple Ranged', type: 'ranged', proficiency: 'simple', tier: 'generic', damage: '2d6', damageType: 'Piercing', range: '12/36m', properties: 'Close, light, reload (15)', cost: 'シ600' },
  { name: 'Handgun 10mm', category: 'Simple Ranged', type: 'ranged', proficiency: 'simple', tier: 'generic', damage: '3d4', damageType: 'Piercing', range: '13/39m', properties: 'Close, light, reload (12)', cost: 'シ700' },
  { name: 'Handgun 11mm', category: 'Simple Ranged', type: 'ranged', proficiency: 'simple', tier: 'generic', damage: '2d8', damageType: 'Piercing', range: '14/42m', properties: 'Close, reload (10)', cost: 'シ900' },
  { name: 'Handgun 12mm', category: 'Simple Ranged', type: 'ranged', proficiency: 'simple', tier: 'generic', damage: '3d6', damageType: 'Piercing', range: '15/45m', properties: 'Close, reload (6)', cost: 'シ2,000' },
  { name: 'Hunting Rifle 5.56mm', category: 'Simple Ranged', type: 'ranged', proficiency: 'simple', tier: 'generic', damage: '2d8', damageType: 'Piercing', range: '100/300m', properties: 'Two-handed, reload (6)', cost: 'シ1,000' },
  { name: 'Hunting Rifle 7.62mm', category: 'Simple Ranged', type: 'ranged', proficiency: 'simple', tier: 'generic', damage: '2d10', damageType: 'Piercing', range: '120/360m', properties: 'Two-handed, reload (5)', cost: 'シ1,200' },
  { name: 'Hunting Rifle 9.5mm', category: 'Simple Ranged', type: 'ranged', proficiency: 'simple', tier: 'generic', damage: '2d12', damageType: 'Piercing', range: '150/450m', properties: 'Two-handed, reload (4)', cost: 'シ2,000' },
  { name: 'Shotgun 12 gauge', category: 'Simple Ranged', type: 'ranged', proficiency: 'simple', tier: 'generic', damage: '2d8', damageType: 'Piercing', range: '40/120m', properties: 'Shotgun, two-handed, reload (8)', cost: 'シ600' },
  { name: 'Shotgun 10 gauge', category: 'Simple Ranged', type: 'ranged', proficiency: 'simple', tier: 'generic', damage: '2d10', damageType: 'Piercing', range: '50/150m', properties: 'Shotgun, two-handed, reload (8)', cost: 'シ800' },

  // ── Generic Martial Ranged (Firearms) ──
  { name: 'Assault Rifle 5.56mm', category: 'Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'generic', damage: '2d8', damageType: 'Piercing', range: '150/450m', properties: 'Auto, two-handed, reload (40)', cost: 'シ2,000' },
  { name: 'Assault Rifle 7.62mm', category: 'Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'generic', damage: '2d10', damageType: 'Piercing', range: '180/540m', properties: 'Auto, two-handed, reload (30)', cost: 'シ2,000' },
  { name: 'CAW 12 gauge', category: 'Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'generic', damage: '2d8', damageType: 'Piercing', range: '40/80m', properties: 'Auto, shotgun, two-handed, reload (12)', cost: 'シ2,000' },
  { name: 'Machine Gun 7.62mm', category: 'Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'generic', damage: '2d12', damageType: 'Piercing', range: '300/900m', properties: 'Auto, two-handed, reload (200)', cost: 'シ5,000' },
  { name: 'Machine Gun 12.7mm', category: 'Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'generic', damage: '3d12', damageType: 'Piercing', range: '1km/2km', properties: 'Auto, mount, two-handed, reload (200)', cost: 'シ20,000' },
  { name: 'Sniper Rifle 5.56mm', category: 'Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'generic', damage: '2d8', damageType: 'Piercing', range: '250/750m', properties: 'Two-handed, reload (5)', cost: 'シ1,500' },
  { name: 'Sniper Rifle 7.62mm', category: 'Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'generic', damage: '2d10', damageType: 'Piercing', range: '300/900m', properties: 'Two-handed, reload (5)', cost: 'シ2,000' },
  { name: 'Sniper Rifle 12.7mm', category: 'Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'generic', damage: '3d12', damageType: 'Piercing', range: '1km/2km', properties: 'Mount, two-handed, reload (4)', cost: 'シ10,000' },
  { name: 'SMG 4.6mm', category: 'Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'generic', damage: '1d10', damageType: 'Piercing', range: '20/60m', properties: 'Auto, close, light, reload (50)', cost: 'シ1,200' },
  { name: 'SMG 5.7mm', category: 'Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'generic', damage: '1d12', damageType: 'Piercing', range: '40/120m', properties: 'Auto, close, reload (50)', cost: 'シ1,600' },
  { name: 'SMG 9mm', category: 'Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'generic', damage: '2d6', damageType: 'Piercing', range: '70/210m', properties: 'Auto, close, reload (40)', cost: 'シ2,000' },

  // ── Premium Simple Ranged ──
  { name: 'Ballista 12 gauge', category: 'Premium Simple Ranged', type: 'ranged', proficiency: 'simple', tier: 'premium', damage: '2d12', damageType: 'Piercing', range: '50/150m', properties: 'Shotgun, two-handed, reload (8)', cost: 'シ18,000' },
  { name: 'Black Widow 9mm', category: 'Premium Simple Ranged', type: 'ranged', proficiency: 'simple', tier: 'premium', damage: '2d6', damageType: 'Piercing', range: '12/36m', properties: 'Close, light, reload (15), silenced', cost: 'シ10,000' },
  { name: 'Drake Gas Gun', category: 'Premium Simple Ranged', type: 'ranged', proficiency: 'simple', tier: 'premium', damage: 'Special', damageType: 'Special (gas)', range: '12m', properties: 'Reload (4), special', cost: 'シ10,000' },
  { name: 'GI Python 12mm', category: 'Premium Simple Ranged', type: 'ranged', proficiency: 'simple', tier: 'premium', damage: '2d12', damageType: 'Piercing', range: '15/45m', properties: 'Close, reload (8)', cost: 'シ30,000' },
  { name: 'Urban Ranger 10mm', category: 'Premium Simple Ranged', type: 'ranged', proficiency: 'simple', tier: 'premium', damage: '2d8', damageType: 'Piercing', range: '13/39m', properties: 'Close, light, reload (13)', cost: 'シ18,000' },
  { name: 'ZQ Monkey King 11mm', category: 'Premium Simple Ranged', type: 'ranged', proficiency: 'simple', tier: 'premium', damage: '3d6', damageType: 'Piercing', range: '14/42m', properties: 'Close, reload (12)', cost: 'シ25,000' },

  // ── Premium Martial Ranged ──
  { name: 'Ballista 10 gauge', category: 'Premium Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'premium', damage: '4d6', damageType: 'Piercing', range: '50/150m', properties: 'Shotgun, two-handed, reload (8)', cost: 'シ60,000' },
  { name: 'Boss Killer 12.7mm', category: 'Premium Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'premium', damage: '4d10', damageType: 'Piercing', range: '1km/2km', properties: 'Mount, two-handed, reload (4)', cost: 'シ250,000' },
  { name: 'Bushwhacker 7.62mm', category: 'Premium Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'premium', damage: '2d12', damageType: 'Piercing', range: '120/360m', properties: 'Two-handed, reload (5)', cost: 'シ25,000' },
  { name: 'Bushwhacker Bola Gun', category: 'Premium Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'premium', damage: 'Special', damageType: 'Special', range: '20m', properties: 'Reload (1), special (restrain DC 15 Dex)', cost: 'シ10,000' },
  { name: 'CinderPro Flamethrower', category: 'Premium Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'premium', damage: '4d6', damageType: 'Heat', range: '9m line', properties: 'Two-handed, reload (3), special', cost: 'シ15,000' },
  { name: 'Cypher MK II 5.56mm', category: 'Premium Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'premium', damage: '2d12', damageType: 'Piercing', range: '250/750m', properties: 'Two-handed, reload (7), silenced', cost: 'シ25,000' },
  { name: 'Diablo 7.62mm', category: 'Premium Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'premium', damage: '4d6', damageType: 'Piercing', range: '300/900m', properties: 'Two-handed, reload (5)', cost: 'シ50,000' },
  { name: 'DragonBreath 12 gauge', category: 'Premium Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'premium', damage: '2d8 + 1d6 H', damageType: 'Piercing + Heat', range: '40/120m', properties: 'Shotgun, two-handed, reload (8)', cost: 'シ16,000' },
  { name: 'FS-3 Laser Cannon', category: 'Premium Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'premium', damage: '7d10', damageType: 'Heat', range: '1km/2km', properties: 'Mount, reload (10)', cost: 'シ200,000' },
  { name: 'GI Viper 4.6mm', category: 'Premium Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'premium', damage: '2d6', damageType: 'Piercing', range: '20/60m', properties: 'Auto, close, light, reload (50)', cost: 'シ25,000' },
  { name: 'M2 Maxim 12.7mm', category: 'Premium Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'premium', damage: '4d10', damageType: 'Piercing', range: '1km/2km', properties: 'Auto, mount, two-handed, reload (200)', cost: 'シ300,000' },
  { name: 'Manticore Bolter', category: 'Premium Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'premium', damage: '1d12 + 3d6 Po', damageType: 'Piercing + Poison', range: '12/24m', properties: 'Auto, reload (26)', cost: 'シ120,000' },
  { name: 'M2 Rocket Launcher', category: 'Premium Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'premium', damage: '7d10', damageType: 'Piercing', range: '50/100m', properties: 'Armor-piercing, two-handed, reload (1), special', cost: 'シ15,000' },
  { name: 'Nova Microwaver', category: 'Premium Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'premium', damage: 'Special', damageType: 'Special (microwave)', range: '20m cone', properties: 'Two-handed, reload (10), special', cost: 'シ25,000' },
  { name: 'Ravager 10 gauge', category: 'Premium Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'premium', damage: '2d12', damageType: 'Piercing', range: '40/80m', properties: 'Auto, shotgun, two-handed, reload (12)', cost: 'シ50,000' },
  { name: 'SK Grenade Launcher', category: 'Premium Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'premium', damage: 'Special', damageType: 'Special (grenade)', range: '40m', properties: 'Two-handed, reload (6), special', cost: 'シ3,000' },
  { name: 'Stingray Shock Rifle', category: 'Premium Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'premium', damage: '2d6 + 2d6 E', damageType: 'Piercing + Electrical', range: '15/30m', properties: '', cost: 'シ100,000' },
  { name: 'Tiamat 10 gauge', category: 'Premium Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'premium', damage: '2d10 + 1d6 H', damageType: 'Piercing + Heat', range: '50/150m', properties: 'Shotgun, two-handed, reload (8)', cost: 'シ50,000' },
  { name: 'XM Spitfire 5.56mm', category: 'Premium Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'premium', damage: '2d12', damageType: 'Piercing', range: '300/900m', properties: 'Auto, rapid-fire, two-handed, reload (200)', cost: 'シ100,000' },
  { name: 'ZQ Blitzer 7.62mm', category: 'Premium Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'premium', damage: '2d12', damageType: 'Piercing', range: '180/540m', properties: 'Auto, two-handed, reload (30)', cost: 'シ60,000' },
  { name: 'ZQ Timberwolf 9mm', category: 'Premium Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'premium', damage: '3d6', damageType: 'Piercing', range: '70/210m', properties: 'Auto, close, reload (40)', cost: 'シ50,000' },
  { name: 'ZQ Wolverine 5.56mm', category: 'Premium Martial Ranged', type: 'ranged', proficiency: 'martial', tier: 'premium', damage: '2d10', damageType: 'Piercing', range: '150/450m', properties: 'Auto, two-handed, reload (40)', cost: 'シ40,000' },

  // ── Explosives ──
  { name: 'Concussion Grenade', category: 'Explosives', type: 'ranged', proficiency: 'simple', tier: 'generic', damage: '4d6', damageType: 'Bludgeoning', range: '15m throw', properties: 'DC 15 Dex save, 3m radius, stun on fail', cost: 'シ500' },
  { name: 'EMP Grenade', category: 'Explosives', type: 'ranged', proficiency: 'simple', tier: 'generic', damage: 'Special', damageType: 'EMP', range: '15m throw', properties: 'DC 15 save, 3m radius, electronics shutdown', cost: 'シ2,000' },
  { name: 'Flashbang', category: 'Explosives', type: 'ranged', proficiency: 'simple', tier: 'generic', damage: 'Special', damageType: 'Special', range: '15m throw', properties: 'DC 15 Con save, 3m radius, blind+deaf+stun', cost: 'シ300' },
  { name: 'Fragmentation Grenade', category: 'Explosives', type: 'ranged', proficiency: 'simple', tier: 'generic', damage: '5d6', damageType: 'Piercing', range: '15m throw', properties: 'DC 15 Dex save, 6m radius', cost: 'シ400' },
  { name: 'Incendiary Grenade', category: 'Explosives', type: 'ranged', proficiency: 'simple', tier: 'generic', damage: '5d6', damageType: 'Heat', range: '15m throw', properties: 'DC 15 Dex save, 6m radius, 3 rounds', cost: 'シ600' },
  { name: 'Smoke Grenade', category: 'Explosives', type: 'ranged', proficiency: 'simple', tier: 'generic', damage: '—', damageType: '—', range: '15m throw', properties: 'Obscured area, 6m radius, 6 rounds', cost: 'シ100' },
  { name: 'Sticky Grenade', category: 'Explosives', type: 'ranged', proficiency: 'simple', tier: 'generic', damage: 'Special', damageType: 'Special', range: '15m throw', properties: 'DC 15 Str save, 3m radius, restrained', cost: 'シ800' },
];
