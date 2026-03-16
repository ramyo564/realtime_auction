import { diagrams } from './diagrams.js';
import { learnMoreLinks } from './learnmore-links.js';

const cardMeta = {
    // 1. 상품/카테고리 도메인 설계 관련
    'product-filter-mptt': {
        title: 'MPTT 트리 구조 도메인 모델링',
        description: '대규모 카테고리의 계층형 조회를 위해 MPTT 모델을 도입하고, 상품-이미지-카테고리 간의 정규화된 관계를 설계했습니다.',
        cardClass: 'backend-card'
    },
    // 2. 카카오페이 결제 연동 관련
    'payment-kakao-ready-approval': {
        title: '결제 상태 정합성 및 프로세스 구축',
        description: '카카오페이 Ready/Approval 단계 간의 상태를 브릿징하고, 결제 만료 처리 및 낙찰-결제 연결 로직을 구현했습니다.',
        cardClass: 'backend-card'
    },
    // 3. 검색 및 필터링 최적화 관련
    'case-search-modeling-optimization': {
        title: '다중 조건 검색 엔진 고도화',
        description: 'django-filter와 트리 모델을 결합하여 복합적인 검색 필터를 합성하고, 페이지네이션을 통한 대량 데이터 조회 성능을 개선했습니다.',
        cardClass: 'backend-card'
    },
    // 4. 상품 API 안정화 관련
    'case-product-api-guard': {
        title: '비즈니스 로직 가드 및 API 안정화',
        description: 'JWT 기반 인가와 더불어 상품 소유권, 경매 활성 상태 등 비즈니스 제약 조건을 API 레벨에서 강제하여 무결성을 확보했습니다.',
        cardClass: 'backend-card'
    },
    
    // 기타 보조 카드들
    'realtime-auction-flow': { title: '실시간 경매 흐름', description: 'WebSocket 기반 실시간 입찰 및 Channels 그룹 메시징 동기화 구조.', cardClass: 'frontend-card' },
    'celery-auction-room-lifecycle': { title: '경매 자동화 (Beat)', description: 'Celery Beat 기반 경매 상태 전이 및 라이프사이클 관리.', cardClass: 'frontend-card' },
    'user-phone-auth-jwt': { title: '휴대폰 인증 및 JWT', description: 'SMS 인증 및 JWT 토큰 기반의 사용자 온보딩 체계.', cardClass: 'frontend-card' },
    'payment-expiration-cleanup': { title: '결제 만료 자동 정리', description: '미결제 낙찰 내역의 주기적 감시 및 자동 삭제 로직.', cardClass: 'devops-card' }
};

const mapCards = (ids) => ids.map((id) => ({
    mermaidId: id,
    title: cardMeta[id]?.title ?? id,
    description: cardMeta[id]?.description ?? '',
    links: [
        { label: 'EVIDENCE', href: `./evidence/realtime_auction/index.html#${id}`, variant: 'primary' },
        { label: 'README', href: learnMoreLinks[id] ?? '#', variant: 'ghost' }
    ],
    cardClass: cardMeta[id]?.cardClass ?? ''
}));

