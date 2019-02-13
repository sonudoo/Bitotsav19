import { Component, OnInit, Input, Inject } from '@angular/core';
import { GetAllEventsService } from '../get-all-events.service';
import { GetEventByIdService } from '../get-event-by-id.service';
import { UpdateEventData } from './update-event-data';
import { UpdateEventService } from '../update-event.service';
import { NgForm } from '@angular/forms';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.component.html',
  styleUrls: ['./update-event.component.css']
})
export class UpdateEventComponent implements OnInit {
  public events = [];
  public currentEventId;
  public msgData;
  @Input('display') public display;
  public updateEventData: UpdateEventData = {
    eventName: "",
    eventVenue: "",
    eventTime: "00:00",
    eventDay: 0,
    eventFacultyAdvisor: "",
    eventDescription: "",
    eventRules: "",
    eventContact1Name: "",
    eventContact1Number: 0,
    eventContact2Name: "",
    eventContact2Number: 0,
    eventRequirement: "",
    eventCategory: "",
    eventPoints1: 0,
    eventPoints2: 0,
    eventPoints3: 0,
    eventPrize1: 0,
    eventPrize2: 0,
    eventPrize3: 0,
    eventType: "",
    eventMinimumMembers: 0,
    eventMaximumMembers: 0,
    eventStatus: "",
  };
  constructor(private getAllEventsService: GetAllEventsService, private getEventByIdService: GetEventByIdService, private updateEventService: UpdateEventService, @Inject(LOCAL_STORAGE) private storage: StorageService, private router: Router) { }

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
          if (data.length != undefined) {
            data = data[0];
          }
          this.updateEventData = {
            eventName: data.eventName,
            eventVenue: data.eventVenue,
            eventTime: data.eventTime,
            eventDay: data.eventDay,
            eventFacultyAdvisor: data.eventFacultyAdvisor,
            eventDescription: data.eventDescription,
            eventRules: data.eventRules,
            eventContact1Name: data.eventContact1Name,
            eventContact1Number: data.eventContact1Number,
            eventContact2Name: data.eventContact2Name,
            eventContact2Number: data.eventContact2Number,
            eventRequirement: data.eventRequirement,
            eventCategory: data.eventCategory,
            eventPoints1: data.eventPoints1,
            eventPoints2: data.eventPoints2,
            eventPoints3: data.eventPoints3,
            eventPrize1: data.eventPrize1,
            eventPrize2: data.eventPrize2,
            eventPrize3: data.eventPrize3,
            eventType: data.eventType,
            eventMinimumMembers: data.eventMinimumMembers,
            eventMaximumMembers: data.eventMaximumMembers,
            eventStatus: data.eventStatus
          }
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

  onSubmit(updateEventForm: NgForm) {
    if (this.updateEventData.eventMinimumMembers > this.updateEventData.eventMaximumMembers) {
      alert("Minimum Members should be less than maximum members");
      return false;
    }
    if (this.updateEventData.eventPoints2 > this.updateEventData.eventPoints1 || this.updateEventData.eventPoints3 > this.updateEventData.eventPoints2 || this.updateEventData.eventPoints3 > this.updateEventData.eventPoints1) {
      alert("Event Points are not properly ordered");
      return false;
    }
    if (this.updateEventData.eventPrize2 > this.updateEventData.eventPrize1 || this.updateEventData.eventPrize3 > this.updateEventData.eventPrize2 || this.updateEventData.eventPrize3 > this.updateEventData.eventPrize1) {
      alert("Event Prizes are not properly ordered");
      return false;
    }
    if (this.storage.get('token') != undefined) {
      $("#processing-text").html("Updating..");
      $('#processing-modal').modal('show');
      this.updateEventService.updateEvent(this.storage.get('token'), this.currentEventId, this.updateEventData, this.msgData).subscribe(
        data => {
          $("#processing-text").html("");
          $('#processing-modal').modal('hide');
          if (data.success == true) {
            this.updateEventData = {
              eventName: "",
              eventVenue: "",
              eventTime: "00:00",
              eventDay: 0,
              eventFacultyAdvisor: "",
              eventDescription: "",
              eventRules: "",
              eventContact1Name: "",
              eventContact1Number: 0,
              eventContact2Name: "",
              eventContact2Number: 0,
              eventRequirement: "",
              eventCategory: "",
              eventPoints1: 0,
              eventPoints2: 0,
              eventPoints3: 0,
              eventPrize1: 0,
              eventPrize2: 0,
              eventPrize3: 0,
              eventType: "",
              eventMinimumMembers: 0,
              eventMaximumMembers: 0,
              eventStatus: ""
            };
            alert("Event updated successfully");
            updateEventForm.reset();
          }
          else {
            alert("An unknown error occured");
            this.router.navigate([""]);
          }
        },
        error => {
          $("#processing-text").html("");
          $('#processing-modal').modal('hide');
          alert("An unknown error occured");
          this.router.navigate([""]);
        }
      );
    }
    else {
      this.router.navigate([""]);
    }



  }

}
