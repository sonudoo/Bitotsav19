import { Component, OnInit } from '@angular/core';
import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { VerifyTokenService } from '../verify-token.service';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public cusername = "";
  public cpassword = "";
  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private router: Router, private loginService: LoginService, private verifyTokenService: VerifyTokenService) { }

  ngOnInit() {
    if(this.storage.get('token') != undefined){
      this.verifyTokenService.verify(this.storage.get('token')).subscribe(
        data => {
          console.log(data);
          if(data.success == true){
            this.router.navigate(["event"]);
          }
          else{
            console.log("Login required");
          }
        },
        error => {
          alert("An unknown error occured. Please refresh the page.");
        }
      )
    }
  }
  onSubmit(loginForm){
    $("#processing-text").html("Logging in..");
    $('#processing-modal').modal('show');
    this.loginService.login(this.cusername, this.cpassword).subscribe(
      data => {
        $("#processing-text").html("");
        $('#processing-modal').modal('hide');
        if(data.success == true){
          this.storage.set('token', data.token);
          this.router.navigate(["event"]);
        }
        else{
          alert("Incorrect Username and Password");
        }
        loginForm.reset();
      },
      error => {
        $("#processing-text").html("");
        $('#processing-modal').modal('hide');
        alert("An unknown error occured.");
      }
    )
  }

}
