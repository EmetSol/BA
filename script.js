/* Highlight the section currently being read. Native HTML handles Read more. */
(() => {
    const nav = document.querySelector('nav');
    const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
    const sections = links.map(link => ({
        link,
        section: document.querySelector(link.getAttribute('href'))
    })).filter(item => item.section);
    if (!nav || !sections.length) return;

    let scheduled = false;
    function updateMenu() {
        scheduled = false;
        const readingLine = nav.getBoundingClientRect().bottom + 48;
        let current = null;
        for (const item of sections) {
            if (item.section.getBoundingClientRect().top <= readingLine) current = item;
        }
        // The short contact section may not reach the reading line at page bottom.
        const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
        if (atBottom && window.scrollY > 0) current = sections[sections.length - 1];
        for (const item of sections) {
            if (item === current) item.link.setAttribute('aria-current', 'location');
            else item.link.removeAttribute('aria-current');
        }
    }
    function scheduleUpdate() {
        if (scheduled) return;
        scheduled = true;
        window.requestAnimationFrame(updateMenu);
    }
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('hashchange', scheduleUpdate);
    window.addEventListener('pageshow', scheduleUpdate);
    document.querySelectorAll('.project-details').forEach(details => {
        details.addEventListener('toggle', scheduleUpdate);
    });
    if ('ResizeObserver' in window) new ResizeObserver(scheduleUpdate).observe(document.body);
    updateMenu();
})();
