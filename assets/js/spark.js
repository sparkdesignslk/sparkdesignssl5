// ── LOADER
const loader = document.getElementById('loader');
const loaderText = document.getElementById('loaderText');
const loaderBar = document.getElementById('loaderBarFill');
const letters = 'SPARK';
let li = 0, progress = 0;

function scramble(target, final, cb) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*';
  let iter = 0;
  const iv = setInterval(() => {
    loaderText.textContent = final.split('').map((c, i) => {
      if (i < iter) return final[i];
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    iter += 0.4;
    if (iter >= final.length + 1) { clearInterval(iv); loaderText.textContent = final; if(cb) cb(); }
  }, 40);
}

function runLoader() {
  scramble(loaderText, 'SPARK', () => {
    let p = 0;
    const iv = setInterval(() => {
      p += 2;
      loaderBar.style.width = p + '%';
      if (p >= 100) {
        clearInterval(iv);
        setTimeout(() => {
          loader.classList.add('hidden');
          document.body.style.overflow = '';
          startSite();
        }, 300);
      }
    }, 18);
  });
}
document.body.style.overflow = 'hidden';
runLoader();

function startSite() {
  initLiquid();
  initTriangles();
}

// ── CURSOR TRAIL
const trailCanvas = document.getElementById('trailCanvas');
const tCtx = trailCanvas.getContext('2d');
let tw, th;
function resizeTrail() {
  tw = trailCanvas.width = window.innerWidth;
  th = trailCanvas.height = window.innerHeight;
}
resizeTrail();
window.addEventListener('resize', resizeTrail);

const cursorDot = document.getElementById('cursorDot');
let mx = 0, my = 0;
const trail = [];
const TRAIL_LEN = 28;
for (let i = 0; i < TRAIL_LEN; i++) trail.push({ x: 0, y: 0, a: 0 });

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursorDot.style.left = mx + 'px';
  cursorDot.style.top = my + 'px';
});

function animTrail() {
  tCtx.clearRect(0, 0, tw, th);
  trail.unshift({ x: mx, y: my, a: 1 });
  if (trail.length > TRAIL_LEN) trail.pop();
  for (let i = 1; i < trail.length; i++) {
    const t = trail[i], pt = trail[i-1];
    const alpha = (1 - i / TRAIL_LEN) * 0.6;
    const size = (1 - i / TRAIL_LEN) * 4;
    tCtx.beginPath();
    tCtx.moveTo(pt.x, pt.y);
    tCtx.lineTo(t.x, t.y);
    tCtx.strokeStyle = `rgba(220,0,0,${alpha})`;
    tCtx.lineWidth = size;
    tCtx.lineCap = 'round';
    tCtx.shadowColor = '#ff0000';
    tCtx.shadowBlur = 8;
    tCtx.stroke();
  }
  requestAnimationFrame(animTrail);
}
animTrail();

// ── NAV
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60));

// ── HAMBURGER
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => {
  hamburger.classList.remove('open'); mobileMenu.classList.remove('open'); document.body.style.overflow = '';
}));

// ── PARALLAX
window.addEventListener('scroll', () => {
  const hero = document.getElementById('hero');
  const content = hero.querySelector('.hero-content');
  const scattered = hero.querySelector('.hero-scattered');
  const sy = window.scrollY;
  if (content) content.style.transform = `translateY(${sy * 0.25}px)`;
  if (scattered) scattered.style.transform = `translateY(${sy * 0.15}px)`;
});

// ── SCROLL REVEAL
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

// ── TILT CARDS
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 10}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
    card.style.transition = 'transform 0.5s ease';
  });
  card.addEventListener('mouseenter', () => { card.style.transition = 'none'; });
});

// ── LIGHTBOX
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
document.querySelectorAll('.work-card[data-src]').forEach(item => {
  item.addEventListener('click', () => {
    lightboxImg.src = item.dataset.src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});
document.getElementById('lightboxClose').addEventListener('click', closeLB);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLB(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });
function closeLB() { lightbox.classList.remove('open'); document.body.style.overflow = ''; }

// ── WORK FILTERS
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.work-card').forEach(item => {
      item.style.display = (f === 'all' || item.dataset.category === f) ? '' : 'none';
    });
  });
});

