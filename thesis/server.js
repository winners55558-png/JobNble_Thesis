const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios'); 

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); 

// ==========================================
// 1. การเชื่อมต่อ MySQL
// ==========================================
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

// ==========================================
// 🛡️ ฟังก์ชันช่วยเหลือ (Helper) ป้องกันค่า Null
// ==========================================
const safeStr = (val) => {
    if (val === undefined || val === null) return '';
    return val;
};

const safeJson = (val) => {
    if (val === undefined || val === null || val === '') return '[]';
    return val;
};

// ==========================================
// 2. API สมัครสมาชิก (ผู้หางาน)
// ==========================================
app.post('/api/register/seeker', (req, res) => {
    const { first_name, last_name, phone, email, password } = req.body;
    const sql = "INSERT INTO job_seekers (first_name, last_name, phone, email, password) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sql, [safeStr(first_name), safeStr(last_name), safeStr(phone), safeStr(email), safeStr(password)], (err) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "อีเมลนี้มีผู้ใช้งานแล้ว" });
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, message: 'สมัครสมาชิกสำเร็จ!' });
    });
});

// ==========================================
// 3. API สมัครสมาชิก (นายจ้าง)
// ==========================================
app.post('/api/register/employer', (req, res) => {
    const { company_name, phone, address, tax_id, email, password } = req.body;
    const sql = "INSERT INTO employers (company_name, phone, address, tax_id, email, password) VALUES (?, ?, ?, ?, ?, ?)";
    
    db.query(sql, [safeStr(company_name), safeStr(phone), safeStr(address), safeStr(tax_id), safeStr(email), safeStr(password)], (err) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "อีเมลนี้มีผู้ใช้งานแล้ว" });
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, message: "สมัครสมาชิกบริษัทเรียบร้อยแล้ว" });
    });
});

// ==========================================
// 4. API เข้าสู่ระบบ (รองรับทั้ง 2 ฝั่ง)
// ==========================================
app.post('/api/login', (req, res) => {
    const { email, password, type } = req.body;
    const table = type === 'seeker' ? 'job_seekers' : 'employers';
    const sql = `SELECT id, email, ${type === 'seeker' ? 'first_name' : 'company_name'} as name FROM ${table} WHERE email = ? AND password = ?`;
    
    db.query(sql, [email, password], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) res.json({ success: true, type: type, user: results[0] });
        else res.status(401).json({ success: false, message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    });
});

