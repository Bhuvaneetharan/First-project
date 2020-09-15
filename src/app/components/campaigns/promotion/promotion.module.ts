import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// ROUTERS
import { RouterModule, Routes } from '@angular/router';

// SHARED
import { SharedModule } from '../../../common/shared/shared.module';
// SERVICES
import { CampaignsService } from '../campaigns.service';
// CK EDITOR
import { CKEditorModule } from 'ng2-ckeditor';
import { NotifierModule } from 'angular-notifier';
import { ListPromotionComponent } from './list-promotion/list-promotion.component';
import { CreatePromotionComponent } from './create-promotion/create-promotion.component';

const routes: Routes = [
  {path: 'createpromotion', component : CreatePromotionComponent},
  {path: 'promotionlist', component : ListPromotionComponent},
];
@NgModule({
  declarations: [ListPromotionComponent, CreatePromotionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    CKEditorModule,
    NotifierModule.withConfig( {
      position: {
        horizontal: {
          position: 'middle',
          // distance: 12
        },
        vertical: {
          position: 'top',
          // distance: 12,
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
  ],
  exports: [RouterModule],
  providers: [CampaignsService]
})
export class PromotionModule { }
