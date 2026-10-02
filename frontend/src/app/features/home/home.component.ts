import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowRight, Brain, Target, Users, Zap, ShieldCheck } from 'lucide-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // Exponemos los iconos para usarlos en el template
  readonly ArrowRightIcon = ArrowRight;
  readonly BrainIcon = Brain;
  readonly TargetIcon = Target;
  readonly UsersIcon = Users;
  readonly ZapIcon = Zap;
  readonly ShieldIcon = ShieldCheck;

  ngOnInit() {
    // Inicialización del componente (reservado para lógicas on-scroll si fuera necesario)
  }
}
