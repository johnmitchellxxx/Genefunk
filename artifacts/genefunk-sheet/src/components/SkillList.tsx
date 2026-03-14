import React from 'react';
import { SKILLS, getModifier, getProficiencyBonus } from '@/lib/rules';
import { useDice } from '@/hooks/use-dice';
import { formatModifier } from '@/lib/rules';
import { Check, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Character } from '@workspace/api-client-react';

interface SkillListProps {
  character: Character;
  onUpdate: (field: keyof Character, value: any) => void;
}

export function SkillList({ character, onUpdate }: SkillListProps) {
  const { rollDice } = useDice();
  const profBonus = getProficiencyBonus(character.level);

  const toggleProficiency = (skillKey: string, isExpertise: boolean = false) => {
    let newProfs = [...character.skillProficiencies];
    let newExperts = [...character.skillExpertise];

    if (isExpertise) {
      if (newExperts.includes(skillKey)) {
        newExperts = newExperts.filter(k => k !== skillKey); // Remove expertise
      } else {
        if (!newProfs.includes(skillKey)) newProfs.push(skillKey); // Must be proficient to have expertise
        newExperts.push(skillKey);
      }
    } else {
      if (newProfs.includes(skillKey)) {
        newProfs = newProfs.filter(k => k !== skillKey);
        newExperts = newExperts.filter(k => k !== skillKey); // Removing prof also removes exp
      } else {
        newProfs.push(skillKey);
      }
    }

    onUpdate('skillProficiencies', newProfs);
    onUpdate('skillExpertise', newExperts);
  };

  return (
    <div className="space-y-1.5 font-mono text-sm">
      {SKILLS.map(skill => {
        const isProficient = character.skillProficiencies.includes(skill.key);
        const isExpertise = character.skillExpertise.includes(skill.key);
        
        const statScore = character[skill.ability as keyof Character] as number;
        const statMod = getModifier(statScore);
        
        let totalMod = statMod;
        if (isExpertise) totalMod += (profBonus * 2);
        else if (isProficient) totalMod += profBonus;

        const abilityAbbr = skill.ability.substring(0, 3).toUpperCase();
        const skillParts = [
          { value: statMod, label: abilityAbbr },
          ...(isExpertise
            ? [{ value: profBonus * 2, label: 'Exp' }]
            : isProficient
            ? [{ value: profBonus, label: 'Prof' }]
            : []),
        ];
        const skillName = `${skill.label} (${abilityAbbr})`;

        return (
          <div key={skill.key} className="flex items-center group hover:bg-primary/5 p-1 -mx-1 rounded transition-colors">
            {/* Prof Check */}
            <div 
              className="w-5 h-5 flex items-center justify-center border border-border cursor-pointer mr-2 hover:border-primary transition-colors"
              onClick={() => toggleProficiency(skill.key)}
            >
              {isProficient && !isExpertise && <Check className="w-3 h-3 text-primary" />}
              {isExpertise && <CheckCircle2 className="w-4 h-4 text-secondary" />}
            </div>
            
            {/* Exp Check (Hidden unless hovered or has expertise) */}
            <div 
              className={cn(
                "w-4 h-4 flex items-center justify-center text-xs border border-border cursor-pointer mr-3 transition-colors",
                isExpertise ? "text-secondary border-secondary" : "text-transparent border-transparent group-hover:border-border"
              )}
              onClick={() => toggleProficiency(skill.key, true)}
              title="Toggle Expertise"
            >
              E
            </div>

            <div 
              className="w-8 font-bold text-right mr-3 cursor-pointer text-primary hover:text-secondary transition-colors"
              onClick={() => rollDice(skillName, totalMod, { parts: skillParts })}
            >
              {formatModifier(totalMod)}
            </div>

            <div className="flex-1 text-muted-foreground group-hover:text-foreground transition-colors cursor-pointer" onClick={() => rollDice(skillName, totalMod, { parts: skillParts })}>
              {skill.label} <span className="text-xs uppercase opacity-60 ml-1">({skill.ability.substring(0,3)})</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
