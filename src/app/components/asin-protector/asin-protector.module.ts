import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsinProtectorComponent, DialogOverviewExampleDialog } from './asin-protector/asin-protector.component';
import { RouterModule, Routes } from '@angular/router';
import { AsinProtectorService } from './asin-protector.service';
// SHARED
import { SharedModule } from '../../common/shared/shared.module'

const routes: Routes = [
  { path: '', component: AsinProtectorComponent }
];

@NgModule({
  declarations: [AsinProtectorComponent, DialogOverviewExampleDialog],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  providers:[AsinProtectorService],
  entryComponents:[DialogOverviewExampleDialog]
})
export class AsinProtectorModule { }
