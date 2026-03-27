// ==================== GLOBAL CONFIG ====================
const events = [
    {
        id: '000 . 001',
        name: 'CodeSprint',
        tags: ['Competitive Coding', '24hr Hackathon'],
        description: 'Our flagship annual hackathon. Participants race to solve algorithmic challenges and build systems-level programs in pure C. 24 hours, no sleep, pure code.'
    },
    {
        id: '000 . 010',
        name: 'Pointer Workshop',
        tags: ['Workshop', 'Memory Management'],
        description: 'A deep-dive hands-on session covering pointers, pointer arithmetic, arrays, structs, and dynamic memory allocation with malloc/free. Beginners welcome.'
    },
    {
        id: '000 . 011',
        name: 'Debug Wars',
        tags: ['Contest', 'Debugging'],
        description: 'We plant the bugs. You find them. A timed debugging competition where speed and precision are everything. The fastest debugger wins.'
    },
    {
        id: '000 . 100',
        name: 'Systems Day',
        tags: ['Seminar', 'OS Concepts'],
        description: 'Expert talks and demos on how C powers operating systems, file systems, and embedded hardware. See the invisible layer that runs your world.'
    }
];

const members = [
    { initials: 'AK', name: 'Alex K', role: 'Club Lead' },
    { initials: 'SR', name: 'Sam R', role: 'Technical Head' },
    { initials: 'PM', name: 'Priya M', role: 'Events Head' },
    { initials: 'DS', name: 'Dev S', role: 'Workshop Lead' },
    { initials: 'AT', name: 'Anu T', role: 'Outreach Lead' }
];

let soundEnabled = true;
let loadingComplete = false;

// ==================== TYPEWRITER EFFECT ====================
async function typewriterLine(element, text, speed = 40, delay = 0) {
    return new Promise(resolve => {
        setTimeout(() => {
            let index = 0;
            const interval = setInterval(() => {
                if (index < text.length) {
                    element.textContent += text.charAt(index);
                    index++;
                } else {
                    clearInterval(interval);
                    resolve();
                }
            }, speed);
        }, delay);
    });
}

// ==================== LOADING SCREEN ====================
async function initLoadingScreen() {
    return new Promise(async resolve => {
        const line1 = document.getElementById('loadLine1');
        const line2 = document.getElementById('loadLine2');
        const launchBtn = document.getElementById('launchBtn');
        const loading = document.getElementById('loadingScreen');

        await typewriterLine(line1, '> run c_club.exe', 40, 200);
        await typewriterLine(line2, '> load club.core...100% █', 40, 400);

        document.getElementById('bootCursor').style.animation = 'blink 0.6s infinite';

        // Add click handler to launch button
        launchBtn.addEventListener('click', () => {
            loading.classList.add('hidden');
            loadingComplete = true;
            setTimeout(() => {
                loading.style.display = 'none';
                initHeroTerminal();
                resolve();
            }, 800);
        });
    });
}

// ==================== HERO TERMINAL ====================
async function initHeroTerminal() {
    const bootLines = [
        '> boot_sequence: c_club.init',
        '> user: student.member()',
        '> role_detected: programmer.learner',
        '> permissions_granted: code.compile.run',
        '> user_profile: systems.level.coder'
    ];

    for (let i = 0; i < bootLines.length; i++) {
        const lineEl = document.getElementById(`bootLine${i + 1}`);
        await typewriterLine(lineEl, bootLines[i], 40, 350 * i);
    }

    document.getElementById('bootCursor').style.animation = 'blink 0.6s infinite';
}

// ==================== GLITCH EFFECT ====================
function initGlitchEffect() {
    const labels = [
        { el: document.getElementById('roleLabel1'), text: 'C PROGRAMMER' },
        { el: document.getElementById('roleLabel2'), text: 'CODE ENTHUSIAST' },
        { el: document.getElementById('roleLabel3'), text: 'SYSTEMS THINKER' },
        { el: document.getElementById('roleLabel4'), text: 'PROBLEM SOLVER' }
    ];

    const glitchChars = '!@#$%^&*<>[]{}|';

    labels.forEach((label, idx) => {
        setInterval(() => {
            let temp = label.text;
            const glitchDuration = 5;
            let glitchCount = 0;

            const glitchInterval = setInterval(() => {
                if (glitchCount < glitchDuration) {
                    temp = label.text
                        .split('')
                        .map(() => glitchChars[Math.floor(Math.random() * glitchChars.length)])
                        .join('');
                    label.el.textContent = temp;
                    glitchCount++;
                } else {
                    label.el.textContent = label.text;
                    clearInterval(glitchInterval);
                }
            }, 60);
        }, 2500 + idx * 300);
    });
}

