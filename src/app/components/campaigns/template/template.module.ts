import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditTemplateComponent } from './edit-template/edit-template.component';
import { TemplateListComponent } from './template-list/template-list.component';
import { CreateTemplateComponent } from './create-template/create-template.component';
// ROUTERS
import { RouterModule, Routes } from '@angular/router';

// SHARED
import { SharedModule } from '../../../common/shared/shared.module';
// SERVICES
import { CampaignsService } from '../campaigns.service';
// CK EDITOR
import { CKEditorModule } from 'ng2-ckeditor';
import { NotifierModule } from 'angular-notifier';

const routes: Routes = [
  {path: 'createtemplate', component : CreateTemplateComponent},
  {path: 'templatelist', component : TemplateListComponent},
  {path: 'edittemplate/:id', component : EditTemplateComponent}
];

@NgModule({
  declarations: [EditTemplateComponent, TemplateListComponent, CreateTemplateComponent],
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
export class TemplateModule { }
