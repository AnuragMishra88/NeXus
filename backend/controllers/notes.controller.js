// notes.controller.js - FIXED VERSION
import axios from 'axios';
import FormData from 'form-data';

// Use explicit IPv4 address instead of localhost
const SUMMARIZER_URL = process.env.FASTAPI_URL || 'http://127.0.0.1:8001';

const summarizerClient = axios.create({
    baseURL: SUMMARIZER_URL,
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const checkSummarizerHealth = async (req, res) => {
    try {
        console.log('🔍 Checking Python summarizer at:', SUMMARIZER_URL);
        const response = await summarizerClient.get('/health', {
            // Force IPv4
            family: 4,
            localAddress: '127.0.0.1'
        });
        
        console.log('✅ Python service response:', response.data);
        
        res.json({
            success: true,
            summarizer_service: response.data,
            backend: 'healthy',
            connection: 'established'
        });

    } catch (error) {
        console.error('❌ Summarizer service health check failed:', error.message);
        console.error('Error details:', error.code, error.address, error.port);
        
        // Try alternative connection method
        try {
            console.log('🔄 Trying alternative connection method...');
            const fallbackResponse = await axios.get('http://127.0.0.1:8001/health', {
                timeout: 5000,
                family: 4  // Force IPv4
            });
            
            res.json({
                success: true,
                summarizer_service: fallbackResponse.data,
                backend: 'healthy',
                connection: 'established_via_fallback'
            });
            
        } catch (fallbackError) {
            console.error('❌ Fallback also failed:', fallbackError.message);
            
            res.status(503).json({
                success: false,
                summarizer_service: 'unavailable',
                backend: 'healthy',
                error: 'Python summarizer service is not running',
                troubleshooting: [
                    '1. Open terminal in ai-services folder',
                    '2. Run: python app.py',
                    '3. Wait for "Server running at: http://0.0.0.0:8001"',
                    '4. Check if service is listening: curl http://127.0.0.1:8001/health',
                    '5. Refresh this page'
                ],
                endpoints_to_check: [
                    'http://127.0.0.1:8001/health',
                    'http://localhost:8001/health'
                ]
            });
        }
    }
};

export const summarizeText = async (req, res) => {
    try {
        const { text, summary_type = 'concise' } = req.body;

        if (!text?.trim()) {
            return res.status(400).json({
                success: false,
                error: 'Text is required'
            });
        }

        console.log(`📝 Summarizing text (type: ${summary_type})`);

        const response = await summarizerClient.post('/summarize/text', {
            text: text.trim(),
            summary_type: summary_type
        }, {
            family: 4  // Force IPv4
        });

        res.json({
            success: true,
            summary: response.data.summary,
            type: response.data.type,
            model_used: response.data.model_used,
            text_length: response.data.text_length || text.length
        });

    } catch (error) {
        console.error('❌ Text summarization error:', error.message);
        
        if (error.code === 'ECONNREFUSED' || error.code === 'EAI_AGAIN') {
            return res.status(503).json({
                success: false,
                error: 'Summarizer service is not running on port 8001',
                fix: 'Start Python service: cd ai-services && python app.py'
            });
        }
        
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        
        res.status(500).json({
            success: false,
            error: 'Failed to summarize text'
        });
    }
};

export const summarizePDF = async (req, res) => {
    try {
        const { summary_type = 'concise' } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ 
                success: false, 
                error: 'PDF file is required' 
            });
        }

        // Create form data
        const form = new FormData();
        form.append('pdf', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
        });
        form.append('summary_type', summary_type);

        console.log(`📄 Processing PDF: ${file.originalname}`);

        const response = await summarizerClient.post('/summarize/pdf', form, {
            headers: {
                ...form.getHeaders(),
            },
            family: 4  // Force IPv4
        });

        res.json({
            success: true,
            summary: response.data.summary,
            type: response.data.type,
            original_filename: response.data.original_filename,
            model_used: response.data.model_used
        });
    } catch (error) {
        console.error('❌ PDF summarization error:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                success: false,
                error: 'Summarizer service is not running',
                fix: 'Start the Python service first'
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Failed to summarize PDF'
        });
    }
};