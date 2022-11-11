import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AttendanceObject, MealAttendanceArray, MenuResponse, rankedRatings } from '../models';
import { FoodService } from '../services/FoodService';

@Component({
  selector: 'app-food.statistics',
  templateUrl: './food.statistics.component.html',
  styleUrls: ['./food.statistics.component.css']
})
export class FoodStatisticsComponent implements OnInit {

  TM_multi: any[] = []
  TM_seriesValues: number[]= []
  TM_view: any[] = [900, 500];
  TM_legend: boolean = true;
  TM_showLabels: boolean = true;
  TM_animations: boolean = true;
  TM_xAxis: boolean = true;
  TM_yAxis: boolean = true;
  TM_showYAxisLabel: boolean = true;
  TM_showXAxisLabel: boolean = true;
  TM_xAxisLabel: string = 'Date';
  TM_yAxisLabel: string = 'Average Rating';
  TM_timeline: boolean = true;
  resultsArray: MealAttendanceArray[] = []
  resultsArrayNextWeek: MealAttendanceArray[] = []

  LM_multi: any[] = []
  LM_view: any[] = [900, 500];
  LM_legend: boolean = true;
  LM_showLabels: boolean = true;
  LM_animations: boolean = true;
  LM_xAxis: boolean = true;
  LM_yAxis: boolean = true;
  LM_showYAxisLabel: boolean = true;
  LM_showXAxisLabel: boolean = true;
  LM_xAxisLabel: string = 'Date';
  LM_yAxisLabel: string = 'Average Rating';
  LM_timeline: boolean = true;

  obs1!: Observable<any>

  month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  thisMonthName: string = ''
  lastMonthName: string = ''

  TM_displayedColumns: string[] = ['Date', 'Time', 'Meal', 'Rating', 'button'];
  TM_lowestIndex: rankedRatings[] = []
  TM_dataSource: MatTableDataSource<rankedRatings> = new MatTableDataSource(this.TM_lowestIndex)

  LM_lowestIndex: rankedRatings[] = []
  LM_dataSource: MatTableDataSource<rankedRatings> = new MatTableDataSource(this.LM_lowestIndex)

  PTM_multi: any[]= []
  PTM_view: any[] = [900,500]
  PTM_showXAxis: boolean = true;
  PTM_showYAxis: boolean = true;
  PTM_gradient: boolean = true;
  PTM_showLegend: boolean = true;
  PTM_showXAxisLabel: boolean = true;
  PTM_showYAxisLabel: boolean = true;
  PTM_xAxisLabel: string = 'Date';
  PTM_PTM_showYAxisLabel: boolean = true;
  PTM_yAxisLabel: string = 'Attendance';
  PTM_legendTitle: string = 'Legend';

  PLM_multi: any[]= []
  PLM_view: any[] = [900,500]
  PLM_showXAxis: boolean = true;
  PLM_showYAxis: boolean = true;
  PLM_gradient: boolean = true;
  PLM_showLegend: boolean = true;
  PLM_showXAxisLabel: boolean = true;
  PLM_showYAxisLabel: boolean = true;
  PLM_xAxisLabel: string = 'Date';
  PLM_PTM_showYAxisLabel: boolean = true;
  PLM_yAxisLabel: string = 'Attendance';
  PLM_legendTitle: string = 'Legend';

  token: string | null = ''

  constructor(private datePipe: DatePipe, private foodSvc: FoodService, private router: Router) {
    // Object.assign(this, { multi });
  }

  ngOnInit(): void {
    // console.log(this.getThisWeekDates())
    this.token = localStorage.getItem("token")
    this.foodSvc.token = this.token
    this.foodSvc.getMealAttendance(this.getThisWeekDates())
      .then(result => {
        console.log(result)
        console.log("Result!!!!")
        this.resultsArray = result
      })
      .catch(error => {
        console.log(error)
      })
      this.foodSvc.getMealAttendance(this.getNextWeekDates())
      .then(result => {
        console.log(result)
        this.resultsArrayNextWeek = result
      })
      .catch(error => {
        console.log(error)
      })

      const d = new Date();
      let thisMonth = d.getMonth();
      let lastMonth = d.getMonth() - 1
      this.thisMonthName = this.month[thisMonth]
      this.lastMonthName = this.month[lastMonth]

      this.foodSvc.getRatingsStats(thisMonth)
        .then(result => {
          console.log(result)
          this.TM_multi = result
          this.getThisMonthRanked()
          this.getLastMonthRanked()
          // let lowest: number = 10
          // // console.log(this.TM_multi[0].series[0].name)
          // for (let i=0; i<1; i++) {
          //   // let array = this.TM_multi[i].series[i]
          //   for (let t=0; t<this.TM_multi[i].series.length; t++) {
          //     let currentNumber = Number(this.TM_multi[i].series[t].value)
          //     // lowest = Number(this.TM_multi[i].series[t].value)
          //     if (currentNumber <= lowest) {
          //       lowest = currentNumber
          //       let item: rankedRatings = {
          //         Date: '',
          //         Time: '',
          //         Meal: '',
          //         Rating: 0
          //       }
          //       item.Date = this.TM_multi[i].series[t].name
          //       item.Time = 'Breakfast'
          //       item.Meal = item.Date = this.TM_multi[i].series[t].Meal
          //       item.Rating = this.TM_multi[i].series[t].value

          //       this.breakfastLowestIndex.push(item)
                
          //     }
          //     console.log(this.TM_multi[i].series[t].value)
          //     console.log(">>> Lowest Array: " + JSON.stringify(this.breakfastLowestIndex))
          //     this.TM_dataSource = new MatTableDataSource(this.breakfastLowestIndex)
          //   }
          // }
          // console.log(">>> Lowest breakfast: " + lowest)
        })
        .catch(error => {
          console.log(error)
        })

        this.foodSvc.getRatingsStats(lastMonth)
        .then(result => {
          console.log(result)
          this.LM_multi = result
        })
        .catch(error => {
          console.log(error)
        })

        this.foodSvc.getPaxStats(thisMonth)
        .then(result => {
          console.log(result)
          this.PTM_multi = result
        })
        .catch(error => {
          console.log(error)
        })

        this.foodSvc.getPaxStats(lastMonth)
        .then(result => {
          console.log(result)
          this.PLM_multi = result
        })
        .catch(error => {
          console.log(error)
        })
  }

