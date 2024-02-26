import { useState } from "react";
import FirebaseFunctions from "../services/FirebaseFunctions";
import { HttpsCallableResult, httpsCallable } from "firebase/functions";
import { getErrorFromCallable } from "./getErrorFromCallable";

export const useCallableFn = <T, K>(
  methodName: string
): Readonly<[run: (data: T) => Promise<K>, progress: boolean, err?: Error]> => {
  const appFn: (data: {
    action: string;
    data: T;
  }) => Promise<HttpsCallableResult<K>> = httpsCallable<
    { action: string; data: T },
    K
  >(FirebaseFunctions, "app");
  const resp: {
    result?: K;
    progress: boolean;
    error?: Error;
  } = {
    progress: false,
  };
  const [, setProgress] = useState<boolean>(false);
  return [
    async (data: T) => {
      resp.result = undefined;
      resp.progress = true;
      resp.error = undefined;
      setProgress(true);
      return appFn({ action: methodName, data })
        .then((res) => {
          resp.result = res.data;
          resp.progress = false;
          resp.error = undefined;
          return Promise.resolve(resp.result);
        })
        .catch((error) => {
          resp.result = undefined;
          resp.progress = false;
          resp.error = getErrorFromCallable(error);
          return Promise.reject(resp.error);
        })
        .finally(() => {
          setProgress(false);
        });
    },
    resp.progress,
    resp.error,
  ];
};
