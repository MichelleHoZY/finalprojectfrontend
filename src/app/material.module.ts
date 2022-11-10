import { NgModule } from "@angular/core";
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from '@angular/material/input'
import {MatTableModule} from '@angular/material/table'
import {MatButtonModule} from '@angular/material/button'
import {MatDatepickerModule} from '@angular/material/datepicker'
import {MatNativeDateModule} from '@angular/material/core'
import {MatExpansionModule} from '@angular/material/expansion'
import {MatIconModule} from '@angular/material/icon'
import {MatDividerModule} from '@angular/material/divider'
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatSidenavModule} from '@angular/material/sidenav'
import {MatListModule} from '@angular/material/list'
import {MatSliderModule} from '@angular/material/slider'
import {MatCardModule} from '@angular/material/card'
import {MatStepperModule} from '@angular/material/stepper'
import {MatTreeModule} from '@angular/material/tree'
import {MatSelectModule} from '@angular/material/select'
import {MatDialogModule} from '@angular/material/dialog'
import {MatPaginatorModule} from '@angular/material/paginator'
import {MatTabsModule} from '@angular/material/tabs'
import {MatTooltipModule} from '@angular/material/tooltip'

const matModules: any[] = [
    MatFormFieldModule, MatInputModule, MatCheckboxModule, MatTableModule,
    MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatExpansionModule,
    MatIconModule, MatDividerModule, MatPaginatorModule, MatToolbarModule,
    MatSidenavModule, MatListModule, MatSliderModule, MatCardModule, MatStepperModule,
    MatTreeModule, MatSelectModule, MatDialogModule, MatTabsModule, MatTooltipModule
]

@NgModule({
    imports: matModules,
    exports: matModules
})

export class MaterialModule {}