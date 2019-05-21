import { Component, OnInit, Input, Inject } from '@angular/core';
import { AddEventData } from './add-event-data';
import { AddEventService } from '../add-event-service.service';
import { NgForm } from '@angular/forms';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {
  @Input('display') public display;
  public addEventData: AddEventData = {
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
    eventMaximumMembers: 0
  };
  constructor(private addEventService: AddEventService, @Inject(LOCAL_STORAGE) private storage: StorageService, private router: Router) { }

  ngOnInit() {
  }
  onSubmit(addEventForm: NgForm) {
    if (this.addEventData.eventMinimumMembers > this.addEventData.eventMaximumMembers) {
      alert("Minimum Members should be less than maximum members");
      return false;
    }
    if (this.addEventData.eventPoints2 > this.addEventData.eventPoints1 || this.addEventData.eventPoints3 > this.addEventData.eventPoints2 || this.addEventData.eventPoints3 > this.addEventData.eventPoints1) {
      alert("Event Points are not properly ordered");
      return false;
    }
    if (this.addEventData.eventPrize2 > this.addEventData.eventPrize1 || this.addEventData.eventPrize3 > this.addEventData.eventPrize2 || this.addEventData.eventPrize3 > this.addEventData.eventPrize1) {
      alert("Event Prizes are not properly ordered");
      return false;
    }
    if (this.storage.get('token') != undefined) {
      $("#processing-text").html("Adding..");
      $('#processing-modal').modal('show');
      this.addEventService.addEvent(this.addEventData, this.storage.get('token')).subscribe(
        data => {
          $("#processing-text").html("");
          $('#processing-modal').modal('hide');
          if (data.success == true) {
            this.addEventData = {
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
              eventMaximumMembers: 0
            };
            alert("Event added successfully");
            addEventForm.reset();
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
      )
    }
    else {
      this.router.navigate([""]);
    }



  }

}
