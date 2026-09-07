import { diagrams } from './diagrams.js';

/**
 * Realtime Auction Architecture Deep-Dive Configuration (DTO)
 * Awwwards-Standard Swiss Minimalist Specification
 */
export const portfolioConfig = {
    brand: 'YOHAN · REALTIME AUCTION ARCHITECTURE',
    navLinks: [
        { label: 'Architecture Cases', href: '#cases' },
        { label: 'Problem Solving Portfolio ↗', href: 'https://ramyo564.github.io/realtime_auction-portfolio/', target: '_blank' },
        { label: 'GitHub ↗', href: 'https://github.com/ramyo564/realtime_auction', target: '_blank' },
        { label: 'Contact', href: 'mailto:yohan032yohan@gmail.com' }
    ],
    hero: {
        kicker: 'Realtime Auction Architecture Deep-Dive',
        headline: 'SYSTEM ARCHITECTURE.<br>ASGI CHANNELS & CELERY PIPELINE.<br>DATA INTEGRITY BLUEPRINT.',
        description: 'Django Channels(ASGI) 실시간 입찰 통신, Celery Beat 기반 경매 라이프사이클 무인 자동화, 카카오페이 결제 상태 관리 및 MPTT 카테고리 트리 도메인 설계를 기계적으로 분석한 엔지니어링 아키텍처 문서입니다.',
        killerMetrics: [
            { number: 'ASGI Core', label: 'WebSocket Pipeline', desc: 'Daphne + Channels + Redis Broker' },
            { number: 'Automated', label: 'Periodic Workers', desc: 'Celery Beat 10초 주기 상태 전이' },
            { number: 'Zero Gap', label: 'Payment State', desc: 'KakaoPay Ready-Approval 브릿징' },
            { number: 'Tree Arch', label: 'MPTT Domain', desc: '계층형 카테고리 트리 모델링' }
        ]
    },
    sectionIntro: {
        tag: 'Architecture Blueprint',
        headline: '도메인 설계 및 시스템 아키텍처 명세',
        hint: '다이어그램을 클릭하면 고해상도 벡터 원본으로 확대 검증할 수 있습니다.'
    },
    cases: [
        {
            number: '01',
            category: 'DOMAIN ARCHITECTURE',
            period: '2023.11',
            shortTitle: 'MPTT 카테고리 트리 모델링',
            highlightMetric: '계층형 트리 탐색 최적화',
            title: 'MPTT 트리 구조 도메인 모델링 및 정규화된 엔티티 설계',
            summary: '대규모 카테고리의 계층형 조회를 위해 django-mptt 모델을 도입하고, 상품-이미지-카테고리 간의 정규화된 관계를 설계하여 깊은 카테고리 트리 조회 성능을 극대화했습니다.',
            metrics: [
                { label: 'TREE ALGORITHM', value: 'Modified Preorder Tree Traversal (MPTT)', highlight: true },
                { label: 'ENTITY RELATION', value: 'Products - ProductImages - Categories 정규화' },
                { label: 'QUERY EFFICIENCY', value: '재귀 쿼리 제거 및 단일 쿼리 트리 인출' }
            ],
            evidence: [
                {
                    tag: 'ARCHITECTURE',
                    title: 'MPTT 카테고리 트리 구조 및 상품 모델링 관계도',
                    mermaidId: 'product-filter-mptt'
                }
            ],
            detailLink: 'https://github.com/ramyo564/realtime_auction/blob/main/product/models.py',
            detailLinkLabel: '도메인 모델 소스 코드 보기 ↗'
        },
        {
            number: '02',
            category: 'PAYMENT ARCHITECTURE',
            period: '2023.11',
            shortTitle: '카카오페이 결제 정합성 브릿지',
            highlightMetric: '결제 준비-승인 단절 방지',
            title: '카카오페이 Ready/Approval 결제 상태 정합성 및 프로세스 구축',
            summary: '외부 PG사와의 연동에서 사용자 이탈 시 발생하는 상태 단절을 방지하기 위해 사용자 식별자 기반 매핑 브릿지를 구현하고, 결제 만료 시 낙찰 상품 재오픈 처리를 표준화했습니다.',
            metrics: [
                { label: 'PG INTEGRATION', value: 'KakaoPay Ready / Approval 2-Phase 표준화', highlight: true },
                { label: 'STATE RESOLUTION', value: '사용자 키 매핑 기반 트랜잭션 동기화' },
                { label: 'EXPIRATION', value: '미결제 상태 주기적 감시 및 타임아웃 롤백' }
            ],
            evidence: [
                {
                    tag: 'ARCHITECTURE',
                    title: '카카오페이 Ready-Approval 상태 전이 및 정합성 파이프라인',
                    mermaidId: 'payment-kakao-ready-approval'
                }
            ],
            detailLink: 'https://github.com/ramyo564/realtime_auction/blob/main/payment/views.py',
            detailLinkLabel: '결제 연동 소스 코드 보기 ↗'
        },
        {
            number: '03',
            category: 'SEARCH OPTIMIZATION',
            period: '2023.11',
            shortTitle: 'django-filter 다중 조건 검색',
            highlightMetric: '복합 검색 파라미터 보존',
            title: 'django-filter 및 MPTT 트리 모델 결합 다중 조건 검색 엔진 최적화',
            summary: '키워드, 카테고리, 경매 마감 시점 등 다중 필터 조건을 django-filter로 모듈화하여 뷰 계층의 분기문을 제거하고, 페이징과 결합하여 대량 데이터 조회 성능을 개선했습니다.',
            metrics: [
                { label: 'FILTER ENGINE', value: 'django-filter 기반 단일 엔드포인트 표준화', highlight: true },
                { label: 'CONDITION CHAIN', value: 'keyword icontains + category MPTT + end_at' },
                { label: 'PAGING', value: 'PageNumberPagination 메모리 보호' }
            ],
            evidence: [
                {
                    tag: 'ARCHITECTURE',
                    title: '다중 조건 필터 조합 및 페이징 쿼리 파이프라인',
                    mermaidId: 'case-search-modeling-optimization'
                }
            ],
            detailLink: 'https://github.com/ramyo564/realtime_auction/blob/main/product/filters.py',
            detailLinkLabel: '검색 엔진 소스 코드 보기 ↗'
        },
        {
            number: '04',
            category: 'SYSTEM TOPOLOGY',
            period: '2023.12',
            shortTitle: '통합 시스템 및 비동기 워커 토폴로지',
            highlightMetric: 'ASGI + Celery Beat 통합',
            title: 'Daphne ASGI 실시간 소켓 및 Celery Beat 비동기 워커 통합 아키텍처',
            summary: '클라이언트의 HTTP 요청과 WebSocket 실시간 통신을 Daphne ASGI 서버로 통합 라우팅하고, Redis 브로커를 공유하는 Celery Worker 및 Celery Beat 스케줄러로 무인 경매 시스템을 완성했습니다.',
            metrics: [
                { label: 'ASGI RUNTIME', value: 'Daphne + Django Channels + Redis Broker', highlight: true },
                { label: 'WORKER QUEUE', value: 'Celery Worker (Task) + Celery Beat (Scheduler)' },
                { label: 'PERSISTENCE', value: 'SQLite / Media / External API(KakaoPay, SMS)' }
            ],
            evidence: [
                {
                    tag: 'ARCHITECTURE',
                    title: '실시간 경매 플랫폼 통합 시스템 아키텍처 및 데이터 흐름',
                    mermaidId: 'realtime-auction-system-architecture'
                }
            ],
            detailLink: 'https://github.com/ramyo564/realtime_auction/blob/main/config/asgi.py',
            detailLinkLabel: 'ASGI 설정 소스 코드 보기 ↗'
        }
    ],
    diagrams
};
