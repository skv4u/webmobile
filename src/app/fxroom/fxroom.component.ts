import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fxroom',
  templateUrl: './fxroom.component.html',
  styleUrls: ['./fxroom.component.css']
})
export class FxroomComponent implements OnInit {

  isCreateVisible: boolean = true;
  error: boolean = false;
  isProcessing: boolean = false;
  pageNotFound: boolean = false;
  
  hotelData: any = {
    "FullName": "",
    "Name": "",
    "Logo": ""
  }
  queryData: any = {};
  constructor() { }

  ngOnInit() {
  }

}
