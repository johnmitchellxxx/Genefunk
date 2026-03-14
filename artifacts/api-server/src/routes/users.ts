import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { charactersTable } from "@workspace/db/schema";
import { eq, isNull, sql } from "drizzle-orm";

const router: IRouter = Router();

const ADMIN_USER_ID = "john";

// List all known users (public — needed for login page dropdown before auth)
router.get("/users", async (_req, res) => {
  try {
    const users = await db
      .select({
        userId: charactersTable.userId,
        characterCount: sql<number>`cast(count(*) as int)`,
      })
      .from(charactersTable)
      .where(isNull(charactersTable.deletedAt))
      .groupBy(charactersTable.userId)
      .orderBy(charactersTable.userId);

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// List all known users including empty ones (admin: includes users whose chars are all deleted)
router.get("/users/all", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (req.user.id !== ADMIN_USER_ID) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  try {
    const users = await db
      .select({
        userId: charactersTable.userId,
        characterCount: sql<number>`cast(count(*) as int)`,
      })
      .from(charactersTable)
      .groupBy(charactersTable.userId)
      .orderBy(charactersTable.userId);

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: soft-delete all characters belonging to a user (effectively removes them)
router.delete("/users/:userId", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (req.user.id !== ADMIN_USER_ID) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const { userId } = req.params;

  if (userId === ADMIN_USER_ID) {
    res.status(400).json({ error: "Cannot delete the admin user" });
    return;
  }

  try {
    const deleted = await db
      .update(charactersTable)
      .set({ deletedAt: new Date() })
      .where(
        eq(charactersTable.userId, userId)
      )
      .returning({ id: charactersTable.id });

    res.json({ success: true, deleted: deleted.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
