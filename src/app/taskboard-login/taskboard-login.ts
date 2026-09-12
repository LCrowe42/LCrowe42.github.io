import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskboardApi } from '../services/taskboard-api';

@Component({
  selector: 'app-taskboard-login',
  imports: [FormsModule],
  templateUrl: './taskboard-login.html',
  styleUrl: './taskboard-login.css'
})
export class TaskboardLogin {
  password = '';
  errorMessage = '';
  loading = false;

  constructor(private taskboardApi: TaskboardApi, private router: Router) {}

  submit() {
    this.errorMessage = '';
    this.loading = true;
    this.taskboardApi.login(this.password).subscribe({
      next: () => {
        sessionStorage.setItem('taskboard_auth', 'true');
        this.router.navigate(['/taskboard']);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Incorrect password.';
        this.loading = false;
      }
    });
  }
}
