const analyticsSession = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
    pageType: 'portfolio',
    pageStartedAt: Date.now(),
    visibleStartedAt: document.visibilityState === 'hidden' ? 0 : Date.now(),
    visibleDurationMs: 0,
    maxScrollPercent: 0,
    ended: false,
    currentSectionId: 'portfolio_page'
};

function pushDataLayerEvent(payload) {
    if (!payload || typeof payload !== 'object') return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
}

function detectLinkType(href) {
    const target = String(href || '').trim().toLowerCase();
    if (!target) return 'unknown';
    if (target.startsWith('mailto:')) return 'mailto';
    if (target.startsWith('#')) return 'anchor';
    if (target.startsWith('http://') || target.startsWith('https://')) return 'external';
    return 'internal';
}

function inferDestinationPageType(destinationUrl) {
    const raw = String(destinationUrl || '').trim();
    if (!raw) return '';
    const linkType = detectLinkType(raw);
    if (linkType === 'anchor') return analyticsSession.pageType;
    if (linkType === 'mailto') return 'contact';
    if (linkType === 'external') return 'external';
    return analyticsSession.pageType;
}

function trackSelectContent({
    contentType, itemId, itemName, sectionName, interactionAction = 'click',
    elementType, elementLabel, linkUrl, linkType, modalName, value, sourceEvent = 'ui_click', ...extra
}) {
    const resolvedDestinationUrl = String(linkUrl || extra.destination_url || '').trim();
    const payload = {
        event: 'select_content',
        tracking_version: '2026-03-ga4-unified-v1',
        session_id: analyticsSession.id,
        page_path: window.location.pathname,
        page_title: document.title,
        page_type: analyticsSession.pageType,
        source_page_type: analyticsSession.pageType,
        content_type: contentType || 'unknown',
        item_id: itemId || 'unknown',
        section_name: sectionName || 'unknown',
        interaction_action: interactionAction,
        source_event: sourceEvent
    };
    if (itemName) payload.item_name = itemName;
    if (elementType) payload.element_type = elementType;
    if (elementLabel) payload.element_label = elementLabel;
    if (resolvedDestinationUrl) {
        payload.link_url = resolvedDestinationUrl;
        payload.destination_url = resolvedDestinationUrl;
        payload.destination_page_type = inferDestinationPageType(resolvedDestinationUrl);
    }
    Object.entries(extra).forEach(([k, v]) => { if (v !== undefined) payload[k] = v; });
    pushDataLayerEvent(payload);
}

function setupAnalyticsLifecycle() {
    window.addEventListener('scroll', () => {
        const h = document.documentElement;
        const st = window.scrollY || h.scrollTop;
        const sh = h.scrollHeight || document.body.scrollHeight;
        const percent = Math.round((st / (sh - window.innerHeight)) * 100);
        analyticsSession.maxScrollPercent = Math.max(analyticsSession.maxScrollPercent, percent);
    }, { passive: true });
    window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            analyticsSession.visibleDurationMs += Date.now() - analyticsSession.visibleStartedAt;
            analyticsSession.visibleStartedAt = 0;
        } else {
            analyticsSession.visibleStartedAt = Date.now();
        }
    });
    window.addEventListener('pagehide', () => {
        if (analyticsSession.ended) return;
        analyticsSession.ended = true;
        trackSelectContent({
            contentType: 'page_engagement', itemId: 'portfolio_page', itemName: document.title,
            sectionName: 'lifecycle', interactionAction: 'end', sourceEvent: 'lifecycle',
            value: Math.round((Date.now() - analyticsSession.pageStartedAt) / 1000)
        });
    });
}

import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
import { templateConfig } from './config.js';

mermaid.initialize({
    startOnLoad: false, theme: 'dark', securityLevel: 'loose', fontFamily: 'Inter',
    flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'linear' }
});

function byId(id) { return document.getElementById(id); }
function setText(id, val) { const el = byId(id); if (el && val) el.textContent = val; }

