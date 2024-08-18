# Product API

| HTTP method | 기능                     | end-point                    | auth required |
| ----------- | ------------------------ | ---------------------------- | ------------- |
| GET         | 낙찰상품조회             | /payments/winning-bid-list   | O             |
| POST        | 카카오페이 결제준비      | /payments/kakao-pay-ready    | O             |
| GET         | 카카오페이 결제준비 조회 | /payments/kakao-pay-ready    | O             |
| POST        | 카카오페이 결제승인      | /payments/kakao-pay-approval | O             |
| GET         | 카카오페이 결제승인 조회 | /payments/kakao-pay-approval | O             |
| GET         | 카카오페이 결제취소 조회 | /payments/kakao-pay-cancel   | O             |
| GET         | 카카오페이 결제실패 조회 | /payments/kakao-pay-fail     | O             |
| ----------- | ------------------ | ---------------------------------- | ------------- |
| GET         | 경매상품조회           | /products/all-products             | X             |
| POST        | 경매등록           | /products/new-product              | O             |
| DELETE      | 경매삭제           | /products/<str:pk>delete           | O             |
| POST        | 이미지등록         | /products/upload-images            | O             |
| GET         | 경매상품이미지조회 | /products/images/<str:products_id> | O             |
|             |                    |                                    |               |

## 반영 브런치

Yohan -> develop

## 기능 추가 사항 - 결제 (카카오페이)
---- 
**1. Payments 낙찰상품조회** - GET
- 유저가 대시보드에서 낙찰된 상품을 조회 했을 때 결제가 안된지 2일이 지났을 경우 해당 payment 삭제
	- 결제되지 않은 payment 같은 경우 참조 및 활용성이 없다고 생각해서 삭제로 구현했습니다. 
	- 현재는 15분이 지나도 결제가 안되면 삭제되게 구현되어있습니다
	- 혹시 다른 의견 있으시면 코멘트 남겨주세요 :)
- 대시보드 조회시 유저가 낙찰된 상품이 있지만 아직 payment db가 만들어 지지 않았을 경우 새로 생성

**2. Payments 카카오페이 결제준비** - POST
- 카카오페이 같은 경우 보안상 프론트에서 직접 ajax로 불가능합니다. 프론트에서 프록시를 설정하고 axios로는 가능한거 같지만 현재 프론트가 없는 관계로 쿠키,세션 및 캐싱을 쓰기 어려워 db에 저장하거나 글로벌 변수를 사용해서 해결했습니다.
- 사용자가 결제하려는 payment의 PK 값을 갖고 오기 위해서 글로벌 변수로 딕셔너리를 사용했습니다.
	- 딕셔너리를 사용한 이유는 다음과 같습니다.
		- 현재 개발환경상 토큰을 활용해 유저정보만 갖고 올 수 있는데 유저 값이 핸드폰 번호이므로 중복될 확률이 매우 적다고 생각했습니다.
		  
		  그렇게 생각한 이유는 한 사용자가 결제를 진행할 때 동시에 2개 이상 결제가 불가능한 점 
		  (한 사람이 네이버 페이, 카카오페이의 서로 다른 플랫폼을 동시에 결제하거나 카카오페이로 동시에 2개의 각각 다른 결제건을 결제하는건 불가능
		  
		- 핸드폰 번호를 바꾸지 않는 한 웬만하면 키 값이 겹칠 일 또한 없다고 생각했습니다.
		- 마지막 이유는 딕셔너리를 사용하면 많은 글로벌 변수를 설정하지 않아도 되고 시간복잡도도 O(1) 인점 등 현재 상황에서 제일 적합한 방법이라고 생각해서 딕셔너리로 결정했습니다.
		- 따라서 키 값으로 유저 값(핸드폰 번호) 벨류 값으로 payment의 pk 값을 저장했습니다.


**3. Payments 카카오페이 결제준비  조회** - GET
- 현재 프론트가 없기 때문에 POST와 GET을 따로 구현해야되고 POST를 한 후 GET을 조회해야합니다.
- 사용자가 결제하기 버튼을 눌렀을 경우 카카오 서버에서 결제 링크를 받아오는데 결제링크를 받은 후 API를 조회를 하면 통해 해당 링크를 확인할 수 있습니다.


**4. Payments 카카오페이 결제승인** - POST
- 사용자가 정상적으로 결제를 진행했을 경우 해당 API가 호출되는데 프론트가 없어서 쿼리매개변수로 받아오는 pg_token 와 글로벌 변수에 저장했던 유저의 키값을 이용해 payment pk 값을 조회해 결제 승인 부분을 해결했습니다.


**5. Payments 카카오페이 결제승인 조회**
- 이전과 같은 이유로 POST, GET을 따로 구현해야하고 POST가 진행된 뒤 GET 으로 상태조회 가능합니다.



## 결제과정
---- 
### 초기 환경 설정
- 초기설정
	- 모든 앱의 migrations 폴더 안에 `__init__.py`파일 밑에 숫자로 시작하는 파일들 삭제
		- ex) 0001.py
	- db.sqlite3 삭제
	- `python manage.py makemigrations`
	- `python manage.py migrate`
	- `python manage.py createsuperuser`
	- 위 순서로 진행하면 됩니다.
