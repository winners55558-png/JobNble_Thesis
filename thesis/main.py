import os
import json
import google.generativeai as genai
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

RAW_API_KEY = os.getenv("GEMINI_API_KEY", "")
CLEAN_API_KEY = "".join(RAW_API_KEY.split())
genai.configure(api_key=CLEAN_API_KEY, transport="rest")
model = genai.GenerativeModel('gemini-2.5-flash')

class ResumeData(BaseModel):
    content: str
    section: str       

class MatchData(BaseModel):
    job_title: str
    job_desc: str
    req_skills: str
    education_history: str
    experience_and_activities: str
    skills_and_custom_skills: str
    inspiration_message: str

@app.post("/api/ai/coach")
async def ai_coach(data: ResumeData):
    try:
        if not CLEAN_API_KEY: return {"suggestion": "⚠️ ไม่พบ API Key"}
        if not data.content: return {"suggestion": "กรุณาพิมพ์ข้อมูลก่อน"}

        prompt = f"""คุณคือนักเขียนเรซูเม่มืออาชีพ หน้าที่ของคุณคือการนำข้อความดิบที่ผู้ใช้พิมพ์ มาเกลาใหม่ให้ดูเป็นมืออาชีพ เป็นทางการ และดึงดูดนายจ้าง 
        กฎเหล็ก: ห้ามพิมพ์คำทักทาย ห้ามพิมพ์คำอธิบาย ห้ามใส่เครื่องหมายคำพูด (") ให้ตอบกลับเฉพาะ 'เนื้อหาที่เกลาเสร็จแล้ว' เท่านั้น
        ข้อความต้นฉบับ (หมวด {data.section}): "{data.content}"
        """
        response = model.generate_content(prompt)
        return {"suggestion": response.text.strip()}
    except Exception as e:
        return {"suggestion": data.content}

@app.post("/api/ai/match")
async def ai_match_job(data: MatchData):
    try:
        prompt = f"""
        คุณคือ HR มืออาชีพระดับ Senior ที่เชี่ยวชาญด้าน Inclusive Employment (การจ้างงานผู้พิการ) 
        หน้าที่ของคุณคือการให้คะแนนความเหมาะสมระหว่าง "เรซูเม่ของผู้สมัคร" และ "ประกาศงาน" โดยให้คะแนนเต็ม 80 คะแนน (อีก 20 คะแนนระบบจัดการแล้ว)

        ข้อมูลประกาศงาน (Job Post):
        - ตำแหน่ง: {data.job_title}
        - รายละเอียดงาน: {data.job_desc}
        - ทักษะที่ต้องการ: {data.req_skills}

        ข้อมูลผู้สมัคร (Resume):
        - ประวัติการศึกษา: {data.education_history}
        - ประสบการณ์ทำงาน/ฝึกงาน/กิจกรรม: {data.experience_and_activities}
        - ทักษะทั้งหมด: {data.skills_and_custom_skills}
        - แรงบันดาลใจ (Summary): {data.inspiration_message}

        เกณฑ์การให้คะแนน (จำลองความคิดแบบ HR):
        1. Skills Match (0-25 คะแนน): ทักษะตรงกับความต้องการไหม? (ให้คะแนนความเชื่อมโยงด้วย แม้ชื่อทักษะไม่ตรงเป๊ะ)
        2. Experience Match (0-30 คะแนน): ประสบการณ์หรือกิจกรรมที่ผ่านมา นำมาประยุกต์ใช้กับงานนี้ได้มากน้อยแค่ไหน?
        3. Education Match (0-15 คะแนน): สาขาที่จบมาและเกรดเฉลี่ย ซัพพอร์ตการทำตำแหน่งนี้หรือไม่?
        4. Attitude Match (0-10 คะแนน): ทัศนคติจากแรงบันดาลใจ ดูมุ่งมั่นและพร้อมทำงานนี้หรือไม่?

        [บังคับรูปแบบการตอบกลับ] ตอบกลับเป็น JSON เท่านั้น ห้ามมี Markdown หรือ Text อื่นๆ ปน:
        {{
        "scores": {{
            "skills_score": <ตัวเลข>,
            "experience_score": <ตัวเลข>,
            "education_score": <ตัวเลข>,
            "attitude_score": <ตัวเลข>
        }},
        "total_ai_score": <ผลรวมของ 4 ช่องบน (เต็ม 80)>,
        "match_reasons": [
            "เหตุผลเชิงบวกหรือสิ่งที่สอดคล้อง (สั้นๆ 1 บรรทัด)",
            "เหตุผลเชิงบวกที่ 2 หรือจุดที่ควรพัฒนา (สั้นๆ 1 บรรทัด)"
        ]
        }}
        """
        response = model.generate_content(prompt, generation_config=genai.types.GenerationConfig(response_mime_type="application/json"))
        return json.loads(response.text)
    except Exception as e:
        print(f"🔥 AI Match Error: {e}")
        return {"total_ai_score": 35, "match_reasons": ["🤖 ระบบ AI ไม่สามารถวิเคราะห์เชิงลึกได้ในขณะนี้ แต่พิจารณาจากข้อมูลเบื้องต้น"]}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)