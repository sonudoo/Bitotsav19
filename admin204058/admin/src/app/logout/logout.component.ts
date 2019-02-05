import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService, LOCAL_STORAGE } from 'angular-webstorage-service';


@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor( @Inject(LOCAL_STORAGE) private storage: StorageService, private router: Router) {}

  ngOnInit() {
    this.storage.remove('token');
    this.router.navigate(['/']);
  }

}
