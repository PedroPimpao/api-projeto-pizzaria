import { randomInt } from 'crypto';

export function generateOTPCode(): string {
  return randomInt(100000, 1000000).toString();
}
