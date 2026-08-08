export interface ContactInfo {
  linkedin: string
  github: string
}

export interface SkillGroup {
  label: string
  items: string[]
}

export interface ProjectLink {
  label: string
  url: string
  type: 'video' | 'site'
}

export interface Role {
  title: string
  org: string
  location: string
  link?: string
  start: string
  end: string
  bullets: string[]
  tags: string[]
  projects?: ProjectLink[]
}

export const contact: ContactInfo = {
  linkedin: 'https://www.linkedin.com/in/kristin-clark-719b0b143',
  github: 'https://github.com/kclark042',
}

export const summary =
  'Software engineer with 5+ years of experience designing and implementing scalable web applications and data-driven solutions. Proficient in React, Python, TypeScript, and GraphQL, with recent experience building AI-assisted tools and interactive data visualizations. Enthusiastic about turning complex, hard-to-see systems into interfaces people can actually reason about.'

export const skillGroups: SkillGroup[] = [
  { label: 'Frontend', items: ['React', 'HTML', 'CSS', 'Tailwind'] },
  { label: 'Backend & Databases', items: ['PostgreSQL', 'FastAPI', 'GraphQL', 'Node.js'] },
  { label: 'Languages', items: ['Python', 'TypeScript', 'JavaScript'] },
  { label: 'Tools', items: ['Git', 'Docker', 'LangChain', 'AWS', 'Figma', 'Testing'] },
  {
    label: 'Practices',
    items: ['Accessibility', 'CI/CD', 'Feature Flags', 'Access Control', 'Data Privacy'],
  },
]

export const roles: Role[] = [
  {
    title: 'Software Engineer',
    org: 'Recursion',
    link: "https://www.recursion.com/",
    location: 'Salt Lake City, UT',
    start: 'Jan 2022',
    end: 'Jun 2025',
    tags: ['React', 'TypeScript', 'Python', 'Pandas', 'FastAPI', 'GraphQL', 'Redis', 'LangChain', "AWS"],
    bullets: [
      'Built a visualization of the embedding space of biological foundation models (React/TypeScript frontend, Python/FastAPI data integration from the datalake), cutting hit-to-lead time for scientists running experiments.',
      'Shipped partnership-specific data views behind feature flags, preserving strict access control across partner boundaries.',
      'Used LLMs to streamline drug-discovery workflows over proprietary and partner datasets.',
      'Built a thumbs up/down + comment feedback mechanism (GraphQL, React) that improved tracking and quality of AI responses.',
    ],
    projects: [
      {
        label: "Recursion's Mapping & Navigating Demonstration",
        url: 'https://www.youtube.com/watch?v=tKYmBhUOP6k',
        type: 'video',
      },
      { label: 'LOWE | Recursion', url: 'https://www.recursion.com/lowe', type: 'site' },
    ],
  },
  {
    title: 'Software Engineer',
    org: 'Pluralsight',
    link: "https://www.pluralsight.com/",
    location: 'Draper, UT',
    start: 'Jan 2018',
    end: 'Dec 2021',
    tags: ['React', 'TypeScript', 'PostgreSQL', 'RabbitMQ', 'Accessibility', 'TDD', 'Directed Discovery'],
    bullets: [
      'Developed and tested features for an online learning platform used by working engineers worldwide.',
      'Built content-authoring tooling, including an interactive Markdown editor with a review/feedback system.',
      'Implemented responsive designs for consistent experiences across mobile and desktop.',
      'Advocated for WCAG accessibility compliance across shared UI components.',
    ],
    projects: [
      {
        label: 'Find answers faster with searchable guides: Pluralsight Guides',
        url: 'https://www.youtube.com/watch?v=-Fzs-F5Ht5s&t=2s',
        type: 'video',
      },
    ],
  },
  {
    title: 'Student Employee',
    org: 'Space Dynamics Laboratory',
    link: "https://www.sdl.usu.edu/",
    location: 'Logan, UT',
    start: 'May 2016',
    end: 'Oct 2017',
    tags: ['React', 'Redux', 'HTML', 'CSS', 'Express'],
    bullets: [
      'Collaborated with fellow students to build an interactive application tracking telemetry from small satellites.',
    ],
  },
  {
    title: "Computer Science Tutor",
    org: "Utah State University",
    location: "Logan, UT",
    start: "Jan 2015",
    end: "Dec 2015",
    tags: ['C++', 'Java', 'Data Structures', 'Mentoring'],
    bullets: ["Tutored students in data structures, algorithms, and object oriented programming", 'Broke down complex concepts like recursion and Big-O complexity into accessible explanations.',
      'Reviewed and debugged student code, building their independent troubleshooting skills.',
    ]
  },
  {
    title: "Summer Intern",
    org: "Intermountain Healthcare",
    location: "Salt Lake City, UT",
    start: "May 2015",
    end: "Aug 2015",
    tags: ['QA'],
    bullets: ['Tested a patient intake application used by physicians to enter and manage patient data, helping ensure accuracy and reliability in a clinical setting.', 'Reported and tracked defects, working with developers to verify fixes and prevent regressions.',
      'Documented testing procedures to support consistent QA coverage across future releases.',]
  }
]

export const education = {
  degree: 'B.S. Computer Science',
  school: 'Utah State University',
  location: 'Logan, UT',
  date: 'May 2017',
}
