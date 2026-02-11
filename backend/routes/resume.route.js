import express from 'express';
import multer from 'multer';
import {
    analyzeResume,
    analyzeResumeFile,
    rewriteBullet,
    getSkillSuggestions
} from '../controllers/resume.controller.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze/text', analyzeResume);
router.post('/analyze/file', upload.single('file'), analyzeResumeFile);
router.post('/rewrite', rewriteBullet);
router.get('/skill-suggestions', getSkillSuggestions);

export default router;