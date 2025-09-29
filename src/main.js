// Global state
let currentLanguage = 'en';
let data = {};

// Internationalization data
const i18n = {
    en: {
        'nav.title': 'Ethical AI Tool Analysis',
        'nav.overview': 'Overview',
        'nav.agenda': 'Agenda',
        'nav.fairness': 'Fairness',
        'nav.transparency': 'Transparency',
        'nav.privacy': 'Privacy',
        'nav.comparison': 'Comparison',
        'nav.references': 'References',
        'nav.lang': '中文',
        'overview.title': 'Ethical AI Tool Analysis',
        'overview.subtitle': 'PHI4005 - Comprehensive Evaluation of AI Ethics Tools',
        'overview.course': 'Course Information',
        'overview.courseCode': 'Course:',
        'overview.courseTitle': 'PHI4005 - Ethics in Artificial Intelligence',
        'overview.semester': 'Semester:',
        'overview.semesterValue': 'Fall 2024',
        'overview.team': 'Team Members',
        'agenda.title': 'Presentation Agenda',
        'fairness.title': 'Fairness Tool Analysis',
        'transparency.title': 'Transparency Tool Analysis',
        'privacy.title': 'Privacy Tool Analysis',
        'comparison.title': 'Comparative Summary',
        'references.title': 'References',
        'compliance.title': 'Compliance Note',
        'compliance.text': 'This presentation strictly adheres to course requirements and does not use AI ethics tools developed by Microsoft or IBM.'
    },
    zh: {
        'nav.title': 'AI伦理工具分析',
        'nav.overview': '概览',
        'nav.agenda': '议程',
        'nav.fairness': '公平性',
        'nav.transparency': '透明度',
        'nav.privacy': '隐私',
        'nav.comparison': '对比',
        'nav.references': '参考文献',
        'nav.lang': 'English',
        'overview.title': 'AI伦理工具分析',
        'overview.subtitle': 'PHI4005 - AI伦理工具综合评估',
        'overview.course': '课程信息',
        'overview.courseCode': '课程：',
        'overview.courseTitle': 'PHI4005 - 人工智能伦理学',
        'overview.semester': '学期：',
        'overview.semesterValue': '2024年秋季',
        'overview.team': '团队成员',
        'agenda.title': '演示议程',
        'fairness.title': '公平性工具分析',
        'transparency.title': '透明度工具分析',
        'privacy.title': '隐私工具分析',
        'comparison.title': '对比总结',
        'references.title': '参考文献',
        'compliance.title': '合规声明',
        'compliance.text': '本演示严格遵守课程要求，未使用微软或IBM开发的AI伦理工具。'
    }
};

// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const langToggle = document.querySelector('.lang-toggle');
const navLinks = document.querySelectorAll('.nav-link');

// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadData();
        initializeNavigation();
        initializeLanguageToggle();
        renderContent();
        updateActiveNavLink();
        
        // Add scroll listener for active nav highlighting
        window.addEventListener('scroll', debounce(updateActiveNavLink, 100));
        
        // Add keyboard navigation
        document.addEventListener('keydown', handleKeyboardNavigation);
        
    } catch (error) {
        console.error('Failed to initialize application:', error);
        showError('Failed to load application data');
    }
});

// Load data from JSON file
async function loadData() {
    try {
        const response = await fetch('src/data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        data = await response.json();
    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to empty data structure
        data = {
            teamMembers: [],
            agenda: [],
            tools: { fairness: {}, transparency: {}, privacy: {} },
            comparison: {},
            references: []
        };
        throw error;
    }
}

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    navToggle?.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Language toggle functionality
function initializeLanguageToggle() {
    langToggle?.addEventListener('click', () => {
        currentLanguage = currentLanguage === 'en' ? 'zh' : 'en';
        langToggle.setAttribute('data-lang', currentLanguage);
        updateLanguage();
        renderContent(); // Re-render content with new language
    });
}

// Update language throughout the page
function updateLanguage() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = i18n[currentLanguage]?.[key] || i18n.en[key] || key;
        element.textContent = translation;
    });
    
    // Update document language attribute
    document.documentElement.setAttribute('lang', currentLanguage);
}

// Render dynamic content
function renderContent() {
    renderTeamMembers();
    renderAgenda();
    renderToolSections();
    renderComparison();
    renderReferences();
}

// Render team members
function renderTeamMembers() {
    const teamList = document.getElementById('team-list');
    if (!teamList || !data.teamMembers) return;

    const members = data.teamMembers[currentLanguage] || data.teamMembers.en || [];
    teamList.innerHTML = members.map(member => `<li>${member}</li>`).join('');
}

