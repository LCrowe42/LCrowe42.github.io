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

  members = ['Lucas', 'Nap', 'Lockelan', 'Lisa', 'Julia', 'Devan', 'Mike', 'Justine', 'Logan'];

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

  sortBy: string = 'priority';
sortDirection: 'asc' | 'desc' = 'desc';

setSort(field: string) {
  if (this.sortBy === field) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortBy = field;
    this.sortDirection = field === 'priority' ? 'desc' : 'asc';
  }
}

sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    let valA: any;
    let valB: any;

    switch (this.sortBy) {
      case 'priority':
        valA = a.priority;
        valB = b.priority;
        break;
      case 'deadline':
        valA = new Date(a.deadline).getTime();
        valB = new Date(b.deadline).getTime();
        break;
      case 'creator':
        valA = a.creator.toLowerCase();
        valB = b.creator.toLowerCase();
        break;
      case 'assignee':
        valA = a.assignee.toLowerCase();
        valB = b.assignee.toLowerCase();
        break;
      default:
        return 0;
    }

    if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
}

get todoTasks() {
  return this.sortTasks(this.tasks.filter(t => t.status === 'todo'));
}

get inProgressTasks() {
  return this.sortTasks(this.tasks.filter(t => t.status === 'inprogress'));
}

  loadTasks() {
    this.taskboardApi.getTasks().subscribe({
      next: (tasks) => this.tasks = tasks,
      error: () => this.errorMessage = 'Failed to load tasks.'
    });
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


