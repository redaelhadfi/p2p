const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Configuration
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tp2_db';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const fileRoutes = require('./routes/files');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);

// Route de test
app.get('/', (req, res) => {
    res.json({
        message: '🚀 TP2 MEAN Stack API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth (register, login)',
            users: '/api/users (profile, list)',
            files: '/api/files (upload, show, find)'
        }
    });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 MEAN Stack Backend running on http://localhost:${PORT}`);
});
