import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactApi {
  private http = inject(HttpClient);
  private apiUrl = 'https://portfolio-server-mauve-five.vercel.app/contacts';
  submitContact(contact: Contact): Observable<{ message: string; contactId: string }> {
    return this.http.post<{ message: string; contactId: string }>(this.apiUrl, contact);
  }
  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiUrl);
  }
  getContactById(id: string): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/${id}`);
  }
  deleteContact(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  markComplete(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, {});
  }
}
