import { Component, OnInit } from '@angular/core';
import { CarService } from '../car.service';
import { RegisterModel } from '../register-model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerModel: RegisterModel = new RegisterModel();
  password2: string = '';
  constructor(public service: CarService) { }

  ngOnInit(): void {
  }

  register(){
    if (this.registerModel.password == this.password2 
      && this.registerModel.password.length > 7){
        this.service.register(this.registerModel);
    }
    else{
      alert('Passwords not match or password too short (min. 8)!');
    }
    
  }

}
