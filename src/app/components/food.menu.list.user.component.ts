import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatList, MatListOption, MatSelectionListChange } from '@angular/material/list';
import { MatSelect } from '@angular/material/select';
import { MatStepper } from '@angular/material/stepper';
import { local } from 'd3-selection';
import { Subscription } from 'rxjs';
import { AttendanceObject, MenuDate, MenuItemsObject, MenuResponse, Preselected, UpdateAttendance } from '../models';
import { FoodService } from '../services/FoodService';

@Component({
  selector: 'app-food.menu.list.user',
  templateUrl: './food.menu.list.user.component.html',
  styleUrls: ['./food.menu.list.user.component.css']
})
export class FoodMenuListUserComponent implements OnInit {

  constructor(private foodSvc: FoodService, private datePipe: DatePipe, private fb: FormBuilder) {}

  // form!: FormGroup
  // meals: string[] = ['Breakfast', 'Lunch', 'Tea Break'];

  // ngOnInit(): void {
  //     this.form = this.createForm()
  // }

  // createForm(): FormGroup {
  //   return this.fb.group({
  //     monday_breakfast: this.fb.control<boolean>(false),
  //     monday_lunch: this.fb.control<boolean>(false),
  //     monday_tea: this.fb.control<boolean>(false),
  //     tuesday_breakfast: this.fb.control<boolean>(false),
  //     tuesday_lunch: this.fb.control<boolean>(false),
  //     tuesday_tea: this.fb.control<boolean>(false),
  //     wednesday_breakfast: this.fb.control<boolean>(false),
  //     wednesday_lunch: this.fb.control<boolean>(false),
  //     wednesday_tea: this.fb.control<boolean>(false),
  //     thursday_breakfast: this.fb.control<boolean>(false),
  //     thursday_lunch: this.fb.control<boolean>(false),
  //     thursday_tea: this.fb.control<boolean>(false),
  //     friday_breakfast: this.fb.control<boolean>(false),
  //     friday_lunch: this.fb.control<boolean>(false),
  //     friday_tea: this.fb.control<boolean>(false)
  //   })
  // }

  id: any | null = 0
  token: string | null = ''
  vegetarianString: string | null = ''
  vegetarianBoolean: boolean = false
  endDate: Date | null = new Date

  ngOnInit(): void {
    // this.id = this.foodSvc.id
    let dateStr = localStorage.getItem("endDate")
    this.endDate = new Date(dateStr || '')
    console.log(">>> End date: " + this.endDate)
    this.id = localStorage.getItem("id")
    this.token = localStorage.getItem("token")
    this.vegetarianString = localStorage.getItem("vegetarian")
    if (this.vegetarianString === "true") {
      this.vegetarianBoolean = true
    }
    this.foodSvc.token = this.token
    let currentDate = new Date()
    if (currentDate < this.endDate) {
      if (currentDate < this.nextMonday()) {
        this.menuDates.dates = this.createMenuDates()
        this.preselectedReq.dates = this.createMenuDates()
        this.preselectedReq.userId = this.id
        console.log(">>> On init: " + this.menuDates.dates)
        console.log(this.menuDates.dates)
        this.menuDates.vegetarian = this.vegetarianBoolean
        this.foodSvc.getMenuByDateStudent(this.menuDates)
          .then(result => {
            // console.log(result)
            // this.allResult = result
            for (let {Id, Main, Drinks, Dessert, Remarks, Time, Date} of result) {
              let array: any[] = []
              let object = {
                Id: '',
                Main: '',
                Drinks: '',
                Dessert: '',
                Remarks: '',
                Time: '',
                Date: Date
              }
              // console.log(`Id: ${Id}, Main: ${Main}`)
              object.Id = Id
              object.Main = Main
              object.Drinks = Drinks
              object.Dessert = Dessert
              object.Remarks = Remarks
              object.Time = Time
              object.Date = Date
              this.mealMenuId.push(Id)
              // console.log(`${object.Id} + ${object.Main}`)
              array.push(object)
              this.mealMenu.push(array)
              console.log(this.mealMenu)
            }
            // // this.mealMenu = result
            // for (let t=0; t<this.menuDates.dates.length; t++) {
            //   for (let i=0; i<result.length; i++) {
            //     if (this.menuDates.dates.at(t) === result.at(i)?.Date) {
            //       // let object: MenuItemsObject = {
            //       //   Main: '',
            //       //   Id: ''
            //       // }
            //       // object.Main = result.at(i)?.Main
            //       // object.Id = result.at(i)?.Id
            //       // this.mealMenu.push(object)
  
            //       let array = []
            //       let valueArray = []
            //       let mealDessert = []
            //       let idArray = []
            //       array.push(result.at(i)?.Main)
            //       array.push(result.at(i)?.Drinks)
            //       array.push(result.at(i)?.Dessert)
            //       valueArray.push(result.at(i)?.Id)
            //       idArray.push(result.at(i)?.Id)
            //       this.mealMenu.push(array)
            //       // this.mealValueMonday.push(valueArray)
            //       this.mealMenuId.push(idArray)
            //       this.sortArray(array)
            //       console.log(array)
            //       console.log(this.mealMenu)
            //     }
            //   }
            // }
            // // console.log(">>> Test: " + this.mealMenu[0].Main)
            console.log(this.mealMenuId)
            this.foodSvc.getPreselected(this.preselectedReq)
              .then(result => {
                this.preselected = result
                this.preselectedImmutable = result
                console.log(">>> Preselected meals: " + this.preselected)
              })
              .catch(error => {
                console.log(error)
              })
  
          })
          .catch(error => {
            console.log(error)
          })
      }
    }
    

    
  }

