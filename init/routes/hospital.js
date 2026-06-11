import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { db, JWT_SECRET } from '../server.js';

const router = express.Router();

// Middleware to verify hospital token
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

// Get all hospitals
router.get('/', async (req, res) => {
  try {
    const hospitals = await db.collection('hospitals').find({}, {
      projection: {
        name: 1,
        bloodUnits: 1,
        createdAt: 1,
        updatedAt: 1
      }
    }).toArray();

    const transformedHospitals = hospitals.map(hospital => ({
      _id: hospital._id,
      name: hospital.name,
      bloodUnits: hospital.bloodUnits || {},
      createdAt: hospital.createdAt,
      updatedAt: hospital.updatedAt
    }));

    res.json(transformedHospitals);
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Hospital Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const hospital = await db.collection('hospitals').findOne({ email });

    if (!hospital) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, hospital.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { hospitalId: hospital._id, email: hospital.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      hospitalId: hospital._id,
      name: hospital.name,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get hospital inventory
router.get('/inventory', verifyHospitalToken, async (req, res) => {
  try {
    const hospital = await db.collection('hospitals').findOne(
      { _id: new ObjectId(req.hospitalId) },
      { projection: { bloodUnits: 1 } }
    );

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // Format blood inventory data
    const inventory = [
      { type: 'A+', units: hospital.bloodUnits?.['A+'] || 0 },
      { type: 'A-', units: hospital.bloodUnits?.['A-'] || 0 },
      { type: 'B+', units: hospital.bloodUnits?.['B+'] || 0 },
      { type: 'B-', units: hospital.bloodUnits?.['B-'] || 0 },
      { type: 'AB+', units: hospital.bloodUnits?.['AB+'] || 0 },
      { type: 'AB-', units: hospital.bloodUnits?.['AB-'] || 0 },
      { type: 'O+', units: hospital.bloodUnits?.['O+'] || 0 },
      { type: 'O-', units: hospital.bloodUnits?.['O-'] || 0 },
    ];

    res.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending donations
router.get('/donations/pending', verifyHospitalToken, async (req, res) => {
  try {
    const donations = await db.collection('donationRequests')
      .find({ 
        hospitalId: new ObjectId(req.hospitalId),
        status: 'pending'
      })
      .toArray();

    res.json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate OTP for donation
router.post('/:hospitalId/generate-otp/:requestId', verifyHospitalToken, async (req, res) => {
  try {
    // Verify that the hospital ID in the token matches the request
    if (req.hospitalId !== req.params.hospitalId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    const result = await db.collection('donationRequests').updateOne(
      { 
        _id: new ObjectId(req.params.requestId),
        hospitalId: new ObjectId(req.params.hospitalId)
      },
      { 
        $set: { 
          otp,
          otpGeneratedAt: new Date(),
          status: 'otp_generated'
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Donation request not found' });
    }

    res.json({ success: true, otp });
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify OTP and complete donation
router.post('/:hospitalId/verify-otp/:requestId', verifyHospitalToken, async (req, res) => {
  try {
    // Ensure the hospital updating the resource matches the authenticated token
    if (req.hospitalId !== req.params.hospitalId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const { otp } = req.body;
    const donation = await db.collection('donationRequests').findOne({
      _id: new ObjectId(req.params.requestId),
      hospitalId: new ObjectId(req.params.hospitalId),
      otp,
      status: 'otp_generated'
    });

    if (!donation) {
      return res.status(400).json({ error: 'Invalid OTP or request' });
    }

    // Check if OTP is expired (15 minutes validity)
    const otpAge = new Date() - new Date(donation.otpGeneratedAt);
    if (otpAge > 15 * 60 * 1000) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    // Complete the donation
    await db.collection('donationRequests').updateOne(
      { _id: donation._id },
      { 
        $set: { 
          status: 'completed',
          completedAt: new Date()
        }
      }
    );

    // Update hospital blood units
    await db.collection('hospitals').updateOne(
      { _id: new ObjectId(req.params.hospitalId) },
      { 
        $inc: { 
          [`bloodUnits.${donation.bloodType}`]: donation.units 
        }
      }
    );

    // Update user reward points
    try {
      if (donation.userId) {
        await db.collection('users').updateOne(
          { _id: new ObjectId(donation.userId) },
          { $inc: { rewardPoints: 15 * donation.units } }
        );
      }
    } catch (err) {
      console.warn("Could not update user points. Legacy userId format?", err);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error verifying donation:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get donation history
router.get('/donations/history', verifyHospitalToken, async (req, res) => {
  try {
    const history = await db.collection('donationRequests')
      .find({ 
        hospitalId: new ObjectId(req.hospitalId),
        status: { $in: ['completed', 'rejected'] }
      })
      .sort({ completedAt: -1 })
      .limit(50)
      .toArray();

    res.json(history);
  } catch (error) {
    console.error('Error fetching donation history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Additional hospital-specific routes can go here
// These routes will be prefixed with /api/hospitals

// Example: Get hospital statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await db.collection('hospitals').aggregate([
      {
        $group: {
          _id: null,
          totalHospitals: { $sum: 1 },
          totalBloodUnits: {
            $sum: {
              $sum: [
                { $ifNull: ['$bloodUnits.A+', 0] },
                { $ifNull: ['$bloodUnits.A-', 0] },
                { $ifNull: ['$bloodUnits.B+', 0] },
                { $ifNull: ['$bloodUnits.B-', 0] },
                { $ifNull: ['$bloodUnits.AB+', 0] },
                { $ifNull: ['$bloodUnits.AB-', 0] },
                { $ifNull: ['$bloodUnits.O+', 0] },
                { $ifNull: ['$bloodUnits.O-', 0] }
              ]
            }
          }
        }
      }
    ]).toArray();

    res.json(stats[0] || { totalHospitals: 0, totalBloodUnits: 0 });
  } catch (error) {
    console.error("Error fetching hospital stats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router; 