import { Skill } from 'contentlayer/generated';

import { Chip } from '@/components/chip/Chip';
import { getDocuments } from '@/content/getDocuments';

const TYPES = ['job', 'main', 'code', 'tool'];

export function Skills(props: {
  className?: string;
  isBorder?: boolean;
  isJobsShown?: boolean;
  locale: string;
  isPast?: boolean;
  isFuture?: boolean;
  slugs?: string[];
  types?: string[];
}) {
  let skills = getDocuments(['Skill'], props.locale) as Skill[];
  if (props.slugs) skills = skills.filter((s) => props.slugs?.includes(s.slug));
  skills = skills.sort((a, b) => {
    const aPriority = a.priority || 0;
    const bPriority = b.priority || 0;
    return bPriority - aPriority;
  });

  const types = props.types || TYPES;

  return (
    <ul className={[props.className, 'flex flex-wrap gap-2'].filter(Boolean).join(' ')}>
      {types.filter(Boolean).map((category) => {
        const skillsOfCategory = skills.filter((s) => s.category === category);
        const skillsShown = skillsOfCategory.filter((s) => {
          if (props.isJobsShown) return true;
          if (props.isPast) return s.past;
          if (props.isFuture) return s.future;
          return !s.past && !s.future;
        });
        return skillsShown.map((skill) => (
          <li key={skill.slug}>
            <Chip isBorder={props.isBorder} variant={category === 'job' ? 'primary' : 'basic'}>
              {skill.title}
            </Chip>
          </li>
        ));
      })}
    </ul>
  );
}
