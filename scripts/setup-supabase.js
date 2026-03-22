require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const url = new URL(process.env.DATABASE_URL);
const pool = new Pool({
  host: url.hostname,
  port: parseInt(url.port),
  database: url.pathname.slice(1),
  user: url.username,
  password: decodeURIComponent(url.password),
  ssl: { rejectUnauthorized: false }
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🚀 Initialisation de la base de données Supabase...');

  try {
    await prisma.$connect();
    console.log('✅ Connecté à Supabase PostgreSQL');

    const existingAdmin = await prisma.admin.findUnique({
      where: { username: 'admin' },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await prisma.admin.create({
        data: {
          username: 'admin',
          password: hashedPassword,
          email: 'admin@example.com',
        },
      });
      console.log('✅ Compte admin créé');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      console.log('   ⚠️  Changez ce mot de passe après la première connexion!');
    } else {
      console.log('ℹ️  Un compte admin existe déjà');
    }

    console.log('✅ Initialisation terminée avec succès!');
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
