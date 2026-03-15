import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getStore, persist } from '../store.js';
import { signToken, authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, displayName, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const store = getStore();
    if (store.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = {
      uid: uuidv4(),
      email: email.toLowerCase(),
      displayName: displayName || 'User',
      role: role || 'parent',
      passwordHash: hash,
      createdAt: new Date().toISOString(),
    };
    store.users.push(user);
    persist();
    const token = signToken({ uid: user.uid, email: user.email });
    res.status(201).json({
      user: { uid: user.uid, email: user.email, displayName: user.displayName, role: user.role, photoURL: null },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const store = getStore();
    const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = signToken({ uid: user.uid, email: user.email });
    res.json({
      user: { uid: user.uid, email: user.email, displayName: user.displayName, role: user.role, photoURL: null },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', authMiddleware, (req, res) => {
  const store = getStore();
  const user = store.users.find(u => u.uid === req.user.uid);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    photoURL: null,
  });
});

router.post('/logout', (_req, res) => {
  res.json({ ok: true });
});

export default router;
