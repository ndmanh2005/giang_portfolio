document.addEventListener("DOMContentLoaded", function() {
    console.log("App.js đang chạy..."); // Kiểm tra xem file có nạp được không
    // ======================================================
    // 0. KÍCH HOẠT LENIS SMOOTH SCROLL (LƯỚT MƯỢT)
    // ======================================================
    // Kiểm tra xem thư viện đã nạp chưa để tránh lỗi
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,      // Thời gian trôi (càng cao càng mượt, mặc định 1.2)
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Hiệu ứng dừng từ từ
            direction: 'vertical', 
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1, // Độ nhạy chuột
            smoothTouch: false, // Tắt trên điện thoại (để lướt tự nhiên hơn)
            touchMultiplier: 2,
        });

        // Hàm lặp để cập nhật chuyển động
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
        
        console.log("Lenis Smooth Scroll đã kích hoạt!");
    } else {
        console.warn("Chưa nạp thư viện Lenis! Hãy thêm thẻ script vào HTML.");
    }

    // ======================================================
    // 1. KHO DỮ LIỆU DỰ ÁN
    // ======================================================
    const projectsData = {
        'branding': [
            { title: 'BOODLE', date: '2023', src: 'images/project-branding-1.jpg', url: 'project-branding-1.html' },
            { title: 'HON THEN', date: '2025', src: 'images/project-branding-2.jpg', url: 'project-branding-2.html' }
        ],
        'magazine': [
            { title: 'LOFFICIEL', date: '2022', src: 'images/project-magazine.jpg', url: 'project-magazine.html' }
        ],
        'ux-ui': [
            { title: 'WISE TALK', date: '2022', src: 'images/project-ux.jpg', url: 'project-ux.html' }
        ],
        'visual': [
            { title: 'HI2HIGH X QHPCMN', date: '2024', src: 'images/project-visual.jpg', url: 'project-visual.html' }
        ],
        'packaging': [
            { title: 'LE FRUIT & HANH TRA', date: '2023', src: 'images/project-packaging.jpg', url: 'project-packaging.html' }
        ]
    };

    // ======================================================
    // 2. LOGIC FILTER (ĐÃ ĐỒNG BỘ TÊN VỚI HTML)
    // ======================================================
    
    // Lấy tất cả các thẻ có class="filter-item" trong HTML
    const filterItems = document.querySelectorAll('.filter-item');
    
    const slot1 = document.getElementById('slot-1');
    const slot2 = document.getElementById('slot-2');

    // Hàm cập nhật nội dung cho từng ô (Slot)
    function updateSlot(slotId, imgId, titleId, dateId, linkId, data) {
        if (!data) return; // Nếu không có dữ liệu thì thoát ngay

        const imgElement = document.getElementById(imgId);
        const titleElement = document.getElementById(titleId);
        const dateElement = document.getElementById(dateId);
        const linkElement = document.getElementById(linkId);

        // Cập nhật Ảnh
        if (imgElement) imgElement.src = data.src;
        
        // Cập nhật Chữ
        if (titleElement) titleElement.innerText = data.title;
        if (dateElement) dateElement.innerText = data.date;

        // Cập nhật Link (QUAN TRỌNG ĐỂ NHẢY TRANG)
        if (linkElement && data.url) {
            linkElement.href = data.url;
        }
    }

    // Gắn sự kiện Click cho từng nút Filter
    if (filterItems.length > 0) {
        filterItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault(); // Ngăn trang web nhảy lên đầu

                console.log("Đã bấm vào:", item.innerText); // Kiểm tra xem bấm có nhận không

                // 1. Xóa class active ở nút cũ, thêm vào nút mới bấm
                filterItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // 2. Lấy loại dự án từ attribute data-filter (VD: branding, packaging)
                const filterType = item.getAttribute('data-filter');
                
                // 3. Lấy danh sách dự án tương ứng từ kho dữ liệu
                const dataList = projectsData[filterType] || projectsData['branding'];

                // 4. Hiển thị ra màn hình
                if (dataList.length === 1) {
                    // --- CHẾ ĐỘ 1 ẢNH (Packaging, Magazine...) ---
                    
                    // Hiện Slot 1, chuyển sang chế độ ảnh to giữa
                    slot1.classList.remove('hidden-slot');
                    slot1.classList.add('single-center-mode');
                    
                    // Cập nhật nội dung Slot 1 (Kèm link-1)
                    updateSlot('slot-1', 'img-1', 'title-1', 'date-1', 'link-1', dataList[0]);

                    // Ẩn Slot 2
                    slot2.classList.add('hidden-slot');
                } 
                else if (dataList.length >= 2) {
                    // --- CHẾ ĐỘ 2 ẢNH (Branding) ---
                    
                    // Slot 1: Hiện, bỏ chế độ giữa (về bên trái)
                    slot1.classList.remove('hidden-slot', 'single-center-mode');
                    updateSlot('slot-1', 'img-1', 'title-1', 'date-1', 'link-1', dataList[0]);

                    // Slot 2: Hiện
                    slot2.classList.remove('hidden-slot');
                    updateSlot('slot-2', 'img-2', 'title-2', 'date-2', 'link-2', dataList[1]);
                }
            });
        });
    } else {
        console.error("LỖI: Không tìm thấy class .filter-item trong HTML!");
    }


    // ======================================================
    // 3. CÁC HIỆU ỨNG KHÁC (GIỮ NGUYÊN)
    // ======================================================

    // Fade In
    const elementsToFadeIn = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.1 });
    elementsToFadeIn.forEach(el => observer.observe(el));

    // Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    const whiteSection = document.getElementById('white-section');
    if (cursor) {
        window.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            if (whiteSection && whiteSection.matches(':hover')) cursor.classList.add('red-mode');
            else cursor.classList.remove('red-mode');
        });
    }

    // Scroll Hero Effect
    const heroContent = document.getElementById('hero-effect');
    if (heroContent) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            let progress = scrollY / windowHeight;
            if (progress > 1) progress = 1;
            const scale = 1 - (progress * 0.2);
            const opacity = 1 - (progress * 1.5);
            heroContent.style.transform = `scale(${scale})`;
            heroContent.style.opacity = opacity > 0 ? opacity : 0;
            heroContent.style.filter = `blur(${progress * 10}px)`;
        });
    }

    // Skills Focus
    const skillItems = document.querySelectorAll('.skill-item-focus');
    function calculateFocus() {
        if(skillItems.length === 0) return;
        const viewportCenter = window.innerHeight / 2;
        skillItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const itemCenter = rect.top + rect.height / 2;
            const distance = Math.abs(viewportCenter - itemCenter);
            const maxDistance = 350; 
            let factor = 1 - Math.min(1, distance / maxDistance); 
            const scaleValue = 1.0 + (factor * 0.8); 
            const opacityValue = 0.3 + (factor * 0.7); 
            const fontWeight = 400 + Math.round(factor * 500); 
            const lightness = 80 - (factor * 80); 
            item.style.color = `hsl(0, 0%, ${lightness}%)`;
            item.style.transform = `scale(${scaleValue})`;
            item.style.opacity = opacityValue;
            item.style.fontWeight = fontWeight;
        });
    }
    window.addEventListener('scroll', calculateFocus);
    calculateFocus();

    // Navbar Transition
    const navbar = document.querySelector('.cs-navbar');
    if(navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight - 100) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        });
    }

    // ======================================================
    // 7. FOOTER FADE-IN EFFECT (ÁP DỤNG CHO CẢ 2 LOẠI FOOTER)
    // ======================================================
    
    // Tìm footer: Ưu tiên trang phụ (.cs-footer), nếu không có thì tìm trang chủ (.red-footer)
    const footer = document.querySelector('.cs-footer') || document.querySelector('.red-footer');
    
    if (footer) {
        // Đặt mặc định ban đầu là hiện rõ (đề phòng JS chưa chạy kịp)
        // Nhưng CSS đã set opacity: 0 nên nó sẽ mờ.
        
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY; 
            const windowHeight = window.innerHeight; 
            const documentHeight = document.documentElement.scrollHeight; 

            // Tính khoảng cách còn lại tới đáy
            const remainingDistance = documentHeight - (scrollY + windowHeight);
            const footerHeight = footer.offsetHeight;

            // Logic tính toán độ mờ
            if (remainingDistance <= footerHeight + 50) { // +50 để hiệu ứng bắt đầu sớm hơn chút
                
                let progress = 1 - (remainingDistance / footerHeight);

                if (progress < 0) progress = 0;
                if (progress > 1) progress = 1;

                footer.style.opacity = progress;
                footer.style.transform = `scale(${0.9 + (0.1 * progress)})`;
                
            } else {
                footer.style.opacity = 0;
                footer.style.transform = `scale(0.9)`;
            }
        });
    }

