/*
 ** DO NOT import the SharedModule into your main AppModule or CoreModule.
 **
 ** Import this module into the specific Feature Modules as needed.
 **
 ** This file should contain Dumb/Presentational Components, which should
 ** not expect or interact with any specific form of data.
 */

// angular specific imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// custom imports
import { LoaderComponent } from './components/loader/loader.component';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  imports: [CommonModule],
  declarations: [LoaderComponent, ModalComponent],
  exports: [LoaderComponent, ModalComponent]
})
export class SharedModule {}
