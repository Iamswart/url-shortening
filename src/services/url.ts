const CHARACTERS =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BASE = CHARACTERS.length;

export const encodeToBase62 = (num: number): string => {
  let encoded = "";

  if (num === 0) {
    return CHARACTERS[0];
  }

  while (num > 0) {
    encoded = CHARACTERS[num % BASE] + encoded;
    num = Math.floor(num / BASE);
  }

  return encoded;
};

export const decodeFromBase62 = (str: string): number => {
  let decoded = 0;

  for (let i = 0; i < str.length; i++) {
    decoded = decoded * BASE + CHARACTERS.indexOf(str[i]);
  }

  return decoded;
};

export const generateShortPath = (counter: number): string => {
  return encodeToBase62(counter).padStart(6, CHARACTERS[0]);
};
