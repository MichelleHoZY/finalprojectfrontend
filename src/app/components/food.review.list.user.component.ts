import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MealReview, UserMealReview, UserMeals } from '../models';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatAccordion } from '@angular/material/expansion';
import { FoodService } from '../services/FoodService';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { FileInput } from 'ngx-material-file-input';
import { Router } from '@angular/router';
import { sub } from 'date-fns';

export interface DialogData {
  PostId: string,
  Date: string,
  Rating: string,
  Caption: string,
  File: string,
  MealId: string,
  UserId: any
}

let data_ = {
  PostId: '',
  Date: '',
  Rating: '',
  Caption: '',
  Pic: '',
  MealId: ''
}

@Component({
  selector: 'app-food.review.list.user',
  templateUrl: './food.review.list.user.component.html',
  styleUrls: ['./food.review.list.user.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class FoodReviewListUserComponent implements OnInit {

  reviewList: MealReview[] = []
  displayedColumns: string[] = ['Date', 'Rating', 'User']
  displayedColumnsWithExpand = [...this.displayedColumns, 'expand']
  dataSource: MatTableDataSource<UserMeals> = new MatTableDataSource()
  obs!: Observable<any>

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  // userId: number = 1
  meals: string[] = []
  selected: string[] = []
  preselected: string[] = []
  data!: UserMeals[]
  itemNo: number = 4

  Rating: number = 5
  Caption: string = ''
  File: any
  Date = new Date
  MealId!: any
  dataShown: any[] = []
  pageNo!: number

  disableAll = false

  id: any | null = 0
  token: string | null = ''

  length: number = 0

  constructor(private foodSvc: FoodService, public dialog: MatDialog) { }

  ngOnInit(): void {
    // this.id = + this.foodSvc.id
    this.id = localStorage.getItem("id")
    this.token = localStorage.getItem("token")
    this.foodSvc.token = this.token
    console.log(">>> Meals Id: " + this.id)
    this.foodSvc.getUserMeals(this.id)
      .then(result => {
        console.log(result)
        this.data = result
        // console.log(this.data[0].Date)
        this.length = this.data.length
        this.dataSource = new MatTableDataSource(this.data)
        this.dataSource.paginator = this.paginator;
        this.obs = this.dataSource.connect();
        console.log(this.data)
      })
      .catch(error => {
        console.log(error)
      })
    
    this.foodSvc.getUserReviews(this.id)
      .then(result => {
        console.log(result)
        this.preselected = result.mealId
        console.log("Preselected: " + this.preselected)
      })
      .catch(error => {
        console.log(error)
      })
    
    // console.log(">>> User Id app component: " + this.sub$)


    // let mealId = this.activatedRoute.snapshot.params['id']
    // this.foodSvc.getUserReviews(this.userId)
    //   .then(result => {

    //     console.log(result)
    //     this.reviewList = result
        
    //     console.log(">>> Review list: " + JSON.stringify(this.reviewList))
    //     this.dataSource = new MatTableDataSource(this.reviewList)
    //     console.log(">>> Datasource: " + result.at(0)?.Date)

    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;

    //     this.dataSource.filterPredicate = function(data, filter: string): boolean {
    //       return data.Rating.toString() === filter || data.Date.toString() === filter || data.User.toString() === filter
    //     };
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   })

}

  pageSize() {
    let pageNumber: number = 0
    for (let i=0; i<this.data.length; i++) {
      if (this.data[i].Date !== this.data[i+1].Date) {
        pageNumber = pageNumber + 1
        this.pageNo = i
      }
      return pageNumber
    }
    return pageNumber
  }


// User: string,
// PostId: string,
// Date: string,
// Rating: string,
// Caption: string,
// Pic: string,
// MealId: string

openDialog(mealId: string): void {

  console.log(this.preselected)

  this.MealId = mealId

  console.log(">>> This meal id: " + mealId)

  let review: UserMealReview = {
    postId: '',
    rating: '',
    caption: '',
    pic: ''
  }

  this.foodSvc.getUserMealReviews(+this.id, mealId)
    .then(result => {
      console.log(result)
      review.postId = result.postId
      review.caption = result.caption
      review.rating = result.rating
      review.pic = result.pic
      console.log(">>> Pic: " + review.pic)
      console.log(">>> Post Id: " + review.postId)

      const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
        width: '450px',
        data: {User: this.id, PostId: review.postId, Date: this.Date, Rating: review.rating, Caption: review.caption, File: review.pic, MealId: this.MealId},
      });
    
      dialogRef.disableClose = true;
    
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        // this.data = result;
        // console.log(result)
      });
    })
    .catch(error => {
      console.log(error)

      const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
        width: '450px',
        data: {User: this.id, PostId: review.postId, Date: this.Date, Rating: review.rating, Caption: review.caption, File: review.pic, MealId: this.MealId},
      });
    
      dialogRef.disableClose = true;
    
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        // this.data = result;
        // console.log(result)
      });
    })
}


  // checkDialog(mealId: string, i: number) {
  //   this.preselected.forEach(pres => {
  //     if (pres === mealId) return this.openDialog(i)
  //   })
    // for (let x=0; x<this.preselected.length; x++) {
    //   if (mealId === this.preselected.at(x)) {
    //     return this.openDialog(i)
    //   }
    // }
    // return 
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  checkReview(mealId: string) {
    for (let i=0; i<this.preselected.length; i++) {
      if (mealId === this.preselected.at(i)) {
        return '';
      }
    }
    return 'primary'
  }

  checkDisable(mealId: string) {
    for (let i=0; i<this.preselected.length; i++) {
      if (mealId === this.preselected.at(i)) {
        return true;
      }
    }
    return false
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog implements OnInit {

  autoTicks = false;
  invert = false;
  max = 10;
  min = 1;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value: number = 5;
  vertical = false;
  tickInterval = 1;
  form!: FormGroup

  mealId_: string = ''
  postId_: string = ''
  userId_: any | null = 0
  pic_: string = ''
  token: string | null = ''
  url: string = ''
  preselected: string[] = []

  @ViewChild('toUpload')
  toUpload!: ElementRef

  constructor(private fb: FormBuilder, private router: Router, private foodSvc: FoodService, private datePipe: DatePipe,
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.mealId_ = this.data.MealId
    this.postId_ = this.data.PostId
    // this.userId_ = + this.foodSvc.id
    this.pic_ = this.data.File
    this.userId_ = localStorage.getItem("id")
    this.token = localStorage.getItem("token")
    this.foodSvc.token = this.token
    console.log(this.mealId_)
    console.log(this.postId_)
    console.log(this.userId_)
    console.log(this.pic_)
  }

  ngOnInit(): void {
      this.form = this.createForm(this.data || null)

      if (this.postId_.length > 0) {
        this.value = +this.data.Rating
      }
      console.log(">>> Id: " + this.postId_)
  }

  createForm(data: DialogData): FormGroup {
    return this.fb.group({
      rating: this.fb.control<number>(this.value, [Validators.required]),
      caption: this.fb.control<string>('' || data.Caption),
      pic: this.fb.control<any>('')
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  processForm() {
    console.log(this.form.value)
    console.log((this.form.value.pic))
    let formValues: any = {
      PostId: '',
      Caption: '',
      Rating: 0,
      Pic: '',
      MealId: '',
      User: 0,
      Date: new Date
    }

    formValues.Caption = this.form.value.caption
    formValues.Rating = this.form.value.rating
    formValues.Date = this.datePipe.transform(new Date, "yyyy-MM-dd")
    formValues.MealId = this.data.MealId
    formValues.User = this.userId_
    // to be uncommented after making digitalocean
    formValues.Pic = this.url

    if (this.postId_.length < 1) {
      console.log("Url: " + this.url)
      this.foodSvc.uploadPost(formValues)
        .then(result => {
          console.log(result)
          window.location.reload()
        })
        .catch(error => {
          console.log(error)
        })
  
      console.log(formValues)
    } else {
      formValues.PostId = this.postId_
      this.foodSvc.updateUserReview(formValues)
      .then(result => {
        console.log(result)
        window.location.reload()
      })
      .catch(error => {
        console.log(error)
      })

    console.log(formValues)
    }
  }

  getSliderTickInterval(): number | 'auto' {
    if (this.showTicks) {
      return this.autoTicks ? 'auto' : this.tickInterval;
    }

    return 0;
  }

  ratingOnChange(rating: any) {
    this.value = rating
  }

  checkReview(mealId: string) {
    for (let i=0; i<this.preselected.length; i++) {
      if (mealId === this.preselected.at(i)) {
        return '';
      }
    }
    return 'primary'
  }

  onImageUpload(event: any) {
    let reader = new FileReader();

    reader.onload = (event: any) => {
      this.url = event.target.result;
    };

    reader.onerror = (event: any) => {
      console.log("File could not be read: " + event.target.error.code);
    };

    reader.readAsDataURL(event.target.files[0]);
  }

}
