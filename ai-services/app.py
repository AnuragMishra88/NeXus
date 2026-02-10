import os
import tempfile
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
import PyPDF2

load_dotenv()

# ==================== FastAPI App ====================
app = FastAPI(title="AI Text Summarizer (Groq)", version="1.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjusted for easier connectivity
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== Models ====================
class TextRequest(BaseModel):
    text: str
    summary_type: str = "concise"

# ==================== Summarizer Class ====================
class GroqSummarizer:
    def __init__(self):
        self.groq_api_key = "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"
        
        if not self.groq_api_key:
            print("⚠️  WARNING: GROQ_API_KEY not found in .env!")
            self.llm = None
        else:
            try:
                # Using Groq's fast Llama 3 model
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
        
        # Chat-specific prompt templates
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
            # Using ChatPromptTemplate for better results with ChatGroq
            template = self.prompt_configs.get(summary_type, self.prompt_configs["concise"])
            prompt = ChatPromptTemplate.from_messages([
                ("system", "You are an expert educational assistant specializing in clear, accurate summarization."),
                ("user", template)
            ])
            
            chain = prompt | self.llm | self.parser
            
            # Groq can handle more tokens, but we'll cap for speed
            result = chain.invoke({"text": text[:8000]})
            return result.strip()
            
        except Exception as e:
            print(f"Summarization error: {e}")
            return f"Error during summarization: {str(e)}"

    def extract_pdf_text(self, pdf_bytes: bytes) -> str:
        """Robust PDF extraction using a temporary file context"""
        tmp_path = None
        try:
            with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
                tmp.write(pdf_bytes)
                tmp_path = tmp.name
            
            text = ""
            with open(tmp_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                # Read more pages if needed, Groq has a large context window
                num_pages = min(10, len(reader.pages))
                for i in range(num_pages):
                    page_text = reader.pages[i].extract_text()
                    if page_text:
                        text += page_text + "\n"
            return text.strip()
        finally:
            if tmp_path and os.path.exists(tmp_path):
                os.unlink(tmp_path)

summarizer = GroqSummarizer()

# ==================== API Endpoints ====================

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

if __name__ == "__main__":
    import uvicorn
    print("\n🚀 Starting Groq-powered Summarizer on http://127.0.0.1:8001")
    uvicorn.run(app, host="127.0.0.1", port=8001)