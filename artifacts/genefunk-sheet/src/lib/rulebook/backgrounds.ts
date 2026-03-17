export interface BackgroundData {
  name: string;
  description: string;
  skillProficiencies: string[];
  featureName: string;
  featureDescription: string;
  toolProficiencies?: string;
  languages?: string;
}


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

