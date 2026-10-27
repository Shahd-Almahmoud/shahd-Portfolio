import React, { useState, useEffect, useRef } from 'react';

// ==================== Boot Screen ====================
function BootScreen({ onComplete }) {
  const bootLines = [
    '> Initializing Shahd OS v1.0.0...',
    '> Loading kernel modules............ [ OK ]',
    '> Mounting portfolio filesystem..... [ OK ]',
    '> Starting UI services.............. [ OK ]',
    '> Welcome, Engineer. System ready.',
  ];
  const [lineIndex, setLineIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (lineIndex >= bootLines.length) {
      setDone(true);
      return;
    }
    const t = setTimeout(() => setLineIndex((i) => i + 1), 300);
    return () => clearTimeout(t);
  }, [lineIndex, bootLines.length]);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => onComplete(), 400);
    return () => clearTimeout(t);
  }, [done, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center font-mono text-sm">
      <div className="w-full max-w-lg px-6 space-y-2">
        {bootLines.slice(0, lineIndex).map((line, i) => (
          <p key={i} className={line.includes('[ OK ]') ? 'text-gray-500' : 'text-[#00D2FF] font-bold'}>
            {line}
          </p>
        ))}
        <span className="inline-block w-2 h-4 bg-[#00D2FF] animate-pulse" />
      </div>
    </div>
  );
}

// ==================== Clock Widget ====================
function ClockWidget() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatted = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <div className="flex items-center gap-2 text-[#00D2FF] font-mono text-xs">
      <span className="animate-pulse">●</span>
      <span>{formatted}</span>
    </div>
  );
}

