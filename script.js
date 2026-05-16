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

    /* ========= 🔵 0.1 TOAST NOTIFICATION ========= */
    function showToast(message, type = 'success') {
        // ── อัปเดต sr live region เพื่อให้ screen reader อ่านออกเสียง ──
        announce(message);

        // ── สร้าง toast element (visual only — sr อ่านจาก live region แล้ว) ──
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.setAttribute('aria-hidden', 'true'); // ป้องกัน sr อ่านซ้ำ (อ่านจาก announce แล้ว)
        toast.textContent = message;
        document.body.appendChild(toast);

        // ── slide in ──
        requestAnimationFrame(() => {
            requestAnimationFrame(() => toast.classList.add('toast-show'));
        });

        // ── หายไปเองใน 3 วินาที ──
        setTimeout(() => {
            toast.classList.add('toast-hide');
            toast.addEventListener('transitionend', () => toast.remove(), { once: true });
        }, 3000);
    }

    // ==========================================
    // 🌟 0.1 ระบบป้องกันการเข้าถึงหน้าเว็บ (Auth Guard)
    // ==========================================
    const currentPageUrl = window.location.pathname.split("/").pop() || 'index.html';
    const loggedInUser = sessionStorage.getItem('userName');
    const loggedInType = sessionStorage.getItem('userType');
    const loggedInId = (sessionStorage.getItem('userId') || '').split(':')[0].trim();

    // ลิสต์หน้าเว็บของแต่ละฝั่ง
    const seekerPages = ['home-jobseeker.html', 'resume.html', 'resume2.html', 'resume3.html', 'resume4.html', 'resume5.html', 'job-search.html', 'profile-job.html', 'profile-job2.html', 'job-detail.html'];
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
                sessionStorage.removeItem('existingProfilePic'); // ล้างความจำรูปภาพ
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

    // ==========================================
    // --- 4b. ระบบค้นหางาน (Navbar Search Bar) แบบจำสถานะเมื่อกดย้อนกลับ ---
    // ==========================================
    const navSearchInput  = document.getElementById('navbar-search-input');
    const navSearchSubmit = document.getElementById('navbar-search-submit');
    const navFilterBtn    = document.getElementById('navbar-filter-btn');
    const navFilterPanel  = document.getElementById('navbar-filter-panel');
    const filterApplyBtn  = document.getElementById('filter-apply-btn');
    const filterResetBtn  = document.getElementById('filter-reset-btn');
    const searchResultsSec  = document.getElementById('search-results-section');
    const searchResultsGrid = document.getElementById('search-results-grid');
    const searchResultsTitle= document.getElementById('search-results-title');
    const searchResultsCount= document.getElementById('search-results-count');
    const searchResultsClose= document.getElementById('search-results-close');

    if (navSearchInput) {

        // ── ป้าย map ──
        const CAT_LABELS  = { admin:'งานธุรการ', it:'งานไอที', service:'งานบริการ', production:'งานผลิต', finance:'งานบัญชี/การเงิน' };
        const TYPE_LABELS = { fulltime:'ประจำ', parttime:'พาร์ทไทม์', freelance:'ฟรีแลนซ์', contract:'สัญญาจ้าง' };
        const DIS_LABELS  = { visual:'ทางการมองเห็น', hearing:'ทางการได้ยิน', physical:'ทางกายหรือการเคลื่อนไหว', ทางการเคลื่อนไหว:'ทางกายหรือการเคลื่อนไหว' };

        // ── ตรวจสอบ URL Parameters ตอนโหลดหน้า ──
        const urlParams = new URLSearchParams(window.location.search);
        const savedQuery = urlParams.get('q');
        const savedCategory = urlParams.get('category');
        const savedType = urlParams.get('type');

        // หากมี History Parameters ค้างอยู่ ให้แสดงค่ากลับคืนฟอร์มแล้วค้นหาอัตโนมัติ
        if (savedQuery || savedCategory || savedType) {
            navSearchInput.value = savedQuery || '';
            const fc = document.getElementById('filter-category');
            const ft = document.getElementById('filter-type');
            if (fc && savedCategory) fc.value = savedCategory;
            if (ft && savedType) ft.value = savedType;

            // หน่วงเวลาเล็กน้อยเพื่อให้ระบบโหลดเสร็จก่อนค่อยเริ่มค้นหา
            setTimeout(() => {
                executeSearchQuery(savedQuery, savedCategory, savedType);
            }, 100);
        }

        // ── Toggle filter panel ──
        navFilterBtn?.addEventListener('click', () => {
            const isOpen = !navFilterPanel.hidden;
            navFilterPanel.hidden = isOpen;
            navFilterBtn.setAttribute('aria-expanded', String(!isOpen));
            navFilterBtn.classList.toggle('active', !isOpen);
        });

        // ── ปิด filter panel เมื่อคลิกนอก ──
        document.addEventListener('click', (e) => {
            if (navFilterPanel && !navFilterPanel.hidden) {
                if (!navFilterPanel.contains(e.target) && e.target !== navFilterBtn && !navFilterBtn?.contains(e.target)) {
                    navFilterPanel.hidden = true;
                    navFilterBtn?.setAttribute('aria-expanded', 'false');
                    navFilterBtn?.classList.remove('active');
                }
            }
        });

        // ── helper: scroll ไปยัง search results section (หักลบความสูง sticky header) ──
        function scrollToResults() {
            if (!searchResultsSec) return;
            const headerH = document.querySelector('.site-header')?.offsetHeight || 0;
            const top = searchResultsSec.getBoundingClientRect().top + window.pageYOffset - headerH - 12;
            window.scrollTo({ top, behavior: 'smooth' });
        }

        // ── ฟังก์ชัน render ผลลัพธ์ ──
        function renderSearchResults(jobs, q) {
            if (!searchResultsSec) return;
            searchResultsSec.style.display = 'block';

            const kw = (q || '').trim();
            if (searchResultsTitle) searchResultsTitle.textContent = kw ? `ผลการค้นหา "${kw}"` : 'ผลการค้นหาทั้งหมด';
            if (searchResultsCount) searchResultsCount.textContent = `พบ ${jobs.length} ตำแหน่งงาน`;

            if (jobs.length === 0) {
                searchResultsGrid.innerHTML = `
                    <div class="search-no-result">
                        <h3>ไม่พบงานที่ตรงกับการค้นหา</h3>
                        <p>ลองใช้คำค้นหาอื่น หรือปรับตัวกรองใหม่</p>
                    </div>`;
                scrollToResults();
                return;
            }

            searchResultsGrid.innerHTML = jobs.map(job => {
                const catLabel  = CAT_LABELS[job.job_category]  || job.job_category || '';
                const typeLabel = TYPE_LABELS[job.job_type] || job.job_type || '';
                const salary    = job.salary ? `฿${Number(job.salary).toLocaleString()}` : '';
                const disArr    = (job.disability_type || '').split(',').map(d => {
                    const k = d.trim();
                    return DIS_LABELS[k] || k;
                }).filter(Boolean);
                const disText   = disArr.join(', ');

                return `
                <a href="job-detail.html?id=${job.id}" class="search-job-card" role="listitem"
                   aria-label="ดูรายละเอียดงาน ${job.job_title || ''} บริษัท ${job.company_name || ''}">
                    <h3 class="search-job-title">${job.job_title || 'ไม่ระบุตำแหน่ง'}</h3>
                    <p class="search-job-company">${job.company_name || ''}</p>
                    <div class="search-job-tags">
                        ${catLabel  ? `<span class="search-job-tag">${catLabel}</span>` : ''}
                        ${typeLabel ? `<span class="search-job-tag tag-type">${typeLabel}</span>` : ''}
                        ${salary   ? `<span class="search-job-tag tag-salary">${salary}</span>` : ''}
                    </div>
                    ${job.job_location ? `<div class="search-job-meta">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        ${job.job_location}</div>` : ''}
                    ${disText ? `<div class="search-job-meta">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        รับ: ${disText}</div>` : ''}
                    <div class="search-job-cta">ดูรายละเอียด
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                </a>`;
            }).join('');

            scrollToResults();
        }

        // ── ฟังก์ชันเตรียมเงื่อนไขก่อนส่งขึ้น URL ──
        function initiateSearch() {
            const q        = (navSearchInput.value || '').trim();
            const category = document.getElementById('filter-category')?.value || '';
            const type     = document.getElementById('filter-type')?.value     || '';

            if (!q && !category && !type) {
                // ไม่มีเงื่อนไขเลย → เคลียร์ URL Parameters กลับเป็นหน้าปกติ และซ่อน results
                window.history.replaceState({}, '', window.location.pathname);
                if (searchResultsSec) searchResultsSec.style.display = 'none';
                return;
            }

            // แปะค่าลง URL Parameters เพื่อให้เบราว์เซอร์ช่วยจำสถานะ
            const searchParams = new URLSearchParams();
            if (q) searchParams.set('q', q);
            if (category) searchParams.set('category', category);
            if (type) searchParams.set('type', type);
            
            const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
            window.history.replaceState({}, '', newUrl);

            // ดึงผลลัพธ์จาก API ต่อ
            executeSearchQuery(q, category, type);
        }

        // ── ฟังก์ชันตัวดึงข้อมูลจาก API ──
        async function executeSearchQuery(q, category, type) {
            if (searchResultsSec) {
                searchResultsSec.style.display = 'block';
                if (searchResultsTitle) searchResultsTitle.textContent = 'กำลังค้นหา...';
                if (searchResultsCount) searchResultsCount.textContent = '';
                if (searchResultsGrid)  searchResultsGrid.innerHTML = `<div class="search-no-result" style="padding:30px 0;"><p style="color:#94A3B8;">⏳ กำลังโหลดผลลัพธ์...</p></div>`;
                scrollToResults();
            }

            const params = new URLSearchParams();
            if (q)        params.set('q', q);
            if (category) params.set('category', category);
            if (type)     params.set('type', type);

            try {
                const res  = await fetch(`http://localhost:3000/api/jobs/search?${params}`);
                const jobs = await res.json();
                renderSearchResults(jobs, q);
            } catch (err) {
                console.error('Search error:', err);
                if (searchResultsSec) {
                    searchResultsSec.style.display = 'block';
                    if (searchResultsTitle) searchResultsTitle.textContent = 'ผลการค้นหา';
                    if (searchResultsCount) searchResultsCount.textContent = '';
                    if (searchResultsGrid) searchResultsGrid.innerHTML = `<div class="search-no-result"><h3>เชื่อมต่อเซิร์ฟเวอร์ไม่ได้</h3><p>กรุณาตรวจสอบว่า server กำลังรันอยู่</p></div>`;
                    scrollToResults();
                }
            }

            if (navFilterPanel) navFilterPanel.hidden = true;
            navFilterBtn?.setAttribute('aria-expanded', 'false');
            navFilterBtn?.classList.remove('active');
        }

        // ── Event: กด Enter ──
        navSearchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') initiateSearch(); });

        // ── Event: กดปุ่ม search ──
        navSearchSubmit?.addEventListener('click', initiateSearch);

        // ── Event: ปุ่มค้นหาใน filter panel ──
        filterApplyBtn?.addEventListener('click', initiateSearch);

        // ── Event: ล้างค่า ──
        filterResetBtn?.addEventListener('click', () => {
            navSearchInput.value = '';
            const fc = document.getElementById('filter-category');
            const ft = document.getElementById('filter-type');
            if (fc) fc.value = '';
            if (ft) ft.value = '';
            
            // เคลียร์ URL History 
            window.history.replaceState({}, '', window.location.pathname);
            if (searchResultsSec) searchResultsSec.style.display = 'none';
        });

        // ── Event: ปุ่มปิดผลลัพธ์ ──
        searchResultsClose?.addEventListener('click', () => {
            if (searchResultsSec) searchResultsSec.style.display = 'none';
            window.history.replaceState({}, '', window.location.pathname); // เคลียร์ URL History เพื่อไม่ให้โหลดอัตโนมัติรอบหน้า
        });
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
    // 🌟 7. ระบบโปรไฟล์ผู้ใช้งาน (อัปเดตระบบลบและโหลด PDF)
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

                    const seekerResumeSection = document.getElementById('seeker-resume-section');
                    if (seekerResumeSection) {
                        if (data.selected_template || (data.address && data.address.trim() !== '')) {
                            seekerResumeSection.style.display = 'block';
                            
                            const fileNameEl = document.getElementById('resume-file-name');
                            if (fileNameEl) {
                                fileNameEl.textContent = data.first_name + ' ' + data.last_name;
                            }
                            
                            let dateText = '-';
                            if (data.updated_at || data.created_at) {
                                const d = new Date(data.updated_at || data.created_at);
                                dateText = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()+543}`;
                            } else {
                                const d = new Date();
                                dateText = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()+543}`;
                            }
                            setEl('resume-file-date', `${dateText}`);

                            const fileMenuBtn = document.querySelector('.file-menu-btn');
                            const actionDropdown = document.querySelector('.action-dropdown');
                            const btnDownload = document.getElementById('btn-download-pdf');
                            const btnDelete = document.getElementById('btn-delete-resume');

                            if (fileMenuBtn && actionDropdown) {
                                fileMenuBtn.addEventListener('click', (e) => {
                                    e.stopPropagation();
                                    const isExpanded = fileMenuBtn.getAttribute('aria-expanded') === 'true';
                                    fileMenuBtn.setAttribute('aria-expanded', !isExpanded);
                                    actionDropdown.classList.toggle('show');
                                });
                                document.addEventListener('click', () => {
                                    fileMenuBtn.setAttribute('aria-expanded', 'false');
                                    actionDropdown.classList.remove('show');
                                });
                            }

                            if (btnDownload) {
                                btnDownload.addEventListener('click', () => {
                                    window.location.href = 'profile-job2.html?export=pdf';
                                });
                            }

                            if (btnDelete) {
                                btnDelete.addEventListener('click', async () => {
                                    if (confirm('⚠️ คุณแน่ใจหรือไม่ว่าต้องการลบเรซูเม่นี้? ข้อมูลจะไม่สามารถกู้คืนได้')) {
                                        try {
                                            const res = await fetch(`http://localhost:3000/api/delete-resume/${loggedInId}`, { method: 'DELETE' });
                                            const result = await res.json();
                                            if (result.success) {
                                                alert('ลบเรซูเม่เรียบร้อยแล้ว');
                                                sessionStorage.removeItem('tempResumeData');
                                                window.location.reload(); 
                                            } else {
                                                alert('❌ ' + result.message);
                                            }
                                        } catch (error) {
                                            alert('⚠️ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
                                        }
                                    }
                                });
                            }

                        } else {
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
                    setEl('prof-address', data.address || 'ยังไม่ได้ระบุที่อยู่');
                }
            }).catch(err => console.error("Error loading employer profile:", err));

            // ── โหลดข้อมูล Subscription (profile-em.html) ──
            (async function loadSubscriptionInfo() {
                const subDisplay = document.getElementById('sub-plan-display');
                if (!subDisplay) return;
                try {
                    const res  = await fetch(`http://localhost:3000/api/employer-subscription/${loggedInId}`);
                    const data = await res.json();

                    const now    = new Date();
                    const expiry = data.subscription_expires_at ? new Date(data.subscription_expires_at) : null;
                    const isExpired = expiry && expiry <= now;

                    const fmtDate = (d) => d ? d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';

                    let html = '';

                    if (data.is_free_trial) {
                        const remaining = Math.max(0, 30 - (data.account_age_days || 0));
                        html = `Free Trial — ใช้ไปแล้ว <strong>${data.post_count}/3</strong> โพสต์ &nbsp;·&nbsp; เหลืออีก <strong>${remaining} วัน</strong>`;
                    } else if (data.subscription_plan === 'pay_per_post') {
                        html = isExpired
                            ? `Pay Per Post — <span style="color:#ef4444; font-weight:600;">หมดอายุแล้ว (${fmtDate(expiry)})</span>`
                            : `Pay Per Post — หมดอายุ ${fmtDate(expiry)}`;
                    } else if (data.subscription_plan === 'monthly') {
                        html = isExpired
                            ? `รายเดือน — <span style="color:#ef4444; font-weight:600;">หมดอายุแล้ว (${fmtDate(expiry)})</span>`
                            : `รายเดือน — หมดอายุ ${fmtDate(expiry)} <span class="sub-badge sub-badge--inclusive">Inclusive Employer</span>`;
                    } else if (data.subscription_plan === 'yearly') {
                        html = isExpired
                            ? `รายปี — <span style="color:#ef4444; font-weight:600;">หมดอายุแล้ว (${fmtDate(expiry)})</span>`
                            : `รายปี — หมดอายุ ${fmtDate(expiry)} <span class="sub-badge sub-badge--verified">Verified Inclusive Employer</span>`;
                    } else {
                        html = '<span style="color:#94a3b8;">ไม่มีแพ็คเกจที่ใช้งานอยู่</span>';
                    }

                    // แสดงปุ่มต่ออายุถ้าหมดอายุหรือไม่มีแพ็คเกจ
                    if (isExpired || (!data.is_free_trial && !data.subscription_plan)) {
                        html += ` &nbsp;<a href="payment.html" class="renewal-link">ต่ออายุแพ็คเกจ →</a>`;
                    }

                    subDisplay.innerHTML = html;
                } catch (err) {
                    console.error('Error loading subscription info:', err);
                    const el = document.getElementById('sub-plan-display');
                    if (el) el.textContent = 'ไม่สามารถโหลดข้อมูลแพ็คเกจได้';
                }
            })();

            // --- 🌟 อัปเดตตัวเลขแจ้งเตือน (Badge) หน้า Profile นายจ้าง ---
            const inboxBadge = document.getElementById('employer-inbox-badge');
            if (inboxBadge) {
                fetch(`http://localhost:3000/api/employer-unread-count/${loggedInId}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.unread_count > 0) {
                            inboxBadge.textContent = data.unread_count;
                            inboxBadge.style.display = 'flex'; // โชว์วงกลมสีแดงเมื่อมีเลข
                        } else {
                            inboxBadge.style.display = 'none'; // ซ่อนถ้าไม่มีใบสมัครใหม่
                        }
                    })
                    .catch(err => console.error("Error loading unread count:", err));
            }

            const empJobsSection = document.getElementById('employer-jobs-section');
            const empJobsList = document.getElementById('employer-jobs-list');
            
            if (empJobsSection && empJobsList) {
                // ── ตรวจสอบโพสต์ที่หมดอายุก่อนโหลดรายการ ──
                fetch('http://localhost:3000/api/jobs/expire-check', { method: 'POST' })
                    .catch(() => {}); // ไม่ block ถ้า endpoint ยังไม่มี

                fetch(`http://localhost:3000/api/get-employer-jobs/${loggedInId}`)
                    .then(res => res.json())
                    .then(jobs => {
                        if (jobs.length > 0) {
                            empJobsSection.style.display = 'block';
                            empJobsList.innerHTML = '';
                            jobs.forEach(job => {
                                // ── สถานะและ badge ──
                                let statusText  = 'เปิดรับสมัคร';
                                let statusColor = '#059669';
                                let expiredBadgeHtml = '';

                                if (job.status === 'expired') {
                                    statusText       = 'หมดอายุแล้ว';
                                    statusColor      = '#ef4444';
                                    expiredBadgeHtml = '<span class="expired-badge" aria-label="โพสต์หมดอายุ">หมดอายุแล้ว</span>';
                                } else if (job.status === 'closed') {
                                    statusText  = 'ปิดรับสมัคร';
                                    statusColor = '#6B7280';
                                } else if (job.status !== 'open') {
                                    statusText  = 'ปิดรับสมัคร';
                                    statusColor = '#6B7280';
                                }

                                // ── วันหมดอายุ ──
                                let expiryHtml     = '';
                                let nearingBadge   = '';
                                if (job.expires_at) {
                                    const expDate  = new Date(job.expires_at);
                                    const nowD     = new Date();
                                    const diffMs   = expDate - nowD;
                                    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                                    const expStr   = expDate.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' });

                                    if (job.status === 'expired' || diffDays <= 0) {
                                        expiryHtml = `<div class="file-expiry" style="color:#ef4444; font-size:0.8rem; margin-top:2px;">หมดอายุ ${expStr}</div>`;
                                    } else if (diffDays <= 3) {
                                        nearingBadge = `<span class="nearing-badge" aria-label="โพสต์ใกล้หมดอายุ">ใกล้หมดอายุ</span>`;
                                        expiryHtml = `<div class="file-expiry" style="color:#f59e0b; font-size:0.8rem; margin-top:2px;">หมดอายุ ${expStr} (เหลือ ${diffDays} วัน)</div>`;
                                    } else {
                                        expiryHtml = `<div class="file-expiry" style="color:#64748b; font-size:0.8rem; margin-top:2px;">หมดอายุ ${expStr}</div>`;
                                    }
                                }

                                empJobsList.innerHTML += `
                                    <div class="file-item employer-item${job.status === 'expired' ? ' job-expired' : ''}">
                                        <div style="flex:1; min-width:0;">
                                            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                                                <a href="post-employer2.html?jobId=${job.id}" class="file-name">${job.job_title}</a>
                                                ${expiredBadgeHtml}
                                                ${nearingBadge}
                                            </div>
                                            <div class="file-date" style="color:${statusColor}; margin-top:2px;">สถานะ: ${statusText}</div>
                                            ${expiryHtml}
                                        </div>
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
    // 🌟 7.5 สถานะการสมัครงาน (profile-job.html) — ทำงานอิสระ ไม่ขึ้นกับ profileArea
    // ==========================================
    (async function loadApplicationStatus() {
        const statusSection = document.getElementById('application-status-section');
        const statusList    = document.getElementById('application-status-list');
        if (!statusSection || !statusList) return;
        if (sessionStorage.getItem('userType') !== 'seeker') return;

        // ดึง seekerId ใหม่จาก sessionStorage โดยตรงตอน fetch เพื่อให้ได้ค่าล่าสุดเสมอ
        const seekerId = (sessionStorage.getItem('userId') || '').split(':')[0].trim();
        console.log('loggedInId =', seekerId);
        if (!seekerId) return;

        try {
            const res  = await fetch(`http://localhost:3000/api/my-applications/${seekerId}`);
            const apps = await res.json();

            if (!Array.isArray(apps) || apps.length === 0) {
                statusSection.style.display = 'none';
                return;
            }

            statusSection.style.display = 'block';
            statusList.innerHTML = '';

            const STEPS = [
                { label: 'ส่งแล้ว' },
                { label: 'รอพิจารณา' },
                { label: 'ถูกเปิดดูแล้ว' },
                { label: 'ผล' },
            ];

            function activeStepFor(status) {
                if (status === 'viewed')                        return 3;
                if (status === 'approved' || status === 'rejected') return 4;
                return 2; // pending / default
            }

            apps.forEach(app => {
                const active     = activeStepFor(app.status);
                const isApproved = app.status === 'approved';
                const isRejected = app.status === 'rejected';

                let dateStr = '';
                if (app.created_at) {
                    const d = new Date(app.created_at);
                    dateStr = `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()+543}`;
                }

                let stepperHtml = `<div class="stepper-track" role="list">`;
                STEPS.forEach((step, i) => {
                    const num       = i + 1;
                    const completed = num < active;
                    const isActive  = num === active;
                    const isResult  = num === 4 && isActive;

                    let nodeClass  = 'stepper-node ';
                    let itemClass  = 'stepper-step-item ';
                    let nodeText   = num;
                    let labelExtra = '';

                    if (completed) {
                        nodeClass += 'step-completed'; itemClass += 'step-completed'; nodeText = '✓';
                    } else if (isResult && isApproved) {
                        nodeClass += 'step-approved'; itemClass += 'step-active-approved'; nodeText = '✓'; labelExtra = ' — ผ่าน';
                    } else if (isResult && isRejected) {
                        nodeClass += 'step-rejected'; itemClass += 'step-active-rejected'; nodeText = '✕'; labelExtra = ' — ไม่ผ่าน';
                    } else if (isActive) {
                        nodeClass += 'step-active'; itemClass += 'step-active';
                    } else {
                        nodeClass += 'step-inactive'; itemClass += 'step-inactive';
                    }

                    const ariaLabel = `${step.label}${completed ? ' (เสร็จแล้ว)' : isActive ? ' (ขั้นตอนปัจจุบัน)' : ' (ยังไม่ถึง)'}`;
                    stepperHtml += `
                        <div class="${itemClass}" role="listitem" aria-label="${ariaLabel}">
                            <div class="${nodeClass}">${nodeText}</div>
                            <div class="stepper-label">${step.label}${labelExtra}</div>
                        </div>`;
                    if (i < STEPS.length - 1) {
                        stepperHtml += `<div class="stepper-line ${num < active ? 'line-active' : 'line-inactive'}" aria-hidden="true"></div>`;
                    }
                });
                stepperHtml += `</div>`;

                const card = document.createElement('div');
                card.className = 'app-status-card';
                card.innerHTML = `
                    <div class="app-status-job-info">
                        <div class="app-status-job-title">${app.job_title || '-'}</div>
                        <div class="app-status-company">${app.company_name || '-'}</div>
                        ${dateStr ? `<div class="app-status-date">สมัครเมื่อ ${dateStr}</div>` : ''}
                    </div>
                    ${stepperHtml}
                `;
                statusList.appendChild(card);
            });

        } catch (err) {
            console.error('Error loading application status:', err);
            statusSection.style.display = 'none';
        }
    })();

    // ==========================================
    // 🌟 8. ระบบ AI Auto-Replace
    // ==========================================
    const summaryInput = document.getElementById('inspiration-text'); 
    const skillsInput = document.getElementById('other-skills');
    
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
    // --- 9. หน้าฟอร์มกรอกเรซูเม่ (อัปเดตดึงรูปลงเครื่อง) ---
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
                    // 🌟 ถ้าระบบเจอรูปเก่าที่เคยอัปไว้ ให้จำไว้ใน Session เผื่อว่ารอบนี้ยูสเซอร์ไม่ได้อัปใหม่
                    if (data.profile_pic) {
                        sessionStorage.setItem('existingProfilePic', data.profile_pic);
                        const displaySpan = document.querySelector('.file-name-text');
                        if (displaySpan) {
                            displaySpan.textContent = 'มีรูปถ่ายเดิมในระบบแล้ว (แนบใหม่เพื่อเปลี่ยน)';
                            displaySpan.style.color = '#17A05D';
                            displaySpan.style.fontWeight = '600';
                        }
                    }

                    const sv = (id, selector, value) => {
                        const el = document.getElementById(id) || document.querySelector(selector);
                        if(el) el.value = value || '';
                    };

                    sv('first-name', '', data.first_name);
                    sv('last-name', '', data.last_name);
                    sv('phone-number', '', data.phone);
                    sv('email-address', '', data.email);
                    sv('address-street', '', (data.address || '').split(' ')[0]);
                    // prefill disability checkboxes (แยก 3 column)
                    if (data.disability_type) {
                        const types = data.disability_type.split(',').map(t => t.trim());
                        const levelMap = {
                            visual:   data.disability_level_visual   || '',
                            hearing:  data.disability_level_hearing  || '',
                            physical: data.disability_level_physical || ''
                        };
                        types.forEach(t => {
                            const cb = document.getElementById('dis-' + t);
                            if (cb) {
                                cb.checked = true;
                                const levelEl = document.getElementById('level-' + t);
                                if (levelEl) levelEl.style.display = 'block';
                                const sel = document.getElementById('level-select-' + t);
                                if (sel && levelMap[t]) sel.value = levelMap[t];
                            }
                        });
                    }
                    sv('job-position', '', data.job_position);
                    sv('job-type', '', data.job_type);
                    sv('expected-salary', '', data.expected_salary);
                    sv('inspiration-text', '.resume-textarea', data.summary);

                    // Prefill skills checkboxes
                    if (data.skills) {
                        const skillValues = data.skills.split(',').map(s => s.trim());
                        const predefined = [];
                        document.querySelectorAll('.skill-checkbox').forEach(cb => {
                            predefined.push(cb.value);
                            if (skillValues.includes(cb.value)) cb.checked = true;
                        });
                        const otherVal = skillValues.filter(s => !predefined.includes(s)).join(', ');
                        sv('other-skills', '', otherVal);
                    }

                    // Prefill dynamic blocks (education, work, intern, activity)
                    function prefillDynamic(containerId, items, type) {
                        const container = document.getElementById(containerId);
                        if (!container || !items || items.length === 0) return;
                        container.innerHTML = '';
                        items.forEach(item => {
                            let html = '';
                            if (type === 'edu') {
                                html = `<div class="form-row"><div class="form-col"><label class="form-label">ระดับการศึกษา</label><select class="form-input custom-select edu-level"><option>มัธยมศึกษาตอนปลาย / ปวช.</option><option>ปวส.</option><option>ปริญญาตรี</option><option>ปริญญาโท</option></select></div><div class="form-col"><label class="form-label">ชื่อสถาบันการศึกษา</label><input type="text" class="form-input edu-inst" placeholder="เช่น มหาวิทยาลัย..."></div></div><div class="form-row"><div class="form-col"><label class="form-label">คณะ / สาขาวิชา</label><input type="text" class="form-input edu-major" placeholder="เช่น บริหารธุรกิจ"></div><div class="form-col"><label class="form-label">เกรดเฉลี่ย (GPA)</label><input type="text" class="form-input edu-gpa" placeholder="เช่น 3.50"></div></div>`;
                            } else if (type === 'work') {
                                html = `<div class="form-row"><div class="form-col"><label class="form-label">ตำแหน่ง</label><input type="text" class="form-input work-title" placeholder="เช่น พนักงานบัญชี"></div><div class="form-col"><label class="form-label">ชื่อบริษัท / องค์กร</label><input type="text" class="form-input work-company"></div></div><div class="form-row"><div class="form-col full-width"><label class="form-label">ระยะเวลาที่ทำงาน</label><input type="text" class="form-input work-duration" placeholder="เช่น 2564 - 2566"></div></div>`;
                            } else if (type === 'intern') {
                                html = `<div class="form-row"><div class="form-col"><label class="form-label">ตำแหน่งฝึกงาน</label><input type="text" class="form-input intern-title"></div><div class="form-col"><label class="form-label">ชื่อบริษัท / องค์กร</label><input type="text" class="form-input intern-company"></div></div><div class="form-row"><div class="form-col full-width"><label class="form-label">ระยะเวลาฝึกงาน</label><input type="text" class="form-input intern-duration" placeholder="เช่น มิ.ย. 66 - ส.ค. 66"></div></div>`;
                            } else if (type === 'activity') {
                                html = `<div class="form-row"><div class="form-col full-width"><label class="form-label">ชื่อกิจกรรม / โครงการประกวด</label><input type="text" class="form-input act-name"></div></div><div class="form-row"><div class="form-col full-width"><label class="form-label">บทบาท หรือ รางวัลที่ได้รับ</label><input type="text" class="form-input act-role" placeholder="เช่น รางวัลชนะเลิศ, หัวหน้าทีม"></div></div>`;
                            }
                            const div = document.createElement('div');
                            div.className = 'dynamic-item';
                            div.innerHTML = html + '<button type="button" class="btn-remove-item">ลบทิ้ง</button>';
                            container.appendChild(div);
                            div.querySelector('.btn-remove-item').addEventListener('click', () => div.remove());
                            // Fill values
                            if (type === 'edu') {
                                const sel = div.querySelector('.edu-level'); if (sel && item.level) sel.value = item.level;
                                const inst = div.querySelector('.edu-inst'); if (inst) inst.value = item.institution || '';
                                const major = div.querySelector('.edu-major'); if (major) major.value = item.major || '';
                                const gpa = div.querySelector('.edu-gpa'); if (gpa) gpa.value = item.gpa || '';
                            } else if (type === 'work') {
                                const t = div.querySelector('.work-title'); if (t) t.value = item.title || '';
                                const c = div.querySelector('.work-company'); if (c) c.value = item.company || '';
                                const d = div.querySelector('.work-duration'); if (d) d.value = item.duration || '';
                            } else if (type === 'intern') {
                                const t = div.querySelector('.intern-title'); if (t) t.value = item.title || '';
                                const c = div.querySelector('.intern-company'); if (c) c.value = item.company || '';
                                const d = div.querySelector('.intern-duration'); if (d) d.value = item.duration || '';
                            } else if (type === 'activity') {
                                const n = div.querySelector('.act-name'); if (n) n.value = item.name || '';
                                const r = div.querySelector('.act-role'); if (r) r.value = item.role || '';
                            }
                        });
                    }

                    const tryParseArr = (str) => { try { const a = typeof str === 'string' ? JSON.parse(str) : str; return Array.isArray(a) ? a : []; } catch(e) { return []; } };
                    prefillDynamic('education-container', tryParseArr(data.education_history), 'edu');
                    prefillDynamic('work-container',      tryParseArr(data.work_experience),   'work');
                    prefillDynamic('intern-container',    tryParseArr(data.intern_experience),  'intern');
                    prefillDynamic('activity-container',  tryParseArr(data.activities),         'activity');

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

    // 🟢 9.6 ดักจับการกด Save หน้าแรก -> ให้เก็บใน Session (อัปเดตรองรับรูปถ่าย)
    if (isOnResumePage) {
        isOnResumePage.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!loggedInId) {
                alert('กรุณาเข้าสู่ระบบก่อนบันทึกเรซูเม่');
                window.location.href = 'login-jobseeker.html';
                return;
            }

            // 🌟 1. ดึงไฟล์รูปถ่ายและแปลงเป็น Base64
            const fileInput = document.getElementById('profile-pic');
            let profilePicBase64 = sessionStorage.getItem('existingProfilePic') || ''; // ดึงรูปเก่ามาเผื่อไว้ก่อน

            if (fileInput && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                // ป้องกันอัปไฟล์ใหญ่เกิน 2MB ไม่งั้นเดี๋ยว Session/Database จะ Error
                if(file.size > 2 * 1024 * 1024) {
                    alert('ขนาดรูปถ่ายใหญ่เกินไปครับ (ต้องไม่เกิน 2MB)');
                    return;
                }
                
                profilePicBase64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(file);
                });
            }

            // 🌟 2. ดึงข้อมูลฟอร์มอื่นๆ ตามปกติ
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
                disability_type: (() => {
                    const types = ['visual','hearing','physical'].filter(t => {
                        const cb = document.getElementById('dis-' + t);
                        return cb && cb.checked;
                    });
                    return types.join(',');
                })(),
                disability_level_visual: (() => {
                    const cb = document.getElementById('dis-visual');
                    if (!cb || !cb.checked) return '';
                    const sel = document.getElementById('level-select-visual');
                    return sel ? sel.value : '';
                })(),
                disability_level_hearing: (() => {
                    const cb = document.getElementById('dis-hearing');
                    if (!cb || !cb.checked) return '';
                    const sel = document.getElementById('level-select-hearing');
                    return sel ? sel.value : '';
                })(),
                disability_level_physical: (() => {
                    const cb = document.getElementById('dis-physical');
                    if (!cb || !cb.checked) return '';
                    const sel = document.getElementById('level-select-physical');
                    return sel ? sel.value : '';
                })(),
                summary: document.getElementById('inspiration-text')?.value || '',
                skills: selectedSkills.join(', '),
                portfolio_url: document.getElementById('portfolio-url')?.value || '',
                job_position: document.getElementById('job-position')?.value || '',
                job_type: document.getElementById('job-type')?.value || '',
                expected_salary: document.getElementById('expected-salary')?.value || '',
                education_history: getDynamicData('education-container'),
                work_experience: getDynamicData('work-container'),
                intern_experience: getDynamicData('intern-container'),
                activities: getDynamicData('activity-container'),
                profile_pic: profilePicBase64 // 🌟 ส่งรูปภาพที่แปลงแล้วเข้าไปด้วย
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
    const templateThumbs = document.querySelectorAll('.template-thumb, .tpl-card');
    const templateContents = document.querySelectorAll('.template-preview-area .resume-theme-content');
    const btnProceedToFinal = document.getElementById('btn-proceed-to-final');

    if (templateThumbs.length > 0 && templateContents.length > 0) {
        templateThumbs.forEach(thumb => {
            thumb.addEventListener('click', function () {
                // ลบ active + aria-pressed จากทุก thumb
                templateThumbs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-pressed', 'false');
                });
                // เพิ่ม active + aria-pressed ให้ thumb ที่กด
                this.classList.add('active');
                this.setAttribute('aria-pressed', 'true');

                const selectedTheme = this.getAttribute('data-template');

                templateContents.forEach(content => {
                    content.classList.remove('active');
                });

                const targetContent = document.querySelector(`.template-preview-area #tpl-${selectedTheme}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }

                announce('เลือกเทมเพลต ' + this.querySelector('.thumb-label')?.textContent);
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
    // --- 11. หน้าพรีวิวเรซูเม่ครั้งสุดท้าย (อัปเดตการแสดงรูปภาพ) ---
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

        if (btnEdit) {
            btnEdit.addEventListener('click', () => { 
                window.location.href = 'resume.html'; 
            });
        }

        if (btnSave) {
            btnSave.removeAttribute('onclick'); 
            btnSave.addEventListener('click', () => {
                sessionStorage.removeItem('aiMatchedJobs'); 
                window.location.href = 'resume4.html'; 
            });
        }
    }

    function renderRealDataToTemplate(tpl, data) {
        if (!tpl) return;
        const themeId = tpl.id;

        // แสดงรูปโปรไฟล์
        // ต้องใช้ setProperty(..., 'important') เพราะ CSS กำหนด background-image !important ไว้
        if (data.profile_pic) {
            const photoEls = tpl.querySelectorAll('.tpl1-photo, .tpl2-arch-photo, .tpl3-photo, .tpl4-photo-circle');
            photoEls.forEach(el => {
                el.style.setProperty('background-image', `url(${data.profile_pic})`, 'important');
                el.style.setProperty('background-size', 'cover', 'important');
                el.style.setProperty('background-position', 'top center', 'important');
                el.style.setProperty('background-repeat', 'no-repeat', 'important');
            });
        }

        const setText = (selector, text) => {
            tpl.querySelectorAll(selector).forEach(el => { el.textContent = text || ''; });
        };

        setText('.render-name', `${data.first_name || ''} ${data.last_name || ''}`.trim());

        // tpl-vintage: ชื่ออยู่บรรทัดบน นามสกุลอยู่บรรทัดล่าง
        if (themeId === 'tpl-vintage') {
            const vintageName = tpl.querySelector('.v-header-name');
            if (vintageName) {
                const fn = (data.first_name || '').trim();
                const ln = (data.last_name || '').trim();
                vintageName.innerHTML = (fn && ln) ? `${fn}<br>${ln}` : (fn || ln);
            }
        }

        // tpl-bright: ชื่ออยู่บรรทัดบน นามสกุลอยู่บรรทัดล่าง + auto-fit ฟ้อนต์
        if (themeId === 'tpl-bright') {
            const brightName = tpl.querySelector('.tpl4-name');
            if (brightName) {
                const fn = (data.first_name || '').trim();
                const ln = (data.last_name || '').trim();
                brightName.innerHTML = (fn && ln) ? `${fn}<br>${ln}` : (fn || ln);

                // รอ reflow แล้วค่อย fit — เริ่มจาก 40px ลดจนทั้งสองบรรทัดพอดี
                setTimeout(() => {
                    let size = 40, min = 16;
                    brightName.style.setProperty('font-size', size + 'px', 'important');
                    brightName.getBoundingClientRect(); // force reflow
                    while (brightName.scrollWidth > brightName.offsetWidth && size > min) {
                        size--;
                        brightName.style.setProperty('font-size', size + 'px', 'important');
                    }
                }, 0);
            }
        }

        setText('.render-email', data.email);
        setText('.render-phone', data.phone);
        const fullAddress = `${data.address || ''} ${data.sub_district || ''} ${data.district || ''} ${data.province || ''} ${data.zipcode || ''}`.trim();
        setText('.render-address', fullAddress);
        setText('.render-summary', data.summary);

        // ซ่อน summary section ถ้าว่าง
        if (!data.summary || !data.summary.trim()) {
            const sumSec = tpl.querySelector('[data-section="summary"]');
            if (sumSec) sumSec.style.display = 'none';
        }

        // แสดงข้อมูลความพิการพร้อมประเภทและระดับ
        const disTypeLabel = { visual: 'ทางการมองเห็น', hearing: 'ทางการได้ยินหรือสื่อความหมาย', physical: 'ทางกายหรือการเคลื่อนไหว' };
        const disLevelLabel = {
            visual_1: 'ระดับ 1', visual_2: 'ระดับ 2', visual_3: 'ระดับ 3', visual_4: 'ระดับ 4', visual_5: 'ระดับ 5',
            hearing_1: 'ระดับ 1', hearing_2: 'ระดับ 2', hearing_3: 'ระดับ 3', hearing_4: 'ระดับ 4', hearing_5: 'ระดับ 5',
            hearing_comm_1: 'ระดับ 3 (สื่อความหมาย)', hearing_comm_2: 'ระดับ 4 (สื่อความหมาย)', hearing_comm_3: 'ระดับ 5 (สื่อความหมาย)',
            physical_1: 'ระดับ 1', physical_2: 'ระดับ 2', physical_3: 'ระดับ 3', physical_4: 'ระดับ 4', physical_5: 'ระดับ 5'
        };
        if (data.disability_type) {
            const levelMap = { visual: data.disability_level_visual, hearing: data.disability_level_hearing, physical: data.disability_level_physical };
            const disText = data.disability_type.split(',').map(t => t.trim()).filter(t => t).map(t => {
                const lbl = disTypeLabel[t] || t;
                const lvKey = levelMap[t];
                const lvLbl = lvKey ? (disLevelLabel[lvKey] || lvKey) : '';
                return lvLbl ? `${lbl} (${lvLbl})` : lbl;
            }).join(' / ');
            setText('.render-disability', disText);
        } else {
            setText('.render-disability', '');
            tpl.querySelectorAll('[data-section="disability"]').forEach(s => { s.style.display = 'none'; });
        }

        // ทักษะ
        const skillsContainers = tpl.querySelectorAll('.render-skills');
        const hasSkills = data.skills && data.skills.trim() !== '';
        skillsContainers.forEach(skillsContainer => {
            if (hasSkills) {
                skillsContainer.innerHTML = '';
                const skillsArr = data.skills.split(',').map(s => s.trim()).filter(s => s !== '');
                if (themeId === 'tpl-modern') {
                    skillsContainer.innerHTML = skillsArr.map(s => `<span role="listitem">${s}</span>`).join('');
                } else if (themeId === 'tpl-bright') {
                    skillsContainer.innerHTML = skillsArr.join(' / ');
                } else if (themeId === 'tpl-minimal') {
                    skillsContainer.innerHTML = skillsArr.map(s => `<p class="tpl1-text" role="listitem">${s}</p>`).join('');
                } else if (themeId === 'tpl-vintage') {
                    skillsContainer.innerHTML = skillsArr
                        .map(s => `<span class="v-skill-item">${s}</span>`)
                        .join(', ');
                } else {
                    skillsContainer.textContent = data.skills;
                }
            }
        });
        // ซ่อน [data-section="skills"] ถ้าไม่มีข้อมูล
        if (!hasSkills) {
            const skillsSec = tpl.querySelector('[data-section="skills"]');
            if (skillsSec) skillsSec.style.display = 'none';
        }

        // renderList — ถ้าว่างให้ซ่อน [data-section] wrapper แทนการแสดงข้อความ
        const renderList = (selector, dataString, templateHTMLFunc) => {
            const container = tpl.querySelector(selector);
            if (!container) return;
            container.innerHTML = '';

            let isEmpty = !dataString || dataString === '[]';
            if (!isEmpty) {
                try {
                    const arr = typeof dataString === 'string' ? JSON.parse(dataString) : dataString;
                    if (arr.length === 0) {
                        isEmpty = true;
                    } else {
                        container.innerHTML = arr.map(templateHTMLFunc).join('');
                    }
                } catch (e) {
                    isEmpty = true;
                }
            }

            if (isEmpty) {
                const sectionEl = container.closest('[data-section]');
                if (sectionEl) sectionEl.style.display = 'none';
            }
        };

        renderList('.render-edu-list', data.education_history, (item) => {
            if (themeId === 'tpl-bright') return `<div class="tpl4-detail" style="margin-bottom: 10px;"><p class="tpl4-text-dark"><strong>${item.institution || ''}</strong></p><p class="tpl4-meta">${item.level || ''} ${item.major || ''}</p><p>GPA: ${item.gpa || '-'}</p></div>`;
            else if (themeId === 'tpl-modern') return `<p class="tpl2-text-white" style="margin-bottom: 10px;"><strong>${item.institution || ''}</strong><br>${item.level || ''} ${item.major || ''}<br>GPA: ${item.gpa || '-'}</p>`;
            else if (themeId === 'tpl-vintage') return `<div class="tpl3-edu-item"><div class="tpl3-edu-institution">${item.institution || ''}</div><div class="tpl3-edu-detail">${item.level || ''} ${item.major || ''}<br>GPA ${item.gpa || '-'}</div></div>`;
            else return `<div class="tpl1-exp" style="margin-bottom: 15px;"><div class="tpl1-exp-header"><h4>${item.level || ''} ${item.major || ''}</h4></div><p class="tpl1-company">${item.institution || ''}</p><p class="tpl1-desc">GPA: ${item.gpa || '-'}</p></div>`;
        });

        renderList('.render-work-list', data.work_experience, (item) => {
            if (themeId === 'tpl-bright') return `<div class="tpl4-time-item"><div class="tpl4-year-badge">${item.duration || 'ไม่ระบุเวลา'}</div><h4>${item.title || ''}</h4><p class="tpl4-meta">${item.company || ''}</p></div>`;
            else if (themeId === 'tpl-vintage') return `<div class="tpl3-exp-grid"><div class="tpl3-exp-left"><strong>${item.company || ''}</strong><br>${item.duration || ''}</div><div class="tpl3-exp-right"><strong>${item.title || ''}</strong></div></div>`;
            else return `<div class="tpl1-exp" style="margin-bottom: 15px;"><div class="tpl1-exp-header"><h4>${item.title || ''}</h4><span>${item.duration || ''}</span></div><p class="tpl1-company">${item.company || ''}</p></div>`;
        });

        renderList('.render-intern-list', data.intern_experience, (item) => {
            if (themeId === 'tpl-bright') return `<div class="tpl4-time-item"><div class="tpl4-year-badge">${item.duration || 'ไม่ระบุเวลา'}</div><h4>${item.title || ''}</h4><p class="tpl4-meta">${item.company || ''}</p></div>`;
            else return `<div style="margin-bottom:15px; padding-bottom:10px; border-bottom:1px dashed #ddd;"><div style="font-weight:bold; font-size:1.1em; color:inherit;">${item.title || ''}</div><div style="color:inherit;">${item.company || ''} | ${item.duration || ''}</div></div>`;
        });

        renderList('.render-activity-list', data.activities, (item) => {
            if (themeId === 'tpl-bright') return `<div class="tpl4-time-item"><div class="tpl4-dot"></div><h4>${item.name || ''}</h4><p class="tpl4-meta">${item.role || ''}</p></div>`;
            else return `<div style="margin-bottom:15px;"><div style="font-weight:bold; font-size:1.1em; color:inherit;">${item.name || ''}</div><div style="color:inherit;">${item.role || ''}</div></div>`;
        });
    }

    // ==========================================
    // 🌟 12. ระบบคำนวณ Ranking ขั้นเทพ (Rule-based + AI Matching)
    // ==========================================
    const rankListContainer = document.querySelector('.ranking-list'); 
    
    if (rankListContainer) {
        const cachedJobs = sessionStorage.getItem('aiMatchedJobs');
        if (cachedJobs) {
            renderRankedJobs(JSON.parse(cachedJobs));
        } else {
            loadAndRankJobsWithAI();
        }
    }

    function renderRankedJobs(rankedJobs) {
        rankListContainer.innerHTML = ''; 

        // ปุ่ม Rematch 
        rankListContainer.innerHTML += `
            <div style="width: 100%; display: flex; justify-content: flex-end; margin-bottom: 20px;">
                <button id="btn-rematch" style="padding: 10px 20px; background-color: #f8fafc; color: #334155; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.3s ease;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
                    คำนวณคะแนนใหม่ (Rematch)
                </button>
            </div>
        `;

        const bgColors = ['#000000', '#17A05D', '#00A5E0', '#EE3124', '#E2231A', '#005A9C', '#FF6600', '#0F146D', '#00A651'];

        rankedJobs.forEach((job, index) => {
            let logoText = job.company_name ? job.company_name.substring(0, 3).toUpperCase() : 'JOB';
            let bgColor = bgColors[(job.id || 0) % bgColors.length];
            
            rankListContainer.innerHTML += `
                <div class="rank-card" role="listitem" tabindex="0" onclick="window.location.href='resume5.html?id=${job.id}'" style="cursor: pointer; position: relative; padding-right: 100px;" aria-label="อันดับ ${index + 1} ${job.company_name} ตำแหน่ง ${job.job_title}">
                    
                    <div class="rank-number" aria-hidden="true">${index + 1}</div>
                    
                    <div class="rank-logo-placeholder" style="background-color: ${bgColor}; color: white;" aria-hidden="true">${logoText}</div> 
                    
                    <div class="rank-company" aria-hidden="true">${job.company_name}</div>
                    
                    <div class="rank-position" aria-hidden="true">
                        <span class="rank-label">ตำแหน่งที่รับ :</span>
                        <span class="rank-value">${job.job_title}</span>
                    </div>
                    
                    <div class="rank-type" aria-hidden="true">
                        <span class="rank-label">ประเภทงาน :</span>
                        <span class="rank-value">${job.job_type || 'ไม่ระบุ'}</span>
                    </div>

                    <div style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; align-items: center; justify-content: center; width: 65px; height: 65px; border: 3px solid ${bgColor}; border-radius: 50%; background: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        <span style="color: ${bgColor}; font-size: 20px; font-weight: 800; line-height: 1;">${job.matchScore}</span>
                        <span style="font-size: 11px; color: #64748b; font-weight: 600; margin-top: 2px;">/ 100</span>
                    </div>
                </div>
            `;
        });

        const btnRematch = document.getElementById('btn-rematch');
        if (btnRematch) {
            btnRematch.addEventListener('click', () => {
                sessionStorage.removeItem('aiMatchedJobs');
                loadAndRankJobsWithAI();
            });
        }

        document.querySelectorAll('.rank-card').forEach(card => {
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { 
                    e.preventDefault(); 
                    window.location.href = 'job-detail.html?id=' + card.getAttribute('onclick').match(/'([^']+)'/)[1].split('=')[1]; 
                }
            });
        });
    }

    async function loadAndRankJobsWithAI() {
        try {
            rankListContainer.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; width: 100%;">
                    <svg class="loading-spinner" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1.5s linear infinite; margin: 0 auto;">
                        <circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 0 1 10 10"></path>
                    </svg>
                    <style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>
                    <h3 style="color:#ea580c; margin-top:20px; font-size: 20px;">⚙️ ระบบกำลังวิเคราะห์และจัดอันดับงานที่เหมาะสมที่สุด...</h3>
                    <p style="color:#666; margin-top:10px; font-size: 15px;">กำลังใช้ Algorithm คำนวณความสอดคล้องของทักษะและประเมินด้วย AI</p>
                </div>
            `;

            // 1. ดึงข้อมูลงาน
            const res = await fetch('http://localhost:3000/api/jobs');
            const jobs = await res.json();
            
            // 🚨 เพิ่มตัวดักจับ Error จากฐานข้อมูล
            if (jobs.error) {
                throw new Error("ฐานข้อมูลมีปัญหา: " + jobs.error);
            }
            if (!Array.isArray(jobs)) {
                throw new Error("ข้อมูลที่ได้จาก API ไม่ใช่ Array (เช็คการเชื่อมต่อ Database หรือ API)");
            }
            
            // 2. ดึงข้อมูลเรซูเม่
            const userId = sessionStorage.getItem('userId') || 1;
            const resumeRes = await fetch(`http://localhost:3000/api/get-resume/${userId}`);
            const resume = await resumeRes.json();

            if (resume.error) {
                throw new Error("โหลดข้อมูลเรซูเม่ไม่ได้: " + resume.error);
            }

            // --- คำนวณ Rule-Based Score ---
            // --- 1. คำนวณ Rule-Based Score สำหรับทุกงาน (Algorithm 100 คะแนนเต็ม) ---
            let rankedJobs = jobs.map(job => {
                let score = 0;
                let reasons = [];

                // =========================================================
                // 🛠️ เกณฑ์ที่ 1: ความสอดคล้องด้านความพิการ (Disability Match) - 20 คะแนน
                // =========================================================
                const reqDisType = job.disability_type || '';
                const myDisType = resume.disability_type || '';
                if (reqDisType.includes('รับทุกประเภท') || reqDisType.includes(myDisType) || (myDisType && reqDisType.includes(myDisType))) {
                    score += 20;
                    reasons.push(`✔️ สภาพแวดล้อมรองรับความพิการของคุณ (+20)`);
                } else {
                    reasons.push(`⚠️ สภาพแวดล้อมอาจยังไม่รองรับโดยตรง (0)`);
                }

                // =========================================================
                // 🛠️ เกณฑ์ที่ 2: ความตรงกันของตำแหน่งงาน (Position Match) - 20 คะแนน
                // =========================================================
                let posScore = 0;
                const expectedPos = (resume.job_position || '').toLowerCase(); // ตำแหน่งที่ผู้สมัครคาดหวัง
                const jobTitle = (job.job_title || '').toLowerCase(); // ชื่อตำแหน่งของบริษัท
                const jobCat = (job.job_category || '').toLowerCase(); // หมวดหมู่งานของบริษัท

                // เช็คว่าชื่อตำแหน่งที่ตั้งเป้าไว้ ตรงกับชื่อประกาศงานหรือหมวดหมู่หรือไม่
                if (expectedPos && (jobTitle.includes(expectedPos) || expectedPos.includes(jobTitle) || jobCat.includes(expectedPos))) {
                    posScore = 20;
                    reasons.push(`🎯 ตำแหน่งงานตรงกับที่คุณคาดหวังไว้ (+20)`);
                } else {
                    // ถ้าไม่ตรงเป๊ะ ให้ค้นหาจากประวัติการทำงาน (Experience) ว่าเคยทำสายนี้ไหม
                    const parseSafe = (str) => { try { return typeof str === 'string' ? JSON.parse(str || '[]') : (str || []); } catch(e) { return []; } };
                    const workExp = parseSafe(resume.work_experience);
                    let hasRelatedExp = false;
                    
                    workExp.forEach(exp => {
                        const oldTitle = (exp.title || '').toLowerCase();
                        if (oldTitle && (jobTitle.includes(oldTitle) || jobCat.includes(oldTitle))) hasRelatedExp = true;
                    });

                    if (hasRelatedExp) {
                        posScore = 15;
                        reasons.push(`💼 มีประสบการณ์ทำงานเก่าที่ตรงกับสายงานนี้ (+15)`);
                    } else {
                        posScore = 0; 
                        reasons.push(`🔹 ตำแหน่งนี้เป็นสายงานใหม่สำหรับคุณ (+0)`);
                    }
                }
                score += posScore;

                // =========================================================
                // 🛠️ เกณฑ์ที่ 3: ทักษะที่ต้องการ (Skills Match) - 20 คะแนน
                // =========================================================
                let skillScore = 0;
                const mySkills = (resume.skills || '').toLowerCase();
                const reqSkillsArr = (job.req_skills || '').split(',').map(s => s.trim().toLowerCase()).filter(s => s);

                if (reqSkillsArr.length > 0 && mySkills) {
                    let matchCount = 0;
                    reqSkillsArr.forEach(req => {
                        if (mySkills.includes(req)) matchCount++;
                    });
                    // ทักษะที่ตรง / ทักษะที่ขอทั้งหมด * 20 คะแนน
                    skillScore = Math.floor((matchCount / reqSkillsArr.length) * 20);
                    score += skillScore;
                    if(skillScore > 0) reasons.push(`💡 มีทักษะตรงตามที่ตำแหน่งงานต้องการ ${matchCount} อย่าง (+${skillScore})`);
                    else reasons.push(`⚠️ ทักษะอาจจะยังไม่ตรงกับที่ระบุไว้ (0)`);
                } else if (reqSkillsArr.length === 0) {
                    skillScore = 20;
                    score += skillScore; // ถ้านายจ้างไม่ระบุทักษะ ให้คะแนนเต็มหมวดนี้
                    reasons.push(`💡 นายจ้างไม่ได้ระบุทักษะเฉพาะทาง (+20)`);
                }

                // =========================================================
                // 🛠️ เกณฑ์ที่ 4: สถานที่ทำงาน / ระยะทาง (Location Match) - 15 คะแนน
                // =========================================================
                let locScore = 0;
                const myProvince = (resume.province || '').trim(); // จังหวัดของผู้สมัคร
                const jobLocation = (job.job_location || '').trim(); // สถานที่ทำงาน
                const jobType = (job.job_type || '').toLowerCase();

                if (jobType.includes('work from home') || jobType.includes('wfh')) {
                    locScore = 15; // WFH ทำจากที่ไหนก็ได้ ให้เต็ม
                    reasons.push(`🏠 เป็นงาน Work From Home สามารถทำจากที่บ้านได้ (+15)`);
                } else if (myProvince && jobLocation.includes(myProvince)) {
                    locScore = 15; // จังหวัดเดียวกัน เดินทางสะดวก
                    reasons.push(`📍 สถานที่ทำงานอยู่ในจังหวัดเดียวกับคุณ (+15)`);
                } else {
                    locScore = 5; // ต่างจังหวัด หรืออาจต้องเดินทาง
                    reasons.push(`🚗 สถานที่ทำงานอยู่ต่างพื้นที่ (+5)`);
                }
                score += locScore;

                // =========================================================
                // 🛠️ เกณฑ์ที่ 5: ความคาดหวังเรื่องเงินเดือน (Salary Match) - 15 คะแนน
                // =========================================================
                let salaryScore = 0;
                // สกัดเฉพาะตัวเลขเงินเดือนที่ผู้สมัครคาดหวัง เช่น "15000"
                const expectedSalaryStr = (resume.expected_salary || '').replace(/,/g, '').match(/\d+/);
                const expectedSalary = expectedSalaryStr ? parseInt(expectedSalaryStr[0]) : 0;

                // สกัดตัวเลขเงินเดือนจากประกาศงาน (หาค่า Max) เช่น "15,000 - 20,000" ดึง 20000
                const jobSalaryStr = (job.salary || '').replace(/,/g, '');
                const jobSalaryNums = jobSalaryStr.match(/\d+/g);
                const jobMaxSalary = jobSalaryNums ? Math.max(...jobSalaryNums.map(Number)) : 0;

                if (jobSalaryStr.includes('ตามตกลง') || expectedSalary === 0) {
                    salaryScore = 10; // ไม่ระบุตัวเลขที่ชัดเจน ให้คะแนนกลางๆ
                    reasons.push(`💰 เงินเดือนพิจารณาตามตกลง (+10)`);
                } else if (jobMaxSalary >= expectedSalary) {
                    salaryScore = 15; // เงินเดือนของบริษัท ครอบคลุมที่ผู้สมัครหวังไว้
                    reasons.push(`💰 ฐานเงินเดือนสอดคล้องกับความคาดหวังของคุณ (+15)`);
                } else {
                    salaryScore = 5; // เงินเดือนบริษัทให้น้อยกว่าที่หวัง
                    reasons.push(`💰 ฐานเงินเดือนอาจต่ำกว่าที่คาดหวังเล็กน้อย (+5)`);
                }
                score += salaryScore;

                // =========================================================
                // 🛠️ เกณฑ์ที่ 6: ประวัติการศึกษา (Education) - 10 คะแนน
                // =========================================================
                let eduScore = 0;
                const parseSafeEdu = (str) => { try { return typeof str === 'string' ? JSON.parse(str || '[]') : (str || []); } catch(e) { return []; } };
                const eduHist = parseSafeEdu(resume.education_history);
                
                if (eduHist.length > 0) {
                    eduScore = 10;
                    reasons.push(`🎓 มีประวัติการศึกษาผ่านเกณฑ์พื้นฐาน (+10)`);
                }
                score += eduScore;

                // คะแนนรวม 100
                score = Math.min(score, 100);

                return { ...job, matchScore: score, matchDetails: reasons };
            });

            // --- เรียงลำดับงาน ---
            rankedJobs.sort((a, b) => b.matchScore - a.matchScore);

            // --- ดึง AI มาช่วยสรุปคำแนะนำ (Top 10) ---
            const eduStr = JSON.stringify(resume.education_history || []);
            const expStr = "ทำงาน: " + JSON.stringify(resume.work_experience || []) + " ฝึกงาน: " + JSON.stringify(resume.intern_experience || []);
            const skillStr = resume.skills || '';

            const topJobsCount = Math.min(10, rankedJobs.length);
            for (let i = 0; i < topJobsCount; i++) {
                let job = rankedJobs[i];
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
                            inspiration_message: '' 
                        })
                    });
                    
                    const aiData = await aiRes.json();
                    
                    if (aiData && aiData.match_reasons && Array.isArray(aiData.match_reasons)) {
                        const aiSummaries = aiData.match_reasons
                            .filter(r => r.length > 10) 
                            .slice(0, 1) 
                            .map(r => "🤖 AI สรุปจุดเด่น: " + r.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '')); 
                        
                        job.matchDetails = [...aiSummaries, ...job.matchDetails];
                    }
                } catch(e) {
                    console.log("ข้ามการสรุปด้วย AI เนื่องจากเชื่อมต่อไม่ได้");
                }
            }

            sessionStorage.setItem('aiMatchedJobs', JSON.stringify(rankedJobs));
            renderRankedJobs(rankedJobs);

        } catch (error) { 
            console.error("🔥 Error Detail:", error); 
            // 🚨 อัปเดตให้แสดง Error ออกมาบนหน้าจอแบบชัดเจน!
            rankListContainer.innerHTML = `
                <div style="text-align:center; padding: 40px; width: 100%; border: 2px dashed #ef4444; border-radius: 12px; background: #fef2f2;">
                    <h3 style="color:#ef4444; margin-bottom: 10px;">❌ โปรแกรมหยุดทำงานกะทันหัน</h3>
                    <p style="color:#7f1d1d; font-weight: 600; font-size: 16px;">สาเหตุ: ${error.message}</p>
                    <p style="color:#666; font-size: 14px; margin-top: 15px;">(รบกวนแคปข้อความภาษาอังกฤษหลังคำว่า "สาเหตุ:" มาให้ผมดูได้เลยครับ จะได้จับจุดพังได้ 100%)</p>
                </div>
            `;
        }
    }

    // ==========================================
    // --- 13. หน้าส่งเรซูเม่ (resume5.html) ---
    // ==========================================
    if (window.location.pathname.includes('resume5.html')) {

        const r5Params = new URLSearchParams(window.location.search);
        const r5JobId  = r5Params.get('id'); // ใช้ ?id= (URL ใหม่จาก home-jobseeker)

        // ── โหลดข้อมูลงาน + AI match เมื่อหน้าโหลด ──
        if (r5JobId) {
            (async function loadResume5JobData() {
                try {
                    // 1. ดึงข้อมูลงาน
                    const jobRes = await fetch(`http://localhost:3000/api/get-job/${r5JobId}`);
                    const job    = await jobRes.json();
                    if (!job || !job.job_title) return;

                    const setEl = (id, text) => {
                        const el = document.getElementById(id);
                        if (el) el.textContent = text || '-';
                    };

                    setEl('render-job-title',   job.job_title);
                    setEl('render-company-name', job.company_name);
                    setEl('render-job-desc',     job.job_desc);
                    setEl('render-req-skills',   job.req_skills);

                    // โลโก้บริษัท (ตัวอักษรย่อ)
                    const logoEl = document.getElementById('render-job-logo');
                    if (logoEl) {
                        const initials = (job.company_name || 'JOB').substring(0, 3).toUpperCase();
                        const colors   = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899','#06B6D4'];
                        logoEl.textContent        = initials;
                        logoEl.style.backgroundColor = colors[(job.id || 0) % colors.length];
                        logoEl.style.color        = '#fff';
                        logoEl.style.display      = 'flex';
                        logoEl.style.alignItems   = 'center';
                        logoEl.style.justifyContent = 'center';
                        logoEl.setAttribute('aria-label', `โลโก้บริษัท ${job.company_name || ''}`);
                    }

                    const locEl = document.getElementById('render-job-location');
                    if (locEl) locEl.innerHTML = `<span aria-hidden="true">📍</span> ${job.job_location || '-'}`;

                    const typeEl = document.getElementById('render-job-type');
                    if (typeEl) typeEl.innerHTML = `<span aria-hidden="true">💼</span> ${job.job_type || '-'}`;

                    const salaryEl = document.getElementById('render-job-salary');
                    if (salaryEl) salaryEl.innerHTML = `<span aria-hidden="true">💰</span> ${job.salary || 'ตามตกลง'}`;

                    const disSupportEl = document.getElementById('render-disability-support');
                    if (disSupportEl) {
                        const accom = job.accommodation || 'ไม่ได้ระบุ';
                        disSupportEl.innerHTML =
                            `บริษัทยินดีต้อนรับผู้สมัครที่เป็นผู้พิการ <strong>${job.disability_type || 'รับทุกประเภท'}</strong> ` +
                            `โดยมีสิ่งอำนวยความสะดวก: <strong>${accom}</strong>`;
                    }

                    // 2. ดึงเรซูเม่ + เรียก AI match
                    const aiReasonSection = document.getElementById('ai-match-reason-section');
                    const aiReasonsList   = document.getElementById('render-ai-reasons');
                    const aiLoadingState  = document.getElementById('ai-loading-state');

                    // ── helpers ──
                    const hideLoading = () => { if (aiLoadingState) aiLoadingState.style.display = 'none'; };
                    const showList    = () => { if (aiReasonsList)  aiReasonsList.style.display  = 'block'; };

                    const showAiFallback = () => {
                        hideLoading();
                        if (aiReasonSection) aiReasonSection.style.display = 'block';
                        showList();
                        if (aiReasonsList) aiReasonsList.innerHTML = '<li>ไม่สามารถวิเคราะห์ได้ในขณะนี้</li>';
                    };

                    if (loggedInId) {
                        try {
                            const resumeRes  = await fetch(`http://localhost:3000/api/get-resume/${loggedInId}`);
                            const resumeData = await resumeRes.json();

                            if (resumeData && (resumeData.first_name || resumeData.skills)) {
                                // ── แสดง section + loading state ทันทีก่อนเรียก AI ──
                                if (aiReasonSection) aiReasonSection.style.display = 'block';

                                // ── แปลง JSON fields จาก DB (อาจเป็น string หรือ array) ──
                                const toStr = (v) => typeof v === 'string' ? v : JSON.stringify(v || []);
                                const eduStr    = toStr(resumeData.education_history);
                                const workStr   = toStr(resumeData.work_experience);
                                const internStr = toStr(resumeData.intern_experience);

                                // ── flat format ตรงกับ MatchData ใน main.py ──
                                const aiBody = JSON.stringify({
                                    job_title:                 job.job_title  || '',
                                    job_desc:                  job.job_desc   || '',
                                    req_skills:                job.req_skills || '',
                                    education_history:         eduStr,
                                    experience_and_activities: `ทำงาน: ${workStr} ฝึกงาน: ${internStr}`,
                                    skills_and_custom_skills:  resumeData.skills  || '',
                                    inspiration_message:       resumeData.summary || ''
                                });

                                const aiPromise      = fetch('http://localhost:3000/api/get-ai-match', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: aiBody
                                });
                                const timeoutPromise = new Promise((_, reject) =>
                                    setTimeout(() => reject(new Error('AI timeout')), 10000)
                                );

                                try {
                                    const aiRes  = await Promise.race([aiPromise, timeoutPromise]);
                                    const aiData = await aiRes.json();
                                    const reasons = (aiData && Array.isArray(aiData.match_reasons))
                                        ? aiData.match_reasons.filter(r =>
                                            !r.includes('ระบบ AI') &&
                                            !r.includes('เกิดข้อผิดพลาด') &&
                                            !r.includes('ไม่สามารถวิเคราะห์')
                                          )
                                        : [];

                                    hideLoading();
                                    showList();
                                    if (reasons.length > 0) {
                                        aiReasonsList.innerHTML =
                                            reasons.map(r => `<li style="margin-bottom:8px;">${r}</li>`).join('');
                                    } else {
                                        aiReasonsList.innerHTML = '<li>ไม่สามารถวิเคราะห์ได้ในขณะนี้</li>';
                                    }
                                } catch (aiErr) {
                                    console.warn('AI match skipped (resume5):', aiErr.message);
                                    showAiFallback();
                                }
                            }
                        } catch (resumeErr) {
                            console.warn('Resume fetch error (resume5):', resumeErr.message);
                        }
                    }

                } catch (err) {
                    console.error('Error loading resume5 job data:', err);
                }
            })();
        }

        // ── ปุ่มส่งเรซูเม่ ──
        const btnSendResume    = document.getElementById('btn-send-resume');
        const sendSuccessModal = document.getElementById('send-success-modal');

        if (sendSuccessModal) sendSuccessModal.setAttribute('role', 'alertdialog');

        if (btnSendResume) {
            btnSendResume.addEventListener('click', async () => {
                const jobId = new URLSearchParams(window.location.search).get('id'); // ใช้ ?id= แทน ?jobId=

                if (!loggedInId) {
                    alert('กรุณาเข้าสู่ระบบก่อนสมัครงาน');
                    return;
                }

                try {
                    const res = await fetch('http://localhost:3000/api/apply-job', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            seeker_id:    loggedInId,
                            job_id:       jobId || 0,
                            match_score:  0,
                            match_details: []
                        })
                    });

                    const data = await res.json();

                    if (data.success) {
                        announce('ส่งเรซูเม่สำเร็จ');
                        if (sendSuccessModal) sendSuccessModal.style.display = 'flex';

                        btnSendResume.textContent = 'ส่งเรซูเม่แล้ว';
                        btnSendResume.style.backgroundColor = '#D9D9D9';
                        btnSendResume.style.color           = '#666';
                        btnSendResume.style.boxShadow       = 'none';
                        btnSendResume.style.cursor          = 'default';
                        btnSendResume.disabled              = true;
                        btnSendResume.setAttribute('aria-label', 'ส่งเรซูเม่สำหรับงานนี้แล้ว ไม่สามารถกดซ้ำได้');

                        setTimeout(() => {
                            if (sendSuccessModal) sendSuccessModal.style.display = 'none';
                        }, 3000);
                    } else {
                        alert('❌ เกิดข้อผิดพลาดในการส่งใบสมัคร: ' + data.error);
                    }
                } catch (err) {
                    alert('⚠️ เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ');
                }
            });

            if (sendSuccessModal) {
                sendSuccessModal.addEventListener('click', (e) => {
                    if (e.target === sendSuccessModal) sendSuccessModal.style.display = 'none';
                });
            }
        }

    } // end resume5.html

    // ==========================================
    // --- 14. หน้าโพสต์งานของนายจ้าง (post-employer.html) ---
    // ==========================================

    // ── แสดง toast เมื่อชำระเงินสำเร็จ (redirect จาก payment.html) ──
    if (window.location.pathname.includes('post-employer.html')) {
        const payResult = new URLSearchParams(window.location.search).get('payment');
        const payPlan   = new URLSearchParams(window.location.search).get('plan');
        if (payResult === 'success') {
            const planLabel = payPlan === 'yearly' ? 'รายปี (365 วัน)' : 'รายเดือน (30 วัน)';
            const toast = document.createElement('div');
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            toast.style.cssText = [
                'position:fixed', 'top:88px', 'left:50%', 'transform:translateX(-50%)',
                'background:#013c58', 'color:#fff', 'padding:14px 28px',
                'border-radius:12px', 'font-size:0.92rem', 'font-weight:600',
                'box-shadow:0 4px 24px rgba(0,0,0,.18)', 'z-index:9999',
                'display:flex', 'align-items:center', 'gap:10px'
            ].join(';');
            toast.innerHTML = `✅ ชำระเงินแพ็คเกจ <strong style="margin:0 4px;">${planLabel}</strong> สำเร็จ! โพสต์งานของคุณได้รับการอัปเดตแล้ว`;
            document.body.appendChild(toast);
            // ลบ query string ออกจาก URL โดยไม่ reload
            history.replaceState({}, '', 'post-employer.html');
            setTimeout(() => toast.remove(), 5000);
        }
    }

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

            // Collect disability types from card-style checkboxes with levels
            const disEntries = [
                { id: 'visual',   name: 'ทางการมองเห็น' },
                { id: 'hearing',  name: 'ทางการได้ยินหรือสื่อความหมาย' },
                { id: 'physical', name: 'ทางกายหรือการเคลื่อนไหว' },
            ];
            const selectedDis = disEntries
                .filter(d => document.getElementById('dis-' + d.id)?.checked)
                .map(d => {
                    const levelEl = document.getElementById('level-select-' + d.id);
                    if (levelEl?.value) {
                        const levelText = levelEl.options[levelEl.selectedIndex]?.text || '';
                        return `${d.name} (${levelText})`;
                    }
                    return d.name;
                });
            const disability_type = selectedDis.join(', ') || 'รับทุกประเภท';

            // Collect required skills from all skill-checkboxes in the form
            const allSkillChecks = document.querySelectorAll('#post-job-form .skills-group .skill-checkbox:checked');
            const req_skills = Array.from(allSkillChecks)
                .map(cb => cb.value || cb.nextElementSibling?.textContent.trim())
                .filter(Boolean)
                .join(', ');

            const req_experience = document.getElementById('req-experience')?.value || '';
            const req_portfolio  = document.getElementById('req-portfolio')?.value  || '';

            const payload = {
                employer_id: employerId,
                job_title: job_title,
                job_category: job_category,
                job_type: job_type,
                job_location: job_location,
                job_salary: job_salary,
                facility_desc: facility_desc,
                job_description: desc,
                job_qualifications: qual,
                disability_type: disability_type || 'รับทุกประเภท',
                req_skills: req_skills,
                req_experience: req_experience,
                req_portfolio: req_portfolio,
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
    // 🌟 16. ระบบดึงข้อมูลงานมาแสดงในหน้า post-employer2.html และ resume5.html
    // ==========================================
    const isJobDetailPage = window.location.pathname.includes('post-employer2.html') || window.location.pathname.includes('resume5.html');
    
    if (isJobDetailPage) {
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
                        
                        const logoEl = document.getElementById('render-job-logo');
                        if (logoEl) {
                            let logoText = job.company_name ? job.company_name.substring(0, 3).toUpperCase() : 'JOB';
                            logoEl.textContent = logoText;
                            
                            let badgeColor = '#ea580c'; 
                            const cachedJobsStr = sessionStorage.getItem('aiMatchedJobs');
                            let matchedJob = null;
                            if (cachedJobsStr) {
                                const cachedJobs = JSON.parse(cachedJobsStr);
                                matchedJob = cachedJobs.find(j => String(j.id) === String(jobId));
                                if (matchedJob) {
                                    const bgColors = ['#000000', '#17A05D', '#00A5E0', '#EE3124', '#E2231A', '#005A9C', '#FF6600', '#0F146D', '#00A651'];
                                    badgeColor = bgColors[(matchedJob.id || 0) % bgColors.length];
                                }
                            }
                            
                            logoEl.style.backgroundColor = badgeColor;
                            logoEl.style.color = '#ffffff';
                            logoEl.style.display = 'flex';
                            logoEl.style.alignItems = 'center';
                            logoEl.style.justifyContent = 'center';
                            
                            const aiReasonSection = document.getElementById('ai-match-reason-section');
                            const aiReasonsList = document.getElementById('render-ai-reasons');
                            if (aiReasonSection && aiReasonsList && matchedJob && matchedJob.matchDetails && matchedJob.matchDetails.length > 0) {
                                aiReasonSection.style.display = 'block';
                                aiReasonsList.innerHTML = matchedJob.matchDetails.map(reason => `<li style="margin-bottom: 8px;">${reason}</li>`).join('');
                            }
                        }
                        
                        const locEl = document.getElementById('render-job-location');
                        if(locEl) locEl.innerHTML = `<span aria-hidden="true">📍</span> ${job.job_location || '-'}`;
                        
                        const typeEl = document.getElementById('render-job-type');
                        if(typeEl) typeEl.innerHTML = `<span aria-hidden="true">💼</span> ${job.job_type || '-'}`;
                        
                        const salaryEl = document.getElementById('render-job-salary');
                        if(salaryEl) salaryEl.innerHTML = `<span aria-hidden="true">💰</span> ${job.salary || 'ตามตกลง'}`;
                        
                        setEl('render-job-desc', job.job_desc || '-');
                        setEl('render-req-skills', job.req_skills || '-');

                        const disSupportEl = document.getElementById('render-disability-support');
                        if(disSupportEl) {
                            const accom = job.accommodation ? job.accommodation : 'ไม่ได้ระบุ';
                            disSupportEl.innerHTML = `บริษัทยินดีต้อนรับผู้สมัครที่เป็นผู้พิการ <strong>${job.disability_type || 'รับทุกประเภท'}</strong> โดยมีสิ่งอำนวยความสะดวก: <strong>${accom}</strong>`;
                        }
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


    // ==========================================
    // 🌟 18. หน้าดึงข้อมูลงานแบบเจาะจง (job-detail.html) และ ส่งใบสมัคร
    // ==========================================
    if (window.location.pathname.includes('job-detail.html')) {
        const CAT_LABELS_JD  = { admin:'งานธุรการ / สำนักงาน', it:'งานไอที / ซอฟต์แวร์', service:'งานบริการ / ลูกค้าสัมพันธ์', production:'งานผลิต / บรรจุภัณฑ์', finance:'งานบัญชี / การเงิน' };
        const TYPE_LABELS_JD = { fulltime:'พนักงานประจำ (Full-Time)', parttime:'พาร์ทไทม์ (Part-Time)', freelance:'ฟรีแลนซ์ (Freelance)', contract:'สัญญาจ้าง (Contract)' };
        const DIS_LABELS_JD  = { visual:'ทางการมองเห็น', hearing:'ทางการได้ยิน', physical:'ทางกายหรือการเคลื่อนไหว' };

        const jdAvatar = document.getElementById('jd-user-avatar');
        const jdProfileBtn = document.getElementById('jd-user-profile-btn');
        if (jdAvatar && loggedInUser) {
            jdAvatar.textContent = loggedInUser.charAt(0).toUpperCase();
            if (jdProfileBtn) jdProfileBtn.setAttribute('aria-label', `เมนูโปรไฟล์ของ ${loggedInUser}`);
        }

        const urlParams = new URLSearchParams(window.location.search);
        const jobId = urlParams.get('id');

        const loadingEl = document.getElementById('jd-loading');
        const errorEl   = document.getElementById('jd-error');
        const cardEl    = document.getElementById('jd-card');

        function showState(state) {
            if (loadingEl) loadingEl.style.display = state === 'loading' ? 'block' : 'none';
            if (errorEl)   errorEl.style.display   = state === 'error'   ? 'block' : 'none';
            if (cardEl)    cardEl.style.display     = state === 'ready'   ? 'block' : 'none';
        }

        let currentJobData = null;

        if (!jobId) {
            showState('error');
        } else {
            showState('loading');
            fetch(`http://localhost:3000/api/get-job/${jobId}`)
                .then(res => res.json())
                .then(job => {
                    if (!job || !job.job_title) { showState('error'); return; }
                    
                    currentJobData = job; 

                    const titleEl = document.getElementById('render-job-title');
                    const compEl  = document.getElementById('render-company-name');
                    if (titleEl) { titleEl.textContent = job.job_title; document.title = `JobNble - ${job.job_title}`; }
                    if (compEl)  compEl.textContent = job.company_name || '-';

                    const logoEl = document.getElementById('render-job-logo');
                    if (logoEl) {
                        const initials = (job.company_name || 'JOB').substring(0, 3).toUpperCase();
                        logoEl.textContent = initials;
                        const colors = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899','#06B6D4'];
                        logoEl.style.backgroundColor = colors[(job.id || 0) % colors.length];
                        logoEl.style.color = '#fff';
                        logoEl.setAttribute('aria-label', `โลโก้บริษัท ${job.company_name || ''}`);
                    }

                    const catEl = document.getElementById('render-job-category');
                    if (catEl) {
                        const catLabel = CAT_LABELS_JD[job.job_category] || job.job_category || '';
                        if (catLabel) { catEl.textContent = catLabel; }
                        else { catEl.style.display = 'none'; }
                    }

                    const locEl = document.getElementById('render-job-location');
                    if (locEl) {
                        if (job.job_location) locEl.innerHTML = `<span aria-hidden="true">📍</span> ${job.job_location}`;
                        else locEl.style.display = 'none';
                    }

                    const typeEl = document.getElementById('render-job-type');
                    if (typeEl) {
                        const typeLabel = TYPE_LABELS_JD[job.job_type] || job.job_type || '';
                        if (typeLabel) typeEl.innerHTML = `<span aria-hidden="true">💼</span> ${typeLabel}`;
                        else typeEl.style.display = 'none';
                    }

                    const salaryEl = document.getElementById('render-job-salary');
                    if (salaryEl) {
                        if (job.salary) salaryEl.innerHTML = `<span aria-hidden="true">💰</span> ฿${Number(job.salary).toLocaleString()}`;
                        else salaryEl.innerHTML = `<span aria-hidden="true">💰</span> ตามตกลง`;
                    }

                    const descEl = document.getElementById('render-job-desc');
                    if (descEl) descEl.textContent = job.job_desc || '-';

                    const skillsEl = document.getElementById('render-req-skills');
                    const skillsSection = document.getElementById('jd-skills-section');
                    if (skillsEl) {
                        if (job.req_skills) {
                            const skillsArr = job.req_skills.split(',').map(s => s.trim()).filter(Boolean);
                            if (skillsArr.length > 0) {
                                skillsEl.innerHTML = skillsArr.map(s =>
                                    `<span style="display:inline-block; background:#EFF6FF; color:#1E40AF; border-radius:20px; padding:4px 14px; margin:4px 4px 4px 0; font-size:14px; font-weight:600;">${s}</span>`
                                ).join('');
                            } else {
                                if (skillsSection) skillsSection.style.display = 'none';
                            }
                        } else {
                            if (skillsSection) skillsSection.style.display = 'none';
                        }
                    }

                    const disSupportEl = document.getElementById('render-disability-support');
                    if (disSupportEl) {
                        const disArr = (job.disability_type || '').split(',').map(d => {
                            const k = d.trim();
                            return DIS_LABELS_JD[k] || k;
                        }).filter(Boolean);
                        const disText  = disArr.length > 0 ? `<strong>${disArr.join(', ')}</strong>` : 'รับทุกประเภท';
                        const accomText = job.accommodation ? `<strong>${job.accommodation}</strong>` : 'ไม่ได้ระบุ';
                        disSupportEl.innerHTML = `บริษัทยินดีต้อนรับผู้สมัครที่มีความพิการ ${disText} โดยมีสิ่งอำนวยความสะดวก: ${accomText}`;
                    }

                    showState('ready');
                })
                .catch(err => {
                    console.error('Error fetching job detail:', err);
                    showState('error');
                });
        }

        // 🌟 ดักจับปุ่ม "สมัครงานตำแหน่งนี้" (เพิ่มการยิง AI ก่อนส่งใบสมัคร) 🌟
        const applyBtn = document.getElementById('btn-apply-job');
        if (applyBtn) {
            applyBtn.addEventListener('click', async () => {
                if (!loggedInId) {
                    showToast('กรุณาเข้าสู่ระบบก่อนสมัครงาน', 'error');
                    setTimeout(() => { window.location.href = 'login-jobseeker.html'; }, 1500);
                    return;
                }

                const originalText = applyBtn.innerHTML;
                try {
                    applyBtn.innerHTML = '⏳ กำลังส่งใบสมัคร...';
                    applyBtn.disabled = true;

                    // 1. ตรวจสอบเรซูเม่ผู้ใช้งาน
                    const resResume = await fetch(`http://localhost:3000/api/get-resume/${loggedInId}`);
                    const resumeData = await resResume.json();

                    if (!resumeData || !resumeData.first_name) {
                        applyBtn.innerHTML = originalText;
                        applyBtn.disabled = false;
                        if (confirm('คุณยังไม่ได้สร้างเรซูเม่ในระบบ! คุณต้องสร้างและบันทึกเรซูเม่ก่อน จึงจะสามารถสมัครงานได้ ต้องการไปสร้างเรซูเม่ตอนนี้เลยหรือไม่?')) {
                            window.location.href = 'resume.html';
                        }
                        return;
                    }

                    // 2. ดึงข้อมูลประกาศงาน
                    const resJob = await fetch(`http://localhost:3000/api/get-job/${jobId}`);
                    const currentJobData = await resJob.json();

                    // 3. เรียก AI match พร้อม fallback (timeout 5 วินาที)
                    //    ถ้า AI สำเร็จ → ใช้ score จาก AI
                    //    ถ้า error / timeout → ใช้ match_score = 0, match_details = []
                    let finalScore   = 0;
                    let finalDetails = [];

                    try {
                        const aiBody = JSON.stringify({
                            job_title:                  currentJobData.job_title || '',
                            job_desc:                   currentJobData.job_desc  || '',
                            req_skills:                 currentJobData.req_skills || '',
                            education_history:          JSON.stringify(resumeData.education_history || []),
                            experience_and_activities:  'ทำงาน: ' + JSON.stringify(resumeData.work_experience || []) +
                                                        ' ฝึกงาน: ' + JSON.stringify(resumeData.intern_experience || []),
                            skills_and_custom_skills:   resumeData.skills   || '',
                            inspiration_message:        resumeData.summary  || ''
                        });

                        const aiPromise = fetch('http://localhost:3000/api/get-ai-match', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: aiBody
                        });
                        const timeoutPromise = new Promise((_, reject) =>
                            setTimeout(() => reject(new Error('AI timeout')), 5000)
                        );

                        const aiRes  = await Promise.race([aiPromise, timeoutPromise]);
                        const aiData = await aiRes.json();

                        if (aiData && typeof aiData.total_ai_score === 'number') {
                            finalScore   = aiData.total_ai_score;
                            finalDetails = Array.isArray(aiData.match_reasons) ? aiData.match_reasons : [];
                        }
                        // ถ้า response ไม่มี total_ai_score → คงค่า fallback 0 / []
                    } catch (aiErr) {
                        // AI error หรือ timeout → ใช้ fallback score=0, details=[] แล้วไปต่อ
                        console.warn('AI match skipped (error or timeout):', aiErr.message);
                        finalScore   = 0;
                        finalDetails = [];
                    }

                    // 4. บันทึกใบสมัครลงฐานข้อมูล (ทำงานได้เสมอ ไม่ขึ้นกับ AI)
                    const resApply = await fetch('http://localhost:3000/api/apply-job', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            seeker_id:    loggedInId,
                            job_id:       jobId,
                            match_score:  finalScore,
                            match_details: finalDetails
                        })
                    });

                    const result = await resApply.json();

                    if (result.success) {
                        applyBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;"><polyline points="20 6 9 17 4 12"></polyline></svg> ส่งเรซูเม่สำเร็จแล้ว';
                        applyBtn.setAttribute('aria-label', 'ส่งเรซูเม่สำเร็จแล้ว');
                        applyBtn.style.backgroundColor = '#10B981';
                        applyBtn.style.color = '#FFFFFF';
                        applyBtn.style.boxShadow = 'none';
                        applyBtn.style.cursor = 'default';
                        showToast('ส่งเรซูเม่จากโปรไฟล์สำเร็จ นายจ้างจะได้รับข้อมูลของคุณทันที', 'success');
                    } else {
                        applyBtn.innerHTML = originalText;
                        applyBtn.disabled = false;
                        showToast('เกิดข้อผิดพลาดในการส่งใบสมัคร: ' + result.error, 'error');
                    }
                } catch (err) {
                    console.error('Error applying job:', err);
                    applyBtn.innerHTML = originalText;
                    applyBtn.disabled = false;
                    showToast('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง', 'error');
                }
            });
        }
    } // 🟢 ปิดบล็อก if ของ job-detail.html อย่างถูกต้องตรงนี้! 🟢

    

    // ==========================================
    // 🌟 19. ระบบดึงรายชื่อผู้สมัครสำหรับนายจ้าง (หน้า profile-em2.html)
    //        เรียงตาม match_score + แสดง score ตาม subscription_plan
    // ==========================================
    if (window.location.pathname.includes('profile-em2.html')) {
        const applicantsList = document.getElementById('employer-applicants-list');

        // ── กำหนดสีของ score badge ตามระดับคะแนน ──
        function getScoreBadgeStyle(score) {
            if (score >= 75) return { color: '#16a34a', bg: '#f0fdf4', border: '#86efac' };
            if (score >= 50) return { color: '#013c58', bg: '#eff6ff', border: '#bfdbfe' };
            if (score >= 25) return { color: '#ea580c', bg: '#fff7ed', border: '#fdba74' };
            return               { color: '#94a3b8', bg: '#f8fafc', border: '#e2e8f0' };
        }

        // ── สร้าง HTML ของ score badge ตาม subscription_plan ──
        function buildScoreBadge(app, subscriptionPlan) {
            const score = app.match_score || 0;

            // Free Trial (null) — ซ่อน score
            if (!subscriptionPlan) {
                return `
                    <div style="text-align:center;">
                        <span style="display:inline-block; background:#f1f5f9; color:#94a3b8; padding:6px 14px;
                                     border-radius:20px; font-size:13px; font-weight:600; border:1px solid #e2e8f0;">
                            🔒 อัปเกรดเพื่อดู Score
                        </span>
                        <div style="margin-top:6px;">
                            <a href="payment.html" style="font-size:12px; color:#013c58; font-weight:600; text-decoration:underline;">
                                เลือกแพ็คเกจ →
                            </a>
                        </div>
                    </div>`;
            }

            // Pay Per Post / Monthly / Yearly — แสดงตัวเลข %
            const s = getScoreBadgeStyle(score);
            let html = `
                <div style="text-align:center;">
                    <span style="display:inline-block; background:${s.bg}; color:${s.color};
                                 padding:6px 18px; border-radius:20px; font-weight:700; font-size:16px;
                                 border:1.5px solid ${s.border};">
                        ${score}%
                    </span>`;

            // Monthly / Yearly — แสดง match_details เพิ่มเติม
            if (subscriptionPlan === 'monthly' || subscriptionPlan === 'yearly') {
                let details = [];
                try { details = JSON.parse(app.match_details || '[]'); } catch (e) { details = []; }
                // กรอง error message จาก AI ออก (รวม emoji prefix เช่น "🤖 ...")
                details = details.filter(d =>
                    !d.includes('ระบบ AI') &&
                    !d.includes('เกิดข้อผิดพลาด') &&
                    !d.includes('ไม่สามารถวิเคราะห์')
                );
                if (details.length > 0) {
                    html += `
                        <ul style="margin-top:8px; text-align:left; padding-left:18px;
                                   font-size:12px; color:#475569; line-height:1.8; list-style:disc;">
                            ${details.map(d => `<li>${d}</li>`).join('')}
                        </ul>`;
                }
            }
            html += `</div>`;
            return html;
        }

        // ── markAsViewed: อัปเดตสถานะแล้วนำทาง ──
        window.markAsViewed = async function (appId, url) {
            try {
                await fetch('http://localhost:3000/api/mark-application-viewed', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ application_id: appId })
                });
            } catch (e) { console.error('Error marking as viewed:', e); }
            window.location.href = url;
        };

        if (applicantsList && loggedInId && loggedInType === 'employer') {
            fetch(`http://localhost:3000/api/employer-applications/${loggedInId}`)
                .then(r => r.json())
                .then(data => {
                    // Server returns { subscription_plan, apps }
                    const subscriptionPlan = data.subscription_plan || null;
                    const apps = Array.isArray(data.apps) ? data.apps : (Array.isArray(data) ? data : []);

                    // เรียงซ้ำ client-side (safety net: server ควร sort แล้ว)
                    apps.sort((a, b) => {
                        const diff = (b.match_score || 0) - (a.match_score || 0);
                        return diff !== 0 ? diff : new Date(b.created_at) - new Date(a.created_at);
                    });

                    if (apps.length > 0) {
                        applicantsList.innerHTML = apps.map(app => {
                            const d        = new Date(app.created_at);
                            const timeStr  = `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
                            const dateStr  = `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()+543}`;
                            const isUnread     = app.status === 'pending';
                            const nameWeight   = isUnread ? '800' : '500';
                            const dotIndicator = isUnread
                                ? '<span style="color:#EF4444; margin-right:8px; font-size:12px;">●</span>'
                                : '';

                            return `
                                <div class="file-item applicant-item">
                                    <div style="display:flex; flex-direction:column; gap:4px; min-width:0;">
                                        <a href="profile-em3.html?appId=${app.application_id}&seekerId=${app.seeker_id}"
                                           onclick="event.preventDefault(); window.markAsViewed(${app.application_id}, this.href);"
                                           class="file-name"
                                           style="text-decoration:none; color:#1E293B; font-weight:${nameWeight}; transition:color 0.2s;">
                                            ${dotIndicator}${app.first_name} ${app.last_name}
                                        </a>
                                        <span style="font-size:14px; color:#64748B;">สมัครตำแหน่ง: ${app.job_title}</span>
                                    </div>

                                    <div style="display:flex; align-items:flex-start; justify-content:center; min-width:180px;">
                                        ${buildScoreBadge(app, subscriptionPlan)}
                                    </div>

                                    <div style="text-align:right; flex-shrink:0;">
                                        <div class="file-date">${dateStr}</div>
                                        <div class="file-time">${timeStr}</div>
                                    </div>
                                </div>
                            `;
                        }).join('');
                    } else {
                        applicantsList.innerHTML = '<div style="text-align:center; padding:40px; color:#64748B;">ยังไม่มีเรซูเม่ส่งเข้ามาในขณะนี้</div>';
                    }
                })
                .catch(err => {
                    console.error('Error fetching applications:', err);
                    applicantsList.innerHTML = '<div style="text-align:center; padding:40px; color:#EF4444;">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>';
                });
        }
    }

    // ==========================================
    // 🌟 20. แสดงเรซูเม่ผู้สมัครสำหรับนายจ้าง (หน้า profile-em3.html)
    // ==========================================
    if (window.location.pathname.includes('profile-em3.html')) {
        const urlParams  = new URLSearchParams(window.location.search);
        const appId      = urlParams.get('appId');
        const seekerId   = urlParams.get('seekerId');

        const em3Paper = document.getElementById('resume3-paper');
        if (em3Paper && seekerId) {
            fetch(`http://localhost:3000/api/get-resume/${seekerId}`)
                .then(res => res.json())
                .then(data => {
                    if (!data || !data.first_name) {
                        em3Paper.innerHTML = '<p style="text-align:center;padding:40px;color:#64748B;">ไม่พบข้อมูลเรซูเม่ของผู้สมัครรายนี้</p>';
                        return;
                    }

                    // แสดง template ตามที่ผู้หางานเลือกไว้
                    const savedTheme  = data.selected_template || 'minimal';
                    const allTemplates = em3Paper.querySelectorAll('.resume-theme-content');
                    allTemplates.forEach(tpl => tpl.classList.remove('active'));

                    const targetTpl = em3Paper.querySelector(`#tpl-${savedTheme}`);
                    if (targetTpl) {
                        targetTpl.classList.add('active');
                        renderRealDataToTemplate(targetTpl, data);
                    }
                })
                .catch(err => {
                    console.error('Error loading applicant resume (em3):', err);
                    if (em3Paper) em3Paper.innerHTML = '<p style="text-align:center;padding:40px;color:#EF4444;">เกิดข้อผิดพลาดในการโหลดเรซูเม่</p>';
                });
        }
    }

    

});