  // this week graph

  today: Date = new Date

  thisWeekDateArray: string[] = []
  nextWeekDateArray: string[] = []
  todayString = this.datePipe.transform(this.today, "yyyy-MM-dd")

  async getThisMonthRanked() {
    let array: rankedRatings[] = []
    let lowest: number = 10

    for (let i=0; i<1; i++) {
      for (let t=0; t<this.TM_multi[i].series.length; t++) {
        let currentNumber = Number(this.TM_multi[i].series[t].value)
        if (currentNumber <= lowest && currentNumber != 0.0) {
          lowest = currentNumber
          let item: rankedRatings = {
            Date: '',
            Time: '',
            Meal: '',
            Rating: 0,
            Id: ''
          }
          item.Date = this.TM_multi[i].series[t].name
          item.Time = 'Breakfast'
          item.Meal = this.TM_multi[i].series[t].Meal
          item.Rating = this.TM_multi[i].series[t].value
          item.Id = this.TM_multi[i].series[t].Id

          array.push(item)
        }
      }
    }

      for (let i=1; i<2; i++) {
        for (let t=0; t<this.TM_multi[i].series.length; t++) {
          let currentNumber = Number(this.TM_multi[i].series[t].value)
          if (currentNumber <= lowest && currentNumber != 0.0) {
            lowest = currentNumber
            let item: rankedRatings = {
              Date: '',
              Time: '',
              Meal: '',
              Rating: 0,
              Id: ''
            }
            item.Date = this.TM_multi[i].series[t].name
            item.Time = 'Lunch'
            item.Meal = this.TM_multi[i].series[t].Meal
            item.Rating = this.TM_multi[i].series[t].value
            item.Id = this.TM_multi[i].series[t].Id
  
            array.push(item)
        }
      }
    } 

        for (let i=2; i<3; i++) {
          for (let t=0; t<this.TM_multi[i].series.length; t++) {
            let currentNumber = Number(this.TM_multi[i].series[t].value)
            if (currentNumber <= lowest && currentNumber != 0.0) {
              lowest = currentNumber
              let item: rankedRatings = {
                Date: '',
                Time: '',
                Meal: '',
                Rating: 0,
                Id: ''
              }
              item.Date = this.TM_multi[i].series[t].name
              item.Time = 'Tea'
              item.Meal = this.TM_multi[i].series[t].Meal
              item.Rating = this.TM_multi[i].series[t].value
              item.Id = this.TM_multi[i].series[t].Id
    
              array.push(item)
          }
        }
      }

        console.log(">>> Lowest Array: " + JSON.stringify(this.TM_lowestIndex))
       
    console.log(">>> Lowest breakfast: " + array)
    this.TM_lowestIndex = array
    this.TM_dataSource = new MatTableDataSource(this.TM_lowestIndex)
}

async getLastMonthRanked() {
  let array: rankedRatings[] = []
  let lowest: number = 10

  for (let i=0; i<1; i++) {
    for (let t=0; t<this.LM_multi[i].series.length; t++) {
      let currentNumber = Number(this.LM_multi[i].series[t].value)
      if (currentNumber <= lowest && currentNumber != 0.0) {
        lowest = currentNumber
        let item: rankedRatings = {
          Date: '',
          Time: '',
          Meal: '',
          Rating: 0,
          Id: ''
        }
        item.Date = this.LM_multi[i].series[t].name
        item.Time = 'Breakfast'
        item.Meal = this.LM_multi[i].series[t].Meal
        item.Rating = this.LM_multi[i].series[t].value
        item.Id = this.LM_multi[i].series[t].Id

        array.push(item)
      }
    }
  }

    for (let i=1; i<2; i++) {
      for (let t=0; t<this.LM_multi[i].series.length; t++) {
        let currentNumber = Number(this.LM_multi[i].series[t].value)
        if (currentNumber <= lowest && currentNumber != 0.0) {
          lowest = currentNumber
          let item: rankedRatings = {
            Date: '',
            Time: '',
            Meal: '',
            Rating: 0,
            Id: ''
          }
          item.Date = this.LM_multi[i].series[t].name
          item.Time = 'Lunch'
          item.Meal = this.LM_multi[i].series[t].Meal
          item.Rating = this.LM_multi[i].series[t].value
          item.Id = this.LM_multi[i].series[t].Id

          array.push(item)
      }
    }
  } 

      for (let i=2; i<3; i++) {
        for (let t=0; t<this.LM_multi[i].series.length; t++) {
          let currentNumber = Number(this.LM_multi[i].series[t].value)
          if (currentNumber <= lowest && currentNumber != 0.0) {
            lowest = currentNumber
            let item: rankedRatings = {
              Date: '',
              Time: '',
              Meal: '',
              Rating: 0,
              Id: ''
            }
            item.Date = this.LM_multi[i].series[t].name
            item.Time = 'Tea'
            item.Meal = this.LM_multi[i].series[t].Meal
            item.Rating = this.LM_multi[i].series[t].value
            item.Id = this.LM_multi[i].series[t].Id
  
            array.push(item)
        }
      }
    }

      console.log(">>> Lowest Array: " + JSON.stringify(this.LM_lowestIndex))
      
  console.log(">>> Lowest breakfast: " + lowest)
  this.LM_lowestIndex = array
  this.LM_dataSource = new MatTableDataSource(this.LM_lowestIndex)
}

