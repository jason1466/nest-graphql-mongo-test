import { BearerStrategy } from "passport-azure-ad";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AzureB2CStrategy extends PassportStrategy(BearerStrategy) {
  constructor() {
    super({
      identityMetadata:
        "https://login.microsoftonline.com/" +
        "TeamWiz.onmicrosoft.com" +
        "/v2.0/.well-known/openid-configuration/",
      clientID: "7ee72502-ef01-4d2a-a7c3-c6b201beb934",
      policyName: "B2C_1_signupsignin1",
      isB2C: true,
      validateIssuer: true,
      loggingLevel: "info",
      passReqToCallback: false
    });
  }

  async validate(req: any, res: any): Promise<any> {
    const claims = req.authInfo;
    console.log("User info: ", req.user);
    console.log("Validated claims: ", claims);

    if (claims["scp"].split(" ").indexOf("demo.read") >= 0) {
      // Service relies on the name claim.
      res.status(200).json({ name: claims["name"] });
    } else {
      console.log("Invalid Scope, 403");
      res.status(403).json({ error: "insufficient_scope" });
      // throw new UnauthorizedException();
    }
  }
}
