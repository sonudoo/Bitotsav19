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
  public participants = [];
  public events = [];
  @ViewChild('tbody') tbody: ElementRef;
  constructor(private getAllParticipantsService: GetAllParticipantsService, private getTeamsListService: GetTeamsListService, @Inject(LOCAL_STORAGE) private storage: StorageService, private verifyTokenService: VerifyTokenService, private router: Router, private el: ElementRef, private getAllEventsService: GetAllEventsService) { }


  ngOnInit() {
    if (this.storage.get('token') != undefined) {
      this.getAllParticipantsService.getAllParticipants(this.storage.get('token')).subscribe(
        data => {
          for (let i in data) {
            this.participants.push({
              id: data[i].id,
              name: data[i].name,
              college: data[i].college
            });
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
    if (this.storage.get('token') != undefined) {
      this.getTeamsListService.getTeamsList(this.storage.get('token'), event).subscribe(
        data => {
          this.tbody.nativeElement.innerHTML = "Searching..";
          let cleared = false;
          
          for (let i in data) {
            if(cleared == false){
              this.tbody.nativeElement.innerHTML = "";
            }
            this.tbody.nativeElement.insertAdjacentHTML('beforeend', '<tr><td colspan="3">'+data[i].teamLeaderId+'</td>');
            for(let j in data[i].teamMembers){
              let idx = parseInt(data[i].teamMembers[j].slice(5)) - 10001;
              this.tbody.nativeElement.insertAdjacentHTML('beforeend', '<tr><td>' + this.participants[idx].name + '</td><td>' + this.participants[i].college + '</td><td>' + this.participants[i].id + '</td></tr>');
            }
          }
          if (cleared == false) {
            this.tbody.nativeElement.innerHTML = "No result found";
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