function setupUptime() {
    const el = byId('uptime');
    if (!el) return;
    const start = new Date();
    setInterval(() => {
        const diff = Math.floor((new Date() - start) / 1000);
        const h = Math.floor(diff / 3600).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
        const s = (diff % 60).toString().padStart(2, '0');
        el.textContent = `${h}:${m}:${s}`;
    }, 1000);
}

function setupMobileNav() {
    const nav = byId('header-nav');
    const toggle = document.querySelector('.nav-toggle');
    if (!nav || !toggle) return;
    toggle.onclick = (e) => {
        e.stopPropagation();
        nav.classList.toggle('is-open');
        toggle.classList.toggle('is-open');
    };
    document.onclick = (e) => {
        if (!nav.contains(e.target) && !toggle.contains(e.target)) {
            nav.classList.remove('is-open');
            toggle.classList.remove('is-open');
        }
    };
}

function renderHero() {
    const h = templateConfig.hero ?? {};
    setText('hero-panel-title', h.panelTitle);
    setText('hero-panel-uid', h.panelUid);
    const m = byId('hero-mermaid');
    if (m && h.diagramId) m.setAttribute('data-mermaid-id', h.diagramId);
    const metrics = byId('hero-metrics');
    if (metrics) {
        metrics.replaceChildren();
        (h.metrics || []).forEach(line => {
            const p = document.createElement('p');
            p.textContent = `> ${line}`;
            metrics.appendChild(p);
        });
    }
}

function createServiceCard(card, sectionConfig) {
    const article = document.createElement('article');
    article.className = `service-card ${sectionConfig.cardClass ?? ''} ${card.cardClass ?? ''}`.trim();
    if (card.mermaidId) article.id = card.mermaidId;
    
    const visual = document.createElement('div');
    visual.className = 'card-visual';
    const vHeight = card.visualHeight || sectionConfig.cardVisualHeight;
    if (vHeight) visual.style.setProperty('--card-visual-height', vHeight);
    
    const mermaidDiv = document.createElement('div');
    mermaidDiv.className = 'mermaid';
    mermaidDiv.setAttribute('data-mermaid-id', card.mermaidId ?? '');
    visual.appendChild(mermaidDiv);
    
    const content = document.createElement('div');
    content.className = 'card-content';
    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = card.title ?? '';
    const desc = document.createElement('p');
    desc.className = 'card-desc';
    desc.textContent = card.description ?? '';
    content.append(title, desc);
    
    if (card.stackSummary) {
        const p = document.createElement('p');
        p.className = 'card-meta-line';
        p.innerHTML = `<span class="meta-label">STACK:</span><span class="meta-value">${card.stackSummary}</span>`;
        content.append(p);
    }
    
    const linksWrapper = document.createElement('div');
    linksWrapper.className = 'card-links';
    (card.links || []).forEach(l => {
        const a = document.createElement('a');
        a.className = `card-link ${l.variant ? 'is-' + l.variant : ''}`;
        a.href = l.href;
        a.textContent = l.label;
        if (!l.href.startsWith('#')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
        linksWrapper.appendChild(a);
    });
    content.append(linksWrapper);
    
    article.append(visual, content);
    return article;
}

function createSectionRecruiterBrief(sectionConfig) {
    const brief = sectionConfig?.recruiterBrief;
    if (!brief) return null;
    const wrapper = document.createElement('section');
    wrapper.className = 'section-recruiter-brief';
    
    if (brief.kicker) {
        const k = document.createElement('p');
        k.className = 'section-recruiter-kicker';
        k.textContent = brief.kicker;
        wrapper.appendChild(k);
    }
    if (brief.title) {
        const t = document.createElement('h3');
        t.className = 'section-recruiter-title';
        t.textContent = brief.title;
        wrapper.appendChild(t);
    }
    
    const grid = document.createElement('div');
    grid.className = 'section-recruiter-card-grid';
    (brief.cases || []).forEach(c => {
        const card = document.createElement('article');
        card.className = 'section-recruiter-card';
        card.innerHTML = `
            <div class="section-recruiter-card-header">
                <p class="section-recruiter-card-id">${c.id}</p>
                <h4 class="section-recruiter-card-title">${c.title}</h4>
                <div class="section-recruiter-card-toggle-hint">DETAILS</div>
            </div>
            <div class="section-recruiter-card-details">
                <div class="section-recruiter-card-row">
                    <span class="section-recruiter-card-key">PROBLEM</span>
                    <span class="section-recruiter-card-value">${c.problem}</span>
                </div>
                <div class="section-recruiter-card-row">
                    <span class="section-recruiter-card-key">ACTION</span>
                    <span class="section-recruiter-card-value">${c.action}</span>
                </div>
                <div class="section-recruiter-card-row">
                    <span class="section-recruiter-card-key">IMPACT</span>
                    <span class="section-recruiter-card-value">${c.impact}</span>
                </div>
                <button class="card-extra-btn">아키텍처 상세보기</button>
            </div>
        `;

        const btn = card.querySelector('.card-extra-btn');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                revealHashTarget(c.anchorId);
                trackSelectContent({
                    contentType: 'recruiter_quick_brief_goto',
                    itemId: c.id, itemName: c.title, sectionName: 'recruiter_quick_brief',
                    interactionAction: 'click_goto_detail',
                    elementLabel: '아키텍처 상세보기',
                    linkUrl: `#${c.anchorId}`
                });
            });
        }

        card.onclick = () => {
            const isExpanded = card.classList.toggle('is-expanded');
            trackSelectContent({
                contentType: 'recruiter_quick_brief_card',
                itemId: c.id, itemName: c.title, sectionName: 'recruiter_quick_brief',
                interactionAction: isExpanded ? 'expand' : 'collapse'
            });
        };
        grid.appendChild(card);
    });
    wrapper.appendChild(grid);
    const actions = document.createElement('div');
    actions.className = 'section-recruiter-actions';
    wrapper.appendChild(actions);
    return wrapper;
}

