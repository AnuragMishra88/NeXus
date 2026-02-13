# app.py - COMPLETE INTEGRATED SERVICE (Existing functionality preserved + Quiz Bank)
import os
import tempfile
import json
import re
import random
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from typing import List, Optional
import PyPDF2
import docx

load_dotenv()

# ==================== FastAPI App ====================
app = FastAPI(title="AI Text Summarizer (Groq)", version="1.2.0")  # Updated version

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

# NEW - Quiz Bank Models
class QuizRequest(BaseModel):
    topic: str
    num_questions: int = 5
    difficulty: str = "medium"

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: str
    explanation: str

class QuizResponse(BaseModel):
    topic: str
    questions: List[QuizQuestion]
    total_questions: int

class QuizSubmission(BaseModel):
    questions: List[dict]
    answers: List[str]

class QuizResult(BaseModel):
    score: int
    total: int
    percentage: float
    correct_answers: List[str]
    detailed_results: List[dict]

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

# ==================== RESUME ANALYZER - ADDED WITHOUT MODIFYING EXISTING ====================
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

# ==================== NEW QUIZ BANK - ADDED WITHOUT MODIFYING EXISTING ====================
class QuizBank:
    def __init__(self):
        try:
            self.llm = ChatGroq(
                groq_api_key=GROQ_API_KEY,
                model_name="llama-3.1-8b-instant",
                temperature=0.4,  # Slight creativity for variety
                max_tokens=4000
            )
            print("✅ Groq Quiz Bank initialized successfully")
        except Exception as e:
            print(f"❌ Error initializing Groq Quiz Bank: {e}")
            self.llm = None
        
        self.parser = StrOutputParser()
        
        self.quiz_prompt = PromptTemplate(
            template="""You are an expert educator and quiz creator. Generate {num_questions} multiple-choice questions about: {topic}
Difficulty level: {difficulty}

Requirements:
- Each question must have exactly 4 options (A, B, C, D)
- Only ONE correct answer per question
- Make distractors plausible but clearly incorrect
- Include a brief explanation for the correct answer
- Cover different aspects of the topic
- Ensure questions are clear and unambiguous

Return your response in this EXACT JSON format:
{{
  "questions": [
    {{
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "Option A (exact text of correct answer)",
      "explanation": "Brief explanation why this is correct"
    }}
  ]
}}

Generate exactly {num_questions} questions.""",
            input_variables=["topic", "num_questions", "difficulty"]
        )
    
    def generate_quiz(self, topic: str, num_questions: int = 5, difficulty: str = "medium") -> dict:
        """Generate quiz questions on a given topic"""
        if self.llm is None:
            return self.fallback_quiz(topic, num_questions)
        
        try:
            # Validate inputs
            num_questions = max(1, min(30, num_questions))  # Limit to 30 questions max
            difficulty = difficulty if difficulty in ["easy", "medium", "hard"] else "medium"
            
            chain = self.quiz_prompt | self.llm | self.parser
            result = chain.invoke({
                "topic": topic,
                "num_questions": num_questions,
                "difficulty": difficulty
            })
            
            # Extract JSON from response
            json_match = re.search(r'\{.*\}', result, re.DOTALL)
            if json_match:
                quiz_data = json.loads(json_match.group())
                # Ensure we have the right number of questions
                if len(quiz_data.get("questions", [])) == num_questions:
                    return quiz_data
                else:
                    # Adjust if we got wrong number
                    quiz_data["questions"] = quiz_data.get("questions", [])[:num_questions]
                    return quiz_data
            else:
                return self.fallback_quiz(topic, num_questions)
            
        except Exception as e:
            print(f"Quiz generation error: {e}")
            return self.fallback_quiz(topic, num_questions)
    
    def fallback_quiz(self, topic: str, num_questions: int) -> dict:
        """Fallback quiz when LLM is unavailable"""
        questions = []
        for i in range(min(num_questions, 5)):  # Max 5 fallback questions
            questions.append({
                "question": f"Sample question about {topic} #{i+1}?",
                "options": [
                    f"Correct answer about {topic}",
                    f"Incorrect option 1 for {topic}",
                    f"Incorrect option 2 for {topic}",
                    f"Incorrect option 3 for {topic}"
                ],
                "correct_answer": f"Correct answer about {topic}",
                "explanation": f"This is the correct answer because it accurately describes {topic}."
            })
        return {"questions": questions}
    
    def evaluate_quiz(self, questions: List[dict], user_answers: List[str]) -> dict:
        """Evaluate quiz answers and return score with details"""
        score = 0
        detailed_results = []
        correct_answers = []
        
        for i, (q, user_ans) in enumerate(zip(questions, user_answers)):
            is_correct = user_ans == q["correct_answer"]
            if is_correct:
                score += 1
                correct_answers.append(user_ans)
            
            detailed_results.append({
                "question_num": i + 1,
                "question": q["question"],
                "user_answer": user_ans,
                "correct_answer": q["correct_answer"],
                "is_correct": is_correct,
                "explanation": q["explanation"]
            })
        
        total = len(questions)
        percentage = (score / total * 100) if total > 0 else 0
        
        return {
            "score": score,
            "total": total,
            "percentage": round(percentage, 2),
            "correct_answers": correct_answers,
            "detailed_results": detailed_results
        }
        
