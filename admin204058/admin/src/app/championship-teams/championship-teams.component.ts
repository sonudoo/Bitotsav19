import { Component, OnInit, Inject } from '@angular/core';
import { GetAllSAPSService } from '../get-all-saps.service';
import { GetSAPByIdService } from '../get-sapby-id.service';
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
              teamLeader: data[i].teamLeader,
              teamPoints: data[i].teamPoints
            });
          }
          console.log(data);
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

  onChange(id: any) {
    if (this.storage.get('token') != undefined) {
      $("#processing-text").html("Fetching SAP details.");
      $('#processing-modal').modal('show');
      this.getChampionshipTeamByNameService.getBCTeamByName({ token: this.storage.get('token'), id: this.currentTeam }).subscribe(
        data => {
          $("#processing-text").html("");
          $('#processing-modal').modal('hide');
          this.teamData = data;
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
