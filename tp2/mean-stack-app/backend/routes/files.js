const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, req.userId + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Upload file (protected)
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        // Update user profile image
        const user = await User.findById(req.userId);
        if (user) {
            // Delete old image if exists
            if (user.profileImage && fs.existsSync(user.profileImage)) {
                fs.unlinkSync(user.profileImage);
            }
            
            user.profileImage = req.file.path;
            await user.save();
        }
        
        res.json({
            success: true,
            message: 'File uploaded successfully',
            filename: req.file.filename,
            path: req.file.path
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed', message: error.message });
    }
});

// Show user's profile image (protected)
router.get('/show', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        
        if (!user || !user.profileImage) {
            return res.status(404).json({ error: 'No profile image found' });
        }
        
        if (!fs.existsSync(user.profileImage)) {
            return res.status(404).json({ error: 'Image file not found' });
        }
        
        res.sendFile(path.resolve(user.profileImage));
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve image' });
    }
});

// Find/List files (protected)
router.get('/find', authMiddleware, (req, res) => {
    const command = process.platform === 'win32' ? 'dir' : 'ls -la';
    
    exec(command, { timeout: 5000, cwd: './uploads' }, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({
                error: 'Failed to list files',
                message: error.message
            });
        }
        
        res.json({
            success: true,
            files: stdout
        });
    });
});

module.exports = router;
