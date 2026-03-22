const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function initDatabase() {
  try {
    console.log('✅ Connecté à PostgreSQL');

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

    await prisma.$disconnect();
    console.log('✅ Déconnecté de PostgreSQL');
  } catch (error) {
    console.error('❌ Erreur:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

initDatabase();
