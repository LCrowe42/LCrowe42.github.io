import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact';

@Service()
export class ContactApi {
  private http = inject(HttpClient);
  private apiUrl = 'https://portfolio-server-2huucdh3f-lcrowe42s-projects.vercel.app/';
  submitRequest(contact: Contact): Observable<{ message: string; contactId: string }> {
    return this.http.post<{ message: string; contactId: string }>(this.apiUrl, contact);
  }
  getRequests(): Observable<Request[]> {
    return this.http.get<Request[]>(this.apiUrl);
  }
  getRequestById(id: string): Observable<Request> {
    return this.http.get<Request>(`${this.apiUrl}/${id}`);
  }
  deleteRequest(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  markComplete(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, {});
  }
}
