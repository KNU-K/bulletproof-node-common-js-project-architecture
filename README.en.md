# 😊 Bulletproof Node.js Project Architecture

> This document is based on Santiago Quinteros' "Bulletproof Node.js Project Architecture."

## Table of Contents
1. **Introduction**
2. **Folder Structure 🏢**
    - **Typical Structure**
    - **Folder Descriptions**
3. **3 Layer Architecture 🥪**
    - **Avoid Putting Business Logic in Controllers**
    - **Place Business Logic in the Service Layer 💼**
4. **Dependency Injection (DI) 💉**
5. **Unit Tests are Essential 🕵️‍♂️**
6. **Utilize Pub/Sub Layer 🎙️**
7. **Cron Jobs and Recurring Tasks ⏰**
8. **Configuration and Secrets ⚙️**
9. **Loaders 🏗️**

## Introduction

Express.js is an excellent framework for creating Node.js REST APIs. However, it doesn't provide any **clues** on how to structure your Node.js project.

While this might seem trivial, Santiago considers it a "Real Problem."

Properly designing the structure of your Node.js project is not just a good practice. It's a **"Game-changer"** that can transform the project's trajectory. Proper design prevents code duplication, increases stability, and enhances scalability.

This document is based on Santiago Quinteros' extensive experience and research.

## Folder Structure 🏢

### Typical Structure

I advocate for the following folder structure (not mandatory; it can vary based on design needs):

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

### Folder Descriptions

| Element        | Description                                                              |
| -------------- | ------------------------------------------------------------------------ |
| `app.js`       | Application entry point                                                 |
| `server.js`    | Server configuration and setup                                          |
| `api`          | Route controllers for all endpoints of the application                  |
| `config`       | Environment variables and configuration files                           |
| `jobs`         | Defines and manages periodic or event-driven tasks in the application   |
| `loaders`      | Modules to separate the startup process                                 |
| `models`       | Database models and schemas                                             |
| `services`     | Files containing all business logic                                     |
| `subscribers`  | Event handlers for asynchronous tasks                                   |

This structure is more than just about keeping files tidy.

## 3 Layer Architecture 🥪

This idea leverages the principle of separation of concerns to decouple business logic from Node.js API routes.

