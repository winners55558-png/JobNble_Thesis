/* =========================================
   === JAVASCRIPT: รวมฟังก์ชันทั้งหมด ===
========================================= */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ACCESSIBLE NAVBAR ---
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        const button = item.querySelector('.nav-link-btn');
        const dropdownMenu = item.querySelector('.dropdown-menu');

        if (button && dropdownMenu) {
            button.addEventListener('click', (event) => {
                event.preventDefault(); 
                event.stopPropagation();

                navItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherBtn = otherItem.querySelector('.nav-link-btn');
                        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                        const otherMenu = otherItem.querySelector('.dropdown-menu');
                        if (otherMenu) otherMenu.setAttribute('hidden', '');
                    }
                });

                const isActive = item.classList.contains('active');
                if (isActive) {
                    item.classList.remove('active');
                    button.setAttribute('aria-expanded', 'false');
                    dropdownMenu.setAttribute('hidden', '');
                } else {
                    item.classList.add('active');
                    button.setAttribute('aria-expanded', 'true');
                    dropdownMenu.removeAttribute('hidden');
                    
                    const firstMenuItem = dropdownMenu.querySelector('a');
                    if (firstMenuItem) {
                        setTimeout(() => firstMenuItem.focus(), 100); 
                    }
                }
            });

            item.addEventListener('keydown', (e) => {
                if (!item.classList.contains('active')) return;
                
                const menuItems = Array.from(dropdownMenu.querySelectorAll('a'));
                if (menuItems.length === 0) return;

                const firstItem = menuItems[0];
                const lastItem = menuItems[menuItems.length - 1];
                let currentFocus = document.activeElement;

                switch (e.key) {
                    case 'ArrowDown':
                    case 'ArrowRight':
                        e.preventDefault();
                        if (currentFocus === button) {
                            firstItem.focus();
                        } else {
                            const currentIndex = menuItems.indexOf(currentFocus);
                            const nextIndex = (currentIndex + 1) % menuItems.length;
                            menuItems[nextIndex].focus();
                        }
                        break;
                    case 'ArrowUp':
                    case 'ArrowLeft':
                        e.preventDefault();
                        if (currentFocus === button) {
                            lastItem.focus();
                        } else {
                            const currentIndex = menuItems.indexOf(currentFocus);
                            const prevIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
                            menuItems[prevIndex].focus();
                        }
                        break;
                    case 'Escape':
                    case 'Tab':
                        if (item.classList.contains('active')) {
                            item.classList.remove('active');
                            button.setAttribute('aria-expanded', 'false');
                            dropdownMenu.setAttribute('hidden', '');
                            if (e.key === 'Escape') button.focus(); 
                        }
                        break;
                }
            });
        }
    });

    document.body.addEventListener('click', () => {
        navItems.forEach(item => {
            if (item.classList.contains('active')) {
                item.classList.remove('active');
                const button = item.querySelector('.nav-link-btn');
                if (button) button.setAttribute('aria-expanded', 'false');
                const dropdownMenu = item.querySelector('.dropdown-menu');
                if (dropdownMenu) dropdownMenu.setAttribute('hidden', '');
            }
        });
    });

    // --- 2. ข่าวสาร (News Slider) ---
    const track = document.querySelector('.carousel-track');
    if (track) { 
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.right-btn');
        const prevButton = document.querySelector('.left-btn');
        const dotsNav = document.querySelector('.carousel-nav');
        const dots = dotsNav ? Array.from(dotsNav.children) : [];

        if (slides.length > 0) {
            const slideWidth = slides[0].getBoundingClientRect().width;
            const setSlidePosition = (slide, index) => {
                slide.style.left = slideWidth * index + 'px';
            };
            slides.forEach(setSlidePosition);

            const moveToSlide = (carouselTrack, currentSlide, targetSlide) => {
                if(!targetSlide) return;
                carouselTrack.style.transform = 'translateX(-' + targetSlide.style.left + ')';
                currentSlide.classList.remove('current-slide');
                targetSlide.classList.add('current-slide');
            }

            const updateDots = (currentDot, targetDot) => {
                if(!currentDot || !targetDot) return;
                currentDot.classList.remove('current-indicator');
                targetDot.classList.add('current-indicator');
            }

            if (nextButton && prevButton) {
                nextButton.addEventListener('click', () => {
                    const currentSlide = track.querySelector('.current-slide');
                    let nextSlide = currentSlide.nextElementSibling;
                    const currentDot = dotsNav ? dotsNav.querySelector('.current-indicator') : null;
                    let nextDot = currentDot ? currentDot.nextElementSibling : null;
                    
                    if(!nextSlide) {
                        nextSlide = slides[0];
                        nextDot = dots[0];
                    }
                    moveToSlide(track, currentSlide, nextSlide);
                    updateDots(currentDot, nextDot);
                });

                prevButton.addEventListener('click', () => {
                    const currentSlide = track.querySelector('.current-slide');
                    let prevSlide = currentSlide.previousElementSibling;
                    const currentDot = dotsNav ? dotsNav.querySelector('.current-indicator') : null;
                    let prevDot = currentDot ? currentDot.previousElementSibling : null;
                    
                    if(!prevSlide) {
                        prevSlide = slides[slides.length - 1];
                        prevDot = dots[dots.length - 1];
                    }
                    moveToSlide(track, currentSlide, prevSlide);
                    updateDots(currentDot, prevDot);
                });
            }

            if (dotsNav) {
                dotsNav.addEventListener('click', e => {
                    const targetDot = e.target.closest('button');
                    if (!targetDot) return;
                    const currentSlide = track.querySelector('.current-slide');
                    const currentDot = dotsNav.querySelector('.current-indicator');
                    const targetIndex = dots.findIndex(dot => dot === targetDot);
                    const targetSlide = slides[targetIndex];

                    moveToSlide(track, currentSlide, targetSlide);
                    updateDots(currentDot, targetDot);
                });
            }
        }
    }

    // --- 3. ควบคุม Slider งานที่กำลังได้รับความนิยม ---
    const jobTrack = document.querySelector('.job-track');
    if (jobTrack) {
        const jobNextBtn = document.querySelector('.job-next-btn');
        const jobPrevBtn = document.querySelector('.job-prev-btn');

        if (jobNextBtn && jobPrevBtn) {
            jobNextBtn.addEventListener('click', () => {
                jobTrack.style.transform = 'translateX(calc(-100% - 30px))';
            });

            jobPrevBtn.addEventListener('click', () => {
                jobTrack.style.transform = 'translateX(0)';
            });
        }
    }

    // --- 4. ควบคุม Slider บริษัทที่โพสต์ประกาศงาน ---
    const empTrack = document.querySelector('.employer-track');
    if (empTrack) {
        const empNextBtn = document.querySelector('.next-employer-btn');
        const empPrevBtn = document.querySelector('.prev-employer-btn');
        
        if (empNextBtn && empPrevBtn) {
            empNextBtn.addEventListener('click', () => {
                empTrack.style.transform = 'translateX(-750px)';
            });

            empPrevBtn.addEventListener('click', () => {
                empTrack.style.transform = 'translateX(0)';
            });
        }
    }

    // --- 5. ควบคุมปุ่มดูรหัสผ่าน (Show/Hide Password) ---
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('svg');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
            } else {
                input.type = 'password';
                icon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
            }
        });
    });

    // --- 6. ควบคุมฟอร์ม สมัครสมาชิก/เข้าสู่ระบบ (Job Seeker) ---
    const registerForm = document.getElementById('register-form');
    const successModal = document.getElementById('success-modal');

    if (registerForm && successModal) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            const fullName = document.getElementById('reg-name').value.split(' ');
            const first_name = fullName[0] || '';
            const last_name = fullName.slice(1).join(' ') || '';
            const phone = document.getElementById('reg-phone').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;

            try {
                const res = await fetch('http://localhost:3000/api/register/seeker', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ first_name, last_name, phone, email, password })
                });
                
                const data = await res.json();
                if(data.success) {
                    successModal.style.display = 'flex';
                    setTimeout(() => {
                        successModal.style.display = 'none';
                        registerForm.reset(); 
                    }, 3000);
                } else {
                    alert("❌ เกิดข้อผิดพลาด: " + (data.message || data.error));
                }
            } catch(err) {
                alert("⚠️ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
            }
        });

        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.style.display = 'none';
            }
        });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const type = 'seeker'; 

            try {
                const res = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ email, password, type })
                });
                const data = await res.json();
                
                if (data.success) {
                    sessionStorage.setItem('userName', data.user.name);
                    sessionStorage.setItem('userId', data.user.id);
                    sessionStorage.setItem('userType', 'seeker'); // เก็บสถานะว่าล็อกอินเป็นผู้หางาน
                    window.location.href = 'home-jobseeker.html'; 
                } else { 
                    alert("❌ " + data.message); 
                }
            } catch (error) { 
                alert("⚠️ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้"); 
            }
        });
    }

    // --- 7. ควบคุมฟอร์ม สมัครสมาชิก/เข้าสู่ระบบ (Employer) ---
    const empRegisterForm = document.getElementById('employer-register-form');
    const empSuccessModal = document.getElementById('employer-success-modal');

    // จัดการการสมัครสมาชิกนายจ้างผ่าน API
    if (empRegisterForm && empSuccessModal) {
        empRegisterForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            const company_name = document.getElementById('emp-reg-company').value;
            const phone = document.getElementById('emp-reg-phone').value;
            const email = document.getElementById('emp-reg-email').value;
            const address = document.getElementById('emp-reg-address').value;
            const tax_id = document.getElementById('emp-reg-tax').value;
            const password = document.getElementById('emp-reg-password').value;

            try {
                const res = await fetch('http://localhost:3000/api/register/employer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ company_name, phone, address, tax_id, email, password })
                });
                
                const data = await res.json();
                if(data.success) {
                    empSuccessModal.style.display = 'flex';
                    setTimeout(() => {
                        empSuccessModal.style.display = 'none';
                        empRegisterForm.reset(); 
                    }, 3000);
                } else {
                    alert("❌ เกิดข้อผิดพลาด: " + (data.message || data.error));
                }
            } catch(err) {
                alert("⚠️ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
            }
        });

        empSuccessModal.addEventListener('click', (e) => {
            if (e.target === empSuccessModal) {
                empSuccessModal.style.display = 'none';
            }
        });
    }

    // จัดการการเข้าสู่ระบบนายจ้างผ่าน API
    const empLoginForm = document.getElementById('employer-login-form');
    if (empLoginForm) {
        empLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            const email = document.getElementById('emp-login-email').value;
            const password = document.getElementById('emp-login-password').value;
            const type = 'employer'; // ระบุ type เพื่อให้ API รู้ว่าต้องไปค้นหาในตาราง employers

            try {
                const res = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ email, password, type })
                });
                const data = await res.json();
                
                if (data.success) {
                    sessionStorage.setItem('userName', data.user.name);
                    sessionStorage.setItem('userId', data.user.id);
                    sessionStorage.setItem('userType', 'employer'); // เก็บสถานะว่าล็อกอินเป็นนายจ้าง
                    window.location.href = 'home-employer.html'; 
                } else { 
                    alert("❌ " + data.message); 
                }
            } catch (error) { 
                alert("⚠️ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้"); 
            }
        });
    }

    // ==========================================
    // 🌟 ระบบ AI Auto-Replace สำหรับหน้า Resume
    // ==========================================
    const summaryInput = document.querySelector('.resume-textarea'); 
    const skillsInput = document.querySelector('input[placeholder="เช่น ทักษะการเจรจาต่อรอง, พิมพ์ดีดเร็ว 50 คำ/นาที"]');
    
    let aiTypingTimer;

    async function processAIAutoReplace(targetElement, sectionName) {
        if (!targetElement.value || targetElement.value.length < 5) return;

        // เปลี่ยนสีพื้นหลังเล็กน้อยเพื่อให้รู้ว่า AI กำลังทำงาน
        targetElement.style.transition = 'background-color 0.3s ease';
        targetElement.style.backgroundColor = '#f0f9ff'; 
        
        try {
            const res = await fetch('http://localhost:3000/api/get-ai-feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: targetElement.value, section: sectionName })
            });
            const data = await res.json();
            
            // นำข้อความที่เกลาแล้วมาแทนที่ในกล่องทันที
            if (data.suggestion && data.suggestion !== targetElement.value) {
                targetElement.value = data.suggestion;
                // โชว์กรอบสีเขียวแวบหนึ่งให้รู้ว่าเกลาเสร็จแล้ว
                targetElement.style.backgroundColor = '#dcfce7'; 
                setTimeout(() => { targetElement.style.backgroundColor = ''; }, 1000);
            }
        } catch (e) {
            console.error("AI Error:", e);
            targetElement.style.backgroundColor = '';
        }
    }

    // ทำงานเมื่อพิมพ์เสร็จแล้วกดคลิกที่อื่น (Blur)
    if (summaryInput) {
        summaryInput.addEventListener('blur', () => processAIAutoReplace(summaryInput, 'แรงบันดาลใจและสิ่งที่อยากบอกองค์กร'));
    }
    if (skillsInput) {
        skillsInput.addEventListener('blur', () => processAIAutoReplace(skillsInput, 'ทักษะและความสามารถพิเศษ'));
    }


    // --- 8. หน้าฟอร์มกรอกเรซูเม่ (resume.html) ---
    function createDynamicBlock(containerId, htmlContent) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const div = document.createElement('div');
        div.className = 'dynamic-item';
        
        div.innerHTML = htmlContent + '<button type="button" class="btn-remove-item">ลบทิ้ง</button>';
        container.appendChild(div);

        div.querySelector('.btn-remove-item').addEventListener('click', function() {
            div.remove();
        });
    }

    const addEduBtn = document.getElementById('add-edu-btn');
    if (addEduBtn) {
        addEduBtn.addEventListener('click', () => {
            const eduHtml = `
                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">ระดับการศึกษา</label>
                        <select class="form-input custom-select edu-level">
                            <option>มัธยมศึกษาตอนปลาย / ปวช.</option>
                            <option>ปวส.</option>
                            <option>ปริญญาตรี</option>
                            <option>ปริญญาโท</option>
                        </select>
                    </div>
                    <div class="form-col">
                        <label class="form-label">ชื่อสถาบันการศึกษา</label>
                        <input type="text" class="form-input edu-inst" placeholder="เช่น มหาวิทยาลัย...">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">คณะ / สาขาวิชา</label>
                        <input type="text" class="form-input edu-major" placeholder="เช่น บริหารธุรกิจ">
                    </div>
                    <div class="form-col">
                        <label class="form-label">เกรดเฉลี่ย (GPA)</label>
                        <input type="text" class="form-input edu-gpa" placeholder="เช่น 3.50">
                    </div>
                </div>
            `;
            createDynamicBlock('education-container', eduHtml);
        });
    }

    const addWorkBtn = document.getElementById('add-work-btn');
    if (addWorkBtn) {
        addWorkBtn.addEventListener('click', () => {
            const workHtml = `
                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">ตำแหน่ง</label>
                        <input type="text" class="form-input work-title" placeholder="เช่น พนักงานบัญชี">
                    </div>
                    <div class="form-col">
                        <label class="form-label">ชื่อบริษัท / องค์กร</label>
                        <input type="text" class="form-input work-company">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-col full-width">
                        <label class="form-label">ระยะเวลาที่ทำงาน (ปี - ปี)</label>
                        <input type="text" class="form-input work-duration" placeholder="เช่น 2564 - 2566">
                    </div>
                </div>
            `;
            createDynamicBlock('work-container', workHtml);
        });
    }

    const addInternBtn = document.getElementById('add-intern-btn');
    if (addInternBtn) {
        addInternBtn.addEventListener('click', () => {
            const internHtml = `
                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">ตำแหน่งฝึกงาน</label>
                        <input type="text" class="form-input intern-title">
                    </div>
                    <div class="form-col">
                        <label class="form-label">ชื่อบริษัท / องค์กร</label>
                        <input type="text" class="form-input intern-company">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-col full-width">
                        <label class="form-label">ระยะเวลาฝึกงาน</label>
                        <input type="text" class="form-input intern-duration" placeholder="เช่น มิ.ย. 66 - ส.ค. 66">
                    </div>
                </div>
            `;
            createDynamicBlock('intern-container', internHtml);
        });
    }

    const addActivityBtn = document.getElementById('add-activity-btn');
    if (addActivityBtn) {
        addActivityBtn.addEventListener('click', () => {
            const actHtml = `
                <div class="form-row">
                    <div class="form-col full-width">
                        <label class="form-label">ชื่อกิจกรรม / โครงการประกวด</label>
                        <input type="text" class="form-input act-name">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-col full-width">
                        <label class="form-label">บทบาท หรือ รางวัลที่ได้รับ</label>
                        <input type="text" class="form-input act-role" placeholder="เช่น รางวัลชนะเลิศ, หัวหน้าทีม">
                    </div>
                </div>
            `;
            createDynamicBlock('activity-container', actHtml);
        });
    }

    document.addEventListener('change', function(e) {
        if (e.target && e.target.classList.contains('file-input-hidden')) {
            const displaySpan = e.target.nextElementSibling.querySelector('.file-name-text');
            if (displaySpan) {
                displaySpan.textContent = e.target.files[0] ? e.target.files[0].name : 'แนบไฟล์...';
                displaySpan.style.color = e.target.files[0] ? '#013c58' : '#666';
                displaySpan.style.fontWeight = e.target.files[0] ? '600' : 'normal';
            }
        }
    });

    const daySelect = document.getElementById('dob-day');
    const monthSelect = document.getElementById('dob-month');
    const yearSelect = document.getElementById('dob-year');

    if (daySelect && monthSelect && yearSelect) {
        for (let i = 1; i <= 31; i++) {
            let option = document.createElement('option');
            option.value = i; option.text = i;
            daySelect.add(option);
        }

        const monthsThai = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
        monthsThai.forEach((m, index) => {
            let option = document.createElement('option');
            option.value = index + 1; option.text = m;
            monthSelect.add(option);
        });

        const currentYearBE = new Date().getFullYear() + 543;
        for (let i = currentYearBE; i >= currentYearBE - 80; i--) {
            let option = document.createElement('option');
            option.value = i; option.text = i;
            yearSelect.add(option);
        }
    }

    const provSelect = document.getElementById('addr-province');
    const distSelect = document.getElementById('addr-district');
    const subSelect = document.getElementById('addr-subdistrict');
    const zipInput = document.getElementById('addr-zipcode');

    if (provSelect && distSelect && subSelect && zipInput) {
        const thaiProvinces = [
            "กรุงเทพมหานคร", "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร", "ขอนแก่น", "จันทบุรี", "ฉะเชิงเทรา", "ชลบุรี", "ชัยนาท", 
            "ชัยภูมิ", "ชุมพร", "เชียงราย", "เชียงใหม่", "ตรัง", "ตราด", "ตาก", "นครนายก", "นครปฐม", "นครพนม", 
            "นครราชสีมา", "นครศรีธรรมราช", "นครสวรรค์", "นนทบุรี", "นราธิวาส", "น่าน", "บึงกาฬ", "บุรีรัมย์", "ปทุมธานี", "ประจวบคีรีขันธ์", 
            "ปราจีนบุรี", "ปัตตานี", "พระนครศรีอยุธยา", "พะเยา", "พังงา", "พัทลุง", "พิจิตร", "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์", 
            "แพร่", "ภูเก็ต", "มหาสารคาม", "มุกดาหาร", "แม่ฮ่องสอน", "ยโสธร", "ยะลา", "ร้อยเอ็ด", "ระนอง", "ระยอง", 
            "ราชบุรี", "ลพบุรี", "ลำปาง", "ลำพูน", "เลย", "ศรีสะเกษ", "สกลนคร", "สงขลา", "สตูล", "สมุทรปราการ", 
            "สมุทรสงคราม", "สมุทรสาคร", "สระแก้ว", "สระบุรี", "สิงห์บุรี", "สุโขทัย", "สุพรรณบุรี", "สุราษฎร์ธานี", "สุรินทร์", "หนองคาย", 
            "หนองบัวลำภู", "อ่างทอง", "อำนาจเจริญ", "อุดรธานี", "อุตรดิตถ์", "อุทัยธานี", "อุบลราชธานี"
        ];

        const bkkDistricts = [
            "เขตพระนคร", "เขตดุสิต", "เขตหนองจอก", "เขตบางรัก", "เขตบางเขน", "เขตบางกะปิ", "เขตปทุมวัน", "เขตป้อมปราบศัตรูพ่าย", "เขตพระโขนง", "เขตมีนบุรี", 
            "เขตลาดกระบัง", "เขตยานนาวา", "เขตสัมพันธวงศ์", "เขตพญาไท", "เขตธนบุรี", "เขตบางกอกใหญ่", "เขตห้วยขวาง", "เขตคลองสาน", "เขตตลิ่งชัน", "เขตบางกอกน้อย", 
            "เขตบางขุนเทียน", "เขตภาษีเจริญ", "เขตหนองแขม", "เขตราษฎร์บูรณะ", "เขตบางพลัด", "เขตดินแดง", "เขตบึงกุ่ม", "เขตสาทร", "เขตบางซื่อ", "เขตจตุจักร", 
            "เขตบางคอแหลม", "เขตประเวศ", "เขตคลองเตย", "เขตสวนหลวง", "เขตจอมทอง", "เขตดอนเมือง", "เขตราชเทวี", "เขตลาดพร้าว", "เขตวัฒนา", "เขตบางแค", 
            "เขตหลักสี่", "เขตสายไหม", "เขตคันนายาว", "เขตสะพานสูง", "เขตวังทองหลาง", "เขตคลองสามวา", "เขตบางนา", "เขตทวีวัฒนา", "เขตทุ่งครุ", "เขตบางบอน"
        ];

        const mockDistricts = {
            "เชียงใหม่": ["อำเภอเมืองเชียงใหม่", "อำเภอหางดง", "อำเภอแม่ริม", "อำเภอดอยสะเก็ด"],
            "ชลบุรี": ["อำเภอเมืองชลบุรี", "อำเภอบางละมุง", "อำเภอศรีราชา", "อำเภอสัตหีบ"],
            "สมุทรปราการ": ["อำเภอเมืองสมุทรปราการ", "อำเภอบางพลี", "อำเภอพระประแดง", "อำเภอบางบ่อ"]
        };

        thaiProvinces.forEach(prov => {
            provSelect.add(new Option(prov, prov));
        });

        provSelect.addEventListener('change', function() {
            distSelect.innerHTML = '<option value="" disabled selected hidden>เลือกเขต/อำเภอ</option>';
            subSelect.innerHTML = '<option value="" disabled selected hidden>เลือกแขวง/ตำบล</option>';
            zipInput.value = '';
            subSelect.disabled = true;

            const selectedProv = this.value;
            if (selectedProv) {
                distSelect.disabled = false;
                let districts = [];
                if (selectedProv === "กรุงเทพมหานคร") {
                    districts = bkkDistricts; 
                } else if (mockDistricts[selectedProv]) {
                    districts = mockDistricts[selectedProv];
                } else {
                    districts = [`อำเภอเมือง${selectedProv}`, `อำเภอที่ 1`, `อำเภอที่ 2`];
                }
                
                districts.forEach(dist => {
                    distSelect.add(new Option(dist, dist));
                });
            } else {
                distSelect.disabled = true;
            }
        });

        distSelect.addEventListener('change', function() {
            subSelect.innerHTML = '<option value="" disabled selected hidden>เลือกแขวง/ตำบล</option>';
            zipInput.value = '';

            const selectedProv = provSelect.value;
            const selectedDist = this.value;

            if (selectedProv && selectedDist) {
                subSelect.disabled = false;
                let isBkk = selectedProv === "กรุงเทพมหานคร";
                let prefix = isBkk ? "แขวง" : "ตำบล";
                
                let subs = [];
                if (selectedDist === "เขตจอมทอง") {
                    subs = ["แขวงบางขุนเทียน", "แขวงบางค้อ", "แขวงบางมด", "แขวงจอมทอง"];
                } else {
                    let baseName = selectedDist.replace("เขต", "").replace("อำเภอ", "").replace("เมือง", "");
                    subs = [`${prefix}${baseName}`, `${prefix}${baseName}เหนือ`, `${prefix}${baseName}ใต้`];
                }
                
                subs.forEach(sub => {
                    subSelect.add(new Option(sub, sub));
                });
            } else {
                subSelect.disabled = true;
            }
        });

        subSelect.addEventListener('change', function() {
            const selectedDist = distSelect.value;
            const selectedSub = this.value;
            if (selectedDist) {
                if(selectedDist === "เขตจอมทอง" || selectedSub === "แขวงบางมด") {
                    zipInput.value = "10150";
                } else {
                    let baseZip = 10000 + (selectedDist.length * 1111);
                    if (baseZip > 99990) baseZip = 90000;
                    zipInput.value = baseZip.toString().substring(0, 5);
                }
            }
        });
    }

    // --- 9. การส่งข้อมูล Resume เข้า Database ---
    const resumeForm = document.getElementById('resume-builder-form');
    const resumeSuccessModal = document.getElementById('resume-success-modal');

    if (resumeForm && resumeSuccessModal) {
        resumeForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            const seekerId = sessionStorage.getItem('userId') || 1; 

            const day = document.getElementById('dob-day').value;
            const month = document.getElementById('dob-month').value;
            const yearBE = document.getElementById('dob-year').value;
            const dobDate = (day && month && yearBE) ? `${yearBE - 543}-${month.padStart(2, '0')}-${day.padStart(2, '0')}` : null;

            const educations = Array.from(document.querySelectorAll('#education-container .dynamic-item')).map(item => ({
                level: item.querySelector('.edu-level') ? item.querySelector('.edu-level').value : '',
                institution: item.querySelector('.edu-inst') ? item.querySelector('.edu-inst').value : '',
                major: item.querySelector('.edu-major') ? item.querySelector('.edu-major').value : '',
                gpa: item.querySelector('.edu-gpa') ? item.querySelector('.edu-gpa').value : ''
            }));

            const works = Array.from(document.querySelectorAll('#work-container .dynamic-item')).map(item => ({
                title: item.querySelector('.work-title') ? item.querySelector('.work-title').value : '',
                company: item.querySelector('.work-company') ? item.querySelector('.work-company').value : '',
                duration: item.querySelector('.work-duration') ? item.querySelector('.work-duration').value : ''
            }));

            const interns = Array.from(document.querySelectorAll('#intern-container .dynamic-item')).map(item => ({
                title: item.querySelector('.intern-title') ? item.querySelector('.intern-title').value : '',
                company: item.querySelector('.intern-company') ? item.querySelector('.intern-company').value : '',
                duration: item.querySelector('.intern-duration') ? item.querySelector('.intern-duration').value : ''
            }));

            const acts = Array.from(document.querySelectorAll('#activity-container .dynamic-item')).map(item => ({
                name: item.querySelector('.act-name') ? item.querySelector('.act-name').value : '',
                role: item.querySelector('.act-role') ? item.querySelector('.act-role').value : ''
            }));

            const checkedSkills = Array.from(document.querySelectorAll('.skill-checkbox:checked')).map(cb => cb.nextElementSibling.textContent);
            const otherSkills = document.querySelectorAll('input[placeholder="เช่น ทักษะการเจรจาต่อรอง, พิมพ์ดีดเร็ว 50 คำ/นาที"]')[0]?.value || "";
            const finalSkills = [...checkedSkills, otherSkills].filter(s => s.trim() !== "").join(", ");

            const selects = Array.from(document.querySelectorAll('.custom-select'));
            const disabilityType = selects.find(s => s.options[1]?.value === 'visual')?.value || '';
            const disabilityLevel = selects.find(s => s.options[1]?.value === 'independent')?.value || '';

            const payload = {
                seeker_id: seekerId,
                first_name: document.querySelectorAll('input[placeholder="ชื่อจริง"]')[0]?.value || '',
                last_name: document.querySelectorAll('input[placeholder="นามสกุล"]')[0]?.value || '',
                phone: document.querySelectorAll('input[placeholder="08X-XXX-XXXX"]')[0]?.value || '',
                email: document.querySelectorAll('input[type="email"]')[0]?.value || '',
                dob: dobDate,
                address: document.querySelectorAll('input[placeholder="เช่น 99/9 หมู่บ้านสุขสันต์ ซอย 5 ถนนพระราม 2"]')[0]?.value || '',
                province: document.getElementById('addr-province')?.value || '',
                district: document.getElementById('addr-district')?.value || '',
                sub_district: document.getElementById('addr-subdistrict')?.value || '',
                zipcode: document.getElementById('addr-zipcode')?.value || '',
                disability_type: disabilityType,
                disability_level: disabilityLevel,
                summary: document.querySelector('.resume-textarea')?.value || '',
                skills: finalSkills,
                education_history: educations,
                work_experience: works,
                intern_experience: interns,
                activities: acts,
                portfolio_url: document.querySelectorAll('input[type="url"]')[0]?.value || ""
            };

            try {
                const res = await fetch('http://localhost:3000/api/save-resume', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                const data = await res.json();
                
                if(data.success) {
                    resumeSuccessModal.style.display = 'flex';
                    setTimeout(() => {
                        window.location.href = 'resume2.html'; 
                    }, 3000);
                } else {
                    alert("❌ บันทึกไม่สำเร็จ: " + (data.error || data.message));
                }
            } catch (err) {
                alert("⚠️ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
                console.error(err);
            }
        });

        resumeSuccessModal.addEventListener('click', (e) => {
            if (e.target === resumeSuccessModal) {
                resumeSuccessModal.style.display = 'none';
            }
        });
    }

    // --- 10. หน้าเลือกเทมเพลตเรซูเม่ (resume2.html) ---
    const templateThumbs = document.querySelectorAll('.template-thumb');
    const templateContents = document.querySelectorAll('.template-preview-area .resume-theme-content');
    const btnProceedToFinal = document.getElementById('btn-proceed-to-final');

    if (templateThumbs.length > 0 && templateContents.length > 0) {
        templateThumbs.forEach(thumb => {
            thumb.addEventListener('click', function() {
                templateThumbs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                const selectedTheme = this.getAttribute('data-template');

                templateContents.forEach(content => {
                    content.classList.remove('active');
                });

                const targetContent = document.querySelector(`.template-preview-area #tpl-${selectedTheme}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    if (btnProceedToFinal) {
        btnProceedToFinal.addEventListener('click', function() {
            const activeThumb = document.querySelector('.template-thumb.active');
            const selectedTheme = activeThumb ? activeThumb.getAttribute('data-template') : 'minimal';
            
            localStorage.setItem('selectedResumeTheme', selectedTheme);
            window.location.href = 'resume3.html'; 
        });
    }

    // --- 11. หน้าพรีวิวเรซูเม่ครั้งสุดท้าย (resume3.html) ---
    const resume3Paper = document.getElementById('resume3-paper');
    
    if (resume3Paper) {
        const savedTheme = localStorage.getItem('selectedResumeTheme') || 'minimal';

        const allTemplates = resume3Paper.querySelectorAll('.resume-theme-content');
        allTemplates.forEach(tpl => tpl.classList.remove('active'));

        const targetTpl = resume3Paper.querySelector(`#tpl-${savedTheme}`);
        if (targetTpl) {
            targetTpl.classList.add('active');
        }

        const btnEdit = document.getElementById('btn-edit-resume');
        const btnSave = document.getElementById('btn-save-profile');
        const saveModal = document.getElementById('save-success-modal');

        if (btnEdit) {
            btnEdit.addEventListener('click', () => {
                window.location.href = 'resume.html';
            });
        }

        if (btnSave && saveModal) {
            let isSavedStatus = false; 

            btnSave.addEventListener('click', () => {
                if (!isSavedStatus) {
                    saveModal.style.display = 'flex';
                    setTimeout(() => {
                        saveModal.style.display = 'none'; 
                        btnSave.textContent = 'จับคู่งาน'; 
                        isSavedStatus = true; 
                    }, 3000);
                } else {
                    window.location.href = 'resume4.html'; 
                }
            });

            saveModal.addEventListener('click', (e) => {
                if (e.target === saveModal) {
                    saveModal.style.display = 'none';
                    btnSave.textContent = 'จับคู่งาน';
                    isSavedStatus = true;
                }
            });
        }
    }

    // --- 12. 🌟 ระบบคำนวณ Ranking สำหรับหน้า (resume4.html) 🌟 ---
    const rankListContainer = document.querySelector('.rank-list'); 
    if (rankListContainer) {
        loadAndRankJobs();
    }

    async function loadAndRankJobs() {
        try {
            const res = await fetch('http://localhost:3000/api/jobs');
            const jobs = await res.json();
            
            const userId = sessionStorage.getItem('userId') || 1;
            const resumeRes = await fetch(`http://localhost:3000/api/get-resume/${userId}`);
            const resume = await resumeRes.json();

            rankListContainer.innerHTML = ''; 

            let rankedJobs = jobs.map(job => {
                let score = 0;
                let matchDetails = [];

                if (job.disability_type === 'รับทุกประเภท' || job.disability_type === resume.disability_type) {
                    score += 40;
                    matchDetails.push("สภาพแวดล้อมเหมาะสม");
                }

                if (resume.skills && job.req_skills) {
                    score += 30;
                    matchDetails.push("ทักษะตรงตามต้องการ");
                }

                if (parseInt(resume.expected_salary) <= parseInt(job.salary) || !resume.expected_salary) {
                    score += 30;
                    matchDetails.push("ฐานเงินเดือนเหมาะสม");
                }

                if (score === 0) score = Math.floor(Math.random() * (95 - 60 + 1)) + 60; 

                return { ...job, matchScore: score, matchDetails };
            });

            rankedJobs.sort((a, b) => b.matchScore - a.matchScore);

            rankedJobs.forEach((job, index) => {
                rankListContainer.innerHTML += `
                    <div class="rank-card" onclick="window.location.href='resume5.html'">
                        <div class="rank-number">${index + 1}</div>
                        <div class="rank-info">
                            <h3 class="rank-job-title">${job.job_title}</h3>
                            <p class="rank-company-name">${job.company_name}</p>
                            <p class="rank-match-details" style="font-size: 13px; color: #666; margin-top: 5px;">
                                ✨ ${job.matchDetails.join(' • ')}
                            </p>
                        </div>
                        <div class="rank-score-circle">
                            <span class="score-value">${job.matchScore}%</span>
                            <span class="score-label">Match</span>
                        </div>
                    </div>
                `;
            });

        } catch (error) {
            console.error("Error matching jobs:", error);
        }
    }

    // --- 13. หน้าส่งเรซูเม่ (resume5.html) ---
    const btnSendResume = document.getElementById('btn-send-resume');
    const sendSuccessModal = document.getElementById('send-success-modal');

    if (btnSendResume && sendSuccessModal) {
        btnSendResume.addEventListener('click', () => {
            sendSuccessModal.style.display = 'flex';
            
            btnSendResume.textContent = 'ส่งเรซูเม่แล้ว';
            btnSendResume.style.backgroundColor = '#D9D9D9';
            btnSendResume.style.color = '#666';
            btnSendResume.style.boxShadow = 'none';
            btnSendResume.style.cursor = 'default';
            btnSendResume.disabled = true;

            setTimeout(() => {
                sendSuccessModal.style.display = 'none';
            }, 3000);
        });

        sendSuccessModal.addEventListener('click', (e) => {
            if (e.target === sendSuccessModal) {
                sendSuccessModal.style.display = 'none';
            }
        });
    }

});