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
  saveSuccess:boolean = true;
  responseMessage:string = "You have selected Room #";
  isRated: boolean = false;
  error: boolean = false;
  isProcessing: boolean = false;
  pageNotFound: boolean = false;
  isSingle: boolean = true;
  currentTab:string = '';
  hotelData: any = {
    "FullName": "",
    "Name": "",
    "Logo": ""
  };
  /*tabs: any = [{
    "tabName": "Deluxe",
    "tabKey": "ServiceRequest",
    "IsActive": true
  },
  {
    "tabName": "Standard",
    "tabKey": "Feedback",
    "IsActive": false
  }
  ];*/
  tabs:any[]=[];
  roomTypeList: any[] = [];
  roomList: any[] = [];
  
  featureList: any[] = [];
  selectedFeatureList: any[] = [];
  floorList: any[] = [];
  selectedFloorList: any[] = [];
  roomData: any = {};
  queryData: any = {};
  totalRoom:number = 0;
  constructor(private _title: Title, public commonService: CommonService) {
    this.listHotelData();
  }
  ngOnInit() {
    this._title.setTitle("Choose room of your choice");
    this.allApi();
  }

  listHotelData() {
    this.isProcessing = true;
    this.queryData.p = 20000;
    this.commonService.GetMethod("hotel-info/" + this.queryData.p, "Admin").subscribe(
      data => {
        if (data && data.Data) {
          this.hotelData = {
            "FullName": data.Data.PropertyName,
            "Name": data.Data.PropertyName,
            "Logo": data.Data.ShortLogoa
          }
        }
        else {
          this.pageNotFound = true;
        }
        this.isProcessing = false;
      },
      error =>{
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
  saveRoom() {
    console.log(this.selectedFeatureList);
    console.log(this.selectedFloorList);
    this.isCreateVisible =false;
    this.saveSuccess = true;
    this.responseMessage = "You have selected Room #";
  }
  updateParent(elem, type) {
    // console.log(elem)
    // console.log(type)
    if (type == 'feature') {
      this.selectedFeatureList = elem;
    }
  }
  viewTabDetail(key: string, index: number) {
    for (let i = 0; i < this.tabs.length; i++) {
      this.tabs[i].IsActive = false;
    }
    this.tabs[index].IsActive = true;
    this.currentTab = key;
    // this._title.setTitle(this.hotelData.Name + ' : ' + this.tabs[index].tabName);
  }
  formatMultiSelect(key1:string,key2:string,type:string,data:any){
    if(!data){
      return [];
    }
    let returnlist:any [] = [];
    for(let m of data){
      returnlist.push({
        "key":m[key1],
        "text":m[key2]
      })
    }
    return returnlist;
  }
  changeAllocatedRoom(index:number){    
    this.roomList[index].IsAllocated = !this.roomList[index].IsAllocated;
  }
  allApi() {
    let requestJson ={ 
      "LoginID": "mobiledev@idsnext.com", 
      "PmsCustCode":20002, 
      "ReservationNumber":327,
      "FeatureID":"",
      "FloorID":"",
      "RoomType":"DLX"
    };
    this.isCreateVisible = false;
    this.commonService.PostMethod('CheckIn/PreStayReservationDetailsGET',requestJson).subscribe(
      data=>{
        console.log(data);
        this.isCreateVisible = true;
        this.featureList = this.formatMultiSelect('RoomFeatureID','RoomFeatureName','feature', data.Response.RoomFeatureList);
        this.floorList =  this.formatMultiSelect('FloorID','FloorName','floor',data.Response.RoomFloorList);
        this.roomList = data.Response.AvailableRoomList;
        this.roomTypeList = data.Response.RoomReferenceList;
        let roomTypes:string[] = this.checkSingleTypeRoom();
        this.isSingle = roomTypes.length == 1;
        this.totalRoom = this.roomTypeList.length;
        if(!this.isSingle){
          this.tabs = this.getTabList();
        }
      }
    )
    /*this.roomTypeList = [
      {
        "FeatureList": [
          {
            "FeatureID": 12,
            "FeatureCode": "AC1",
            "FeatureName": "AC - Air Conditioner"
          },
          {
            "FeatureID": 13,
            "FeatureCode": "AC3",
            "FeatureName": "AC2 - Air Conditioner"
          }
        ],
        "FloorList": [
          {
            "FloorID": 12,
            "FloorCode": "FIRST",
            "FloorName": "First-Floor"
          },
          {
            "FloorID": 13,
            "FloorCode": "Second",
            "FloorName": "Second-Floor"
          }
        ],
        "AvailableRooms": [
          {
            "RoomNumber": "101",
            "RoomName": "101-Name",
            "RoomType": "STD",
            "IsAllocated": false
          },
          {
            "RoomNumber": "102",
            "RoomName": "102-Name",
            "RoomType": "DLX",
            "IsAllocated": false
          }
        ]
      }
    ];
    this.featureList = [
      {
        "FeatureID": 12,
        "FeatureCode": "AC1",
        "FeatureName": "AC - Air Conditioner"
      },
      {
        "FeatureID": 13,
        "FeatureCode": "AC3",
        "FeatureName": "AC2 - Air Conditioner"
      }
    ];
    this.floorList = [
      {
        "FloorID": 12,
        "FloorCode": "FIRST",
        "FloorName": "First-Floor"
      },
      {
        "FloorID": 13,
        "FloorCode": "Second",
        "FloorName": "Second-Floor"
      }
    ];
    this.roomList = [
      {
        "RoomNumber": "101",
        "RoomName": "101-Name",
        "RoomType": "STD",
        "IsAllocated": false
      },
      {
        "RoomNumber": "102",
        "RoomName": "102-Name",
        "RoomType": "DLX",
        "IsAllocated": false
      }
    ];
    this.featureList = this.formatMultiSelect('FeatureID','FeatureCode','feature');
    this.floorList =  this.formatMultiSelect('FloorID','FloorCode','floor');*/
  }
  checkSingleTypeRoom(){
    let roomtype:string[] = [];
    for(let m of this.roomTypeList){
      roomtype.push(m.RoomTypeCode);
    }
    roomtype = Array.from(new Set(roomtype));
   return roomtype;

  }
  getTabList(){
    let roomtype:any[] = [];
    for(let m of this.roomTypeList){
      roomtype.push({
        "tabName": m.RoomTypeName,
        "tabKey": m.RoomTypeCode,
        "IsActive": false
      });
      roomtype[0].IsActive =true;
    }
   return roomtype;
  }
}
