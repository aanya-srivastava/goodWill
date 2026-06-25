import express from 'express';
import jwt from 'jsonwebtoken';
import { db, JWT_SECRET } from '../server.js';
import {
  getAllHospitals,
  getHospitalInventory,
  getHospitalStats,
  loginHospital,
  getPendingDonations,
  getDonationHistory,
  generateDonationOtp,
  verifyDonationOtp,
} from '../services/hospitalService.js';

const router = express.Router();

// ─── Middleware ──────────────────────────────────────────────────────────────

const verifyHospitalToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.hospitalId = decoded.hospitalId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ─── Routes ──────────────────────────────────────────────────────────────────

// Get all hospitals
router.get('/', async (req, res) => {
  try {
    const hospitals = await getAllHospitals(db);
    res.json(hospitals);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Hospital login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await loginHospital(db, JWT_SECRET, email, password);
    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }
    res.json(result.data);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get hospital blood inventory
router.get('/inventory', verifyHospitalToken, async (req, res) => {
  try {
    const inventory = await getHospitalInventory(db, req.hospitalId);
    if (!inventory) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    res.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending donations
router.get('/donations/pending', verifyHospitalToken, async (req, res) => {
  try {
    const donations = await getPendingDonations(db, req.hospitalId);
    res.json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get donation history
router.get('/donations/history', verifyHospitalToken, async (req, res) => {
  try {
    const history = await getDonationHistory(db, req.hospitalId);
    res.json(history);
  } catch (error) {
    console.error('Error fetching donation history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate OTP for a donation request
router.post('/:hospitalId/generate-otp/:requestId', verifyHospitalToken, async (req, res) => {
  try {
    if (req.hospitalId !== req.params.hospitalId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    const result = await generateDonationOtp(db, req.params.hospitalId, req.params.requestId);
    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }
    res.json(result.data);
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify OTP and complete donation
// NOTE: verifyHospitalToken added to match updated route — ensures only the
// authenticated hospital can verify its own donation requests
router.post('/:hospitalId/verify-otp/:requestId', verifyHospitalToken, async (req, res) => {
  try {
    if (req.hospitalId !== req.params.hospitalId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    const { otp } = req.body;
    const result = await verifyDonationOtp(db, req.params.hospitalId, req.params.requestId, otp);
    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }
    res.json(result.data);
  } catch (error) {
    console.error('Error verifying donation:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get hospital statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await getHospitalStats(db);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching hospital stats:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;