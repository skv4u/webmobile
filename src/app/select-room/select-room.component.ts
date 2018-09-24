import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { CommonService } from './../shared/common.service';

@Component({
  selector: 'app-select-room',
  templateUrl: './select-room.component.html',
  styleUrls: ['./select-room.component.css']
})
export class SelectRoomComponent implements OnInit {
  isCreateVisible: boolean = true;
  isRated: boolean = false;
  error: boolean = false;
  isProcessing: boolean = false;
  pageNotFound: boolean = false;
  
  hotelData: any = {
    "FullName": "",
    "Name": "",
    "Logo": ""
  };
  roomData: any = {};
  queryData: any = {};
  constructor(private _title: Title,public commonService: CommonService) {
    this.listHotelData();
    this.listRoom();
    
    // this.queryData = this.commonService.queryParam(window.top.location.href);
    // if (this.queryData)
    //   this.listHotelData();
    // else
    //   this.pageNotFound = true;

  }
  ngOnInit() {
    this._title.setTitle("Customer Feedback");
  }
  listHotelData() {
    this.isProcessing = true;
    this.queryData.p  = 20000;
    this.commonService.GetMethod("hotel-info/" + this.queryData.p, "Admin").subscribe(
      data => {
        if (data && data.Data) {
          this.hotelData =  {
            "FullName":  data.Data.PropertyName,
            "Name":  data.Data.PropertyName,
            "Logo": data.Data.ShortLogo
          }
          // this.hotelData.FullName = data.Data.PropertyName;
          // this.hotelData.Name = data.Data.PropertyName;
          // this.hotelData.Logo = data.Data.ShortLogo;

        }
        else {
          this.pageNotFound = true;
        }
        this.isProcessing = false;
      }
    )
  }
  listRoom() {
    this.queryData.r = 699;
    this.isProcessing = true;
    this.commonService.GetMethod("room/" + this.queryData.r, "Config").subscribe(
      data => {
        // console.log(data);
        if (data && data.Data) {
          this.roomData = data.Data;
        }
        // console.log(this.roomData);
        this.isProcessing = false;
      }
    );
  }
}
