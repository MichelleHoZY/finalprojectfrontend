import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MenuChange, MenuResponse } from '../models';
import { FoodService } from '../services/FoodService';

@Component({
  selector: 'app-food.form.menu.item',
  templateUrl: './food.form.menu.item.component.html',
  styleUrls: ['./food.form.menu.item.component.css']
})
export class FoodFormMenuItemComponent implements OnInit {

  menuItem: MenuResponse = {
    Id: '',
    Date: new Date,
    Time: '',
    Vegetarian: false,
    Main: '',
    Drinks: '',
    Dessert: '',
    Remarks: '',
    Reviews: false
  }
  sub$!: Subscription
  form!: FormGroup
  token: string | null = ''

  constructor(private foodSvc: FoodService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.token = localStorage.getItem("token")
    this.foodSvc.token = this.token
    // this.foodSvc.printSelectedMenu()
    // this.sub$ = this.foodSvc.selectedMenuItem.subscribe(
    //   item => {
    //     this.menuItem = item
    //     console.log(`>>> Menu item: ${this.menuItem}`)
    //   }
    // )
    this.menuItem = this.foodSvc.menuItem
    
    if (this.menuItem.Id.length < 1) {
      this.router.navigate(['menuList'])
    }

    console.log(">>> Edit page: " + JSON.stringify(this.menuItem))
    this.form = this.createForm(this.menuItem)
  }

  processForm() {
    console.log(">>> Process form")
    const data: MenuChange = this.form.value as MenuChange
    this.foodSvc.changeMenu(data)
      .then(result => {
        console.log(result)
        this.router.navigate(['menuList'])
      })
      .catch(error => {
        console.log(error)
      })
  }

  exit() {
    this.router.navigate(['menuList'])
  }

  createForm(menuItem: MenuResponse): FormGroup {
    return this.fb.group({
      mealId: this.fb.control<string>(menuItem.Id),
      mealTime: this.fb.control<string>(menuItem.Time),
      vegetarian: this.fb.control<boolean>(menuItem.Vegetarian),
      main: this.fb.control<string>(menuItem.Main, [Validators.required, Validators.minLength(5)]),
      drinks: this.fb.control<string>(menuItem.Drinks, [Validators.required, Validators.minLength(3)]),
      dessert: this.fb.control<string>(menuItem.Dessert),
      remarks: this.fb.control<string>(menuItem.Remarks) 
    })
  }

//   ngOnDestroy(): void {
//     this.sub$.unsubscribe()
// }

}
