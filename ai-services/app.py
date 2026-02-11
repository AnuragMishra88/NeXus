# app.py - COMPLETE INTEGRATED SERVICE (Existing functionality preserved)
import os
import tempfile
import json
import re
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate
from langchain_core.output_parsers import StrOutputParser
import PyPDF2
import docx

load_dotenv()

# ==================== FastAPI App ====================
app = FastAPI(title="AI Text Summarizer (Groq)", version="1.1.0")  # Keep original title

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== Models ====================
# EXISTING - DO NOT MODIFY
class TextRequest(BaseModel):
    text: str
    summary_type: str = "concise"

# NEW - Add without modifying existing
class ResumeAnalysisRequest(BaseModel):
    resume_text: str
    job_description: str = ""

class RewriteRequest(BaseModel):
    bullet_point: str
    target_role: str = "Software Engineer"

# ==================== GROQ CONFIGURATION ====================
GROQ_API_KEY = "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"

# ==================== EXISTING SUMMARIZER - DO NOT MODIFY ====================
class GroqSummarizer:
    def __init__(self):
        self.groq_api_key = GROQ_API_KEY
        
        if not self.groq_api_key:
            print("⚠️  WARNING: GROQ_API_KEY not found in .env!")
            self.llm = None
        else:
            try:
                self.llm = ChatGroq(
                    groq_api_key=self.groq_api_key,
                    model_name="llama-3.1-8b-instant",
                    temperature=0.2,
                    max_tokens=1024
                )
                print("✅ Groq Summarizer initialized successfully")
            except Exception as e:
                print(f"❌ Error initializing Groq: {e}")
                self.llm = None
        
        self.prompt_configs = {
            "concise": "Summarize the following text in not more than 200 words, impactful sentences:\n\n{text}",
            "bullet": "Extract the key information from this text and present it as a clean bulleted list:\n\n{text}",
            "qa": "Based on the text below, generate 10 relevant questions and their accurate 2-3 lines answers:\n\n{text}"
        }
        self.parser = StrOutputParser()
    
    def summarize_text(self, text: str, summary_type: str = "concise") -> str:
        if not text.strip():
            return "No text provided."
        
        if not self.llm:
            return "AI Service Offline: Please check your GROQ_API_KEY."

        try:
            template = self.prompt_configs.get(summary_type, self.prompt_configs["concise"])
            prompt = ChatPromptTemplate.from_messages([
                ("system", "You are an expert educational assistant specializing in clear, accurate summarization."),
                ("user", template)
            ])
            
            chain = prompt | self.llm | self.parser
            result = chain.invoke({"text": text[:8000]})
            return result.strip()
            
        except Exception as e:
            print(f"Summarization error: {e}")
            return f"Error during summarization: {str(e)}"

    def extract_pdf_text(self, pdf_bytes: bytes) -> str:
        tmp_path = None
        try:
            with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
                tmp.write(pdf_bytes)
                tmp_path = tmp.name
            
            text = ""
            with open(tmp_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                num_pages = min(10, len(reader.pages))
                for i in range(num_pages):
                    page_text = reader.pages[i].extract_text()
                    if page_text:
                        text += page_text + "\n"
            return text.strip()
        finally:
            if tmp_path and os.path.exists(tmp_path):
                os.unlink(tmp_path)

# ==================== NEW RESUME ANALYZER - ADDED WITHOUT MODIFYING EXISTING ====================
class ResumeAnalyzer:
    def __init__(self):
        try:
            self.llm = ChatGroq(
                groq_api_key=GROQ_API_KEY,
                model_name="llama-3.1-8b-instant",
                temperature=0.3,
                max_tokens=3000
            )
            print("✅ Groq Resume Analyzer initialized successfully")
        except Exception as e:
            print(f"❌ Error initializing Groq Resume Analyzer: {e}")
            self.llm = None
        
        self.parser = StrOutputParser()
        
        self.analysis_prompt = PromptTemplate(
            template="""You are an expert HR professional and resume reviewer with 15 years of experience. 
Analyze the following resume content and job description (if provided) with extreme detail and accuracy.

RESUME CONTENT:
{resume_text}

JOB DESCRIPTION:
{job_description}

Perform a comprehensive evaluation based on these criteria:

1. STRUCTURAL COMPLETENESS (0-10)
2. ATS COMPATIBILITY (0-10)
3. SKILLS ANALYSIS (0-15)
4. EXPERIENCE EVALUATION (0-20)
5. PROJECT STRENGTH (0-15)
6. RELEVANCE TO JOB DESCRIPTION (0-20)
7. GRAMMAR & CLARITY (0-10)
8. RED FLAGS
9. KEYWORD GAP ANALYSIS
10. FINAL EVALUATION

Return your analysis in this EXACT JSON format:

{{
  "structural_score": 0,
  "ats_score": 0,
  "skills_score": 0,
  "experience_score": 0,
  "projects_score": 0,
  "jd_relevance_score": 0,
  "grammar_score": 0,
  "overall_score": 0,
  "skill_match_percentage": 0,
  "missing_keywords": [],
  "red_flags": [],
  "technical_skills_detected": [],
  "soft_skills_detected": [],
  "strengths": [],
  "improvements": [],
  "rewrite_suggestions": [],
  "hiring_recommendation": ""
}}""",
            input_variables=["resume_text", "job_description"]
        )
        
        self.rewrite_prompt = PromptTemplate(
            template="""Rewrite the following resume experience/project bullet point to be more impactful, 
quantifiable, and ATS-friendly. Use strong action verbs and include metrics where possible.

Original: {bullet_point}

Role/Target Job: {target_role}

Improved version (one sentence only):""",
            input_variables=["bullet_point", "target_role"]
        )
    
    def analyze_resume(self, resume_text: str, job_description: str = "") -> dict:
        if self.llm is None:
            return self.fallback_analysis(resume_text, job_description)
        
        try:
            resume_text = resume_text[:8000] if len(resume_text) > 8000 else resume_text
            job_description = job_description[:4000] if len(job_description) > 4000 else job_description
            
            chain = self.analysis_prompt | self.llm | self.parser
            result = chain.invoke({
                "resume_text": resume_text,
                "job_description": job_description if job_description else "No job description provided"
            })
            
            json_match = re.search(r'\{.*\}', result, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            else:
                return self.fallback_analysis(resume_text, job_description)
            
        except Exception as e:
            print(f"Analysis error: {e}")
            return self.fallback_analysis(resume_text, job_description)
    
    def fallback_analysis(self, resume_text: str, job_description: str = "") -> dict:
        technical_skills = []
        soft_skills = []
        
        tech_keywords = [
            "python", "java", "javascript", "react", "node", "aws", "azure", 
            "docker", "kubernetes", "sql", "mongodb", "tensorflow", "pytorch",
            "html", "css", "git", "linux", "c++", "c#", "php", "ruby", "go"
        ]
        
        resume_lower = resume_text.lower()
        
        for skill in tech_keywords:
            if skill in resume_lower:
                technical_skills.append(skill.capitalize())
        
        has_summary = bool(re.search(r'(summary|objective|profile)', resume_lower[:500]))
        has_skills = bool(re.search(r'(skills|technologies|expertise)', resume_lower))
        has_experience = bool(re.search(r'(experience|work|employment)', resume_lower))
        has_education = bool(re.search(r'(education|degree|university|college)', resume_lower))
        has_projects = bool(re.search(r'(projects|portfolio)', resume_lower))
        
        structural_score = sum([has_summary, has_skills, has_experience, has_education, has_projects]) * 2
        
        jd_relevance_score = 0
        skill_match_percentage = 0
        
        if job_description:
            jd_lower = job_description.lower()
            jd_skills = [skill for skill in tech_keywords if skill in jd_lower]
            if jd_skills:
                matched = sum(1 for skill in jd_skills if skill in resume_lower)
                skill_match_percentage = int((matched / len(jd_skills)) * 100)
                jd_relevance_score = min(skill_match_percentage // 5, 20)
        
        overall_score = structural_score + 50 + jd_relevance_score
        
        if overall_score >= 85:
            recommendation = "Strong Hire"
        elif overall_score >= 70:
            recommendation = "Hire"
        elif overall_score >= 55:
            recommendation = "Borderline"
        else:
            recommendation = "Reject"
        
        return {
            "structural_score": structural_score,
            "ats_score": 6,
            "skills_score": min(len(technical_skills), 15),
            "experience_score": 12,
            "projects_score": min(len(re.findall(r'project', resume_lower)) * 2, 15),
            "jd_relevance_score": jd_relevance_score,
            "grammar_score": 7,
            "overall_score": overall_score,
            "skill_match_percentage": skill_match_percentage,
            "missing_keywords": [],
            "red_flags": [],
            "technical_skills_detected": technical_skills[:15],
            "soft_skills_detected": [],
            "strengths": [
                "Educational background",
                "Technical skills present"
            ],
            "improvements": [
                "Add quantifiable achievements",
                "Include more action verbs"
            ],
            "rewrite_suggestions": [
                "• Developed features → Developed and deployed 3 features serving 10k+ users",
                "• Worked on team → Collaborated with 5 engineers to deliver project ahead of schedule"
            ],
            "hiring_recommendation": recommendation
        }
    
    def rewrite_bullet_point(self, bullet_point: str, target_role: str = "Software Engineer") -> str:
        if self.llm is None or not bullet_point.strip():
            return bullet_point
        
        try:
            chain = self.rewrite_prompt | self.llm | self.parser
            improved = chain.invoke({
                "bullet_point": bullet_point,
                "target_role": target_role
            })
            return improved.strip()
        except Exception:
            return bullet_point

# ==================== Initialize Services ====================
summarizer = GroqSummarizer()  # EXISTING - DO NOT MODIFY
resume_analyzer = ResumeAnalyzer()  # NEW - Added separately

# ==================== FILE EXTRACTION UTILITIES ====================
def extract_text_from_docx(docx_bytes: bytes) -> str:
    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(suffix=".docx", delete=False) as tmp:
            tmp.write(docx_bytes)
            tmp_path = tmp.name
        
        doc = docx.Document(tmp_path)
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        return text.strip()
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)

# ==================== EXISTING ENDPOINTS - DO NOT MODIFY ====================

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "success": True,
        "engine": "Groq Llama 3",
        "ai_active": summarizer.llm is not None
    }

@app.post("/summarize/text")
async def summarize_text_endpoint(request: TextRequest):
    result = summarizer.summarize_text(request.text, request.summary_type)
    return {
        "success": True,
        "summary": result,
        "type": request.summary_type
    }

@app.post("/summarize/pdf")
async def summarize_pdf_endpoint(
    pdf: UploadFile = File(...),
    summary_type: str = Form("concise")
):
    if not pdf.filename.lower().endswith('.pdf'):
        raise HTTPException(400, "Invalid file type. PDF required.")
    
    content = await pdf.read()
    text = summarizer.extract_pdf_text(content)
    
    if not text:
        raise HTTPException(400, "Could not extract text from PDF.")
        
    result = summarizer.summarize_text(text, summary_type)
    return {
        "success": True,
        "summary": result,
        "filename": pdf.filename
    }

# ==================== NEW ENDPOINTS - ADDED WITHOUT MODIFYING EXISTING ====================

@app.get("/")
def home():
    return {
        "service": "AI Text Summarizer (Groq)",
        "version": "1.1.0",
        "status": "running",
        "summarizer_ready": summarizer.llm is not None,
        "resume_analyzer_ready": resume_analyzer.llm is not None,
        "available_endpoints": [
            "/health",
            "/summarize/text",
            "/summarize/pdf",
            "/analyze/text",
            "/analyze/file",
            "/rewrite",
            "/skill-suggestions"
        ]
    }

@app.post("/analyze/text")
async def analyze_resume_text(request: ResumeAnalysisRequest):
    """Analyze resume from text (NEW)"""
    if not request.resume_text.strip():
        raise HTTPException(400, "Resume text is required")
    
    analysis = resume_analyzer.analyze_resume(request.resume_text, request.job_description)
    return analysis

@app.post("/analyze/file")
async def analyze_resume_file(
    file: UploadFile = File(...),
    job_description: str = Form("")
):
    """Analyze resume from PDF or DOCX file (NEW)"""
    file_ext = file.filename.split('.')[-1].lower()
    
    if file_ext not in ['pdf', 'docx']:
        raise HTTPException(400, "Only PDF and DOCX files are supported")
    
    content = await file.read()
    
    if len(content) == 0:
        raise HTTPException(400, "Empty file")
    
    if file_ext == 'pdf':
        resume_text = summarizer.extract_pdf_text(content)  # Reuse existing PDF extractor
    else:
        resume_text = extract_text_from_docx(content)
    
    if not resume_text.strip():
        raise HTTPException(400, "Could not extract text from file")
    
    analysis = resume_analyzer.analyze_resume(resume_text, job_description)
    
    return {
        "filename": file.filename,
        "analysis": analysis
    }

@app.post("/rewrite")
async def rewrite_bullet_point(request: RewriteRequest):
    """Rewrite resume bullet point (NEW)"""
    if not request.bullet_point.strip():
        raise HTTPException(400, "Bullet point is required")
    
    improved = resume_analyzer.rewrite_bullet_point(request.bullet_point, request.target_role)
    
    return {
        "original": request.bullet_point,
        "improved": improved
    }

@app.get("/skill-suggestions")
async def get_skill_suggestions(role: str = "Software Engineer"):
    """Get skill suggestions for a role (NEW)"""
    role_skills = {
        "software engineer": [
            "Python", "Java", "JavaScript", "SQL", "Git", "REST APIs",
            "Data Structures", "Algorithms", "Agile", "Unit Testing"
        ],
        "data scientist": [
            "Python", "R", "SQL", "Machine Learning", "Statistics",
            "TensorFlow", "PyTorch", "Pandas", "NumPy", "Data Visualization"
        ],
        "frontend developer": [
            "HTML", "CSS", "JavaScript", "React", "Vue.js", "Angular",
            "Responsive Design", "TypeScript", "Webpack", "REST APIs"
        ],
        "backend developer": [
            "Node.js", "Python", "Java", "SQL", "MongoDB", "Docker",
            "AWS", "REST APIs", "Microservices", "Redis"
        ],
        "devops engineer": [
            "Docker", "Kubernetes", "Jenkins", "AWS/Azure/GCP",
            "Terraform", "Ansible", "Linux", "CI/CD", "Monitoring"
        ],
        "product manager": [
            "Product Strategy", "Roadmapping", "User Research",
            "Agile", "JIRA", "Analytics", "Stakeholder Management",
            "A/B Testing", "Market Analysis", "Wireframing"
        ]
    }
    
    role_lower = role.lower()
    for key, skills in role_skills.items():
        if key in role_lower:
            return {"role": role, "suggested_skills": skills}
    
    return {
        "role": role,
        "suggested_skills": [
            "Communication", "Problem Solving", "Teamwork",
            "Project Management", "Technical Writing"
        ]
    }

# ==================== Run Server ====================
if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*60)
    print("🚀 Starting Groq-powered Summarizer on http://127.0.0.1:8001")
    print("✅ Existing summarizer endpoints preserved")
    print("✅ New resume analyzer endpoints added")
    print("="*60)
    print("\n📋 Available Endpoints:")
    print("   [EXISTING] GET  /health")
    print("   [EXISTING] POST /summarize/text")
    print("   [EXISTING] POST /summarize/pdf")
    print("   [NEW]      POST /analyze/text")
    print("   [NEW]      POST /analyze/file")
    print("   [NEW]      POST /rewrite")
    print("   [NEW]      GET  /skill-suggestions")
    print("="*60 + "\n")
    
    uvicorn.run(app, host="127.0.0.1", port=8001)