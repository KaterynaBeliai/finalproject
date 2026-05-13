//if picture didnt load
function createPlaceholder(alt) {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
            <rect width="100%" height="100%" fill="#eef5f9"/>
            <text x="50%" y="50%" font-family="DM Sans, sans-serif" font-size="14"
                fill="#6c7a86" text-anchor="middle" dominant-baseline="middle">${alt || 'No Image'}</text>
        </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
 
function initImageFallbacks() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function () {
            if (!this.dataset.fallbackApplied) {
                this.dataset.fallbackApplied = 'true';
                this.src = createPlaceholder(this.alt);
                this.style.opacity = '0.5';
            }
        });
    });
}
 
//lazy loading
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        document.querySelectorAll('img:not([loading])').forEach(img => {
            img.setAttribute('loading', 'lazy');
        });
        return;
    }
    //fallback for old browsers
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                obs.unobserve(img);
            }
        });
    }, { rootMargin: '200px' });
 
    document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
}
 
// change photo on exact product
function swapProductImage(productName, newSrc) {
    document.querySelectorAll('.product-card').forEach(card => {
        const nameEl = card.querySelector('h4');
        if (nameEl && nameEl.textContent.trim() === productName) {
            const img = card.querySelector('img');
            if (img) img.src = newSrc;
        }
    });
}
 
//init
document.addEventListener('DOMContentLoaded', () => {
    initImageFallbacks();
    initLazyLoading();
});