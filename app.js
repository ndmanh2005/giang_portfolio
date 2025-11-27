document.addEventListener("DOMContentLoaded", function() {

    // ======================================================
    // 1. HIỆU ỨNG FADE-IN (CÁC PHẦN TỬ HIỆN DẦN KHI CUỘN)
    // ======================================================
    const elementsToFadeIn = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Tùy chọn: Ngừng theo dõi sau khi đã hiện
                observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.1 }); // Hiện khi lọt vào 10% màn hình

    elementsToFadeIn.forEach(el => observer.observe(el));


    // ======================================================
    // 2. CON TRỎ CHUỘT (DI CHUYỂN & ĐỔI MÀU)
    // ======================================================
    const cursor = document.querySelector('.custom-cursor');
    const whiteSection = document.getElementById('white-section');
    
    // A. Giúp con trỏ đi theo chuột
    window.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // B. Logic đổi màu "dự phòng" (Check liên tục khi di chuyển)
        // Nếu chuột đang nằm trên vùng trắng mà chưa có class đỏ -> Thêm vào ngay
        // (Khắc phục lỗi khi tải lại trang mà đang cuộn sẵn ở dưới)
        if (whiteSection.matches(':hover')) {
            cursor.classList.add('red-mode');
        } else {
            cursor.classList.remove('red-mode');
        }
    });

    // C. Logic đổi màu chính (Khi chuột đi vào/ra vùng trắng)
    if (whiteSection) {
        // Khi vào vùng nội dung trắng -> Biến thành ĐỎ
        whiteSection.addEventListener('mouseenter', () => {
            cursor.classList.add('red-mode');
        });

        // Khi ra khỏi vùng nội dung (về lại Hero đỏ) -> Biến thành TRẮNG
        whiteSection.addEventListener('mouseleave', () => {
            cursor.classList.remove('red-mode');
        });
    }


    // ======================================================
    // 3. HIỆU ỨNG SCROLL HERO (SETH LUKIN STYLE)
    // (Thu nhỏ + Mờ dần + Nhòe đi khi cuộn xuống)
    // ======================================================
    const heroContent = document.getElementById('hero-effect');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Tính toán tiến độ cuộn (từ 0 đến 1)
        let progress = scrollY / windowHeight;
        
        // Giới hạn max là 1 để không tính toán thừa
        if (progress > 1) progress = 1;

        // Công thức hiệu ứng:
        // - Scale: Giảm từ 1 xuống 0.8 (thu nhỏ 20%)
        // - Opacity: Giảm từ 1 xuống 0 (mờ dần, nhân 1.5 để mờ nhanh hơn chút)
        const scale = 1 - (progress * 0.2);
        const opacity = 1 - (progress * 1.5);

        if (heroContent) {
            heroContent.style.transform = `scale(${scale})`;
            heroContent.style.opacity = opacity > 0 ? opacity : 0;
            
            // Thêm hiệu ứng làm mờ (Blur) tăng dần để tạo chiều sâu
            heroContent.style.filter = `blur(${progress * 10}px)`;
        }
    });

