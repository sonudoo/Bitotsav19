import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { VerifyTokenService } from '../verify-token.service';
import { StorageService, LOCAL_STORAGE } from 'angular-webstorage-service';
import { AnnouncementService } from '../announcement.service';
import { GetAllFeedsService } from '../get-all-feeds.service';
declare var $: any;

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css']
})
export class AnnouncementComponent implements OnInit {
  public titleData;
  public msgData;
  constructor(private announcementService: AnnouncementService, @Inject(LOCAL_STORAGE) private storage: StorageService, private verifyTokenService: VerifyTokenService, private router: Router, private el: ElementRef, private getAllFeedsService: GetAllFeedsService) { }

  ngOnInit() {
    if (this.storage.get('token') != undefined) {
      this.getAllFeedsService.getAllFeeds(this.storage.get('token')).subscribe(
        data => {
          let res = "";
          for(let i=data.length-1;i>=0;i--){
            res += "<h5>"+data[i].title+"</h5>";
            res += "<p>"+data[i].content+"</p>";
            res += "<small>"+(new Date(data[i].timestamp))+"</small>";
            res += "<hr>";
          }
          $("#previous-announcements").html(res);
        },
        error => {
        }
      );
    }
    else {
      this.router.navigate([""]);
    }
  }

  onSubmit(announcementForm: any) {
    if (this.storage.get('token') != undefined) {
      $("#processing-text").html("Announcing..");
      $('#processing-modal').modal('show');
      this.announcementService.sendAnnouncement(this.storage.get('token'), this.titleData, this.msgData).subscribe(
        data => {
          $("#processing-text").html("");
          $('#processing-modal').modal('hide');
          if (data.success) {
            alert("Announcement added");
            announcementForm.reset();
          }
          else {
            alert("Error occured while sending announcement");
            this.router.navigate([""]);
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
