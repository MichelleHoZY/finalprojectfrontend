import { KeyValuePipe } from "@angular/common";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Form } from "@angular/forms";
import { DateAdapter } from "@angular/material/core";
import { firstValueFrom, from, map, Observable, Subject } from "rxjs";
import { AttendanceObject, CreateAccount, MealAttendanceArray, MealReview, Menu, MenuChange, MenuDate, MenuItemsObject, MenuResponse, Preselected, TokenResp, UpdateAttendance, UserDetails, UserMealReview, UserMeals, UserReviews } from "../models";


// everyone

const createNewUser = 'https://issfoodappbackend.herokuapp.com//authorise/createUser'
const checkIdAvailable = 'https://issfoodappbackend.herokuapp.com//authorise/idAvailability'
const login = 'https://issfoodappbackend.herokuapp.com//authorise/login'

// users and admin

const getUserMealsUrl = 'https://issfoodappbackend.herokuapp.com//api/userMeals'
const saveReviewUrl = 'https://issfoodappbackend.herokuapp.com//api/saveReview'
const getUserMealReviews = 'https://issfoodappbackend.herokuapp.com//api/userMealReview'
const updateUserReviewUrl = 'https://issfoodappbackend.herokuapp.com//api/updateReview'
const searchNutritionUrl = 'https://issfoodappbackend.herokuapp.com//api/nutrition'
const getMenuByDates = 'https://issfoodappbackend.herokuapp.com//api/menuDates'
const getMenuByDatesStudent = 'https://issfoodappbackend.herokuapp.com//api/menuDatesStudent'
const saveMealAttendance = 'https://issfoodappbackend.herokuapp.com//api/saveAttendance'
const getUserReviewsUrl = 'https://issfoodappbackend.herokuapp.com//api/userReviews'
const getMealAttendance = 'https://issfoodappbackend.herokuapp.com//api/thisWeek'
const getPreselected = 'https://issfoodappbackend.herokuapp.com//api/preselected'
const updateAttendanceUrl = 'https://issfoodappbackend.herokuapp.com//api/updateAttendance'

// admin only

const changeMenuUrl = 'https://issfoodappbackend.herokuapp.com//admin/update'
const deleteMenuUrl = 'https://issfoodappbackend.herokuapp.com//admin/delete'
const saveMenuUrl = 'https://issfoodappbackend.herokuapp.com//admin/setMenu'
const getMenuListUrl = 'https://issfoodappbackend.herokuapp.com//admin/getAllMenus'
const getReviewsUrl = '/https://issfoodappbackend.herokuapp.com/admin/reviews'
const getRatingsStats = 'https://issfoodappbackend.herokuapp.com//admin/stats'
const getPaxStats = 'https://issfoodappbackend.herokuapp.com//admin/pax'

@Injectable()
export class FoodService {

    // allMenuList = new Subject<MenuResponse[]>()
    // allMenuList = from(this.getMenuList())
    // selectedMenuItem = new Subject<MenuResponse>()
    token: string | null = ''
    username: string = ''
    userId = new Subject<Number>()
    id: Number = 0
    vegetarian: boolean = false
    endDate: Date = new Date
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
      loginResponse: number = 0
      loginResp = new Subject<number>()
      emailAvailableStatus: number = 0
    //   menuItemsObject: MenuItemsObject = {
    //     Breakfast: '',
    //     Lunch: '',
    //     Tea: ''
    //   }
    // menuList: MenuResponse[] = this.getMenuList() as unknown as MenuResponse[]

    constructor(private http: HttpClient) {}

    // staff side

    // food forms services

    saveMenu(menu: Menu): Promise<string> {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', `${this.token}`)

        return firstValueFrom(
            this.http.post<string>(saveMenuUrl, menu, {headers})
        )
    }

    getMenuList(): Promise<MenuResponse[]> {
        const headers = new HttpHeaders()
            .set('Authorization', `${this.token}`)
        return firstValueFrom(
            this.http.get<MenuResponse[]>(getMenuListUrl, {headers})
                .pipe(
                    map((menus: MenuResponse[]) => {
                        return menus.map(menu => ({
                            Id: menu.Id as string,
                            Date: menu.Date as Date,
                            Time: menu.Time as string,
                            Vegetarian: menu.Vegetarian as boolean,
                            Main: menu.Main as string,
                            Drinks: menu.Drinks as string,
                            Dessert: menu.Dessert as string,
                            Remarks: menu.Remarks as string,
                            Reviews: menu.Reviews as boolean
                        }))
                    })
                )
        )
    }

    changeMenu(menuChange: MenuChange): Promise<string[]> {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', `${this.token}`)

        return firstValueFrom(
            this.http.put<string[]>(changeMenuUrl, menuChange, {headers})
        )
    }

