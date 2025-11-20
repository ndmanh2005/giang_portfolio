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
            const lightness = 50 - (factor * 20); 
            
            item.style.color = `hsl(0, 0%, ${lightness}%)`;
            item.style.transform = `scale(${scaleValue})`;
            item.style.opacity = opacityValue;
            item.style.fontWeight = fontWeight;
        });
    }

    window.addEventListener('scroll', calculateFocus);
    calculateFocus();

});