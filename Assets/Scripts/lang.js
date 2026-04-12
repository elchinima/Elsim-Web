const T = {
    en: {
        nav1: 'Products', nav2: 'Portfolio', nav3: 'Contact',
        eyebrow: 'Software Development Studio',
        heroCta: 'Explore Products',
        stat1: 'Products', stat2: 'Languages', stat3: 'Ambition',
        prodTitle: 'Products',
        shapixTag: 'Game · Android',
        shapixDesc: 'Test your reflexes in a minimalist world where every second and every millimeter of precision matters.',
        sx1: 'Developed by Elsim', sx2: 'Available on Android', sx3: 'Free to play', sx4: 'Precision · Speed · Reflexes',
        free: 'Free',
        dhTag: 'Browser Extension',
        dhDesc: 'Dev Helper puts AI on any webpage. Select text or screenshot an area — get instant answers. For developers and students.',
        dh1: 'Select text → instant AI answer', dh2: 'Screenshot area (Ctrl + click drag)', dh3: 'OpenAI · Gemini · Claude · Groq', dh4: 'Chrome & Edge — pay once, use forever',
        ecodeTag: 'Website',
        ecodeDesc: "QR Code Generator and Scanner. Create, scan, and share. It's all convenient and fast.",
        ecode1: 'Login and registration flow', ecode2: 'Generate QR from user data', ecode3: 'Scan QR codes with camera', ecode4: 'History, download and copy tools',
        once: '— one-time',
        portTitle: 'Portfolio',
        tagGame: 'Game', tagExt: 'Extension', tagWeb: 'Website',
        contactTitle: 'Contact',
        contactSub: 'Reach out anytime',
        loc: 'Location',
        buyDH: 'Buy Dev Helper via Telegram',
    },
    ru: {
        nav1: 'Продукты', nav2: 'Портфолио', nav3: 'Контакты',
        eyebrow: 'Студия разработки программ',
        heroCta: 'Смотреть продукты',
        stat1: 'Продукта', stat2: 'Языка', stat3: 'Амбиции',
        prodTitle: 'Продукты',
        shapixTag: 'Игра · Android',
        shapixDesc: 'Испытайте свои рефлексы в минималистичном мире, где важна каждая секунда и каждый миллиметр точности.',
        sx1: 'Разработана в Elsim', sx2: 'Доступна на Android', sx3: 'Бесплатно', sx4: 'Точность · Скорость · Рефлексы',
        free: 'Бесплатно',
        dhTag: 'Расширение для браузера',
        dhDesc: 'Dev Helper добавляет AI на любой сайт. Выдели текст или сделай скриншот — получи ответ мгновенно. Для разработчиков и студентов.',
        dh1: 'Выделение текста → ответ AI', dh2: 'Скриншот области (Ctrl + ЛКМ)', dh3: 'OpenAI · Gemini · Claude · Groq', dh4: 'Chrome и Edge — один раз купил, используй всегда',
        ecodeTag: 'Веб-сайт',
        ecodeDesc: 'Генератор и сканер QR-кодов. Создавай, сканируй и делись — всё удобно и быстро.',
        ecode1: 'Вход и регистрация', ecode2: 'Генерация QR из данных пользователя', ecode3: 'Сканирование QR через камеру', ecode4: 'История, скачивание и копирование',
        once: '— разово',
        portTitle: 'Портфолио',
        tagGame: 'Игра', tagExt: 'Расширение', tagWeb: 'Веб-сайт',
        contactTitle: 'Контакты',
        contactSub: 'Напишите нам',
        loc: 'Локация',
        buyDH: 'Купить Dev Helper в Telegram',
    },
    az: {
        nav1: 'Məhsullar', nav2: 'Portfolio', nav3: 'Əlaqə',
        eyebrow: 'Proqram Təminatı Studiyası',
        heroCta: 'Məhsullara bax',
        stat1: 'Məhsul', stat2: 'Dil', stat3: 'Ambisiya',
        prodTitle: 'Məhsullar',
        shapixTag: 'Oyun · Android',
        shapixDesc: 'Hər saniyənin və hər millimetrin önəmli olduğu minimalist dünyada reflekslərinizi sınayın.',
        sx1: 'Elsim tərəfindən hazırlanıb', sx2: 'Android-də mövcuddur', sx3: 'Pulsuz', sx4: 'Dəqiqlik · Sürət · Reflekslər',
        free: 'Pulsuz',
        dhTag: 'Brauzer Uzantısı',
        dhDesc: 'Dev Helper istənilən sayta AI əlavə edir. Mətni seçin və ya skrinşot çəkin — cavab anındadır. Proqramçılar və tələbələr üçün.',
        dh1: 'Mətn seçimi → AI cavabı', dh2: 'Sahə skrinşotu (Ctrl + klik)', dh3: 'OpenAI · Gemini · Claude · Groq', dh4: 'Chrome və Edge — bir dəfə al, həmişə istifadə et',
        ecodeTag: 'Veb-sayt',
        ecodeDesc: 'QR kod generatoru və skaneri. Yarat, skan et və paylaş - hamısı rahat və sürətlidir.',
        ecode1: 'Giriş və qeydiyyat', ecode2: 'İstifadəçi məlumatlarından QR yaratma', ecode3: 'Kamera ilə QR skanı', ecode4: 'Tarixçə, endirmə və kopyalama alətləri',
        once: '— bir dəfəlik',
        portTitle: 'Portfolio',
        tagGame: 'Oyun', tagExt: 'Uzantı', tagWeb: 'Veb-sayt',
        contactTitle: 'Əlaqə',
        contactSub: 'Bizimlə əlaqə saxlayın',
        loc: 'Yer',
        buyDH: 'Dev Helper-i Telegramda al',
    }
};

function applyLang(l) {
    const t = T[l];
    if (!t) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const k = el.dataset.i18n;
        if (t[k] !== undefined) el.textContent = t[k];
    });
    document.querySelectorAll('.lb').forEach(b => b.classList.toggle('on', b.dataset.lang === l));
    document.documentElement.lang = l;
    localStorage.setItem('elsim_lang', l);
}

document.querySelectorAll('.lb').forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));
applyLang(localStorage.getItem('elsim_lang') || 'en');
