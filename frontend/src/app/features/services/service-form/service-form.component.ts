import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, X, Save, Layers } from 'lucide-angular';
import { ServiceItem } from '../../../core/models/service.model';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class ServiceFormComponent implements OnInit {
  @Input() service: ServiceItem | null = null;
  @Output() closeDrawer = new EventEmitter<void>();
  @Output() save = new EventEmitter<Partial<ServiceItem>>();

  private fb = inject(FormBuilder);

  // Iconos
  readonly XIcon = X;
  readonly SaveIcon = Save;
  readonly LayersIcon = Layers;

  serviceForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
  });

  ngOnInit() {
    if (this.service) {
      this.serviceForm.patchValue({
        name: this.service.name
      });
    }
  }

  onSubmit() {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }
    this.save.emit(this.serviceForm.value as Partial<ServiceItem>);
  }
}
