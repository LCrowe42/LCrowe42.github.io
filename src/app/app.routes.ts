import { Routes } from '@angular/router';
import { Home } from './home/home';
import { ContactForm } from './contact-form/contact-form';
import { Projects } from './projects/projects';
import { About } from './about/about';

export const routes: Routes = [
  { path: '', component: Home, title: 'Place Request' },
  { path: 'contact', component: ContactForm, title: 'Contact'},
  { path: 'projects', component: Projects, title: 'Projects'},
  { path: 'about', component: About, title: 'About' }
];
