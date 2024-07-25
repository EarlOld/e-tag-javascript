import { signal } from "@preact/signals";

export const count = signal(0);

export const subscribeCountContentDelivery = () => {
  let eTag = "";
  const interval = setInterval(() => {
    fetch("http://localhost:3000/count", {
      headers: {
        "If-None-Match": eTag,
      },
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