// ==================== Main OS ====================
export default function ShahdOS() {
  const [booting, setBooting] = useState(true);
  const zRef = useRef(30);

  const [windows, setWindows] = useState(() => {
    const hideWelcome =
      typeof window !== 'undefined' && localStorage.getItem('shahd-hide-welcome') === 'true';
    return {
      welcome: { isOpen: !hideWelcome, title: '🚀 welcome.exe', z: 32, pos: { x: 0, y: 0 } },
      about: { isOpen: hideWelcome, title: '👤 system_info.sys', z: 31, pos: { x: 0, y: 0 } },
      projects: { isOpen: false, title: '💻 project_explorer.exe', z: 30, pos: { x: 0, y: 0 } },
      experience: { isOpen: false, title: '💼 career_timeline.log', z: 29, pos: { x: 0, y: 0 } },
      skills: { isOpen: false, title: '🛠️ core_capabilities.cfg', z: 28, pos: { x: 0, y: 0 } },
      contact: { isOpen: false, title: '✉️ terminal_mailer.sh', z: 27, pos: { x: 0, y: 0 } },
    };
  });

  const bringToFront = (id) => {
    zRef.current += 1;
    const newZ = zRef.current;
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], z: newZ } }));
  };

  const toggleWindow = (id) => {
    setWindows((prev) => {
      const win = prev[id];
      if (win.isOpen) return { ...prev, [id]: { ...win, isOpen: false } };
      zRef.current += 1;
      return { ...prev, [id]: { ...win, isOpen: true, z: zRef.current } };
    });
  };

  const closeWindow = (id) => {
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], isOpen: false } }));
  };

  const openWindow = (id) => {
    setWindows((prev) => {
      zRef.current += 1;
      return { ...prev, [id]: { ...prev[id], isOpen: true, z: zRef.current } };
    });
  };

  const updatePos = (id, pos) => {
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], pos } }));
  };

  const handleAction = (action) => {
    closeWindow('welcome');
    openWindow(action);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'Escape') {
        const openWins = Object.entries(windows).filter(([_, w]) => w.isOpen);
        if (openWins.length) {
          const top = openWins.reduce((a, b) => (a[1].z > b[1].z ? a : b));
          closeWindow(top[0]);
        }
      }
      if (e.key === '1') toggleWindow('welcome');
      if (e.key === '2') toggleWindow('about');
      if (e.key === '3') toggleWindow('projects');
      if (e.key === '4') toggleWindow('experience');
      if (e.key === '5') toggleWindow('skills');
      if (e.key === '6') toggleWindow('contact');
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        openWindow('contact');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [windows]);

  if (booting) return <BootScreen onComplete={() => setBooting(false)} />;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0B0F19] text-gray-100 font-sans" dir="ltr">
      {/* ===== Animated Background ===== */}
      {/* Layer 1: Animated gradient */}
      <div className="absolute inset-0 animated-bg z-0" />

      {/* Layer 2: Aurora Orbs */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="orb-1 absolute top-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/20 blur-[140px]" />
        <div className="orb-2 absolute bottom-[-15%] left-[-10%] w-[550px] h-[550px] rounded-full bg-purple-500/20 blur-[140px]" />
        <div className="orb-3 absolute top-[30%] left-[40%] w-[450px] h-[450px] rounded-full bg-blue-600/15 blur-[130px]" />
      </div>

      {/* Layer 3: Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(#00D2FF 1px, transparent 1px), linear-gradient(90deg, #00D2FF 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        }}
      />

      {/* Layer 4: Noise overlay */}
      <div className="noise-overlay absolute inset-0 z-0 pointer-events-none" />

      {/* Top Bar Widgets */}
      <div className="absolute top-6 right-6 z-10 flex flex-col gap-2 items-end">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl font-mono text-[11px] shadow-xl flex items-center gap-3">
          <span className="text-emerald-400 font-bold animate-pulse">● ONLINE</span>
          <span className="text-gray-600">|</span>
          <ClockWidget />
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl font-mono text-[11px] space-y-1 shadow-xl">
          <p className="text-[#00D2FF] font-bold">ENGINEER: SHAHD AL-MAHMOUD</p>
          <p className="text-gray-400">ROLE: Front-End Specialist</p>
          <p className="text-gray-500">LOC: Hama, Syria</p>
        </div>
      </div>

      {/* Windows Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {Object.entries(windows).map(([id, win]) =>
          win.isOpen ? (
            <DraggableWindow
              key={id}
              title={win.title}
              z={win.z}
              pos={win.pos}
              onClose={() => closeWindow(id)}
              onFocus={() => bringToFront(id)}
              onMove={(pos) => updatePos(id, pos)}
            >
              <WindowContent id={id} onAction={handleAction} />
            </DraggableWindow>
          ) : null
        )}
      </div>

      {/* Dock */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
        <div className="flex gap-2 bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded-2xl shadow-2xl">
          <DockIcon label="Welcome" icon="🚀" onClick={() => toggleWindow('welcome')} isActive={windows.welcome.isOpen} />
          <DockIcon label="About" icon="👤" onClick={() => toggleWindow('about')} isActive={windows.about.isOpen} />
          <DockIcon label="Projects" icon="💻" onClick={() => toggleWindow('projects')} isActive={windows.projects.isOpen} />
          <DockIcon label="Experience" icon="💼" onClick={() => toggleWindow('experience')} isActive={windows.experience.isOpen} />
          <DockIcon label="Skills" icon="🛠️" onClick={() => toggleWindow('skills')} isActive={windows.skills.isOpen} />
          <DockIcon label="Terminal" icon="✉️" onClick={() => toggleWindow('contact')} isActive={windows.contact.isOpen} />
        </div>
        <p className="text-[10px] font-mono text-gray-600 select-none">
          Press <kbd className="px-1 py-0.5 bg-white/5 rounded border border-white/10">1-6</kbd> to open ·{' '}
          <kbd className="px-1 py-0.5 bg-white/5 rounded border border-white/10">Esc</kbd> to close ·{' '}
          <kbd className="px-1 py-0.5 bg-white/5 rounded border border-white/10">Ctrl+K</kbd> for terminal
        </p>
      </div>
    </div>
  );
}

