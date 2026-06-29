import { Component } from '@angular/core';
import { Contact } from '../models/contact';
import { Router } from '@angular/router';
import { ContactApi } from '../services/contact-api';

@Component({
  selector: 'app-contact-form',
  imports: [Router],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactForm {
  contact = {
    email: '',
    phone: '',
    question: '',
  };
  constructor(private contactApi: ContactApi, private router: Router) {}
  errorMessage = '';
  requestSubmitted = false;
  emailRegex = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
  phoneRegex = '^\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}$';
  submitOrder() {
    this.errorMessage = '';
    this.contactApi.submitContact(this.contact).subscribe({
      next: () => {
        this.requestSubmitted = true;
        //this.router.navigate(['/confirmation']);
      },
      error: () => {
        this.errorMessage = 'The contact could not be submitted.';
      }
    });
  }
}
