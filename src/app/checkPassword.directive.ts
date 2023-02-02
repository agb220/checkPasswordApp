import { Directive } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';

function checkPassword(): ValidatorFn {
  return (control: AbstractControl) => {
    let strength = 0;

    console.log('test');
    let isValid = false;
    let group = control as FormGroup;
    console.log('group', group);
    if (
      control &&
      control instanceof FormGroup &&
      group.controls['passwordControl']
    ) {
      const value = group.controls['passwordControl'].value;

      if (!value || value === undefined) {
        return { strength: null };
      }

      if (!value || value.length < 8) {
        return { strength: 0 };
      }

      console.log('value', value);
      const containsDigits = /\d+/.test(value);
      const containsLetters = /[a-zA-Z]/.test(value);
      const containsSymbols = /[^a-zA-Z0-9]/.test(value);
      console.log(
        'containsSymbols',
        containsSymbols,
        'containsLetters',
        containsLetters,
        'containsDigits',
        containsDigits
      );
      return {
        strength: [containsDigits, containsLetters, containsSymbols].filter(
          (item) => item
        ).length,
      };
    }

    return {
      strength: 0,
    };
  };
}

@Directive({
  selector: '[appCheckPassword]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: CheckPasswordDirective,
      multi: true,
    },
  ],
})
export class CheckPasswordDirective implements Validator {
  private valFn;

  constructor() {
    this.valFn = checkPassword();
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this.valFn(c);
  }
}