# ==================== NEW CAREER ROADMAP MODELS ====================
class CareerRoadmapRequest(BaseModel):
    current_role: str
    target_role: str
    experience_level: str = "entry"  # entry, mid, senior
    time_frame: str = "6 months"  # 3 months, 6 months, 1 year, 2 years
    skills: str = ""  # Optional current skills

class CareerRoadmapResponse(BaseModel):
    target_role: str
    summary: str
    phases: List[dict]
    skills_to_learn: List[str]
    certifications: List[dict]
    projects: List[dict]
    resources: List[dict]
    salary_progression: List[dict]
    market_demand: str
    timeline_months: int
    difficulty_level: str
    success_stories: List[str]
    daily_schedule: dict

# ==================== CAREER ROADMAP GENERATOR ====================
class CareerRoadmapGenerator:
    def __init__(self):
        try:
            self.llm = ChatGroq(
                groq_api_key=GROQ_API_KEY,
                model_name="llama-3.1-8b-instant",
                temperature=0.4,
                max_tokens=5000
            )
            print("✅ Groq Career Roadmap Generator initialized")
        except Exception as e:
            print(f"❌ Error: {e}")
            self.llm = None
        
        self.parser = StrOutputParser()
        
        self.roadmap_prompt = PromptTemplate(
            template="""You are an elite career strategist and technical mentor. Create an EXCITING, VISUALLY-APPEALING career roadmap that will inspire and motivate.

CURRENT ROLE: {current_role}
TARGET ROLE: {target_role}
EXPERIENCE: {experience_level}
TIMELINE: {time_frame}
CURRENT SKILLS: {skills}

Generate a comprehensive, beautifully structured roadmap in this EXACT JSON format:

{{
  "summary": "Inspirational 3-sentence overview of this career transformation journey",
  
  "phases": [
    {{
      "phase": 1,
      "name": "⚡ Foundation Storm",
      "duration": "First 25% of timeline",
      "icon": "🚀",
      "color": "#3b82f6",
      "topics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"],
      "exercises": ["Hands-on task 1", "Hands-on task 2", "Hands-on task 3"],
      "projects": ["Mini project 1", "Mini project 2"],
      "milestone": "What you'll achieve",
      "motivation": "Inspiring quote or push"
    }},
    // Similar for phases 2, 3, 4 with different icons and colors
  ],
  
  "skills_to_learn": [
    "🎯 Priority Skill 1",
    "🎯 Priority Skill 2", 
    "🎯 Priority Skill 3",
    "✨ Nice-to-have Skill 1",
    "✨ Nice-to-have Skill 2"
  ],
  
  "certifications": [
    {{
      "name": "Certification Name",
      "provider": "Provider Name",
      "icon": "🏆",
      "duration": "X weeks",
      "cost": "Free/Premium",
      "relevance": 9,
      "url": "Official URL",
      "badge_color": "gold/silver/bronze"
    }}
  ],
  
  "projects": [
    {{
      "name": "Project Name",
      "difficulty": "Beginner/Intermediate/Advanced",
      "impact": "What it demonstrates",
      "technologies": ["Tech1", "Tech2"],
      "estimated_time": "X weeks",
      "portfolio_worth": "⭐⭐⭐⭐⭐"
    }}
  ],
  
  "resources": [
    {{
      "type": "📚 Course",
      "name": "Resource name",
      "platform": "Platform",
      "duration": "X hours",
      "cost": "Free/Paid",
      "rating": 4.8,
      "url": "#"
    }}
  ],
  
  "salary_progression": [
    {{
      "stage": "Entry Level",
      "salary": "$XX,XXX - $XX,XXX",
      "timeframe": "0-1 year"
    }},
    {{
      "stage": "Mid Level",
      "salary": "$XX,XXX - $XX,XXX", 
      "timeframe": "1-3 years"
    }},
    {{
      "stage": "Senior Level",
      "salary": "$XX,XXX - $XX,XXX",
      "timeframe": "3-5 years"
    }}
  ],
  
  "market_demand": "High/Medium/Low - Detailed description",
  "difficulty_level": "🌟 Beginner Friendly/⭐⭐ Intermediate/⭐⭐⭐ Challenging",
  "timeline_months": 6,
  
  "success_stories": [
    "Story 1 - Realistic inspiring example",
    "Story 2 - Another transformation story"
  ],
  
  "daily_schedule": {{
    "morning": "30 mins - Learning concepts",
    "afternoon": "1 hour - Hands-on practice",
    "evening": "30 mins - Project work",
    "weekly": "Weekend project time"
  }}
}}

Make it visually descriptive, use emojis, make each phase exciting with different themes like:
Phase 1: Foundation Storm ⚡
Phase 2: Skill Surge 🌊  
Phase 3: Project Peak 🏔️
Phase 4: Mastery Launch 🚀

Use colors: #3b82f6 (blue), #10b981 (green), #8b5cf6 (purple), #f59e0b (orange)""",
            input_variables=["current_role", "target_role", "experience_level", "time_frame", "skills"]
        )
    
    def generate_roadmap(self, current_role: str, target_role: str, experience_level: str, time_frame: str, skills: str = "") -> dict:
        if self.llm is None:
            return self.fallback_roadmap(current_role, target_role)
        
        try:
            chain = self.roadmap_prompt | self.llm | self.parser
            result = chain.invoke({
                "current_role": current_role,
                "target_role": target_role,
                "experience_level": experience_level,
                "time_frame": time_frame,
                "skills": skills if skills else "No specific skills mentioned"
            })
            
            json_match = re.search(r'\{.*\}', result, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            else:
                return self.fallback_roadmap(current_role, target_role)
                
        except Exception as e:
            print(f"Roadmap generation error: {e}")
            return self.fallback_roadmap(current_role, target_role)
    
    def fallback_roadmap(self, current_role: str, target_role: str) -> dict:
        return {
            "summary": f"Transform from {current_role} to {target_role} with this exciting journey!",
            "phases": [
                {
                    "phase": 1,
                    "name": "⚡ Foundation Storm",
                    "duration": "Weeks 1-4",
                    "icon": "🚀",
                    "color": "#3b82f6",
                    "topics": ["Core Concepts", "Essential Tools", "Best Practices"],
                    "exercises": ["Daily coding", "Build simple apps"],
                    "projects": ["Portfolio website", "Basic CRUD app"],
                    "milestone": "Strong foundation built",
                    "motivation": "Every expert was once a beginner!"
                }
            ],
            "skills_to_learn": ["🎯 Python", "🎯 JavaScript", "🎯 SQL", "✨ Git", "✨ REST APIs"],
            "certifications": [
                {
                    "name": "Professional Certification",
                    "provider": "Industry Leader",
                    "icon": "🏆",
                    "duration": "12 weeks",
                    "cost": "Premium",
                    "relevance": 9,
                    "badge_color": "gold"
                }
            ],
            "projects": [
                {
                    "name": "Capstone Project",
                    "difficulty": "Advanced",
                    "impact": "Shows full-stack expertise",
                    "technologies": ["React", "Node.js", "MongoDB"],
                    "estimated_time": "4 weeks",
                    "portfolio_worth": "⭐⭐⭐⭐⭐"
                }
            ],
            "resources": [
                {
                    "type": "📚 Course",
                    "name": "Complete Career Path",
                    "platform": "Top Platform",
                    "duration": "40 hours",
                    "cost": "Free",
                    "rating": 4.9
                }
            ],
            "salary_progression": [
                {"stage": "Entry Level", "salary": "$60,000 - $80,000", "timeframe": "0-1 year"},
                {"stage": "Mid Level", "salary": "$80,000 - $110,000", "timeframe": "1-3 years"},
                {"stage": "Senior Level", "salary": "$110,000 - $150,000", "timeframe": "3-5 years"}
            ],
            "market_demand": "🔥 High - Growing rapidly",
            "difficulty_level": "⭐⭐ Intermediate",
            "timeline_months": 6,
            "success_stories": [
                "Sarah transitioned in 8 months and now works at Google",
                "Mike built 3 projects and got hired within 6 months"
            ],
            "daily_schedule": {
                "morning": "30 mins - Theory",
                "afternoon": "1 hour - Practice",
                "evening": "30 mins - Projects",
                "weekly": "Build something new"
            }
        }

# Initialize Career Roadmap Generator
career_roadmap_generator = CareerRoadmapGenerator()

# ==================== CAREER ROADMAP ENDPOINTS ====================
@app.post("/career/roadmap/generate")
async def generate_career_roadmap(request: CareerRoadmapRequest):
    """Generate personalized career roadmap"""
    if not request.current_role.strip() or not request.target_role.strip():
        raise HTTPException(400, "Current role and target role are required")
    
    roadmap = career_roadmap_generator.generate_roadmap(
        current_role=request.current_role,
        target_role=request.target_role,
        experience_level=request.experience_level,
        time_frame=request.time_frame,
        skills=request.skills
    )
    
    return {
        "success": True,
        "current_role": request.current_role,
        "target_role": request.target_role,
        "roadmap": roadmap
    }

@app.get("/career/roadmap/trending")
async def get_trending_careers():
    """Get trending career paths"""
    trending = [
        {
            "role": "AI Engineer",
            "growth": "+45%",
            "demand": "🔥🔥🔥",
            "avg_salary": "$145,000",
            "icon": "🤖",
            "color": "#8b5cf6"
        },
        {
            "role": "Cloud Architect",
            "growth": "+32%",
            "demand": "🔥🔥🔥",
            "avg_salary": "$155,000",
            "icon": "☁️",
            "color": "#3b82f6"
        },
        {
            "role": "DevOps Engineer",
            "growth": "+28%",
            "demand": "🔥🔥",
            "avg_salary": "$135,000",
            "icon": "⚙️",
            "color": "#10b981"
        },
        {
            "role": "Data Scientist",
            "growth": "+25%",
            "demand": "🔥🔥",
            "avg_salary": "$140,000",
            "icon": "📊",
            "color": "#f59e0b"
        },
        {
            "role": "Cybersecurity Analyst",
            "growth": "+35%",
            "demand": "🔥🔥🔥",
            "avg_salary": "$125,000",
            "icon": "🛡️",
            "color": "#ef4444"
        }
    ]
    return {"success": True, "trending": trending}

# ==================== Initialize Services ====================
summarizer = GroqSummarizer()  # EXISTING - DO NOT MODIFY
resume_analyzer = ResumeAnalyzer()  # NEW - Added separately
quiz_bank = QuizBank()  # NEW - Quiz Bank

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

# ==================== NEW RESUME ANALYZER ENDPOINTS ====================

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
        resume_text = summarizer.extract_pdf_text(content)
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

# ==================== NEW QUIZ BANK ENDPOINTS ====================

@app.post("/quiz/generate")
async def generate_quiz(request: QuizRequest):
    """Generate quiz questions on a topic (NEW)"""
    if not request.topic.strip():
        raise HTTPException(400, "Topic is required")
    
    # Validate question count
    if request.num_questions not in [5, 10, 20, 30]:
        request.num_questions = 5
    
    quiz_data = quiz_bank.generate_quiz(
        topic=request.topic,
        num_questions=request.num_questions,
        difficulty=request.difficulty
    )
    
    return {
        "topic": request.topic,
        "questions": quiz_data["questions"],
        "total_questions": len(quiz_data["questions"])
    }

@app.post("/quiz/evaluate")
async def evaluate_quiz(submission: QuizSubmission):
    """Evaluate quiz answers and return score (NEW)"""
    if not submission.questions or not submission.answers:
        raise HTTPException(400, "Questions and answers are required")
    
    if len(submission.questions) != len(submission.answers):
        raise HTTPException(400, "Number of questions and answers must match")
    
    result = quiz_bank.evaluate_quiz(submission.questions, submission.answers)
    return result

@app.get("/quiz/topics")
async def get_suggested_topics():
    """Get suggested quiz topics (NEW)"""
    topics = [
        "Python Programming",
        "Machine Learning",
        "Data Structures",
        "Algorithms",
        "Web Development",
        "Database Systems",
        "Cloud Computing",
        "Cybersecurity",
        "Artificial Intelligence",
        "Software Engineering",
        "React.js",
        "Docker & Kubernetes",
        "AWS Services",
        "JavaScript",
        "Java Programming"
    ]
    return {"suggested_topics": topics}

@app.get("/")
def home():
    return {
        "service": "AI Text Summarizer (Groq)",
        "version": "1.2.0",
        "status": "running",
        "summarizer_ready": summarizer.llm is not None,
        "resume_analyzer_ready": resume_analyzer.llm is not None,
        "quiz_bank_ready": quiz_bank.llm is not None,
        "available_endpoints": [
            "/health",
            "/summarize/text",
            "/summarize/pdf",
            "/analyze/text",
            "/analyze/file",
            "/rewrite",
            "/skill-suggestions",
            "/quiz/generate",
            "/quiz/evaluate",
            "/quiz/topics"
        ]
    }

# ==================== Run Server ====================
if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*60)
    print("🚀 Starting Groq-powered Service on http://127.0.0.1:8001")
    print("✅ Existing summarizer endpoints preserved")
    print("✅ Resume analyzer endpoints preserved")
    print("✅ NEW: Quiz Bank endpoints added")
    print("="*60)
    print("\n📋 Available Endpoints:")
    print("   [EXISTING] GET  /health")
    print("   [EXISTING] POST /summarize/text")
    print("   [EXISTING] POST /summarize/pdf")
    print("   [EXISTING] POST /analyze/text")
    print("   [EXISTING] POST /analyze/file")
    print("   [EXISTING] POST /rewrite")
    print("   [EXISTING] GET  /skill-suggestions")
    print("   [NEW]      POST /quiz/generate")
    print("   [NEW]      POST /quiz/evaluate")
    print("   [NEW]      GET  /quiz/topics")
    print("="*60 + "\n")
    
    uvicorn.run(app, host="127.0.0.1", port=8001)