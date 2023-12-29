import { MD5 } from 'crypto-js';

export const generateIdFromString = (str: string): string => {
  const md5Hash = MD5(str).toString();
  const uuid = `${md5Hash.substring(0, 8)
    }-${md5Hash.substring(8, 12)
    }-${md5Hash.substring(12, 16)
    }-${md5Hash.substring(16, 20)
    }-${md5Hash.substring(20)
    }`;
  return uuid;
}
