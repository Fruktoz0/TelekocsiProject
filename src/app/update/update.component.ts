import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Car } from '../car';
import { CarService } from '../car.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  car: Car = new Car();
  constructor(public route: ActivatedRoute, public service: CarService) {
    this.route.params.subscribe(t => {
      let id : string = t['id'];
      let car : Car = this.service.getCar(id);
      this.car = car;
    })
  }

  save(){
    this.service.update(this.car);
  }

  ngOnInit(): void {
  }

}
