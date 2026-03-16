import { Router, type IRouter } from "express";
import { runWeeklyBackup } from "../services/backup";

const router: IRouter = Router();

// Manual backup trigger — useful for the GM to snapshot before a big session
// Simple secret-header guard so it's not publicly callable
router.post("/admin/backup", async (req, res) => {
  const secret = process.env["ADMIN_SECRET"];
  if (secret && req.headers["x-admin-secret"] !== secret) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  try {
    const result = await runWeeklyBackup();
    res.json({ ok: true, ...result });
  } catch (err) {
    console.error("[backup] Manual trigger failed:", err);
    res.status(500).json({ error: "Backup failed", detail: String(err) });
  }
});

export default router;
