import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: ` <footer
    class="absolute w-full bottom-0 left-0 h-10 flex justify-between px-4 md:px-10 items-center"
  >
    <a href="https://adi.so" class="flex space-x-1 font-semibold">
      <img src="assets/adi.svg" alt="Adi.so" />
      <p class="text-sm">adi.so</p>
    </a>
    <a href="https://twitter.com/Adisreyaj" class="flex items-center">
      <img src="assets/twitter.svg" alt="Twitter" class="w-5 h-5" />
      <p>@Adisreyaj</p>
    </a>
  </footer>`,
})
export class FooterComponent {}

@NgModule({
  declarations: [FooterComponent],
  imports: [CommonModule],
  exports: [FooterComponent],
})
export class FooterModule {}
