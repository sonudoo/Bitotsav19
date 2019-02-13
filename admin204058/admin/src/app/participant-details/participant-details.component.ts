import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { GetParticipantByIdService } from '../get-participant-by-id.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { VerifyTokenService } from '../verify-token.service';
import { StorageService, LOCAL_STORAGE } from 'angular-webstorage-service';
import { GetParticipantByEmailService } from '../get-participant-by-email.service';
declare var $: any;

@Component({
  selector: 'app-participant',
  templateUrl: './participant-details.component.html',
  styleUrls: ['./participant-details.component.css']
})
export class ParticipantDetailsComponent implements OnInit {

  public email = "";
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
    emailOTP: -1,
    phoneOTP: -1,
    payment: {
      day1: false,
      day2: false,
      day3: false,
      day4: false,
    }
  }

  constructor(private getParticipantById: GetParticipantByIdService, private getParticipantByEmail: GetParticipantByEmailService, @Inject(LOCAL_STORAGE) private storage: StorageService, private verifyTokenService: VerifyTokenService, private router: Router, private route: ActivatedRoute) { }


  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.email = params.get('id').replace("__at__", "@").replace(/\-/g, ".");
    });
    if (this.storage.get('token') != undefined) {
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
            events: data.events,
            payment: {
              day1: data.payment.day1,
              day2: data.payment.day2,
              day3: data.payment.day3,
              day4: data.payment.day4
            }
          }
        },
        error => {
          $("#processing-text").html("");
          $('#processing-modal').modal('hide');
          alert("No such participant found.");
        }
      );
    }
    else {
      this.router.navigate([""]);
    }
  }
}
