// Basic animations for quiz elements
document.addEventListener('DOMContentLoaded', () => {
    const options = document.querySelectorAll('.option-btn');
    options.forEach(option => {
        option.addEventListener('mouseenter', () => {
            option.classList.add('animate__animated', 'animate__pulse');
        });
        option.addEventListener('mouseleave', () => {
            option.classList.remove('animate__animated', 'animate__pulse');
        });
    });
});