import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { FoodService } from './services/FoodService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'finalprojectfrontend';
  sub$!: Subscription
  id: Number = 0
  userId!: any | null
  token: string | null = ''

  constructor(private router: Router, private foodSvc: FoodService) {}

  ngOnInit(): void {
    this.sub$ = this.foodSvc.userId.subscribe(userId => {(this.id = userId)})
    console.log(">>> User Id app component: " + this.sub$)
    this.userId = localStorage.getItem("id")
    this.token = localStorage.getItem("token")
    this.foodSvc.id = this.id
    this.foodSvc.token = this.token
    console.log(">>> Storage user id: " + this.userId)
    this.id = this.userId
  }

  @ViewChild(MatDrawer)
  drawer!: MatDrawer

  toggleSidebar() {
    this.drawer.toggle()
  }

  logout() {
    this.router.navigate(['/'])
    this.foodSvc.token = ''
    this.foodSvc.id = 0
    this.id = 0
    this.userId = 0
    localStorage.clear();
    console.log(">>> Logout clicked")
  }

  ngOnDestroy(): void {
      this.sub$.unsubscribe()
  }
}
