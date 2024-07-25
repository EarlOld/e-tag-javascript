![e-tag-js-preview](https://www.iot-sdn.space/assets/e-tag/preview.webp)

## Introduction

In modern web applications, optimizing performance and resource efficiency is a crucial part of development. One way to improve performance is by using ETags in REST APIs. ETag (Entity Tag) is a caching mechanism that allows clients to avoid reloading unchanged resources. In this article, we will explore what ETags are, how they work, and how to implement them in your REST API using JavaScript, Fastify, React, and signals.

## How to Run the Example

To run the example, follow these steps:

1. Clone the repository:

```bash
git clone
```

2. Install the dependencies:

```bash
npm install
```

3. Start the Fastify server:

```bash
node server.js
```

4. Start the React app:

```bash
npm start
```

## What is an ETag?

ETag is a unique identifier assigned by the server to a specific version of a resource. When the resource changes, its ETag also changes. This allows clients to check if the resource has changed since the last time it was loaded and avoid reloading if the resource has not changed.

## How Do ETags Work?

![e-tag-js](https://www.iot-sdn.space/assets/e-tag/e-tag-js.png)

When a client requests a resource, the server responds with the resource and adds an ETag to the response header. On the next request to this resource, the client sends the ETag in the `If-None-Match` request header. The server checks the ETag, and if the resource has not changed, it responds with a 304 (Not Modified) status, indicating to the client to use the cached version of the resource. If the resource has changed, the server sends the new resource along with an updated ETag.

## Implementing ETags in Fastify

Fastify supports ETags. To do this, you can use the `@fastify/etag` plugin. Here's an example:

```javascript
import Fastify from "fastify";
import Etag from "@fastify/etag";
import cors from "@fastify/cors";

const fastify = Fastify();

fastify.register(cors, {
  origin: true,
});
fastify.register(Etag);

let count = 0;

fastify.get("/", async (request, reply) => {
  return "Hello, world!";
});

fastify.get("/count", async (request, reply) => {
  count++;
  return count;
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
```

## Using ETags with Signals

Signals can be used to notify various parts of the application about state changes, including changes in data received through the API. Here's an example of using ETags combined with signals:

```javascript
import { createSignal } from "@preact/signals";

export const count = createSignal(0);

export const subscribeCountContentDelivery = () => {
  let eTag: string | null = null;

  const interval = setInterval(() => {
    fetch("http://localhost:3000/count", {
      headers: eTag ? { "If-None-Match": eTag } : {},
    })
      .then((response) => {
        if (response.status === 304) {
          return;
        }
        eTag = response.headers.get("ETag")!;
        return response.text();
      })
      .then((data) => {
        if (data !== undefined) {
          count.value = +data;
        }
      });
  }, 1000);

  return () => {
    clearInterval(interval);
  };
};

import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { subscribeCountContentDelivery, count } from "./utils/contentDelivery";

function App() {
  const [value, setValue] = useState(count.value);

  useEffect(() => {
    const unsubscribe = subscribeCountContentDelivery();

    count.subscribe((value) => {
      setValue(value);
    });

    return () => {
      unsubscribe();
    };
  });

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Count: {value}</h1>
    </>
  );
}

export default App;
```

## Conclusion

Using ETags is an effective way to improve the performance of your REST API by reducing the amount of transmitted data and server load. With ETags, clients can reuse unchanged resources, reducing loading times and improving user experience. In this article, we covered the basic concepts of ETags and demonstrated how to implement them in your APIs using examples in JavaScript, Fastify, React, and signals.

## Additional Resources

- [Fastify Documentation](https://www.fastify.io/docs/latest/)
- [@fastify/etag on npm](https://www.npmjs.com/package/@fastify/etag)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Signals Documentation](https://solidjs.com/docs/latest)