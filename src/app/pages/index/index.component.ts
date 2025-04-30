import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  animations: [
    trigger('fadeInUp', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(20px)'
      })),
      transition(':enter', [
        animate('0.6s ease-out', style({
          opacity: 1,
          transform: 'translateY(0)'
        }))
      ])
    ]),
    trigger('floatingDots', [
      state('start', style({ transform: 'translateY(0) scale(1)' })),
      state('end', style({ transform: 'translateY(-15px) scale(1.05)' })),
      transition('start <=> end', [
        animate('3s ease-in-out')
      ])
    ])
  ]
})
export class IndexComponent implements OnInit {
  dots = Array(20).fill(0).map((_, i) => ({
    id: i,
    state: 'start',
    delay: Math.random() * 3000,
    top: Math.random() * 80 + 10 + '%',
    left: Math.random() * 80 + 10 + '%',
    size: this.getRandomSize(),
    color: `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.2})`
  }));

  private getRandomSize(): string {
    const sizes = [
      { chance: 0.5, range: [4, 8] },     // 50% de très petites bulles
      { chance: 0.3, range: [9, 15] },    // 30% de petites bulles
      { chance: 0.2, range: [16, 25] }    // 20% de moyennes bulles
    ];
    
    const rand = Math.random();
    let accumulatedChance = 0;
    
    for (const size of sizes) {
      accumulatedChance += size.chance;
      if (rand <= accumulatedChance) {
        const [min, max] = size.range;
        return Math.floor(Math.random() * (max - min) + min) + 'px';
      }
    }
    
    return '6px'; // Taille par défaut
  }

  ngOnInit() {
    this.dots.forEach(dot => {
      setTimeout(() => {
        this.animateDot(dot);
      }, dot.delay);
    });
  }

  animateDot(dot: any) {
    dot.state = dot.state === 'start' ? 'end' : 'start';
    setTimeout(() => {
      this.animateDot(dot);
    }, 3000);
  }
}
