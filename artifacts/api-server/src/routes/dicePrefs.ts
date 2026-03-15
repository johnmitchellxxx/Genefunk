import { Router } from "express";
import { db } from "@workspace/db";
import { dicePrefsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/api/dice-prefs", async (req, res) => {
  const userId = req.query.userId as string | undefined;
  if (!userId) return res.status(400).json({ error: "userId required" });
  try {
    const rows = await db.select().from(dicePrefsTable).where(eq(dicePrefsTable.userId, userId));
    if (rows.length === 0) return res.status(404).json(null);
    const row = rows[0];
    return res.json({ config: row.config, presets: row.presets });
  } catch (e) {
    return res.status(500).json({ error: "Failed to load dice prefs" });
  }
});

router.put("/api/dice-prefs", async (req, res) => {
  const { userId, config, presets } = req.body;
  if (!userId) return res.status(400).json({ error: "userId required" });
  try {
    await db
      .insert(dicePrefsTable)
      .values({ userId, config: config ?? {}, presets: presets ?? [] })
      .onConflictDoUpdate({
        target: dicePrefsTable.userId,
        set: { config: config ?? {}, presets: presets ?? [], updatedAt: new Date() },
      });
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: "Failed to save dice prefs" });
  }
});

export default router;
