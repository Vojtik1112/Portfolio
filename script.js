// --- Standard Page Interactivity ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => { mobileMenu.classList.toggle('hidden'); });

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

document.querySelectorAll('.fade-in-section').forEach(section => observer.observe(section));

// --- Magnetic Buttons ---
document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', function(e) {
        const pos = el.getBoundingClientRect();
        const x = e.clientX - pos.left - pos.width / 2;
        const y = e.clientY - pos.top - pos.height / 2;
        el.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
    });
    el.addEventListener('mouseout', function() {
        el.style.transform = 'translate(0, 0)';
    });
});

// --- WebGL Liquid Glass Simulation ---
const canvas = document.getElementById('liquid-canvas');
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

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, document.getElementById('vertex-shader').textContent);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, document.getElementById('fragment-shader').textContent);
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

    render();
}
