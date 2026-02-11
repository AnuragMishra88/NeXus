import express from "express";
import { 
    register, 
    login, 
    logout, 
    updateProfile, 
    getProfile,
    uploadProfilePhoto 
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";
import multer from "multer";


const router = express.Router();

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'File too large. Maximum size is 10MB',
                success: false
            });
        }
        return res.status(400).json({
            message: 'File upload error: ' + error.message,
            success: false
        });
    } else if (error) {
        return res.status(400).json({
            message: error.message,
            success: false
        });
    }
    next();
};

// =========== PUBLIC ROUTES ===========
// Add singleUpload to the register route
router.route("/register").post(singleUpload, handleMulterError, register);
router.route("/login").post(login);
router.route("/logout").get(logout);

// =========== PROTECTED ROUTES ===========
router.route("/profile").get(isAuthenticated, getProfile);

// Update profile (with optional resume PDF upload)
router.route("/profile/update").post(
    isAuthenticated, 
    singleUpload,  // For resume PDF
    handleMulterError, 
    updateProfile
);

// Upload profile photo
router.route("/profile/upload-photo").post(
    isAuthenticated,
    singleUpload,  // For profile photo
    handleMulterError,
    uploadProfilePhoto
);

// =========== TEST ROUTE ===========
router.route("/test-upload").post(singleUpload, handleMulterError, (req, res) => {
    try {
        console.log("Test upload - File received:", req.file);
        if (req.file) {
            return res.status(200).json({
                message: "File received successfully",
                fileInfo: {
                    originalname: req.file.originalname,
                    mimetype: req.file.mimetype,
                    size: req.file.size
                },
                success: true
            });
        } else {
            return res.status(400).json({
                message: "No file received",
                success: false
            });
        }
    } catch (error) {
        console.log("Test upload error:", error);
        return res.status(500).json({
            message: "Test upload failed",
            success: false
        });
    }
});

export default router;