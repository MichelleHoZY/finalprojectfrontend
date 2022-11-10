import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, } from '@angular/core';
import { FormBuilder, FormGroup, MinLengthValidator, Validators } from '@angular/forms';
import { MatDatepickerInputEvent, MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { MatAccordion } from '@angular/material/expansion';
import { FiveDayRangeSelectionStrategy } from '../services/DateRangeService';
import { DateAdapter } from '@angular/material/core';
import { Menu, MenuItems } from '../models';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { FoodService } from '../services/FoodService';

@Component({
  selector: 'app-food.form.menu',
  templateUrl: './food.form.menu.component.html',
  styleUrls: ['./food.form.menu.component.css'],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: FiveDayRangeSelectionStrategy
    }
  ]
})
export class FoodFormMenuComponent implements OnInit {

  form!: FormGroup
  // dateArray: any[] = []
  date!: Date | null
  // endDate!: Date | null
  menu: Menu = {
    date: '',
    menuItems: {
      vegetarian: false,
      breakfast_main: '',
      breakfast_drinks: '',
      breakfast_dessert: '',
      lunch_main: '',
      lunch_drinks: '',
      lunch_dessert: '',
      tea_main: '',
      tea_drinks: '',
      tea_dessert: ''
    }
  }
  todayDate = new Date()
  onProcessForm = new Subject<Menu>()
  token: string | null = ''

  @ViewChild(MatAccordion)
  accordion: MatAccordion = new MatAccordion;

  constructor(private fb: FormBuilder, private datePipe: DatePipe, private dateAdapter: DateAdapter<Date>, 
    private router: Router, private FoodSvc: FoodService) {
    this.dateAdapter.setLocale('en-GB')
  }

  ngOnInit(): void {
    this.form = this.createForm()
    this.token = localStorage.getItem("token")
    this.FoodSvc.token = this.token
  }

  processForm() {
    // this.getDates(this.startDate, this.endDate)
    let date = this.datePipe.transform(this.form.value.date, "yyyy-MM-dd")
    console.log(">>> Form value: " + JSON.stringify(this.form.value))
    console.log(">>> Date array: " + date)
    const data: MenuItems = this.form.value as MenuItems
    this.menu.menuItems = data
    this.menu.date = date
    console.log(">>> Form data: " + JSON.stringify(this.menu))
    this.FoodSvc.saveMenu(this.menu)
      .then(result => {
        console.log(">>> Result: " + JSON.stringify(result))
        this.form.reset()
      })
      .catch(error => {
        console.log(">>> Error: " + JSON.stringify(error))
      })

  }

  // addDate($event: MatDatepickerInputEvent<Date>) {
  //   this.date = $event.value
  // }

  // changeDate($event: MatDatepickerInputEvent<Date>) {
  //   this.date = $event.value
  // }

  exit() {
    let date = this.datePipe.transform(this.form.value.date, "yyyy-MM-dd")
    console.log(">>> Form value: " + JSON.stringify(this.form.value))
    console.log(">>> Date array: " + date)

    const data: MenuItems = this.form.value as MenuItems
    this.menu.menuItems = data
    this.menu.date = date
    console.log(">>> Form data: " + JSON.stringify(this.menu))
    this.FoodSvc.saveMenu(this.menu)
      .then(result => {
        console.log(">>> Result: " + JSON.stringify(result))
        this.form.reset()
      })
      .catch(error => {
        console.log(">>> Error: " + JSON.stringify(error))
      })

  }

  createForm(): FormGroup {
    return this.fb.group({
      date: this.fb.control<Date>(new Date, [Validators.required]),
      vegetarian: this.fb.control<boolean>(false),
      breakfast_main: this.fb.control<string>('', [Validators.required, Validators.minLength(5)]),
      breakfast_drinks: this.fb.control<string>('', [Validators.required, Validators.minLength(3)]),
      breakfast_dessert: this.fb.control<string>(''),
      breakfast_remarks: this.fb.control<string>(''),
      lunch_main: this.fb.control<string>('', [Validators.required, Validators.minLength(5)]),
      lunch_drinks: this.fb.control<string>('', [Validators.required, Validators.minLength(3)]),
      lunch_dessert: this.fb.control<string>(''),
      lunch_remarks: this.fb.control<string>(''),
      tea_main: this.fb.control<string>('', [Validators.required, Validators.minLength(5)]),
      tea_drinks: this.fb.control<string>('', [Validators.required, Validators.minLength(3)]),
      tea_dessert: this.fb.control<string>(''),
      tea_remarks: this.fb.control<string>('')
    })
  }

  // addFridayDate($event: MatDatepickerInputEvent<Date>) {
  //   this.endDate = $event.value
  // }

  // changeFridayDate($event: MatDatepickerInputEvent<Date>) {
  //   this.endDate = $event.value
  // }

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
