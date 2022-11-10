export interface FoodItems {
    // vegetarian: boolean,
    monday_breakfast: boolean,
    monday_lunch: boolean,
    monday_tea: boolean,
    tuesday_breakfast: boolean,
    tuesday_lunch: boolean,
    tuesday_tea: boolean,
    wednesday_breakfast: boolean,
    wednesday_lunch: boolean,
    wednesday_tea: boolean,
    thursday_breakfast: boolean,
    thursday_lunch: boolean,
    thursday_tea: boolean,
    friday_breakfast: boolean,
    friday_lunch: boolean,
    friday_tea: boolean
}

export interface MenuItems {
    vegetarian: boolean,
    breakfast_main: string,
    breakfast_drinks: string,
    breakfast_dessert: string,
    lunch_main: string,
    lunch_drinks: string,
    lunch_dessert: string,
    tea_main: string,
    tea_drinks: string,
    tea_dessert: string
}

export interface Menu {
    date: string | null,
    menuItems: MenuItems
}

export interface MenuResponse {
    Id: string,
    Date: Date,
    Time: string,
    Vegetarian: boolean,
    Main: string,
    Drinks: string,
    Dessert: string,
    Remarks: string,
    Reviews: boolean
}

export interface MenuChange {
    mealId: string,
    main: string,
    drinks: string,
    dessert: string,
    remarks: string
}

// export interface Reviews {
//     reviewList: MealReview[]
// }

export interface MealReview {
    User: string,
    PostId: string,
    Date: string,
    Rating: string,
    Caption: string,
    Pic: string,
    MealId: string
} 

export interface UserMealReview {
    postId: string,
    rating: string,
    caption: string,
    pic: string
}

export interface UserReviews {
    mealId: string[]
}

export interface ApiResults {
    name: string,
    imageUrl: string,
    recipeUrl: string,
    ingredients: string[],
    calories: string
}

export interface MenuDate {
    vegetarian: boolean,
    dates: string[]
}

export interface MenuItemsObject {
    Main: string | undefined,
    Id: string | undefined
}

export interface Preselected {
    userId: number,
    dates: string[]
}

export interface UpdateAttendance {
    userId: number,
    preselected: string[],
    updated: string[]
}

export interface AttendanceObject {
    userId: number,
    meals: string[]
}

export interface CreateAccount {
    username: string,
    password: string,
    user_name: string,
    vegetarian: boolean,
    startDate: string | null,
    endDate: string | null
}

export interface UserDetails {
    email: string,
    password: string
}

export interface UserMeals {
    Id: string,
    Date: string,
    Time: string,
    Main: string,
    Drinks: string,
    Dessert: string,
    Remarks: string
}

export interface MealAttendanceArray {
    Id: string,
    Date: string,
    Time: string,
    Main: string,
    Drinks: string,
    Dessert: string,
    Remarks: string,
    Vegetarian: boolean,
    Attendance: number
}

export interface Ratings {
    Id: string,
    Time: string,
    Average: number,
    Main: string,
    Drinks: string,
    Dessert: string,
    Pax: number
}

export interface rankedRatings {
    Meal: string,
    Rating: number,
    Date: string,
    Time: string,
    Id: string
}

export interface Pax {
    Meal: string,
    Pax: number,
    Date: string,
    Time: string,
    Id: string
}

export interface TokenResp {
    id: number,
    username: string,
    token: string,
    endDate: string,
    vegetarian: boolean,
    name: string
}
