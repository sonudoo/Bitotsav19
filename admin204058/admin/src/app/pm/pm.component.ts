import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { VerifyTokenService } from '../verify-token.service';
import { StorageService, LOCAL_STORAGE } from 'angular-webstorage-service';
import { PMService } from '../pm.service';

@Component({
  selector: 'app-pm',
  templateUrl: './pm.component.html',
  styleUrls: ['./pm.component.css']
})
export class PMComponent implements OnInit {
  public titleData;
  public msgData;
  public bitotsavId;
  constructor(private pmService:PMService, @Inject(LOCAL_STORAGE) private storage: StorageService, private verifyTokenService: VerifyTokenService, private router: Router, private el: ElementRef) { }

  ngOnInit() {
  }

  onSubmit(pmForm: any){
    if(this.storage.get('token') != undefined){
      this.pmService.sendPM(this.storage.get('token'), this.bitotsavId, this.titleData, this.msgData).subscribe(
        data => {
          if(data.success){
            alert("PM sent");
            pmForm.reset();
          }
          else{
            alert(data.msg);
          }
        },
        error => {
          alert("Error occured while sending announcement.");
          this.router.navigate([""]);
        }
      );
    }
    else{
      this.router.navigate([""]);
    }
  }

}
