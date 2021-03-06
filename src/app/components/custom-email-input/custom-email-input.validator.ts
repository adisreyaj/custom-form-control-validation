import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { catchError, delay, map, of, Subject, switchMap, tap } from 'rxjs';
import { CustomEmail } from './custom-email-input.interface';

/**
 * This method here does the validation. It gets called when the input changes.
 */
export const getCustomEmailValidator =
  (email$: Subject<CustomEmail>, loading$: Subject<boolean>): AsyncValidatorFn =>
  (control) => {
    const { value, dirty } = control;
    const { username, domain } = value;
    if (dirty && username && domain) {
      email$.next({ username, domain });
      return email$.pipe(
        tap(() => {
          loading$.next(true);
        }),
        switchMap(() => {
          return getUsernameAvailability(domain, username).pipe(
            map((isAvailable) => (isAvailable ? null : { email: 'Email already exists.' })),
          );
        }),
        tap(() => {
          loading$.next(false);
        }),
        catchError(() => {
          loading$.next(false);
          return of(null);
        }),
      );
    }

    return of(null);
  };

const ALPHABETS_NUMBERS_DOT_REGEX = new RegExp('^[a-zA-Z0-9]*$');
export const getCustomUsernameValidator: ValidatorFn = (control) => {
  const { value, dirty } = control;
  const { username, domain } = value;
  if (dirty && username && domain) {
    const isValid = ALPHABETS_NUMBERS_DOT_REGEX.test(username);
    return isValid ? null : { email: 'Username can only contain numbers & alphabets.' };
  } else {
    return null;
  }
};

/**
 * Mocking API call for checking username availability.
 */
function getUsernameAvailability(domain: any, username: any) {
  const used: Record<string, string[]> = {
    'adi.so': ['john', 'jane'],
    'sreyaj.dev': [],
  };
  console.log(`Fake API call made.`);
  const isUsernameAvailable = used[domain].indexOf(username) === -1;
  return of(isUsernameAvailable).pipe(delay(1000));
}