  @ViewChild('stepper', { static: false })
  stepper!: MatStepper

  @ViewChild('mealListM', { static: false })
  mealsSelectedM!: MatSelect

  @ViewChild('mealListT', { static: false })
  mealsSelectedTu!: MatSelect

  @ViewChild('mealListW', { static: false })
  mealsSelectedW!: MatSelect

  @ViewChild('mealListTh', { static: false })
  mealsSelectedTh!: MatSelect

  @ViewChild('mealListF', { static: false })
  mealsSelectedF!: MatSelect

  meals: string[] = ['Breakfast', 'Lunch', 'Tea Break'];
  allMealValue: string[] = ['Monday Breakfast', 'Monday Lunch', 'Monday Tea', 'Tuesday Breakfast', 'Tuesday Lunch', 'Tuesday Tea',
  'Wednesday Breakfast', 'Wednesday Lunch', 'Wednesday Tea', 'Thursday Breakfast', 'Thursday Lunch', 'Thursday Tea',
  'Friday Breakfast', 'Friday Lunch', 'Friday Tea']
  mealValueMonday: string[] = ['Monday Breakfast', 'Monday Lunch', 'Monday Tea']
  mealValueTuesday: string[] = ['Tuesday Breakfast', 'Tuesday Lunch', 'Tuesday Tea']
  mealValueWednesday: string[] = ['Wednesday Breakfast', 'Wednesday Lunch', 'Wednesday Tea']
  mealValueThursday: string[] = ['Thursday Breakfast', 'Thursday Lunch', 'Thursday Tea']
  mealValueFriday: string[] = ['Friday Breakfast', 'Friday Lunch', 'Friday Tea']
  mealMenu: any[] = []// [['Beehoon'], ['Rice'], ['Cakes']];
  mealsSelectionM: string[] = []
  mealsSelectionTu: string[] = []
  mealsSelectionW: string[] = []
  mealsSelectionTh: string[] = []
  mealsSelectionF: string[] = []
  allSelection: string[] = []
  menuDates: MenuDate = {
    vegetarian: false,
    dates: []
  }
  preselectedReq: Preselected = {
    userId: 0,
    dates: []
  }
  mealMenuId: any[] = []
  allResult: any[] = []

  mealDay: string[] = []
  uniqueMealDay: string[] = []

  disableAll = false

