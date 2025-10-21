document.addEventListener('DOMContentLoaded', function () {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Standard Page Interactivity ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            const expanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', String(!expanded));
            mobileMenu.classList.toggle('hidden');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => { mobileMenu.classList.add('hidden'); });
        });
    }

    // --- Scroll Fade-in Animation ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    if (!prefersReducedMotion) {
        document.querySelectorAll('.fade-in-section').forEach(section => observer.observe(section));
    } else {
        document.querySelectorAll('.fade-in-section').forEach(section => section.classList.add('is-visible'));
    }

    // --- Magnetic Buttons ---
    if (!prefersReducedMotion) {
        document.querySelectorAll('[data-magnetic]').forEach(el => {
            el.addEventListener('mousemove', function(e) {
                const pos = el.getBoundingClientRect();
                const x = e.clientX - pos.left - pos.width / 2;
                const y = e.clientY - pos.top - pos.height / 2;
                el.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
            });
            el.addEventListener('mouseout', function() { el.style.transform = 'translate(0, 0)'; });
        });
    }

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;
    function applyTheme(theme) {
        if (theme === 'light') {
            root.classList.add('light');
            themeToggle?.setAttribute('aria-pressed', 'true');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            document.getElementById('meta-theme-color')?.setAttribute('content', '#f6f8fa');
        } else {
            root.classList.remove('light');
            themeToggle?.setAttribute('aria-pressed', 'false');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            document.getElementById('meta-theme-color')?.setAttribute('content', '#000000');
        }
    }
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) applyTheme(storedTheme);
    themeToggle?.addEventListener('click', () => {
        const newTheme = root.classList.contains('light') ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- Background Toggle (WebGL On/Off) ---
    const bgToggle = document.getElementById('bg-toggle');
    let bgEnabled = localStorage.getItem('bg-enabled');
    if (bgEnabled === null) { bgEnabled = prefersReducedMotion ? 'false' : 'true'; }

    // --- WebGL Liquid Glass Simulation ---
    const canvas = document.getElementById('liquid-canvas');
    const vertexShaderSource = `
        attribute vec2 a_position;
        void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;

    const fragmentShaderSource = `
        precision highp float;
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform vec2 u_mouse;

        float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }
        float noise(vec2 st) {
            vec2 i = floor(st); vec2 f = fract(st);
            float a = random(i); float b = random(i + vec2(1.0, 0.0));
            float c = random(i + vec2(0.0, 1.0)); float d = random(i + vec2(1.0, 1.0));
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }
        #define OCTAVES 4
        float fbm(vec2 st) {
            float value = 0.0; float amplitude = 0.5;
            for (int i = 0; i < OCTAVES; i++) {
                value += amplitude * noise(st);
                st *= 2.; amplitude *= 0.5;
            }
            return value;
        }

        void main() {
            vec2 st = gl_FragCoord.xy / u_resolution.xy;
            st.x *= u_resolution.x / u_resolution.y;
            vec2 mouse = u_mouse / u_resolution;
            float mouse_dist = distance(st, mouse);
            float f = fbm(st * 2.0 - vec2(u_time * 0.05));
            f *= 10.0;
            f += u_time * 0.1;
            f += mouse_dist * -0.5 + 0.5;
            f = fract(f);
            float liquid = smoothstep(0.4, 0.5, f) - smoothstep(0.5, 0.6, f);
            float vignette = 1.0 - length(gl_FragCoord.xy / u_resolution.xy - 0.5) * 0.8;
            liquid *= vignette;
            gl_FragColor = vec4(vec3(liquid), 1.0);
        }
    `;

    const bgState = {
        gl: null,
        program: null,
        animationId: null,
        mouseHandler: null,
        resizeHandler: null,
        positionBuffer: null,
        time: 0,
        mousePos: { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    };

    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile error: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    function createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error: ' + gl.getProgramInfoLog(program));
            return null;
        }
        return program;
    }

    function startBackground() {
        if (!canvas || bgState.animationId !== null || bgState.gl) return;
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
            console.error('WebGL is not supported.');
            return;
        }

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        if (!vertexShader) return;
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        if (!fragmentShader) {
            gl.deleteShader(vertexShader);
            return;
        }

        const program = createProgram(gl, vertexShader, fragmentShader);
        if (!program) {
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            return;
        }
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);

        const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
        const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
        const timeUniformLocation = gl.getUniformLocation(program, 'u_time');
        const mouseUniformLocation = gl.getUniformLocation(program, 'u_mouse');

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
            -1,  1,
             1, -1,
             1,  1,
        ]), gl.STATIC_DRAW);

        const resize = (force = false) => {
            const displayWidth = window.innerWidth;
            const displayHeight = window.innerHeight;
            if (force || canvas.width !== displayWidth || canvas.height !== displayHeight) {
                canvas.width = displayWidth;
                canvas.height = displayHeight;
                gl.viewport(0, 0, canvas.width, canvas.height);
            }
        };

        const render = () => {
            if (!bgState.gl) return;
            resize();
            gl.useProgram(program);
            gl.enableVertexAttribArray(positionAttributeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
            bgState.time += 0.01;
            gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
            gl.uniform1f(timeUniformLocation, bgState.time);
            gl.uniform2f(mouseUniformLocation, bgState.mousePos.x, canvas.height - bgState.mousePos.y);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            bgState.animationId = requestAnimationFrame(render);
        };

        resize(true);
        bgState.gl = gl;
        bgState.program = program;
        bgState.positionBuffer = positionBuffer;
        bgState.time = 0;
        bgState.mousePos.x = window.innerWidth / 2;
        bgState.mousePos.y = window.innerHeight / 2;
        canvas.dataset.initialized = 'true';

        bgState.mouseHandler = (e) => {
            bgState.mousePos.x = e.clientX;
            bgState.mousePos.y = e.clientY;
        };
        window.addEventListener('mousemove', bgState.mouseHandler);

        bgState.resizeHandler = () => resize();
        window.addEventListener('resize', bgState.resizeHandler);

        render();
    }

    function stopBackground() {
        if (!bgState.gl) return;
        if (bgState.animationId !== null) {
            cancelAnimationFrame(bgState.animationId);
            bgState.animationId = null;
        }
        if (bgState.mouseHandler) {
            window.removeEventListener('mousemove', bgState.mouseHandler);
            bgState.mouseHandler = null;
        }
        if (bgState.resizeHandler) {
            window.removeEventListener('resize', bgState.resizeHandler);
            bgState.resizeHandler = null;
        }
        const gl = bgState.gl;
        if (bgState.positionBuffer) {
            gl.deleteBuffer(bgState.positionBuffer);
        }
        if (bgState.program) {
            gl.deleteProgram(bgState.program);
        }
        bgState.gl = null;
        bgState.program = null;
        bgState.positionBuffer = null;
        bgState.time = 0;
        canvas.removeAttribute('data-initialized');
    }

    function applyBgState(enabled) {
        if (enabled === 'true') {
            document.documentElement.classList.remove('no-bg');
            bgToggle?.setAttribute('aria-pressed', 'true');
            bgToggle && (bgToggle.innerHTML = '<i class="fas fa-water"></i>');
            startBackground();
        } else {
            document.documentElement.classList.add('no-bg');
            bgToggle?.setAttribute('aria-pressed', 'false');
            bgToggle && (bgToggle.innerHTML = '<i class="fas fa-ban"></i>');
            stopBackground();
        }
    }

    applyBgState(bgEnabled);

    bgToggle?.addEventListener('click', () => {
        bgEnabled = (bgEnabled === 'true') ? 'false' : 'true';
        localStorage.setItem('bg-enabled', bgEnabled);
        applyBgState(bgEnabled);
    });

    // --- Dynamic Year ---
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // --- Simple Client-side Validation Enhancement ---
    const contactForm = document.querySelector('form[action*="formspree"]');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const name = contactForm.querySelector('#contact-name');
            const email = contactForm.querySelector('#contact-email');
            const message = contactForm.querySelector('#contact-message');
            let valid = true;
            [name, email, message].forEach(field => {
                if (!field.value.trim()) {
                    field.setAttribute('aria-invalid', 'true');
                    field.classList.add('ring-2', 'ring-red-500');
                    valid = false;
                } else {
                    field.removeAttribute('aria-invalid');
                    field.classList.remove('ring-2', 'ring-red-500');
                }
            });
            if (!valid) {
                e.preventDefault();
            }
        });
    }

    // --- Data Driven Projects ---
    const projectsGrid = document.getElementById('projects-grid');
    const filtersBar = document.getElementById('project-filters');
    let activeFilter = 'All';
    let projectData = [];

    function createProjectCard(p) {
        const card = document.createElement('article');
        card.className = 'glass-card-dark rounded-xl overflow-hidden flex flex-col';
        card.setAttribute('data-tech', p.tech.join(','));
        // Build optional action buttons for the project.
        const actions = [];
        if (p.links?.demo) {
            actions.push(`<a href="${p.links.demo}" target="_blank" rel="noopener noreferrer" class="project-btn bg-white hover:bg-gray-200 text-black" aria-label="Open live demo for ${p.name}">Live</a>`);
        }
        if (p.links?.code) {
            actions.push(`<a href="${p.links.code}" target="_blank" rel="noopener noreferrer" class="project-btn bg-black/40 border border-white/10 text-white hover:bg-black/60" aria-label="Open source code for ${p.name}">Code</a>`);
        }
        if (p.links?.form) {
            actions.push(`<a href="${p.links.form}" target="_blank" rel="noopener noreferrer" class="project-btn bg-purple-600/80 hover:bg-purple-600 text-white" aria-label="Open form for ${p.name}">Form</a>`);
        }
        const actionsMarkup = actions.join('');
        card.innerHTML = `
            <div class="relative w-full h-48 overflow-hidden bg-black">
                <img src="${p.image}" alt="${p.name} preview" class="w-full h-48 object-cover" loading="lazy" decoding="async" />
                ${p.highlight ? '<span class="absolute top-2 left-2 bg-purple-600/80 text-xs px-2 py-1 rounded-full">Featured</span>' : ''}
            </div>
            <div class="p-6 flex flex-col flex-1">
                <h3 class="text-xl font-semibold mb-2">${p.name}</h3>
                <p class="text-gray-400 mb-4 text-sm flex-1">${p.description}</p>
                <div class="flex flex-wrap gap-2 mb-6">${p.tech.map(t=>`<span class="tech-tag">${t}</span>`).join('')}</div>
                <div class="flex space-x-3 mt-auto">${actionsMarkup}</div>
            </div>`;
        return card;
    }

    function renderProjects() {
        if (!projectsGrid) return;
        projectsGrid.setAttribute('aria-busy', 'true');
        projectsGrid.innerHTML = '';
        let list = [...projectData];
        if (activeFilter !== 'All') {
            list = list.filter(p => p.tech.includes(activeFilter));
        }
        if (list.length === 0) {
            projectsGrid.innerHTML = '<p class="text-gray-400 col-span-full text-center text-sm">No projects match this filter.</p>';
        } else {
            list.forEach(p => projectsGrid.appendChild(createProjectCard(p)));
        }
        projectsGrid.setAttribute('aria-busy', 'false');
    }

    function renderFilters() {
        if (!filtersBar) return;
        const techSet = new Set();
        projectData.forEach(p => p.tech.forEach(t => techSet.add(t)));
        const allTech = ['All', ...Array.from(techSet).sort()];
        filtersBar.innerHTML = '';
        allTech.forEach(t => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'px-3 py-1 rounded-full text-xs font-semibold border border-white/10 bg-black/30 hover:border-purple-500 transition-colors ' + (t===activeFilter ? 'bg-purple-600 text-white border-purple-500' : 'text-gray-300');
            btn.textContent = t;
            btn.setAttribute('aria-pressed', String(t===activeFilter));
            btn.addEventListener('click', () => {
                activeFilter = t;
                renderFilters();
                renderProjects();
            });
            filtersBar.appendChild(btn);
        });
    }

    async function loadProjects() {
        try {
            const res = await fetch('projects.json', { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to load projects');
            projectData = await res.json();
            renderFilters();
            renderProjects();
        } catch (e) {
            if (projectsGrid) {
                projectsGrid.innerHTML = '<p class="text-red-400 text-sm">Failed to load projects data.</p>';
                projectsGrid.setAttribute('aria-busy', 'false');
            }
            console.error(e);
        }
    }
    if (projectsGrid) loadProjects();

    // --- Service Worker Registration ---
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(console.error);
    }

    // --- Dynamic Skills ---
    const skillsGrid = document.getElementById('skills-grid');
    async function loadSkills() {
        if (!skillsGrid) return;
        try {
            const res = await fetch('skills.json', { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to load skills');
            const data = await res.json();
            skillsGrid.innerHTML = '';
            Object.entries(data).forEach(([category, items]) => {
                const card = document.createElement('div');
                card.className = 'glass-card-dark p-6';
                card.innerHTML = `<h3 class="text-xl font-semibold mb-4">${category}</h3><div class="flex flex-wrap gap-4">${items.map(i=>`<span class=\"tech-tag\">${i}</span>`).join('')}</div>`;
                skillsGrid.appendChild(card);
            });
            skillsGrid.setAttribute('aria-busy', 'false');
        } catch (err) {
            console.error(err);
            skillsGrid.innerHTML = '<p class="text-red-400 text-sm">Failed to load skills.</p>';
            skillsGrid.setAttribute('aria-busy', 'false');
        }
    }
    loadSkills();

    // Future: dynamic skills (placeholder for smooth extension)
    // fetch('skills.json').then(r=>r.json()).then(data => { /* render if desired */ }).catch(()=>{});
});
