import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarService } from '../car.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  filtersActive: boolean = false;
  filterCity: String = '';
  routeLength: number = 0;
  routeDate: string = '';
  routeOwner: String = '';
  constructor(public service: CarService, public router: Router) { }

  ngOnInit(): void {
  }

  update(id: String){
    this.router.navigate(['update', id]);
  }

  popalert(data: any){
    alert(data);
  }

}
