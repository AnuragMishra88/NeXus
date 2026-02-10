import multer from 'multer';

// Configure multer to use memory storage (no disk storage)
const storage = multer.memoryStorage();

// File filter - only allow PDF files
const fileFilter = (req, file, cb) => {
    // Check if the file is a PDF
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

// Create the multer middleware
export const pdfUpload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 1 // Only one file at a time
    }
}).single('pdf'); // 'pdf' is the field name in form data

// Error handling middleware for multer
export const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: 'File too large. Maximum size is 10MB'
            });
        }
        return res.status(400).json({
            success: false,
            error: `File upload error: ${error.message}`
        });
    } else if (error) {
        return res.status(400).json({
            success: false,
            error: error.message
        });
    }
    next();
};