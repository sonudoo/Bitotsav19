import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { GetParticipantByIdService } from '../get-participant-by-id.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { VerifyTokenService } from '../verify-token.service';
import { StorageService, LOCAL_STORAGE } from 'angular-webstorage-service';
import { GetParticipantByEmailService } from '../get-participant-by-email.service';
import { GetAllEventsService } from '../get-all-events.service';
declare var $: any;

@Component({
  selector: 'app-participant',
  templateUrl: './participant-details.component.html',
  styleUrls: ['./participant-details.component.css']
})
export class ParticipantDetailsComponent implements OnInit {

  public email = "";
  public registeredEvents = []
  public participantData = {
    id: "",
    name: "",
    email: "",
    phno: 0,
    gender: "",
    college: "",
    rollno: "",
    source: "",
    year: 0,
    password: "",
    events: [],
    teamName: "-1",
    emailOTP: -1,
    phoneOTP: -1,
    payment: {
      day1: false,
      day2: false,
      day3: false,
      merchandise: false,
      accommodation: false
    }
  }
  public events = {};

  constructor(private getParticipantById: GetParticipantByIdService, private getAllEventsService: GetAllEventsService, private getParticipantByEmail: GetParticipantByEmailService, @Inject(LOCAL_STORAGE) private storage: StorageService, private verifyTokenService: VerifyTokenService, private router: Router, private route: ActivatedRoute) { }


  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.email = params.get('id').replace("__at__", "@").replace(/\-/g, ".");
    });
    if (this.storage.get('token') != undefined) {
      $("#processing-text").html("Fetching Event list.");
      $('#processing-modal').modal('show');
      this.getAllEventsService.getAllEvents(this.storage.get('token')).subscribe(
        data => {
          $("#processing-text").html("");
          $('#processing-modal').modal('hide');

          for (let i in data) {
            this.events[data[i].eventId] = data[i].eventName;
          }
          $("#processing-text").html("Fetching Participant Details.");
          $('#processing-modal').modal('show');
          this.getParticipantByEmail.getParticipantByEmail(this.storage.get('token'), this.email).subscribe(
            data => {
              $("#processing-text").html("");
              $('#processing-modal').modal('hide');
              this.participantData = {
                id: data.id,
                name: data.name,
                email: data.email,
                phno: data.phno,
                gender: data.gender,
                college: data.college,
                rollno: data.rollno,
                source: data.source,
                year: data.year,
                emailOTP: data.emailOtp,
                phoneOTP: data.phoneOtp,
                password: data.password,
                events: [],
                teamName: data.teamName,
                payment: {
                  day1: data.payment.day1,
                  day2: data.payment.day2,
                  day3: data.payment.day3,
                  merchandise: data.payment.merchandise,
                  accommodation: data.payment.accommodation
                }
              }
              for (let i in data.events) {
                this.participantData.events.push({
                  eventName: this.events[data.events[i].eventId],
                  eventId: data.events[i].eventId,
                  teamLeaderId: data.events[i].teamLeader
                })
              }
            },
            error => {
              $("#processing-text").html("");
              $('#processing-modal').modal('hide');
              alert("No such participant found.");
            }
          );
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
}