// ==================== CLOCK UPDATE ====================
function updateClock() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    document.getElementById('hudClock').textContent = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);
updateClock();

// ==================== SOUND TOGGLE ====================
document.getElementById('navSound').addEventListener('click', (e) => {
    e.preventDefault();
    soundEnabled = !soundEnabled;
    const text = soundEnabled ? '> sound.on()' : '> sound.off()';
    document.getElementById('navSound').textContent = text;
});

// ==================== TERMINAL OBSERVER ====================
function setupTerminalObserver() {
    const options = { threshold: 0.3 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.typed) {
                entry.target.dataset.typed = 'true';
                const lines = entry.target.querySelectorAll('.terminal-line');
                lines.forEach((line, idx) => {
                    const text = line.textContent || '> boot_sequence: ...';
                    line.textContent = '';
                    typewriterLine(line, text, 40, 350 * idx);
                });
            }
        });
    }, options);

    document.querySelectorAll('.terminal-block').forEach(terminal => {
        observer.observe(terminal);
    });
}

// ==================== 3D EVENTS SECTION ====================
let eventsScene, eventsCamera, eventsRenderer, eventsMesh, eventCards = [];
let selectedCard = null;

function initEventsScene() {
    const canvas = document.getElementById('eventsCanvas');
    const container = document.getElementById('events');

    // Scene setup
    eventsScene = new THREE.Scene();
    eventsCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    eventsRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    eventsRenderer.setSize(window.innerWidth, window.innerHeight);
    eventsRenderer.setClearColor(0x061006, 0);
    eventsCamera.position.set(0, 2, 8);
    eventsCamera.lookAt(0, 0, 0);

    // Nucleus - rotating icosahedron
    const nucleusGeo = new THREE.IcosahedronGeometry(1.5, 1);
    const nucleusWire = new THREE.WireframeGeometry(nucleusGeo);
    const nucleusMat = new THREE.LineBasicMaterial({
        color: 0x00ff41,
        transparent: true,
        opacity: 0.6
    });
    eventsMesh = new THREE.LineSegments(nucleusWire, nucleusMat);
    eventsScene.add(eventsMesh);

    // Point light
    const light = new THREE.PointLight(0x00ff41, 1.5, 10);
    eventsScene.add(light);

    // Particles
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
        const radius = 3 + Math.random() * 2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.cos(phi);
        positions[i + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
        color: 0x00ff41,
        size: 0.05,
        sizeAttenuation: true
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    eventsScene.add(particles);

    // Create 4 event card panels
    for (let i = 0; i < 4; i++) {
        const angle = (Math.PI / 2) * i;
        const cardGeo = new THREE.PlaneGeometry(2.5, 3.5);
        const cardMat = new THREE.MeshBasicMaterial({
            color: 0x0a1f0a,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        const cardMesh = new THREE.Mesh(cardGeo, cardMat);

        // Position card in orbit
        const x = 4 * Math.cos(angle);
        const z = 4 * Math.sin(angle);
        cardMesh.position.set(x, 0, z);
        cardMesh.lookAt(0, 0, 0);
        cardMesh.userData.angle = angle;
        cardMesh.userData.eventIndex = i;

        // Add border (wireframe)
        const wireGeo = new THREE.EdgesGeometry(cardGeo);
        const wireMat = new THREE.LineBasicMaterial({ color: 0x00ff41 });
        const wireframe = new THREE.LineSegments(wireGeo, wireMat);
        cardMesh.add(wireframe);

        eventsScene.add(cardMesh);
        eventCards.push(cardMesh);
    }

    // Handle resize
    window.addEventListener('resize', () => {
        eventsCamera.aspect = window.innerWidth / window.innerHeight;
        eventsCamera.updateProjectionMatrix();
        eventsRenderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Rotate nucleus
        eventsMesh.rotation.x += 0.003;
        eventsMesh.rotation.y += 0.005;

        // Orbit cards
        eventCards.forEach(card => {
            card.position.x = 4 * Math.cos(card.userData.angle + performance.now() * 0.0003);
            card.position.z = 4 * Math.sin(card.userData.angle + performance.now() * 0.0003);
            card.lookAt(0, 0, 0);
        });

        eventsRenderer.render(eventsScene, eventsCamera);
    }
    animate();

    // Raycaster for click detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    document.getElementById('eventsCanvas').addEventListener('click', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, eventsCamera);
        const intersects = raycaster.intersectObjects(eventCards);

        if (intersects.length > 0) {
            const card = intersects[0].object;
            const eventIndex = card.userData.eventIndex;
            showEventPopup(eventIndex);
        }
    });
}

function showEventPopup(index) {
    const event = events[index];
    document.getElementById('popupIndex').textContent = event.id;
    document.getElementById('popupTitle').textContent = event.name;
    document.getElementById('popupDescription').textContent = event.description;

    const tagsHTML = event.tags
        .map(tag => `<div class="popup-tag">${tag}</div>`)
        .join('');
    document.getElementById('popupTags').innerHTML = tagsHTML;

    document.getElementById('eventPopup').classList.add('active');
}

document.getElementById('popupClose').addEventListener('click', () => {
    document.getElementById('eventPopup').classList.remove('active');
});

// ==================== 3D CONTACT SECTION ====================
let contactScene, contactCamera, contactRenderer, contactMesh;

function initContactScene() {
    const canvas = document.getElementById('contactCanvas');

    contactScene = new THREE.Scene();
    contactCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    contactRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    contactRenderer.setSize(window.innerWidth, window.innerHeight);
    contactRenderer.setClearColor(0x061006, 0);
    contactCamera.position.set(0, 0, 5);

    // Wireframe mesh
    const geo = new THREE.IcosahedronGeometry(2.5, 2);
    const wire = new THREE.WireframeGeometry(geo);
    const mat = new THREE.LineBasicMaterial({
        color: 0x00ff41,
        transparent: true,
        opacity: 0.4
    });
    contactMesh = new THREE.LineSegments(wire, mat);
    contactScene.add(contactMesh);

    // Particles
    const pGeo = new THREE.BufferGeometry();
    const pCount = 300;
    const pPositions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
        const r = 2 + Math.random() * 3;
        const t = Math.random() * Math.PI * 2;
        const p = Math.random() * Math.PI;
        pPositions[i] = r * Math.sin(p) * Math.cos(t);
        pPositions[i + 1] = r * Math.cos(p);
        pPositions[i + 2] = r * Math.sin(p) * Math.sin(t);
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
        color: 0x00ff41,
        size: 0.03,
        sizeAttenuation: true
    });
    const particles = new THREE.Points(pGeo, pMat);
    contactScene.add(particles);

    window.addEventListener('resize', () => {
        contactCamera.aspect = window.innerWidth / window.innerHeight;
        contactCamera.updateProjectionMatrix();
        contactRenderer.setSize(window.innerWidth, window.innerHeight);
    });

    function animate() {
        requestAnimationFrame(animate);
        contactMesh.rotation.x += 0.002;
        contactMesh.rotation.y += 0.003;
        contactRenderer.render(contactScene, contactCamera);
    }
    animate();
}

