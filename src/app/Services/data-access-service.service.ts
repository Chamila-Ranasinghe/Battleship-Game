import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataAccessServiceService {

  constructor(private httpClient: HttpClient) { }

  GET(resUrl, callback) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    this.httpClient.get(resUrl, { headers }).subscribe(
      data => {
        callback(data);
      },
      error => {
        callback(error);
      }
    );
  }

  DELETE(resUrl, callback) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    this.httpClient.delete(resUrl, { headers }).subscribe(
      data => {
        callback(data);
      },
      error => {
        callback(error);
      }
    );
  }

  POST(resUrl: string, params: any, callback) {
    let headers = new HttpHeaders();
    this.httpClient.post(resUrl, params, { headers })
      .subscribe(
        data => {
          callback(data);
        },
        error => {
          callback(error);
        }
      );
  }

  PUT(resUrl: string, params: any, callback) {
    let headers = new HttpHeaders();
    this.httpClient.put(resUrl, params, { headers })
      .subscribe(
        data => {
          callback(data);
        },
        error => {
          callback(error);
        }
      );
  }
}
