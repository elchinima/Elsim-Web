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

