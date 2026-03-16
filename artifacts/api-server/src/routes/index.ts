import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import charactersRouter from "./characters";
import rulebookRouter from "./rulebook";
import usersRouter from "./users";
import dicePrefsRouter from "./dicePrefs";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(charactersRouter);
router.use(rulebookRouter);
router.use(usersRouter);
router.use(dicePrefsRouter);
router.use(storageRouter);

export default router;