export const templateConfig = {
    system: {
        documentTitle: 'Yohan | 실시간 경매 플랫폼 백엔드 아키텍트',
        systemName: 'REALTIME_AUCTION_V2.0'
    },

    hero: {
        sectionId: 'system-architecture',
        panelTitle: 'SYSTEM_ARCHITECTURE',
        panelUid: 'ID: RT-AUCTION-01',
        diagramId: 'realtime-auction-system-architecture',
        metrics: [
            '플랫폼 개요: 실시간 입찰 정합성과 자동화된 결제/채팅 라이프사이클을 제공하는 경매 서비스',
            '전체 핵심 기능: 실시간 입찰(WebSocket), 경매 자동 스케줄링(Celery), 휴대폰 인증, 카카오페이 결제, 1:1 채팅, 신고/제재 시스템',
            '시스템 구성: ASGI 통합 라우팅, 비동기 태스크 큐, 트리 구조 데이터 모델링 기반 대규모 조회 최적화'
        ],
        quickLinks: [
            { label: 'GITHUB_REPO', href: 'https://github.com/ramyo564/realtime_auction', variant: 'primary' },
            { label: 'PROBLEM_SOLVING', href: 'https://ramyo564.github.io/realtime_auction-portfolio/', variant: 'secondary' },
            { label: 'PORTFOLIO_HUB', href: 'https://ramyo564.github.io/Portfolio/', variant: 'ghost' }
        ]
    },

    topPanels: [
        {
            sectionId: 'application-map-panel',
            panelTitle: 'PROJECT_CONTEXT_AND_MY_CONTRIBUTIONS',
            panelUid: 'ID: RT-AUCTION-02',
            diagramId: 'django-channels-application-map',
            navLabel: '프로젝트 개요 및 기여',
            metrics: [
                '참여 정보: 백엔드 4인 팀 프로젝트 (2023.09 ~ 2024.11)',
                '본인 수행 역할: 상품/카테고리 도메인 설계, 카카오페이 결제 연동, 검색 및 필터링 최적화, 상품 API 안정화',
                '핵심 기여: MPTT 트리 카테고리 구축, 결제 상태 전이 모델링, 검색 엔진 성능 개선, 비즈니스 제약 가드 설계',
                '기술 가치: 전체 시스템 중 "데이터 무결성"과 "결제 안정성" 파트의 엔진을 설계하고 구현함'
            ]
        }
    ],

    skills: {
        sectionId: 'skill-set',
        panelTitle: 'SKILL_SET',
        panelUid: 'ID: STACK-MAP',
        items: [
            { title: 'BACKEND CORE', stack: 'Python, Django 4.1, DRF, Daphne' },
            { title: 'DOMAIN DESIGN', stack: 'MPTT 트리 모델, 관계형 데이터 모델링, 비즈니스 가드' },
            { title: 'PAYMENT', stack: '카카오페이 API 연동, 결제 라이프사이클 관리, 만료 로직' },
            { title: 'SEARCH & FILTER', stack: 'django-filter, 다중 조건 쿼리 합성, 페이지네이션' },
            { title: 'ASYNC & REALTIME', stack: 'Celery, Celery Beat, WebSocket, Channels' },
            { title: 'SECURITY', stack: 'JWT 인증, 권한 기반 접근 제어, 데이터 무결성 보호' }
        ]
    },

    serviceSections: [
        {
            id: 'backend-services',
            title: 'CORE_ENGINEERING_CASES',
            navLabel: '핵심 기여 사례',
            theme: 'blue',
            cardVisualHeight: '285px',
            cardClass: 'backend-card',
            recruiterBrief: {
                kicker: 'ARCHITECTURE_QUICK_SCAN',
                title: '실시간 경매 플랫폼 핵심 설계 요약 (본인 기여 중심)',
                cases: [
                    {
                        id: 'Modeling',
                        anchorId: 'product-filter-mptt',
                        title: '상품/카테고리 도메인 설계',
                        problem: '대규모 카테고리의 무분별한 DB 조회 및 계층 구조 관리의 어려움',
                        action: 'MPTT 기반 트리 모델 도입 및 상품-이미지-카테고리 관계 정규화',
                        impact: '카테고리 조회 성능 최적화 및 도메인 모델 확장성 확보'
                    },
                    {
                        id: 'Payment',
                        anchorId: 'payment-kakao-ready-approval',
                        title: '카카오페이 결제 연동 및 안정화',
                        problem: '외부 결제 이탈 시 상태 유실 및 미결제 낙찰 상품의 처리 부재',
                        action: 'TID 기반 상태 전이 브릿징 및 2일 경과 미결제 건 자동 만료 로직 구현',
                        impact: '결제 정합성 확보 및 낙찰 후 거래 성사율 향상'
                    },
                    {
                        id: 'Search',
                        anchorId: 'case-search-modeling-optimization',
                        title: '검색 및 필터링 최적화',
                        problem: '다양한 검색 조건 증가에 따른 쿼리 파편화 및 응답 속도 저하',
                        action: 'django-filter 쿼리 합성 최적화 및 인덱스 고려 카테고리 필터링 구현',
                        impact: '유연한 검색 인터페이스 제공 및 대량 데이터 조회 사용성 개선'
                    },
                    {
                        id: 'Stability',
                        anchorId: 'case-product-api-guard',
                        title: '상품 API 안정화 및 보안 가드',
                        problem: '비인가 사용자의 상품 수정 및 경매 상태 무관한 접근 리스크',
                        action: 'JWT 인가 필터와 상품 소유권/경매 활성 상태 검증 가드 통합',
                        impact: '비정상 접근 100% 차단 및 API 데이터 무결성 보장'
                    }
                ]
            },
            groups: [
                {
                    title: 'CORE CONTRIBUTIONS',
                    desc: '본인이 직접 설계하고 구현한 핵심 도메인 영역',
                    cards: mapCards([
                        'product-filter-mptt',
                        'payment-kakao-ready-approval',
                        'case-search-modeling-optimization',
                        'case-product-api-guard'
                    ])
                }
            ]
        },
        {
            id: 'supporting-features',
            title: 'SUPPORTING_FEATURES',
            navLabel: '보조 기능 및 시스템',
            theme: 'green',
            cardVisualHeight: '265px',
            cardClass: 'frontend-card',
            groups: [
                {
                    title: 'PLATFORM INFRA',
                    desc: '경매 자동화 및 인증 체계',
                    cards: mapCards([
                        'realtime-auction-flow',
                        'celery-auction-room-lifecycle',
                        'user-phone-auth-jwt',
                        'payment-expiration-cleanup'
                    ])
                }
            ]
        }
    ],

    contact: {
        sectionId: 'contact',
        panelTitle: 'CONTACT',
        panelUid: 'ID: CONTACT-01',
        description: '실시간 아키텍처 및 경매 플랫폼 관련 협업을 위해 아래 채널로 연락 부탁드립니다.',
        actions: [
            { label: 'GITHUB_REPO', href: 'https://github.com/ramyo564/realtime_auction' },
            { label: 'EVIDENCE', href: `./evidence/realtime_auction/index.html` },
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
