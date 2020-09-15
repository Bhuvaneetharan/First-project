import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentReconcilationComponent } from './payment-reconcilation/payment-reconcilation.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../common/shared';
import { PaymentReconcilationService } from './payment-reconcilation.service';

const routes: Routes = [
  {path: '', component:PaymentReconcilationComponent}
];


@NgModule({
  declarations: [PaymentReconcilationComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  providers: [PaymentReconcilationService],
  exports: [RouterModule]
})
export class PaymentReconcilationModule { }
