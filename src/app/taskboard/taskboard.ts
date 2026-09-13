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

  members = ['Lucas', 'Nap', 'Lockelan', 'Lisa', 'Julia', 'Devan', 'Mike', 'Justine', 'Logan', 'Anyone'];

  newTask: Task = {
    title: '',
    description: '',
    creator: '',
    assignee: '',
    priority: 5,
    deadline: '2050-12-31',
    status: 'todo'
  };

  constructor(private taskboardApi: TaskboardApi) {}

  sortBy: string = 'priority';
  sortDirection: 'asc' | 'desc' = 'desc';

  ngOnInit() {
    this.loadTasks();
  }

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
          valA = new Date(a.deadline).getTime() || 0;
          valB = new Date(b.deadline).getTime() || 0;
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

  async loadTasks() {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.taskboardApi.getTasks().subscribe({
      next: (tasks) => this.tasks = tasks,
      error: () => this.errorMessage = 'Failed to load tasks.'
    });
    this.sortTasks(this.tasks);
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
          deadline: '2050-12-31',
          status: 'todo'
        };
      },
      error: () => this.errorMessage = 'Failed to create task.'
    });
  }

  editingTask?: Task;

  editTask(task: Task) {
    this.editingTask = {
      ...task,
      deadline: new Date(task.deadline).toISOString().split('T')[0]
    };
    this.showForm = false;
  }

  cancelEdit() {
    this.editingTask = undefined;
  }

  saveEdit() {
    if (!this.editingTask) return;
    this.taskboardApi.updateTask(this.editingTask).subscribe({
      next: () => {
        this.tasks = this.tasks.map(t =>
          t._id === this.editingTask!._id ? { ...this.editingTask! } : t
        );
        this.editingTask = undefined;
      },
      error: () => this.errorMessage = 'Failed to update task.'
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


