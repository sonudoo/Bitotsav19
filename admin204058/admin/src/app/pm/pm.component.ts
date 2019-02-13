import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { VerifyTokenService } from '../verify-token.service';
import { StorageService, LOCAL_STORAGE } from 'angular-webstorage-service';
import { PMService } from '../pm.service';
declare var $: any;

@Component({
  selector: 'app-pm',
  templateUrl: './pm.component.html',
  styleUrls: ['./pm.component.css']
})
export class PMComponent implements OnInit {
  public titleData;
  public msgData;
  public bitotsavId;
  constructor(private pmService: PMService, @Inject(LOCAL_STORAGE) private storage: StorageService, private verifyTokenService: VerifyTokenService, private router: Router, private el: ElementRef) { }

  ngOnInit() {
  }

  onSubmit(pmForm: any) {
    if (this.storage.get('token') != undefined) {
      $("#processing-text").html("Sending..");
      $('#processing-modal').modal('show');
      this.pmService.sendPM(this.storage.get('token'), this.bitotsavId, this.titleData, this.msgData).subscribe(
        data => {
          $("#processing-text").html("");
          $('#processing-modal').modal('hide');
          if (data.success) {
            alert("PM sent");
            pmForm.reset();
          }
          else {
            alert(data.msg);
          }
        },
        error => {
          $("#processing-text").html("");
          $('#processing-modal').modal('hide');
          alert("Error occured while sending announcement.");
          this.router.navigate([""]);
        }
      );
    }
    else {
      this.router.navigate([""]);
    }
  }

}