    deleteMenu(mealId: string): Promise<string> {
        const headers = new HttpHeaders()
            .set('Authorization', `${this.token}`)
        const params = new HttpParams()
            .append("mealId", mealId)

        return firstValueFrom(
            this.http.delete<string>(deleteMenuUrl, { params: params, headers: headers})
        )
    }

    getMenuByDateStudent(menuDate: MenuDate): Promise<MenuResponse[]> {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', `${this.token}`)

        return firstValueFrom(
            this.http.post<MenuResponse[]>(getMenuByDatesStudent, menuDate, {headers})
        )
    }

    getMenuByDate(menuDate: MenuDate): Promise<MenuResponse[]> {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', `${this.token}`)

        return firstValueFrom(
            this.http.post<MenuResponse[]>(getMenuByDates, menuDate, {headers})
        )
    }

    saveMealAttendance(attendanceObj: AttendanceObject): Promise<AttendanceObject> {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', `${this.token}`)

        return firstValueFrom(
            this.http.post<AttendanceObject>(saveMealAttendance, attendanceObj, {headers})
        )
    }

    getPreselected(preselectedObj: Preselected): Promise<string[]> {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', `${this.token}`)

        return firstValueFrom(
            this.http.post<string[]>(getPreselected, preselectedObj, {headers})
        )
    }

    updateAttendance(updateAttendance: UpdateAttendance): Promise<string> {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', `${this.token}`)

        return firstValueFrom(
            this.http.post<string>(updateAttendanceUrl, updateAttendance, {headers})
        )
    }

    // food review services

    getUserMeals(userId: number): Promise<UserMeals[]> {
        const headers = new HttpHeaders()
            .set('Authorization', `${this.token}`)
        const params = new HttpParams()
            .set('userId', userId)

        return firstValueFrom(
            this.http.get<UserMeals[]>(getUserMealsUrl, {params: params, headers: headers})
        )
    }

    getReviews(mealId: string): Promise<MealReview[]> {
        const headers = new HttpHeaders()
            .set('Authorization', `${this.token}`)
        return firstValueFrom(
            this.http.get<MealReview[]>(`${getReviewsUrl}/${mealId}`, {headers})
        )
    }

    getUserMealReviews(userId: number, mealId: string): Promise<UserMealReview> {
        const headers = new HttpHeaders()
            .set('Authorization', `${this.token}`)
        const params = new HttpParams()
            .set('userId', userId)
            .set('mealId', mealId)

        return firstValueFrom(
            this.http.get<UserMealReview>(getUserMealReviews, {params: params, headers: headers})
        )
    }

    uploadPost(data: MealReview): Promise<any> {

        const headers = new HttpHeaders()
            .set('Authorization', `${this.token}`)

        const formData = new FormData()
        formData.set('caption', data.Caption)
        formData.set('rating', data.Rating)
        formData.set('date', data.Date)
        formData.set('mealId', data.MealId)
        formData.set('userId', data.User)

        console.log("datapic: " + data.Pic)

        if (!(data.Pic == '')) {
            const blob = this.dataURIToBlob(data.Pic)
            console.log(blob)
            console.log(typeof(blob))
            formData.set('file', blob, 'pic.png')
        } 
        // data.Pic = blob
        



        // console.log(blob)
        // console.log(formData)
        
        return firstValueFrom(
            this.http.post<any>(saveReviewUrl, formData, {headers})
        )
    }

    getUserReviews(userId: number): Promise<UserReviews> {
        const headers = new HttpHeaders()
            .set('Authorization', `${this.token}`)
        const params = new HttpParams()
            .append("userId", userId)

        return firstValueFrom(
            this.http.get<UserReviews>(getUserReviewsUrl, {params: params, headers: headers})
        )
    }

    updateUserReview(data: MealReview): Promise<any> {
        const headers = new HttpHeaders()
            .set('Authorization', `${this.token}`)

        const formData = new FormData()
        formData.set('caption', data.Caption)
        formData.set('rating', data.Rating)
        formData.set('date', data.Date)
        formData.set('mealId', data.MealId)
        formData.set('userId', data.User)
        formData.set('postId', data.PostId)

        console.log("datapic: " + data.Pic)

        if (!(data.Pic == '')) {
            const blob = this.dataURIToBlob(data.Pic)
            console.log(blob)
            console.log(typeof(blob))
            formData.set('file', blob, 'pic.png')
        } 
        // data.Pic = blob
        



        // console.log(blob)
        // console.log(formData)
        
        return firstValueFrom(
            this.http.put<any>(updateUserReviewUrl, formData, {headers})
        )
    }

