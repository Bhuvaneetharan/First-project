import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

// COMPONENTS
import { AppComponent } from './app.component';
import { NavPanelComponent } from './components/nav-panel/nav-panel.component'

import { AuthenticationService, UserInformationService } from './services'
// import { changePassword} from './components/userprofile/userprofile/userprofile.component';
import { chartComponent } from './components/profitablity-dashboard/profitablity-dashboard/profitablity-dashboard.component';

// HELPERS
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http'
import { ErrorInterceptor } from './helpers/error-interceptor';
import { JwtInterceptor } from './helpers/jwt-interceptor';

// ANIMATION MODULE
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// SHARED MODULE
import { SharedModule } from './common/shared/shared.module';

import { NotifierModule, NotifierOptions } from 'angular-notifier';

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

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    NavPanelComponent,
    chartComponent, 
    
    // changePassword   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    NotifierModule.withConfig(customNotifierOptions),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    AuthenticationService, 
    UserInformationService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    // changePassword,
    chartComponent
  ]

 
})
export class AppModule { }