// ======================================================
    // 8. LOGIC HALFTONE REVEAL (MỚI)
    // ======================================================
    function animateGridReveal() {
        const projectImages = document.querySelectorAll('.image-wrapper-raw');
        const windowHeight = window.innerHeight;

        projectImages.forEach(img => {
            const rect = img.getBoundingClientRect();
            
            // Tính toán vị trí
            const startPoint = windowHeight * 0.9; 
            const endPoint = windowHeight * 0.4;
            
            let progress = (rect.top - endPoint) / (startPoint - endPoint);

            // Kẹp giá trị 0-1
            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;

            // LOGIC ĐẢO NGƯỢC:
            // progress = 1 (ở dưới đáy) -> Hạt nhỏ (ảnh bị đục lỗ nát bét)
            // progress = 0 (ở trên cao) -> Hạt to (ảnh liền mạch)
            
            // Kích thước hạt (Dot Size): Từ 20% (nhỏ) lên 150% (phủ kín)
            // Khoảng cách (Spacing): Luôn lớn hơn size một chút để tạo độ mờ biên
            
            let dotSize = 140 - (progress * 120); // 140% xuống 20%
            let spacing = dotSize + 10;           // Spacing luôn to hơn dot chút xíu

            img.style.setProperty('--dot-size', dotSize + '%');
            img.style.setProperty('--dot-spacing', spacing + '%');
        });

        requestAnimationFrame(animateGridReveal);
    }

    animateGridReveal();
});