import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  domains = ['adi.so', 'sreyaj.dev'];
  email = new FormControl({
    username: 'john',
    domain: 'sreyaj.dev',
  });
  errors = {
    usernameLengthMin: 'Min 3 chars required for username',
    usernameLengthMax: 'Max 8 chars allowed for username',
    domainBlacklist: 'Domain not allowed',
  };

  ngOnInit() {}
}
