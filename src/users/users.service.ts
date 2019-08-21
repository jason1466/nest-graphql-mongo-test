import { Injectable, HttpService } from "@nestjs/common";
import { map } from "rxjs/operators";

@Injectable()
export class UsersService {
  constructor(private http: HttpService) {}

  getUsers(token: any) {
    return this.http
      .get(
        "https://graph.windows.net/TeamWiz.onmicrosoft.com/users?api-version=1.6",
        {
          headers: { Authorization: token.tokenType + " " + token.accessToken }
        }
      )
      .pipe(map(response => response.data));
  }

  getUser(id: string, token: any) {
    return this.http
      .get(
        `https://graph.windows.net/TeamWiz.onmicrosoft.com/users/${id}?api-version=1.6`,
        {
          headers: { Authorization: token.tokenType + " " + token.accessToken }
        }
      )
      .pipe(map(response => response.data));
  }

  patchUser(id: string, userChanges: any, token: any) {
    return this.http
      .patch(
        `https://graph.windows.net/TeamWiz.onmicrosoft.com/users/${id}?api-version=1.6`,
        userChanges,
        {
          headers: { Authorization: token.tokenType + " " + token.accessToken }
        }
      )
      .pipe(map(response => response.data));
  }


  getQuotes() {
    return this.http
      .get("http://quotesondesign.com/wp-json/posts")
      .pipe(map(response => response.data));
  }

  getQuote(id) {
    return this.http
      .get("http://quotesondesign.com/wp-json/posts/" + id)
      .pipe(map(response => response.data));
  }

  getRandomQuote() {
    return this.http
      .get(
        "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1"
      )
      .pipe(map(response => response.data));
  }
}