  preselected: string[] = []//['d10aa2a5', '7962d93a']
  preselectedImmutable: string[] = []

  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  daysArr = ['Monday Breakfast', 'Monday Lunch', 'Monday Tea Break', 'Tuesday Breakfast', 'Tuesday Lunch', 'Tuesday Tea Break',
  'Wednesday Breakfast', 'Wednesday Lunch', 'Wednesday Tea Break', 'Thursday Breakfast', 'Thursday Lunch', 'Thursday Tea Break',
  'Friday Breakfast', 'Friday Lunch', 'Friday Tea Break']

  selectionChangedAll(options: MatListOption[]) {
    console.log(options.map(o => o.value))
    let values: string[] = options.map(o => o.value)
    this.mealsSelectionM = values
    this.sortArray(this.mealsSelectionM)
  }

  selectionChangedM(options: MatListOption[]) {
    console.log(options.map(o => o.value))
    let values: string[] = options.map(o => o.value)
    this.mealsSelectionM = values
    this.sortArray(this.mealsSelectionM)
    console.log(this.mealsSelectionM)
    // console.log(this.mealDay)
    // for (let i=0; i<values.length; i++) {
    //   if (this.mealMenu[i][0].Id === values[i]) {
    //     if (this.mealMenu[i][0].Time === 'B') {
    //       this.mealDay.push('Monday Breakfast')
    //     } else if (this.mealMenu[i][0].Time === 'L') {
    //       this.mealDay.push('Monday Lunch')
    //     } else {
    //       this.mealDay.push('Monday Tea Break')
    //     }
    //   }
    // }
    // console.log(this.mealDay)
  }

  selectionChangedTu(options: MatListOption[]) {
    console.log()
    console.log(options.map(o => o.value))
    let values: string[] = options.map(o => o.value)
    this.mealsSelectionTu = values
    this.sortArray(this.mealsSelectionTu)
    console.log(this.mealsSelectionTu)
  }

  selectionChangedW(options: MatListOption[]) {
    console.log(options.map(o => o.value))
    let values: string[] = options.map(o => o.value)
    this.mealsSelectionW = values
    this.sortArray(this.mealsSelectionW)
    console.log(this.mealsSelectionW)
  }

  selectionChangedTh(options: MatListOption[]) {
    console.log(options.map(o => o.value))
    let values: string[] = options.map(o => o.value)
    this.mealsSelectionTh = values
    this.sortArray(this.mealsSelectionTh)
    console.log(this.mealsSelectionTh)
  }

  selectionChangedF(options: MatListOption[]) {
    console.log(options.map(o => o.value))
    let values: string[] = options.map(o => o.value)
    this.mealsSelectionF = values
    this.sortArray(this.mealsSelectionF)
    console.log(this.mealsSelectionF)
  }

  processForm() {
    this.allSelection = this.mealsSelectionM.concat(this.mealsSelectionTu, this.mealsSelectionW, this.mealsSelectionTh, this.mealsSelectionF)
    console.log(">>> All meals: " + this.allSelection)
    // let dateArr: string[] = []
    // for (let i=0; i<this.allSelection.length; i++) {
    //   dateArr.push(re)
    // }
  }

