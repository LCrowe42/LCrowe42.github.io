import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  _id?: string;
  title: string;
  description: string;
  creator: string;
  assignee: string;
  priority: number;
  deadline: string;
  status: 'todo' | 'inprogress';
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class TaskboardApi {
  private http = inject(HttpClient);
  private baseUrl = 'https://portfolio-server-mauve-five.vercel.app/api';

  login(password: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/taskboard/login`, { password });
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/tasks`);
  }

  createTask(task: Task): Observable<{ message: string; taskId: string }> {
    return this.http.post<{ message: string; taskId: string }>(`${this.baseUrl}/tasks`, task);
  }

  updateStatus(id: string, status: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.baseUrl}/tasks/${id}`, { status });
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/tasks/${id}`);
  }

  updateTask(task: Task): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.baseUrl}/tasks/${task._id}`, task);
  }
}