// ==================== Draggable Window ====================
function DraggableWindow({ title, z, pos, onClose, onFocus, onMove, children }) {
  const dragState = useRef({ dragging: false, offsetX: 0, offsetY: 0 });

  const handleMouseDown = (e) => {
    if (e.target.closest('button')) return;
    dragState.current.dragging = true;
    dragState.current.offsetX = e.clientX - pos.x;
    dragState.current.offsetY = e.clientY - pos.y;
    onFocus();
  };

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragState.current.dragging) return;
      onMove({
        x: e.clientX - dragState.current.offsetX,
        y: e.clientY - dragState.current.offsetY,
      });
    };
    const onMouseUp = () => {
      dragState.current.dragging = false;
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMove]);

  return (
    <div
      className="pointer-events-auto absolute left-1/2 top-1/2 w-[95%] md:w-[90%] max-w-3xl max-h-[80vh] flex flex-col bg-[#0f1626]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-shadow"
      style={{
        zIndex: z,
        transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
      }}
      onMouseDown={onFocus}
    >
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/[0.03] cursor-move shrink-0 select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          </div>
          <span className="font-mono text-xs text-gray-400 ml-2">{title}</span>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-red-500/30 transition-colors"
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <div className="p-5 overflow-y-auto">{children}</div>
    </div>
  );
}

// ==================== Window Content Router ====================
function WindowContent({ id, onAction }) {
  if (id === 'welcome') return <WelcomeContent onAction={onAction} />;
  if (id === 'about') return <AboutContent />;
  if (id === 'projects') return <ProjectsContent />;
  if (id === 'experience') return <ExperienceContent />;
  if (id === 'skills') return <SkillsContent />;
  if (id === 'contact') return <TerminalContent />;
  return null;
}

// ==================== Welcome ====================
function WelcomeContent({ onAction }) {
  const [dontShow, setDontShow] = useState(false);

  const handle = (action) => {
    if (dontShow) localStorage.setItem('shahd-hide-welcome', 'true');
    onAction(action);
  };

  return (
    <div className="space-y-5">
      <div className="text-center space-y-2">
        <div className="text-5xl">👋</div>
        <h2 className="text-2xl font-extrabold bg-gradient-to-r from-[#00D2FF] to-[#A855F7] bg-clip-text text-transparent">
          Welcome to Shahd OS
        </h2>
        <p className="text-sm text-gray-400 font-mono">
          Portfolio of Shahd Sami Al-Mahmoud — Software Engineer
        </p>
      </div>

      <hr className="border-white/10" />

      <div className="space-y-2">
        <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">&gt;_ quick_start.sh</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => handle('projects')}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#00D2FF]/10 border border-[#00D2FF]/30 hover:bg-[#00D2FF]/20 hover:border-[#00D2FF]/60 hover:scale-[1.02] transition-all"
          >
            <span className="text-lg">💻</span>
            <span className="text-sm font-semibold text-[#00D2FF]">Projects</span>
          </button>
          <button
            onClick={() => handle('skills')}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/30 hover:bg-[#A855F7]/20 hover:border-[#A855F7]/60 hover:scale-[1.02] transition-all"
          >
            <span className="text-lg">🛠️</span>
            <span className="text-sm font-semibold text-[#A855F7]">Skills</span>
          </button>
          <button
            onClick={() => handle('contact')}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/60 hover:scale-[1.02] transition-all"
          >
            <span className="text-lg">✉️</span>
            <span className="text-sm font-semibold text-emerald-400">Terminal</span>
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1">
        <p className="text-xs font-mono text-[#00D2FF]">💡 Pro tip:</p>
        <p className="text-xs text-gray-400 leading-relaxed">
          Open the <span className="text-white font-semibold">Terminal</span> window and type{' '}
          <code className="bg-black/40 px-1.5 py-0.5 rounded text-emerald-400 font-mono">help</code> to
          explore commands. Or press{' '}
          <kbd className="px-1.5 py-0.5 bg-black/40 rounded text-[10px] border border-white/10">Ctrl+K</kbd>{' '}
          anytime.
        </p>
      </div>

      <div className="flex items-center justify-center pt-1">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-500 hover:text-gray-300 transition-colors">
          <input
            type="checkbox"
            checked={dontShow}
            onChange={(e) => setDontShow(e.target.checked)}
            className="w-3.5 h-3.5 accent-[#00D2FF] cursor-pointer"
          />
          Don&apos;t show this again
        </label>
      </div>
    </div>
  );
}

// ==================== About ====================
function AboutContent() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-extrabold bg-gradient-to-r from-[#00D2FF] to-[#A855F7] bg-clip-text text-transparent">
        Shahd Sami Al-Mahmoud
      </h2>
      <p className="text-sm font-mono text-[#00D2FF]">
        Software Engineer &amp; Front-End Developer (Graduation: 2025)
      </p>
      <hr className="border-white/10" />
      <p className="text-sm leading-relaxed text-gray-300">
        A detail-oriented Software Engineer specializing in building and optimizing robust web interfaces
        using <span className="text-white font-semibold">HTML5, CSS3, JavaScript, React, and Next.js</span>.
        Gained 2 years of professional remote experience in data architecture and customer service
        workflows for a prominent educational platform in KSA. Adept in administrative automation and
        combining core engineering principles with creative digital interfaces.
      </p>
    </div>
  );
}

