import { Component, OnInit, Input, Inject } from '@angular/core';
import { GetAllEventsService } from '../get-all-events.service';
import { GetEventByIdService } from '../get-event-by-id.service';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-event',
  templateUrl: './show-event.component.html',
  styleUrls: ['./show-event.component.css']
})
export class ShowEventComponent implements OnInit {
  
  public events = [];
  public currentEventId;
  public eventData;
  @Input('display') public display;
  constructor(private getAllEventsService: GetAllEventsService, private getEventByIdService: GetEventByIdService, @Inject(LOCAL_STORAGE) private storage: StorageService, private router: Router) { }


  ngOnInit() {
    if(this.storage.get('token') != undefined){
      this.getAllEventsService.getAllEvents(this.storage.get('token')).subscribe(
        data => {
          for(let i in data){
            this.events.push({
              eventId: data[i].eventId,
              eventName: data[i].eventName
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

  onChange(eventId: any){
    if(this.storage.get('token') != undefined){
      this.getEventByIdService.getEventById({token: this.storage.get('token'), eventId: this.currentEventId}).subscribe(
        data => {
          this.eventData = data;
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
