import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable,throwError  } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

  constructor(private _router: Router,private http: HttpClient) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {
      //todo env
      let token = environment.token;
      let refreshToken = environment.refresh_token;
      if (token) {
          req = req.clone({
              setHeaders: {
                  'Authorization': 'Bearer ' + token
              }
          } );
      }


      return next.handle(req).catch(err => {
        console.log(err);
        if (err.status === 401) {
            if (err.error == "invalid_token") {
                //Genrate params for token refreshing
              let params = {
                "grant_type": "refresh_token",
                "refresh_token": refreshToken
              };
              return this.http.post('https://myanimelist.net/v1/oauth2/token', params).mergeMap(
                (data: any) => {
                  //If reload successful update tokens
                  if (data.status === 200) {
                    //Update tokens
                    environment.token = data.access_token;
                    environment.refresh_token = data.refresh_token;
                    //Clone our fieled request ant try to resend it
                    req = req.clone({
                      setHeaders: {
                        'Authorization': 'Bearer ' + data.access_token
                      }
                    });
                    return next.handle(req);
                  }else {
                    //Logout from account
                  }
                }
              );
            }else {
                //Logout from account or do some other stuff
            }
        }
        return throwError('error')
    });
  }

  errorHandler(error:HttpErrorResponse){
    
  }
}