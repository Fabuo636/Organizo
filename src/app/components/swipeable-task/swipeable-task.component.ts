import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-swipeable-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './swipeable-task.component.html',
  styleUrls: ['./swipeable-task.component.scss']
})
export class SwipeableTaskComponent {
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @ViewChild('taskContent') taskContent!: ElementRef;

  private startX: number = 0;
  private currentX: number = 0;
  private isDragging: boolean = false;
  private readonly threshold: number = 50;

  // Gestion des événements tactiles
  onTouchStart(event: TouchEvent) {
    this.startDrag(event.touches[0].clientX);
  }

  onTouchMove(event: TouchEvent) {
    if (!this.isDragging) return;
    this.updateDrag(event.touches[0].clientX);
  }

  onTouchEnd() {
    this.endDrag();
  }

  // Gestion des événements souris
  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    this.startDrag(event.clientX);
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    event.preventDefault();
    this.updateDrag(event.clientX);
  }

  onMouseUp() {
    this.endDrag();
  }

  onMouseLeave() {
    if (this.isDragging) {
      this.endDrag();
    }
  }

  private startDrag(clientX: number) {
    this.startX = clientX;
    this.isDragging = true;
  }

  private updateDrag(clientX: number) {
    const diff = clientX - this.startX;
    
    // Limiter le swipe vers la gauche uniquement et à -100px maximum
    if (diff < 0) {
      this.currentX = Math.max(diff, -100);
      this.updateTransform();
      this.updateButtonsVisibility();
    }
  }

  private endDrag() {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    
    // Si on a dépassé le seuil, on maintient les boutons visibles
    if (Math.abs(this.currentX) > this.threshold) {
      this.currentX = -100;
      this.updateButtonsVisibility(true);
    } else {
      this.currentX = 0;
      this.updateButtonsVisibility(false);
    }
    
    this.updateTransform();
  }

  private updateTransform() {
    if (this.taskContent) {
      this.taskContent.nativeElement.style.transform = `translateX(${this.currentX}px)`;
    }
  }

  private updateButtonsVisibility(show?: boolean) {
    if (this.taskContent) {
      const parent = this.taskContent.nativeElement.parentElement;
      if (show === undefined) {
        // Pendant le drag, on montre les boutons proportionnellement au swipe
        const ratio = Math.abs(this.currentX) / 100;
        parent.classList.toggle('show-buttons', ratio > 0);
      } else {
        // À la fin du drag, on montre ou cache complètement les boutons
        parent.classList.toggle('show-buttons', show);
      }
    }
  }

  onEdit() {
    this.edit.emit();
    this.resetPosition();
  }

  onDelete() {
    this.delete.emit();
    this.resetPosition();
  }

  private resetPosition() {
    this.currentX = 0;
    this.updateTransform();
  }
}
