import { AbstractControl, ValidationErrors } from "@angular/forms"

export const PasswordStrengthValidator = function (control: AbstractControl): ValidationErrors | null {

  let value: string = control.value || '';

  if (!value) {
    return null
  }

  let upperCaseCharacters = /[A-Z]+/g
  if (upperCaseCharacters.test(value) === false) {
    return { passwordStrength: `Your password should contain atleast 1 uppercase letter [A-Z]` };
  }

  let lowerCaseCharacters = /[a-z]+/g
  if (lowerCaseCharacters.test(value) === false) {
    return { passwordStrength: `Your password should contain atleast 1 lowercase letter [a-z]` };
  }

  let numberCharacters = /[0-9]+/g
  if (numberCharacters.test(value) === false) {
    return { passwordStrength: `Your password should contain atleast 1 number between [0-9]` };
  }

  let specialCharacters = /[!@#$^&_]/
  if (specialCharacters.test(value) === false) {
    return { passwordStrength: `Your password should contain atleast any 1 of the special characters [!@#$^&_]` };
  }
  return null;
}