import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { MealReview, MenuResponse } from '../models';
import { FoodService } from '../services/FoodService';

@Component({
  selector: 'app-food.review.list',
  templateUrl: './food.review.list.component.html',
  styleUrls: ['./food.review.list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class FoodReviewListComponent implements OnInit {

  reviewList: MealReview[] = []
  displayedColumns: string[] = ['Date', 'Rating', 'User']
  displayedColumnsWithExpand = [...this.displayedColumns, 'expand']
  dataSource: MatTableDataSource<MealReview> = new MatTableDataSource()

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  token: string | null = ''

  constructor(private activatedRoute: ActivatedRoute, private foodSvc: FoodService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem("token")
    this.foodSvc.token = this.token

      let mealId = this.activatedRoute.snapshot.params['id']
      this.foodSvc.getReviews(mealId)
        .then(result => {

          console.log(result)
          this.reviewList = result
          
          console.log(">>> Review list: " + JSON.stringify(this.reviewList))
          this.dataSource = new MatTableDataSource(this.reviewList)
          console.log(">>> Datasource: " + result.at(0)?.Date)

          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          this.dataSource.filterPredicate = function(data, filter: string): boolean {
            return data.Rating.toString() === filter || data.Date.toString() === filter || data.User.toString() === filter
          };
        })
        .catch(error => {
          console.log(error)
        })

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();


    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}