import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckComponent } from '../../components/check/check.component';
import { SwipeableTaskComponent } from '../../components/swipeable-task/swipeable-task.component';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  category: string;
  date: string;
  time: string;
  priority: 'forte' | 'moyenne' | 'faible';
  status: 'en_cours' | 'terminée';
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, CheckComponent, SwipeableTaskComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  currentDate = new Date();
  tasks: Task[] = [
    {
      id: 1,
      title: "JUNIORQ",
      completed: false,
      category: "Bébé",
      date: "18/03/2025",
      time: "18:10:00",
      priority: "forte",
      status: "en_cours"
    },
    {
      id: 2,
      title: "Réunion équipe marketing",
      completed: true,
      category: "Travail",
      date: "25/04/2025",
      time: "14:30:00",
      priority: "moyenne",
      status: "terminée"
    },
    {
      id: 3,
      title: "Acheter des fruits",
      completed: false,
      category: "Courses",
      date: "25/04/2025",
      time: "17:00:00",
      priority: "faible",
      status: "en_cours"
    }
  ];

  searchTerm: string = '';

  toggleTask(taskId: number) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      task.status = task.completed ? 'terminée' : 'en_cours';
    }
  }

  editTask(taskId: number) {
    console.log('Édition de la tâche:', taskId);
    // Logique d'édition à implémenter
  }

  deleteTask(taskId: number) {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
  }
}
