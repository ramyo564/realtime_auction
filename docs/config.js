import { diagrams } from './diagrams.js';
import { learnMoreLinks } from './learnmore-links.js';

const cardMeta = {
    'realtime-auction-flow': {
        title: 'Realtime Auction Flow',
        description: 'Clients join auction rooms over WebSocket and bid state is synchronized in real time through Channels group messaging.'
    },
    'websocket-bid-concurrency': {
        title: 'Bid Concurrency Control',
        description: '`database_sync_to_async` and per-room max-price update logic keep highest bid updates consistent under concurrent bid events.'
    },
    'celery-auction-room-lifecycle': {
        title: 'Auction Lifecycle Automation',
        description: 'Celery Beat periodically checks product schedules, auto-creates auction rooms, and toggles auction active state by end time.'
    },
    'payment-kakao-ready-approval': {
        title: 'KakaoPay Ready/Approval',
        description: 'Payment flow links ready and approval steps using persisted transaction context (`kakao_tid`) and user-scoped payment lookup.'
    },
    'payment-expiration-cleanup': {
        title: 'Payment Expiration Cleanup',
        description: 'Unpaid winner payments are checked and expired records are removed after timeout to avoid stale transaction buildup.'
    },
    'product-filter-mptt': {
        title: 'Product Filter + MPTT Category',
        description: 'Product listing combines django-filter keyword/category query with tree-based category modeling (`django-mptt`).'
    },
    'user-phone-auth-jwt': {
        title: 'Phone Auth + JWT',
        description: 'User onboarding validates phone numbers via SMS verification and issues JWT access/refresh tokens for authenticated APIs.'
    },
    'websocket-jwt-middleware': {
        title: 'WebSocket JWT Middleware',
        description: 'Custom `WebSocketJWTAuthMiddleware` parses token from connection cookies and injects authenticated user into ASGI scope.'
    },
    'chat-autocreate-flow': {
        title: 'Post-Auction Chat Auto Create',
        description: 'Completed auctions with winners trigger Celery task to create 1:1 chat rooms and persist message history via WebSocket consumer.'
    },
    'case-payment-state-management': {
        title: 'Case 1: Payment State Management',
        description: 'Without full frontend session/cookie integration, a user-keyed temporary state map and DB fields were used to bridge KakaoPay phases.'
    },
    'case-search-modeling-optimization': {
        title: 'Case 2: Search & Modeling Optimization',
        description: 'Search relevance and category scalability were improved using `django-filter` query composition and tree-model category refactor.'
    },
    'case-product-api-guard': {
        title: 'Case 3: Product API Guard',
        description: 'Product APIs enforce auth and auction-state business guards (owner checks, active auction constraints) to protect data integrity.'
    }
};

const mapCards = (ids) => ids.map((id) => ({
    mermaidId: id,
    title: cardMeta[id]?.title ?? id,
    description: cardMeta[id]?.description ?? '',
    learnMore: learnMoreLinks[id] ?? '#'
}));

