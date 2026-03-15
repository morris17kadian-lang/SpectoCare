import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getStore, persist } from '../store.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
  const store = getStore();
  const childId = req.query.childId;
  if (!childId) return res.status(400).json({ error: 'childId required' });
  const list = store.journalEntries.filter(j => j.childId === childId && j.parentId === req.user.uid);
  res.json(list.map(normalize));
});

router.post('/', (req, res) => {
  const store = getStore();
  const { childId, date, note, mood } = req.body;
  if (!childId || !date || !note) return res.status(400).json({ error: 'childId, date, note required' });
  const entry = {
    id: uuidv4(),
    childId,
    parentId: req.user.uid,
    date,
    note,
    mood: mood || undefined,
    createdAt: new Date(),
  };
  store.journalEntries.push(entry);
  persist();
  res.status(201).json({ id: entry.id });
});

router.delete('/:id', (req, res) => {
  const store = getStore();
  const idx = store.journalEntries.findIndex(j => j.id === req.params.id && j.parentId === req.user.uid);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  store.journalEntries.splice(idx, 1);
  persist();
  res.json({ ok: true });
});

function normalize(j) {
  return { ...j, createdAt: j.createdAt instanceof Date ? j.createdAt : new Date(j.createdAt) };
}

export default router;