// Render agenda
function renderAgenda() {
    const agendaContent = document.getElementById('agenda-content');
    if (!agendaContent || !data.agenda) return;

    const agenda = data.agenda[currentLanguage] || data.agenda.en || [];
    agendaContent.innerHTML = agenda.map(item => `
        <div class="agenda-item">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <div class="duration">${item.duration}</div>
        </div>
    `).join('');
}

// Render tool sections
function renderToolSections() {
    const tools = ['fairness', 'transparency', 'privacy'];
    
    tools.forEach(toolType => {
        renderToolSection(toolType);
    });
}

// Render individual tool section
function renderToolSection(toolType) {
    const container = document.getElementById(`${toolType}-content`);
    if (!container || !data.tools?.[toolType]) return;

    const tool = data.tools[toolType][currentLanguage] || data.tools[toolType].en || {};
    
    container.innerHTML = `
        <div class="tool-overview">
            <div class="tool-info">
                <div class="tool-name">${tool.name || 'Tool Name'}</div>
                <h3>${tool.category || 'Category'}</h3>
                <p><strong>Developer:</strong> ${tool.developer || 'Developer'}</p>
                <p><strong>License:</strong> ${tool.license || 'License'}</p>
                <p><strong>Language:</strong> ${tool.language || 'Language'}</p>
            </div>
            <div class="tool-description">
                <h4>Tool Overview</h4>
                <p>${tool.overview || 'Tool overview description.'}</p>
            </div>
        </div>
        <div class="tool-subsections">
            ${renderToolSubsection('Approach & Workflow', tool.approach)}
            ${renderToolSubsection('Strengths', tool.strengths)}
            ${renderToolSubsection('Limitations', tool.limitations)}
            ${renderToolSubsection('Real-World Case & Risk Mitigation', tool.realWorldCase)}
        </div>
    `;
}

// Render tool subsection
function renderToolSubsection(title, content) {
    if (!content) return '';
    
    const contentHtml = Array.isArray(content) 
        ? `<ul>${content.map(item => `<li>${item}</li>`).join('')}</ul>`
        : `<p>${content}</p>`;
    
    return `
        <div class="tool-subsection">
            <h4>${title}</h4>
            ${contentHtml}
        </div>
    `;
}

// Render comparison table
function renderComparison() {
    const table = document.getElementById('comparison-table');
    if (!table || !data.comparison) return;

    const comparison = data.comparison[currentLanguage] || data.comparison.en || {};
    const headers = comparison.headers || [];
    const rows = comparison.rows || [];

    table.innerHTML = `
        <thead>
            <tr>
                ${headers.map(header => `<th>${header}</th>`).join('')}
            </tr>
        </thead>
        <tbody>
            ${rows.map(row => `
                <tr>
                    ${row.map(cell => `<td>${cell}</td>`).join('')}
                </tr>
            `).join('')}
        </tbody>
    `;
}

// Render references
function renderReferences() {
    const referencesList = document.getElementById('references-list');
    if (!referencesList || !data.references) return;

    const references = data.references[currentLanguage] || data.references.en || [];
    referencesList.innerHTML = references.map((ref, index) => `
        <li id="ref-${index + 1}">
            ${ref.authors} (${ref.year}). <em>${ref.title}</em>. ${ref.publication}. 
            ${ref.url ? `<a href="${ref.url}" target="_blank" rel="noopener">${ref.url}</a>` : ''}
        </li>
    `).join('');
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section[id]');
    const scrollPosition = window.scrollY + 100; // Offset for fixed header

    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Keyboard navigation
function handleKeyboardNavigation(e) {
    // Arrow key navigation through sections
    if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault();
        navigateSection(e.key === 'ArrowDown' ? 1 : -1);
    }
    
    // Escape to close mobile menu
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    }
}

// Navigate to next/previous section
function navigateSection(direction) {
    const sections = Array.from(document.querySelectorAll('.section[id]'));
    const currentIndex = sections.findIndex(section => {
        const rect = section.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom > 100;
    });
    
    const nextIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction));
    const targetSection = sections[nextIndex];
    
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Utility function: debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Error handling
function showError(message) {
    console.error(message);
    // Could add user-visible error message here if needed
}

// Smooth scrolling for older browsers
function smoothScrollTo(element) {
    const targetPosition = element.offsetTop - 70; // Account for fixed header
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let start = null;

    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
} 