// ======================================================
    // 4. SKILLS FOCUS EFFECT (BIÊN ĐỘ ỔN ĐỊNH VÀ MẠNH MẼ)
    // ======================================================
    const skillsList = document.querySelector('.skills-list-focus');
    const skillItems = document.querySelectorAll('.skill-item-focus');

    function calculateFocus() {
        const viewportCenter = window.innerHeight / 2;

        skillItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const itemCenter = rect.top + rect.height / 2;

            const distance = Math.abs(viewportCenter - itemCenter);
            const maxDistance = 350; 
            let factor = 1 - Math.min(1, distance / maxDistance); 
            
            // 1. Scale: Từ 1.0 (nhỏ nhất) đến 1.8 (lớn nhất) -> Biên độ tối ưu
            const scaleValue = 1.0 + (factor * 0.8); 
            
            // 2. Opacity: Từ 0.3 (mờ nhất) đến 1.0 (rõ nhất)
            const opacityValue = 0.3 + (factor * 0.7); 

            // 3. Font Weight & Color (Vẫn giữ logic đen/xám)
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

// ======================================================
    // 5. LOGIC FILTER: BRAND (2 ẢNH) - CÒN LẠI (1 ẢNH)
    // ======================================================

    // A. KHO DỮ LIỆU (TÊN FILE ĐÃ CHUẨN HÓA)
// Cập nhật projectsData trong file app.js
const projectsData = {
    'branding': [
        // Branding: 2 file riêng biệt
        { title: 'LUUNA', date: 'MAY 2022', src: 'images/project-branding-1.jpg', url: 'project-branding-1.html' },
        { title: 'TWINBY', date: 'NOV 2021', src: 'images/project-branding-2.jpg', url: 'project-branding-2.html' }
    ],
    'magazine': [
        // Magazine
        { title: 'VOGUE COVER', date: 'JUN 2023', src: 'images/project-magazine.jpg', url: 'project-magazine.html' }
    ],
    'ux-ui': [
        // UX/UI
        { title: 'FINTECH APP', date: 'SEP 2023', src: 'images/project-ux.jpg', url: 'project-ux.html' }
    ],
    'visual': [
        // Visual
        { title: 'ADC SPACE', date: 'NOV 2023', src: 'images/project-visual.jpg', url: 'project-visual.html' }
    ],

    'packaging': [
        // Vì chỉ có 1 project nên nó sẽ tự động dùng chế độ "single-center-mode" (ảnh to giữa màn hình)
        // Bạn nhớ thay đường dẫn ảnh (src) và link (url) sau này nhé
        { title: 'PACKAGING DESIGN', date: 'DEC 2023', src: 'images/project-packaging.jpg', url: 'project-packaging.html' }
    ]
};

    // B. LẤY CÁC PHẦN TỬ HTML
    const filterButtons = document.querySelectorAll('.filter-item');
    const slot1 = document.getElementById('slot-1');
    const slot2 = document.getElementById('slot-2');
    
    // Hàm cập nhật nội dung
    function updateSlotContent(slotId, imgId, titleId, dateId, data) {
        const img = document.getElementById(imgId);
        const title = document.getElementById(titleId);
        const date = document.getElementById(dateId);
        
        if(img) img.src = data.src;
        if(title) title.innerText = data.title;
        if(date) date.innerText = data.date;
    }

    // C. XỬ LÝ SỰ KIỆN CLICK
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // 1. Đổi màu nút Active
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 2. Lấy loại dự án
            const filterType = btn.getAttribute('data-filter');
            const dataList = projectsData[filterType] || projectsData['branding'];

            // 3. Logic hiển thị (1 hay 2 project?)
            
            // --- TRƯỜNG HỢP: 1 PROJECT (Magazine, UX, Visual) ---
            if (dataList.length === 1) {
                // SLOT 1: Hiện & To giữa
                slot1.classList.remove('hidden-slot');
                slot1.classList.add('single-center-mode');
                updateSlotContent('slot-1', 'img-1', 'title-1', 'date-1', dataList[0]);

                // SLOT 2: Ẩn đi
                slot2.classList.add('hidden-slot');
            }
            
            // --- TRƯỜNG HỢP: 2 PROJECT (Branding) ---
            else if (dataList.length >= 2) {
                // SLOT 1: Hiện & Trả về vị trí trái (bỏ To giữa)
                slot1.classList.remove('hidden-slot', 'single-center-mode');
                updateSlotContent('slot-1', 'img-1', 'title-1', 'date-1', dataList[0]);

                // SLOT 2: Hiện & Vị trí phải
                slot2.classList.remove('hidden-slot');
                updateSlotContent('slot-2', 'img-2', 'title-2', 'date-2', dataList[1]);
            }
        });
    });
    // ======================================================
    // 6. NAVBAR TRANSITION CHO TRANG PHỤ (NEW)
    // ======================================================
    const navbar = document.querySelector('.cs-navbar');
    
    if(navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight - 100) {
                navbar.classList.add('scrolled'); // Thêm nền trắng khi cuộn qua Hero
            } else {
                navbar.classList.remove('scrolled'); // Trong suốt khi ở Hero
            }
        });
    }
});