export const templateConfig = {
    system: {
        documentTitle: 'Yohan | Realtime Auction Dashboard',
        systemName: 'REALTIME_AUCTION_V2.0'
    },

    hero: {
        sectionId: 'system-architecture',
        panelTitle: 'SYSTEM_ARCHITECTURE',
        panelUid: 'ID: RT-AUCTION-01',
        diagramId: 'realtime-auction-system-architecture',
        metrics: [
            'Runtime: Django 4 + Channels + Celery + Redis realtime auction platform',
            'Realtime Core: WebSocket bidding, room participants, max bid sync',
            'Async Core: Celery Beat auction room automation and payment/chat background jobs',
            'Payment: KakaoPay ready/approval workflow with winner-based payment generation',
            'Auth: phone-number-based user model + JWT API authentication'
        ]
    },

    topPanels: [
        {
            sectionId: 'application-map-panel',
            panelTitle: 'APPLICATION_MAP',
            panelUid: 'ID: RT-AUCTION-02',
            diagramId: 'django-channels-application-map',
            metrics: [
                'App split: user, product, auction, payment, chat, wishlist, penalty, report',
                'MY ROLE: KakaoPay payment flow implementation, search/modeling optimization, and robust product API design',
                'ASGI path: HTTP + WebSocket routed through ProtocolTypeRouter',
                'Three deep cases: payment state, search/modeling optimization, guarded product API'
            ]
        }
    ],

    skills: {
        sectionId: 'skill-set',
        panelTitle: 'SKILL_SET',
        panelUid: 'ID: STACK-MAP',
        items: [
            { title: 'BACKEND CORE', stack: 'Python, Django 4.1, DRF, Channels, Daphne' },
            { title: 'ASYNC', stack: 'Celery, Celery Beat, background task orchestration' },
            { title: 'REALTIME', stack: 'WebSocket, channel groups, async consumers' },
            { title: 'DATA', stack: 'SQLite, Redis broker/channel layer, django-mptt' },
            { title: 'AUTH', stack: 'Custom user (phone), SMS verification, JWT' },
            { title: 'INTEGRATION', stack: 'KakaoPay REST API, Naver SMS API, media upload' }
        ]
    },

    serviceSections: [
        {
            id: 'backend-services',
            title: 'BACKEND_SERVICES',
            navLabel: 'BACKEND_SERVICES',
            theme: 'blue',
            cardVisualHeight: '285px',
            cardClass: 'backend-card',
            groups: [
                {
                    title: 'REALTIME + ASYNC CORE',
                    desc: 'Auction / Concurrency / Celery / Payment / Expiration',
                    cards: mapCards([
                        'realtime-auction-flow',
                        'websocket-bid-concurrency',
                        'celery-auction-room-lifecycle',
                        'payment-kakao-ready-approval',
                        'payment-expiration-cleanup'
                    ])
                }
            ]
        },
        {
            id: 'platform-security-services',
            title: 'PLATFORM_AND_SECURITY',
            navLabel: 'PLATFORM_AND_SECURITY',
            theme: 'green',
            cardVisualHeight: '265px',
            cardClass: 'frontend-card',
            groups: [
                {
                    title: 'DOMAIN PLATFORM',
                    desc: 'Product / Auth / WebSocket Security / Chat Lifecycle',
                    cards: mapCards([
                        'product-filter-mptt',
                        'user-phone-auth-jwt',
                        'websocket-jwt-middleware',
                        'chat-autocreate-flow'
                    ])
                }
            ]
        },
        {
            id: 'core-case-studies',
            title: 'CORE_CASE_STUDIES',
            navLabel: 'CORE_CASE_STUDIES',
            theme: 'orange',
            cardVisualHeight: '275px',
            cardClass: 'devops-card',
            groups: [
                {
                    title: 'THREE DEEP CASES',
                    desc: 'Payment / Search / Product API Guard',
                    cards: mapCards([
                        'case-payment-state-management',
                        'case-search-modeling-optimization',
                        'case-product-api-guard'
                    ])
                }
            ]
        }
    ],

    contact: {
        sectionId: 'contact',
        panelTitle: 'CONTACT',
        panelUid: 'ID: CONTACT-01',
        description: 'For architecture, realtime systems, and auction-platform collaboration, use one of the channels below.',
        actions: [
            { label: 'GITHUB', href: 'https://github.com/ramyo564/realtime_auction' },
            { label: 'EMAIL', href: 'mailto:yohan032yohan@gmail.com' },
            { label: 'TEAM_REPO', href: 'https://github.com/wodnrP/realtime_auction' }
        ]
    },

    mermaid: {
        theme: 'dark',
        securityLevel: 'loose',
        fontFamily: 'Inter',
        flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'linear'
        }
    },

    diagrams
};
