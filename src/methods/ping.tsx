import { HttpsCallableResult } from "firebase/functions";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import FirebaseFunctions from "../services/FirebaseFunctions";

const methodName = "v1_ping" as const;

export type PingResult = HttpsCallableResult<{ id: string }>;
export type PingData = {
  id?: string;
  scope?: string[];
};

type PingDataRun = (data: {
  action: typeof methodName;
  data: PingData;
}) => Promise<PingResult>;

export type Ping = Readonly<
  [run: (data: PingData) => Promise<PingResult>, progress: boolean, err?: Error]
>;

export const usePing = (): Ping => {
  const orig = useHttpsCallable(FirebaseFunctions, "app");
  return [
    (data: PingData) =>
      (orig[0] as PingDataRun)({
        action: methodName,
        data,
      }),
    orig[1],
    orig[2],
  ];
};
