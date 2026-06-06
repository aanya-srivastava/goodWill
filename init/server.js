import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import hospitalRoutes from './routes/hospital.js';

const app = express();
const PORT = 8081;
export const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

// Configure CORS with specific options
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://172.22.48.1:8080', 'http://localhost:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// MongoDB Connection
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

export let db;

async function connectToMongo() {
  try {
    await client.connect();
    db = client.db("bloodbank");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

// Create donation request (public route)
app.post("/api/hospitals/:hospitalId/donation-requests", async (req, res) => {
  try {
    const { userId, userName, units, bloodType } = req.body;
    const request = {
      hospitalId: new ObjectId(req.params.hospitalId),
      userId,
      userName,
      units,
      bloodType,
      status: 'pending',
      createdAt: new Date()
    };
    
    const result = await db.collection('donationRequests').insertOne(request);
    res.status(201).json({ ...request, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating donation request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mount hospital routes (protected routes)
app.use('/api/hospitals', hospitalRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error occurred:", err);
  res.status(500).json({ error: 'Something broke!', details: err.message });
});

// Start server after DB connection
async function startServer() {
  await connectToMongo();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);

export { client };
