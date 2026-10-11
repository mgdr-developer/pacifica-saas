import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, X, Save, Building } from 'lucide-angular';
import { Institute } from '../../../core/models/institute.model';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-institute-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './institute-form.component.html',
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
export class InstituteFormComponent implements OnInit {
  @Input() institute: Institute | null = null;
  @Output() closeDrawer = new EventEmitter<void>();
  @Output() save = new EventEmitter<Partial<Institute>>();

  private fb = inject(FormBuilder);

  // Iconos
  readonly XIcon = X;
  readonly SaveIcon = Save;
  readonly BuildingIcon = Building;

  instituteForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    contactPhone: ['', [Validators.required, Validators.minLength(10)]]
  });

  ngOnInit() {
    if (this.institute) {
      this.instituteForm.patchValue({
        name: this.institute.name,
        contactPhone: this.institute.contactPhone
      });
    }
  }

  onSubmit() {
    if (this.instituteForm.invalid) {
      this.instituteForm.markAllAsTouched();
      return;
    }
    this.save.emit(this.instituteForm.value as Partial<Institute>);
  }
}
