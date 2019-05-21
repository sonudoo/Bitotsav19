import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-event-topbar',
  templateUrl: './event-topbar.component.html',
  styleUrls: ['./event-topbar.component.css']
})
export class EventTopbarComponent implements OnInit {
  @Output() public childEvent = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  showAddEvent(){
    this.childEvent.emit('add');
  }
  showShowEvent(){
    this.childEvent.emit('show');
  }
  showUpdateEvent(){
    this.childEvent.emit('update');
  }
}
