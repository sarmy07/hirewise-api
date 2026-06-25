import dataSource from 'db/data-source';
import { Skill } from 'src/skill/entities/skill.entity';

const SKILLS = [
  'JavaScript',
  'TypeScript',
  'Node.js',
  'NestJS',
  'Express.js',
  'React',
  'Next.js',
  'Vue.js',
  'Angular',
  'Python',
  'Django',
  'Flask',
  'FastAPI',
  'Java',
  'Spring Boot',
  'Go',
  'Rust',
  'PHP',
  'Laravel',
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'GCP',
  'GraphQL',
  'REST APIs',
  'gRPC',
  'Git',
  'CI/CD',
  'Terraform',
  'HTML',
  'CSS',
  'Tailwind CSS',
  'System Design',
  'Microservices',
  'Agile/Scrum',
];

async function seed() {
  await dataSource.initialize();
  console.log('Data Source Initialized');

  const skillRepo = dataSource.getRepository(Skill);

  for (const name of SKILLS) {
    const exists = await skillRepo.findOne({
      where: {
        name,
      },
    });
    if (!exists) {
      await skillRepo.save(skillRepo.create({ name }));
      console.log(`Seeded: ${name}`);
    }
  }

  console.log('Skill seeding complete');
  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('Seeding failed', error);
  process.exit(1);
});
