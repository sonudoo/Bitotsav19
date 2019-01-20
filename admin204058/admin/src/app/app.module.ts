import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { AppComponent } from './app.component';
import { AddEventComponent } from './add-event/add-event.component';
import { UpdateEventComponent } from './update-event/update-event.component';
import { ShowEventComponent } from './show-event/show-event.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { EventComponent } from './event/event.component';
import { EventTopbarComponent } from './event-topbar/event-topbar.component';
import { SAPComponent } from './sap/sap.component';
import { LoginComponent } from './login/login.component';
import { StorageServiceModule } from 'angular-webstorage-service';
import { ParticipantComponent } from './participant/participant.component';
import { ParticipantDetailsComponent } from './participant-details/participant-details.component';
import { TeamListComponent } from './participant-list/team-list.component';
import { SMSComponent } from './sms/sms.component';
import { ResultAnnouncementComponent } from './result-announcement/result-announcement.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { PMComponent } from './pm/pm.component';

@NgModule({
  declarations: [
    AppComponent,
    AddEventComponent,
    UpdateEventComponent,
    ShowEventComponent,
    SidebarComponent,
    EventComponent,
    EventTopbarComponent,
    SAPComponent,
    LoginComponent,
    ParticipantComponent,
    ParticipantDetailsComponent,
    TeamListComponent,
    SMSComponent,
    ResultAnnouncementComponent,
    AnnouncementComponent,
    PMComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    StorageServiceModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
