import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "../config/database";
import {
  AboutModel,
  AchievementModel,
  BlogModel,
  EducationModel,
  ExperienceModel,
  HeroModel,
  ProjectModel,
  ResumeModel,
  SEOModel,
  SettingsModel,
  SkillModel,
  SocialModel,
  TestimonialModel,
  UserModel,
} from "../models";
import {
  ABOUT_SEED,
  ACHIEVEMENTS_SEED,
  BLOG_SEED,
  EDUCATION_SEED,
  EXPERIENCE_SEED,
  HERO_SEED,
  PROJECTS_SEED,
  SKILLS_SEED,
  SOCIAL_SEED,
  TESTIMONIALS_SEED,
} from "../constants/seed-data";
import { DEFAULT_SEO, DEFAULT_SETTINGS, PERSON } from "../constants/site";

async function run() {
  console.log("[seed] Connecting to database...");
  const conn = await connectDatabase();
  if (!conn) {
    console.error("[seed] Connection failed. Check MONGODB_URI.");
    process.exit(1);
  }

  console.log("[seed] Seeding singletons...");
  await HeroModel.findOneAndUpdate({}, HERO_SEED, { upsert: true, setDefaultsOnInsert: true });
  await AboutModel.findOneAndUpdate({}, ABOUT_SEED, { upsert: true, setDefaultsOnInsert: true });
  await SEOModel.findOneAndUpdate({}, DEFAULT_SEO, { upsert: true, setDefaultsOnInsert: true });
  await SettingsModel.findOneAndUpdate({}, DEFAULT_SETTINGS, {
    upsert: true,
    setDefaultsOnInsert: true,
  });

  console.log("[seed] Seeding collections...");
  const upsertMany = async <T extends object>(
    model: any,
    docs: T[],
    key: keyof T & string
  ) => {
    await Promise.all(
      docs.map((doc) =>
        model.findOneAndUpdate({ [key]: doc[key] }, doc, {
          upsert: true,
          setDefaultsOnInsert: true,
        })
      )
    );
    return docs.length;
  };

  await upsertMany(ProjectModel, PROJECTS_SEED, "slug");
  await upsertMany(ExperienceModel, EXPERIENCE_SEED, "company");
  await upsertMany(SkillModel, SKILLS_SEED, "name");
  await upsertMany(EducationModel, EDUCATION_SEED, "institution");
  await upsertMany(AchievementModel, ACHIEVEMENTS_SEED, "title");
  await upsertMany(TestimonialModel, TESTIMONIALS_SEED, "name");
  await upsertMany(BlogModel, BLOG_SEED, "slug");
  await upsertMany(SocialModel, SOCIAL_SEED, "platform");

  await ResumeModel.findOneAndUpdate(
    { isActive: true },
    {
      label: `${PERSON.name} — Resume`,
      fileUrl: "/resume/Ashish-Kumar-Resume.pdf",
      version: "2026.1",
      updatedOn: "2026-01-15",
      isActive: true,
    },
    { upsert: true, setDefaultsOnInsert: true }
  );

  console.log("[seed] Seeding completed successfully!");
  
  // Trigger cache revalidation on the frontend on port 3000 & 3001
  for (const port of [3000, 3001]) {
    try {
      console.log(`[revalidate] Attempting to notify frontend on port ${port}...`);
      const res = await fetch(`http://localhost:${port}/api/admin/revalidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      if (res.ok) {
        console.log(`[revalidate] Frontend on port ${port} cache cleared successfully.`);
      } else {
        console.warn(`[revalidate] Frontend on port ${port} returned status: ${res.statusText}`);
      }
    } catch (err) {
      console.log(`[revalidate] Could not notify frontend on port ${port} (likely not running).`);
    }
  }

  await mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
