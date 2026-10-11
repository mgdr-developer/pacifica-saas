import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogRef } from '@angular/cdk/dialog';
import { LucideAngularModule, AlertTriangle, Info, AlertCircle, X } from 'lucide-angular';
import { MODAL_DATA, ConfirmModalData } from '../../../core/models/modal.model';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent {
  readonly AlertTriangleIcon = AlertTriangle;
  readonly InfoIcon = Info;
  readonly AlertCircleIcon = AlertCircle;
  readonly XIcon = X;

  constructor(
    public dialogRef: DialogRef<boolean>,
    @Inject(MODAL_DATA) public data: ConfirmModalData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
