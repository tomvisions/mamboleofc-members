import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { InfoComponent } from 'app/modules/admin/event/info/info.component';
import { eventRoutes } from 'app/modules/admin/event/event.routing';
import {EventComponent} from "./event.component";
import { QuillModule } from 'ngx-quill';
import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
    declarations: [
        EventComponent,
        InfoComponent
    ],
    imports     : [
        RouterModule.forChild(eventRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSortModule,
        QuillModule.forRoot(),
        MatSelectModule,
        MatSlideToggleModule,
        MatTooltipModule,
        SharedModule,
        EditorModule
    ]
})
export class EventModule
{
}
