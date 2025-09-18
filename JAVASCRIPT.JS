document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
        });
        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Auto slide every 3 seconds
    if (slides.length > 0) {
        setInterval(nextSlide, 3000);
        showSlide(currentSlide);
    }

    // Enhanced Search functionality with page redirection
    const searchBox = document.querySelector('.searchbox');
    const searchBtn = document.querySelector('.searchbtn');
    const programs = document.querySelectorAll('.program');

    if (searchBox && searchBtn) {
        function handleSearch() {
            const query = searchBox.value.toLowerCase().trim();

            // Check for specific page keywords and redirect
            if (query.includes('services') || query.includes('service')) {
                window.location.href = 'Services.HTML';
                return;
            }

            if (query.includes('training') || query.includes('programs') || query.includes('courses')) {
                window.location.href = 'Training Programs .HTML';
                return;
            }

            // If on Training Programs page, filter programs
            if (programs.length > 0) {
                programs.forEach(program => {
                    const title = program.querySelector('h2').textContent.toLowerCase();
                    const desc = program.querySelector('p').textContent.toLowerCase();
                    if (title.includes(query) || desc.includes(query)) {
                        program.style.display = 'block';
                    } else {
                        program.style.display = 'none';
                    }
                });
            }
        }

        searchBtn.addEventListener('click', handleSearch);
        searchBox.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
});