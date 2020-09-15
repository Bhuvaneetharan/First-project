import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// MATERIAL
import {  
  MatBottomSheetModule, 
  MatSnackBarModule, 
  MatButtonModule,
  MatCheckboxModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatTabsModule,
  MatToolbarModule,
  MatSidenavModule,
  MatChipsModule,
  MatCardModule,
  MatInputModule,
  MatProgressBarModule,
  MatDialogModule,
  MatIconModule,
  MatMenuModule,
  MatAutocompleteModule,
  MatTableModule,
  MatSelectModule,
  MatBadgeModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatExpansionModule,
  MatTooltipModule,
  MatButtonToggleModule,
  MatGridListModule,
  MatStepperModule
} from '@angular/material';
import {MatSortModule} from '@angular/material/sort';

import {MatPaginatorModule} from '@angular/material/paginator';

// DATERANGEPICKER
import { CKEditorModule } from 'ng2-ckeditor';

import { DateRangePickerModule, DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';

import { DatePipe } from '@angular/common';

// HIGHCARTS
import { ChartModule } from 'angular-highcharts';

import {ScrollingModule} from '@angular/cdk/scrolling';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { KeyPress } from './keypress'
import { SnackBar } from './snackBar'
import { Patterns } from './patterns';
import { ExcelService } from './excel.service'
import { BottomSheetComponent } from './bottom-sheet/bottom-sheet.component';
import { DialogComponent } from './dialogs/dialog/dialog.component'
import { DialogsService } from './dialogs/dialog/dialogs.service'
import { RatingModule } from 'ng-starrating';
import { AsinsComponent } from './dialogs/asins/asins.component';
import { TemplateDialogComponent } from './dialogs/template-dialog/template-dialog.component';
import { CampaignSendToComponent } from './dialogs/campaign-send-to/campaign-send-to.component';
import { DeleteDialogComponent } from './dialogs/delete-dialog/delete-dialog.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { PriviewComponent } from './dialogs/priview/priview.component';
import { PreviewService } from './dialogs/priview/preview.service';
import { TemplateDialogService } from './dialogs/template-dialog/template-dialog.service';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { CkeditorTagsComponent } from './dialogs/ckeditor-tags/ckeditor-tags.component';

const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'middle',
			distance: 0
		},
		vertical: {
			position: 'top',
			distance: 100,
			gap: 10
		}
	},
  theme: 'material',
  behaviour: {
    autoHide: 2000,
    onClick: 'hide',
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
};
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
  declarations: [BottomSheetComponent, DialogComponent, AsinsComponent, TemplateDialogComponent, CampaignSendToComponent, DeleteDialogComponent, PriviewComponent, CkeditorTagsComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatChipsModule,
    MatCardModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    FormsModule,
    MatIconModule,
    CKEditorModule,
    MatProgressBarModule,
    MatBottomSheetModule,
    ScrollingModule,
    ChartModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSortModule,
    MatTableModule,
    RatingModule,
    MatSelectModule,
    DateRangePickerModule,
    DateTimePickerModule,
    MatBadgeModule,
    ClickOutsideModule,
    MatDatepickerModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatGridListModule,
    MatStepperModule,
    // NgxMaterialTimepickerModule,
    MatExpansionModule,
    NotifierModule.withConfig(customNotifierOptions),
    TranslateModule
  ],
  providers:[ExcelService,DatePipe, KeyPress, SnackBar, Patterns, DialogsService, PreviewService, TemplateDialogService],
  entryComponents : [BottomSheetComponent, DialogComponent, AsinsComponent, TemplateDialogComponent, CampaignSendToComponent,DeleteDialogComponent, PriviewComponent, CkeditorTagsComponent],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatChipsModule,
    MatPaginatorModule,
    MatCardModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    FormsModule,
    MatMenuModule,
    MatIconModule,
    MatProgressBarModule,
    MatBottomSheetModule,
    ScrollingModule,
    BottomSheetComponent,
    ChartModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatTableModule,
    RatingModule,
    CKEditorModule,
    MatSelectModule,
    DateRangePickerModule,
    DateTimePickerModule,
    MatBadgeModule,
    ClickOutsideModule,
    MatTooltipModule,
    PriviewComponent,
    MatDatepickerModule,
    MatSortModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatGridListModule,
    MatStepperModule,
    TranslateModule
    // NgxMaterialTimepickerModule
  ],
  
})
export class SharedModule { }
