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
  featureList :any[]= [
    { "key": "Chip11", "text": "Chip11" },
    { "key": "Chip22", "text": "Chip2 chip22" },
    { "key": "Chip33", "text": "Chip3 chip3 chip33" },
    { "key": "Chip44", "text": "Chip4 chip4 chip44" }
  ];
  selectedFeatureList:any[] = [];
  floorList :any[]= [
    { "key": "Chip111", "text": "Chip111" },
    { "key": "Chip222", "text": "Chip2 chip222" },
    { "key": "Chip333", "text": "Chip3 chip3 chip333" },
    { "key": "Chip444", "text": "Chip4 chip4 chip444" }
  ];
  selectedFloorList:any[] = [];
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
    this._title.setTitle("Select Room");
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
            "Logo": data.Data.ShortLogoa
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
  saveRoom(){
    console.log(this.selectedFeatureList);
    console.log(this.selectedFloorList);
  }
  updateParent(elem,type){
// console.log(elem)
// console.log(type)
if(type == 'feature'){
  this.selectedFeatureList = elem;
}
  }
}
