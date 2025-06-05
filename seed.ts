import { seed } from "drizzle-seed";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./db/schema";

export const db = drizzle({
  connection: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});

async function main() {
  await seed(db, schema, { count: 50 }).refine((f) => ({
    postTable: {
      columns: {
        title: f.valuesFromArray({
          values: [
            "Exploring the Cosmos",
            "10 Tips for Better Sleep",
            "Why JavaScript is Awesome",
            "The Rise of Remote Work",
            "Mental Health in the Digital Age",
            "The Future of AI",
            "Cooking on a Budget",
            "Photography 101",
            "How to Start a Blog",
            "Top Travel Destinations 2025",
          ],
        }),
        content: f.valuesFromArray({
          values: [
            "This article explores how space exploration is shaping our understanding of the universe.",
            "Learn 10 scientifically proven tips to improve the quality of your sleep.",
            "JavaScript continues to dominate the web – here's why developers love it.",
            "Remote work is becoming the norm – discover its benefits and challenges.",
            "Social media, apps, and the internet are impacting mental health in profound ways.",
            "Artificial Intelligence is evolving rapidly – what does that mean for humanity?",
            "You don't need to spend a lot to eat well. Try these budget-friendly recipes.",
            "Getting into photography? Start with these beginner-friendly techniques and tips.",
            "Blogging is still relevant – learn how to set one up and find your niche.",
            "From Japan to Patagonia, these are the must-visit destinations for 2025.",
          ],
        }),
      },
    },
  }));
}

main();
