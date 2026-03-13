import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import {
  clearSession,
  getSessionId,
  createSession,
  SESSION_COOKIE,
  SESSION_TTL,
} from "../lib/auth";

const LoginBody = z.object({
  name: z.string().min(1).max(50),
});

const router: IRouter = Router();

function setSessionCookie(res: Response, sid: string) {
  res.cookie(SESSION_COOKIE, sid, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL,
  });
}

router.get("/auth/user", (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.json({
      isAuthenticated: true,
      user: {
        id: req.user.id,
        username: req.user.name,
        firstName: req.user.name,
        lastName: null,
        profileImage: null,
      },
    });
  } else {
    res.json({ isAuthenticated: false, user: null });
  }
});

router.post("/auth/login", async (req: Request, res: Response) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Name is required (max 50 characters)" });
    return;
  }

  const displayName = parsed.data.name.trim();
  const userId = displayName.toLowerCase().replace(/\s+/g, "_");

  const sid = await createSession({ user: { id: userId, name: displayName } });
  setSessionCookie(res, sid);
  res.json({ ok: true, user: { id: userId, name: displayName } });
});

router.post("/auth/logout", async (req: Request, res: Response) => {
  const sid = getSessionId(req);
  await clearSession(res, sid);
  res.json({ ok: true });
});

export default router;
