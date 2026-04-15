const cur = document.getElementById('cur');
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mx = 0, my = 0;
    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        cur.style.left = mx + 'px';
        cur.style.top = my + 'px';
    });
    document.querySelectorAll('a, button, .pi, .pc').forEach(el => {
        el.addEventListener('mouseenter', () => cur.classList.add('expand'));
        el.addEventListener('mouseleave', () => cur.classList.remove('expand'));
    });
} else {
    cur.style.display = 'none';
}

window.addEventListener('scroll', () => {
    document.getElementById('nav').classList.toggle('on', scrollY > 60);
});

const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            e.target.classList.add('vis');
            obs.unobserve(e.target);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));

setTimeout(() => document.getElementById('loader').classList.add('done'), 1500);

const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

function toggleMenu(open) {
    burger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
}

burger.addEventListener('click', () => {
    const isOpen = burger.classList.contains('open');
    toggleMenu(!isOpen);
});

document.querySelectorAll('.mm-link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
});

mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) toggleMenu(false);
});

const marquee = document.getElementById('marquee');
if (marquee) {
    let marqueeRaf = null;

    const updateMarqueeShift = () => {
        const shift = marquee.scrollWidth / 2;
        marquee.style.setProperty('--marquee-shift', `${shift}px`);
    };

    updateMarqueeShift();

    window.addEventListener('resize', () => {
        if (marqueeRaf) cancelAnimationFrame(marqueeRaf);
        marqueeRaf = requestAnimationFrame(updateMarqueeShift);
    });
}

const hero = document.querySelector('.hero');
const rings = Array.from(document.querySelectorAll('.ring'));

if (hero && rings.length) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const isMobileViewport = () => window.matchMedia('(max-width: 1120px)').matches;

    const ringSettings = rings.map((ring) => {
        if (ring.classList.contains('ring1')) {
            return { depth: 0.22, rise: 180, rotate: 1.4, opacity: 1 };
        }
        if (ring.classList.contains('ring2')) {
            return { depth: 0.3, rise: 220, rotate: 2, opacity: 0.95 };
        }
        return { depth: 0.16, rise: 150, rotate: 1.1, opacity: 0.9 };
    });

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let scrollProgress = 0;
    let rafId = null;
    let animationEnabled = false;

    const updatePointerTarget = () => {
        const rect = hero.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        targetX = clamp(((pointerX - rect.left) / rect.width) * 2 - 1, -1, 1);
        targetY = clamp(((pointerY - rect.top) / rect.height) * 2 - 1, -1, 1);
    };

    const updateScrollProgress = () => {
        const rect = hero.getBoundingClientRect();
        const passed = Math.max(0, -rect.top);
        scrollProgress = clamp(passed / Math.max(hero.offsetHeight, window.innerHeight), 0, 1);
    };

    const resetRingsState = () => {
        rings.forEach((ring, index) => {
            ring.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
            ring.style.opacity = String(ringSettings[index].opacity);
        });
    };

    const stopAnimation = () => {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    };

    const renderRings = () => {
        if (!animationEnabled) {
            stopAnimation();
            return;
        }

        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;

        rings.forEach((ring, index) => {
            const config = ringSettings[index];
            const moveX = currentX * config.depth * 120;
            const moveY = currentY * config.depth * 68 - scrollProgress * config.rise;
            const rotation = currentX * config.rotate * 6;
            const fade = Math.max(0, 1 - scrollProgress * 1.25);

            ring.style.transform = `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0) rotate(${rotation.toFixed(2)}deg)`;
            ring.style.opacity = (config.opacity * fade).toFixed(3);
        });

        rafId = requestAnimationFrame(renderRings);
    };

    const refreshAnimationState = () => {
        const shouldAnimate = !prefersReducedMotion && !isMobileViewport();

        if (shouldAnimate && !animationEnabled) {
            animationEnabled = true;
            updatePointerTarget();
            updateScrollProgress();
            if (!rafId) renderRings();
            return;
        }

        if (!shouldAnimate && animationEnabled) {
            animationEnabled = false;
            stopAnimation();
            resetRingsState();
            return;
        }

        if (!shouldAnimate) {
            resetRingsState();
        }
    };

    window.addEventListener('pointermove', (e) => {
        if (!animationEnabled) return;
        pointerX = e.clientX;
        pointerY = e.clientY;
        updatePointerTarget();
    }, { passive: true });

    window.addEventListener('scroll', () => {
        if (!animationEnabled) return;
        updateScrollProgress();
    }, { passive: true });

    window.addEventListener('resize', () => {
        updatePointerTarget();
        updateScrollProgress();
        refreshAnimationState();
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAnimation();
            return;
        }

        if (animationEnabled && !rafId) {
            renderRings();
        }
    });

    refreshAnimationState();
}

