const bcrypt = require('bcrypt');
const { signToken } = require('../middleware/auth');

// In-memory users
let nextId = 1;
const usersByEmail = new Map(); // email -> user
const usersById = new Map();    // id -> user
// user shape: { id, email, passwordHash, preferences: [] }

function ensureNonEmptyString(s) {
  return typeof s === 'string' && s.trim().length > 0;
}

async function registerUser(body) {
  const { email, password, preferences = [] } = body || {};
  if (!ensureNonEmptyString(email)) throw new Error('email required');
  if (!ensureNonEmptyString(password)) throw new Error('password required');

  const passwordHash = await bcrypt.hash(password, 10);
  const id = nextId++;

  const user = { id, email, passwordHash, preferences: Array.isArray(preferences) ? preferences : [] };
  usersByEmail.set(email, user);
  usersById.set(id, user);

  const token = signToken({ id, email });
  return { user: { id, email, preferences: user.preferences }, token };
}

async function loginUser(email, password) {
  if (!ensureNonEmptyString(email) || !ensureNonEmptyString(password)) {
    throw new Error('email and password required');
  }
  const user = usersByEmail.get(email);
  if (!user) throw new Error('User not found');

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error('Wrong password');

  const token = signToken({ id: user.id, email: user.email });
  return { user: { id: user.id, email: user.email, preferences: user.preferences }, token };
}

async function getPreferences(userId) {
  const user = usersById.get(userId);
  if (!user) throw new Error('Unauthorized');
  return user.preferences;
}

async function updatePreferences(userId, preferences) {
  if (!Array.isArray(preferences)) throw new Error('preferences must be an array');
  const user = usersById.get(userId);
  if (!user) throw new Error('Unauthorized');
  user.preferences = preferences;
  usersByEmail.set(user.email, user);
  usersById.set(user.id, user);
  return user.preferences;
}

module.exports = {
  registerUser,
  loginUser,
  getPreferences,
  updatePreferences,
};