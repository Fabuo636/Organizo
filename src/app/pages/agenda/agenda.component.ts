import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AgendaComponent implements OnInit {
  currentDate: Date = new Date();
  selectedDate: Date = new Date();
  weekDays: string[] = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  calendar: (number | null)[][] = [];
  searchText: string = '';

  constructor() {
    this.generateCalendar();
  }

  ngOnInit(): void {}

  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Premier jour du mois
    const firstDay = new Date(year, month, 1);
    // Dernier jour du mois
    const lastDay = new Date(year, month + 1, 0);

    // Initialiser le calendrier
    this.calendar = [];
    let week: (number | null)[] = [];

    // Ajouter les jours vides du début
    for (let i = 0; i < firstDay.getDay(); i++) {
      week.push(null);
    }

    // Ajouter les jours du mois
    for (let day = 1; day <= lastDay.getDate(); day++) {
      week.push(day);
      if (week.length === 7) {
        this.calendar.push(week);
        week = [];
      }
    }

    // Compléter la dernière semaine si nécessaire
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      this.calendar.push(week);
    }
  }

  previousMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
    this.generateCalendar();
  }

  selectDate(day: number | null): void {
    if (day !== null) {
      this.selectedDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        day
      );
    }
  }

  isSelectedDate(day: number | null): boolean {
    if (day === null) return false;
    
    return (
      this.selectedDate.getDate() === day &&
      this.selectedDate.getMonth() === this.currentDate.getMonth() &&
      this.selectedDate.getFullYear() === this.currentDate.getFullYear()
    );
  }

  getMonthName(): string {
    return this.currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
  }
}
