import { Component, OnInit, Input, Inject } from '@angular/core';
import { GetAllEventsService } from '../get-all-events.service';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { Router } from '@angular/router';
import { GetTeamsListService } from '../get-teams-list.service';
import { ResultAnnouncementService } from '../result-announcement.service';
import { NgForm } from '@angular/forms';
declare var $: any;

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
  constructor(private getAllEventsService: GetAllEventsService, private getTeamsListService: GetTeamsListService, private resultAnnouncementService: ResultAnnouncementService, @Inject(LOCAL_STORAGE) private storage: StorageService, private router: Router) { }


  ngOnInit() {
    if (this.storage.get('token') != undefined) {
      $("#processing-text").html("Fetching Completed Event list.");
      $('#processing-modal').modal('show');
      this.getAllEventsService.getAllEvents(this.storage.get('token')).subscribe(
        data => {
          $("#processing-text").html("");
          $('#processing-modal').modal('hide');
          for (let i in data) {
            if (data[i].eventPosition1.teamLeader != undefined || data[i].eventPosition2.teamLeader != undefined || data[i].eventPosition3.teamLeader != undefined || data[i].eventStatus != "Completed") {
              continue;
            }
            this.events.push({
              eventId: data[i].eventId,
              eventName: data[i].eventName
            });
          }
        },
        error => {
          $("#processing-text").html("");
          $('#processing-modal').modal('hide');
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
      $("#processing-text").html("Fetching team list.");
      $('#processing-modal').modal('show');
      this.getTeamsListService.getTeamsList(this.storage.get('token'), this.currentEventId).subscribe(
        data => {
          $("#processing-text").html("");
          $('#processing-modal').modal('hide');
          for (let i in data) {
            this.teams.push(data[i].teamLeaderId);
          }
          this.teams.sort();
        },
        error => {
          $("#processing-text").html("");
          $('#processing-modal').modal('hide');
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
  onSubmit(resultAnnouncement: NgForm) {
    this.teams = [];
    if (this.storage.get('token') != undefined) {
      $("#processing-text").html("Announcing..");
      $('#processing-modal').modal('show');
      this.resultAnnouncementService.announce(this.storage.get('token'), this.currentEventId, this.currentEventPosition1,
        this.currentEventPosition2, this.currentEventPosition3).subscribe(
          data => {
            $("#processing-text").html("");
            $('#processing-modal').modal('hide');
            if (data.success) {
              alert('Result successfully announced');
              resultAnnouncement.reset();
            }
            else {
              alert(data.error);
            }
          },
          error => {
            $("#processing-text").html("");
            $('#processing-modal').modal('hide');
            alert("An unknown error occured. Please try again");
          }
        );
    }
    else {
      this.router.navigate([""]);
    }
  }
}
