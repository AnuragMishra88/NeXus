import axios from 'axios';

const AI_SERVICE_URL = 'http://127.0.0.1:8001';

export const analyzeResume = async (req, res) => {
    try {
        const { resume_text, job_description } = req.body;
        
        console.log('📝 Analyzing resume text...');
        
        const response = await axios.post(`${AI_SERVICE_URL}/analyze/text`, {
            resume_text,
            job_description: job_description || ''
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('❌ Resume analysis failed:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Resume analysis failed',
            details: error.message 
        });
    }
};

export const analyzeResumeFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                error: 'No file uploaded' 
            });
        }

        console.log(`📄 Processing resume file: ${req.file.originalname}`);
        
        const FormData = (await import('form-data')).default;
        const formData = new FormData();
        
        formData.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });
        formData.append('job_description', req.body.job_description || '');
        
        const response = await axios.post(
            `${AI_SERVICE_URL}/analyze/file`, 
            formData,
            { 
                headers: { 
                    ...formData.getHeaders(),
                    'Content-Length': formData.getLengthSync()
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            }
        );
        
        res.json(response.data);
    } catch (error) {
        console.error('❌ File analysis failed:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'File analysis failed',
            details: error.message 
        });
    }
};

export const rewriteBullet = async (req, res) => {
    try {
        const { bullet_point, target_role } = req.body;
        
        if (!bullet_point) {
            return res.status(400).json({ 
                success: false, 
                error: 'Bullet point is required' 
            });
        }
        
        console.log('✏️ Rewriting bullet point...');
        
        const response = await axios.post(`${AI_SERVICE_URL}/rewrite`, {
            bullet_point,
            target_role: target_role || 'Software Engineer'
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('❌ Rewrite failed:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Rewrite failed',
            details: error.message 
        });
    }
};

export const getSkillSuggestions = async (req, res) => {
    try {
        const { role } = req.query;
        const targetRole = role || 'Software Engineer';
        
        console.log(`🎯 Fetching skill suggestions for: ${targetRole}`);
        
        const response = await axios.get(
            `${AI_SERVICE_URL}/skill-suggestions?role=${encodeURIComponent(targetRole)}`
        );
        
        res.json(response.data);
    } catch (error) {
        console.error('❌ Failed to fetch skills:', error.message);
        
        // Return fallback skills even if AI service fails
        const fallbackSkills = getFallbackSkills(req.query.role || 'Software Engineer');
        res.json({
            role: req.query.role || 'Software Engineer',
            suggested_skills: fallbackSkills
        });
    }
};

// Fallback skill suggestions when AI service is unavailable
function getFallbackSkills(role) {
    const roleLower = role.toLowerCase();
    
    if (roleLower.includes('software') || roleLower.includes('developer')) {
        return ['Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Git', 'REST APIs', 'Docker'];
    }
    if (roleLower.includes('frontend')) {
        return ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Next.js', 'Tailwind CSS'];
    }
    if (roleLower.includes('backend')) {
        return ['Python', 'Java', 'Node.js', 'SQL', 'MongoDB', 'Docker', 'AWS'];
    }
    if (roleLower.includes('data')) {
        return ['Python', 'SQL', 'Machine Learning', 'Pandas', 'NumPy', 'TensorFlow', 'Tableau'];
    }
    if (roleLower.includes('devops')) {
        return ['Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Terraform', 'Linux', 'CI/CD'];
    }
    if (roleLower.includes('product')) {
        return ['Product Strategy', 'Roadmapping', 'User Research', 'Agile', 'JIRA', 'Analytics'];
    }
    
    return ['Communication', 'Problem Solving', 'Teamwork', 'Project Management', 'Leadership'];
}

// Test endpoint to check if AI service is running
export const checkAIService = async (req, res) => {
    try {
        const response = await axios.get(`${AI_SERVICE_URL}/health`);
        res.json({
            success: true,
            ai_service: response.data,
            message: 'AI service is running'
        });
    } catch (error) {
        res.status(503).json({
            success: false,
            ai_service: 'unavailable',
            message: 'AI service is not running. Start it with: python app.py',
            error: error.message
        });
    }
};