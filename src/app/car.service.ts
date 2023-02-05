import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Car } from './car';
import { LoginModel } from './login-model';
import { TokenModel } from './token-model';
import { Router } from '@angular/router';
import { RegisterModel } from './register-model';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  cars: Array<Car> = new Array<Car>();
  constructor(public http: HttpClient, public router: Router) { 
    this.sync();
    console.log(this.isLoggedIn());
  }

  getUniqueCityNames() : Array<String>{
    let names : Array<String> = new Array<String>();
    for(let i = 0; i < this.cars.length; i++){
      if (names.indexOf(this.cars[i].cityFrom) == -1){
        names.push(this.cars[i].cityFrom);
      }
      if (names.indexOf(this.cars[i].cityTo) == -1){
        names.push(this.cars[i].cityTo);
      }
    }
    names.sort();
    return names;
  }

  getCar(id: string) : Car{
    return this.cars.filter(t => t.id == id)[0];
  }

  getUser(): string{
    let data = localStorage.getItem('user');
    if (data != null){
      return data;
    }
    else return '';
  }

  getToken() : String{
    if (this.isLoggedIn()){
      let datajson : string | null = localStorage.getItem('token');
      if (datajson != null){
        let tm : TokenModel = JSON.parse(datajson);
        return tm.token;
      }
      else{
        return '';
      }
    }
    else{
      return '';
    }
  }

  create(car: Car){
    const headers = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Bearer ' + this.getToken()
    });
    this.http.post('https://weblerapi.kovos.net/car', car, {headers: headers})
    .subscribe(t => {
      console.log(t);
      this.sync();
      this.router.navigate(['list']);
    });
  }

  update(car: Car){
    const headers = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Bearer ' + this.getToken()
    });
    this.http.put('https://weblerapi.kovos.net/car', car, {headers: headers})
    .subscribe(t => {
      console.log(t);
      this.sync();
      this.router.navigate(['list']);
    });
  }

  sort(type: string){
    if (type == 'dasc'){
      this.cars.sort((a,b) => {
        if (a.date < b.date)return -1;
        else if (a.date > b.date)return 1;
        else return 0;
      })
    }
    else if (type == 'ddesc'){
      this.cars.sort((a,b) => {
        if (a.date < b.date)return 1;
        else if (a.date > b.date)return -1;
        else return 0;
      })
    }
    else if (type == 'kasc'){
      this.cars.sort((a,b) => {
        if (a.km < b.km)return -1;
        else if (a.km > b.km)return 1;
        else return 0;
      })
    }
    else if (type == 'kdesc'){
      this.cars.sort((a,b) => {
        if (a.km < b.km)return 1;
        else if (a.km > b.km)return -1;
        else return 0;
      })
    }
  }

  averageKm(): number{
    //Sorozatszámítás tétel
    let sum : number = 0;
    /*for(let i = 0; i < this.cars.length; i++){
      sum += (this.cars[i].km as number);
    }
    */
    /*for(let c of this.cars){
      sum += c.km as number;
    }
    */
   this.cars.forEach(c => {
      sum += c.km as number;
   });
    return sum / this.cars.length;
  }

  largestRoute(): String{
    //Maximumkiválasztás tétel
    let maxindex = 0;
    for(let i = 1; i < this.cars.length; i++){
      if (this.cars[i].km > this.cars[maxindex].km){
        maxindex = i;
      }
    }
    return this.cars[maxindex].cityFrom + " - " + this.cars[maxindex].cityTo + " (" 
    +this.cars[maxindex].date + ")";
  }

  //Eldöntés - Van egy a tömbben ilyen és ilyen elem (van-e megadottnál hosszabb út)
  hasLargerRoute(length: number) : boolean{
    let has : boolean = false;
    this.cars.forEach(car => {
      if (car.km > length) has = true;
    });
    return has;
  }

  //Megszámlálás - Adott tulajdonságú elemek száma (hány út van adott dátumon)
  routeNumber(date: String) : number{
    let count = 0;
    this.cars.forEach(car => {
      if (car.date == date) count++;
    });
    return count;
  }

  //Lineáris keresés - Keressük az első adott tulajdonságú elemet (adott nevű ember elsú hirdetése)
  searchCar(owner: String) : String{
    for(let car of this.cars){
      if (car.owner.firstName + " " + car.owner.lastName == owner){
        return car.cityFrom + " - " + car.cityTo + " (" + car.date + ")";
      }
    }
    return "Route not found";
  }
  

  sync(){
    this.http.get<Array<Car>>('https://weblerapi.kovos.net/car')
    .subscribe(t => 
      {
        this.cars = t;
        this.cars.sort((a,b) => {
          //a < b => -1 | a == b => 0 | a > b => 1
          if (a.date < b.date){
            return -1;
          }
          else if (a.date > b.date){
            return 1;
          }
          else{
            return 0;
          }
        })
      });
  }

  login(loginModel: LoginModel){
    this.http.post<TokenModel>('https://weblerapi.kovos.net/auth', loginModel)
    .subscribe(t => {
      t.expiration = new Date(t.expiration);
      localStorage.setItem('token', JSON.stringify(t));
      localStorage.setItem('user', loginModel.userName.toString());
      this.router.navigate(['list']);
    });
  }

  isLoggedIn(): boolean{
    let datajson : string | null = localStorage.getItem('token');
    if (datajson != null){
      let tm : TokenModel = JSON.parse(datajson);
      tm.expiration = new Date(tm.expiration);
      if (tm.expiration > new Date()){
        return true;
      }
      else{
        return false;
      }
    }
    return false;
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  register(rm: RegisterModel){
    this.http.put('https://weblerapi.kovos.net/auth', rm)
    .subscribe(t => {
      alert('Registration ok!');
    })
  }

  delete(id: String){
    const headers = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Bearer ' + this.getToken()
    });
    this.http.delete('https://weblerapi.kovos.net/car/' + id, {headers: headers} )
    .subscribe(t => {
      console.log(t);
      this.sync();
    });
  }

  onlyBp(){
    this.cars = this.cars.filter(t => t.cityFrom == 'Budapest');
  }

  filterFrom(city: String){
    this.cars = this.cars.filter(t => t.cityFrom == city);
  }

  filterTo(city: String){
    this.cars = this.cars.filter(t => t.cityTo == city);
  }
  
}
