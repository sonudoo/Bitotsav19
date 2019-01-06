import { Component, OnInit, Inject } from '@angular/core';
import { GetAllParticipantsService } from '../get-all-participants.service';
import { Router } from '@angular/router';
import { VerifyTokenService } from '../verify-token.service';
import { StorageService, LOCAL_STORAGE } from 'angular-webstorage-service';

@Component({
  selector: 'app-sap',
  templateUrl: './sap.component.html',
  styleUrls: ['./sap.component.css']
})
export class ParticipantComponent implements OnInit {
  
  public participants = [];
  public currentSAPId;
  constructor(private getAllParticipantsService: GetAllParticipantsService, @Inject(LOCAL_STORAGE) private storage: StorageService, private verifyTokenService: VerifyTokenService, private router: Router) { }


  ngOnInit() {
    if(this.storage.get('token') != undefined){
      this.getAllParticipantsService.getAllParticipants(this.storage.get('token')).subscribe(
        data => {
          for(let i in data){
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
    }
    else{
      this.router.navigate([""]);
    }
  }

  onChange(id: any){
   
  }
}