// ==================== MEMBERS GRID ====================
function initMembersGrid() {
    const grid = document.getElementById('membersGrid');
    members.forEach((member, idx) => {
        const card = document.createElement('div');
        card.className = 'member-card';
        card.style.animationDelay = `${idx * 0.15}s`;
        card.innerHTML = `
            <div class="member-avatar">${member.initials}</div>
            <div class="member-name">${member.name}</div>
            <div class="member-role">${member.role}</div>
        `;
        grid.appendChild(card);
    });
}

// ==================== REGISTRATION FORM ====================
document.getElementById('regForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');

    e.target.style.display = 'none';
    const successMsg = document.getElementById('successMsg');
    successMsg.style.display = 'block';

    // Update message with name
    const lines = successMsg.querySelectorAll('.terminal-line');
    if (lines[3]) {
        lines[3].textContent += ` ${name}`;
    }

    setTimeout(() => {
        e.target.style.display = 'block';
        successMsg.style.display = 'none';
        e.target.reset();
    }, 5000);
});

// ==================== INITIALIZE ALL ====================
document.addEventListener('DOMContentLoaded', async () => {
    await initLoadingScreen();
    setTimeout(() => {
        initGlitchEffect();
        setupTerminalObserver();
        initMembersGrid();
        initEventsScene();
        initContactScene();
    }, 100);
});