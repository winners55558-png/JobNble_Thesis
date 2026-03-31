import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv

# โหลดค่าจากไฟล์ .env
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ดึง API Key
RAW_API_KEY = os.getenv("AIzaSyC7q5ZVB0Z2eCsNlY35DuFoFJMoZnzIlXI", "")
CLEAN_API_KEY = "".join(RAW_API_KEY.split())

genai.configure(api_key=CLEAN_API_KEY, transport="rest")

# ใช้โมเดลล่าสุด
model = genai.GenerativeModel('gemini-2.5-flash')

class ResumeData(BaseModel):
    content: str
    section: str       

@app.post("/api/ai/coach")
async def ai_coach(data: ResumeData):
    try:
        if not CLEAN_API_KEY:
            return {"suggestion": "⚠️ ไม่พบ API Key"}

        if not data.content:
            return {"suggestion": "กรุณาพิมพ์ข้อมูลก่อน"}

        # 🎯 Prompt บังคับให้ AI ตอบแค่ข้อความเพียวๆ ห้ามมีคำอธิบาย เพื่อให้สคริปต์หน้าเว็บดึงไปวางทับได้เลย
        prompt = f"""คุณคือนักเขียนเรซูเม่มืออาชีพ หน้าที่ของคุณคือการนำข้อความดิบที่ผู้ใช้พิมพ์ มาเกลาใหม่ให้ดูเป็นมืออาชีพ เป็นทางการ และดึงดูดนายจ้าง 
        กฎเหล็ก: ห้ามพิมพ์คำทักทาย ห้ามพิมพ์คำอธิบาย ห้ามใส่เครื่องหมายคำพูด (") ให้ตอบกลับเฉพาะ 'เนื้อหาที่เกลาเสร็จแล้ว' เท่านั้น

        ข้อความต้นฉบับ (หมวด {data.section}):
        "{data.content}"
        """
        
        response = model.generate_content(prompt)
        return {"suggestion": response.text.strip()}
        
    except Exception as e:
        print(f"🔥 AI Error: {e}")
        return {"suggestion": data.content} # ถ้า AI ขัดข้อง ให้คืนค่าเดิมกลับไป จะได้ไม่ลบข้อความของผู้ใช้

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)