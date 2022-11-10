import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MealAttendanceArray } from '../models';
import { FoodService } from '../services/FoodService';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  resultsArray: MealAttendanceArray[] = []
  today: Date = new Date
  vegetarian: boolean = false

  thisWeekDateArray: string[] = []
  todayString = this.datePipe.transform(this.today, "yyyy-MM-dd")
  id: any | null = 0
  token: string | null = ''
  username: string | null = ''

  constructor(private foodSvc: FoodService, private datePipe: DatePipe, private router: Router) { }

  ngOnInit(): void {
    console.log(">>> After refresh user id svc: " + this.foodSvc.userId)
    console.log(">>> After refresh token svc: " + this.foodSvc.token)
    this.id = localStorage.getItem("id")
    this.token = localStorage.getItem("token")
    this.foodSvc.id = this.id
    this.foodSvc.token = this.token
    this.username = localStorage.getItem("username")
    // this.vegetarian = this.foodSvc.vegetarian
    // console.log(">>> This week dates: " + this.getThisWeekDates())
    this.foodSvc.getMealAttendance(this.getThisWeekDates())
    .then(result => {
      console.log(result)
      this.resultsArray = result
    })
    .catch(error => {
      console.log(error)
    })
    console.log(">>> Token: " + this.foodSvc.token)
  }

  menuForm() {
    this.router.navigate(['menu'])
  }

  mealReview() {
    this.router.navigate(['meals'])
  }

  nutrition() {
    this.router.navigate(['nutrition'])
  }

  allMenu() {
    this.router.navigate(['menuList'])
  }

  setMenu() {
    this.router.navigate(['setMenu'])
  }

  stats() {
    this.router.navigate(['statistics'])
  }

  getThisWeekDates() {
    let mondayDate: Date = new Date
    let fridayDate: Date = new Date
    console.log(">>> Next Monday is: " + this.nextMonday())
    if (this.today < this.nextMonday()) {
      mondayDate= new Date(this.nextMonday().setDate(this.nextMonday().getDate() - 7))
      // console.log(this.nextMonday())
      console.log(">>> This Monday date: " + mondayDate)
      fridayDate = new Date((new Date(this.nextMonday().setDate(this.nextMonday().getDate() - 7))).setDate(mondayDate.getDate() + 4))
      console.log(">>> Check this Monday date: " + mondayDate)
      console.log(">>> This Friday date: " + fridayDate)

      while (mondayDate <= fridayDate) {
        this.thisWeekDateArray.push(this.datePipe.transform(mondayDate, "yyyy-MM-dd") || '')
        mondayDate.setDate(mondayDate.getDate() + 1)
        console.log("Monday + 1: " + mondayDate)
        console.log("Friday's same date: " + fridayDate)
      }

      // if (this.thisWeekDateArray[this.thisWeekDateArray.length] != this.datePipe.transform(fridayDate, "yyyy-MM-dd")) {
      //   this.thisWeekDateArray.push(this.datePipe.transform(fridayDate, "yyyy-MM-dd") || '')
      // }
    }

    return this.thisWeekDateArray
  }

  nextMonday() {
    // let currentDate = new Date()
    let d = new Date();
    d.setDate(d.getDate() + (((1 + 7 - d.getDay()) % 7) || 7));
    // this.datePipe.transform(d, "yyyy-MM-dd")
    console.log(d);

    return d
  }

  getDayNameFromDate(date: string) {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let d = new Date(date);
    let dayName = days[d.getDay()];

    return dayName
  }

}