function revealHashTarget(hash) {
    const id = hash.replace(/^#/, '');
    if (!id) return;
    setTimeout(() => {
        const target = byId(id);
        if (!target) return;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.classList.remove('is-target-highlight');
        void target.offsetWidth;
        target.classList.add('is-target-highlight');
        trackSelectContent({
            contentType: 'hash_target_reveal', itemId: id, sectionName: 'navigation',
            interactionAction: 'reveal_target'
        });
    }, 100);
}

function renderServiceSections() {
    const container = byId('service-sections');
    if (!container) return;
    container.replaceChildren();
    (templateConfig.serviceSections || []).forEach(sec => {
        const sectionWrapper = document.createElement('section');
        sectionWrapper.className = 'service-section';
        sectionWrapper.id = sec.id;
        const header = document.createElement('div');
        header.className = 'section-header';
        const h2 = document.createElement('h2');
        h2.className = 'section-title';
        h2.textContent = sec.title;
        header.appendChild(h2);
        
        const brief = createSectionRecruiterBrief(sec);
        const groupsContainer = document.createElement('div');
        groupsContainer.className = 'service-groups';
        (sec.groups || []).forEach(g => {
            const gSec = document.createElement('div');
            gSec.className = 'service-group';
            if (g.title || g.desc) {
                const div = document.createElement('div');
                div.className = 'group-divider';
                div.setAttribute('data-theme', sec.theme);
                div.innerHTML = `<span class="group-title">${g.title}</span><span class="group-desc">${g.desc}</span>`;
                gSec.appendChild(div);
            }
            const grid = document.createElement('div');
            grid.className = 'service-grid';
            (g.cards || []).forEach(c => grid.appendChild(createServiceCard(c, sec)));
            gSec.appendChild(grid);
            groupsContainer.appendChild(gSec);
        });
        
        sectionWrapper.append(header);
        if (brief) sectionWrapper.appendChild(brief);
        sectionWrapper.appendChild(groupsContainer);
        container.appendChild(sectionWrapper);
    });
}

function renderTopPanels() {
    const container = byId('top-panels');
    if (!container) return;
    container.replaceChildren();
    (templateConfig.topPanels || []).forEach(p => {
        const sec = document.createElement('section');
        sec.className = 'panel hero-panel';
        sec.id = p.sectionId;
        sec.innerHTML = `
            <div class="panel-header">
                <span class="panel-title">${p.panelTitle}</span>
                <span class="panel-uid">${p.panelUid}</span>
            </div>
            <div class="graph-container">
                <div class="mermaid" data-mermaid-id="${p.diagramId}"></div>
            </div>
            <div class="hero-message"></div>
        `;
        const metrics = sec.querySelector('.hero-message');
        (p.metrics || []).forEach(line => {
            const item = document.createElement('p');
            item.textContent = `> ${line}`;
            metrics.appendChild(item);
        });
        container.appendChild(sec);
    });
}

function renderSkills() {
    const s = templateConfig.skills || {};
    setText('skills-panel-title', s.panelTitle);
    setText('skills-panel-uid', s.panelUid);
    const grid = byId('skill-grid');
    if (grid) {
        grid.replaceChildren();
        (s.items || []).forEach(item => {
            const article = document.createElement('article');
            article.className = 'skill-card';
            article.innerHTML = `<h3 class="skill-card-title">${item.title}</h3><p class="skill-card-stack">${item.stack}</p>`;
            grid.appendChild(article);
        });
    }
}

function renderContact() {
    const c = templateConfig.contact || {};
    setText('contact-panel-title', c.panelTitle);
    setText('contact-panel-uid', c.panelUid);
    setText('contact-description', c.description);
    const actions = byId('contact-actions');
    if (actions) {
        actions.replaceChildren();
        (c.actions || []).forEach(a => {
            const btn = document.createElement('a');
            btn.className = 'action-btn';
            btn.href = a.href;
            btn.textContent = a.label;
            if (!a.href.startsWith('mailto:')) { btn.target = '_blank'; btn.rel = 'noopener noreferrer'; }
            actions.appendChild(btn);
        });
    }
}

function renderNavigation() {
    const nav = byId('header-nav');
    if (!nav) return;
    const items = [
        { label: 'ARCHITECTURE', target: '#system-architecture' },
        { label: 'APPLICATION_MAP', target: '#application-map-panel' },
        { label: 'SKILLS', target: '#skill-set' },
        { label: 'SERVICES', target: '#backend-services' },
        { label: 'CONTACT', target: '#contact' }
    ];
    nav.replaceChildren();
    items.forEach(i => {
        const a = document.createElement('a');
        a.className = 'nav-item';
        a.href = i.target;
        a.textContent = i.label;
        nav.appendChild(a);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    setupAnalyticsLifecycle();
    setSystemInfo();
    renderHero();
    renderTopPanels();
    renderSkills();
    renderServiceSections();
    renderContact();
    renderNavigation();
    setupUptime();
    setupMobileNav();
    
    const nodes = Array.from(document.querySelectorAll('.mermaid'));
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const id = node.getAttribute('data-mermaid-id');
        if (id && templateConfig.diagrams[id]) {
            node.innerHTML = templateConfig.diagrams[id];
            try {
                const tempClass = `mermaid-render-${i}`;
                node.classList.add(tempClass);
                await mermaid.run({ querySelector: `.${tempClass}` });
            } catch (e) { console.error(e); }
        }
    }
    
    document.querySelectorAll('.mermaid').forEach(m => {
        m.style.cursor = 'zoom-in';
        m.onclick = () => {
            const svg = m.querySelector('svg');
            if (svg) {
                const modal = byId('mermaid-modal');
                const content = byId('mermaid-modal-content');
                content.innerHTML = '';
                const clone = svg.cloneNode(true);
                clone.style.width = '100%';
                clone.style.height = 'auto';
                content.appendChild(clone);
                modal.classList.add('is-open');
                document.body.classList.add('modal-open');
            }
        };
    });
    
    document.querySelectorAll('[data-mermaid-close]').forEach(b => {
        b.onclick = () => {
            byId('mermaid-modal').classList.remove('is-open');
            document.body.classList.remove('modal-open');
        };
    });
    
    if (window.location.hash) revealHashTarget(window.location.hash);
    window.onhashchange = () => revealHashTarget(window.location.hash);
});

function setSystemInfo() {
    if (templateConfig.system?.documentTitle) document.title = templateConfig.system.documentTitle;
    setText('system-name', templateConfig.system?.systemName);
}
