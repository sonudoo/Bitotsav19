import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { GetAllParticipantsService } from '../get-all-participants.service';
import { Router } from '@angular/router';
import { VerifyTokenService } from '../verify-token.service';
import { StorageService, LOCAL_STORAGE } from 'angular-webstorage-service';

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.css']
})
export class ParticipantComponent implements OnInit {
  
  public participants = [];
  public participant: String;
  public searchBy;
  public timeout = 0;
  @ViewChild('tbody') tbody: ElementRef;
  constructor(private getAllParticipantsService: GetAllParticipantsService, @Inject(LOCAL_STORAGE) private storage: StorageService, private verifyTokenService: VerifyTokenService, private router: Router, private el: ElementRef) {
    this.participant = "";
   }


  ngOnInit() {
    if(this.storage.get('token') != undefined){
      this.getAllParticipantsService.getAllParticipants(this.storage.get('token')).subscribe(
        data => {
          console.log("Data", data);
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

  detectTyping(){
    this.timeout += 1; //Increment timeout
    let tmp = this.timeout;
    setTimeout(() => {
      if(this.timeout == tmp){
        this.search();
      }
    }, 1000);
  }
  search(){
    console.log(this.participant);
    if(this.participant.length < 3){
      return;
    }
    else{
      this.tbody.nativeElement.innerHTML = "Searching..";
      let cleared = false;
      if(this.searchBy == 'name'){
        for(let i in this.participants){
          if(this.participants[i].name.toLowerCase().indexOf(this.participant.toLowerCase()) >= 0){
            if(cleared == false){
              this.tbody.nativeElement.innerHTML = "";
              cleared = true;
            }
            this.tbody.nativeElement.insertAdjacentHTML('beforeend', '<tr><td>'+this.participants[i].name+'</td><td>'+this.participants[i].college+'</td><td><a id="participant-'+i+'" style="cursor: pointer; text-decoration: underline; color: blue;">'+this.participants[i].id+'</a></td></tr>');
            this.el.nativeElement.querySelector('#participant-'+i).addEventListener('click', (event) => this.showDetails(this.participants[i].id.slice(5)));

          }
        }
        if(cleared == false){
          this.tbody.nativeElement.innerHTML = "No result found";
        }
      }
      else{
        for(let i in this.participants){
          if(this.participants[i].id.toLowerCase().indexOf(this.participant.toLowerCase()) >= 0){
            if(cleared == false){
              this.tbody.nativeElement.innerHTML = "";
              cleared = true;
            }
            this.tbody.nativeElement.insertAdjacentHTML('beforeend', '<tr><td>'+this.participants[i].name+'</td><td>'+this.participants[i].college+'</td><td><a id="participant-'+i+'" style="cursor: pointer; text-decoration: underline; color: blue;">'+this.participants[i].id+'</a></td></tr>');
            this.el.nativeElement.querySelector('#participant-'+i).addEventListener('click', (event) => this.showDetails(this.participants[i].id.slice(5)));

          }
        }
        if(cleared == false){
          this.tbody.nativeElement.innerHTML = "No result found";
        }
      }
    }
  }
  showDetails(id: string){
    this.router.navigate(["participant", id]);
  }
}
