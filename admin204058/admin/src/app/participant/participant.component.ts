import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { GetAllParticipantsService } from '../get-all-participants.service';
import { Router } from '@angular/router';
import { VerifyTokenService } from '../verify-token.service';
import { StorageService, LOCAL_STORAGE } from 'angular-webstorage-service';
declare var $: any;

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
      $("#processing-text").html("Fetching Participant list.");
      $('#processing-modal').modal('show');
      this.getAllParticipantsService.getAllParticipants(this.storage.get('token')).subscribe(
        data => {
          $("#processing-text").html("");
          $('#processing-modal').modal('hide');
          for(let i in data){
            if(data[i].id == "-1"){
              this.participants.push({
                id: data[i].id,
                name: "",
                college: "",
                phno: data[i].phno,
                email: data[i].email
              });
            }
            else{
              this.participants.push({
                id: data[i].id,
                name: data[i].name,
                college: data[i].college,
                phno: data[i].phno,
                email: data[i].email
              });
            }
            
          }
        },
        error => {
          $("#processing-text").html("");
          $('#processing-modal').modal('hide');
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
            if(this.participants[i].id == "-1"){
              this.tbody.nativeElement.insertAdjacentHTML('beforeend', '<tr><td>'+this.participants[i].name+'</td><td>'+this.participants[i].college+'</td><td>No</td><td><a id="_'+this.participants[i].email.replace("@","__at__").replace(/\./g,"-")+'" class="btn btn-primary">View</a></td>');
            }
            else{
              this.tbody.nativeElement.insertAdjacentHTML('beforeend', '<tr><td>'+this.participants[i].name+'</td><td>'+this.participants[i].college+'</td><td>Yes</td><td><a id="_'+this.participants[i].email.replace("@","__at__").replace(/\./g,"-")+'" class="btn btn-primary">View</a></td>');
            }
            this.el.nativeElement.querySelector('#_'+this.participants[i].email.replace("@","__at__").replace(/\./g,"-")).addEventListener('click', (event) => this.showDetails(this.participants[i].email.replace("@","__at__").replace(/\./g,"-")));

          }
        }
        if(cleared == false){
          this.tbody.nativeElement.innerHTML = "No result found";
        }
      }
      else if(this.searchBy == "id"){
        for(let i in this.participants){
          if(this.participants[i].id.toLowerCase().indexOf(this.participant.toLowerCase()) >= 0){
            if(cleared == false){
              this.tbody.nativeElement.innerHTML = "";
              cleared = true;
            }
            if(this.participants[i].id == "-1"){
              this.tbody.nativeElement.insertAdjacentHTML('beforeend', '<tr><td>'+this.participants[i].name+'</td><td>'+this.participants[i].id+'</td><td>No</td><td><a id="_'+this.participants[i].email.replace("@","__at__").replace(/\./g,"-")+'" class="btn btn-primary">View</a></td>');
            }
            else{
              this.tbody.nativeElement.insertAdjacentHTML('beforeend', '<tr><td>'+this.participants[i].name+'</td><td>'+this.participants[i].id+'</td><td>Yes</td><td><a id="_'+this.participants[i].email.replace("@","__at__").replace(/\./g,"-")+'" class="btn btn-primary">View</a></td>');
            }
            this.el.nativeElement.querySelector('#_'+this.participants[i].email.replace("@","__at__").replace(/\./g,"-")).addEventListener('click', (event) => this.showDetails(this.participants[i].email.replace("@","__at__").replace(/\./g,"-")));

          }
        }
        if(cleared == false){
          this.tbody.nativeElement.innerHTML = "No result found";
        }
      }
      else if(this.searchBy == "phno"){
        for(let i in this.participants){
          if(this.participants[i].phno.toLowerCase().indexOf(this.participant.toLowerCase()) >= 0){
            if(cleared == false){
              this.tbody.nativeElement.innerHTML = "";
              cleared = true;
            }
            if(this.participants[i].id == "-1"){
              this.tbody.nativeElement.insertAdjacentHTML('beforeend', '<tr><td>'+this.participants[i].name+'</td><td>'+this.participants[i].phno+'</td><td>No</td><td><a id="_'+this.participants[i].email.replace("@","__at__").replace(/\./g,"-")+'" class="btn btn-primary">View</a></td>');
            }
            else{
              this.tbody.nativeElement.insertAdjacentHTML('beforeend', '<tr><td>'+this.participants[i].name+'</td><td>'+this.participants[i].phno+'</td><td>Yes</td><td><a id="_'+this.participants[i].email.replace("@","__at__").replace(/\./g,"-")+'" class="btn btn-primary">View</a></td>');
            }
            this.el.nativeElement.querySelector('#_'+this.participants[i].email.replace("@","__at__").replace(/\./g,"-")).addEventListener('click', (event) => this.showDetails(this.participants[i].email.replace("@","__at__").replace(/\./g,"-")));

          }
        }
        if(cleared == false){
          this.tbody.nativeElement.innerHTML = "No result found";
        }
      }
      else if(this.searchBy == "email"){
        for(let i in this.participants){
          if(this.participants[i].email.toLowerCase().indexOf(this.participant.toLowerCase()) >= 0){
            if(cleared == false){
              this.tbody.nativeElement.innerHTML = "";
              cleared = true;
            }
            if(this.participants[i].id == "-1"){
              this.tbody.nativeElement.insertAdjacentHTML('beforeend', '<tr><td>'+this.participants[i].name+'</td><td>'+this.participants[i].email+'</td><td>No</td><td><a id="_'+this.participants[i].email.replace("@","__at__").replace(/\./g,"-")+'" class="btn btn-primary">View</a></td>');
            }
            else{
              this.tbody.nativeElement.insertAdjacentHTML('beforeend', '<tr><td>'+this.participants[i].name+'</td><td>'+this.participants[i].email+'</td><td>Yes</td><td><a id="_'+this.participants[i].email.replace("@","__at__").replace(/\./g,"-")+'" class="btn btn-primary">View</a></td>');
            }
            this.el.nativeElement.querySelector('#_'+this.participants[i].email.replace("@","__at__").replace(/\./g,"-")).addEventListener('click', (event) => this.showDetails(this.participants[i].email.replace("@","__at__").replace(/\./g,"-")));

          }
        }
        if(cleared == false){
          this.tbody.nativeElement.innerHTML = "No result found";
        }
      }
    }
    
  }
  showDetails(email: string){
    this.router.navigate(["participant", email]);
  }
}
