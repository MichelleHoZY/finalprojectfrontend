import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MealReview } from '../models';
import { FoodService } from '../services/FoodService';

@Component({
  selector: 'app-food.review.form',
  templateUrl: './food.review.form.component.html',
  styleUrls: ['./food.review.form.component.css']
})
export class FoodReviewFormComponent implements OnInit {

  form!: FormGroup

  constructor(private fb: FormBuilder, private router: Router, private foodSvc: FoodService) { 
    this.fileControl = new FormControl(this.file);
  }

  autoTicks = false;
  invert = false;
  max = 10;
  min = 1;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value = 5;
  vertical = false;
  tickInterval = 1;
  url!: string | null

  fileControl!: FormControl;
  public file: any;
  filename = '';
  token: string | null = ''

  multiple: boolean = false;
  accept: string =
    ".doc,.docx,.pdf,.ppt,.pptx,.csv,.xls,.txt,.mp3,.mp4,.wmv,.flv,.svg,.jpeg,.png,.jpg";

  @ViewChild('toUpload')
  toUpload!: ElementRef

  // rating = 0

  ngOnInit(): void {
    this.token = localStorage.getItem("token")
    this.foodSvc.token = this.token
    this.form = this.createForm()

    this.fileControl.valueChanges.subscribe((file: File) => {
      this.file = file;
      this.filename = file.name;
      console.log(file.type)
      console.log('fileName = ' + this.filename);
    })
  
  }

  getSliderTickInterval(): number | 'auto' {
    if (this.showTicks) {
      return this.autoTicks ? 'auto' : this.tickInterval;
    }

    return 0;
  }

  exit() {
    this.router.navigate(['/'])
  }

  ratingOnChange(rating: any) {
    this.value = rating
  }

  processForm() {
    console.log(this.form.value)

    const data: MealReview = this.form.value as MealReview
    console.log(">>> Meal review: " + JSON.stringify(data))
    console.log(data.Pic)

    this.foodSvc.uploadPost(data)
    // .then(result => {
    //   console.log(result)
    // })
    // .catch(error => {
    //   console.log(error)
    // })

    this.url = this.toUpload.nativeElement.files[0]
    console.log(this.url)

    // const _file = this.form.get('pic')?.value
    // const file = _file.files[0]
    // data.Pic = file
  }

  onChange(event: any) {
    console.log(event)
    console.log(this.form.value)
    console.log(this.form.value.pic)
    // console.log("Here")
    // let reader = new FileReader();
    // console.log("There")

    // reader.onload = (event: any) => {
    //   this.url = event.target.result
    //   console.log("Here again")
    // };

    // reader.onerror = (event: any) => {
    //   console.log("File could not be read: " + event.target.error.code);
    // };

    // console.log("There again")

    // const selectedImage = event.target.files[0]; // get image
    // if (selectedImage instanceof Blob) {
    //   console.log("Blob")
    //   // this.createBase64Image(selectedImage);
    // } else {
    //   //not a blob, cancel/close happened
    //   console.log("Not blob")
    // }

    // // reader.readAsDataURL(event.target.files[0]);

    // console.log("Finish")
    console.log(typeof event)

  }

  createForm(): FormGroup {
    return this.fb.group({
      rating: this.fb.control<number>(5, [Validators.required]),
      caption: this.fb.control<string>('', [Validators.required]),
      pic: this.fb.control<any>('')
    })
  }

}
