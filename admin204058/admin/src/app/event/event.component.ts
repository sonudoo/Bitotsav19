import { Component, OnInit, Inject } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { VerifyTokenService } from '../verify-token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  addEventDisplay = false;
  showEventDisplay = false;
  updateEventDisplay = false;
  
  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private verifyTokenService: VerifyTokenService, private router: Router) { }

  ngOnInit() {
    if(this.storage.get('token') != undefined){
      this.verifyTokenService.verify(this.storage.get('token')).subscribe(
        data => {
          if(data.success == false){
            this.router.navigate([""]);
          }
        },
        error => {
          alert("An unknown error occured. Please refresh the page.");
        }
      )
    }
    else{
      this.router.navigate([""]);
    }
  }

  displayComponent(event: any){
    if(event == "add"){
      this.addEventDisplay = true;
      this.showEventDisplay = false;
      this.updateEventDisplay = false;
    }
    else if(event == "show"){
      this.addEventDisplay = false;
      this.showEventDisplay = true;
      this.updateEventDisplay = false;
    }
    else if(event == "update"){
      this.addEventDisplay = false;
      this.showEventDisplay = false;
      this.updateEventDisplay = true;
    }
  }

}
