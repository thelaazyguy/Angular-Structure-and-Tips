/*
 ** DO NOT import the CoreModule into any Feature Module of your app.
 ** Import this CoreModule into only AppModule.
 **
 ** This file should contain important single use components/classes
 ** global/HTTP services.
 **
 ** This file also be used to export any third party module that is
 ** required in the AppModule.
 */

// angular related imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// custom imports
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  imports: [CommonModule],
  declarations: [HeaderComponent, FooterComponent],
  exports: [HeaderComponent, FooterComponent]
})
export class CoreModule {}
