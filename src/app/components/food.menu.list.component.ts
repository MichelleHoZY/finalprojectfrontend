import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { MenuResponse, UserMeals } from '../models';
import { FoodService } from '../services/FoodService';

@Component({
  selector: 'app-food.menu.list',
  templateUrl: './food.menu.list.component.html',
  styleUrls: ['./food.menu.list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class FoodMenuListComponent implements OnInit {

  menuList: MenuResponse[] = []
  columns: string[] = ['Date', 'Time', 'Vegetarian']
  innerColumns: string[] = ['Main', 'Drinks', 'Dessert', 'Remarks']
  columnsToDisplayWithExpand = [...this.columns, 'expand'];
  sub$!: Subscription

  length: number = 0

  dataSource: MatTableDataSource<MenuResponse> = new MatTableDataSource()
  obs!: Observable<any>
  token: string | null = ''

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  constructor(private foodSvc: FoodService, private router: Router) { }

ngOnInit(): void {
  // console.log(this.nextFriday())
  this.token = localStorage.getItem("token")
  this.foodSvc.token = this.token
  console.log(">>> Token: " + this.token)
    this.foodSvc.getMenuList()
    .then(result => {
      console.log(result)
      this.menuList = result
      // console.log(this.data[0].Date)
      this.length = this.menuList.length
      this.dataSource = new MatTableDataSource(this.menuList)
      this.obs = this.dataSource.connect();
  
      this.dataSource.paginator = this.paginator;
      console.log(this.menuList)
    })
    .catch(error => {
      console.log(error)
    })
    

}
  
  // ngOnInit(): void {
  //   // this.sub$ = this.foodSvc.allMenuList.subscribe(
  //   //   menu => {
  //   //     this.menuList = menu
  //   //     console.log(this.menuList)
  //   //   }
  //   // )
  //   this.foodSvc.getMenuList()
  //     .then(result => {
  //       this.menuList = result
  //       console.log(result)
  //     })
  //     .catch(error => {
  //       console.log(error)
  //     })
  // }

  // ngOnDestroy(): void {
  //     this.sub$.unsubscribe()
  // }

  edit(index: any) {
    console.log(">>> Edit index clicked: " + JSON.stringify(index))
    const object: MenuResponse = this.menuList[index] as MenuResponse
    this.foodSvc.menuItem = object
    // this.foodSvc.selectedMenuItem.next(object)
    // this.foodSvc.printSelectedMenu()
    console.log(object)

    if (index != null) {
      this.router.navigate(['editItem'])
    }
    // this.router.navigate(['editItem'])
    // this.foodSvc.selectedMenuItem = this.onEditClicked
    // console.log(this.foodSvc.selectedMenuItem)
  }

  delete(mealId: string) {
    console.log(">>> Meal id: " + mealId)
    this.foodSvc.deleteMenu(mealId)
      .then(result => {
        console.log(">>> Result: " + JSON.stringify(result))
        this.menuList = []
        window.location.reload()
      })
      .catch(error => {
        console.log(">>> Error: " + error)
      })
  }

  reviews(index: any) {
    this.router.navigate(['reviews', index.Id])
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();


    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  nextFriday(mealDate: string) {
    let d = mealDate.split('-');
    let convertedDate = new Date(+d[0], +d[1] - 1, +d[2]); 

    convertedDate.setDate((convertedDate.getDate() + (1 + 7 - convertedDate.getDay()) % 7) - 15);
    // console.log(convertedDate);

    return convertedDate
  }

  checkDates(mealDate: string) {
    let currentDate = new Date
    if (currentDate < this.nextFriday(mealDate)) {
      return false
    }
    return true
  }

  navigateReview(id: string) {
    this.router.navigate([`reviews/${id}`])
  }

}
