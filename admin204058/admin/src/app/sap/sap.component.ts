import { Component, OnInit, Inject } from '@angular/core';
import { GetAllSAPSService } from '../get-all-saps.service';
import { GetSAPByIdService } from '../get-sapby-id.service';
import { Router } from '@angular/router';
import { VerifyTokenService } from '../verify-token.service';
import { StorageService, LOCAL_STORAGE } from 'angular-webstorage-service';

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
    if(this.storage.get('token') != undefined){
      this.getAllSAPSService.getAllSAPS(this.storage.get('token')).subscribe(
        data => {
          for(let i in data){
            this.SAPs.push({
              SAPId: data[i].id,
              SAPName: data[i].name
            });
          }
        },
        error => {
          alert("Error occured while fetching event list.");
          this.router.navigate([""]);
        }
      );
    }
    else{
      this.router.navigate([""]);
    }
  }

  onChange(id: any){
    if(this.storage.get('token') != undefined){
      this.getSAPByIdService.getSAPById({token: this.storage.get('token'), id: this.currentSAPId}).subscribe(
        data => {
          this.SAPData = data;
        },
        error => {
          alert("Error fetching data. Try again..");
          this.router.navigate([""]);
        }
      );
    }
    else{
      this.router.navigate([""]);
    }
  }
}
