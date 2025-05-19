document.addEventListener('DOMContentLoaded', () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
});
console.log('Вийшли з акаунта');
