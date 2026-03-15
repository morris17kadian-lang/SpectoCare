import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '..', 'data.json');

const defaultData = () => ({
  users: [],
  children: [],
  routines: [],
  behaviorLogs: [],
  journalEntries: [],
  posts: [],
  comments: [],
  facilities: [],
});

let data = defaultData();

function load() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    data = { ...defaultData(), ...JSON.parse(raw) };
  } catch {
    data = defaultData();
  }
}

function save() {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Store save error:', err.message);
  }
}

export function getStore() {
  if (data.users.length === 0 && data.facilities.length === 0) {
    load();
    if (data.facilities.length === 0) seedFacilities();
  }
  return data;
}

export function persist() {
  save();
}

function seedFacilities() {
  data.facilities = [
    { id: 'fac-1', name: 'Sunrise Autism & Development Center', type: 'Autism Center', address: '123 Care Lane', city: 'Springfield', phone: '+1 (555) 100-2000', email: 'info@sunrise-autism.demo', website: 'https://example.com/sunrise', description: 'Comprehensive support for children with autism.', isVerified: true },
    { id: 'fac-2', name: 'Clear Speech Therapy Clinic', type: 'Speech Therapist', address: '456 Language Ave', city: 'Springfield', phone: '+1 (555) 200-3000', email: 'hello@clearspeech.demo', description: 'Pediatric speech and language therapy.', isVerified: true },
    { id: 'fac-3', name: 'Pediatric Minds Psychology', type: 'Psychologist', address: '789 Wellness Blvd', city: 'Riverside', phone: '+1 (555) 300-4000', website: 'https://example.com/pedminds', description: 'Child psychology and behavioral interventions.', isVerified: false },
    { id: 'fac-4', name: 'Hands-On Occupational Therapy', type: 'Occupational Therapist', address: '321 Motor St', city: 'Springfield', phone: '+1 (555) 400-5000', description: 'Sensory integration and motor skills.', isVerified: true },
  ];
  save();
}
