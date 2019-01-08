import { Component, OnInit, Input, Inject } from '@angular/core';
import { GetAllEventsService } from '../get-all-events.service';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { Router } from '@angular/router';
import { GetTeamsListService } from '../get-teams-list.service';
import { ResultAnnouncementService } from '../result-announcement.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-result-announcement',
  templateUrl: './result-announcement.component.html',
  styleUrls: ['./result-announcement.component.css']
})
export class ResultAnnouncementComponent implements OnInit {

  public events = [];
  public currentEventId;
  public teams = [];
  public currentEventPosition1;
  public currentEventPosition2;
  public currentEventPosition3;
  @Input('display') public display;
  constructor(private getAllEventsService: GetAllEventsService, private getTeamsListService: GetTeamsListService, private resultAnnouncementService: ResultAnnouncementService , @Inject(LOCAL_STORAGE) private storage: StorageService, private router: Router) { }


  ngOnInit() {
    if (this.storage.get('token') != undefined) {
      this.getAllEventsService.getAllEvents(this.storage.get('token')).subscribe(
        data => {
          for (let i in data) {
            if(data[i].eventPosition1 != "NA" && data[i].eventPosition2 != "NA" && data[i].eventPosition3 != "NA"){
              continue;
            }
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

  onChange(eventId: any) {
    this.teams = [];
    if (this.storage.get('token') != undefined) {
      this.getTeamsListService.getTeamsList(this.storage.get('token'), this.currentEventId).subscribe(
        data => {
          for (let i in data) {
            this.teams.push(data[i].teamLeaderId);
          }
        },
        error => {
          alert("An unknown error occured. Please try again");
        }
      );
    }
    else {
      this.router.navigate([""]);
    }

  }

  disable() {
    if (this.currentEventPosition1 == this.currentEventPosition2 || this.currentEventPosition2 == this.currentEventPosition3
      || this.currentEventPosition1 == this.currentEventPosition3) {
      return true;
    }
    else {
      return false;
    }
  }
  onSubmit(resultAnnouncement: NgForm){
    this.teams = [];
    if (this.storage.get('token') != undefined) {
      this.resultAnnouncementService.announce(this.storage.get('token'), this.currentEventId, this.currentEventPosition1,
      this.currentEventPosition2, this.currentEventPosition3).subscribe(
        data => {
          if(data.success){
            alert('Result successfully announced');
            resultAnnouncement.reset();
          }
          else{
            alert(data.msg);
          }
        },
        error => {
          alert("An unknown error occured. Please try again");
        }
      );
    }
    else {
      this.router.navigate([""]);
    }
  }
}
