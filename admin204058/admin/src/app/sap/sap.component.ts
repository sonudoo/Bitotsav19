import { Component, OnInit, Inject } from '@angular/core';
import { GetAllSAPSService } from '../get-all-saps.service';
import { GetSAPByIdService } from '../get-sapby-id.service';
import { Router } from '@angular/router';
import { VerifyTokenService } from '../verify-token.service';
import { StorageService, LOCAL_STORAGE } from 'angular-webstorage-service';
declare var $: any;
@Component({
  selector: 'app-sap',
  templateUrl: './sap.component.html',
  styleUrls: ['./sap.component.css']
})
export class SAPComponent implements OnInit {

  public SAPs = [];
  public currentSAPId;
  public SAPData = {
    id: "",
    name: "",
    email: "",
    phno: "",
    college: "",
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: ""
  };
  constructor(private getAllSAPSService: GetAllSAPSService, private getSAPByIdService: GetSAPByIdService, @Inject(LOCAL_STORAGE) private storage: StorageService, private verifyTokenService: VerifyTokenService, private router: Router) { }


  ngOnInit() {
    if (this.storage.get('token') != undefined) {
      $("#processing-text").html("Fetching SAP list.");
      $('#processing-modal').modal('show');
      this.getAllSAPSService.getAllSAPS(this.storage.get('token')).subscribe(
        data => {
          $("#processing-text").html("");
          $('#processing-modal').modal('hide');
          for (let i in data) {
            this.SAPs.push({
              SAPId: data[i].id,
              SAPName: data[i].name
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

  onChange(id: any) {
    if (this.storage.get('token') != undefined) {
      $("#processing-text").html("Fetching SAP details.");
      $('#processing-modal').modal('show');
      this.getSAPByIdService.getSAPById({ token: this.storage.get('token'), id: this.currentSAPId }).subscribe(
        data => {
          $("#processing-text").html("");
          $('#processing-modal').modal('hide');
          this.SAPData = data;
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
