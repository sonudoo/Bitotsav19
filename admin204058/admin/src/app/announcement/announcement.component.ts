import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { VerifyTokenService } from '../verify-token.service';
import { StorageService, LOCAL_STORAGE } from 'angular-webstorage-service';
import { AnnouncementService } from '../announcement.service';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css']
})
export class AnnouncementComponent implements OnInit {
  public titleData;
  public msgData;
  constructor(private announcementService: AnnouncementService, @Inject(LOCAL_STORAGE) private storage: StorageService, private verifyTokenService: VerifyTokenService, private router: Router, private el: ElementRef) { }

  ngOnInit() {
  }

  onSubmit(announcementForm: any){
    if(this.storage.get('token') != undefined){
      this.announcementService.sendAnnouncement(this.storage.get('token'), this.titleData, this.msgData).subscribe(
        data => {
          if(data.success){
            alert("Announcement added");
            announcementForm.reset();
          }
          else{
            alert("Error occured while sending announcement");
          this.router.navigate([""]);
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
