import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Car } from '../car';
import { CarService } from '../car.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  car: Car = new Car();
  constructor(public service: CarService, public router: Router) { }

  ngOnInit(): void {
    if (!this.service.isLoggedIn()){
      this.router.navigate(['list']);
    }
  }

  add(){
    this.service.create(this.car);
  }

}
