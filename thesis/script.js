/* =========================================
   === JAVASCRIPT: รวมฟังก์ชันทั้งหมด (Full Expanded Version) ===
========================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ========= 🔵 0.0 GLOBAL SCREEN READER SUPPORT ========= */
    const srLiveRegion = document.createElement('div');
    srLiveRegion.setAttribute('aria-live', 'polite');
    srLiveRegion.setAttribute('aria-atomic', 'true');
    srLiveRegion.style.position = 'absolute';
    srLiveRegion.style.width = '1px';
    srLiveRegion.style.height = '1px';
    srLiveRegion.style.overflow = 'hidden';
    srLiveRegion.style.clip = 'rect(1px, 1px, 1px, 1px)';
    document.body.appendChild(srLiveRegion);

    function announce(message) {
        srLiveRegion.textContent = '';
        setTimeout(() => { srLiveRegion.textContent = message; }, 50);
    }

    // ==========================================
    // 🌟 0.1 ระบบป้องกันการเข้าถึงหน้าเว็บ (Auth Guard)
    // ==========================================
    const currentPageUrl = window.location.pathname.split("/").pop() || 'index.html';
    const loggedInUser = sessionStorage.getItem('userName');
    const loggedInType = sessionStorage.getItem('userType');
    const loggedInId = sessionStorage.getItem('userId');

    // ลิสต์หน้าเว็บของแต่ละฝั่ง
    const seekerPages = ['home-jobseeker.html', 'resume.html', 'resume2.html', 'resume3.html', 'resume4.html', 'resume5.html', 'job-search.html', 'profile-job.html', 'profile-job2.html'];
    const employerPages = ['home-employer.html', 'post-job.html', 'profile-em.html', 'profile-em2.html', 'profile-em3.html', 'profile-em4.html', 'post-employer.html', 'post-employer2.html'];

    if (!loggedInUser) {
        if (seekerPages.includes(currentPageUrl)) { 
            alert('⚠️ กรุณาเข้าสู่ระบบสำหรับผู้หางาน'); 
            window.location.href = 'login-jobseeker.html'; 
            return; 
        } else if (employerPages.includes(currentPageUrl)) { 
            alert('⚠️ กรุณาเข้าสู่ระบบสำหรับนายจ้าง'); 
            window.location.href = 'login-employer.html'; 
            return; 
        }
    } else {
        if (loggedInType === 'employer' && seekerPages.includes(currentPageUrl)) { 
            alert('⚠️ ไม่สามารถเข้าหน้าผู้หางานได้'); 
            window.location.href = 'home-employer.html'; 
            return; 
        } else if (loggedInType === 'seeker' && employerPages.includes(currentPageUrl)) { 
            alert('⚠️ ไม่สามารถเข้าหน้านายจ้างได้'); 
            window.location.href = 'home-jobseeker.html'; 
            return; 
        }
        
        if (currentPageUrl === 'login-jobseeker.html' || currentPageUrl === 'login-employer.html') { 
            if (loggedInType === 'employer') { 
                window.location.href = 'home-employer.html'; 
            } else { 
                window.location.href = 'home-jobseeker.html'; 
            }
            return; 
        }
    }

    // ==========================================
    // 🌟 0.2 ระบบ Navbar แบบ Dynamic
    // ==========================================
    const authNavItem = document.querySelector('.main-nav > li:last-child');
    if (authNavItem) {
        if (loggedInUser) {
            authNavItem.classList.add('user-profile-item');
            
            let profileMenuHtml = '';
            if (loggedInType === 'employer') {
                profileMenuHtml = `<li><a href="profile-em.html">โปรไฟล์</a></li>`;
            } else {
                profileMenuHtml = `<li><a href="profile-job.html">โปรไฟล์</a></li>`;
            }

            authNavItem.innerHTML = `
                <button class="nav-link-btn user-profile-btn" aria-haspopup="true" aria-expanded="false" style="display:flex; align-items:center; max-width:250px;">
                    <div class="user-avatar" style="flex-shrink:0; display:flex; align-items:center; justify-content:center;">${loggedInUser.charAt(0)}</div>
                    <span class="user-name" style="max-width:120px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin:0 8px;">${loggedInUser}</span>
                    <svg class="dropdown-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                <ul class="dropdown-menu user-dropdown" hidden>
                    ${profileMenuHtml}
                    <li><a href="#" id="dynamic-logout-btn">ออกจากระบบ</a></li>
                </ul>
            `;
            
            document.getElementById('dynamic-logout-btn').addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.clear(); 
                localStorage.removeItem('user'); 
                sessionStorage.removeItem('tempResumeData');
                announce('ออกจากระบบแล้ว');
                window.location.href = 'index.html'; 
            });

            document.querySelectorAll('.main-nav > li.nav-item').forEach(item => {
                const btn = item.querySelector('.nav-link-btn');
                if (btn) {
                    const menuText = btn.textContent.trim();
                    if (loggedInType === 'employer' && menuText.includes('ผู้หางาน')) item.style.display = 'none';
                    if (loggedInType === 'seeker' && menuText.includes('นายจ้าง')) item.style.display = 'none';
                }
            });
        } else {
            authNavItem.classList.remove('user-profile-item');
            authNavItem.innerHTML = `
                <button class="nav-link-btn" aria-haspopup="true" aria-expanded="false">
                    เข้าสู่ระบบ/สมัครสมาชิก
                    <svg class="dropdown-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                <ul class="dropdown-menu login-register-dropdown" hidden>
                    <li><a href="login-employer.html">สำหรับนายจ้าง</a></li>
                    <li><a href="login-jobseeker.html">สำหรับผู้หางาน</a></li>
                </ul>
            `;
        }
    }

    // ==========================================
    // --- 1. ACCESSIBLE NAVBAR (Keyboard & Click) ---
    // ==========================================
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
                        otherItem.querySelector('.nav-link-btn')?.setAttribute('aria-expanded', 'false');
                        otherItem.querySelector('.dropdown-menu')?.setAttribute('hidden', '');
                    }
                });

                item.classList.toggle('active');
                if (item.classList.contains('active')) {
                    button.setAttribute('aria-expanded', 'true');
                    dropdownMenu.removeAttribute('hidden');
                    announce('เปิดเมนู ' + button.textContent.trim());
                    setTimeout(() => dropdownMenu.querySelector('a')?.focus(), 100);
                } else {
                    button.setAttribute('aria-expanded', 'false');
                    dropdownMenu.setAttribute('hidden', '');
                    announce('ปิดเมนูแล้ว');
                }
            });

            item.addEventListener('keydown', (e) => {
                if (!item.classList.contains('active')) return;
                const menuItems = Array.from(dropdownMenu.querySelectorAll('a'));
                if (menuItems.length === 0) return;
                
                let currentFocus = document.activeElement;
                switch (e.key) {
                    case 'ArrowDown': case 'ArrowRight':
                        e.preventDefault();
                        if (currentFocus === button) menuItems[0].focus();
                        else menuItems[(menuItems.indexOf(currentFocus) + 1) % menuItems.length].focus();
                        break;
                    case 'ArrowUp': case 'ArrowLeft':
                        e.preventDefault();
                        if (currentFocus === button) menuItems[menuItems.length - 1].focus();
                        else menuItems[(menuItems.indexOf(currentFocus) - 1 + menuItems.length) % menuItems.length].focus();
                        break;
                    case 'Escape': case 'Tab':
                        item.classList.remove('active');
                        button.setAttribute('aria-expanded', 'false');
                        dropdownMenu.setAttribute('hidden', '');
                        if (e.key === 'Escape') button.focus(); 
                        break;
                }
            });
        }
    });

    document.body.addEventListener('click', () => {
        navItems.forEach(item => {
            if (item.classList.contains('active')) {
                item.classList.remove('active');
                item.querySelector('.nav-link-btn')?.setAttribute('aria-expanded', 'false');
                item.querySelector('.dropdown-menu')?.setAttribute('hidden', '');
            }
        });
    });

    // ==========================================
    // --- 2. ควบคุม Sliders (ข่าวสาร / งาน / บริษัท) ---
    // ==========================================
    const track = document.querySelector('.carousel-track');
    if (track) { 
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.right-btn');
        const prevButton = document.querySelector('.left-btn');
        const dotsNav = document.querySelector('.carousel-nav');
        const dots = dotsNav ? Array.from(dotsNav.children) : [];

        if (slides.length > 0) {
            slides.forEach((slide, i) => slide.setAttribute('aria-label', `ข่าวที่ ${i + 1} จาก ${slides.length}`));
            const slideWidth = slides[0].getBoundingClientRect().width;
            slides.forEach((slide, index) => slide.style.left = slideWidth * index + 'px');

            const moveToSlide = (track, current, target) => {
                if(!target) return;
                track.style.transform = 'translateX(-' + target.style.left + ')';
                current.classList.remove('current-slide'); 
                target.classList.add('current-slide');
                announce(`กำลังแสดง ${target.getAttribute('aria-label')}`);
            }

            const updateDots = (currentDot, targetDot) => {
                if(!currentDot || !targetDot) return;
                currentDot.classList.remove('current-indicator'); 
                targetDot.classList.add('current-indicator');
            }

            if (nextButton && prevButton) {
                nextButton.addEventListener('click', () => {
                    const currentSlide = track.querySelector('.current-slide');
                    let nextSlide = currentSlide.nextElementSibling || slides[0];
                    let nextDot = (dotsNav && dotsNav.querySelector('.current-indicator').nextElementSibling) || dots[0];
                    moveToSlide(track, currentSlide, nextSlide); 
                    updateDots(dotsNav?.querySelector('.current-indicator'), nextDot);
                });
                prevButton.addEventListener('click', () => {
                    const currentSlide = track.querySelector('.current-slide');
                    let prevSlide = currentSlide.previousElementSibling || slides[slides.length - 1];
                    let prevDot = (dotsNav && dotsNav.querySelector('.current-indicator').previousElementSibling) || dots[dots.length - 1];
                    moveToSlide(track, currentSlide, prevSlide); 
                    updateDots(dotsNav?.querySelector('.current-indicator'), prevDot);
                });
            }
            if (dotsNav) {
                dotsNav.addEventListener('click', e => {
                    const targetDot = e.target.closest('button');
                    if (!targetDot) return;
                    const targetIndex = dots.findIndex(dot => dot === targetDot);
                    moveToSlide(track, track.querySelector('.current-slide'), slides[targetIndex]);
                    updateDots(dotsNav.querySelector('.current-indicator'), targetDot);
                });
            }
        }
    }

    const jobTrack = document.querySelector('.job-track');
    if (jobTrack) {
        document.querySelector('.job-next-btn')?.addEventListener('click', () => jobTrack.style.transform = 'translateX(calc(-100% - 30px))');
        document.querySelector('.job-prev-btn')?.addEventListener('click', () => jobTrack.style.transform = 'translateX(0)');
    }

    const empTrack = document.querySelector('.employer-track');
    if (empTrack) {
        document.querySelector('.next-employer-btn')?.addEventListener('click', () => empTrack.style.transform = 'translateX(-750px)');
        document.querySelector('.prev-employer-btn')?.addEventListener('click', () => empTrack.style.transform = 'translateX(0)');
    }

    // ==========================================
    // --- 5. ควบคุมปุ่มดูรหัสผ่าน (Toggle Password) ---
    // ==========================================
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.querySelector('svg').innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
            } else {
                input.type = 'password';
                this.querySelector('svg').innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
            }
        });
    });

    // ==========================================
    // --- 6. ควบคุมฟอร์ม สมัครสมาชิก/เข้าสู่ระบบ ---
    // ==========================================
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            const data = {
                first_name: document.getElementById('reg-firstname')?.value || '',
                last_name: document.getElementById('reg-lastname')?.value || '',
                phone: document.getElementById('reg-phone')?.value || '',
                email: document.getElementById('reg-email')?.value || '',
                password: document.getElementById('reg-password')?.value || ''
            };
            try {
                const res = await fetch('http://localhost:3000/api/register/seeker', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                const result = await res.json();
                if(result.success) {
                    const modal = document.getElementById('success-modal');
                    if(modal) modal.style.display = 'flex';
                    setTimeout(() => { window.location.href='login-jobseeker.html'; }, 3000);
                } else {
                    alert("❌ " + (result.error || result.message)); 
                }
            } catch(err) { alert("⚠️ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้"); }
        });
        document.getElementById('success-modal')?.addEventListener('click', (e) => { if (e.target.id === 'success-modal') e.target.style.display = 'none'; });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            try {
                const res = await fetch('http://localhost:3000/api/login', { 
                    method: 'POST', 
                    headers: {'Content-Type': 'application/json'}, 
                    body: JSON.stringify({ 
                        email: document.getElementById('login-email').value, 
                        password: document.getElementById('login-password').value, 
                        type: 'seeker' 
                    }) 
                });
                const data = await res.json();
                if (data.success) {
                    sessionStorage.setItem('userName', data.user.name); 
                    sessionStorage.setItem('userId', data.user.id); 
                    sessionStorage.setItem('userType', 'seeker');
                    window.location.href = 'home-jobseeker.html'; 
                } else {
                    alert("❌ " + (data.message || data.error)); 
                }
            } catch (error) { alert("⚠️ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้"); }
        });
    }

    const empRegisterForm = document.getElementById('employer-register-form');
    if (empRegisterForm) {
        empRegisterForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            const data = {
                company_name: document.getElementById('emp-reg-company').value,
                phone: document.getElementById('emp-reg-phone').value,
                email: document.getElementById('emp-reg-email').value,
                address: document.getElementById('emp-reg-address').value,
                tax_id: document.getElementById('emp-reg-tax').value,
                password: document.getElementById('emp-reg-password').value
            };
            try {
                const res = await fetch('http://localhost:3000/api/register/employer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                const result = await res.json();
                if(result.success) {
                    const modal = document.getElementById('employer-success-modal');
                    if(modal) modal.style.display = 'flex';
                    setTimeout(() => { window.location.href='login-employer.html'; }, 3000);
                } else {
                    alert("❌ " + (result.error || result.message)); 
                }
            } catch(err) { alert("⚠️ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้"); }
        });
        document.getElementById('employer-success-modal')?.addEventListener('click', (e) => { if (e.target.id === 'employer-success-modal') e.target.style.display = 'none'; });
    }

    const empLoginForm = document.getElementById('employer-login-form');
    if (empLoginForm) {
        empLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            try {
                const res = await fetch('http://localhost:3000/api/login', { 
                    method: 'POST', 
                    headers: {'Content-Type': 'application/json'}, 
                    body: JSON.stringify({ 
                        email: document.getElementById('emp-login-email').value, 
                        password: document.getElementById('emp-login-password').value, 
                        type: 'employer' 
                    }) 
                });
                const data = await res.json();
                if (data.success) {
                    sessionStorage.setItem('userName', data.user.name); 
                    sessionStorage.setItem('userId', data.user.id); 
                    sessionStorage.setItem('userType', 'employer');
                    window.location.href = 'home-employer.html'; 
                } else {
                    alert("❌ " + data.message); 
                }
            } catch (error) { alert("⚠️ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้"); }
        });
    }

    // ==========================================
    // 🌟 7. ระบบโปรไฟล์ผู้ใช้งาน (profile-job.html & profile-em.html)
    // ==========================================
    const profileArea = document.getElementById('profile-content-area');
    if(profileArea && loggedInId) {
        if(loggedInType === 'seeker') {
            fetch(`http://localhost:3000/api/get-resume/${loggedInId}`).then(res => res.json()).then(data => {
                if(data && data.first_name) {
                    const setEl = (id, text) => { if(document.getElementById(id)) document.getElementById(id).textContent = text; };

                    setEl('prof-name', data.first_name + ' ' + data.last_name);
                    setEl('prof-email', data.email);
                    setEl('prof-phone', data.phone);
                    
                    const profAddress = document.getElementById('prof-address');
                    if (profAddress) {
                        if (data.address && data.address.trim() !== '') {
                            profAddress.textContent = `${data.address || ''} ${data.sub_district || ''} ${data.district || ''} ${data.province || ''} ${data.zipcode || ''}`.trim();
                            profAddress.style.color = '#4B5563';
                            profAddress.style.fontStyle = 'normal';
                        } else {
                            profAddress.textContent = 'ยังไม่ได้ระบุที่อยู่ (กรุณาสร้างเรซูเม่เพื่ออัปเดตข้อมูล)';
                            profAddress.style.color = '#94A3B8'; 
                            profAddress.style.fontStyle = 'italic';
                        }
                    }

                    // 🟢 โค้ดส่วนโชว์/ซ่อน ไฟล์เรซูเม่ (แสดงชื่อ + วันที่)
                    const seekerResumeSection = document.getElementById('seeker-resume-section');
                    if (seekerResumeSection) {
                        if (data.selected_template || (data.address && data.address.trim() !== '')) {
                            // เคยทำเรซูเม่แล้ว -> ยกเลิกซ่อน
                            seekerResumeSection.style.display = 'block';
                            
                            // 1. ใส่ชื่อ - นามสกุลตรงปุ่มลิงก์
                            const fileNameEl = document.getElementById('resume-file-name');
                            if (fileNameEl) {
                                fileNameEl.textContent = data.first_name + ' ' + data.last_name;
                            }
                            
                            // 2. ดึงวันที่บันทึกมาแสดง (ถ้าไม่มีจะใช้วันที่ปัจจุบัน)
                            let dateText = '-';
                            if (data.updated_at || data.created_at) {
                                const d = new Date(data.updated_at || data.created_at);
                                dateText = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()+543}`;
                            } else {
                                const d = new Date();
                                dateText = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()+543}`;
                            }
                            setEl('resume-file-date', `${dateText}`);

                        } else {
                            // ยังไม่เคยทำ -> ซ่อนกล่องไปเลย
                            seekerResumeSection.style.display = 'none';
                        }
                    }
                }
            }).catch(err => console.error("Error loading profile:", err));
            
        } else if (loggedInType === 'employer') {
            fetch(`http://localhost:3000/api/get-employer/${loggedInId}`).then(res => res.json()).then(data => {
                if(data && data.company_name) {
                    const setEl = (id, text) => { if(document.getElementById(id)) document.getElementById(id).textContent = text; };
                    setEl('prof-name', data.company_name);
                    setEl('prof-email', data.email);
                    setEl('prof-phone', data.phone);
                }
            }).catch(err => console.error("Error loading employer profile:", err));

            const empJobsSection = document.getElementById('employer-jobs-section');
            const empJobsList = document.getElementById('employer-jobs-list');
            
            if (empJobsSection && empJobsList) {
                fetch(`http://localhost:3000/api/get-employer-jobs/${loggedInId}`)
                    .then(res => res.json())
                    .then(jobs => {
                        if (jobs.length > 0) {
                            empJobsSection.style.display = 'block';
                            empJobsList.innerHTML = ''; 
                            jobs.forEach(job => {
                                const statusText = job.status === 'open' ? 'เปิดรับสมัคร' : 'ปิดรับสมัคร';
                                empJobsList.innerHTML += `
                                    <div class="file-item employer-item">
                                        <a href="post-employer2.html?jobId=${job.id}" class="file-name">${job.job_title}</a>
                                        <div class="file-date" style="color: #4B5563;">สถานะ: ${statusText}</div>
                                        <div class="action-menu-container">
                                            <button class="file-menu-btn" aria-label="ตัวเลือกจัดการโพสต์" aria-haspopup="true" aria-expanded="false">
                                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1E293B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                                    <circle cx="12" cy="12" r="1.5"></circle>
                                                    <circle cx="19" cy="12" r="1.5"></circle>
                                                    <circle cx="5" cy="12" r="1.5"></circle>
                                                </svg>
                                            </button>
                                            <ul class="action-dropdown" role="menu">
                                                <li role="none"><a role="menuitem" href="post-employer.html?edit=${job.id}" class="edit-action">แก้ไขโพสต์</a></li>
                                                <li role="none"><button role="menuitem" class="delete-action">ลบโพสต์</button></li>
                                            </ul>
                                        </div>
                                    </div>
                                `;
                            });
                        } else {
                            empJobsSection.style.display = 'none';
                        }
                    })
                    .catch(err => console.error("Error loading employer jobs:", err));
            }
        }
    }

    // ==========================================
    // 🌟 8. ระบบ AI Auto-Replace 
    // ==========================================
    const summaryInput = document.querySelector('.resume-textarea') || document.getElementById('inspiration-text'); 
    const skillsInput = document.querySelector('input[placeholder="เช่น ทักษะการเจรจาต่อรอง, พิมพ์ดีดเร็ว 50 คำ/นาที"]') || document.getElementById('other-skills');
    
    async function processAIAutoReplace(targetElement, sectionName) {
        if (!targetElement.value || targetElement.value.length < 5) return;
        
        targetElement.style.transition = 'background-color 0.3s ease';
        targetElement.style.backgroundColor = '#f0f9ff'; 
        
        try {
            const res = await fetch('http://localhost:3000/api/get-ai-feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: targetElement.value, section: sectionName })
            });
            const data = await res.json();
            
            if (data.suggestion && data.suggestion !== targetElement.value) {
                targetElement.value = data.suggestion;
                targetElement.style.backgroundColor = '#dcfce7'; 
                setTimeout(() => { 
                    targetElement.style.backgroundColor = ''; 
                }, 1000);
            }
        } catch (e) {
            console.error("AI Error:", e);
            targetElement.style.backgroundColor = '';
        }
    }

    if (summaryInput) {
        summaryInput.addEventListener('blur', () => processAIAutoReplace(summaryInput, 'แรงบันดาลใจและสิ่งที่อยากบอกองค์กร'));
    }
    if (skillsInput) {
        skillsInput.addEventListener('blur', () => processAIAutoReplace(skillsInput, 'ทักษะและความสามารถพิเศษ'));
    }

    // ==========================================
    // --- 9. หน้าฟอร์มกรอกเรซูเม่ (resume.html) ---
    // ==========================================
    const getVal = (id, selector) => {
        const el = document.getElementById(id) || document.querySelector(selector);
        return el ? el.value : '';
    };

    const isOnResumePage = document.getElementById('resume-builder-form');
    if (isOnResumePage && loggedInId) {
        fetch(`http://localhost:3000/api/get-resume/${loggedInId}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.first_name) {
                    const sv = (id, selector, value) => {
                        const el = document.getElementById(id) || document.querySelector(selector);
                        if(el) el.value = value || '';
                    };

                    sv('first-name', '', data.first_name);
                    sv('last-name', '', data.last_name);
                    sv('phone-number', '', data.phone);
                    sv('email-address', '', data.email);
                    sv('address-street', '', (data.address || '').split(' ')[0]);
                    sv('disability-type', '.custom-select', data.disability_type);
                    sv('assistive-device', '.custom-select:nth-of-type(2)', data.disability_level);
                    sv('job-position', '', data.job_position);
                    sv('inspiration-text', '.resume-textarea', data.summary);
                    
                    if(data.dob && data.dob !== '1970-01-01T00:00:00.000Z') {
                        const dDate = new Date(data.dob);
                        sv('dob-day', '', String(dDate.getDate()).padStart(2, '0')); 
                        sv('dob-month', '', String(dDate.getMonth() + 1).padStart(2, '0')); 
                        sv('dob-year', '', dDate.getFullYear() + 543);
                    }

                    setTimeout(() => {
                        const provInputEl = document.getElementById('addr-province');
                        if(provInputEl && data.province) {
                            provInputEl.value = data.province;
                            provInputEl.dispatchEvent(new Event('input')); 
                            
                            setTimeout(() => {
                                const distInputEl = document.getElementById('addr-district');
                                if (distInputEl && data.district) {
                                    distInputEl.value = data.district;
                                    distInputEl.dispatchEvent(new Event('input')); 
                                    
                                    setTimeout(() => {
                                        sv('addr-subdistrict', '', data.sub_district);
                                        sv('addr-zipcode', '', data.zipcode);
                                    }, 100);
                                }
                            }, 100);
                        }
                    }, 500);
                }
            });
    }

    function createDynamicBlock(containerId, htmlContent) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const div = document.createElement('div');
        div.className = 'dynamic-item';
        div.innerHTML = htmlContent + '<button type="button" class="btn-remove-item">ลบทิ้ง</button>';
        container.appendChild(div);

        div.querySelector('.btn-remove-item').addEventListener('click', function () {
            div.remove();
            announce('ลบข้อมูลแล้ว');
        });
    }

    const addEduBtn = document.getElementById('add-edu-btn');
    if (addEduBtn) {
        addEduBtn.addEventListener('click', () => {
            const uid = Date.now(); 
            const eduHtml = `
                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label" for="edu-level-${uid}">ระดับการศึกษา</label>
                        <select id="edu-level-${uid}" class="form-input custom-select edu-level">
                            <option>มัธยมศึกษาตอนปลาย / ปวช.</option>
                            <option>ปวส.</option>
                            <option>ปริญญาตรี</option>
                            <option>ปริญญาโท</option>
                        </select>
                    </div>
                    <div class="form-col">
                        <label class="form-label" for="edu-inst-${uid}">ชื่อสถาบันการศึกษา</label>
                        <input type="text" id="edu-inst-${uid}" class="form-input edu-inst" placeholder="เช่น มหาวิทยาลัย...">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label" for="edu-major-${uid}">คณะ / สาขาวิชา</label>
                        <input type="text" id="edu-major-${uid}" class="form-input edu-major" placeholder="เช่น บริหารธุรกิจ">
                    </div>
                    <div class="form-col">
                        <label class="form-label" for="edu-gpa-${uid}">เกรดเฉลี่ย (GPA)</label>
                        <input type="text" id="edu-gpa-${uid}" class="form-input edu-gpa" placeholder="เช่น 3.50">
                    </div>
                </div>
            `;
            createDynamicBlock('education-container', eduHtml);
        });
    }

    const addWorkBtn = document.getElementById('add-work-btn');
    if (addWorkBtn) {
        addWorkBtn.addEventListener('click', () => {
            const uid = Date.now();
            const workHtml = `
                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label" for="work-pos-${uid}">ตำแหน่ง</label>
                        <input type="text" id="work-pos-${uid}" class="form-input work-title" placeholder="เช่น พนักงานบัญชี">
                    </div>
                    <div class="form-col">
                        <label class="form-label" for="work-comp-${uid}">ชื่อบริษัท / องค์กร</label>
                        <input type="text" id="work-comp-${uid}" class="form-input work-company">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-col full-width">
                        <label class="form-label" for="work-time-${uid}">ระยะเวลาที่ทำงาน (ปี - ปี)</label>
                        <input type="text" id="work-time-${uid}" class="form-input work-duration" placeholder="เช่น 2564 - 2566">
                    </div>
                </div>
            `;
            createDynamicBlock('work-container', workHtml);
        });
    }

    const addInternBtn = document.getElementById('add-intern-btn');
    if (addInternBtn) {
        addInternBtn.addEventListener('click', () => {
            const uid = Date.now();
            const internHtml = `
                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label" for="intern-pos-${uid}">ตำแหน่งฝึกงาน</label>
                        <input type="text" id="intern-pos-${uid}" class="form-input intern-title">
                    </div>
                    <div class="form-col">
                        <label class="form-label" for="intern-comp-${uid}">ชื่อบริษัท / องค์กร</label>
                        <input type="text" id="intern-comp-${uid}" class="form-input intern-company">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-col full-width">
                        <label class="form-label" for="intern-time-${uid}">ระยะเวลาฝึกงาน</label>
                        <input type="text" id="intern-time-${uid}" class="form-input intern-duration" placeholder="เช่น มิ.ย. 66 - ส.ค. 66">
                    </div>
                </div>
            `;
            createDynamicBlock('intern-container', internHtml);
        });
    }

    const addActivityBtn = document.getElementById('add-activity-btn');
    if (addActivityBtn) {
        addActivityBtn.addEventListener('click', () => {
            const uid = Date.now();
            const actHtml = `
                <div class="form-row">
                    <div class="form-col full-width">
                        <label class="form-label" for="act-name-${uid}">ชื่อกิจกรรม / โครงการประกวด</label>
                        <input type="text" id="act-name-${uid}" class="form-input act-name">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-col full-width">
                        <label class="form-label" for="act-role-${uid}">บทบาท หรือ รางวัลที่ได้รับ</label>
                        <input type="text" id="act-role-${uid}" class="form-input act-role" placeholder="เช่น รางวัลชนะเลิศ, หัวหน้าทีม">
                    </div>
                </div>
            `;
            createDynamicBlock('activity-container', actHtml);
        });
    }

    document.addEventListener('change', function (e) {
        if (e.target && e.target.classList.contains('file-input-hidden')) {
            const displaySpan = e.target.nextElementSibling.querySelector('.file-name-text');
            if (displaySpan) {
                displaySpan.textContent = e.target.files[0] ? e.target.files[0].name : 'แนบไฟล์...';
                displaySpan.style.color = e.target.files[0] ? '#013c58' : '#666';
                displaySpan.style.fontWeight = e.target.files[0] ? '600' : 'normal';
            }
        }
    });

    const provInput = document.getElementById('addr-province');
    const distInput = document.getElementById('addr-district');
    const subInput = document.getElementById('addr-subdistrict');
    const zipInput = document.getElementById('addr-zipcode');

    if (provInput && distInput && subInput && zipInput) {
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
            "ชลบุรี": ["อำเภอเมืองชลบุรี", "อำเภอบางละมุง", "อำเภอศรีราชา", "อำเภอสัตหีบ"]
        };

        const provList = document.getElementById('province-list');
        const distList = document.getElementById('district-list');
        const subList = document.getElementById('subdistrict-list');

        thaiProvinces.forEach(prov => {
            const opt = document.createElement('option');
            opt.value = prov;
            provList.appendChild(opt);
        });

        provInput.addEventListener('input', function () {
            distInput.value = ''; subInput.value = ''; zipInput.value = '';
            distList.innerHTML = ''; subList.innerHTML = '';
            subInput.disabled = true;

            if (thaiProvinces.includes(this.value)) {
                distInput.disabled = false;
                let districts = this.value === "กรุงเทพมหานคร" ? bkkDistricts : (mockDistricts[this.value] || [`อำเภอเมือง${this.value}`, `อำเภอที่ 1`, `อำเภอที่ 2`]);
                districts.forEach(dist => {
                    const opt = document.createElement('option');
                    opt.value = dist;
                    distList.appendChild(opt);
                });
            } else {
                distInput.disabled = true;
            }
        });

        distInput.addEventListener('input', function () {
            subInput.value = ''; zipInput.value = '';
            subList.innerHTML = '';
            
            if (this.value) {
                subInput.disabled = false;
                let prefix = provInput.value === "กรุงเทพมหานคร" ? "แขวง" : "ตำบล";
                let subs = [];
                if (this.value === "เขตจอมทอง") {
                    subs = ["แขวงบางขุนเทียน", "แขวงบางค้อ", "แขวงบางมด", "แขวงจอมทอง"];
                } else {
                    let baseName = this.value.replace("เขต", "").replace("อำเภอ", "").replace("เมือง", "");
                    subs = [`${prefix}${baseName}`, `${prefix}${baseName}เหนือ`, `${prefix}${baseName}ใต้`];
                }
                subs.forEach(sub => {
                    const opt = document.createElement('option');
                    opt.value = sub;
                    subList.appendChild(opt);
                });
            } else {
                subInput.disabled = true;
            }
        });

        subInput.addEventListener('input', function () {
            if (distInput.value) {
                if (distInput.value === "เขตจอมทอง" || this.value === "แขวงบางมด") {
                    zipInput.value = "10150";
                } else {
                    let baseZip = 10000 + (distInput.value.length * 1111);
                    if (baseZip > 99990) baseZip = 90000;
                    zipInput.value = baseZip.toString().substring(0, 5);
                }
            }
        });
    }

    const getDynamicData = (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return [];
        return Array.from(container.querySelectorAll('.dynamic-item')).map(item => {
            const inputs = item.querySelectorAll('.form-input');
            if (containerId === 'education-container') {
                return { level: inputs[0]?.value, institution: inputs[1]?.value, major: inputs[2]?.value, gpa: inputs[3]?.value };
            } else if (containerId === 'work-container' || containerId === 'intern-container') {
                return { title: inputs[0]?.value, company: inputs[1]?.value, duration: inputs[2]?.value };
            } else if (containerId === 'activity-container') {
                return { name: inputs[0]?.value, role: inputs[1]?.value };
            }
            return {};
        });
    };

    // 🟢 9.6 ดักจับการกด Save หน้าแรก -> ให้เก็บใน Session
    if (isOnResumePage) {
        isOnResumePage.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!loggedInId) {
                alert('กรุณาเข้าสู่ระบบก่อนบันทึกเรซูเม่');
                window.location.href = 'login-jobseeker.html';
                return;
            }

            const d = document.getElementById('dob-day')?.value; 
            const m = document.getElementById('dob-month')?.value; 
            const y = document.getElementById('dob-year')?.value;
            
            let formattedYear = y;
            if (y && parseInt(y) > 2400) {
                formattedYear = parseInt(y) - 543;
            }
            const dob = (d && m && y) ? `${formattedYear}-${m.padStart(2,'0')}-${d.padStart(2,'0')}` : null;

            const selectedSkills = Array.from(document.querySelectorAll('.skill-checkbox:checked')).map(cb => cb.nextElementSibling.textContent.trim());
            const otherSkills = document.getElementById('other-skills')?.value;
            if (otherSkills) {
                selectedSkills.push(otherSkills);
            }

            const resumeData = {
                seeker_id: loggedInId,
                first_name: getVal('first-name', ''),
                last_name: getVal('last-name', ''),
                dob: dob,
                phone: getVal('phone-number', ''),
                email: getVal('email-address', ''),
                address: getVal('address-street', ''),
                province: document.getElementById('addr-province')?.value || '',
                district: document.getElementById('addr-district')?.value || '',
                sub_district: document.getElementById('addr-subdistrict')?.value || '',
                zipcode: document.getElementById('addr-zipcode')?.value || '',
                disability_type: document.getElementById('disability-type')?.value || '',
                disability_level: document.getElementById('assistive-device')?.value || '',
                summary: document.getElementById('inspiration-text')?.value || '',
                skills: selectedSkills.join(', '),
                portfolio_url: document.getElementById('portfolio-url')?.value || '',
                job_position: document.getElementById('job-position')?.value || '',
                education_history: getDynamicData('education-container'),
                work_experience: getDynamicData('work-container'),
                intern_experience: getDynamicData('intern-container'),
                activities: getDynamicData('activity-container')
            };

            sessionStorage.setItem('tempResumeData', JSON.stringify(resumeData));
            
            const modal = document.getElementById('resume-success-modal');
            if (modal) {
                modal.style.display = 'flex';
                const h3 = modal.querySelector('h3');
                if(h3) h3.textContent = 'บันทึกข้อมูลเบื้องต้นสำเร็จ! กรุณาเลือกเทมเพลต';
                setTimeout(() => {
                    window.location.href = 'resume2.html';
                }, 1500);
            } else {
                window.location.href = 'resume2.html';
            }
        });
    }

    // ==========================================
    // 🌟 10. หน้าเลือกเทมเพลตเรซูเม่ (resume2.html)
    // ==========================================
    const templateThumbs = document.querySelectorAll('.template-thumb');
    const templateContents = document.querySelectorAll('.template-preview-area .resume-theme-content');
    const btnProceedToFinal = document.getElementById('btn-proceed-to-final');

    if (templateThumbs.length > 0 && templateContents.length > 0) {
        templateThumbs.forEach(thumb => {
            thumb.addEventListener('click', function () {
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
        btnProceedToFinal.addEventListener('click', async function () {
            const activeThumb = document.querySelector('.template-thumb.active');
            const selectedTheme = activeThumb ? activeThumb.getAttribute('data-template') : 'minimal';
            
            localStorage.setItem('selectedResumeTheme', selectedTheme);

            const tempResumeDataStr = sessionStorage.getItem('tempResumeData');
            
            // 🌟 ประกาศตัวแปรดึง Pop-up มารอไว้ 🌟
            const successModal = document.getElementById('resume-success-modal');
            
            if (loggedInId && tempResumeDataStr) {
                try {
                    const resumeData = JSON.parse(tempResumeDataStr);
                    resumeData.selected_template = selectedTheme;
                    
                    const response = await fetch('http://localhost:3000/api/save-resume', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(resumeData)
                    });
                    
                    const result = await response.json();
                    if (result.success) {
                        sessionStorage.removeItem('tempResumeData'); 
                        
                        // 🌟 โชว์ Pop-up แล้วหน่วงเวลา 2 วินาที ค่อยไปหน้าต่อไป 🌟
                        if (successModal) {
                            successModal.style.display = 'flex';
                            announce('บันทึกเรซูเม่สำเร็จ ระบบกำลังพาไปยังหน้าถัดไป');
                            setTimeout(() => { 
                                window.location.href = 'resume3.html'; 
                            }, 2000);
                        } else {
                            window.location.href = 'resume3.html';
                        }

                    } else {
                        alert('เกิดข้อผิดพลาดในการบันทึก: ' + result.error);
                    }
                } catch (err) { 
                    alert("เชื่อมต่อฐานข้อมูลล้มเหลว"); 
                }
            } else if (loggedInId && !tempResumeDataStr) {
                try {
                    await fetch('http://localhost:3000/api/update-template', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ seeker_id: loggedInId, selected_template: selectedTheme })
                    });
                    
                    // 🌟 โชว์ Pop-up (กรณีคนเข้ามาเปลี่ยนแค่ธีม) 🌟
                    if (successModal) {
                        successModal.style.display = 'flex';
                        announce('อัปเดตเทมเพลตสำเร็จ ระบบกำลังพาไปยังหน้าถัดไป');
                        setTimeout(() => { 
                            window.location.href = 'resume3.html'; 
                        }, 2000);
                    } else {
                        window.location.href = 'resume3.html';
                    }

                } catch (err) { 
                    alert("เชื่อมต่อฐานข้อมูลล้มเหลว"); 
                }
            } else {
                window.location.href = 'resume3.html';
            }
        });
        
        // 🌟 ดักจับการคลิกที่พื้นที่ว่างนอก Pop-up เพื่อปิดและไปหน้าต่อไปทันที 🌟
        const successModal = document.getElementById('resume-success-modal');
        if (successModal) {
            successModal.addEventListener('click', (e) => {
                if (e.target === successModal) {
                    successModal.style.display = 'none';
                    window.location.href = 'resume3.html';
                }
            });
        }
    }

    // ==========================================
    // --- 11. หน้าพรีวิวเรซูเม่ครั้งสุดท้าย (resume3.html / profile-job2.html) ---
    // ==========================================
    const resume3Paper = document.getElementById('resume3-paper');

    if (resume3Paper && loggedInId) {
        fetch(`http://localhost:3000/api/get-resume/${loggedInId}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.first_name) {
                    const savedTheme = data.selected_template || localStorage.getItem('selectedResumeTheme') || 'minimal';
                    const allTemplates = resume3Paper.querySelectorAll('.resume-theme-content');
                    
                    allTemplates.forEach(tpl => {
                        tpl.classList.remove('active');
                    });
                    
                    const targetTpl = resume3Paper.querySelector(`#tpl-${savedTheme}`);
                    if (targetTpl) {
                        targetTpl.classList.add('active');
                        renderRealDataToTemplate(targetTpl, data);
                    }
                }
            });

        const btnEdit = document.getElementById('btn-edit-resume');
        const btnSave = document.getElementById('btn-save-profile');

        // ปุ่มกลับไปแก้ไขเรซูเม่
        if (btnEdit) {
            btnEdit.addEventListener('click', () => { 
                window.location.href = 'resume.html'; 
            });
        }

        // 🌟 ปุ่มจับคู่งาน: แก้ไขให้กดปุ๊บ วิ่งไปหน้า resume4.html ทันที!
        if (btnSave) {
            btnSave.addEventListener('click', () => {
                window.location.href = 'resume4.html'; 
            });
        }
    }

    function renderRealDataToTemplate(tpl, data) {
        if (!tpl) return;
        const themeId = tpl.id; 

        const setText = (selector, text) => {
            const els = tpl.querySelectorAll(selector);
            els.forEach(el => {
                el.textContent = text || '';
            });
        };

        setText('.render-name', `${data.first_name || ''} ${data.last_name || ''}`.trim());
        setText('.render-email', data.email);
        setText('.render-phone', data.phone);

        const fullAddress = `${data.address || ''} ${data.sub_district || ''} ${data.district || ''} ${data.province || ''} ${data.zipcode || ''}`.trim();
        setText('.render-address', fullAddress);
        setText('.render-summary', data.summary);
        
        if(data.disability_type || data.disability_level) {
            setText('.render-disability', `${data.disability_type || ''} (${data.disability_level || ''})`);
        } else {
            setText('.render-disability', '');
        }

        const skillsContainer = tpl.querySelector('.render-skills');
        if(skillsContainer && data.skills) {
            skillsContainer.innerHTML = '';
            const skillsArr = data.skills.split(',').map(s => s.trim()).filter(s => s !== '');
            if(themeId === 'tpl-modern') {
                skillsContainer.innerHTML = skillsArr.map(s => `<span role="listitem">${s}</span>`).join('');
            } else if (themeId === 'tpl-bright') {
                skillsContainer.innerHTML = skillsArr.join(' / ');
            } else if (themeId === 'tpl-minimal') {
                skillsContainer.innerHTML = skillsArr.map(s => `<p class="tpl1-text" role="listitem">${s}</p>`).join('');
            } else {
                skillsContainer.textContent = data.skills;
            }
        }

        const renderList = (selector, dataString, emptyMsg, templateHTMLFunc) => {
            const container = tpl.querySelector(selector);
            if (!container) return;
            
            container.innerHTML = ''; 
            
            if (!dataString || dataString === '[]') { 
                container.innerHTML = `<p style="color: #666; font-style: italic;">${emptyMsg}</p>`; 
                return; 
            }
            
            try {
                const arr = typeof dataString === 'string' ? JSON.parse(dataString) : dataString;
                if (arr.length === 0) {
                    container.innerHTML = `<p style="color: #666; font-style: italic;">${emptyMsg}</p>`;
                } else {
                    container.innerHTML = arr.map(templateHTMLFunc).join('');
                }
            } catch (e) { 
                console.error("Parse JSON error for", selector, e); 
            }
        };

        renderList('.render-edu-list', data.education_history, 'ไม่มีข้อมูลประวัติการศึกษา', (item) => {
            if(themeId === 'tpl-bright') return `<div class="tpl4-detail" style="margin-bottom: 10px;"><p class="tpl4-text-dark"><strong>${item.institution || ''}</strong></p><p class="tpl4-meta">${item.level || ''} ${item.major || ''}</p><p>GPA: ${item.gpa || '-'}</p></div>`;
            else if (themeId === 'tpl-modern') return `<p class="tpl2-text-white" style="margin-bottom: 10px;"><strong>${item.institution || ''}</strong><br>${item.level || ''} ${item.major || ''}<br>GPA: ${item.gpa || '-'}</p>`;
            else if (themeId === 'tpl-vintage') return `<div class="tpl3-exp-grid"><div class="tpl3-exp-left"><strong>${item.institution || ''}</strong></div><div class="tpl3-exp-right"><strong>${item.level || ''} ${item.major || ''}</strong><br>GPA ${item.gpa || '-'}</div></div>`;
            else return `<div class="tpl1-exp" style="margin-bottom: 15px;"><div class="tpl1-exp-header"><h4>${item.level || ''} ${item.major || ''}</h4></div><p class="tpl1-company">${item.institution || ''}</p><p class="tpl1-desc">GPA: ${item.gpa || '-'}</p></div>`;
        });

        renderList('.render-work-list', data.work_experience, 'ไม่มีข้อมูลประสบการณ์ทำงาน', (item) => {
            if(themeId === 'tpl-bright') return `<div class="tpl4-time-item"><div class="tpl4-year-badge">${item.duration || 'ไม่ระบุเวลา'}</div><h4>${item.title || ''}</h4><p class="tpl4-meta">${item.company || ''}</p></div>`;
            else if (themeId === 'tpl-vintage') return `<div class="tpl3-exp-grid"><div class="tpl3-exp-left"><strong>${item.company || ''}</strong><br>${item.duration || ''}</div><div class="tpl3-exp-right"><strong>${item.title || ''}</strong></div></div>`;
            else return `<div class="tpl1-exp" style="margin-bottom: 15px;"><div class="tpl1-exp-header"><h4>${item.title || ''}</h4><span>${item.duration || ''}</span></div><p class="tpl1-company">${item.company || ''}</p></div>`;
        });

        renderList('.render-intern-list', data.intern_experience, 'ไม่มีข้อมูลฝึกงาน', (item) => {
            if(themeId === 'tpl-bright') return `<div class="tpl4-time-item"><div class="tpl4-year-badge">${item.duration || 'ไม่ระบุเวลา'}</div><h4>${item.title || ''}</h4><p class="tpl4-meta">${item.company || ''}</p></div>`;
            else return `<div style="margin-bottom:15px; padding-bottom:10px; border-bottom:1px dashed #ddd;"><div style="font-weight:bold; font-size:1.1em; color:inherit;">${item.title || ''}</div><div style="color:inherit;">${item.company || ''} | ${item.duration || ''}</div></div>`;
        });

        renderList('.render-activity-list', data.activities, 'ไม่มีข้อมูลกิจกรรม', (item) => {
            if(themeId === 'tpl-bright') return `<div class="tpl4-time-item"><h4>${item.name || ''}</h4><p class="tpl4-meta">${item.role || ''}</p></div>`;
            else return `<div style="margin-bottom:15px;"><div style="font-weight:bold; font-size:1.1em; color:inherit;">${item.name || ''}</div><div style="color:inherit;">${item.role || ''}</div></div>`;
        });
    }

    // ==========================================
    // 🌟 12. ระบบคำนวณ Ranking ขั้นเทพ (Rule-based + AI Matching)
    // ==========================================
    // แก้ไขชื่อคลาสให้ตรงกับ HTML ของคุณคือ .ranking-list
    const rankListContainer = document.querySelector('.ranking-list'); 
    
    if (rankListContainer) {
        loadAndRankJobsWithAI();
    }

    async function loadAndRankJobsWithAI() {
        try {
            // 1. แสดง Loading State 
            rankListContainer.innerHTML = `
                <div style="text-align: center; padding: 80px 20px; width: 100%;">
                    <svg class="loading-spinner" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1.5s linear infinite; margin: 0 auto;">
                        <circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 0 1 10 10"></path>
                    </svg>
                    <style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>
                    <h3 style="color:#ea580c; margin-top:20px; font-size: 24px;">🤖 AI กำลังเปรียบเทียบเรซูเม่ของคุณกับประกาศงาน...</h3>
                    <p style="color:#666; margin-top:10px; font-size: 16px;">โปรดรอสักครู่ ระบบกำลังประเมินทักษะ ประสบการณ์ และทัศนคติแบบเจาะลึก 100 คะแนน</p>
                </div>
            `;

            // 2. ดึงข้อมูลงานทั้งหมด และข้อมูลเรซูเม่ของผู้ใช้ (แก้ไข URL API เป็น /api/jobs)
            const res = await fetch('http://localhost:3000/api/jobs');
            const jobs = await res.json();
            
            const userId = sessionStorage.getItem('userId') || 1;
            const resumeRes = await fetch(`http://localhost:3000/api/get-resume/${userId}`);
            const resume = await resumeRes.json();

            // 3. เตรียมข้อมูลส่งให้ AI 
            const eduStr = JSON.stringify(resume.education_history || []);
            const expStr = "ทำงาน: " + JSON.stringify(resume.work_experience || []) + " ฝึกงาน: " + JSON.stringify(resume.intern_experience || []) + " กิจกรรม: " + JSON.stringify(resume.activities || []);
            const skillStr = resume.skills || '';
            const inspStr = resume.summary || '';

            let rankedJobs = [];

            // 4. วนลูปให้คะแนนทีละงาน
            await Promise.all(jobs.map(async (job) => {
                let ruleScore = 0;
                let matchDetails = [];

                // 🟢 ส่วนที่ 1: Rule-based Logic (คำนวณโดยระบบ - เต็ม 20 คะแนน)
                const reqDisType = job.disability_type || '';
                const myDisType = resume.disability_type || '';
                
                if (reqDisType === 'รับทุกประเภท' || reqDisType.includes(myDisType) || (myDisType && reqDisType.includes(myDisType))) {
                    ruleScore = 20; 
                    matchDetails.push("✔️ สภาพแวดล้อมและสวัสดิการรองรับประเภทความพิการของคุณ (+20 Pts)");
                } else {
                    ruleScore = 0;
                    matchDetails.push("⚠️ สภาพแวดล้อมอาจยังไม่รองรับประเภทความพิการของคุณโดยตรง");
                }

                // 🧠 ส่วนที่ 2: AI Semantic Logic (คำนวณโดย AI - เต็ม 80 คะแนน)
                let aiScore = 0;
                try {
                    const aiRes = await fetch('http://localhost:3000/api/get-ai-match', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            job_title: job.job_title || '',
                            job_desc: job.job_desc || '',
                            req_skills: job.req_skills || '',
                            education_history: eduStr,
                            experience_and_activities: expStr,
                            skills_and_custom_skills: skillStr,
                            inspiration_message: inspStr
                        })
                    });
                    const aiData = await aiRes.json();
                    
                    if (aiData && aiData.total_ai_score !== undefined) {
                        aiScore = aiData.total_ai_score;
                        if (aiData.match_reasons && Array.isArray(aiData.match_reasons)) {
                            matchDetails = matchDetails.concat(aiData.match_reasons);
                        }
                    } else {
                        aiScore = 40; 
                        matchDetails.push("🤖 ประเมินทักษะพื้นฐานเบื้องต้น");
                    }
                } catch(e) {
                    console.error("AI Match Error for job:", job.id, e);
                    aiScore = 40; 
                }

                // รวมคะแนน (เต็ม 100)
                const totalScore = ruleScore + aiScore;
                rankedJobs.push({ ...job, matchScore: totalScore, matchDetails });
            }));

            // 5. เรียงลำดับจากคะแนนมากไปน้อย
            rankedJobs.sort((a, b) => b.matchScore - a.matchScore);

            // 6. นำข้อมูลที่ได้มาวาดลงหน้ากระดาษ (ปรับให้ตรงกับ Layout ของ resume4.html เดิม)
            rankListContainer.innerHTML = ''; 

            rankedJobs.forEach((job, index) => {
                let badgeColor = job.matchScore >= 80 ? '#17A05D' : (job.matchScore >= 60 ? '#eab308' : '#ea580c');
                let logoText = job.company_name ? job.company_name.substring(0, 2).toUpperCase() : 'JB';
                
                rankListContainer.innerHTML += `
                    <div class="rank-card" role="listitem" tabindex="0" onclick="window.location.href='resume5.html?jobId=${job.id}'" style="cursor: pointer; position: relative; border-left: 6px solid ${badgeColor}; padding-right: 120px;">
                        
                        <div class="rank-number" style="background-color: ${badgeColor};" aria-hidden="true">${index + 1}</div>
                        <div class="rank-logo-placeholder" style="background-color: ${badgeColor}; color: white;" aria-hidden="true">${logoText}</div> 
                        
                        <div class="rank-company" aria-hidden="true">${job.company_name}</div>
                        
                        <div class="rank-position" aria-hidden="true">
                            <span class="rank-label">ตำแหน่งที่รับ :</span>
                            <span class="rank-value">${job.job_title}</span>
                        </div>
                        
                        <div class="rank-type" aria-hidden="true">
                            <span class="rank-label">ประเภทงาน :</span>
                            <span class="rank-value">${job.job_type || 'ไม่ระบุ'}</span>
                        </div>

                        <div style="margin-top: 12px; margin-left: 80px; display: flex; flex-wrap: wrap; gap: 6px;">
                            ${job.matchDetails.slice(0, 2).map(m => `<span style="background:#f1f5f9; padding:4px 10px; border-radius:20px; font-size:12px; color:#475569;">✨ ${m}</span>`).join('')}
                        </div>

                        <div style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; align-items: center; justify-content: center; width: 75px; height: 75px; border: 4px solid ${badgeColor}; border-radius: 50%; background: #fff;">
                            <span style="color: ${badgeColor}; font-size: 22px; font-weight: 800; line-height: 1;">${job.matchScore}</span>
                            <span style="font-size: 10px; color: #64748b; font-weight: 600; margin-top: 2px;">MATCH</span>
                        </div>
                    </div>
                `;
            });

            // Accessibility สำหรับผู้พิการทางสายตา (ให้ใช้คีย์บอร์ดกด Enter เพื่อเข้าดูงานได้)
            const rCards = document.querySelectorAll('.rank-card');
            rCards.forEach(card => {
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') { 
                        e.preventDefault(); 
                        window.location.href = 'resume5.html?jobId=' + card.querySelector('div[onclick]').getAttribute('onclick').match(/'([^']+)'/)[1].split('=')[1]; 
                    }
                });
            });

        } catch (error) { 
            console.error("Error matching jobs:", error); 
            rankListContainer.innerHTML = '<div style="text-align:center; padding: 40px; width: 100%;"><p style="color:#ef4444; font-size: 18px; font-weight: 600;">❌ เกิดข้อผิดพลาดในการคำนวณและดึงข้อมูลงาน</p><p style="color:#666;">กรุณาลองตรวจสอบเซิร์ฟเวอร์หรือรีเฟรชหน้าเว็บอีกครั้ง</p></div>';
        }
    }

    // ==========================================
    // --- 13. หน้าส่งเรซูเม่ (resume5.html) ---
    // ==========================================
    const btnSendResume = document.getElementById('btn-send-resume');
    const sendSuccessModal = document.getElementById('send-success-modal');

    if (sendSuccessModal) sendSuccessModal.setAttribute('role', 'alertdialog');

    if (btnSendResume) {
        btnSendResume.addEventListener('click', async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const jobId = urlParams.get('jobId'); 
            
            if (!loggedInId) {
                alert("กรุณาเข้าสู่ระบบก่อนสมัครงาน");
                return;
            }

            try {
                const res = await fetch('http://localhost:3000/api/apply-job', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        seeker_id: loggedInId, 
                        job_id: jobId || 0,
                        match_score: 0,
                        match_details: []
                    })
                });
                
                const data = await res.json();
                
                if(data.success) {
                    announce('ส่งเรซูเม่สำเร็จ');
                    sendSuccessModal.style.display = 'flex';
                    
                    btnSendResume.textContent = 'ส่งเรซูเม่แล้ว';
                    btnSendResume.style.backgroundColor = '#D9D9D9';
                    btnSendResume.style.color = '#666';
                    btnSendResume.style.boxShadow = 'none';
                    btnSendResume.style.cursor = 'default';
                    btnSendResume.disabled = true;
                    btnSendResume.setAttribute('aria-label', 'ส่งเรซูเม่สำหรับงานนี้แล้ว ไม่สามารถกดซ้ำได้');
                    
                    setTimeout(() => { 
                        sendSuccessModal.style.display = 'none'; 
                    }, 3000);
                } else {
                    alert("❌ เกิดข้อผิดพลาดในการส่งใบสมัคร: " + data.error);
                }
            } catch (err) {
                alert("⚠️ เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ");
            }
        });

        if (sendSuccessModal) {
            sendSuccessModal.addEventListener('click', (e) => {
                if (e.target === sendSuccessModal) {
                    sendSuccessModal.style.display = 'none';
                }
            });
        }
    }

    // ==========================================
    // --- 14. หน้าโพสต์งานของนายจ้าง (post-employer.html) ---
    // ==========================================
    const postJobForm = document.getElementById('post-job-form');
    const postSuccessModal = document.getElementById('post-success-modal');

    if (postJobForm && postSuccessModal) {
        postJobForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            const employerId = sessionStorage.getItem('userId');
            if (!employerId) {
                alert('⚠️ เซสชันหมดอายุ กรุณาเข้าสู่ระบบนายจ้างอีกครั้ง');
                window.location.href = 'login-employer.html';
                return;
            }

            const job_title = document.getElementById('job-title')?.value || '';
            const job_category = document.getElementById('job-category')?.value || '';
            const job_type = document.getElementById('job-type')?.value || '';
            const job_location = document.getElementById('job-location')?.value || '';
            const job_salary = document.getElementById('job-salary')?.value || '';
            const facility_desc = document.getElementById('facility-desc')?.value || '';
            
            const desc = document.getElementById('job-description')?.value || '';
            const qual = document.getElementById('job-qualifications')?.value || '';
            const job_desc = `รายละเอียดงาน:\n${desc}\n\nคุณสมบัติผู้สมัคร:\n${qual}`;

            const skillGroups = document.querySelectorAll('.skills-group');
            
            let disability_type = '';
            if (skillGroups.length > 0) {
                const disChecked = Array.from(skillGroups[0].querySelectorAll('.skill-checkbox:checked'));
                disability_type = disChecked.map(cb => cb.nextElementSibling.textContent.trim()).join(', ');
            }

            let req_skills = '';
            if (skillGroups.length > 1) {
                const skillChecked = Array.from(skillGroups[1].querySelectorAll('.skill-checkbox:checked'));
                req_skills = skillChecked.map(cb => cb.nextElementSibling.textContent.trim()).join(', ');
            }

            const payload = {
                employer_id: employerId,
                job_title: job_title,
                job_category: job_category,
                job_type: job_type,
                job_location: job_location,
                job_salary: job_salary,
                facility_desc: facility_desc,
                job_description: job_description,
                job_qualifications: job_qualifications,
                disability_type: disability_type || 'รับทุกประเภท', 
                req_skills: req_skills,
                status: 'open'
            };

            try {
                const response = await fetch('http://localhost:3000/api/save-job', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    announce('โพสต์งานสำเร็จ ระบบกำลังพาท่านไปหน้าถัดไป');
                    postSuccessModal.style.display = 'flex';
                    
                    postSuccessModal.setAttribute('data-job-id', result.job_id);
                    
                    setTimeout(() => {
                        postSuccessModal.style.display = 'none';
                        window.location.href = 'post-employer2.html?jobId=' + result.job_id;
                    }, 3000);
                } else {
                    alert('❌ เกิดข้อผิดพลาดจากฐานข้อมูล: ' + (result.error || result.message));
                }
            } catch (error) {
                alert('⚠️ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบว่ารัน node server.js หรือยัง');
            }
        });

        postSuccessModal.addEventListener('click', (e) => {
            if (e.target === postSuccessModal) {
                postSuccessModal.style.display = 'none';
                const savedJobId = postSuccessModal.getAttribute('data-job-id');
                window.location.href = 'post-employer2.html' + (savedJobId ? '?jobId=' + savedJobId : '');
            }
        });
    }

    // ==========================================
    // --- 15. ปุ่ม "ย้อนกลับ" ---
    // ==========================================
    const backButtons = document.querySelectorAll('.btn-back');
    backButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentPage = window.location.pathname.split("/").pop();
            
            if (currentPage === 'resume2.html') {
                window.location.href = 'resume.html';
            } else if (currentPage === 'resume3.html') {
                window.location.href = 'resume2.html';
            } else if (currentPage === 'resume4.html') {
                window.location.href = 'resume3.html';
            } else if (currentPage === 'resume5.html') {
                window.location.href = 'resume4.html';
            } else {
                window.history.back(); 
            }
        });
    });

    // ==========================================
    // 🌟 16. ระบบดึงข้อมูลงานมาแสดงในหน้า post-employer2.html
    // ==========================================
    const isPostEmployer2Page = window.location.pathname.includes('post-employer2.html');
    if (isPostEmployer2Page) {
        const urlParams = new URLSearchParams(window.location.search);
        const jobId = urlParams.get('jobId');

        if (jobId) {
            fetch(`http://localhost:3000/api/get-job/${jobId}`)
                .then(res => res.json())
                .then(job => {
                    if(job && job.job_title) {
                        const setEl = (id, text) => { if(document.getElementById(id)) document.getElementById(id).textContent = text; };
                        
                        setEl('render-job-title', job.job_title);
                        setEl('render-company-name', job.company_name);
                        document.getElementById('render-job-logo').textContent = (job.company_name || 'C').charAt(0); 
                        
                        document.getElementById('render-job-location').innerHTML = `<span aria-hidden="true">📍</span> ${job.job_location || '-'}`;
                        document.getElementById('render-job-type').innerHTML = `<span aria-hidden="true">💼</span> ${job.job_type || '-'}`;
                        document.getElementById('render-job-salary').innerHTML = `<span aria-hidden="true">💰</span> ${job.salary || 'ตามตกลง'}`;
                        
                        document.getElementById('render-job-desc').textContent = job.job_desc || '-';
                        document.getElementById('render-req-skills').textContent = job.req_skills || '-';

                        const accom = job.accommodation ? job.accommodation : 'ไม่ได้ระบุ';
                        document.getElementById('render-disability-support').innerHTML = `บริษัทยินดีต้อนรับผู้สมัครที่เป็นผู้พิการ <strong>${job.disability_type || 'รับทุกประเภท'}</strong> โดยมีสิ่งอำนวยความสะดวก: <strong>${accom}</strong>`;
                    }
                })
                .catch(err => console.error("Error fetching job details:", err));
        }
    }
    // ==========================================
    // 🌟 17. ระบบดาวน์โหลดเรซูเม่เป็น PDF (หน้า profile-job2.html)
    // ==========================================
    if (window.location.pathname.includes('profile-job2.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('export') === 'pdf') {
            setTimeout(() => {
                const buttons = document.querySelectorAll('.btn-submit-resume, .site-header');
                buttons.forEach(btn => btn.style.display = 'none');
                
                window.print();
                
                buttons.forEach(btn => btn.style.display = '');
            }, 1500);
        }
    }

});