  getThisWeekDates() {
    let mondayDate: Date = new Date
    let fridayDate: Date = new Date
    if (this.today < this.nextMonday()) {
      mondayDate= new Date(this.nextMonday().setDate(this.nextMonday().getDate() - 7))
      // console.log(this.nextMonday())
      console.log("Monday date: " + mondayDate)
      fridayDate.setDate(mondayDate.getDate() + 4)
      console.log("Friday date: " + fridayDate)

      while (mondayDate <= fridayDate) {
        this.thisWeekDateArray.push(this.datePipe.transform(mondayDate, "yyyy-MM-dd") || '')
        mondayDate.setDate(mondayDate.getDate() + 1)
        console.log("Monday + 1: " + mondayDate)
        console.log("Friday's same date: " + fridayDate)
      }

      if (this.thisWeekDateArray[this.thisWeekDateArray.length] != this.datePipe.transform(fridayDate, "yyyy-MM-dd")) {
        this.thisWeekDateArray.push(this.datePipe.transform(fridayDate, "yyyy-MM-dd") || '')
      }
    }

    return this.thisWeekDateArray
  }

  getNextWeekDates() {
    let mondayDate: Date = new Date
    let fridayDate: Date = new Date
    if (this.today < this.nextMonday()) {
      mondayDate= new Date(this.nextMonday().setDate(this.nextMonday().getDate()))
      // console.log(this.nextMonday())
      console.log("Monday date: " + mondayDate)
      fridayDate.setDate(mondayDate.getDate() + 4)
      console.log("Friday date: " + fridayDate)

      while (mondayDate <= fridayDate) {
        this.nextWeekDateArray.push(this.datePipe.transform(mondayDate, "yyyy-MM-dd") || '')
        mondayDate.setDate(mondayDate.getDate() + 1)
        console.log("Monday + 1: " + mondayDate)
        console.log("Friday's same date: " + fridayDate)
      }

      if (this.nextWeekDateArray[this.nextWeekDateArray.length] != this.datePipe.transform(fridayDate, "yyyy-MM-dd")) {
        this.nextWeekDateArray.push(this.datePipe.transform(fridayDate, "yyyy-MM-dd") || '')
      }
    }

    return this.nextWeekDateArray
  }

  colorScheme = {
    domain: ['#5AA454', '#C7B42C', '#AAAAAA']
  };

  seeReview(id: string) {
    this.router.navigate([`reviews/${id}`])
  }


  TM_onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  TM_onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  TM_onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  LM_onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  LM_onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  LM_onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  PTM_onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  PTM_onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  PTM_onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  PLM_onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  PLM_onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  PLM_onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
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

  // findLowest(array: string[]) {
  //   var lowest = Number.POSITIVE_INFINITY;
  //   var highest = Number.NEGATIVE_INFINITY;
  //   var tmp;
  //   for (var i=array.length-1; i>=0; i--) {
  //       tmp = array[i].value;
  //       if (tmp < lowest) lowest = tmp;
  //       if (tmp > highest) highest = tmp;
  //   }
  //   console.log(highest, lowest);
  // }


}
