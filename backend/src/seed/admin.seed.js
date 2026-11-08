require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const { uniqueSlug } = require('../utils/slugify');

const SEED_CATEGORIES = [
  { name: 'Entrepreneurship', description: 'Founder mindset, idea validation, and the first 90 days.' },
  { name: 'Product Development', description: 'No-code, AI tooling, and shipping an MVP that users want.' },
  { name: 'Marketing & Growth', description: 'AI-augmented content, positioning, and the launch playbook.' },
  { name: 'AI & No-Code', description: 'Practical guides for building without an engineering team.' },
  { name: 'Founder Stories', description: 'Interviews and case studies from Tactyqal Labs founders.' },
];

async function run() {
  try {
    const name = process.env.ADMIN_NAME || 'Tactyqal Admin';
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
      process.exit(1);
    }
    if (password.length < 8) {
      console.error('❌ ADMIN_PASSWORD must be at least 8 characters');
      process.exit(1);
    }

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`ℹ️  Admin already exists: ${email}`);
    } else {
      await User.create({ name, email, password, role: 'admin' });
      console.log(`✅ Admin created: ${email}`);
    }

    for (const cat of SEED_CATEGORIES) {
      const exists = await Category.findOne({ name: cat.name });
      if (!exists) {
        const slug = await uniqueSlug(Category, cat.name);
        await Category.create({ ...cat, slug });
        console.log(`✅ Category created: ${cat.name}`);
      }
    }

    console.log('\n🎉 Seed complete.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

run();