  overallSelection() {
    this.allSelection = this.mealsSelectionM.concat(this.mealsSelectionTu, this.mealsSelectionW, this.mealsSelectionTh, this.mealsSelectionF)
    console.log(">>> All meals: " + this.allSelection)

    for (let i=0; i<this.allSelection.length; i++) {
      for (let x=0; x<this.mealMenu.length; x++) {
        if (this.allSelection[i] === this.mealMenu[x][0].Id) {
          let day = new Date(this.mealMenu[x][0].Date)
          let dayString: string = this.days[day.getDay()]
          console.log("Daystring: " + dayString)
          if (this.mealMenu[x][0].Time === 'B') {
            this.mealDay.push(dayString.concat(" ", "Breakfast"))
          } else if (this.mealMenu[x][0].Time === 'L') {
            this.mealDay.push(dayString.concat(" ", "Lunch"))
          } else {
            this.mealDay.push(dayString.concat(" ", "Tea Break"))
          }
        

        }
      }
    }
    this.uniqueMealDay = this.mealDay.filter((v, i, a) => a.indexOf(v) === i)
    console.log(">>> Meal days: " + this.uniqueMealDay)

    for (let i=0; i<this.uniqueMealDay.length; i++) {
      this.sortDays(this.uniqueMealDay.at(i), this.uniqueMealDay.at(i+1))
    }
    // for (let i=0; i<this.allSelection.length; i++) {
    //   let str: any = this.allSelection.at(i)?.length
    //   if (this.allSelection.at(i)?.charAt(str -1) === 't') {
    //     if (this.allSelection.at(i)?.charAt(0) === 'M') {
    //       this.mealMenuId.push(this.allResult.at(0).Id)
    //     } else if (this.allSelection.at(i)?.charAt(0) === 'W') {
    //       this.mealMenuId.push(this.allResult.at(9).Id)
    //     }
    //   }

    //   if (this.allSelection.at(i)?.charAt(str -1) === 'h') {

    //   }

    //   if (this.allSelection.at(i)?.charAt(str -1) === 'a') {

    //   }
    // }
    console.log(">>> Meal menu id array: " + this.mealMenuId)
  }

  sortDays(a: any, b: any) {
    a = this.daysArr.indexOf(a);
    b = this.daysArr.indexOf(b);
    return a < b ? 0 : 1;
  };


  submitMealOptions() {
    console.log(">>> Meal options submitted")
    let data: AttendanceObject = {
      userId: 0,
      meals: []
    }
    data.userId = +this.id
    data.meals = this.allSelection
    if (this.preselected.length > 0) {
      let updateObj: UpdateAttendance = {
        userId: 0,
        preselected: [],
        updated: []
      }
      updateObj.preselected = this.preselectedImmutable
      updateObj.userId = this.id
      updateObj.updated = this.allSelection
      this.foodSvc.updateAttendance(updateObj)
        .then(result => {
          console.log(result)
          window.location.reload()
        })
        .catch(error => {
          console.log(error)
        })
    }

    if (this.preselected.length === 0) {
      this.foodSvc.saveMealAttendance(data)
      .then(result => {
        console.log(result)
        window.location.reload()
      })
      .catch(error => {
        console.log(error)
      })
    }
  }

  sortArray(array: any[]) {
    array.sort((n1, n2) => {
      if (n1 > n2) {
        return 1
      } 
      if (n1 < n2) {
        return -1
      }
      return 0
    })
  }

  nextMonday() {
    // let currentDate = new Date()
    let d = new Date();
    d.setDate(d.getDate() + (((1 + 7 - d.getDay()) % 7) || 7));
    // this.datePipe.transform(d, "yyyy-MM-dd")
    console.log(d);

    return d
  }

  createMenuDates() {
    let currentDate = this.nextMonday()
    // console.log(mondayDate)
    let fridayDate = new Date
    fridayDate.setDate(currentDate.getDate() + 4)
    // let mondayDateStr = this.datePipe.transform(mondayDate, "yyyy-MM-dd")
    // console.log(mondayDateStr)
    // let fridayDateStr = this.datePipe.transform(fridayDate, "yyyy-MM-dd")
    // this.date.startDate = mondayDateStr
    // this.date.endDate = fridayDateStr
    let dateArray: string[] = []
        while (currentDate <= fridayDate) {
        dateArray.push(this.datePipe.transform(currentDate, "yyyy-MM-dd") || '')
        currentDate.setDate(currentDate.getDate() + 1)
    }

    return dateArray
  }

  //   getDates(_startDate: any, _stopDate: any) {
//     let dateArray = [];
//     let currentDate = _startDate;
//     while (currentDate <= _stopDate) {
//         dateArray.push(this.datePipe.transform(currentDate, "yyyy-MM-dd"))
//         currentDate.setDate(currentDate.getDate() + 1)
//     }
//     console.log(dateArray)
//     this.dateArray = dateArray
//     return dateArray;
// }



}
