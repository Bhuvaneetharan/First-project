import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report/report.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../common/shared';

const routes: Routes = [
  {path: '', component:ReportComponent}
];

@NgModule({
  declarations: [ReportComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class ReportsModule { }
