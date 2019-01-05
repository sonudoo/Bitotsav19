import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventComponent } from '../event/event.component';
import { SAPComponent } from '../sap/sap.component';
import { LoginComponent } from '../login/login.component';
const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'event',
        component: EventComponent
    },
    {
        path: 'sap',
        component: SAPComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class AppRoutingModule { }