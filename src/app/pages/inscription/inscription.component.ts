import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AuthService } from '../../services/auth.service';

interface Dot {
  id: number;
  state: string;
  delay: number;
  top: string;
  left: string;
  size: string;
  color: string;
}

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss'],
  animations: [
    trigger('floatingDots', [
      state('start', style({ transform: 'translateY(0) scale(1)' })),
      state('end', style({ transform: 'translateY(-15px) scale(1.05)' })),
      transition('start <=> end', [
        animate('3s ease-in-out')
      ])
    ])
  ]
})
export class InscriptionComponent implements OnInit {
  userData = {
    nomComplet: '',
    telephone: '',
    email: '',
    motDePasse: ''
  };

  showPassword = false;
  errorMessage = '';
  isLoading = false;

  dots: Dot[] = Array(20).fill(0).map((_, i) => ({
    id: i,
    state: 'start',
    delay: Math.random() * 3000,
    top: Math.random() * 80 + 10 + '%',
    left: Math.random() * 80 + 10 + '%',
    size: this.getRandomSize(),
    color: `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.2})`
  }));

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

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

  animateDot(dot: Dot) {
    dot.state = dot.state === 'start' ? 'end' : 'start';
    setTimeout(() => {
      this.animateDot(dot);
    }, 3000);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';

    const user = {
      username: this.userData.nomComplet,
      email: this.userData.email,
      password: this.userData.motDePasse,
      phone: this.userData.telephone
    };

    this.authService.register(user).subscribe({
      next: (response) => {
        if (response.success) {
          // Redirection vers la page d'accueil après inscription réussie
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = response.message || 'Une erreur est survenue lors de l\'inscription';
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Une erreur est survenue lors de l\'inscription';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