    // saveReview(review: MealReview): Promise<string> {
    //     // const headers = new HttpHeaders()
    //     //     .set('Content-Type', 'application/json')
    //     //     .set('Accept', 'application/json')

    //         const blob = this.dataURIToBlob(this.url)

    //         const formData = new FormData()
    //             formData.set('mealId', review.MealId)
    //             formData.set('userId', review.User)
    //             formData.set('postDate', review.Date)
    //             formData.set('caption', review.Caption)
    //             formData.set('rating', review.Rating)
    //             formData.set('pic', blob, 'pic.png')

    //     return firstValueFrom(
    //         this.http.post<string>(saveReviewUrl, review)
    //     )
    // }

    dataURIToBlob(dataURI: string) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(',')[1]);
    
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    
        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
    
        // create a view into the buffer
        var ia = new Uint8Array(ab);
    
        // set the bytes of the buffer to the correct values
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
    
        // write the ArrayBuffer to a blob, and you're done
        var blob = new Blob([ab], { type: mimeString });
        return blob;
      }

    // nutrition api services

    nutritionApiSearch(food: string): Promise<string> {
        const headers = new HttpHeaders()
            .set('Authorization', `${this.token}`)
        const params = new HttpParams()
            .append('food', food)

        return firstValueFrom(
            this.http.get<string>(searchNutritionUrl, {params: params, headers: headers})
        )
    }

    // create new user / login

    checkLoginIdAvailable(loginId: string) {
        const params = new HttpParams()
            .append('loginId', loginId)

            return new Promise((resolve, reject) => {
                this.http.get(checkIdAvailable, {params: params, observe: 'response'}).subscribe(response => {
                    if (response.status == 200) {
                        resolve(response);
                        this.loginResponse = response.status
                    } 
                }, err => {
                    reject(err)
                    this.loginResponse = err.status
            })
            })
    }

    createNewUser(userInfo: CreateAccount): Promise<string> {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')

        return firstValueFrom(
            this.http.post<string>(createNewUser, userInfo, {headers})
        )
    }

    // login(userDetails: UserDetails) {
    //     // const credentials = btoa(`${userDetails.email}:${userDetails.password}`);
    //     const headers = new HttpHeaders()
    //         .set('Content-Type', 'application/json')
    //         .set('Accept', 'application/json')
    //         .set('Authorization', 'Basic ' + btoa(`${userDetails.email} + ':' + ${userDetails.password}`))

    //     return new Promise((resolve, reject) => {
    //         this.http.post(login, userDetails, {headers, observe: 'response'}).subscribe(response => {
    //             if (response.status == 200) {
    //                 resolve(response);
    //                 this.loginResponse = response.status
    //             } 
    //         }, err => {
    //             reject(err)
    //             this.loginResponse = err.status
    //     })
    //     })
    // }

    login(userDetails: UserDetails): Promise<TokenResp> {
        // // const credentials = btoa(`${userDetails.email}:${userDetails.password}`);
        const headers = new HttpHeaders()
            .set('Authorization', 'Basic ' + btoa(userDetails.email + ':' + userDetails.password))

            return firstValueFrom(
                this.http.get<TokenResp>(login, {headers})
            )
    }

    // statistics

    getMealAttendance(datesArray: string[]): Promise<MealAttendanceArray[]> {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', `${this.token}`)
        
            return firstValueFrom(
                this.http.post<MealAttendanceArray[]>(getMealAttendance, datesArray, {headers})
                    // .pipe(
                    //     map((attendance: MealAttendanceArray[]) => {
                    //         return attendance.map(item => ({
                    //             Id: item.Id as string,
                    //             Date: item.Date as string,
                    //             Time: item.Time as string,
                    //             Vegetarian: item.Vegetarian as boolean,
                    //             Main: item.Main as string,
                    //             Drinks: item.Drinks as string,
                    //             Dessert: item.Dessert as string,
                    //             Remarks: item.Remarks as string,
                    //             Attendance: item.Attendance as number
                    //         }))
                    //     })
                    // )
            )
    }

    getRatingsStats(month: number): Promise<string[]> {
        const headers = new HttpHeaders()
            .set('Authorization', `${this.token}`)
        const params = new HttpParams()
            .set("month", month)

        return firstValueFrom(
            this.http.get<string[]>(getRatingsStats, {params: params, headers: headers})
        )
    }

    getPaxStats(month: number): Promise<string[]> {
        const headers = new HttpHeaders()
            .set('Authorization', `${this.token}`)
        const params = new HttpParams()
            .set("month", month)

        return firstValueFrom(
            this.http.get<string[]>(getPaxStats, {params: params, headers: headers})
        )
    }
    
}