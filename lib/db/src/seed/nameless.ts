import { db } from "../index";
import { charactersTable } from "../schema/characters";

async function seedNameless() {
  const userId = "kevin";

  const existing = await db.select({ id: charactersTable.id }).from(charactersTable);
  console.log(`Existing characters: ${existing.length}`);

  const [character] = await db
    .insert(charactersTable)
    .values({
      userId,
      name: "Nameless",
      class: "Crook: Hitman",
      genome: "Unmodified",
      cadre: "The Reverent",
      background: "Outlaw",
      level: 5,
      strength: 11,
      dexterity: 19,
      constitution: 14,
      intelligence: 17,
      wisdom: 18,
      charisma: 16,
      maxHitPoints: 42,
      currentHitPoints: 42,
      temporaryHitPoints: 0,
      armorClass: 20,
      damageReduction: -2,
      speed: 30,
      initiative: 4,
      hitDice: "5d8",
      proficiencyBonusOverride: 3,
      mosaicScore: 633,
      currency: { satoshi: 633 },
      passivePerception: 18,
      savingThrowProficiencies: ["dexterity", "intelligence"],
      skillProficiencies: [
        "acrobatics",
        "stealth",
        "investigation",
        "mechanics",
        "streetwise",
        "perception",
        "intimidation",
      ],
      skillExpertise: ["stealth", "streetwise", "perception"],
      senses: {
        acuteOlfaction: false,
        darkvision: false,
        macrovision: false,
        microvision: false,
        penetration: false,
        spectrum: true,
      },
      attacks: [
        {
          id: "nameless-atk-1",
          name: "10mm Handgun",
          attackBonus: "+7",
          damage: "3d4",
          damageType: "",
          range: "",
          notes: null,
          weaponType: "martial_ranged",
          isFinesse: false,
        },
        {
          id: "nameless-atk-2",
          name: "Assault Rifle 5.56 (Silenced)",
          attackBonus: "+7",
          damage: "2d8",
          damageType: "",
          range: "",
          notes: "Silenced",
          weaponType: "martial_ranged",
          isFinesse: false,
        },
        {
          id: "nameless-atk-3",
          name: "Cypher MK II 5.56mm",
          attackBonus: "+7",
          damage: "2d12",
          damageType: "",
          range: "",
          notes: null,
          weaponType: "martial_ranged",
          isFinesse: false,
        },
      ],
      equipment: [
        { id: "eq-1",  name: "Durile Assault Suit",                   quantity: 1,  equipped: true  },
        { id: "eq-2",  name: "Spectrum Goggles",                      quantity: 1,  equipped: true  },
        { id: "eq-3",  name: "Polyguise",                             quantity: 1,  equipped: false },
        { id: "eq-4",  name: "Silencer",                              quantity: 2,  equipped: false },
        { id: "eq-5",  name: "Shark +2 CHA",                          quantity: 2,  equipped: false },
        { id: "eq-6",  name: "Hypospray Nanodoc",                     quantity: 10, equipped: false },
        { id: "eq-7",  name: "Perk",                                  quantity: 1,  equipped: false },
        { id: "eq-8",  name: "Nootro +2 Int, Wis, and Cha for 1 Hour", quantity: 1, equipped: false },
        { id: "eq-9",  name: "Lockpick",                              quantity: 5,  equipped: false },
        { id: "eq-10", name: "Jammer 30m",                            quantity: 1,  equipped: false },
      ],
      features: [
        { id: "feat-1", name: "Destiny's Chosen",    source: "Unmodified",    description: "" },
        { id: "feat-2", name: "Underworld Etiquette",source: "Outlaw",         description: "" },
        { id: "feat-3", name: "Shady Contact +1",    source: "Crook+Outlaw",  description: "" },
        { id: "feat-4", name: "Cunning Action",       source: "Crook",         description: "" },
        { id: "feat-5", name: "Sneak Attack",         source: "Crook",         description: "" },
        { id: "feat-6", name: "Assassinate",          source: "Hitman",        description: "" },
        { id: "feat-7", name: "Prey Dossier",         source: "Hitman",        description: "" },
      ],
    })
    .returning({ id: charactersTable.id, name: charactersTable.name, userId: charactersTable.userId });

  console.log(`Created character: ${character.name} (id=${character.id}) owned by userId="${character.userId}"`);
  console.log(`Kevin can log in as "Kevin" to edit this character.`);
  process.exit(0);
}

seedNameless().catch((err) => {
  console.error(err);
  process.exit(1);
});
