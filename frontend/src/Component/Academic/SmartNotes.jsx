import React, { useState, useRef, useEffect } from 'react';
import './SmartNotes.css';

const SmartNotes = () => {
    const [inputText, setInputText] = useState('');
    const [pdfFile, setPdfFile] = useState(null);
    const [summaryType, setSummaryType] = useState('concise'); // concise, bullet, qa
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('text');
    const [serviceStatus, setServiceStatus] = useState('checking');
    
    const fileInputRef = useRef(null);

    const API_BASE_URL = 'http://localhost:8000/api/v1/notes';

    // Check summarizer service health on component mount
    useEffect(() => {
        checkServiceHealth();
    }, []);

    const checkServiceHealth = async () => {
        try {
            setServiceStatus('checking');
            const response = await fetch(`${API_BASE_URL}/health`);
            const data = await response.json();
            
            if (data.success) {
                setServiceStatus('healthy');
                setError('');
            } else {
                setServiceStatus('unavailable');
                setError(data.error || 'Summarizer service is unavailable');
            }
        } catch (err) {
            setServiceStatus('unavailable');
            setError('Cannot connect to backend server. Make sure it is running on port 8000.');
        }
    };

    const handleTextSubmit = async (e) => {
        e.preventDefault();
        
        if (!inputText.trim()) {
            setError('Please enter some text to summarize');
            return;
        }

        await processRequest({ 
            text: inputText.trim(),
            summary_type: summaryType
        });
    };

    const handlePDFSubmit = async (e) => {
        e.preventDefault();
        
        if (!pdfFile) {
            setError('Please select a PDF file');
            return;
        }

        const formData = new FormData();
        formData.append('pdf', pdfFile);
        formData.append('summary_type', summaryType);

        await processRequest(formData, true);
    };

    const processRequest = async (data, isFormData = false) => {
        setLoading(true);
        setError('');

        try {
            const endpoint = isFormData ? '/summarize/pdf' : '/summarize/text';
            const url = `${API_BASE_URL}${endpoint}`;

            const response = await fetch(url, {
                method: 'POST',
                body: isFormData ? data : JSON.stringify(data),
                headers: isFormData ? {} : { 
                    'Content-Type': 'application/json' 
                }
            });

            const result = await response.json();

            if (result.success) {
                setResult(result.summary);
                setServiceStatus('healthy');
            } else {
                setError(result.error || 'Something went wrong');
                if (result.error?.includes('Summarizer service')) {
                    setServiceStatus('unavailable');
                }
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to connect to summarizer service.');
            setServiceStatus('unavailable');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type === 'application/pdf') {
                if (file.size > 10 * 1024 * 1024) { // 10MB
                    setError('File size must be less than 10MB');
                    setPdfFile(null);
                } else {
                    setPdfFile(file);
                    setError('');
                }
            } else {
                setError('Please select a PDF file');
                setPdfFile(null);
            }
        }
    };

    const handleSummaryTypeSelect = (selectedType) => {
        setSummaryType(selectedType);
    };

    const handleClear = () => {
        setInputText('');
        setPdfFile(null);
        setResult('');
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleCopyResult = () => {
        if (result) {
            navigator.clipboard.writeText(result)
                .then(() => alert('Summary copied to clipboard!'))
                .catch(err => console.error('Failed to copy:', err));
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const summaryTypeConfig = {
        'concise': { 
            icon: '📋', 
            label: 'Concise Summary', 
            color: '#3B82F6',
            description: 'Get a brief 200 words summary'
        },
        'bullet': { 
            icon: '🔑', 
            label: 'Key Points', 
            color: '#F59E0B',
            description: 'Extract main points as bullet list'
        },
        'qa': { 
            icon: '❓', 
            label: 'Q&A', 
            color: '#10B981',
            description: 'Generate questions and answers'
        }
    };

    return (
        <div className="smart-notes-container">
            <div className="smart-notes-header">
                <h1>📝 Smart Notes Summarizer</h1>
                <p className="subtitle">Summarize text and PDFs using AI-powered summarization</p>
                
                {/* Service Status Indicator */}
                <div className={`service-status ${serviceStatus}`}>
                    {serviceStatus === 'healthy' && '✅ Summarizer Service is ready'}
                    {serviceStatus === 'checking' && '🔄 Checking Summarizer Service...'}
                    {serviceStatus === 'unavailable' && '⚠️ Summarizer Service unavailable'}
                </div>
                
                {serviceStatus === 'unavailable' && (
                    <div className="service-help">
                        <p>To start the summarizer service:</p>
                        <ol>
                            <li>Open a new terminal</li>
                            <li>Navigate to ai-services folder</li>
                            <li>Run: <code>python app.py</code></li>
                            <li>Wait for "Server running at: http://localhost:8001" message</li>
                            <li>Refresh this page</li>
                        </ol>
                    </div>
                )}
            </div>

            {/* Input Method Tabs */}
            <div className="input-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
                    onClick={() => setActiveTab('text')}
                    disabled={serviceStatus !== 'healthy'}
                >
                    <span className="tab-icon">📝</span>
                    Text Input
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'pdf' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pdf')}
                    disabled={serviceStatus !== 'healthy'}
                >
                    <span className="tab-icon">📄</span>
                    PDF Upload
                </button>
            </div>

            {/* Input Section */}
            <div className="input-section">
                {activeTab === 'text' ? (
                    <div className="text-input-container">
                        <textarea
                            className="text-area"
                            placeholder="Paste your text here to summarize (lecture notes, articles, documents, etc.)..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            rows={8}
                            disabled={serviceStatus !== 'healthy' || loading}
                        />
                        <div className="char-counter">
                            {inputText.length} characters
                            {inputText.length > 2000 && (
                                <span className="char-warning"> (Will be truncated to 2000 chars)</span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="pdf-input-container">
                        <div 
                            className={`pdf-drop-zone ${pdfFile ? 'has-file' : ''} ${serviceStatus !== 'healthy' ? 'disabled' : ''}`}
                            onClick={() => serviceStatus === 'healthy' && !loading && fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".pdf"
                                className="file-input"
                                disabled={serviceStatus !== 'healthy' || loading}
                            />
                            {pdfFile ? (
                                <div className="file-info">
                                    <span className="file-icon">📄</span>
                                    <div className="file-details">
                                        <span className="file-name">{pdfFile.name}</span>
                                        <span className="file-size">{formatFileSize(pdfFile.size)}</span>
                                    </div>
                                    <button 
                                        className="remove-file"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPdfFile(null);
                                            fileInputRef.current.value = '';
                                        }}
                                        disabled={loading}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <span className="upload-icon">📤</span>
                                    <p className="upload-text">
                                        {serviceStatus === 'healthy' ? 'Click to upload PDF' : 'Summarizer Service unavailable'}
                                    </p>
                                    <p className="upload-hint">
                                        {serviceStatus === 'healthy' ? 'or drag and drop' : 'Start service first'}
                                    </p>
                                    <p className="upload-info">Max 10MB • PDF only</p>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Summary Type Selection */}
                <div className="summary-type-container">
                    <h3 className="summary-type-title">Select Summary Type:</h3>
                    <div className="summary-type-buttons">
                        {Object.entries(summaryTypeConfig).map(([key, config]) => (
                            <button
                                key={key}
                                className={`summary-type-btn ${summaryType === key ? 'selected' : ''} ${serviceStatus !== 'healthy' ? 'disabled' : ''}`}
                                onClick={() => serviceStatus === 'healthy' && handleSummaryTypeSelect(key)}
                                disabled={serviceStatus !== 'healthy' || loading}
                                style={{ 
                                    '--type-color': config.color,
                                    borderColor: summaryType === key ? config.color : '#E5E7EB'
                                }}
                                title={config.description}
                            >
                                <span className="type-icon">{config.icon}</span>
                                <span className="type-label">{config.label}</span>
                                <span className="type-description">{config.description}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Control Buttons */}
                <div className="control-buttons">
                    <button
                        className="summarize-btn"
                        onClick={activeTab === 'text' ? handleTextSubmit : handlePDFSubmit}
                        disabled={
                            serviceStatus !== 'healthy' ||
                            loading || 
                            (activeTab === 'text' && !inputText.trim()) || 
                            (activeTab === 'pdf' && !pdfFile)
                        }
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Summarizing...
                            </>
                        ) : (
                            <>
                                <span className="summarize-icon">✨</span>
                                Generate Summary
                            </>
                        )}
                    </button>
                    <button
                        className="clear-btn"
                        onClick={handleClear}
                        disabled={loading}
                    >
                        <span className="clear-icon">🗑️</span>
                        Clear All
                    </button>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    <span className="error-text">{error}</span>
                    <button 
                        className="retry-btn"
                        onClick={checkServiceHealth}
                        disabled={loading}
                    >
                        🔄 Retry Connection
                    </button>
                </div>
            )}

            {/* Result Display */}
            {result && (
                <div className="result-container">
                    <div className="result-header">
                        <div className="result-title">
                            <span className="result-icon">
                                {summaryTypeConfig[summaryType]?.icon || '✨'}
                            </span>
                            <div>
                                <h3>{summaryTypeConfig[summaryType]?.label || 'Summary'}</h3>
                                <small>{summaryTypeConfig[summaryType]?.description || ''}</small>
                            </div>
                        </div>
                        <div className="result-actions">
                            <button className="copy-btn" onClick={handleCopyResult}>
                                <span className="copy-icon">📋</span>
                                Copy
                            </button>
                            <button 
                                className="download-btn"
                                onClick={() => {
                                    const blob = new Blob([result], { type: 'text/plain' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `summary-${summaryType}-${Date.now()}.txt`;
                                    a.click();
                                    URL.revokeObjectURL(url);
                                }}
                            >
                                <span className="download-icon">⬇️</span>
                                Download
                            </button>
                        </div>
                    </div>
                    <div className="result-content">
                        <div className="summary-output">
                            {result.split('\n').map((line, index) => (
                                <p key={index}>
                                    {line.startsWith('•') || line.startsWith('-') ? (
                                        <>
                                            <span className="bullet-point">•</span>
                                            {line.substring(1)}
                                        </>
                                    ) : line.startsWith('Q') && line.includes(':') ? (
                                        <strong className="question-line">{line}</strong>
                                    ) : line.startsWith('A') && line.includes(':') ? (
                                        <span className="answer-line">{line}</span>
                                    ) : (
                                        line
                                    )}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SmartNotes;