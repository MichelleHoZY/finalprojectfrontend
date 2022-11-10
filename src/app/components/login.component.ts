import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserDetails } from '../models';
import { FoodService } from '../services/FoodService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  form!: FormGroup
  errorMessage = {
    result: ''
  }
  respStatus: number = 0
  respMsg: string = ''
  token: string = ''

  constructor(private fb: FormBuilder, private router: Router, private foodSvc: FoodService) { }

  ngOnInit(): void {
    this.form = this.createForm()
  }

  createForm(): FormGroup {
    return this.fb.group({
      email: this.fb.control<string>(''), // [Validators.required, Validators.minLength(5), Validators.maxLength(64)]
      password: this.fb.control<string>('')
    })
  }

  login() {
    console.log(">>> Login button pressed")
    let data: UserDetails = this.form.value as UserDetails
    console.log(data)
    this.foodSvc.login(data)
      .then(result => {
        console.log(result)
        this.respStatus = this.foodSvc.loginResponse
        console.log("Status : " + this.respStatus)
        this.token = result.token
        console.log(this.token)
        this.foodSvc.token = this.token
        this.foodSvc.userId.next(result.id)
        this.foodSvc.id = result.id
        localStorage.setItem("id", result.id.toString())
        localStorage.setItem("token", result.token)
        localStorage.setItem("username", result.username)
        console.log("End date: " + result.endDate + " " + typeof(result.endDate))
        localStorage.setItem("endDate", result.endDate)
        let vegetarian: boolean = result.vegetarian
        if (vegetarian) {
          localStorage.setItem("vegetarian", "true")
        }
        this.foodSvc.username = result.name
        this.foodSvc.vegetarian = result.vegetarian
        this.router.navigate(['home'])
      })
      .catch(error => {
        console.log(error)
        this.respStatus = this.foodSvc.loginResponse
        this.respMsg = error.error.result
        console.log("Status : " + this.respStatus)
      })
  }

  createAccount() {
    this.router.navigate(['createAccount'])
  }

}
