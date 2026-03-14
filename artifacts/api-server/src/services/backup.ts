import { schedule } from 'node-cron';
import { db } from '@workspace/db';
import { charactersTable } from '@workspace/db/schema';
import { isNull, like } from 'drizzle-orm';

function getDateLabel(): string {
  const now = new Date();
  return `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
}

export async function runWeeklyBackup(): Promise<{ created: number; skipped: number }> {
  const dateLabel = getDateLabel();
  const suffix = ` ${dateLabel}`;

  // Get all active (non-deleted) characters
  const activeCharacters = await db
    .select()
    .from(charactersTable)
    .where(isNull(charactersTable.deletedAt));

  let created = 0;
  let skipped = 0;

  for (const char of activeCharacters) {
    const backupName = `${char.name}${suffix}`;

    // Check if a backup with this exact name already exists (handles duplicate runs)
    const existing = await db
      .select({ id: charactersTable.id })
      .from(charactersTable)
      .where(like(charactersTable.name, backupName))
      .limit(1);

    if (existing.length > 0) {
      skipped++;
      continue;
    }

    // Omit auto-managed fields and insert as a soft-deleted snapshot
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = char;
    void _id; void _createdAt; void _updatedAt;

    await db.insert(charactersTable).values({
      ...rest,
      name: backupName,
      deletedAt: new Date(), // immediately in trash — visible only to admin
    });

    created++;
  }

  console.log(
    `[backup] Weekly snapshot complete — ${created} created, ${skipped} already existed (${dateLabel})`
  );
  return { created, skipped };
}

export function startBackupScheduler() {
  // Every Sunday at midnight (cron: minute hour day-of-month month day-of-week)
  schedule('0 0 * * 0', async () => {
    console.log('[backup] Starting weekly character snapshot...');
    try {
      await runWeeklyBackup();
    } catch (err) {
      console.error('[backup] Weekly backup failed:', err);
    }
  });

  console.log('[backup] Weekly character snapshot scheduler started (runs Sundays at midnight)');
}
