document.addEventListener('DOMContentLoaded', function () {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Standard Page Interactivity ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            const expanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', String(!expanded));
            mobileMenu.classList.toggle('hidden');
        });
    }
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => { mobileMenu.classList.add('hidden'); });
    });

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
    if (bgEnabled === null) { bgEnabled = 'true'; }
    function applyBgState(enabled) {
        if (enabled === 'true') {
            document.documentElement.classList.remove('no-bg');
            bgToggle?.setAttribute('aria-pressed', 'true');
            bgToggle && (bgToggle.innerHTML = '<i class="fas fa-water"></i>');
        } else {
            document.documentElement.classList.add('no-bg');
            bgToggle?.setAttribute('aria-pressed', 'false');
            bgToggle && (bgToggle.innerHTML = '<i class="fas fa-ban"></i>');
        }
    }
    applyBgState(bgEnabled);
    bgToggle?.addEventListener('click', () => {
        bgEnabled = (bgEnabled === 'true') ? 'false' : 'true';
        localStorage.setItem('bg-enabled', bgEnabled);
        applyBgState(bgEnabled);
    });

    // --- WebGL Liquid Glass Simulation ---

    // Shader code is now directly inside the JavaScript
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

    const canvas = document.getElementById('liquid-canvas');
    if (canvas && bgEnabled === 'true') {
        const gl = canvas.getContext('webgl');

        if (!gl) {
            console.error("WebGL is not supported.");
        } else {
            let time = 0;
            let mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

            function createShader(gl, type, source) {
                const shader = gl.createShader(type);
                gl.shaderSource(shader, source);
                gl.compileShader(shader);
                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    console.error('Shader compile error: ' + gl.getShaderInfoLog(shader));
                    gl.deleteShader(shader); return null;
                } return shader;
            }

            function createProgram(gl, vertexShader, fragmentShader) {
                const program = gl.createProgram();
                gl.attachShader(program, vertexShader);
                gl.attachShader(program, fragmentShader);
                gl.linkProgram(program);
                if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                    console.error('Program link error: ' + gl.getProgramInfoLog(program));
                    return null;
                } return program;
            }

            const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
            const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
            const program = createProgram(gl, vertexShader, fragmentShader);

            const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
            const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
            const timeUniformLocation = gl.getUniformLocation(program, "u_time");
            const mouseUniformLocation = gl.getUniformLocation(program, "u_mouse");
            
            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,]), gl.STATIC_DRAW);

            function render() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
                gl.useProgram(program);
                gl.enableVertexAttribArray(positionAttributeLocation);
                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
                time += 0.01;
                gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
                gl.uniform1f(timeUniformLocation, time);
                gl.uniform2f(mouseUniformLocation, mousePos.x, gl.canvas.height - mousePos.y);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
                requestAnimationFrame(render);
            }
            
            window.addEventListener('mousemove', e => {
                mousePos.x = e.clientX;
                mousePos.y = e.clientY;
            });

            if (bgEnabled === 'true') { render(); }
        }
    }

    // Re-run background init if toggled back on (simple approach: reload)
    bgToggle?.addEventListener('click', () => {
        if (bgEnabled === 'true' && !canvas.hasAttribute('data-initialized')) {
            // simplest: reload to re-init GL (keeps code small)
            location.reload();
        }
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
});