![https://www.softwareontheroad.com/ideal-nodejs-project-structure/](./images/3-layer-architecture.png)

### Avoid Putting Business Logic in Controllers

Including business logic in Express.js Controllers might be convenient, but it is a shortcut to spaghetti code. When writing unit tests, it may require dealing with complex mock objects.

Additionally, if there is further processing required after sending a response to the client, controlling such situations becomes challenging.

Here is a **bad example** (it may differ slightly from the original author's code):

```javascript
route.post('/', async (req, res, next) => {
    const requestDTO = req.body;

    // Business Logic - Authentication (about 300 lines)
    // Business Logic - Registration (about 100 lines)
    // Other tasks - Sending email (about 10 lines)
      .
      .
      .
    // Obtain responseDTO
    res.json(responseDTO)
});
```

When multiple functions are not separated but clustered in one place, several issues arise.

1. Readability problems
2. Over-dependency when unit tests are needed

### Place Business Logic in the Service Layer 💼

By placing business logic in the service layer, the following benefits are achieved:

-   **Ease of Unit Testing**

    By centralizing business logic in the service layer, each business function can be tested at the smallest unit. This provides the opportunity to test and verify each service method independently.

-   **Modularity and Reusability of Code**

    Implementing business logic in the service layer allows it to be easily reused in various controllers or other services, reducing code duplication and improving maintainability.

-   **Separation from SQL**

    The service layer should not directly handle database access logic such as SQL queries. This allows the service layer to focus on business logic, with interactions with the database abstracted using a DAO (Data Access Object).

-   **Transaction Management**

    The service layer can manage transactions such as grouping multiple database operations into a single business transaction, which helps maintain data consistency and handle exceptions.

-   **Increasing Cohesion of Services**

    As the service layer is implemented focusing on business requirements, each layer of the system is clearly separated and each layer can focus on its role.

Thus, by designing the service layer around business logic, code quality and maintainability can be improved. Refer to the example below.

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


/** Service (simple example with only authService) **/
module.exports = class AuthService{
          .
          .
          .
  async join(user){
    // Perform join operation
  }
}
```

In the above code, the Controller syntax is significantly simplified through Service and middleware.

## Dependency Injection (DI) 💉

DI or IoC is a common pattern where the dependencies of classes or functions are injected or passed through the constructor to aid in code composition.

This allows the object being tested to have `compatible dependencies` injected during unit tests, making it easier to test its operations in different contexts.

-   Code without DI

    ```cjs
    const UserModel = require('../models/user')
    class UserService {
        constructor() {}
        join() {
            // Directly using UserModel
        }
    }
    ```

    This form makes UserModel an unavoidable dependency during testing.

-   Code using manual dependency injection

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
            // Using this.userModel to compose business logic
            const newUser = new this.userModel(user)
            newUser.save()
        }
    }
    ```

    In this form, since userModel is injected into the constructor, only a `compatible object` needs to be injected during testing to verify that the business logic works correctly.

    Below is an example of a test.

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
          // Tests can confirm the operation of userService.save()
        })

    })
    ```

    In this way, the tests can focus solely on userService without being affected by UserModel.

    By using the `typedi` library, dependencies can be injected more easily through a Container.

    > Be careful with the issue of `this` becoming undefined. It is advisable to explicitly show `this` using bind logic or arrow functions.

## Unit Tests are Essential 🕵️‍♂️

Unit testing is very important, as explained earlier. This is still a contentious issue, but knowing that unit testing is a simple and fast way to ensure that each part operates correctly is beneficial.

> Although the current summary uses a mock library, using mocks is not an absolute requirement.

It would be good to refer to the test folder of this repository for learning.

## Utilize Pub/Sub Layer 🎙️

While it's possible to stick strictly to a 3-Layered Architecture, it's not always the best method.

Let's assume there is a simple service call logic. When there are only one or two of such logics, it's not a problem, but as the service expands, the service object can grow into a code of over 1000 lines.

This violates the SOLID principle of `Single Responsibility Principle (SRP)`.

Therefore, to maintain and manage the code better, it would be good to separate the service calls.

This can be expressed through relationships such as event handlers and listeners, publishers and subscribers, or providers and consumers.

Now, let's look at a simple example pseudocode.

```cjs
//Publisher
class Publisher {
    constructor(queue) {
        this.queue = queue
    }
    publish = async (events, act) => {
        queue.add(events, act)
        // Events can be registered
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
            console.error(`Failed to process job ${job.id}:

`, error)
        }
    }

    initialize() {
        this.queue.process(this.processJob)
    }

    async handleEvent1(data) {
        // handle event1
    }

    async handleEvent2(data) {
        // handle event2
    }
}
```

## Cron Jobs and Recurring Tasks ⏰

Some services need to operate on a regular basis. To implement recurring tasks or cron jobs, one can use libraries such as `node-cron`, `bull`, `agenda`, etc.

Example of a Cron Job:

```cjs
const cron = require('node-cron')

cron.schedule('*/5 * * * *', async () => {
    console.log('Running a task every 5 minutes')
})
```

These tasks are scheduled using crontab syntax and can be used to perform regular maintenance, send periodic notifications, or other automated tasks.

## Configuration and Secrets ⚙️

All environment-specific variables like API keys, database URLs, etc., should be stored in configuration files. This can be done using libraries like `dotenv`, `config`, etc.

**Example using dotenv:**

```cjs
require('dotenv').config()

const dbUrl = process.env.DB_URL
```

Ensure these configuration files are not committed to the version control system.

## Loaders 🏗️

Loaders are used to encapsulate the startup process of the application. They ensure that the various parts of the application are initialized in a controlled and ordered manner.

Example Loader Setup:

```cjs
const expressLoader = require('./express')
const mongooseLoader = require('./mongoose')

module.exports = async ({ expressApp }) => {
    await mongooseLoader()
    console.log('MongoDB initialized')
    await expressLoader({ app: expressApp })
    console.log('Express initialized')
}
```

These loaders help maintain a clean `app.js` and `server.js` and ensure that the application components are initialized properly.

---

## Summary

Designing the architecture of a Node.js project is a crucial step for maintaining clean, scalable, and maintainable code. By adhering to best practices such as organizing the folder structure, separating business logic, utilizing dependency injection, writing unit tests, and managing configuration and loaders properly, the project can avoid common pitfalls and remain robust as it grows.

For detailed explanations and further reading, refer to Santiago Quinteros' original work.

