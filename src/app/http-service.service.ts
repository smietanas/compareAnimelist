import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { animeModel } from './models/animeModel';
import { user } from './models/user';
import { listModel } from './models/listModel';
@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {
  constructor(private http: HttpClient) { }

   httpHeaders = new HttpHeaders()
   .set('content-type','application/json')
   .set('x-apikey','5ff25a76823229477922c6d2')
   .set('cache-control','no-cache');
   


  getAnimeListByNickName(nickName: string, offset : number): Observable<animeModel[]> {
    return this.http.get<listModel>(`https://api.jikan.moe/v3/user/${nickName}/animelist/all/${offset}`).pipe(
      map(data => data.anime));   
  }

  getUsers():Observable<user[]>{
    return   this.http.get<user[]>('https://userdb-7f44.restdb.io/rest/userlist',{
      headers : this.httpHeaders
    })
  }

  addNewUser(user){
    return   this.http.post('https://userdb-7f44.restdb.io/rest/userlist',user,{
      headers : this.httpHeaders
    })
  }

  deleteUser(userId){
    return   this.http.delete(`https://userdb-7f44.restdb.io/rest/userlist/${userId}`,{
      headers : this.httpHeaders
    })
  }
}
