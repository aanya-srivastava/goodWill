import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

// ─── Hospital Queries ────────────────────────────────────────────────────────

export const getAllHospitals = async (db) => {
  const hospitals = await db.collection('hospitals').find({}, {
    projection: {
      name: 1,
      bloodUnits: 1,
      createdAt: 1,
      updatedAt: 1
    }
  }).toArray();

  return hospitals.map(hospital => ({
    _id: hospital._id,
    name: hospital.name,
    bloodUnits: hospital.bloodUnits || {},
    createdAt: hospital.createdAt,
    updatedAt: hospital.updatedAt
  }));
};

export const getHospitalInventory = async (db, hospitalId) => {
  const hospital = await db.collection('hospitals').findOne(
    { _id: new ObjectId(hospitalId) },
    { projection: { bloodUnits: 1 } }
  );

  if (!hospital) return null;

  return [
    { type: 'A+',  units: hospital.bloodUnits?.['A+']  || 0 },
    { type: 'A-',  units: hospital.bloodUnits?.['A-']  || 0 },
    { type: 'B+',  units: hospital.bloodUnits?.['B+']  || 0 },
    { type: 'B-',  units: hospital.bloodUnits?.['B-']  || 0 },
    { type: 'AB+', units: hospital.bloodUnits?.['AB+'] || 0 },
    { type: 'AB-', units: hospital.bloodUnits?.['AB-'] || 0 },
    { type: 'O+',  units: hospital.bloodUnits?.['O+']  || 0 },
    { type: 'O-',  units: hospital.bloodUnits?.['O-']  || 0 },
  ];
};

export const getHospitalStats = async (db) => {
  const stats = await db.collection('hospitals').aggregate([
    {
      $group: {
        _id: null,
        totalHospitals: { $sum: 1 },
        totalBloodUnits: {
          $sum: {
            $sum: [
              { $ifNull: ['$bloodUnits.A+',  0] },
              { $ifNull: ['$bloodUnits.A-',  0] },
              { $ifNull: ['$bloodUnits.B+',  0] },
              { $ifNull: ['$bloodUnits.B-',  0] },
              { $ifNull: ['$bloodUnits.AB+', 0] },
              { $ifNull: ['$bloodUnits.AB-', 0] },
              { $ifNull: ['$bloodUnits.O+',  0] },
              { $ifNull: ['$bloodUnits.O-',  0] }
            ]
          }
        }
      }
    }
  ]).toArray();

  return stats[0] || { totalHospitals: 0, totalBloodUnits: 0 };
};

// ─── Auth ────────────────────────────────────────────────────────────────────

export const loginHospital = async (db, JWT_SECRET, email, password) => {
  const hospital = await db.collection('hospitals').findOne({ email });

  if (!hospital) {
    return { error: 'Invalid credentials', status: 401 };
  }

  const isValidPassword = await bcrypt.compare(password, hospital.password);
  if (!isValidPassword) {
    return { error: 'Invalid credentials', status: 401 };
  }

  const token = jwt.sign(
    { hospitalId: hospital._id, email: hospital.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return {
    data: {
      token,
      hospitalId: hospital._id,
      name: hospital.name,
    }
  };
};

// ─── Donations ───────────────────────────────────────────────────────────────

export const getPendingDonations = async (db, hospitalId) => {
  return db.collection('donationRequests')
    .find({
      hospitalId: new ObjectId(hospitalId),
      status: 'pending'
    })
    .toArray();
};

export const getDonationHistory = async (db, hospitalId) => {
  return db.collection('donationRequests')
    .find({
      hospitalId: new ObjectId(hospitalId),
      status: { $in: ['completed', 'rejected'] }
    })
    .sort({ completedAt: -1 })
    .limit(50)
    .toArray();
};

export const generateDonationOtp = async (db, hospitalId, requestId) => {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  const result = await db.collection('donationRequests').updateOne(
    {
      _id: new ObjectId(requestId),
      hospitalId: new ObjectId(hospitalId)
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
    return { error: 'Donation request not found', status: 404 };
  }

  return { data: { success: true, otp } };
};

export const verifyDonationOtp = async (db, hospitalId, requestId, otp) => {
  const donation = await db.collection('donationRequests').findOne({
    _id: new ObjectId(requestId),
    hospitalId: new ObjectId(hospitalId),
    otp,
    status: 'otp_generated'
  });

  if (!donation) {
    return { error: 'Invalid OTP or request', status: 400 };
  }

  // Check if OTP is expired (15 minutes validity)
  const otpAge = new Date() - new Date(donation.otpGeneratedAt);
  if (otpAge > 15 * 60 * 1000) {
    return { error: 'OTP expired', status: 400 };
  }

  // Mark donation as completed
  await db.collection('donationRequests').updateOne(
    { _id: donation._id },
    {
      $set: {
        status: 'completed',
        completedAt: new Date()
      }
    }
  );

  // Update hospital blood inventory
  await db.collection('hospitals').updateOne(
    { _id: new ObjectId(hospitalId) },
    {
      $inc: {
        [`bloodUnits.${donation.bloodType}`]: donation.units
      }
    }
  );

  return { data: { success: true } };
};