- 그 이후 레디스나 셀러리 서버를 켜주는건 이전과 동일하게 진행하면 됩니다.

`이미지 파일을 클릭하면 빨리감기가 가능합니다`
  
[![초기환경설정](https://github.com/wodnrP/realtime_auction/assets/103474568/edafc188-d48f-4430-981a-a51c5c622eea)](https://vimeo.com/1000162498?share=copy)


### 카카오페이 결제 API 사용 과정

#### 상품등록과정 + 채팅과정 (테스트 확인)

`이미지 파일을 클릭하면 빨리감기가 가능합니다`

[![상품등록및채팅과정](https://github.com/wodnrP/realtime_auction/assets/103474568/fcae8868-0122-45f9-b62f-2ea832ab6d33)](https://vimeo.com/1000164866?share=copy)

#### 카카오페이 결제과정 (테스트 확인)

`이미지 파일을 클릭하면 빨리감기가 가능합니다`

[![결제 과정](https://github.com/wodnrP/realtime_auction/assets/103474568/ad1e62af-8ec9-469d-a349-d4cbd69ae422)](https://vimeo.com/1000165433?share=copy)

##### 낙찰목록 불러오기

- 사용자가 프론트단에서 낙찰된 상태에서 payment_list (마이페이지에서 결제목록) 을 클릭을 트리거로 실시간으로 결제목록이 업데이트 됩니다. 테스트는 아래와 같습니다.
	- 결제 안하고 시간 초과
	- 결제 안했지만 아직 결제할 시간 남은 경우 (영상에서는 일괄적으로 불러와져서 전부 삭제되지만 실제로는 정상작동합니다)
	- 결제 완료
	- 낙찰자 없이 끝난 경우
- 상품이 삭제될 경우 제품도 삭제되기 때문에 다음과 같은 상황을 생각해봐야 될 것 같습니다.
	- 상대방이 결제를 했을 경우 PROTECT로 payment 데이터를 보호 하던가 최종 결제된 상품은 판매자가 해당 상품을 삭제 할 수 없도록 비공개로 해놔야함

## 프론트 테스트 파일

- payment_list.html

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <title>Payments</title>
</head>

<style>
    div {
        font-size: 30px;
        margin-bottom: 10px;
    }
    div>button {
        font-size: 20px;
    }
</style>
<body>
    <h2>Payments</h2>
    Check out your list<br>
    
    <div id="payment-list"></div>
    
    <script>
        
        const accessToken = localStorage.getItem('access');
        console.log(accessToken);
        
        // Cookie에서 특정 이름의 값을 가져오는 함수
        function getCookie(name) {
        let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
        return cookieValue;
        }
        // paymentID 쿠키 생성 ###########3
        function setCookie(name, value, days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = "expires=" + date.toUTCString();
            document.cookie = name + "=" + value + ";" + expires + ";path=/";
        }
        
        // JavaScript 함수 정의
        function payWithKakaoPay(paymentId, csrftoken) {
            console.log('Payment ID:', paymentId);
            setCookie('paymentId', paymentId, 30); // 쿠키 설정###########
            fetch('http://localhost:8000/payments/kakao-pay-ready', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                    'Cookie': 'paymentId=' + paymentId
                },
                body: JSON.stringify({ paymentId: paymentId }),

            })
            .then(response => response.json())
            .then(data => {
                // 서버로부터의 응답을 처리
                console.log('Response from server:', data);
            })
            .catch(error => {
                // 에러 처리
                console.error('Error:', error);
            });
            console.log(csrftoken);
        }

        const enterPaymentList = (payId) => {
            localStorage.setItem('payments', payId);
            location.replace('payment.html');
        }

        const PaymentList = async () => {
            const res = await fetch('http://localhost:8000/payments/winning-bid-list', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'content-type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken') // CSRF 토큰을 요청 헤더에 추가
                },
                method: 'GET'
            });

            const resJsonData = await res.json();
            console.log(resJsonData);
            
            let paymentHtml = '';
            resJsonData.forEach(payment => {
                paymentHtml += `
                    <div>
                        <span>ID: ${payment.id}</span>
                        <span>Product Name: ${payment.product_name}</span>
                        <span>Total Price: $${payment.total_price}</span>
                        <span>Payment Type: ${payment.payment_type}</span>
                        <span>Payment Date: ${payment.payment_date}</span>
                        <button onclick="payWithKakaoPay(${payment.id})">결제하기</button>
                    </div>
                `;
                
                
            });
            const paymentList = document.getElementById('payment-list');
            paymentList.innerHTML = paymentHtml;
        }

        PaymentList();

    </script>
</body>
</html>

```

- payment_approval.html

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <title>Payment Approval</title>
</head>
<body>
    <h2>Payment Approval</h2>
    <!-- 다양한 HTML 내용 -->

    <script>
        const accessToken = localStorage.getItem('access');
    
        console.log(accessToken);
        // Cookie에서 특정 이름의 값을 가져오는 함수
        function getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
        
        // URL 쿼리 매개변수 생성
        const urlParams = new URLSearchParams(window.location.search);
        const pg_token = urlParams.get('pg_token');

        if (pg_token) {
            // pg_token이 URL에 있을 경우 APIView로 POST 요청을 보냄
            fetch(`http://localhost:8000/payments/kakao-pay-approval`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken') // CSRF 토큰을 요청 헤더에 추가
                },
                body: JSON.stringify({ pg_token: pg_token }), // JSON 데이터를 요청 본문에 추가
            })
                .then(response => response.json())
                .then(data => {
                    // 서버로부터의 응답을 처리
                    console.log('Response from server:', data);
                })
                .catch(error => {
                    // 에러 처리
                    console.error('Error:', error);
                });
        } else {
            // pg_token이 없는 경우 처리
            console.error('Missing pg_token in the URL');
        }
    </script>
