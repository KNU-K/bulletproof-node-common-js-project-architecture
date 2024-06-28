# 😊 bulletproof-node.js-project-architecture-ko (Korean Version)

> Santiage Quinteros 의 "Bulletproof node.js project architecture" 를 기반하여 한글버전으로 doc를 작성한다.

## 목차

1. [서론](#서론)
2. [폴더 구조 🏢](#폴더-구조-🏢)
    - [일반적인 형태의 구조](#일반적인-형태의-구조)
    - [폴더 설명](#폴더-설명)
3. [3 Layer Architecture 🥪](#3-layer-architecture-🥪)
    - [비즈니스 로직을 Controllers에 넣지 말자](#비즈니스-로직을-controllers에-넣지-말자)
    - [비즈니스 로직은 Service Layer에 넣자 💼](#비즈니스-로직은-service-layer에-넣자-💼)
4. [DI(Dependency Injection) 💉](#di-dependency-injection-💉)
5. [단위 테스트는 선택이 아닌 필수 🕵️‍♂️](#단위-테스트는-선택이-아닌-필수-🕵️‍♂️)
6. [Pub/Sub Layer도 사용하자 🎙️](#pubsub-layer도-사용하자-🎙️)
7. [Cron 작업과 반복적인 작업 ⏰](#cron-작업과-반복적인-작업-⏰)
8. [설정과 Secrets ⚙️](#설정과-secrets-⚙️)
9. [로더 🏗️](#로더-🏗️)

## 서론

Express.js는 Node.js REST API를 만들기위한 좋은 프레임워크이다. 그러나 당신이 Node.js Project를 구성할 때 어떠한 **단서**도 주지않는다.

대수롭지않게 넘어갈 수도 있지만, Santiage는 이를 "Real Problem"으로 말을 했다.

당신의 Node.js 프로젝트 구조의 정확한 설계는 그냥 좋은 습관으로 여겨지면 안된다. 그 것은 **"Game-change"** 로써, 판도를 뒤바꿀 포인트라는 것이다.정확한 설계를 하는 것은 코드의 중복을 방지하고 안정성을 높이며 서비스 확장 가능성을 열어준다.

해당 Document는 Santiage Quintero 라는 개발자가 수년간 경험하고 연구한 결과물을 기반으로 작성된다.

## 폴더 구조 🏢

### 일반적인 형태의 구조

본 필자는 아래와 같은 폴더구조를 지향한다. (무조건적인것은 아님. 설계방식에 따라 달라질 수 있음)

```
    src
    | app.js
    | server.js
    ├─api
    |  └─ controllers
    |  └─ middlewares
    |  └─ routes
    ├─config
    ├─jobs
    ├─loaders
    ├─models
    ├─services
    └─subscribers
```

### 폴더 설명

| 요소          | 설명                                                                    |
| ------------- | ----------------------------------------------------------------------- |
| `app.js`      | Application 진입점                                                      |
| `server.js`   | Server configuration and setup.                                         |
| `api`         | Application의 모든 엔드 포인트에 대한 route controller                  |
| `config`      | 환경 변수 및 구성 관련 파일                                             |
| `jobs`        | Application에서 주기적이거나 특정 이벤트에 따라 실행되는 작업 정의 관리 |
| `loaders`     | 시작 프로세스 모듈로 분리                                               |
| `models`      | 데이터베이스 모델과 스키마                                              |
| `services`    | 모든 비즈니스 로직이 포함된 파일                                        |
| `subscribers` | 비동기 작업을 위한 이벤트 핸들러                                        |

이는 파일을 깔끔하게 하는 것 이상의 의미를 가진다.

## 3 Layer architecture 🥪

해당 아이디어는 principle of separation of concerns(관심사 분리 원칙)을 활용하여 Node.js API 라우트에서 비즈니스 로직을 분리한다.

![https://www.softwareontheroad.com/ideal-nodejs-project-structure/](./images/3-layer-architecture.png)

### 비즈니스 로직을 Controllers에 넣지 말자

Express.js Controller에 비즈니스 로직을 포함하는 것은 편리할 수도 있다. 하지만 이는 스파게티 코드가 될 수 있는 지름길이다. 또한 Unit Test를 작성해야할 때는 복잡한 Mock 객체들을 다루어야 할 가능성이 높다.

또한, 클라이언트에게 응답을 보낸 후에도 추가적인 처리를 해야 할 경우가 있는데, 이런 상황을 적절하게 제어하기 어려울 수도 있다.

아래에 **나쁜 예시**를 알아보자.(본 저자의 코드와 약간의 차이가 있을 수도 있음)

```javascript
route.post('/', async (req, res, next) => {
    const requestDTO = req.body;

    //비즈니스 로직 - 인증 관련 (대략 300줄)
    //비즈니스 로직 - 가입 관련 (대략 100줄)
    //기타 작업 - 메일 보내기 (대략 10줄)
      .
      .
      .
    //responseDTO 획득
    res.json(responseDTO)
});
```

여러 기능들이 분리 되어있지 않고, 한 곳에 군집해서 존재한다면 여러 문제가 생길 수 있다.

1. 가독성 문제
2. Unit 단위로의 테스트를 필요로 할 때 의존성이 과하게 들어감.

### 비즈니스 로직은 Service Layer에 넣자 💼

서비스 계층에 비즈니스 로직을 위치시킴으로써, 다음과 같은 이점을 얻을 수 있다.

-   **단위 테스트 용이성**

    서비스 계층에 비즈니스 로직을 집중시킴으로써, 각 비즈니스 기능을 최소 단위로 테스트할 수 있다. 이는 각 서비스 메서드를 독립적으로 테스트하고 검증할 수 있는 기회를 제공한다.

-   **코드의 모듈화와 재사용성**

    서비스 계층에 비즈니스 로직을 구현하면, 이를 여러 컨트롤러나 다른 서비스에서 쉽게 재사용할 수 있다. 이는 코드의 중복을 줄이고 유지보수성을 향상시킨다.

-   **SQL과의 분리**

    서비스 계층에서는 SQL 쿼리와 같은 데이터베이스 접근 관련 로직을 직접 다루지 않아야 한다. 이는 서비스 계층이 비즈니스 로직에 집중할 수 있도록 하며, DAO(Data Access Object)를 이용하여 데이터베이스와의 상호작용을 추상화하는 것이 좋다.

-   **트랜잭션 관리**

    여러 데이터베이스 작업을 하나의 비즈니스 트랜잭션으로 묶는 등의 트랜잭션 관리도 서비스 계층에서 처리할 수 있다. 이는 데이터 일관성을 유지하고 예외 상황을 처리하는 데 유리하다.

-   **서비스의 응집도 높이기**

    서비스 계층은 비즈니스 요구사항에 집중하여 구현되므로, 시스템의 각 계층이 명확히 분리되고 각 계층이 자신의 역할에 집중할 수 있도록 도와준다.

따라서 서비스 계층에 비즈니스 로직을 중심으로 설계함으로써 코드의 품질을 향상시키고 유지보수성을 개선할 수 있다. 아래의 예시를 참조하자.

```cjs
/** Controller **/
route.post('/', authMiddleware, async (req, res, next) => {
    try {
        const requestDTO = req.body

        const responseDTO = await authService.join(requestDTO)
        await mailService.sendWelcomeMail()

        res.json(responseDTO)
    } catch (err) {
        next(err)
    }
})


/** Service (authService만 간단하게 예시) **/
module.exports = class AuthService{
          .
          .
          .
  async join(user){
    //join 동작 진행
  }
}
```

위의 코드에서 Service와 middleware를 통해서 Controller 자체의 구문이 훨씬 간결해진 것을 알 수 있다.

## DI(Dependency Injection) 💉

DI 또는 Ioc 클래스나 함수의 종속성을 생성자를 통해 주입 또는 전달하여 코드의 구성에 도움이 되는 일반적인 패턴이다.

이렇게하면 단위 테스트를 작성할 때 해당 테스트를 당하는 객체가 다른 Context 에서 사용될 때, `호환이 가능한 종속성`을 주입하여 보다 쉽게 동작에 대한 테스트를 진행할 수 있다.

-   DI가 없는 코드

    ```cjs
    const UserModel = require('../models/user')
    class UserService {
        constructor() {}
        join() {
            //UserModel을 직접적으로 사용
        }
    }
    ```

    이 형태는 만약 테스트를 하게 된다면, UserModel을 무조건적으로 의존할 수 밖에 없는 형태가 된다.

-   수동 종속성 주입을 사용하는 코드

    ```cjs
    const UserModel = require('../models/user')
    class UserService {
        /**
         * @param {UserModel} userModel
         **/
        constructor(userModel) {
            this.userModel = userModel
        }
        join(user) {
            //this.userModel 을 사용하여 비즈니스 로직 구성
            const newUser = new this.userModel(user)
            newUser.save()
        }
    }
    ```

    이러한 형태로 구성하게 되면, userModel 이 생성자에 주입되기 때문에, 테스트할 때 `호환 가능한 객체`를 주입하기만하면, 비즈니스 로직이 정상적으로 동작하는지 알 수 있다.

    아래는 테스트에 대한 예시이다.

    ```cjs
    const UserModel = require("./models/user)
    describe("UserService Test",()=>{
        beforeEach(()=>{
            UserModel.mockClear()
        })
        it("join function test",async()=>{
            const mockUserModelInstance = {
                save:jest.fn().mockResolvedValue();
            }
          UserModel.mockImplementation(() => mockUserModelInstance)

          const userService = new UserService(UserModel);
          //userService.save() 동작을 확인하여 테스트를 할 수 있다.
        })

    })
    ```

    위와 같은 형태로 테스트를 진행하게 되면 UserModel에 영향을 받지않고, 오로지 userService만을 테스트할 수 있게 된다.

    `typedi`라는 라이브러리를 활용하면, Container를 통해서 보다 쉽게 의존성을 주입 할 수 있다.

    > this가 undefined가 되는 문제를 주의해야한다. (bind 로직이나, arrow 함수를 사용하여 this 를 명시적으로 보여줘야한다.)

## 단위 테스트는 선택이 아닌 필수 🕵️‍♂️

단위 테스트라는 것은 윗부분에서도 설명했지만, 굉장히 중요한 부분이라고 생각이 된다. 이 부분은 아직까지도 논쟁이 많은 부분이지만, unit 에 대한 부분이 정확히 동작하는 간단하고 빠른 방법이 테스트 작성이라는 것은 알고 있으면 좋을 것 같다.

> 현재 정리에서는 mock 라이브러리를 사용하고 있지만, mock을 라이브러리를 통해 구현하는 것은 절대적인 필수 요소가 아니다.

이는 해당 레파지토리의 test 폴더를 참조하여 학습하면 좋을 것 같다.

## Pub/Sub Layer도 사용하자 🎙️

일반적으로 3-Layered-Architecture 만을 고수할 수 있지만, 그 방법은 좋지않은 방법이다.

간단한 서비스 호출 로직이 있디고 가정하자. 해당 로직이 1~2개일 때는 문제가 되지는 않지만, 추후 서비스가 확장 됨에 따라서 해당 서비스 객체는 1000줄이 넘는 그런 코드가 만들어진다.

이는 SOLID 원칙에서 `SRP (단일 책임의 원칙)`에 위배된다.

그렇기 때문에 코드를 유지하면서, 관리할 수 있도록 해당 서비스 호출에 대한 부분을 분리 해주면 좋다.

event 에 대한 handler 와 listener , publishers 와 subscribes 또는 provider와 consumer 등의 관계로 이를 표현 할 수 있다.

이제 아래의 간단한 예제 의사코드를 보자.

```cjs
//Publisher
class Publisher {
    constructor(queue) {
        this.queue = queue
    }
    publish = async (events, act) => {
        queue.add(events, act)
        //event 를 등록할 수 있다.
    }
}
```

```cjs
//Subscriber
class UserSubscriber {
    constructor(queue) {
        this.queue = queue
        this.initialize()
    }

    processJob = async (job) => {
        const { name, data } = job
        try {
            switch (name) {
                case 'event1':
                    await this.handleEvent1(data)
                    break
                case 'event2':
                    await this.handleEvent2(data)
                    break
                default:
                    console.error(`Unknown event: ${name}`)
            }
        } catch (error) {
            console.error(`Failed to process job ${job.id}:`, error)
        }
    }

    async handleEvent1(data) {
        console.log(`${data}`)
        // 해당 이벤트에 필요한 작업을 상세하게 표기할 수 있습니다.
    }

    async handleEvent2(data) {
        console.log(`${data}`)
        // 해당 이벤트에 필요한 작업을 상세하게 표기할 수 있습니다.
    }

    initialize() {
        const events = ['event1', 'event2']
        events.forEach((event) => {
            this.queue.process(event, this.processJob)
        })

        this.queue.on('completed', (job) => {
            console.log(`Completed job: ${job.id}`)
        })

        this.queue.on('failed', (job, err) => {
            console.log(`Failed job: ${job.id} with error: ${err.message}`)
        })
    }
}
```

이는 간단한 `pub/sub 패턴`의 예시이다. 해당 구조는 무조건적인 요소는 아니다. 필요에 따라 구조의 변경을 할 수도 있다. 하지만, 이를 사용하는 이유는 추후 서비스 로직의 가독성 문제로 이어지는 것을 방지하기 위함이다.

end-point 에서 publish 를 통해서 `어떤 작업`을 발행하면, subscriber 가 이를 `processing`하는 과정을 거친다.

## Cron 작업과 반복적인 작업 ⏰

기존 저자는 `agenda.js`를 통해서 스케줄링과 배치 프로세싱에 대한 작업을 진행했지만, 본 필자는 이를 `bull`을 통해서 변경하였다.

`bull`을 사용하게 되면, Mongo-DB와 함께하는 agenda보다는 영구적인 저장이 힘들 수도 있지만, 이는 다른 솔루션으로 극복할 수 있다.

`bull`은 redis기반으로 굉장히 강한 메시큐의 작업을 지원해준다. 이를 통해서 반복적인 작업이나 pub/sub 구조에 대해서 좋은 솔루션을 제작할 수 있을 것이다.

> ### Bull vs Agenda 성능 비교 분석
>
> | 특성                       | Bull                                     | Agenda                                         |
> | -------------------------- | ---------------------------------------- | ---------------------------------------------- |
> | **사용 목적**              | 작업 큐, 반복 작업, 백그라운드 작업 처리 | 반복 작업, 일정 관리, 작업 큐 처리             |
> | **기반 기술**              | Redis                                    | MongoDB                                        |
> | **설치 용이성**            | 쉽고 간단 (`npm install bull`)           | 상대적으로 간단 (`npm install agenda`)         |
> | **반복 작업 지원**         | 지원 (Cron 표현식 및 반복 간격 설정)     | 지원 (Cron 표현식 및 반복 간격 설정)           |
> | **작업 우선순위 설정**     | 지원                                     | 지원                                           |
> | **작업 지연**              | 지원                                     | 지원                                           |
> | **성능 및 확장성**         | 매우 뛰어남, 고성능, 수평 확장 가능      | 상대적으로 높음, 수평 확장 가능                |
> | **작업 재시도**            | 지원                                     | 지원                                           |
> | **작업 실패 처리 및 알림** | 지원 (이벤트 리스너 사용)                | 지원 (이벤트 리스너 사용)                      |
> | **상태 모니터링**          | 지원 (대시보드 및 이벤트)                | 지원 (대시보드 및 이벤트)                      |
> | **보안**                   | Redis 보안 설정 필요                     | MongoDB 보안 설정 필요                         |
> | **커뮤니티 및 문서화**     | 활발한 커뮤니티, 풍부한 문서             | 활발한 커뮤니티, 풍부한 문서                   |
> | **의존성 관리**            | Redis 설치 필요                          | MongoDB 설치 필요                              |
> | **추가 기능**              | 작업 제한, 작업 프로세스 병렬 처리       | 작업 잠금, 작업 완료 후 데이터 보존            |
> | **장점**                   | 빠른 처리 속도, 높은 확장성              | 유연한 작업 관리, MongoDB와의 자연스러운 통합  |
> | **단점**                   | Redis 필요, 초과 부하 시 성능 저하 가능  | MongoDB 필요, 성능이 Redis에 비해 낮을 수 있음 |
>
> #### 결론
>
> -   **Bull**: 고성능, 확장성, 빠른 처리 속도를 요구하는 시스템에 적합하다. Redis를 기반으로 하여 대규모 분산 시스템에 유리하다.
> -   **Agenda**: 유연한 작업 관리와 MongoDB 통합이 필요한 경우 적합하다. 상대적으로 사용이 간단하며 다양한 반복 작업 및 일정 관리 기능을 제공한다.
>
> 각 라이브러리는 특정 용도와 요구 사항에 따라 장단점이 있다. 프로젝트의 특성과 요구에 맞는 라이브러리를 선택하는 것이 중요하다.

## 설정과 Secrets ⚙️

해당 내용은 API 키와 데이터베이스 문자열 연결을 저장하는 가장 좋은 접근 방식인 node.js용 Twelve-Factor App 의 전투 테스트된 개념에 따라 dotenv를 사용하는 것이다.

.env커밋되어서는 안 되는 파일 (하지만 저장소에 기본값이 있어야 함)을 넣은 다음, npm 패키지가 dotenv.env 파일을 로드하고 해당 변수를 node.js 객체의 process.env 에 삽입한다,

그것으로 충분할 수 있지만 추가 단계를 추가 해보자. npm 패키지가 .env 파일을 로드하는 [`config/index.js`](./src/config//index.js)파일이 있고 dotenv객체를 사용하여 변수를 저장하므로 구조와 코드 자동 완성이 가능해진다.

## 로더 🏗️

아이디어는 node.js 서비스의 시작 프로세스를 테스트 가능한 모듈로 분할한다는 것이다.

```cjs
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const errorhandler = require('errorhandler');
const app = express();

app.get('/status', (req, res) => { res.status(200).end(); });
app.head('/status', (req, res) => { res.status(200).end(); });
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json(setupForStripeWebhooks));
app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));
app.use(session({ secret: process.env.SECRET, cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

require('./config/passport');
require('./models/user');
require('./models/company');
app.use(require('./routes'));
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({'errors': {
    message: err.message,
    error: {}
  }});
});


... more stuff

... maybe start up Redis

... maybe add more middlewares

async function startServer() {
  app.listen(process.env.PORT, err => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Your server is ready !`);
  });
}

// Run the async function to start our server
startServer();
```

해당 내용은 일반적으로 많이 사용하는 형식이다. 기본적인 구성을 `app.js`에 무작정 다 넣는 방식이고 이는, app.js 내에서의 가독성을 매우 떨어트린다. 그렇기 때문에 해당 내용을 loader를 통해서 시작 프로세스를 단위로 나누고, 이를 통해서 app을 구성하는 방식으로 `테스트`와 `구조화`에 용이하게 구성할 수 있다.

-   [`./src/server.js`](./src/server.js) - 서버 모듈

-   [`./src/app.js`](./src/app.js) - express app 모듈

-   [`./src/loaders`](./src/loaders/) - 시작 프로세스의 모듈 집합

해당 부분을 참고하면 이를 좀 더 확실하게 이해할 수 있을 것이다.

기존의 bulletproof 구조는 `app`과 `server`를 분해하지 않는다. 하지만, 이는 e2e 테스트를 할 때, app 만 테스트를 하고 싶을 때 조금 힘든 구조가 될 수도 있다. 그렇기 때문에 해당 내용을 옮기면서 추가한 부분이라고 생각하면 좋을 것 같다.

# 마무리

이는 프로젝트의 목적보다는 좋은 솔루션의 공유의 목적이 크다. 그만큼 내부적인 로직보다는 아키텍처부분에 신경을 많이 써서 그 점을 생각하면 더 좋을 것 같다. 그리고 추가로 `commonjs` 를 통한 `bulletproof 구조`는 많이 정보가 없다 생각이 든다. `commonjs`를 통해서 제대로 하려면 해당 코드에서 DI구조를 참고하고, 추가로 jsDOcs를 통해서 타입이 없지만, 최대한 타입에 대한 명시를 할 수 있도록 하는 것이 좋다 생각된다.
