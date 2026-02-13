export const diagrams = {
    'realtime-auction-system-architecture': `
        graph LR
        Client[Web or Mobile Client] --> Daphne[Daphne ASGI]
        Daphne --> Django[Django + DRF]
        Daphne --> Channels[Django Channels]

        Django --> SQLite[(SQLite DB)]
        Django --> Redis[(Redis Channel Layer and Broker)]
        Django --> KakaoPay[KakaoPay API]
        Django --> NaverSMS[Naver SMS API]

        Channels --> Redis
        CeleryWorker[Celery Worker] --> Redis
        CeleryBeat[Celery Beat] --> Redis
        CeleryWorker --> Django

        Django --> Media[(Media Storage)]

        classDef b fill:#161b22,stroke:#58a6ff,color:#c9d1d9
        classDef g fill:#161b22,stroke:#238636,color:#c9d1d9
        classDef o fill:#161b22,stroke:#d29922,color:#c9d1d9
        class Client,Daphne,Django,Channels b
        class SQLite,Redis,Media g
        class CeleryWorker,CeleryBeat,KakaoPay,NaverSMS o
    `,

    'django-channels-application-map': `
        graph TB
        Config[config settings and urls and asgi] --> User[user app]
        Config --> Product[product app]
        Config --> Auction[auction app]
        Config --> Payment[payment app]
        Config --> Chat[chat app]
        Config --> Wishlist[wishlist app]
        Config --> Penalty[penalty app]
        Config --> Report[report app]

        ASGI[ProtocolTypeRouter] --> HTTP[HTTP urls]
        ASGI --> WS[WebSocket routes]
        WS --> AuctionWS[ws/auction]
        WS --> ChatWS[ws/chat]

        classDef b fill:#161b22,stroke:#58a6ff,color:#c9d1d9
        class Config,User,Product,Auction,Payment,Chat,Wishlist,Penalty,Report,ASGI,HTTP,WS,AuctionWS,ChatWS b
    `,

    'realtime-auction-flow': `
        graph LR
        UserJoin[Authenticated user joins ws/auction room] --> GroupJoin[group_add auction room]
        GroupJoin --> BidEvent[bid_price event]
        BidEvent --> PersistBid[create_or_update_auction_message]
        PersistBid --> MaxCheck[update_max_price]
        MaxCheck --> Broadcast[group_send highest bid]
        Broadcast --> Clients[all room clients update]

        classDef b fill:#161b22,stroke:#58a6ff,color:#c9d1d9
        class UserJoin,GroupJoin,BidEvent,PersistBid,MaxCheck,Broadcast,Clients b
    `,

    'websocket-bid-concurrency': `
        graph TB
        ConcurrentBid[Multiple users bid at same time] --> AsyncGate[database_sync_to_async boundary]
        AsyncGate --> MessageUpsert[AuctionMessage create or update]
        MessageUpsert --> PriceCompare{bid > current final?}
        PriceCompare -- yes --> UpdateRoom[set auction_final_price and auction_winner]
        PriceCompare -- no --> KeepCurrent[ignore lower or duplicate bid]
        UpdateRoom --> Fanout[group_send new max]

        classDef b fill:#161b22,stroke:#58a6ff,color:#c9d1d9
        class ConcurrentBid,AsyncGate,MessageUpsert,PriceCompare,UpdateRoom,KeepCurrent,Fanout b
    `,

    'celery-auction-room-lifecycle': `
        graph LR
        ProductCreated[Product with auction_start_at] --> BeatTick[Celery Beat every 10s]
        BeatTick --> CheckTask[check_and_create_auction_rooms]
        CheckTask --> CreateRoom[create AuctionRoom if missing]
        CheckTask --> EndCheck[if end time passed set auction_active false]

        EndCheck --> WinnerFlow[when winner exists payment flow starts]

        classDef b fill:#161b22,stroke:#58a6ff,color:#c9d1d9
        class ProductCreated,BeatTick,CheckTask,CreateRoom,EndCheck,WinnerFlow b
    `,

    'payment-kakao-ready-approval': `
        graph TB
        WinnerList[GET winning-bid-list] --> CreatePaymentTask[create_payment_for_auction_winner task]
        CreatePaymentTask --> PaymentRow[Payments row + payment_active true]

        ClientReady[POST kakao-pay-ready] --> ReadyAPI[KakaoPay.ready]
        ReadyAPI --> SaveTid[store kakao_tid and redirect url]

        ClientApprove[POST kakao-pay-approval] --> ApprovalAPI[KakaoPay.approval]
        ApprovalAPI --> PaidFlag[set paid true and payment_type KakaoPay]

        classDef b fill:#161b22,stroke:#58a6ff,color:#c9d1d9
        class WinnerList,CreatePaymentTask,PaymentRow,ClientReady,ReadyAPI,SaveTid,ClientApprove,ApprovalAPI,PaidFlag b
    `,

    'payment-expiration-cleanup': `
        graph LR
        PendingPayments[Unpaid payments for winner] --> TimeoutCheck[payment_date + timeout compare]
        TimeoutCheck --> ExpiredDelete[delete expired unpaid rows]
        TimeoutCheck --> KeepAlive[keep valid pending rows]
        ExpiredDelete --> FreshList[return clean winning list]

        classDef b fill:#161b22,stroke:#58a6ff,color:#c9d1d9
        class PendingPayments,TimeoutCheck,ExpiredDelete,KeepAlive,FreshList b
    `,

    'product-filter-mptt': `
        graph TB
        ProductAPI[GET products/all-products] --> BaseQuery[active products ordered by auction_end_at]
        BaseQuery --> FilterSet[ProductsFilter keyword and category]
        FilterSet --> Paginator[PageNumberPagination]

        CategoryModel[Categories MPTT tree] --> ProductModel[Products.category TreeForeignKey]
        ProductModel --> Serializer[ProductsSerializer with image URLs]

        classDef b fill:#161b22,stroke:#58a6ff,color:#c9d1d9
        class ProductAPI,BaseQuery,FilterSet,Paginator,CategoryModel,ProductModel,Serializer b
    `,

    'user-phone-auth-jwt': `
        graph LR
        PhoneCheck[POST users/sms] --> SmsSend[Naver SMS send]
        SmsSend --> TempUser[save phone and auth_number]
        TempUser --> AuthCheck[POST users/auth]
        AuthCheck --> Signup[PUT users/signup]
        Signup --> Login[POST users/login]
        Login --> JWT[issue access and refresh token]

        classDef b fill:#161b22,stroke:#58a6ff,color:#c9d1d9
        class PhoneCheck,SmsSend,TempUser,AuthCheck,Signup,Login,JWT b
    `,

    'websocket-jwt-middleware': `
        graph TB
        WSConnect[WebSocket connect] --> CookieRead[read token from cookie header]
        CookieRead --> TokenParse[AccessToken decode]
        TokenParse --> ScopeUser[scope user set]
        ScopeUser --> Consumer[Auction or Chat consumer]
        TokenParse -->|invalid| Anonymous[AnonymousUser and reject]

        classDef b fill:#161b22,stroke:#58a6ff,color:#c9d1d9
        class WSConnect,CookieRead,TokenParse,ScopeUser,Consumer,Anonymous b
    `,

    'chat-autocreate-flow': `
        graph LR
        AuctionEnded[auction_active false and winner exists] --> ChatTask[create_chatting_for_completed_auctions]
        ChatTask --> ChatRoom[create Chatting one-to-one with auction]
        ChatRoom --> WSChat[ws/chat room connect]
        WSChat --> MessageSave[persist Message rows]

        classDef b fill:#161b22,stroke:#58a6ff,color:#c9d1d9
        class AuctionEnded,ChatTask,ChatRoom,WSChat,MessageSave b
    `,

    'case-payment-state-management': `
        graph TB
        Constraint[No full frontend session state in early environment] --> NeedBridge[Need ready and approval state bridge]
        NeedBridge --> TempMap[User-keyed PAYMENT_DIC temporary map]
        NeedBridge --> DbState[Persist kakao_tid and kakao_pay_url in Payments]
        TempMap --> ApprovalLookup[approval request retrieves pending payment context]
        DbState --> ApprovalLookup
        ApprovalLookup --> Result[stable payment progression under constraints]

        classDef b fill:#161b22,stroke:#58a6ff,color:#c9d1d9
        class Constraint,NeedBridge,TempMap,DbState,ApprovalLookup,Result b
    `,

    'case-search-modeling-optimization': `
        graph TB
        Problem[Slow and rigid search on growing products] --> FilterImprove[django-filter keyword and category query]
        Problem --> CategoryScale[MPTT category tree refactor]
        FilterImprove --> BetterSearch[more maintainable filter logic]
        CategoryScale --> BetterHierarchy[multi-level category querying]
        BetterSearch --> Outcome[faster and clearer product discovery]
        BetterHierarchy --> Outcome

        classDef b fill:#161b22,stroke:#58a6ff,color:#c9d1d9
        class Problem,FilterImprove,CategoryScale,BetterSearch,BetterHierarchy,Outcome b
    `,

    'case-product-api-guard': `
        graph LR
        CreateReq[Create or Delete product API call] --> AuthCheck[JWT auth and user ownership]
        AuthCheck --> StateRule[auction/product active state rule]
        StateRule --> Allowed[allow valid request]
        StateRule --> Denied[reject invalid state or unauthorized request]
        Allowed --> Integrity[data integrity preserved]
        Denied --> Integrity

        classDef b fill:#161b22,stroke:#58a6ff,color:#c9d1d9
        class CreateReq,AuthCheck,StateRule,Allowed,Denied,Integrity b
    `
};
