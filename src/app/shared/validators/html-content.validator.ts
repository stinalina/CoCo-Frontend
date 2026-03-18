import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const htmlContentValidator = (minLength: number = 1): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    if (!value) {
      return { required: true };
    }

    // Remove HTML tags and decode HTML entities
    const plainText = value
      .replace(/<[^>]*>/g, '') // Remove all HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .trim();

    // Check if plain text is empty or too short
    if (!plainText || plainText.length === 0) {
      return { required: true };
    }

    if (plainText.length < minLength) {
      return { minlength: { requiredLength: minLength, actualLength: plainText.length } };
    }

    return null;
  };
};