import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarService } from '../car.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(public service: CarService, public router: Router) { }

  ngOnInit(): void {
    this.service.logout();
    this.router.navigate(['list']);
  }

}
