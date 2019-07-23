import { BearerStrategy } from "passport-azure-ad";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AzureB2CStrategy extends PassportStrategy(BearerStrategy) {
  constructor() {
    super({
      // clientID: "7ee72502-ef01-4d2a-a7c3-c6b201beb934",
      clientID: "817911d5-38f6-4866-9e0c-b5077e23206c",
      identityMetadata:
        // "https://login.microsoftonline.com/" +
        // "TeamWiz.onmicrosoft.com" +
        // "/v2.0/.well-known/openid-configuration/",
        "https://login.microsoftonline.com/TeamWiz.onmicrosoft.com/v2.0/.well-known/openid-configuration",
      // authority:
      //   "https://login.microsoftonline.com/tfp/TeamWiz.onmicrosoft.com/B2C_1_signupsignin1",
      policyName: "B2C_1_signupsignin1",
      // allowMultiAudiencesInToken: true,
      // scope: ["demo.read"],
      isB2C: true,
      validateIssuer: true,
      loggingLevel: "info",
      loggingNoPII: false,
      passReqToCallback: false,

      // audience?: string | string[];
      // policyName?: String;
      // allowMultiAudiencesInToken?: boolean;
      // scope?: string[];

      // identityMetadata: string;
      // clientID: string;
      // isB2C?: boolean;
      // validateIssuer?: boolean;
      // issuer?: string | string[];
      // loggingLevel?: "info" | "warn" | "error";
      // loggingNoPII?: boolean;
      // clockSkew?: number;
    });
  }

  async validate(token: any, done: any): Promise<any> {
    console.log("token: ", token);

    if (token.scp.split(" ").indexOf("demo.read") >= 0) {
      // Service relies on the name claim.
      // done.status(200).json({ name: token.name });
    } else {
      console.log("Invalid Scope, 403");
      // done.status(403).json({ error: "insufficient_scope" });
      throw new UnauthorizedException();
    }
    return done(null, {name: 'Jason Mock in validate'}, token);
  }
}
