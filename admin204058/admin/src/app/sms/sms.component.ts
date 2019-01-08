import { Component, OnInit, Inject } from '@angular/core';
import { SendSMSService } from '../send-sms.service';
import { Router } from '@angular/router';
import { VerifyTokenService } from '../verify-token.service';
import { StorageService, LOCAL_STORAGE } from 'angular-webstorage-service';

@Component({
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.css']
})
export class SMSComponent implements OnInit {
  
  public phnoData: Number;
  public msgData: String;
  constructor(private sendSMSService: SendSMSService, @Inject(LOCAL_STORAGE) private storage: StorageService, private verifyTokenService: VerifyTokenService, private router: Router) { }


  ngOnInit() {
    
  }

  onSubmit(SMSForm: any){
    if(this.storage.get('token') != undefined){
      this.sendSMSService.sendSMS(this.storage.get('token'), this.phnoData, this.msgData).subscribe(
        data => {
          if(data.success == true){
            alert("Message successfully sent.");
            SMSForm.reset();
          }
          else{
            alert("Error sending SMS. Try again..");
          }
        },
        error => {
          alert("Error sending SMS. Try again..");
          this.router.navigate([""]);
        }
      );
    }
    else{
      this.router.navigate([""]);
    }
  }
}
