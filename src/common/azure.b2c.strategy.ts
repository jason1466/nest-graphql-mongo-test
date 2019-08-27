import { BearerStrategy } from "passport-azure-ad";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthenticationContext } from "adal-node";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AzureB2CStrategy extends PassportStrategy(BearerStrategy) {
  constructor(private usersService: UsersService) {
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
      passReqToCallback: false

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

    if (!token.oid) return done(new Error("oid is not found in token"));

    if (token.scp.split(" ").indexOf("demo.read") < 0) {
      console.log("demo.read Scope not in token, 403");
      throw new UnauthorizedException();
    }

    const authorityHostUrl = "https://login.microsoftonline.com/";
    const tenant =
      "TeamWiz.onmicrosoft.com/v2.0/.well-known/openid-configuration"; // AAD Tenant name.
    const authorityUrl = authorityHostUrl + tenant;
    const applicationId = "bf9f7d9d-6714-4ca2-ae60-e3a1add9ac53"; // Application Id of app registered under AAD.
    const clientSecret = "ft6nQGRHT3sUWkJLkpZqLgDqHNMbS0F/uZdc3cscp3U="; // Secret generated for app. Read this environment variable.
    const resource = "https://graph.windows.net"; // URI that identifies the resource for which the token is valid.
    const context = new AuthenticationContext(authorityUrl);
    context.acquireTokenWithClientCredentials(
      resource,
      applicationId,
      clientSecret,
      (err: any, adalToken: any) => {
        if (err) {
          console.log("well that didn't work: ", err.stack);
        } else {
          console.log("adalToken: ", adalToken);

          let users: any[] = [];
          this.usersService.getUsers(adalToken).subscribe(x => {
            users = x.value;
            console.log("total users: ", users.length);
            let user: any;
            this.usersService
              .getUser(users[2].objectId, adalToken)
              .subscribe(x => {
                x.extension_e0b690945b924423986510a643dbc9b7_Profile = JSON.parse(
                  x.extension_e0b690945b924423986510a643dbc9b7_Profile
                );
                user = x;
                console.log("user: ", user);

                this.usersService
                  .patchUser(
                    users[2].objectId,
                    {
                      extension_e0b690945b924423986510a643dbc9b7_Profile: JSON.stringify(
                        {
                          TestProp1: "TestValue1",
                          TestProp2: "TestValue2",
                          TestProp3: "TestValue3"
                        }
                      )
                    },
                    adalToken
                  )
                  .subscribe(x => {
                    console.log("return from PATCH?: ", x);
                    this.usersService
                      .getUser(users[2].objectId, adalToken)
                      .subscribe(x => {
                        x.extension_e0b690945b924423986510a643dbc9b7_Profile = JSON.parse(
                          x.extension_e0b690945b924423986510a643dbc9b7_Profile
                        );
                        user = x;
                        console.log("user after PATCH: ", user);
                        console.log(
                          "TestProp2 value is: ",
                          user
                            .extension_e0b690945b924423986510a643dbc9b7_Profile
                            .TestProp2
                        );
                      });
                  });
              });
          });
        }
      }
    );

    // let quotes: any[] = [];
    // this.usersService.getQuotes().subscribe(x => {
    //   quotes = x;
    //   console.log("quotes[0]: ", quotes[0]);
    // });

    return done(
      null,
      {
        name: token.name,
        country: token.country,
        postalCode: token.postalCode,
        emails: token.emails,
        owner: token.oid
      },
      token
    );
  }
}
