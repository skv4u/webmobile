import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonService } from './../shared/common.service';


@Component({
  selector: 'app-fxroom',
  templateUrl: './fxroom.component.html',
  styleUrls: ['./fxroom.component.css'],
  providers: [CommonService]
})
export class FxroomComponent implements OnInit {

  isCreateVisible: boolean = true;
  error: boolean = false;
  isProcessing: boolean = false;
  pageNotFound: boolean = false;
  currentTab: string = "ServiceRequest";
  selectedDepartment: string = "Select Department";
  departmentError:boolean = false;
  feedbackTextError:boolean = false;
  

  totalRating: number[] = [1, 2, 3, 4, 5];
  currentRating: number = 0;
  tempRating: number = 0;
  feedback: string = "";
  isRated: boolean = false;
  tabs: any = [{
    "tabName": "Service Request",
    "tabKey": "ServiceRequest",
    "IsActive": true
  },
  {
    "tabName": "Feedback",
    "tabKey": "Feedback",
    "IsActive": false
  },
  {

    "tabName": "Offers",
    "tabKey": "Offers",
    "IsActive": false
  }];
  hotelData: any = {
    "FullName": "",
    "Name": "",
    "Logo": ""
  };
  queryData: any = {};
  serviceList: any;
  departmentList: any[] = [];
  offerList: any[] = [];
  saveSuccess: boolean = false;
  responseMessage: string = "";
  popupVisibility: boolean = false;
  popuptype: number = 1;
  roomData: any = {};
  constructor(private _title: Title, public commonService: CommonService) {
    this.queryData = this.commonService.queryParam(window.top.location.href);    
    if (this.queryData)
      this.listHotelData((sucess) => {
        if (sucess) {
          this.listServices();
          this.listHotelDepartment();
          this.listHotelOffers();
          this.listRoom();
        }
      });
    else
      this.pageNotFound = true;
  }

