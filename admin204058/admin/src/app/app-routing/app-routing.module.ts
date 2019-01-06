import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventComponent } from '../event/event.component';
import { SAPComponent } from '../sap/sap.component';
import { LoginComponent } from '../login/login.component';
import { ParticipantComponent } from '../participant/participant.component';
import { ParticipantDetailsComponent } from '../participant-details/participant-details.component';
import { TeamListComponent } from '../participant-list/team-list.component';
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
    },
    {
        path: 'participants',
        component: ParticipantComponent
    },
    {
        path: 'participant/:id',
        component: ParticipantDetailsComponent
    },
    {
        path: 'teams',
        component: TeamListComponent
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