// ==========================================
// 5. API บันทึกข้อมูลเรซูเม่ (อัปเดตรับค่า job_position)
// ==========================================
app.post('/api/save-resume', (req, res) => {
    const { 
        seeker_id, first_name, last_name, phone, email, 
        dob, address, province, district, sub_district, zipcode,
        disability_type, disability_level, summary, skills, 
        education_history, work_experience, intern_experience, activities, portfolio_url,
        selected_template, 
        job_position // รับค่าตำแหน่งงานที่ต้องการ
    } = req.body;

    const safeDob = dob ? dob : '1970-01-01';

    const updateSeekerSql = `UPDATE job_seekers SET first_name=?, last_name=?, phone=?, email=? WHERE id=?`;
    db.query(updateSeekerSql, [safeStr(first_name), safeStr(last_name), safeStr(phone), safeStr(email), seeker_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query(`SELECT id FROM resumes WHERE seeker_id = ?`, [seeker_id], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            const eduStr = safeJson(JSON.stringify(education_history));
            const workStr = safeJson(JSON.stringify(work_experience));
            const internStr = safeJson(JSON.stringify(intern_experience));
            const actStr = safeJson(JSON.stringify(activities));
            
            const highestEdu = (education_history && education_history.length > 0) ? education_history[0].level : '';
            const expStr = "ทำงาน: " + workStr + " ฝึกงาน: " + internStr;

            if (results.length > 0) {
                // UPDATE (เพิ่ม job_position)
                const updateResume = `UPDATE resumes SET 
                    dob=?, disability_type=?, disability_level=?, address=?, sub_district=?, district=?, province=?, zipcode=?, 
                    summary=?, skills=?, education_history=?, work_experience=?, intern_experience=?, activities=?, portfolio_url=?,
                    education_level=?, experience=?, portfolio=?, selected_template=?, job_position=?
                    WHERE seeker_id=?`;
                
                db.query(updateResume, [
                    safeDob, safeStr(disability_type), safeStr(disability_level), safeStr(address), safeStr(sub_district), safeStr(district), safeStr(province), safeStr(zipcode), 
                    safeStr(summary), safeStr(skills), eduStr, workStr, internStr, actStr, safeStr(portfolio_url),
                    safeStr(highestEdu), expStr, '', safeStr(selected_template), safeStr(job_position),
                    seeker_id
                ], (err) => {
                     if (err) return res.status(500).json({ error: err.message });
                     res.json({ success: true, message: "อัปเดตข้อมูลเรซูเม่และเทมเพลตสำเร็จ!" });
                });
            } else {
                // INSERT (เพิ่ม job_position)
                const insertResume = `INSERT INTO resumes (
                    seeker_id, dob, disability_type, disability_level, address, sub_district, district, province, zipcode, 
                    summary, skills, education_history, work_experience, intern_experience, activities, portfolio_url,
                    education_level, experience, portfolio, selected_template, job_position
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                
                db.query(insertResume, [
                    seeker_id, safeDob, safeStr(disability_type), safeStr(disability_level), safeStr(address), safeStr(sub_district), safeStr(district), safeStr(province), safeStr(zipcode), 
                    safeStr(summary), safeStr(skills), eduStr, workStr, internStr, actStr, safeStr(portfolio_url),
                    safeStr(highestEdu), expStr, '', safeStr(selected_template), safeStr(job_position)
                ], (err) => {
                     if (err) return res.status(500).json({ error: err.message });
                     res.json({ success: true, message: "บันทึกข้อมูลเรซูเม่และเทมเพลตสำเร็จ!" });
                });
            }
        });
    });
});

// ==========================================
// 6. API บันทึก Theme เรซูเม่ (ใช้แยกต่างหากได้เผื่อผู้ใช้อยากแก้แค่ธีม)
// ==========================================
app.post('/api/update-template', (req, res) => {
    const { seeker_id, selected_template } = req.body;
    const sql = `UPDATE resumes SET selected_template=? WHERE seeker_id=?`;
    db.query(sql, [safeStr(selected_template), seeker_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: "อัปเดตเทมเพลตสำเร็จ" });
    });
});

// ==========================================
// 7. API โหลดข้อมูลเรซูเม่ / โหลดข้อมูลนายจ้าง
// ==========================================
app.get('/api/get-resume/:userId', (req, res) => {
    const sql = `SELECT s.first_name, s.last_name, s.phone, s.email, r.* FROM job_seekers s LEFT JOIN resumes r ON s.id = r.seeker_id WHERE s.id = ?`;
    db.query(sql, [req.params.userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results.length > 0 ? results[0] : {});
    });
});

app.get('/api/get-employer/:userId', (req, res) => {
    const sql = `SELECT company_name, email, phone, address, tax_id FROM employers WHERE id = ?`;
    db.query(sql, [req.params.userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results.length > 0 ? results[0] : {});
    });
});

// ==========================================
// 8. API โหลดประกาศงานทั้งหมด
// ==========================================
app.get('/api/jobs', (req, res) => {
    const sql = `SELECT j.*, e.company_name FROM jobs_post j JOIN employers e ON j.employer_id = e.id WHERE j.status = 'open' OR j.status IS NULL`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ==========================================
// 9. API โพสต์ประกาศงาน (นายจ้าง)
// ==========================================
app.post('/api/save-job', (req, res) => {
    const { 
        employer_id, job_title, job_category, job_type, job_location, job_salary, 
        facility_desc, job_description, job_qualifications, disability_type, req_skills, status 
    } = req.body;

    // นำรายละเอียดงาน + คุณสมบัติ มาต่อกันเพื่อเซฟลงคอลัมน์ job_desc
    const combined_job_desc = `รายละเอียดงาน:\n${job_description}\n\nคุณสมบัติผู้สมัคร:\n${job_qualifications}`;

    const sql = `
        INSERT INTO jobs_post 
        (employer_id, job_title, job_category, job_type, disability_type, disability_level, salary, job_location, accommodation, job_desc, req_skills, req_experience, req_portfolio, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        employer_id, 
        safeStr(job_title), 
        safeStr(job_category), 
        safeStr(job_type), 
        safeStr(disability_type), 
        'ไม่ระบุระดับ', // คอลัมน์ที่ไม่ได้ส่งมาจาก HTML ใส่ค่า Default ไปกัน Null
        safeStr(job_salary), 
        safeStr(job_location), 
        safeStr(facility_desc), 
        safeStr(combined_job_desc), 
        safeStr(req_skills), 
        '', // req_experience
        '', // req_portfolio
        safeStr(status || 'open')
    ], (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, message: "โพสต์ประกาศงานสำเร็จ", job_id: results.insertId });
    });
});

// ==========================================
// 10. API บันทึกการสมัครงาน
// ==========================================
app.post('/api/apply-job', (req, res) => {
    const { seeker_id, job_id, match_score, match_details } = req.body;
    const score = match_score || 0;
    const detailsJson = safeJson(JSON.stringify(match_details || []));

    const sql = `INSERT INTO applications (seeker_id, job_id, match_score, match_details, status) VALUES (?, ?, ?, ?, 'pending')`;
    db.query(sql, [seeker_id, job_id, score, detailsJson], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: "ส่งใบสมัครเรียบร้อยแล้ว" });
    });
});

// ==========================================
// 11. API เชื่อมต่อ Python (AI)
// ==========================================
app.post('/api/get-ai-feedback', async (req, res) => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/ai/coach', req.body);
        res.json(response.data);
    } catch (error) { res.json({ suggestion: req.body.content }); }
});

// ==========================================
// 12. API โหลดข้อมูลประกาศงานแบบเจาะจง (1 งาน)
// ==========================================
app.get('/api/get-job/:jobId', (req, res) => {
    const sql = `SELECT j.*, e.company_name FROM jobs_post j JOIN employers e ON j.employer_id = e.id WHERE j.id = ?`;
    db.query(sql, [req.params.jobId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results.length > 0 ? results[0] : {});
    });
});

app.post('/api/get-ai-match', async (req, res) => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/ai/match', req.body);
        res.json(response.data);
    } catch (error) { res.json({ total_ai_score: 35, match_reasons: ["🤖 เกิดข้อผิดพลาดในการเชื่อมต่อ AI ประเมินจากข้อมูลพื้นฐาน"] }); }
});

// ==========================================
// 🌟 13. API โหลดประวัติโพสต์ประกาศงานของนายจ้าง (ดึงเฉพาะ Account นี้)
// ==========================================
app.get('/api/get-employer-jobs/:employerId', (req, res) => {
    const sql = `SELECT * FROM jobs_post WHERE employer_id = ? ORDER BY id DESC`;
    db.query(sql, [req.params.employerId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.listen(port, () => console.log(`Server running on port ${port}`));