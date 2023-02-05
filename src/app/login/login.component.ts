import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarService } from '../car.service';
import { LoginModel } from '../login-model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginModel: LoginModel = new LoginModel();
  constructor(public service : CarService, public router: Router) { }

  ngOnInit(): void {
    document.getElementById('user')?.focus();
  }

  login(){
    this.service.login(this.loginModel);
  }

}
