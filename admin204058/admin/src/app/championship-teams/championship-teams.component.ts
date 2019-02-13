import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { VerifyTokenService } from '../verify-token.service';
import { StorageService, LOCAL_STORAGE } from 'angular-webstorage-service';
import { GetChampionshipTeamByNameService } from '../get-championship-team-by-name.service';
import { GetAllChampionshipTeamsService } from '../get-all-championship-teams.service';
declare var $: any;
@Component({
  selector: 'app-championship-teams',
  templateUrl: './championship-teams.component.html',
  styleUrls: ['./championship-teams.component.css']
})
export class ChampionshipTeamsComponent implements OnInit {

  public teams = [];
  public currentTeam;
  public teamData;
  constructor(private getAllChampionshipTeamsService: GetAllChampionshipTeamsService, private getChampionshipTeamByNameService: GetChampionshipTeamByNameService, @Inject(LOCAL_STORAGE) private storage: StorageService, private verifyTokenService: VerifyTokenService, private router: Router) { }


  ngOnInit() {
    if (this.storage.get('token') != undefined) {
      $("#processing-text").html("Fetching Team list.");
      $('#processing-modal').modal('show');
      this.getAllChampionshipTeamsService.getAllTeams(this.storage.get('token')).subscribe(
        data => {
          $("#processing-text").html("");
          $('#processing-modal').modal('hide');
          for (let i in data) {
            this.teams.push({
              teamName: data[i].teamName,
              teamPoints: data[i].teamPoints
            });
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
    else {
      this.router.navigate([""]);
    }
  }

  onChange(teamName: String) {
    if (this.storage.get('token') != undefined) {
      $("#processing-text").html("Fetching Team details.");
      $('#processing-modal').modal('show');
      this.getChampionshipTeamByNameService.getBCTeamByName(this.storage.get('token'), this.currentTeam).subscribe(
        data => {
          $("#processing-text").html("");
          $('#processing-modal').modal('hide');
          this.teamData = data;
          let res = '<p><b>Name: </b>'+this.teamData.teamName+"</p>";
          res += '<p><b>Points: </b>'+this.teamData.teamPoints+"</p>";
          for(let i in this.teamData.teamMembers){
            res += '<p><b>'+i+': </b>'+this.teamData.teamMembers[i]+"</p>";
          }
          $("#data-display").html(res);
        },
error => {
  $("#processing-text").html("");
  $('#processing-modal').modal('hide');
  alert("Error fetching data. Try again..");
  this.router.navigate([""]);
}
      );
    }
    else {
  this.router.navigate([""]);
}
  }
}