</body>
</html>

```




## 기능 추가 사항 - Product API
---- 
### requirements.txt 업데이트

- 라이브러리 업데이트 필요


**1. Products 경매상품조회** - GET

- /products/all-products 
- 검색기능 추가 (트라이 자료 구조)
- 카테고리 검색 필터링 (트라이 자료 구조)
- 페이지 네이션 적용
- 경매 종료가 얼마 남지 않은 순서대로 정렬
- 경매가 종료되지 않은 상품만 조회
- 경매 낙찰 후 내용 변경을 방지하기 위해 상품수정이 없음
- 이미지 URL 시리얼라이저에 추가 (여러장일 경우 모두 출력)

**2. Products 경매등록** - POST

- /products/new-product 
- 사용자 jwt로 인증 및 권한부여
- 인증된 사용자는 상품 등록 가능
	- 경매 낙찰된 후 혹은 경매진행 당시 내용 변경 방지를 위해 PUT,PATCH 기능 제외
	- 내용 수정이 필요한 경우 진행 중인 경매를 삭제후 재등록 해야함

**3. Products 경매삭제** - DELETE

- /products/<str:pk>delete    
- 본인 경매상품만 삭제 가능
- 경매가 종료되지 않았을 때만 삭제 가능

**4. Products 이미지 등록** - POST

- /products/upload-images
- 인증된 사용자 + 등록된 상품에 이미지 등록
- 로컬환경으로 구현


**5. Products 모델 리팩토링**

- 자동 경매 시작 시점 함수 구현에서 디폴트로 변경
	- 경매상품 등록하면 등록 시점부터 active 
		- 등록 후 3일 뒤 자동으로 active false
- product_content 필드 CharField -> TextField() 변경
 

**6. Categories 모델 리팩토링**

- 유지보수 용이성을 위해 카테고리를 트리 자료 구조로 변경
- 트리구조로 변경시 CategoryItem 모델은 필요 없으므로 삭제


**7. ProductImages 모델 어드민 패널 수정**

- 어드민 패널에서 썸네일로 이미지 확인 기능 추가


## 검색 기능 및 카테고리 필터링 결과 값
---- 
### /products/all-products  

#### 디폴트 결과 값

![디폴트 결과 값](https://github.com/wodnrP/realtime_auction/assets/103474568/3cfbc7da-367b-4696-9d3b-ba8872a53dae)


#### 키워드 검색

![키워드 적용](https://github.com/wodnrP/realtime_auction/assets/103474568/6e7cfc6e-cedb-4ddc-b5bd-26dfab8f390d)


#### 카테고리 적용

![카테고리 적용](https://github.com/wodnrP/realtime_auction/assets/103474568/99cf5c09-2441-41a8-9bde-1dfc82e39434)



## 어드민 패널 썸네일 적용

![어드민 패널](https://github.com/wodnrP/realtime_auction/assets/103474568/4d338d12-b95a-4e9f-9b6c-35008543ba35)







