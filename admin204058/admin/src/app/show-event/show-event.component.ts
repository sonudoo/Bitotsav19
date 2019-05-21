import { Component, OnInit, Input, Inject } from '@angular/core';
import { GetAllEventsService } from '../get-all-events.service';
import { GetEventByIdService } from '../get-event-by-id.service';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-show-event',
  templateUrl: './show-event.component.html',
  styleUrls: ['./show-event.component.css']
})
export class ShowEventComponent implements OnInit {

  public events = [];
  public currentEventId;
  public eventData;
  @Input('display') public display;
  constructor(private getAllEventsService: GetAllEventsService, private getEventByIdService: GetEventByIdService, @Inject(LOCAL_STORAGE) private storage: StorageService, private router: Router) { }


  ngOnInit() {
    if (this.storage.get('token') != undefined) {
      $("#processing-text").html("Fetching Event list.");
      $('#processing-modal').modal('show');
      this.getAllEventsService.getAllEvents(this.storage.get('token')).subscribe(
        data => {
          $("#processing-text").html("");
          $('#processing-modal').modal('hide');
          for (let i in data) {
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
    if (this.storage.get('token') != undefined) {
      $("#processing-text").html("Fetching Event details.");
      $('#processing-modal').modal('show');
      this.getEventByIdService.getEventById({ token: this.storage.get('token'), eventId: this.currentEventId }).subscribe(
        data => {
          $("#processing-text").html("");
          $('#processing-modal').modal('hide');
          this.eventData = data;
        },
        error => {
          $("#processing-text").html("");
          $('#processing-modal').modal('hide');
          alert("Error fetching data. Try again..");
          this.router.navigate([""]);
        }
      );
    }
    else {
      this.router.navigate([""]);
    }

  }
}
