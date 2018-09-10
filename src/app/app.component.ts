import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CommonService } from './shared/common.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [CommonService]
})
export class AppComponent {
 
}
