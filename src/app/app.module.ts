import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ModalModule } from './components/modal/modal.module';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, ModalModule, DragDropModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
