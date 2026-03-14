import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  rulebookClassesTable,
  rulebookBackgroundsTable,
  rulebookGenomesTable,
  rulebookCadresTable,
} from "@workspace/db/schema";

const router: IRouter = Router();

router.get("/rulebook/classes", async (_req, res) => {
  try {
    const classes = await db.select().from(rulebookClassesTable);
    res.json(classes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/rulebook/backgrounds", async (_req, res) => {
  try {
    const backgrounds = await db.select().from(rulebookBackgroundsTable);
    res.json(backgrounds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/rulebook/genomes", async (_req, res) => {
  try {
    const genomes = await db.select().from(rulebookGenomesTable);
    res.json(genomes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/rulebook/cadres", async (_req, res) => {
  try {
    const cadres = await db.select().from(rulebookCadresTable);
    res.json(cadres);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
