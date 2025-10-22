document.addEventListener('DOMContentLoaded', function () {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    const fallbackBase = `${window.location.origin}${window.location.pathname.replace(/index\.html?$/, '')}`;
    const rawBaseUrl = canonicalLink?.href ?? fallbackBase;
    const siteBaseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl : `${rawBaseUrl}/`;
    const resolveToAbsolute = (path) => {
        if (!path) return siteBaseUrl;
        try {
            return new URL(path, siteBaseUrl).href;
        } catch (err) {
            console.warn('Failed to resolve URL for schema.org data', err);
            return path;
        }
    };
    const PROJECT_SCHEMA_ID = 'project-schema';

    const escapeHtml = (value) => {
        if (typeof value !== 'string') {
            return '';
        }
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return value.replace(/[&<>"']/g, (char) => map[char]);
    };

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
    const fadeSections = document.querySelectorAll('.fade-in-section');
    if (!prefersReducedMotion) {
        fadeSections.forEach(section => observer.observe(section));
    } else {
        fadeSections.forEach(section => section.classList.add('is-visible'));
    }

    // --- Magnetic Buttons ---
    if (!prefersReducedMotion) {
        document.querySelectorAll('[data-magnetic]').forEach(el => {
            const resetTransform = () => { el.style.transform = 'translate(0, 0)'; };
            el.addEventListener('mousemove', (event) => {
                const pos = el.getBoundingClientRect();
                const x = event.clientX - pos.left - pos.width / 2;
                const y = event.clientY - pos.top - pos.height / 2;
                el.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
            });
            ['mouseout', 'mouseleave', 'blur', 'touchend'].forEach(evt => el.addEventListener(evt, resetTransform));
        });
    }

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;
    const metaThemeColor = document.getElementById('meta-theme-color');
    function applyTheme(theme) {
        if (theme === 'light') {
            root.classList.add('light');
            themeToggle?.setAttribute('aria-pressed', 'true');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            metaThemeColor?.setAttribute('content', '#f6f8fa');
        } else {
            root.classList.remove('light');
            themeToggle?.setAttribute('aria-pressed', 'false');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            metaThemeColor?.setAttribute('content', '#000000');
        }
    }
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
        applyTheme(storedTheme);
    }
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
        const fields = ['#contact-name', '#contact-email', '#contact-message']
            .map(selector => contactForm.querySelector(selector))
            .filter(Boolean);

        const markInvalid = (field) => {
            field.setAttribute('aria-invalid', 'true');
            field.classList.add('ring-2', 'ring-red-500');
        };

        const clearInvalid = (field) => {
            field.removeAttribute('aria-invalid');
            field.classList.remove('ring-2', 'ring-red-500');
        };

        fields.forEach(field => {
            field.addEventListener('input', () => {
                if (field.value.trim()) {
                    clearInvalid(field);
                }
            });
            field.addEventListener('blur', () => {
                if (field.value.trim()) {
                    clearInvalid(field);
                }
            });
        });

        contactForm.addEventListener('submit', (e) => {
            let valid = true;
            fields.forEach(field => {
                if (!field.value.trim()) {
                    markInvalid(field);
                    valid = false;
                } else {
                    clearInvalid(field);
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
        const techList = Array.isArray(p.tech) ? p.tech : [];
        if (techList.length) {
            card.setAttribute('data-tech', techList.join(','));
        }

        const safeName = escapeHtml(p.name || 'Portfolio project');
        const safeDescription = escapeHtml(p.description || '');
        const safeTags = techList.map(tag => `<span class="tech-tag">${escapeHtml(tag)}</span>`).join('');
        const previewImage = p.image || 'assets/images/vojta-novak.png';

        const actions = [];
        if (p.links?.demo) {
            actions.push(`<a href="${p.links.demo}" target="_blank" rel="noopener noreferrer" class="project-btn bg-white hover:bg-gray-200 text-black" aria-label="Open live demo for ${safeName}">Live</a>`);
        }
        if (p.links?.code) {
            actions.push(`<a href="${p.links.code}" target="_blank" rel="noopener noreferrer" class="project-btn bg-black/40 border border-white/10 text-white hover:bg-black/60" aria-label="Open source code for ${safeName}">Code</a>`);
        }
        if (p.links?.form) {
            actions.push(`<a href="${p.links.form}" target="_blank" rel="noopener noreferrer" class="project-btn bg-purple-600/80 hover:bg-purple-600 text-white" aria-label="Open form for ${safeName}">Form</a>`);
        }
        const actionsMarkup = actions.join('');

        card.innerHTML = `
            <div class="relative w-full h-48 overflow-hidden bg-black">
                <img src="${previewImage}" alt="${safeName} preview" class="w-full h-48 object-cover" loading="lazy" decoding="async" />
                ${p.highlight ? '<span class="absolute top-2 left-2 bg-purple-600/80 text-xs px-2 py-1 rounded-full">Featured</span>' : ''}
            </div>
            <div class="p-6 flex flex-col flex-1">
                <h3 class="text-xl font-semibold mb-2">${safeName}</h3>
                <p class="text-gray-400 mb-4 text-sm flex-1">${safeDescription}</p>
                <div class="flex flex-wrap gap-2 mb-6">${safeTags}</div>
                <div class="flex space-x-3 mt-auto">${actionsMarkup}</div>
            </div>`;
        return card;
    }

    function injectProjectSchema(projects) {
        const existing = document.getElementById(PROJECT_SCHEMA_ID);
        if (existing) existing.remove();
        if (!Array.isArray(projects) || projects.length === 0) return;

        const itemList = {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Vojta Novák Portfolio Projects',
            description: 'Selected software and web development projects by Vojta Novák.',
            url: `${siteBaseUrl}#projects`,
            itemListElement: projects.map((p, index) => {
                const hasDemo = p.links?.demo && p.links.demo !== '#';
                const projectUrl = hasDemo ? resolveToAbsolute(p.links.demo) : `${siteBaseUrl}#projects`;
                const item = {
                    '@type': 'CreativeWork',
                    name: p.name,
                    description: p.description,
                    url: projectUrl
                };
                if (p.image) {
                    item.image = resolveToAbsolute(p.image);
                }
                if (Array.isArray(p.tech) && p.tech.length) {
                    item.keywords = p.tech.join(', ');
                }
                return {
                    '@type': 'ListItem',
                    position: index + 1,
                    url: projectUrl,
                    item
                };
            })
        };

        const schemaScript = document.createElement('script');
        schemaScript.type = 'application/ld+json';
        schemaScript.id = PROJECT_SCHEMA_ID;
        schemaScript.textContent = JSON.stringify(itemList);
        document.head.appendChild(schemaScript);
    }

    function renderProjects() {
        if (!projectsGrid) return;
        projectsGrid.setAttribute('aria-busy', 'true');
        projectsGrid.innerHTML = '';
        const filterMatches = projectData.filter(project => {
            if (activeFilter === 'All') {
                return true;
            }
            const techList = Array.isArray(project.tech) ? project.tech : [];
            return techList.includes(activeFilter);
        });

        if (!projectData.length) {
            projectsGrid.innerHTML = '<p class="text-gray-400 col-span-full text-center text-sm">Projects will be published soon.</p>';
        } else if (!filterMatches.length) {
            projectsGrid.innerHTML = '<p class="text-gray-400 col-span-full text-center text-sm">No projects match this filter.</p>';
        } else {
            filterMatches.forEach(project => projectsGrid.appendChild(createProjectCard(project)));
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
            btn.setAttribute('aria-pressed', t === activeFilter ? 'true' : 'false');
            btn.addEventListener('click', () => {
                activeFilter = t;
                renderFilters();
                renderProjects();
            });
            filtersBar.appendChild(btn);
        });
    }

    async function loadProjects() {
        projectsGrid?.setAttribute('aria-busy', 'true');
        try {
            const res = await fetch('assets/data/projects.json', { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to load projects');
            projectData = await res.json();
            if (!Array.isArray(projectData)) {
                projectData = [];
            }
            renderFilters();
            renderProjects();
            injectProjectSchema(projectData);
        } catch (e) {
            projectData = [];
            activeFilter = 'All';
            if (projectsGrid) {
                projectsGrid.innerHTML = '<p class="text-red-400 text-sm">Failed to load projects data.</p>';
                projectsGrid.setAttribute('aria-busy', 'false');
            }
            if (filtersBar) {
                filtersBar.innerHTML = '';
            }
            console.error(e);
        }
    }
    if (projectsGrid) loadProjects();

    // --- Service Worker Registration ---
    if ('serviceWorker' in navigator) {
        void navigator.serviceWorker.register('sw.js').catch(console.error);
    }

    // --- Dynamic Skills ---
    const skillsGrid = document.getElementById('skills-grid');
    async function loadSkills() {
        if (!skillsGrid) return;
        skillsGrid.setAttribute('aria-busy', 'true');
        try {
            const res = await fetch('assets/data/skills.json', { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to load skills');
            const data = await res.json();
            const groups = data && typeof data === 'object' ? Object.entries(data) : [];
            skillsGrid.innerHTML = '';

            if (!groups.length) {
                skillsGrid.innerHTML = '<p class="text-gray-400 text-sm">No skills to display right now.</p>';
                return;
            }

            groups.forEach(([category, items]) => {
                const techList = Array.isArray(items) ? items : [];
                const card = document.createElement('div');
                card.className = 'glass-card-dark p-6';
                card.innerHTML = `
                    <h3 class="text-xl font-semibold mb-4">${escapeHtml(category)}</h3>
                    <div class="flex flex-wrap gap-4">${techList.map(skill => `<span class="tech-tag">${escapeHtml(skill)}</span>`).join('')}</div>
                `;
                skillsGrid.appendChild(card);
            });
        } catch (err) {
            console.error(err);
            skillsGrid.innerHTML = '<p class="text-red-400 text-sm">Failed to load skills.</p>';
        } finally {
            skillsGrid.setAttribute('aria-busy', 'false');
        }
    }
    loadSkills();
});