// ── CONTACT FORM
const cf = document.getElementById('contactForm');
if (cf) cf.addEventListener('submit', function(e) {
  e.preventDefault();
  cf.style.display = 'none';
  document.getElementById('formSuccess').style.display = 'block';
});

// ── LIQUID BACKGROUND (WebGL)
function initLiquid() {
  const canvas = document.getElementById('liquidCanvas');
  if (!canvas) return;
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener('resize', resize);

  const vert = `
    attribute vec2 a_pos;
    void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
  `;
  const frag = `
    precision mediump float;
    uniform float u_time;
    uniform vec2 u_res;

    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float smoothNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u2 = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(noise(i), noise(i + vec2(1,0)), u2.x),
        mix(noise(i + vec2(0,1)), noise(i + vec2(1,1)), u2.x),
        u2.y
      );
    }

    float fbm(vec2 p) {
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 6; i++) {
        v += a * smoothNoise(p);
        p = p * 2.1 + vec2(1.7, 9.2);
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_res;
      uv.y = 1.0 - uv.y;
      float t = u_time * 0.12;

      vec2 q = vec2(fbm(uv + t), fbm(uv + vec2(1.0, t)));
      vec2 r = vec2(fbm(uv + 3.0*q + vec2(1.7, 9.2) + 0.15*t),
                    fbm(uv + 3.0*q + vec2(8.3, 2.8) + 0.126*t));
      float f = fbm(uv + 3.5 * r);

      // Dark red/black palette - kept very dark
      vec3 col = mix(vec3(0.0, 0.0, 0.0), vec3(0.35, 0.0, 0.0), clamp(f*f*3.0, 0.0, 1.0));
      col = mix(col, vec3(0.6, 0.0, 0.0), clamp(length(q), 0.0, 1.0));
      col = mix(col, vec3(0.1, 0.0, 0.0), clamp(length(r.x), 0.0, 1.0));
      col *= 0.7; // keep it dark

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function compileShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, vert));
  gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uTime = gl.getUniformLocation(prog, 'u_time');
  const uRes = gl.getUniformLocation(prog, 'u_res');
  let start = performance.now();

  function render() {
    const t = (performance.now() - start) / 1000;
    gl.uniform1f(uTime, t);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  }
  render();
}

// ── BLACK TRIANGULAR 3D SHAPES
function initTriangles() {
  drawTri('triCanvasLeft', false);
  drawTri('triCanvasRight', true);
}

function drawTri(id, mirror) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let t = 0;

  function project(x, y, z, cx, cy) {
    const fov = 320;
    const scale = fov / (fov + z + 100);
    return { x: cx + x * scale, y: cy + y * scale, z: z, s: scale };
  }

  function rotX(y, z, a) { return { y: y*Math.cos(a)-z*Math.sin(a), z: y*Math.sin(a)+z*Math.cos(a) }; }
  function rotY(x, z, a) { return { x: x*Math.cos(a)-z*Math.sin(a), z: x*Math.sin(a)+z*Math.cos(a) }; }
  function rotZ(x, y, a) { return { x: x*Math.cos(a)-y*Math.sin(a), y: x*Math.sin(a)+y*Math.cos(a) }; }

  function transformPt(px, py, pz, rx, ry, rz) {
    let v = { x: px, y: py, z: pz };
    let r1 = rotX(v.y, v.z, rx); v.y = r1.y; v.z = r1.z;
    let r2 = rotY(v.x, v.z, ry); v.x = r2.x; v.z = r2.z;
    let r3 = rotZ(v.x, v.y, rz); v.x = r3.x; v.y = r3.y;
    return v;
  }

  // Draw a triangular prism
  function drawTriPrism(cx, cy, size, rx, ry, rz) {
    const s = size;
    const h = size * 2.2;
    // 3 vertices of triangle cross-section, extruded
    const triPts = [
      [0, -s, 0],
      [s * 0.866, s * 0.5, 0],
      [-s * 0.866, s * 0.5, 0]
    ];
    // front face z=-h/2, back face z=h/2
    const verts = [
      ...triPts.map(([x,y,z]) => transformPt(x, y, -h/2, rx, ry, rz)),
      ...triPts.map(([x,y,z]) => transformPt(x, y,  h/2, rx, ry, rz))
    ].map(v => project(v.x, v.y, v.z, cx, cy));

    // Faces: front(0,1,2), back(3,4,5), sides
    const faces = [
      { idx: [0,1,2], norm: 1.0 },
      { idx: [3,5,4], norm: 0.5 },
      { idx: [0,1,4,3], norm: 0.75 },
      { idx: [1,2,5,4], norm: 0.6 },
      { idx: [2,0,3,5], norm: 0.85 }
    ];

    // Sort by average z
    faces.sort((a, b) => {
      const za = a.idx.reduce((s,i) => s + verts[i].z, 0) / a.idx.length;
      const zb = b.idx.reduce((s,i) => s + verts[i].z, 0) / b.idx.length;
      return za - zb;
    });

    faces.forEach(({ idx, norm }) => {
      ctx.beginPath();
      ctx.moveTo(verts[idx[0]].x, verts[idx[0]].y);
      for (let i = 1; i < idx.length; i++) ctx.lineTo(verts[idx[i]].x, verts[idx[i]].y);
      ctx.closePath();

      // Jet black with subtle red neon rim
      const dark = Math.floor(norm * 18);
      const g = ctx.createLinearGradient(
        verts[idx[0]].x, verts[idx[0]].y,
        verts[idx[Math.floor(idx.length/2)]].x, verts[idx[Math.floor(idx.length/2)]].y
      );
      g.addColorStop(0, `rgba(${dark+4},${dark},${dark},0.97)`);
      g.addColorStop(0.5, `rgba(${dark},${dark},${dark},0.95)`);
      g.addColorStop(1, `rgba(${dark+8},${dark},${dark+2},0.97)`);
      ctx.fillStyle = g;
      ctx.fill();

      // Red neon rim light
      ctx.strokeStyle = `rgba(180,0,0,${norm * 0.35})`;
      ctx.lineWidth = 0.8;
      ctx.shadowColor = '#cc0000';
      ctx.shadowBlur = norm > 0.7 ? 8 : 4;
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
  }

  // Draw a tetrahedron
  function drawTetra(cx, cy, size, rx, ry, rz) {
    const s = size;
    const rawVerts = [
      [0, -s, 0],
      [s*0.816, s*0.333, s*0.471],
      [-s*0.816, s*0.333, s*0.471],
      [0, s*0.333, -s*0.943]
    ];
    const verts = rawVerts.map(([x,y,z]) => {
      const v = transformPt(x, y, z, rx, ry, rz);
      return project(v.x, v.y, v.z, cx, cy);
    });
    const faces = [
      { idx:[0,1,2], n:0.9 },
      { idx:[0,1,3], n:0.65 },
      { idx:[0,2,3], n:0.75 },
      { idx:[1,2,3], n:0.5 }
    ];
    faces.sort((a,b) => {
      const za = a.idx.reduce((s,i)=>s+verts[i].z,0)/3;
      const zb = b.idx.reduce((s,i)=>s+verts[i].z,0)/3;
      return za - zb;
    });
    faces.forEach(({idx, n}) => {
      ctx.beginPath();
      ctx.moveTo(verts[idx[0]].x, verts[idx[0]].y);
      ctx.lineTo(verts[idx[1]].x, verts[idx[1]].y);
      ctx.lineTo(verts[idx[2]].x, verts[idx[2]].y);
      ctx.closePath();
      const d = Math.floor(n * 15);
      ctx.fillStyle = `rgba(${d+3},${d},${d},0.97)`;
      ctx.fill();
      ctx.strokeStyle = `rgba(160,0,0,${n * 0.4})`;
      ctx.lineWidth = 0.7;
      ctx.shadowColor = '#bb0000';
      ctx.shadowBlur = n > 0.7 ? 10 : 5;
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    t += 0.006;
    const m = mirror ? -1 : 1;

    // Top: triangular prism
    drawTriPrism(W/2, H * 0.2, 42,
      t * 0.5,
      t * 0.8 * m,
      t * 0.3
    );

    // Middle: tetrahedron
    drawTetra(W/2, H * 0.5, 52,
      t * 0.7,
      t * 1.0 * m,
      t * -0.4
    );

    // Bottom: smaller prism
    drawTriPrism(W/2, H * 0.8, 30,
      t * -0.6,
      t * 0.9 * m,
      t * 0.5
    );

    requestAnimationFrame(frame);
  }
  frame();
}
