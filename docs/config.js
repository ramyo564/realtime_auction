import { diagrams } from './diagrams.js';
import { learnMoreLinks } from './learnmore-links.js';

const cardMeta = {
    'realtime-auction-flow': {
        title: '실시간 경매 흐름',
        description: 'WebSocket을 통해 경매장에 참여하며, Channels의 그룹 메시징을 통해 입찰 상태가 실시간으로 동기화됩니다.',
        cardClass: 'backend-card'
    },
    'websocket-bid-concurrency': {
        title: '입찰 동시성 제어',
        description: 'database_sync_to_async와 방별 최고가 업데이트 로직을 통해 동시 입찰 상황에서도 최고가 정합성을 유지합니다.',
        cardClass: 'backend-card'
    },
    'celery-auction-room-lifecycle': {
        title: '경매 라이프사이클 자동화',
        description: 'Celery Beat가 상품 일정을 주기적으로 확인하여 경매방을 자동 생성하고 종료 시간에 맞춰 활성화 상태를 제어합니다.',
        cardClass: 'backend-card'
    },
    'payment-kakao-ready-approval': {
        title: '카카오페이 준비/승인',
        description: '결제 준비와 승인 단계를 트랜잭션 컨텍스트(kakao_tid)와 사용자 기반 조회를 통해 연결하여 결제 프로세스를 완성합니다.',
        cardClass: 'backend-card'
    },
    'payment-expiration-cleanup': {
        title: '결제 만료 정리',
        description: '미결제 낙찰자의 결제 내역을 확인하고 타임아웃 시 만료된 기록을 제거하여 데이터 적체를 방지합니다.',
        cardClass: 'backend-card'
    },
    'product-filter-mptt': {
        title: '상품 필터 및 MPTT 카테고리',
        description: 'django-filter를 활용한 키워드 검색과 트리 기반 카테고리 모델링(django-mptt)을 결합하여 조회 효율을 높였습니다.',
        cardClass: 'frontend-card'
    },
    'user-phone-auth-jwt': {
        title: '휴대폰 인증 및 JWT',
        description: 'SMS 기반 휴대폰 번호 검증을 통한 가입 절차와 인증된 API 접근을 위한 JWT Access/Refresh 토큰 체계를 구축했습니다.',
        cardClass: 'frontend-card'
    },
    'websocket-jwt-middleware': {
        title: 'WebSocket JWT 미들웨어',
        description: '쿠키에서 토큰을 파싱하여 ASGI 스코프에 인증된 사용자를 주입하는 커스텀 WebSocketJWTAuthMiddleware를 구현했습니다.',
        cardClass: 'frontend-card'
    },
    'chat-autocreate-flow': {
        title: '경매 종료 후 채팅 자동 생성',
        description: '낙찰자가 결정된 경매 종료 시 Celery 태스크가 1:1 채팅방을 자동 생성하고 메시지 이력을 보존합니다.',
        cardClass: 'frontend-card'
    },
    'case-payment-state-management': {
        title: '케이스 1: 결제 상태 관리',
        description: '프론트엔드 세션 통합 없이 사용자 키 기반 임시 상태 맵과 DB 필드를 활용하여 카카오페이의 각 단계를 브릿지했습니다.',
        cardClass: 'devops-card'
    },
    'case-search-modeling-optimization': {
        title: '케이스 2: 검색 및 모델링 최적화',
        description: 'django-filter 쿼리 합성 및 카테고리 트리 모델 개편을 통해 검색 관련성 및 카테고리 확장성을 개선했습니다.',
        cardClass: 'devops-card'
    },
    'case-product-api-guard': {
        title: '케이스 3: 상품 API 가드',
        description: '권한 및 경매 상태(소유자 체크, 활성 상태 제약 등)에 대한 비즈니스 가드를 적용하여 데이터 무결성을 보호합니다.',
        cardClass: 'devops-card'
    }
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
            '런타임: Django 4 + Channels + Celery + Redis 실시간 경매 플랫폼',
            '실시간 코어: WebSocket 기반 입찰, 참여자 관리, 최고가 동기화',
            '비동기 코어: Celery Beat 기반 경매 자동화 및 결제/채팅 백그라운드 작업',
            '결제 통합: 카카오페이 준비/승인 워크플로우 및 낙찰자 결제 생성',
            '인증 체계: 휴대폰 번호 기반 사용자 모델 및 JWT API 인증'
        ]
    },

    topPanels: [
        {
            sectionId: 'application-map-panel',
            panelTitle: 'APPLICATION_MAP',
            panelUid: 'ID: RT-AUCTION-02',
            diagramId: 'django-channels-application-map',
            navLabel: '앱 구조',
            metrics: [
                '앱 분리: user, product, auction, payment, chat, wishlist, penalty, report',
                '수행 역할: 카카오페이 결제 연동, 검색 및 카테고리 모델링 최적화, 상품 API 안정화',
                'ASGI 경로: HTTP와 WebSocket 요청을 ProtocolTypeRouter로 통합 라우팅',
                '주요 사례: 결제 상태 관리, 검색 엔진 고도화, 비즈니스 로직 가드 설계'
            ]
        }
    ],

    skills: {
        sectionId: 'skill-set',
        panelTitle: 'SKILL_SET',
        panelUid: 'ID: STACK-MAP',
        items: [
            { title: 'BACKEND CORE', stack: 'Python, Django 4.1, DRF, Channels, Daphne' },
            { title: 'ASYNC', stack: 'Celery, Celery Beat, 백그라운드 태스크 오케스트레이션' },
            { title: 'REALTIME', stack: 'WebSocket, 채널 그룹, 비동기 컨슈머' },
            { title: 'DATA', stack: 'SQLite, Redis 브로커/채널 레이어, django-mptt' },
            { title: 'AUTH', stack: '커스텀 사용자(전화번호), SMS 인증, JWT' },
            { title: 'INTEGRATION', stack: '카카오페이 API, 네이버 SMS API, 미디어 업로드' }
        ]
    },

    serviceSections: [
        {
            id: 'backend-services',
            title: 'BACKEND_SERVICES',
            navLabel: '백엔드 서비스',
            theme: 'blue',
            cardVisualHeight: '285px',
            cardClass: 'backend-card',
            recruiterBrief: {
                kicker: 'ARCHITECTURE_QUICK_SCAN',
                title: '실시간 경매 및 결제 시스템 설계 요약',
                cases: [
                    {
                        id: 'Concurrency',
                        anchorId: 'websocket-bid-concurrency',
                        title: '실시간 입찰 정합성 보장',
                        problem: '동시 입찰 시 최고가 업데이트 레이스 컨디션 위험',
                        action: 'DB 트랜잭션 동기화 및 방별 최고가 검증 로직 적용',
                        impact: '실시간 최고가 갱신 데이터 무결성 확보'
                    },
                    {
                        id: 'Automation',
                        anchorId: 'celery-auction-room-lifecycle',
                        title: '경매 라이프사이클 자동화',
                        problem: '수천 개의 상품 경매 상태 수동 전환 불가능',
                        action: 'Celery Beat 기반 스케줄링 및 상태 전이 태스크 체인 구축',
                        impact: '경매 시작/종료 및 낙찰 처리 완전 자동화'
                    },
                    {
                        id: 'Payment',
                        anchorId: 'payment-kakao-ready-approval',
                        title: '결제 상태 브릿징 설계',
                        problem: '외부 결제 플랫폼 이동 시 상태 보존 및 리다이렉트 처리 이슈',
                        action: '사용자 스코프 TID 관리 및 결제 성공/실패 상태 전이 모델링',
                        impact: '낙찰-결제-채팅 연결로 이어지는 안정적인 트랜잭션 완성'
                    },
                    {
                        id: 'Search',
                        anchorId: 'case-search-modeling-optimization',
                        title: '대규모 카테고리 조회 최적화',
                        problem: '트리 구조 카테고리의 반복적 DB 조회 성능 저하',
                        action: 'MPTT 기반 계층형 모델 도입 및 검색 필터 합성 최적화',
                        impact: '조회 성능 향상 및 유연한 검색 인터페이스 제공'
                    }
                ]
            },
            groups: [
                {
                    title: 'REALTIME + ASYNC CORE',
                    desc: '경매 / 동시성 / Celery / 결제 / 만료 처리',
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
            navLabel: '플랫폼 및 보안',
            theme: 'green',
            cardVisualHeight: '265px',
            cardClass: 'frontend-card',
            groups: [
                {
                    title: 'DOMAIN PLATFORM',
                    desc: '상품 / 인증 / WebSocket 보안 / 채팅 수명주기',
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
            navLabel: '핵심 케이스 스터디',
            theme: 'orange',
            cardVisualHeight: '275px',
            cardClass: 'devops-card',
            groups: [
                {
                    title: 'THREE DEEP CASES',
                    desc: '결제 / 검색 / 상품 가드',
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
        description: '실시간 아키텍처 및 경매 플랫폼 관련 협업을 위해 아래 채널로 연락 부탁드립니다.',
        actions: [
            { label: 'GITHUB', href: 'https://github.com/ramyo564/realtime_auction' },
            { label: 'EVIDENCE', href: './evidence/realtime_auction/index.html' },
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
