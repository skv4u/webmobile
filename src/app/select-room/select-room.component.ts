import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { CommonService } from './../shared/common.service';


@Component({
  selector: 'app-select-room',
  templateUrl: './select-room.component.html',
  styleUrls: ['./select-room.component.css']
})
export class SelectRoomComponent implements OnInit {
  isCreateVisible: boolean = false;
  saveSuccess: boolean = false;
  responseMessage: string = "You have selected Room #";
  isRated: boolean = false;
  error: boolean = false;
  isProcessing: boolean = false;
  pageNotFound: boolean = false;
  isSingle: boolean = true;
  refreshRoomList: boolean = true;
  feedback: string = "";
  allotedRoom: string = "";
  currentTab: string = '';
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
  tabs: any[] = [];
  roomTypeList: any[] = [];
  roomList: any[] = [];

  featureList: any[] = [];
  selectedFeatureList: any[] = [];
  selectedFeatureIDList: number[] = [];
  selectedFloorIDList: number[] = [];
  floorList: any[] = [];
  selectedFloorList: any[] = [];
  roomData: any = {};
  queryData: any = {};
  totalRoom: number = 0;
  arrivalTimingList: any[] = [];
  masterList: any;
  constructor(private _title: Title, public commonService: CommonService) {
    this.queryData = this.commonService.queryParam(window.top.location.href);
    if (this.queryData)
      this.listHotelData();
    else
      this.pageNotFound = true;
  }
  ngOnInit() {
    this._title.setTitle("Choose room of your choice");
  }

  listHotelData() {
    this.isProcessing = true;
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
        // this.isProcessing = false;
        this.allApi();

      },
      error => {
        this.isProcessing = false;
      }
    )
  }
  // listRoom() {
  //   this.queryData.r = 699;
  //   this.isProcessing = true;
  //   this.commonService.GetMethod("room/" + this.queryData.r, "Config").subscribe(
  //     data => {
  //       // console.log(data);
  //       if (data && data.Data) {
  //         this.roomData = data.Data;
  //       }
  //       // console.log(this.roomData);
  //       this.isProcessing = false;
  //     }
  //   );
  // }
