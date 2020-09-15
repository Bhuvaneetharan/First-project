import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ROUTERS
import { RouterModule, Routes } from '@angular/router';

// COMPONENT
import { AddCampaignsComponent,Ckeditor } from './add-campaigns/add-campaigns.component';

// SHARED
import { SharedModule } from '../../../common/shared/shared.module';
import { ListCampaignsComponent } from './list-campaigns/list-campaigns.component';
import { EditCampaignsComponent } from './edit-campaigns/edit-campaigns.component';
import { NotifierModule } from 'angular-notifier';


const routes: Routes = [
  {path: 'addcampaigns', component : AddCampaignsComponent},
  {path: 'listcampaigns', component : ListCampaignsComponent},
  {path: 'editcampaigns/:id', component : EditCampaignsComponent}
];

@NgModule({
  declarations: [AddCampaignsComponent, Ckeditor, ListCampaignsComponent, EditCampaignsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    NotifierModule.withConfig( {
      position: {
        horizontal: {
          position: 'middle',
          distance: 12
        },
        vertical: {
          position: 'top',
          distance: 100,
          // gap: 10
        }
      },
      theme: 'material',
      behaviour: {
        autoHide: 2000,
        onClick: false,
        onMouseover: 'pauseAutoHide',
        showDismissButton: true,
        stacking: 4
      },
      animations: {
        enabled: true,
        show: {
          preset: 'slide',
          speed: 300,
          easing: 'ease'
        },
        hide: {
          preset: 'fade',
          speed: 300,
          easing: 'ease',
          offset: 50
        },
        shift: {
          speed: 300,
          easing: 'ease'
        },
        overlap: 150
      }
    } )
  ],exports: [RouterModule],
  providers: [],
  entryComponents: [Ckeditor]
})
export class CampaignModule { }
