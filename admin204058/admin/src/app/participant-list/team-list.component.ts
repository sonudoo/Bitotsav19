import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { GetAllParticipantsService } from '../get-all-participants.service';
import { GetTeamsListService } from '../get-teams-list.service';
import { Router } from '@angular/router';
import { VerifyTokenService } from '../verify-token.service';
import { StorageService, LOCAL_STORAGE } from 'angular-webstorage-service';
import { GetAllEventsService } from '../get-all-events.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {

  public teams = [];
  public participants = {};
  public events = [];
  public currentEventId;
  @ViewChild('tbody') tbody: ElementRef;
  constructor(private getAllParticipantsService: GetAllParticipantsService, private getTeamsListService: GetTeamsListService, @Inject(LOCAL_STORAGE) private storage: StorageService, private verifyTokenService: VerifyTokenService, private router: Router, private el: ElementRef, private getAllEventsService: GetAllEventsService) { }


  ngOnInit() {
    if (this.storage.get('token') != undefined) {
      this.getAllParticipantsService.getAllParticipants(this.storage.get('token')).subscribe(
        data => {
          for (let i in data) {
            this.participants[data[i].id] = {
              id: data[i].id,
              name: data[i].name,
              college: data[i].college,
              rollno: data[i].rollno,
              phno: data[i].phno
            };
          }
        },
        error => {
          alert("Error occured while fetching event list.");
          this.router.navigate([""]);
        }
      );
      this.getAllEventsService.getAllEvents(this.storage.get('token')).subscribe(
        data => {
          for (let i in data) {
            this.events.push({
              eventId: data[i].eventId,
              eventName: data[i].eventName
            });
          }
        },
        error => {
          alert("Error occured while fetching event list.");
          this.router.navigate([""]);
        }
      );
    }
    else {
      this.router.navigate([""]);
    }
  }
  onChange(event: any) {
    this.tbody.nativeElement.innerHTML = "Searching..";
    if (this.storage.get('token') != undefined) {
      this.getTeamsListService.getTeamsList(this.storage.get('token'), event).subscribe(
        data => {
          this.tbody.nativeElement.innerHTML = "";
          this.tbody.nativeElement.insertAdjacentHTML('beforeend', '<tr><td colspan="4">Total teams - '+data.length+'</td>');

          for (let i in data) {
            let j = parseInt(i)+1;
            if(this.currentEventId == "-1"){
              this.tbody.nativeElement.insertAdjacentHTML('beforeend', '<tr><td colspan="4" style="font-weight: bold;">Event - '+this.events[parseInt(data[i].eventId)-1].eventName+'</td></tr>');
            }
            this.tbody.nativeElement.insertAdjacentHTML('beforeend', '<tr><td colspan="4" style="font-weight: bold;">'+j+'. '+data[i].teamLeaderId+' ('+this.participants[data[i].teamLeaderId].name+') ('+this.participants[data[i].teamLeaderId].phno+')</td></tr>');
            
            this.tbody.nativeElement.insertAdjacentHTML('beforeend', '<tr><td>' + this.participants[data[i].teamLeaderId].name + '</td><td>' + this.participants[data[i].teamLeaderId].college + '</td><td>' + this.participants[data[i].teamLeaderId].rollno + '</td><td>' + this.participants[data[i].teamLeaderId].id + '</td></tr>');
            for(let j in data[i].teamMembers){
              this.tbody.nativeElement.insertAdjacentHTML('beforeend', '<tr><td>' + this.participants[data[i].teamMembers[j]].name + '</td><td>' + this.participants[data[i].teamMembers[j]].college + '</td><td>' + this.participants[data[i].teamMembers[j]].rollno + '</td><td>' + this.participants[data[i].teamMembers[j]].id + '</td></tr>');
            }
          }
        },
        error => {
          alert("Error occured while fetching event list.");
          this.router.navigate([""]);
        }
      );
    }
    else {
      this.router.navigate([""]);
    }
  }

}
