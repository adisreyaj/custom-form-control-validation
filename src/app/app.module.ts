import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomEmailSelectorModule } from './components/custom-email-input/custom-email-input.component';
import { FooterModule } from './components/footer/footer.component';
import { FormErrorPipeModule } from './pipes/form-error.pipe';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FooterModule,
    ReactiveFormsModule,
    CustomEmailSelectorModule,
    FormErrorPipeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
