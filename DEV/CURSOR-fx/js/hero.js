/**
 * Minimal JS for video hero:
 * 1. Autoplay fallback (for when attribute autoplay is blocked)
 * 2. Intersection Observer: pause when hero is off-screen, play when visible
 */

(function () {
    var video = document.getElementById('heroVideo');
    if (!video) return;

    // Autoplay fallback (e.g. some mobile browsers)
    function tryPlay() {
        var p = video.play();
        if (p && typeof p.catch === 'function') p.catch(function () {});
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryPlay);
    } else {
        tryPlay();
    }

    // Pause when hero is out of view (saves CPU/battery)
    var hero = video.closest('.hero');
    if (!hero || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    video.play().catch(function () {});
                } else {
                    video.pause();
                }
            });
        },
        { threshold: 0.25, rootMargin: '0px' }
    );
    observer.observe(hero);
})();
