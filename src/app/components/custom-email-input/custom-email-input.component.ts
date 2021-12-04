import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgModule,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  ViewChild,
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import debounce from 'just-debounce';
import { BehaviorSubject, tap } from 'rxjs';
import { CustomEmail } from './custom-email-input.interface';
import {
  getCustomEmailValidator,
  getCustomUsernameValidator,
} from './custom-email-input.validator';

@Component({
  selector: 'email-selector',
  template: `
    <div class="flex items-center h-10 border-2 shadow-md">
      <input
        type="text"
        class="h-full w-24 px-3 text-right mr-[1.5px]"
        placeholder="john"
        (input)="onUsernameChange($event)"
        (blur)="markAsTouched()"
        #usernameInput
      />
      <div class="bg-gray-200 w-20 h-full grid place-items-center text-xl">@</div>
      <select
        class="h-full w-full bg-white"
        #domainInput
        (change)="onDomainChange($event)"
        (blur)="markAsTouched()"
      >
        <option value="adi.so">adi.so</option>
        <option value="sreyaj.dev">sreyaj.dev</option>
      </select>
    </div>
    <ng-container *ngIf="loading$ | async; else errors">
      <div class="absolute flex items-center space-x-1 text-sm pt-2 text-gray-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          style="margin: auto; background: rgb(255, 255, 255) none repeat scroll 0% 0%; display: block; shape-rendering: auto;"
          width="16px"
          height="16px"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid"
        >
          <circle
            cx="50"
            cy="50"
            fill="none"
            stroke="#e15b64"
            stroke-width="10"
            r="35"
            stroke-dasharray="164.93361431346415 56.97787143782138"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              repeatCount="indefinite"
              dur="1s"
              values="0 50 50;360 50 50"
              keyTimes="0;1"
            ></animateTransform>
          </circle>
        </svg>
        <p>Checking availability...</p>
      </div>
    </ng-container>
    <ng-template #errors>
      <ng-container *ngIf="control?.getError('email') as emailError; else success">
        <span class="absolute text-red-600 text-sm pt-2">{{ control?.getError('email') }}</span>
      </ng-container>
    </ng-template>
    <ng-template #success>
      <span class="absolute text-green-600 text-sm pt-2">Email available.</span>
    </ng-template>
  `,

  changeDetection: ChangeDetectionStrategy.Default,
})
export class CustomEmailSelectorComponent
  implements ControlValueAccessor, OnInit, OnDestroy, AfterViewInit
{
  @Input() domains: string[] = [];

  @ViewChild('usernameInput') usernameInput: ElementRef<HTMLInputElement> | null = null;
  @ViewChild('domainInput') domainInput: ElementRef<HTMLSelectElement> | null = null;

  control: AbstractControl | null = null;
  /**
   * We use the loading subject to show/hide loading indicator
   * as and when the email is being checked.
   */
  loading$ = new BehaviorSubject(false);

  /**
   * To keep a reference to the value
   */
  private email: CustomEmail = {
    username: '',
    domain: '',
  };
  private email$ = new BehaviorSubject<CustomEmail>(this.email);

  private onTouched!: () => void;
  private onChange!: (data: CustomEmail) => void;
  private onChangeDebounced!: (data: CustomEmail) => void;

  /**
   * We have to use this approach instead of providing `NG_VALUE_ACCESSOR` in providers as it
   * will throw circular dependency error.
   *
   * **Reason**:
   * When we inject `NgControl` in the component, Value accessor and validators are injected
   * by `NgControl`.
   *
   * If we tried to provide our component which has injected `NgControl` for `NG_VALUE_ACCESSOR`,
   * when the control tries to resolve the dependency, it will throw circular dependency error.
   *
   * ```ts
   * Comp --> NgControl --> NG_VALUE_ACCESSOR --> Comp --> NgControl
   * ```
   *
   * **Solution**:
   * Remove the `NG_VALUE_ACCESSOR` from providers and inject `NgControl` in the component and
   * provide the `valueAccessor` manually.
   * Same thing applied for `NG_VALIDATORS` and `NG_ASYNC_VALIDATORS` as well.
   */
  constructor(@Optional() @Self() private ngControl: NgControl) {
    if (ngControl) ngControl.valueAccessor = this;
  }

  /**
   * Save the reference of the control and also
   * setup the validators.
   */
  ngOnInit() {
    this.control = this.ngControl.control;
    this.control?.setValidators(getCustomUsernameValidator);
    this.control?.setAsyncValidators(getCustomEmailValidator(this.email$, this.loading$));
    this.control?.updateValueAndValidity();
  }

  ngAfterViewInit() {
    this.email$
      .asObservable()
      .pipe(
        tap((email) => {
          if (this.usernameInput) this.usernameInput.nativeElement.value = email.username;
          if (this.domainInput) this.domainInput.nativeElement.value = email.domain;
        }),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.loading$.complete();
    this.email$.complete();
  }

  writeValue(obj: CustomEmail): void {
    this.email = obj;
    this.email$.next(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.onChangeDebounced = debounce(fn, 500);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * When the user name changes, we call the debounced onChange
   * method to avoid unnecessary API calls.
   */
  onUsernameChange(event: any) {
    this.email.username = event.target?.value;
    this.onChangeDebounced(this.email);
  }

  onDomainChange(event: any) {
    this.email.domain = event.target?.value;
    this.onChange(this.email);
  }

  markAsTouched() {
    this.onTouched();
  }
}

@NgModule({
  declarations: [CustomEmailSelectorComponent],
  exports: [CustomEmailSelectorComponent],
  imports: [CommonModule, FormsModule],
})
export class CustomEmailSelectorModule {}