  ngOnInit() {
    this._title.setTitle('FX-Service : Service Request');
  }
  listHotelData(callback) {
    this.isProcessing = true;
    this.commonService.GetMethod("hotel-info/" + this.queryData.p, "Admin").subscribe(
      data => {
        if (data && data.Data) {
          this.hotelData.FullName = data.Data.PropertyName;
          this.hotelData.Name = data.Data.PropertyName;
          this.hotelData.Logo = data.Data.ShortLogo;
        }
        // else {
        //   this.pageNotFound = true;
        // }
        this.isProcessing = false;
        callback(true);
      },
      error => {
        callback(false);
      }

    )
  }
  listServices() {
    this.isProcessing = true;
    this.commonService.GetMethod("masterservices/" + this.queryData.p + '/' + this.queryData.e, "Datahub").subscribe(
      data => {
        if (data && data.departments) {
          for (let m of data.departments) {
            for (let n of m.requests) {
              n.IsChecked = false;
            }
          }
          this.serviceList = data.departments;
          // console.log(this.serviceList);

        }
        this.isProcessing = false;
      }
    )
  }
  listHotelDepartment() {
    this.isProcessing = true;
    this.departmentList = [];
    this.commonService.GetMethod("department/property/" + this.queryData.p + '/Active', "Config").subscribe(
      data => {
        if (data && data.Data.length) {
          this.departmentList = data.Data;
        }
        this.isProcessing = false;
      }
    );
  }
  listHotelOffers() {
    
    this.isProcessing = true;
    this.offerList = [];
    let jsonData = {
      "SelectionMode": "Property",
      "SelectionCode": this.queryData.p,
      "IsActive": "Active"
    }
    this.commonService.PostMethod("offer/get-current-offer", jsonData, "Config").subscribe(
      data => {
        if (data && data.Data.length) {
          this.offerList = data.Data;
        }
        this.isProcessing = false;
      },
      error => {

      }
    );
  }
  listRoom() {
    this.isProcessing = true;
    this.departmentList = [];
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
  
  viewTabDetail(key: string, index: number) {
    for (let i = 0; i < this.tabs.length; i++) {
      this.tabs[i].IsActive = false;
    }
    this.tabs[index].IsActive = true;

    this.currentTab = key;
    this._title.setTitle(this.hotelData.Name +' : ' + this.tabs[index].tabName);
  }
  backtoNextPage() {
    this.popupVisibility = false;
    if (this.popuptype == 2) {
      this.viewTabDetail('Offers', 2);
    }
    else {
      this.viewTabDetail('Feedback', 1);
    }

  }

  saveServiceRequest() {
    // this.saveSuccess =false;
    // this.isCreateVisible = false;
    // this.isProcessing = false;
    // this.responseMessage = "Oops!!! Invalid room number";
    // if(1){
    //   return
    // }
    // console.log(this.serviceList);
    //   if(1){
    //   return
    // }
    let serviceRequest: any[] = [];
    for (let m of this.serviceList) {
      for (let rq of m.requests) {
        if (rq.IsChecked) {
          serviceRequest.push({
            "departmentCode": m.departmentCode,
            "request": rq.requestName,
            "requestCode": rq.requestCode
          });
        }
      }
    }
    let json = {
      "createdByName": this.queryData.l,
      "hotelCode": this.queryData.p,
      "isRequestRelatedToRoom": true,
      "isRequestedbyGuest": true,
      "loginUserId": this.queryData.e,
      "roomNumber": this.roomData.RoomNumber,
      "serviceRequests": serviceRequest
    };
    this.isProcessing = true;
    this.commonService.PostMethod("servicetransactions/savewithflrinfo", json, "Datahub").subscribe(
      data => {
        // console.log(data);
        // this.saveSuccess =true;
        // this.isCreateVisible = false;
        this.responseMessage = "Request Sent Successfully ";
        this.popuptype = 1;
        this.isProcessing = false;

        this.popupVisibility = true;

      },
      error => {
        this.saveSuccess = false;
        this.isCreateVisible = false;
        this.isProcessing = false;
        this.responseMessage = "Oops!!! Invalid room number";
      }
    );
  }
  /*currentTab: string = "ServiceRequest";
  tabs: any = [{
    "tabName": "Service Request",
    "tabKey": "ServiceRequest",
    "IsActive": true
  },
  {
    "tabName": "Feedback",
    "tabKey": "Feedback",
    "IsActive": false
  },
  {

    "tabName": "Offers",
    "tabKey": "Offers",
    "IsActive": false
  }];*/
  loadTab(type: string) {
    if (type == 'left') {
      if (this.currentTab == 'Offers') return;
      if (this.currentTab == 'ServiceRequest') {

        this.viewTabDetail('Feedback', 1);
      } else if (this.currentTab == 'Feedback') {

        this.viewTabDetail('Offers', 2);
      }
    }
    else {
      if (this.currentTab == 'ServiceRequest') return;
      if (this.currentTab == 'Offers') {
        this.viewTabDetail('Feedback', 1);

      } else if (this.currentTab == 'Feedback') {
        this.viewTabDetail('ServiceRequest', 0);
      }
    }
  }


  updateRating(rating) {
    if (this.currentRating == rating) {
      this.isRated = false;
      this.currentRating = 0;
      return
    }
    this.currentRating = rating;
    this.isRated = true;

  }
  updateTempRating(m) {
    this.tempRating = m
  }
  updateActual() {
    this.tempRating = this.currentRating;
  }
  validateText(){
    if(this.feedback.trim().length < 2){
      this.feedbackTextError = true;
    }
    else {
      this.feedbackTextError = false;
    }
  }
  saveFeedback() {
    // console.log(this.selectedDepartment,typeof this.selectedDepartment);
    if(this.selectedDepartment == 'Select Department'){
      this.departmentError = true;
      return;
    }
    if(this.feedback.trim().length < 2){
      this.feedbackTextError = true;
      return;
    }
    
    // if (!this.isRated) {
    //   this.error = true;
    //   return;
    // }
    this.isProcessing = true;


    let serverJson = {
      "GuestVisitID":0,
      "PmsCustCode": this.queryData.p,
      "GuestCode": this.queryData.g,
      "FeedbackRating": this.currentRating,
      "FeedbackText": this.feedback,
      "DepartmentCode": this.selectedDepartment,
      "DepartmentName": this.departmentNameByCode(this.selectedDepartment),
      "RoomNumber": this.roomData.RoomNumber,
      "FeedbackType":"DuringStay",
      "ReservationNumber":this.queryData.resno,
      "LoginID": this.queryData.e
    };

    this.isProcessing = true;
    this.commonService.PostMethod("Guest/GuestFeedback/", serverJson).subscribe(
      data => {
        // this.isCreateVisible = false;
        // this.isProcessing = false;
        this.isProcessing = false;
        this.popuptype = 2;
        this.responseMessage = "Feedback Sent Successfully ";
        this.popupVisibility = true;
      }
    );

  }
  departmentNameByCode(Code) {
    for (let m of this.departmentList) {
      if (m.DepartmentCode == Code) {
        return m.DepartmentName;
      }
    }
    return '';
  }


}
