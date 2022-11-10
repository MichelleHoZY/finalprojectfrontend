import { Component, Injectable, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiResults } from '../models';
import { FoodService } from '../services/FoodService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-food.nutrition',
  templateUrl: './food.nutrition.component.html',
  styleUrls: ['./food.nutrition.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class FoodNutritionComponent implements OnInit {

  form!: FormGroup
  dataSource: any[] = []
  columns: string[] = ['Name']
  columnsToDisplayWithExpand = [...this.columns, 'expand'];
  token: string | null = ''


  ngOnInit(): void {
    this.form = this.createForm()
    this.token = localStorage.getItem("token")
    this.foodSvc.token = this.token
  }

  constructor(private fb: FormBuilder, private foodSvc: FoodService, private router: Router) {
  }

  createForm(): FormGroup {
    return this.fb.group({
      food: this.fb.control<string>('')
    })
  }

  goToPage(url: string): void {
    window.open(url, '_blank')
}

  processForm() {
    console.log(">>> Food search: " + JSON.stringify(this.form.value))
    let search: string = this.form.value.food
    console.log(">>> Food string: " + search)
    this.foodSvc.nutritionApiSearch(search)
      .then(result => {
        console.log(result)
        let data: ApiResults[] = result as unknown as ApiResults[]
        this.dataSource = data
        // for (let i=0; i<result.length; i++) {
        //   this.database.rootLevelNodes.push(data.at(i)?.name)
        //   // this.database.dataMap.set(data.at(i)?.name, data.at(i).calories)
        // }
        // console.log(this.database.rootLevelNodes)
        // console.log(this.database.dataMap)
      })
      .catch(error => {
        console.log(error)
      })
  }

}
