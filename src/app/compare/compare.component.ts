import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { HttpServiceService } from '../http-service.service'
import { animeModel } from '../models/animeModel';
import { user } from '../models/user';
@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {
  lista: animeModel[];

  listaUser1: animeModel[] = [];
  listaUser2: animeModel[] = [];
  newUserName : string;
  users: Observable<user[]>

  constructor(private service: HttpServiceService) { }

  onSubmit(f){
    this.compare(f.firstUser,f.secondUser);
  }

  addNewUser(){    
    const newUser = {
      name: this.newUserName
    };
    this.service.addNewUser(newUser).subscribe(data => {
      this.getUsers()
    })
    this.newUserName = '';
  }

  deleteUser(id){
    this.service.deleteUser(id).subscribe(data=>{
      this.getUsers()
    })  
  }
  
  compare(firstUser,secondUser) {
    const service11 = this.service.getAnimeListByNickName(firstUser, 1);
    const service12 = this.service.getAnimeListByNickName(firstUser, 2);
    const service21 = this.service.getAnimeListByNickName(secondUser, 1);
    const service22 = this.service.getAnimeListByNickName(secondUser, 2);
    console.log(firstUser,secondUser);
  
    forkJoin([service11, service12]).subscribe(result => {
      this.listaUser1 = result[0].concat(result[1])
      
      forkJoin([service21, service22]).subscribe(result1 => {
        this.listaUser2 = result1[0].concat(result1[1]);
        this.lista = this.listaUser2.filter(({ mal_id: id1 }) => !this.listaUser1.some(({ mal_id: id2 }) => id2 === id1));
      });
    });
  }

  getUsers(){
    this.users = this.service.getUsers();
  }

  ngOnInit(): void {
    this.getUsers()
  }

  redirect(url) {
    window.open(url, "_blank")
  }
}
