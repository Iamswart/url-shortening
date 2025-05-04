import jwt from 'jsonwebtoken';

import appConfig from '../config/env';

export default class JWT {
  private static readPublicKey(): string {
    return appConfig.auth.secret;
  }

  private static readPrivateKey(): string {
    return appConfig.auth.secret;
  }

  public static encode(payload: any, expiresIn: string): string {
    const cert = this.readPrivateKey();
    const token = jwt.sign(payload, cert, { expiresIn } as jwt.SignOptions);
    return token;
  }

  public static decode(token: string): jwt.JwtPayload {
    const cert = this.readPublicKey();
    const decoded = jwt.verify(token, cert);
    return decoded as jwt.JwtPayload;
  }
}
