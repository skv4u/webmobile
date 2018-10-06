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
  saveRoom() {
    console.log(this.roomTypeList);
    // console.log(this.selectedFloorList);
    // console.log
    let selecteRoom: any[] = [];
    let sendJson: any[] = [];
    let addedRoomRefList: number[] = [];
    let i = 0;
    for (let m of this.roomList) {
      if (m.IsAllocated) {
        for (let x of this.roomTypeList) {
          if (m.RoomType == x.RoomTypeCode && addedRoomRefList.indexOf(x.RoomReferenceNumber) == -1) {
            sendJson.push(
              {
                "RoomReferenceNumber": x.RoomReferenceNumber,
                "RoomNumber": m.RoomNumber,
                "ArrivalTime": this.arrivalTimingList[i++].ArrivalTime,
                "RoomType": m.RoomType
              }

            )
          }
        }
      }
      // selecteRoom.push({
      //   "RoomNumber":m.RoomNumber,
      //   "RoomType":m.RoomType
      // })
    }
    // for(selecteRoom)

    console.log(sendJson);
    let requestJson = {
      "PmsCustCode": this.queryData.p,
      "LoginID": this.queryData.e,
      "ReservationNumber": this.queryData.r,
      "Instruction": this.feedback,
      "RoomReferenceList": sendJson
    };
    // console.log(requestJson);
    // if (1) {
    //   return
    // }
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

    if (floorIDList.length) {
      for (let m of this.roomList) {
        if (this.currentTab == m.RoomType && floorIDList.indexOf(m.FloorID.toString()) != -1) {
          m.IsVisible = true;
        }
        else {
          m.IsVisible = false;
        }
      }
    }

    if (featureIDList.length) {
      for (let m of this.roomList) {
        if (this.currentTab == m.RoomType && this.isMatching(m.RoomFeatureID.split(','), featureIDList)) {
          m.IsVisible = true;
        }
        else {
          m.IsVisible = false;
        }
      }
    }

    if (floorIDList == 0 && featureIDList == 0) {
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

    /* temp 
    let data:any={};
    data.Response = {"RoomReferenceList":[{"RoomTypeCode":"KGS","RoomReferenceNumber":180,"RoomTypeName":"Kings Suite","ArrivalTime":"00:01"},{"RoomTypeCode":"RSS","RoomReferenceNumber":181,"RoomTypeName":"Rock Star Suite","ArrivalTime":"00:01"}],"RoomFeatureList":[{"RoomFeatureID":40,"RoomFeatureCode":"105","RoomFeatureName":"Pool Facing"},{"RoomFeatureID":41,"RoomFeatureCode":"101","RoomFeatureName":"Dvd/Cd Players"},{"RoomFeatureID":42,"RoomFeatureCode":"100","RoomFeatureName":"50 Inch Led Screen Tv"}],"RoomFloorList":[{"FloorID":32,"FloorCode":"FLR02","FloorName":"Floor -2"},{"FloorID":35,"FloorCode":"FLR01","FloorName":"Floor - 1"}],"AvailableRoomList":[{"RoomNumber":"KS1021","RoomName":"KS1021","RoomType":"KGS","IsAllocated":false,"FloorID":35,"RoomFeatureID":"41,42"},{"RoomNumber":"KS1025","RoomName":"KS1025","RoomType":"KGS","IsAllocated":false,"FloorID":35,"RoomFeatureID":"41,42"},{"RoomNumber":"KS1030","RoomName":"KS1030","RoomType":"KGS","IsAllocated":false,"FloorID":35,"RoomFeatureID":"41,42"},{"RoomNumber":"KS1033","RoomName":"KS1033","RoomType":"KGS","IsAllocated":false,"FloorID":35,"RoomFeatureID":"41,42"},{"RoomNumber":"KS1051","RoomName":"KS1051","RoomType":"KGS","IsAllocated":false,"FloorID":35,"RoomFeatureID":"41,42"},{"RoomNumber":"KS1060","RoomName":"KS1060","RoomType":"KGS","IsAllocated":false,"FloorID":35,"RoomFeatureID":"41,42"},{"RoomNumber":"KS1065","RoomName":"KS1065","RoomType":"KGS","IsAllocated":false,"FloorID":35,"RoomFeatureID":"41,42"},{"RoomNumber":"KS1068","RoomName":"KS1068","RoomType":"KGS","IsAllocated":false,"FloorID":35,"RoomFeatureID":"41,42"},{"RoomNumber":"KS1079","RoomName":"KS1079","RoomType":"KGS","IsAllocated":false,"FloorID":35,"RoomFeatureID":"41,42"},{"RoomNumber":"KS1082","RoomName":"KS1082","RoomType":"KGS","IsAllocated":false,"FloorID":35,"RoomFeatureID":"41,42"},{"RoomNumber":"KS1084","RoomName":"KS1084","RoomType":"KGS","IsAllocated":false,"FloorID":35,"RoomFeatureID":"41,42"},{"RoomNumber":"KS1087","RoomName":"KS1087","RoomType":"KGS","IsAllocated":false,"FloorID":35,"RoomFeatureID":"41,42"},{"RoomNumber":"KS1088","RoomName":"KS1088","RoomType":"KGS","IsAllocated":false,"FloorID":35,"RoomFeatureID":"41,42"},{"RoomNumber":"KS1089","RoomName":"KS1089","RoomType":"KGS","IsAllocated":false,"FloorID":35,"RoomFeatureID":"41,42"},{"RoomNumber":"KS1092","RoomName":"KS1092","RoomType":"KGS","IsAllocated":false,"FloorID":35,"RoomFeatureID":"41,42"},{"RoomNumber":"KS1093","RoomName":"KS1093","RoomType":"KGS","IsAllocated":false,"FloorID":35,"RoomFeatureID":"41,42"},{"RoomNumber":"KS1094","RoomName":"KS1094","RoomType":"KGS","IsAllocated":false,"FloorID":35,"RoomFeatureID":"41,42"},{"RoomNumber":"KS1096","RoomName":"KS1096","RoomType":"KGS","IsAllocated":false,"FloorID":35,"RoomFeatureID":"41,42"},{"RoomNumber":"KS1097","RoomName":"KS1097","RoomType":"KGS","IsAllocated":false,"FloorID":35,"RoomFeatureID":"41,42"},{"RoomNumber":"KS1098","RoomName":"KS1098","RoomType":"KGS","IsAllocated":false,"FloorID":35,"RoomFeatureID":"41,42"},{"RoomNumber":"KS1099","RoomName":"KS1099","RoomType":"KGS","IsAllocated":false,"FloorID":35,"RoomFeatureID":"41,42"},{"RoomNumber":"KS1100","RoomName":"KS1100","RoomType":"KGS","IsAllocated":false,"FloorID":35,"RoomFeatureID":"41,42"},{"RoomNumber":"RS2005","RoomName":"RS2005","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2007","RoomName":"RS2007","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2008","RoomName":"RS2008","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2010","RoomName":"RS2010","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2011","RoomName":"RS2011","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2012","RoomName":"RS2012","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2013","RoomName":"RS2013","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2014","RoomName":"RS2014","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2015","RoomName":"RS2015","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2016","RoomName":"RS2016","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2017","RoomName":"RS2017","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2018","RoomName":"RS2018","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2019","RoomName":"RS2019","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2020","RoomName":"RS2020","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2021","RoomName":"RS2021","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2022","RoomName":"RS2022","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2023","RoomName":"RS2023","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2024","RoomName":"RS2024","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2025","RoomName":"RS2025","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2026","RoomName":"RS2026","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2027","RoomName":"RS2027","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2028","RoomName":"RS2028","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2029","RoomName":"RS2029","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2030","RoomName":"RS2030","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2031","RoomName":"RS2031","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2032","RoomName":"RS2032","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2033","RoomName":"RS2033","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2034","RoomName":"RS2034","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2035","RoomName":"RS2035","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2036","RoomName":"RS2036","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2037","RoomName":"RS2037","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2038","RoomName":"RS2038","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2039","RoomName":"RS2039","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2040","RoomName":"RS2040","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2041","RoomName":"RS2041","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2042","RoomName":"RS2042","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2043","RoomName":"RS2043","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2044","RoomName":"RS2044","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2045","RoomName":"RS2045","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2046","RoomName":"RS2046","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2047","RoomName":"RS2047","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2048","RoomName":"RS2048","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2049","RoomName":"RS2049","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2050","RoomName":"RS2050","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2051","RoomName":"RS2051","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2052","RoomName":"RS2052","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2053","RoomName":"RS2053","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2054","RoomName":"RS2054","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2055","RoomName":"RS2055","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2056","RoomName":"RS2056","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2057","RoomName":"RS2057","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2058","RoomName":"RS2058","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2059","RoomName":"RS2059","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2060","RoomName":"RS2060","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2061","RoomName":"RS2061","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2062","RoomName":"RS2062","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2063","RoomName":"RS2063","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2064","RoomName":"RS2064","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2065","RoomName":"RS2065","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2066","RoomName":"RS2066","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2067","RoomName":"RS2067","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2068","RoomName":"RS2068","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2069","RoomName":"RS2069","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2070","RoomName":"RS2070","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2071","RoomName":"RS2071","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2072","RoomName":"RS2072","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2073","RoomName":"RS2073","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2074","RoomName":"RS2074","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2075","RoomName":"RS2075","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2076","RoomName":"RS2076","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2077","RoomName":"RS2077","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2078","RoomName":"RS2078","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2079","RoomName":"RS2079","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2080","RoomName":"RS2080","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2081","RoomName":"RS2081","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2082","RoomName":"RS2082","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2083","RoomName":"RS2083","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2084","RoomName":"RS2084","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2085","RoomName":"RS2085","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2086","RoomName":"RS2086","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2087","RoomName":"RS2087","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2088","RoomName":"RS2088","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2089","RoomName":"RS2089","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2090","RoomName":"RS2090","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2091","RoomName":"RS2091","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2092","RoomName":"RS2092","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2093","RoomName":"RS2093","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2094","RoomName":"RS2094","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2095","RoomName":"RS2095","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2096","RoomName":"RS2096","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2098","RoomName":"RS2098","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2099","RoomName":"RS2099","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2100","RoomName":"RS2100","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2101","RoomName":"RS2101","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2102","RoomName":"RS2102","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2103","RoomName":"RS2103","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2104","RoomName":"RS2104","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2105","RoomName":"RS2105","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2106","RoomName":"RS2106","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2107","RoomName":"RS2107","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2108","RoomName":"RS2108","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2109","RoomName":"RS2109","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2110","RoomName":"RS2110","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2111","RoomName":"RS2111","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2112","RoomName":"RS2112","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2113","RoomName":"RS2113","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2114","RoomName":"RS2114","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2115","RoomName":"RS2115","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2116","RoomName":"RS2116","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2117","RoomName":"RS2117","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2118","RoomName":"RS2118","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2119","RoomName":"RS2119","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2120","RoomName":"RS2120","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2121","RoomName":"RS2121","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2122","RoomName":"RS2122","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2123","RoomName":"RS2123","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2124","RoomName":"RS2124","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2125","RoomName":"RS2125","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2126","RoomName":"RS2126","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2127","RoomName":"RS2127","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2128","RoomName":"RS2128","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2129","RoomName":"RS2129","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2130","RoomName":"RS2130","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2131","RoomName":"RS2131","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2132","RoomName":"RS2132","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2133","RoomName":"RS2133","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2134","RoomName":"RS2134","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2135","RoomName":"RS2135","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2136","RoomName":"RS2136","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2137","RoomName":"RS2137","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2138","RoomName":"RS2138","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2139","RoomName":"RS2139","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2140","RoomName":"RS2140","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2141","RoomName":"RS2141","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2142","RoomName":"RS2142","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2143","RoomName":"RS2143","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2144","RoomName":"RS2144","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2145","RoomName":"RS2145","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2146","RoomName":"RS2146","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2147","RoomName":"RS2147","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2148","RoomName":"RS2148","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2149","RoomName":"RS2149","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2150","RoomName":"RS2150","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2151","RoomName":"RS2151","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2152","RoomName":"RS2152","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2153","RoomName":"RS2153","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2154","RoomName":"RS2154","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2155","RoomName":"RS2155","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2156","RoomName":"RS2156","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2157","RoomName":"RS2157","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2158","RoomName":"RS2158","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2159","RoomName":"RS2159","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2160","RoomName":"RS2160","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2161","RoomName":"RS2161","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2162","RoomName":"RS2162","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2163","RoomName":"RS2163","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2164","RoomName":"RS2164","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2165","RoomName":"RS2165","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2166","RoomName":"RS2166","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2167","RoomName":"RS2167","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2168","RoomName":"RS2168","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2169","RoomName":"RS2169","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2170","RoomName":"RS2170","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2171","RoomName":"RS2171","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2172","RoomName":"RS2172","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2173","RoomName":"RS2173","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2174","RoomName":"RS2174","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2175","RoomName":"RS2175","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2176","RoomName":"RS2176","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2177","RoomName":"RS2177","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2178","RoomName":"RS2178","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2179","RoomName":"RS2179","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2180","RoomName":"RS2180","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2181","RoomName":"RS2181","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2182","RoomName":"RS2182","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2183","RoomName":"RS2183","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2184","RoomName":"RS2184","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2185","RoomName":"RS2185","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2186","RoomName":"RS2186","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2187","RoomName":"RS2187","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2188","RoomName":"RS2188","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2189","RoomName":"RS2189","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2190","RoomName":"RS2190","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2191","RoomName":"RS2191","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2192","RoomName":"RS2192","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2193","RoomName":"RS2193","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2194","RoomName":"RS2194","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2195","RoomName":"RS2195","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2196","RoomName":"RS2196","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2197","RoomName":"RS2197","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2198","RoomName":"RS2198","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2199","RoomName":"RS2199","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"RS2200","RoomName":"RS2200","RoomType":"RSS","IsAllocated":false,"FloorID":32,"RoomFeatureID":"41,40,42"},{"RoomNumber":"TEST1","RoomName":"TEST1","RoomType":"KGS","IsAllocated":false,"FloorID":35,"RoomFeatureID":""}]}
    this.isCreateVisible = true;
    this.featureList = this.formatMultiSelect('RoomFeatureID','RoomFeatureName','feature', data.Response.RoomFeatureList);
    this.floorList =  this.formatMultiSelect('FloorID','FloorName','floor',data.Response.RoomFloorList);
   
    this.roomTypeList = data.Response.RoomReferenceList;
  
    this.tabs = this.checkSingleTypeRoom();
    this.isSingle = this.tabs.length == 1;
    this.totalRoom = this.tabs[0].RoomCount;   
    this.arrivalTimingList = this.getTimeList();   
    this.roomList = data.Response.AvailableRoomList;
    this.currentTab = this.tabs[0].tabKey;
    if(1)
    return false
    /* Temp end */


    this.commonService.PostMethod('CheckIn/PreStayReservationDetailsGET', requestJson).subscribe(
      data => {
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

        if (!this.isSingle) {
          // this.tabs = this.getTabList(roomTypes);
        }
        this.arrivalTimingList = this.getTimeList();
        // if(data.Response.AvailableRoomList && data.Response.AvailableRoomList.length){
        //   for(let m of data.Response.AvailableRoomList){
        //     m.IsVisible = m.RoomType == this.currentTab
        //   }
        // }
        // console.log(data.Response.AvailableRoomList);
        this.roomList = this.addViisbilityToRoomsAvailability(data.Response.AvailableRoomList);
        // this.roomList = this.getRoomList(0);

        // console.log(this.arrivalTimingList);
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
