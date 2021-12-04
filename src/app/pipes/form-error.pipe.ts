import { NgModule, Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'errorMessage',
})
export class FormErrorMessagePipe implements PipeTransform {
  transform(
    errors: Record<string, string> | null,
    errorMessages: Record<string, string>
  ) {
    if (errors && errorMessages) {
      return Object.keys(errors).map((key) => errorMessages[key]);
    }
    return null;
  }
}

@NgModule({
  declarations: [FormErrorMessagePipe],
  exports: [FormErrorMessagePipe],
})
export class FormErrorPipeModule {}
