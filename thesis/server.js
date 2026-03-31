const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios'); 

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// 🌟 สั่งให้ Server สามารถเปิดไฟล์ HTML, CSS, JS ทุกไฟล์ในโฟลเดอร์นี้ได้ (แก้ปัญหา Cannot GET)
app.use(express.static(__dirname)); 

// 1. การเชื่อมต่อ MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'jobnble_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('เชื่อมต่อ MySQL สำเร็จ!');
});

// 2. API สำหรับสมัครสมาชิก (ผู้หางาน)
app.post('/api/register/seeker', (req, res) => {
    const { first_name, last_name, phone, email, password } = req.body;
    const sql = "INSERT INTO job_seekers (first_name, last_name, phone, email, password) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [first_name, last_name, phone, email, password], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: "สมัครสมาชิกผู้หางานเรียบร้อยแล้ว" });
    });
});

// 2.5 API สำหรับสมัครสมาชิก (นายจ้าง) - เพิ่มเข้ามาใหม่
app.post('/api/register/employer', (req, res) => {
    const { company_name, phone, address, tax_id, email, password } = req.body;
    const sql = "INSERT INTO employers (company_name, phone, address, tax_id, email, password) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [company_name, phone, address, tax_id, email, password], (err) => {
        if (err) {
            // เช็คกรณีอีเมลซ้ำ (ถ้าทำ Unique ไว้ใน Database)
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ success: false, message: "อีเมลนี้ถูกใช้งานแล้ว" });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, message: "สมัครสมาชิกนายจ้างเรียบร้อยแล้ว" });
    });
});

// 3. API สำหรับเข้าสู่ระบบ (Login - ใช้ร่วมกันทั้ง 2 ประเภทโดยเช็คจาก type)
app.post('/api/login', (req, res) => {
    const { email, password, type } = req.body;
    const table = type === 'seeker' ? 'job_seekers' : 'employers';
    const sql = `SELECT id, email, ${type === 'seeker' ? 'first_name' : 'company_name'} as name FROM ${table} WHERE email = ? AND password = ?`;
    
    db.query(sql, [email, password], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            res.json({ success: true, type: type, user: results[0] });
        } else {
            res.status(401).json({ success: false, message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
        }
    });
});

// 4. API สำหรับบันทึกเรซูเม่ (รองรับข้อมูลแบบ JSON Array จากฟอร์ม Add More)
app.post('/api/save-resume', (req, res) => {
    const { 
        seeker_id, first_name, last_name, phone, email, 
        dob, address, province, district, sub_district, zipcode,
        disability_type, disability_level, summary, skills, 
        education_history, work_experience, intern_experience, activities, portfolio_url
    } = req.body;

    const updateSeekerSql = `UPDATE job_seekers SET first_name=?, last_name=?, phone=?, email=? WHERE id=?`;
    db.query(updateSeekerSql, [first_name, last_name, phone, email, seeker_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        const checkResumeSql = `SELECT id FROM resumes WHERE seeker_id = ?`;
        db.query(checkResumeSql, [seeker_id], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            const eduStr = JSON.stringify(education_history || []);
            const workStr = JSON.stringify(work_experience || []);
            const internStr = JSON.stringify(intern_experience || []);
            const actStr = JSON.stringify(activities || []);

            if (results.length > 0) {
                const updateResume = `UPDATE resumes SET dob=?, disability_type=?, disability_level=?, address=?, sub_district=?, district=?, province=?, zipcode=?, summary=?, skills=?, education_history=?, work_experience=?, intern_experience=?, activities=?, portfolio_url=? WHERE seeker_id=?`;
                db.query(updateResume, [dob, disability_type, disability_level, address, sub_district, district, province, zipcode, summary, skills, eduStr, workStr, internStr, actStr, portfolio_url, seeker_id]);
            } else {
                const insertResume = `INSERT INTO resumes (seeker_id, dob, disability_type, disability_level, address, sub_district, district, province, zipcode, summary, skills, education_history, work_experience, intern_experience, activities, portfolio_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                db.query(insertResume, [seeker_id, dob, disability_type, disability_level, address, sub_district, district, province, zipcode, summary, skills, eduStr, workStr, internStr, actStr, portfolio_url]);
            }
            res.json({ success: true, message: "บันทึกข้อมูลเรซูเม่สำเร็จ!" });
        });
    });
});

// 5. API โหลดข้อมูลเรซูเม่ของ User
app.get('/api/get-resume/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = `
        SELECT s.first_name, s.last_name, s.phone, s.email, r.* FROM job_seekers s 
        LEFT JOIN resumes r ON s.id = r.seeker_id 
        WHERE s.id = ?
    `;
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.json({});
        }
    });
});

// 6. API โหลดงานทั้งหมด (สำหรับทำ Ranking)
app.get('/api/jobs', (req, res) => {
    const sql = `
        SELECT j.*, e.company_name 
        FROM jobs_post j 
        JOIN employers e ON j.employer_id = e.id 
        WHERE j.status = 'open' OR j.status IS NULL
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 7. API ยิงไปหา Python AI
app.post('/api/get-ai-feedback', async (req, res) => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/ai/coach', req.body);
        res.json(response.data);
    } catch (error) {
        console.error("🔥 Node.js to Python Error:", error.message);
        res.json({ suggestion: req.body.content }); // ถ้าพัง คืนข้อความเดิมไป
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});