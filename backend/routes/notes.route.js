import express from 'express';
import { 
    summarizeText, 
    summarizePDF, 
    checkSummarizerHealth 
} from '../controllers/notes.controller.js';
import { pdfUpload, handleMulterError } from '../middlewares/memoryMulter.js';

const router = express.Router();

// Health check
router.get('/health', checkSummarizerHealth);

// Text summarization
router.post('/summarize/text', summarizeText);

// PDF summarization
router.post('/summarize/pdf', pdfUpload, handleMulterError, summarizePDF);

// Test endpoint
router.post('/test-summary', pdfUpload, handleMulterError, async (req, res) => {
    try {
        if (req.file) {
            // Simple test without calling Python service
            res.json({
                success: true,
                message: 'PDF ready for summarization',
                file_info: {
                    name: req.file.originalname,
                    size: req.file.size,
                    type: req.file.mimetype
                }
            });
        } else {
            res.status(400).json({
                success: false,
                error: 'No PDF file received'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Test failed'
        });
    }
});

export default router;