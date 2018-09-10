import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { CommonService } from './../shared/common.service'


@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  providers: [CommonService]
  
})
export class FeedbackComponent implements OnInit {
 
  totalRating: number[] = [1, 2, 3, 4, 5];
  currentRating: number = 0;
  tempRating: number = 0;
  feedback: string = "";
  isCreateVisible: boolean = true;
  isRated: boolean = false;
  error: boolean = false;
  isProcessing: boolean = false;
  pageNotFound: boolean = false;
  
  hotelData: any = {
    "FullName": "",
    "Name": "",
    "Logo": ""
  }
  queryData: any = {};
  constructor(private _title: Title,public commonService: CommonService) {
    this.queryData = this.queryParam(window.top.location.href);
    if (this.queryData)
      this.listHotelData();
    else
      this.pageNotFound = true;

  }
  ngOnInit() {
    this._title.setTitle("Customer Feedback");
  }
  listHotelData() {
    this.isProcessing = true;
    this.commonService.GetMethod("hotel-info/" + this.queryData.p, "Admin").subscribe(
      data => {
        if (data && data.Data) {
          this.hotelData.FullName = data.Data.PropertyName;
          this.hotelData.Name = data.Data.PropertyName;
          this.hotelData.Logo = data.Data.ShortLogo;

        }
        else {
          this.pageNotFound = true;
        }
        this.isProcessing = false;
      }
    )
  }
  queryParam(myvar) {
    let urls = myvar;
    let myurls = urls.split("?");
    let queryString = myurls[1];
    if (queryString)
      return JSON.parse('{"' + queryString.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
    else
      return null;
  }

  updateRating(rating) {
    this.currentRating = rating;
    this.isRated = true;

  }
  updateTempRating(m) {
    this.tempRating = m
  }
  updateActual() {
    this.tempRating = this.currentRating;
  }
  saveRating() {

    if (!this.isRated) {
      this.error = true;
      return;
    }
    this.isProcessing = true;
    let serverJson = {
      "PmsCustCode": this.queryData.p,
      "GuestCode": this.queryData.g,
      "FeedbackRating": this.currentRating,
      "FeedbackText": this.feedback
    }
    // "ReservationNumber": this.queryData.r,
    this.isProcessing = true;
    this.commonService.PostMethod("Guest/GuestFeedback/", serverJson).subscribe(
      data => {
        this.isCreateVisible = false;
        this.isProcessing = false;
      }
    );

  }

}