// ==================== Projects ====================
function ProjectsContent() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold font-mono text-[#A855F7]">&gt;_ deploying_software_projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl hover:border-[#00D2FF]/40 hover:bg-white/[0.07] transition-all">
          <h3 className="font-bold text-white">1. Task Manager Application</h3>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            Productivity-focused web app for tracking workflows and managing daily schedules.
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3 font-mono text-[10px]">
            <span className="bg-[#00D2FF]/10 text-[#00D2FF] px-2 py-0.5 rounded-md">React</span>
            <span className="bg-white/5 text-gray-300 px-2 py-0.5 rounded-md">State Management</span>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl hover:border-[#00D2FF]/40 hover:bg-white/[0.07] transition-all">
          <h3 className="font-bold text-white">2. E-Commerce Store Front</h3>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            Responsive storefront applying SEO best practices for core visibility.
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3 font-mono text-[10px]">
            <span className="bg-[#A855F7]/10 text-[#A855F7] px-2 py-0.5 rounded-md">Next.js</span>
            <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md">SEO</span>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl hover:border-[#00D2FF]/40 hover:bg-white/[0.07] transition-all md:col-span-2">
          <h3 className="font-bold text-white">3. Laboratory Analysis Reading System</h3>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            Healthcare informatics + data parsing solution for medical lab results.
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3 font-mono text-[10px]">
            <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-md">JavaScript</span>
            <span className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-md">Data Parsing</span>
            <span className="bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-md">Healthcare</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== Experience ====================
function ExperienceContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold font-mono text-[#00D2FF]">&gt;_ active_professional_history</h2>

      <div className="relative pl-6 border-l-2 border-white/10 space-y-1">
        <div className="absolute w-3 h-3 bg-[#00D2FF] rounded-full left-[-7px] top-1.5 shadow-[0_0_8px_#00D2FF]" />
        <h4 className="font-bold text-white text-sm">Web Development Intern</h4>
        <p className="text-xs font-mono text-gray-400">Tech &amp; Design Company — Salamiyah, Syria</p>
        <p className="text-xs text-gray-400 leading-relaxed pt-1">
          Built modern UIs using HTML5, CSS3, JS, React &amp; Next.js for production environments.
        </p>
      </div>

      <div className="relative pl-6 border-l-2 border-white/10 space-y-1">
        <div className="absolute w-3 h-3 bg-[#A855F7] rounded-full left-[-7px] top-1.5" />
        <h4 className="font-bold text-white text-sm">Remote Content Management &amp; Support</h4>
        <p className="text-xs font-mono text-gray-400">Prominent Educational Platform — KSA (2 Years)</p>
        <p className="text-xs text-gray-400 leading-relaxed pt-1">
          Supervised data structures, remote communication &amp; end-user support workflows.
        </p>
      </div>

      <div className="relative pl-6 space-y-1">
        <div className="absolute w-3 h-3 bg-amber-500 rounded-full left-[-5px] top-1.5" />
        <h4 className="font-bold text-white text-sm">Document Automation Volunteer</h4>
        <p className="text-xs font-mono text-gray-400">Real Estate Registration Directorate</p>
        <p className="text-xs text-gray-400 leading-relaxed pt-1">
          Automated old paperwork chains via scripting and data processing.
        </p>
      </div>
    </div>
  );
}

// ==================== Skills ====================
function SkillsContent() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold font-mono text-[#00D2FF]">&gt;_ system_parameters.cfg</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
          <h3 className="text-[#00D2FF] font-bold">ENGINEERING STACK</h3>
          <ul className="space-y-1 text-gray-300">
            <li>● HTML5 / CSS3 / JavaScript (ES6+)</li>
            <li>● React.js / Next.js</li>
            <li>● Tailwind CSS / Responsive</li>
            <li>● SEO Optimization</li>
          </ul>
        </div>
        <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
          <h3 className="text-[#A855F7] font-bold">AUTOMATION &amp; SOFT</h3>
          <ul className="space-y-1 text-gray-300">
            <li>● Prompt Engineering</li>
            <li>● Data Structures &amp; Archiving</li>
            <li>● Copywriting &amp; Design</li>
            <li>● Async Collaboration</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ==================== Terminal (Interactive) ====================
function TerminalContent() {
  const [history, setHistory] = useState([
    { type: 'system', text: 'Shahd OS Terminal v1.0.0 — Secure Shell' },
    { type: 'system', text: 'Type "help" to see available commands.' },
    { type: 'system', text: '' },
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [histIndex, setHistIndex] = useState(-1);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const runCommand = (raw) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    setCmdHistory((prev) => [...prev, raw]);
    setHistIndex(-1);

    const newLines = [{ type: 'input', text: raw }];

    switch (cmd) {
      case 'help':
        newLines.push(
          { type: 'output', text: 'Available commands:' },
          { type: 'output', text: '  about       — Learn about Shahd' },
          { type: 'output', text: '  skills      — View technical stack' },
          { type: 'output', text: '  projects    — Explore software projects' },
          { type: 'output', text: '  experience  — Career timeline' },
          { type: 'output', text: '  contact     — Get in touch' },
          { type: 'output', text: '  whoami      — Identity' },
          { type: 'output', text: '  clear       — Clear terminal' },
          { type: 'output', text: '' }
        );
        break;
      case 'about':
        newLines.push(
          { type: 'output', text: 'Shahd Sami Al-Mahmoud' },
          { type: 'output', text: 'Software Engineer & Front-End Developer (2025)' },
          { type: 'output', text: 'React · Next.js · Tailwind · SEO' },
          { type: 'output', text: '' }
        );
        break;
      case 'skills':
        newLines.push(
          { type: 'output', text: 'Engineering Stack:' },
          { type: 'output', text: '  · HTML5 / CSS3 / JavaScript (ES6+)' },
          { type: 'output', text: '  · React.js / Next.js' },
          { type: 'output', text: '  · Tailwind CSS / Responsive' },
          { type: 'output', text: 'Automation & Soft:' },
          { type: 'output', text: '  · Prompt Engineering' },
          { type: 'output', text: '  · Data Structures' },
          { type: 'output', text: '  · Async Collaboration' },
          { type: 'output', text: '' }
        );
        break;
      case 'projects':
        newLines.push(
          { type: 'output', text: '1. Task Manager — React / State Management' },
          { type: 'output', text: '2. E-Commerce Front — Next.js / SEO' },
          { type: 'output', text: '3. Lab Analysis System — JS / Data Parsing' },
          { type: 'output', text: '' }
        );
        break;
      case 'experience':
        newLines.push(
          { type: 'output', text: '· Web Dev Intern @ Tech & Design Co. (Salamiyah)' },
          { type: 'output', text: '· Remote Content Specialist @ Educational Platform (KSA, 2y)' },
          { type: 'output', text: '· Doc Automation Volunteer @ Real Estate Directorate' },
          { type: 'output', text: '' }
        );
        break;
      case 'contact':
        newLines.push(
          { type: 'output', text: '📧 shahdalmahmoud0@gmail.com' },
          { type: 'output', text: '📱 +963 992 347 207' },
          { type: 'output', text: '' }
        );
        break;
      case 'whoami':
        newLines.push(
          { type: 'output', text: 'shahd — Software Engineer & Front-End Dev' },
          { type: 'output', text: '' }
        );
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      default:
        newLines.push({
          type: 'error',
          text: `command not found: ${cmd}. Type "help" for available commands.`,
        });
        newLines.push({ type: 'output', text: '' });
    }

    setHistory((prev) => [...prev, ...newLines]);
    setInput('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      runCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const next = histIndex === -1 ? cmdHistory.length - 1 : Math.max(0, histIndex - 1);
      setHistIndex(next);
      setInput(cmdHistory[next]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIndex === -1) return;
      const next = histIndex + 1;
      if (next >= cmdHistory.length) {
        setHistIndex(-1);
        setInput('');
      } else {
        setHistIndex(next);
        setInput(cmdHistory[next]);
      }
    }
  };

  return (
    <div className="font-mono text-xs space-y-1">
      <div className="max-h-[55vh] overflow-y-auto space-y-0.5 pr-2">
        {history.map((line, i) => {
          if (line.type === 'input') {
            return (
              <p key={i} className="text-gray-300">
                <span className="text-[#00D2FF]">shahd@portfolio</span>
                <span className="text-gray-500">:~$</span> {line.text}
              </p>
            );
          }
          if (line.type === 'error') {
            return (
              <p key={i} className="text-red-400">
                {line.text}
              </p>
            );
          }
          if (line.type === 'system') {
            return (
              <p key={i} className="text-gray-500">
                {line.text}
              </p>
            );
          }
          return (
            <p key={i} className="text-gray-300 whitespace-pre-wrap">
              {line.text}
            </p>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
        <span className="text-[#00D2FF]">shahd@portfolio</span>
        <span className="text-gray-500">:~$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          className="flex-1 bg-transparent outline-none text-gray-100 font-mono text-xs caret-[#00D2FF]"
          placeholder="type a command..."
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-wrap gap-1.5 pt-2">
        {['help', 'about', 'skills', 'projects', 'contact', 'clear'].map((c) => (
          <button
            key={c}
            onClick={() => runCommand(c)}
            className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 hover:bg-[#00D2FF]/15 hover:border-[#00D2FF]/40 text-gray-400 hover:text-[#00D2FF] transition-all text-[10px]"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

// ==================== Dock Icon ====================
function DockIcon({ icon, label, onClick, isActive }) {
  return (
    <button
      onClick={onClick}
      className={`group relative w-11 h-11 flex items-center justify-center text-xl rounded-xl transition-all duration-200 hover:scale-110 hover:-translate-y-1.5 ${
        isActive
          ? 'bg-[#00D2FF]/15 border border-[#00D2FF]/40 shadow-[0_0_15px_rgba(0,210,255,0.25)]'
          : 'bg-white/5 border border-white/5 hover:bg-white/10'
      }`}
    >
      <span>{icon}</span>
      <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded-md bg-black/80 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {label}
      </span>
      {isActive && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00D2FF]" />
      )}
    </button>
  );
}