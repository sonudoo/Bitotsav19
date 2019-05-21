import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { VerifyTokenService } from '../verify-token.service';
import { StorageService, LOCAL_STORAGE } from 'angular-webstorage-service';
import { PaymentService } from '../payment.service';
declare var $: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})

export class PaymentComponent implements OnInit {
  public bitotsavId: String;
  public isDisabled: Boolean;
  public payment: Payment;
  constructor(private paymentService: PaymentService, @Inject(LOCAL_STORAGE) private storage: StorageService, private verifyTokenService: VerifyTokenService, private router: Router, private el: ElementRef) {
    this.isDisabled = false;
  }

  ngOnInit() {
  }
  onSubmit(paymentForm: any) {
    if (this.storage.get('token') != undefined) {
      $("#processing-text").html("Fetching data..");
      $('#processing-modal').modal('show');
      if (this.isDisabled == false) {
        this.paymentService.get(this.storage.get('token'), this.bitotsavId).subscribe(
          data => {
            $("#processing-text").html("");
            $('#processing-modal').modal('hide');
            if (data.success) {
              this.payment = data.payment;
              this.isDisabled = true;
            }
            else {
              alert("No such Id found");
              paymentForm.reset();
            }
          },
          error => {
            $("#processing-text").html("");
            $('#processing-modal').modal('hide');
            alert("An unknown error occured");
          }
        )
      }
      else {
        $("#processing-text").html("Updating..");
        $('#processing-modal').modal('show');
        this.paymentService.update(this.storage.get('token'), this.bitotsavId, this.payment).subscribe(
          data => {
            $("#processing-text").html("");
            $('#processing-modal').modal('hide');
            if (data.success) {
              alert("Update successful");
              this.isDisabled = false;
              paymentForm.reset();
            }
            else {
              alert("An unknown error occured");
            }
          },
          error => {
            $("#processing-text").html("");
            $('#processing-modal').modal('hide');
            alert("An unknown error occured");
          }
        )
      }
    }
    else {
      this.router.navigate([""]);
    }
  }

}

class Payment {
  public day1: Boolean;
  public day2: Boolean;
  public day3: Boolean;
  public merchandise: Boolean;
  public accommodation: Boolean;
}