import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskboardApi, Task } from '../services/taskboard-api';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-taskboard',
  imports: [FormsModule, CommonModule, DatePipe],
  templateUrl: './taskboard.html',
  styleUrl: './taskboard.css'
})
export class Taskboard implements OnInit {
  tasks: Task[] = [];
  errorMessage = '';
  showForm = false;

  members = ['Person 1', 'Person 2', 'Person 3']; // replace with household names

  newTask: Task = {
    title: '',
    description: '',
    creator: '',
    assignee: '',
    priority: 5,
    deadline: '',
    status: 'todo'
  };

  constructor(private taskboardApi: TaskboardApi) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskboardApi.getTasks().subscribe({
      next: (tasks) => this.tasks = tasks,
      error: () => this.errorMessage = 'Failed to load tasks.'
    });
  }

  get todoTasks() {
    return this.tasks.filter(t => t.status === 'todo');
  }

  get inProgressTasks() {
    return this.tasks.filter(t => t.status === 'inprogress');
  }

  markInProgress(task: Task) {
    this.taskboardApi.updateStatus(task._id!, 'inprogress').subscribe({
      next: () => task.status = 'inprogress',
      error: () => this.errorMessage = 'Failed to update task.'
    });
  }

  markComplete(task: Task) {
    this.taskboardApi.deleteTask(task._id!).subscribe({
      next: () => this.tasks = this.tasks.filter(t => t._id !== task._id),
      error: () => this.errorMessage = 'Failed to delete task.'
    });
  }

  submitTask() {
    this.taskboardApi.createTask(this.newTask).subscribe({
      next: () => {
        this.loadTasks();
        this.showForm = false;
        this.newTask = {
          title: '',
          description: '',
          creator: '',
          assignee: '',
          priority: 5,
          deadline: '',
          status: 'todo'
        };
      },
      error: () => this.errorMessage = 'Failed to create task.'
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.errorMessage = '';
  }

  priorityColor(priority: number): string {
    if (priority >= 8) return '#fd5825';
    if (priority >= 5) return '#3fabaf';
    return '#888';
  }
}