getRoomNumber(){

}
  saveRoom() {
    // console.log(this.roomTypeList);
    // console.log(this.selectedFloorList);
    // console.log
    let selectedRoom: any[] = [];
    let sendJson: any[] = [];
    let addedRoomRefList: number[] = [];
    let addedRoomNumber: number[] = [];
    let i = 0;
    // console.log(this.arrivalTimingList);
    for (let m of this.roomList) {
      if (m.IsAllocated) {
        selectedRoom.push({
          "RoomNumber": m.RoomNumber,
          "RoomType": m.RoomType
        });
      }
    }

    for(let i=0; i<this.roomTypeList.length; i++){
      // debugger
      let roomNum:string = "";
      for(let m of selectedRoom){
        if(m.RoomType == this.roomTypeList[i].RoomTypeCode && addedRoomNumber.indexOf(m.RoomNumber) == -1){
          roomNum = m.RoomNumber;
          addedRoomNumber.push(m.RoomNumber);
          break;
        }
      }
      this.roomTypeList[i].RoomNumber = roomNum;
      this.roomTypeList[i].ArrivalTime = this.arrivalTimingList[i].ArrivalTime;
    }

    // console.log(this.roomTypeList);
/*
    for (let x of this.roomTypeList) {
      if(selectedRoom.length){
        addedRoomNumber=[];
        for(let m of selectedRoom){
          if (m.RoomType == x.RoomTypeCode && addedRoomRefList.indexOf(x.RoomReferenceNumber) == -1 && addedRoomNumber.indexOf(m.RoomNumber) == -1) {
            sendJson.push(
              {
                "RoomReferenceNumber": x.RoomReferenceNumber,
                "RoomNumber": m.RoomNumber,
                "ArrivalTime": this.arrivalTimingList[i].ArrivalTime,
                "RoomType": x.RoomTypeCode
              });
          }else if(m.RoomType == x.RoomTypeCode && addedRoomRefList.indexOf(x.RoomReferenceNumber) == -1){
            sendJson.push(
              {
                "RoomReferenceNumber": x.RoomReferenceNumber,
                "RoomNumber": "",
                "ArrivalTime": this.arrivalTimingList[i].ArrivalTime,
                "RoomType": x.RoomTypeCode
              });
            
          }
          // else if(addedRoomRefList.indexOf(x.RoomReferenceNumber) == -1){
          //   sendJson.push(
          //     {
          //       "RoomReferenceNumber": x.RoomReferenceNumber,
          //       "RoomNumber": "",
          //       "ArrivalTime": this.arrivalTimingList[i].ArrivalTime,
          //       "RoomType": x.RoomTypeCode
          //     });
          // }
          addedRoomNumber.push(m.RoomNumber)
        }
        i++;
      }
      else {
        if(addedRoomRefList.indexOf(x.RoomReferenceNumber) == -1)
        sendJson.push(
          {
            "RoomReferenceNumber": x.RoomReferenceNumber,
            "RoomNumber": "",
            "ArrivalTime": this.arrivalTimingList[i++].ArrivalTime,
            "RoomType": x.RoomTypeCode
          });
      }
      
      addedRoomRefList.push(x.RoomReferenceNumber);
      // selecteRoom.push({
      //   "RoomNumber":m.RoomNumber,
      //   "RoomType":m.RoomType
      // })
    }
    // for(selecteRoom)
*/
    // console.log(sendJson);
    let requestJson = {
      "PmsCustCode": this.queryData.p,
      "LoginID": this.queryData.e,
      "ReservationNumber": this.queryData.r,
      "Instruction": this.feedback,
      "RoomReferenceList": this.roomTypeList
    };
    console.log(requestJson);
    if (1) {
      return
    }
    this.commonService.PostMethod('CheckIn/PreStayReservationDetailsPUT', requestJson).subscribe(
      data => {

        this.isCreateVisible = false;
        this.saveSuccess = true;
        this.responseMessage = "You have selected Room #";
        this.allotedRoom = data.Data.Descrition;

      }
    )


  }
  updateParent(elem, type) {
    // console.log(elem)
    // console.log(type)

    if (type == 'feature') {
      this.selectedFeatureList = elem;
    }
    else {
      this.selectedFloorList = elem;
    }
    let featureIDList: any = this.listIDs(this.selectedFeatureList);
    let floorIDList: any = this.listIDs(this.selectedFloorList);
    if (floorIDList.length && featureIDList.length) {
      for (let m of this.roomList) {
        if (this.currentTab == m.RoomType && floorIDList.indexOf(m.FloorID.toString()) != -1 && this.isMatching(m.RoomFeatureID.split(','), featureIDList)) {
          m.IsVisible = true;
        }
        else {
          m.IsVisible = false;
        }
      }
    }
    else if (floorIDList.length) {
      for (let m of this.roomList) {
        if (this.currentTab == m.RoomType && floorIDList.indexOf(m.FloorID.toString()) != -1) {
          m.IsVisible = true;
        }
        else {
          m.IsVisible = false;
        }
      }
    }
    else if (featureIDList.length) {
      for (let m of this.roomList) {
        if (this.currentTab == m.RoomType && this.isMatching(m.RoomFeatureID.split(','), featureIDList)) {
          m.IsVisible = true;
        }
        else {
          m.IsVisible = false;
        }
      }
    }
    else {
      this.addViisbilityToRoomsAvailability(this.masterList.AvailableRoomList);
    }
    this.reloadRoom();
  }
  isMatching(arr1, arr2) {
    let list: string[] = arr2.filter(function (obj) { return arr1.indexOf(obj) != -1; });
    return !(list.length == 0)
  }
  listIDs(data: any) {
    return data.map(v => v.key.toString());
  }
  viewTabDetail(key: string, index: number) {
    for (let i = 0; i < this.tabs.length; i++) {
      this.tabs[i].IsActive = false;
    }
    this.tabs[index].IsActive = true;
    this.totalRoom = this.tabs[index].RoomCount;

    this.currentTab = key;
    this.roomList = this.addViisbilityToRoomsAvailability(this.masterList.AvailableRoomList);
    this.reloadRoom();
    // this.roomList = this.getRoomList(index);
    // this._title.setTitle(this.hotelData.Name + ' : ' + this.tabs[index].tabName);
  }
  reloadRoom() {
    this.refreshRoomList = false;
    setTimeout(() => {
      this.refreshRoomList = true;
    }, 30);
  }
  formatMultiSelect(key1: string, key2: string, type: string, data: any) {
    if (!data) {
      return [];
    }
    let returnlist: any[] = [];
    for (let m of data) {
      returnlist.push({
        "key": m[key1],
        "text": m[key2]
      })
    }
    return returnlist;
  }
  changeAllocatedRoom(index: number) {
    if (!this.roomList[index].IsAllocated) {
      let flag: boolean = this.validateRoomSelection();
      if (flag) {
        alert("You can select only " + this.totalRoom + " Room(s)");
        return
      }
    }
    this.roomList[index].IsAllocated = !this.roomList[index].IsAllocated;
  }
  validateRoomSelection() {
    let count: number = 0;
    for (let m of this.roomList) {
      if (m.IsAllocated && m.RoomType == this.currentTab)
        count++;
    }
    if (count < this.totalRoom) {
      return false
    }
    else {
      return true;
    }

    // return count;
  }
  allApi() {
    let requestJson = {
      "LoginID": this.queryData.e,
      "PmsCustCode": this.queryData.p,
      "ReservationNumber": this.queryData.r
    };
    // this.isCreateVisible = tr;

    /* temp */
    let data: any = {};
    data.Response = { "RoomReferenceList": [{ "RoomTypeCode": "KGS", "RoomReferenceNumber": 180, "RoomTypeName": "Kings Suite", "ArrivalTime": "00:01" }, { "RoomTypeCode": "KGS", "RoomReferenceNumber": 181, "RoomTypeName": "Kings Suite", "ArrivalTime": "04:01" }], "RoomFeatureList": [{ "RoomFeatureID": 41, "RoomFeatureCode": "101", "RoomFeatureName": "Dvd/Cd Players" }, { "RoomFeatureID": 42, "RoomFeatureCode": "100", "RoomFeatureName": "50 Inch Led Screen Tv" }], "RoomFloorList": [{ "FloorID": 32, "FloorCode": "FLR02", "FloorName": "Floor -2" }, { "FloorID": 35, "FloorCode": "FLR01", "FloorName": "Floor - 1" }], "AvailableRoomList": [{ "RoomNumber": "KS1021", "RoomName": "KS1021", "RoomType": "KGS", "IsAllocated": false, "FloorID": 35, "RoomFeatureID": "41,42" }, { "RoomNumber": "KS1030", "RoomName": "KS1030", "RoomType": "KGS", "IsAllocated": false, "FloorID": 35, "RoomFeatureID": "41,42" }, { "RoomNumber": "KS1033", "RoomName": "KS1033", "RoomType": "KGS", "IsAllocated": false, "FloorID": 35, "RoomFeatureID": "41,42" }, { "RoomNumber": "KS1051", "RoomName": "KS1051", "RoomType": "KGS", "IsAllocated": false, "FloorID": 35, "RoomFeatureID": "41,42" }, { "RoomNumber": "KS1060", "RoomName": "KS1060", "RoomType": "KGS", "IsAllocated": false, "FloorID": 35, "RoomFeatureID": "41,42" }, { "RoomNumber": "KS1065", "RoomName": "KS1065", "RoomType": "KGS", "IsAllocated": false, "FloorID": 35, "RoomFeatureID": "41,42" }, { "RoomNumber": "KS1068", "RoomName": "KS1068", "RoomType": "KGS", "IsAllocated": false, "FloorID": 35, "RoomFeatureID": "41,42" }, { "RoomNumber": "KS1079", "RoomName": "KS1079", "RoomType": "KGS", "IsAllocated": false, "FloorID": 35, "RoomFeatureID": "41,42" }, { "RoomNumber": "KS1082", "RoomName": "KS1082", "RoomType": "KGS", "IsAllocated": false, "FloorID": 35, "RoomFeatureID": "41,42" }, { "RoomNumber": "KS1084", "RoomName": "KS1084", "RoomType": "KGS", "IsAllocated": false, "FloorID": 35, "RoomFeatureID": "41,42" }, { "RoomNumber": "KS1087", "RoomName": "KS1087", "RoomType": "KGS", "IsAllocated": false, "FloorID": 35, "RoomFeatureID": "41,42" }, { "RoomNumber": "KS1088", "RoomName": "KS1088", "RoomType": "KGS", "IsAllocated": false, "FloorID": 35, "RoomFeatureID": "41,42" }, { "RoomNumber": "KS1089", "RoomName": "KS1089", "RoomType": "KGS", "IsAllocated": false, "FloorID": 35, "RoomFeatureID": "41,42" }, { "RoomNumber": "KS1091", "RoomName": "KS1091", "RoomType": "KGS", "IsAllocated": false, "FloorID": 35, "RoomFeatureID": "41,42" }, { "RoomNumber": "KS1092", "RoomName": "KS1092", "RoomType": "KGS", "IsAllocated": false, "FloorID": 35, "RoomFeatureID": "41,42" }, { "RoomNumber": "KS1093", "RoomName": "KS1093", "RoomType": "KGS", "IsAllocated": false, "FloorID": 35, "RoomFeatureID": "41,42" }, { "RoomNumber": "KS1094", "RoomName": "KS1094", "RoomType": "KGS", "IsAllocated": false, "FloorID": 35, "RoomFeatureID": "41,42" }, { "RoomNumber": "KS1096", "RoomName": "KS1096", "RoomType": "KGS", "IsAllocated": false, "FloorID": 35, "RoomFeatureID": "41,42" }, { "RoomNumber": "KS1097", "RoomName": "KS1097", "RoomType": "KGS", "IsAllocated": false, "FloorID": 35, "RoomFeatureID": "41,42" }, { "RoomNumber": "KS1098", "RoomName": "KS1098", "RoomType": "KGS", "IsAllocated": false, "FloorID": 35, "RoomFeatureID": "41,42" }, { "RoomNumber": "KS1099", "RoomName": "KS1099", "RoomType": "KGS", "IsAllocated": false, "FloorID": 35, "RoomFeatureID": "41,42" }, { "RoomNumber": "KS1100", "RoomName": "KS1100", "RoomType": "KGS", "IsAllocated": false, "FloorID": 35, "RoomFeatureID": "41,42" }, { "RoomNumber": "TEST1", "RoomName": "TEST1", "RoomType": "KGS", "IsAllocated": false, "FloorID": 35, "RoomFeatureID": "" }] }
    this.isProcessing = false;
    this.isCreateVisible = true;
    this.masterList = data.Response;
    this.isCreateVisible = true;
    this.featureList = this.formatMultiSelect('RoomFeatureID', 'RoomFeatureName', 'feature', data.Response.RoomFeatureList);
    this.floorList = this.formatMultiSelect('FloorID', 'FloorName', 'floor', data.Response.RoomFloorList);

    this.roomTypeList = data.Response.RoomReferenceList;

    this.tabs = this.checkSingleTypeRoom();
    this.isSingle = this.tabs.length == 1;
    this.totalRoom = this.tabs[0].RoomCount;
    this.currentTab = this.tabs[0].tabKey;

    this.arrivalTimingList = this.getTimeList();
    

    this.roomList = this.addViisbilityToRoomsAvailability(data.Response.AvailableRoomList);
    if (1)
      return false
    /* Temp end */


    this.commonService.PostMethod('CheckIn/PreStayReservationDetailsGET', requestJson).subscribe(
      data => {
        this.isProcessing = false;
        this.isCreateVisible = true;
        this.masterList = data.Response;
        this.featureList = this.formatMultiSelect('RoomFeatureID', 'RoomFeatureName', 'feature', data.Response.RoomFeatureList);
        this.floorList = this.formatMultiSelect('FloorID', 'FloorName', 'floor', data.Response.RoomFloorList);

        this.roomTypeList = data.Response.RoomReferenceList;

        this.tabs = this.checkSingleTypeRoom();
        this.isSingle = this.tabs.length == 1;
        this.totalRoom = this.tabs[0].RoomCount;
        this.currentTab = this.tabs[0].tabKey;

        this.arrivalTimingList = this.getTimeList();
        this.roomList = this.addViisbilityToRoomsAvailability(data.Response.AvailableRoomList);
      },
      error => {
        this.isProcessing = false;
      }
    )
  }
  addViisbilityToRoomsAvailability(data: any) {
    if (data && data.length) {
      for (let m of data) {
        m.IsVisible = m.RoomType == this.currentTab
      }
    }
    return data;
  }
  // getRoomList(tabIndex:number){
  //   let roomList:any[] = [];
  //   for(let m of this.masterList.AvailableRoomList){
  //     if(this.tabs[tabIndex].tabKey == m.RoomType)
  //     roomList.push({
  //         "RoomNumber": m.ArrivalTime,
  //         "RoomName":m.RoomName,
  //         "IsAllocated":m.IsAllocated
  //       });
  //   }
  //   return roomList;
  // }
  checkSingleTypeRoom() {
    let roomtype: any[] = [];
    let list: any[] = [];
    for (let m of this.roomTypeList) {
      roomtype.push(m.RoomTypeCode);
    }
    roomtype = Array.from(new Set(roomtype));
    for (let m of roomtype) {
      list.push({
        "tabName": this.getRoomTypeName(m),
        "tabKey": m,
        "IsActive": false,
        "RoomCount": this.getRoomCount(m)
      });
    }

    list[0].IsActive = true;
    return list;
  }
  getTimeList() {

    let timeList: any[] = [];
    for (let m of this.roomTypeList) {
      // if(this.tabs[0].tabKey == m.RoomTypeCode)
      timeList.push({
        "ArrivalTime": m.ArrivalTime
      });
    }
    return timeList;
  }
  // getTabList(roomTypeList:any){
  //   console.log(roomTypeList);
  //   let roomtype:any[] = [];
  //   for(let m of roomTypeList){
  //     roomtype.push({
  //       "tabName": m.RoomTypeName,
  //       "tabKey": m.RoomTypeCode,
  //       "IsActive": false,
  //       "RoomCount":this.getRoomCount(m.RoomTypeCode)

  //     });
  //     roomtype[0].IsActive =true;
  //   }
  //  return roomtype;
  // }
  getRoomCount(roomTypeCode: string) {
    let count: number = 0;
    for (let m of this.roomTypeList) {
      if (m.RoomTypeCode == roomTypeCode)
        count++
    }
    return count;
  }
  getRoomTypeName(roomTypeCode: string) {

    for (let m of this.roomTypeList) {
      if (m.RoomTypeCode == roomTypeCode)
        return m.RoomTypeName
    }
    return "";
  }
}
