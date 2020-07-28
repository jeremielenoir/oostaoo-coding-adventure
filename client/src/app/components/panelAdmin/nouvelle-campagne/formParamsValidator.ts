import { FormControl, Validators } from '@angular/forms';

export class FormParamsValidator {

    private static sMessageError = '';
    private nameValidator: FormControl;
    

    public static get _sMessageError(): string {
        return this.sMessageError;
    }

    public static startVerificationFrom(): void {
        this.sMessageError = '';
    }

    public static validateName(name: string): boolean {
        if (name && name.trim() !== '') {
            return true;
        } else {
            this.sMessageError = 'Merci de saisir un nom pour votre test d\'évaluation.';
            return false;
        }
    }

    public getNameValidator(p_sStartValue: string = ''): FormControl {
        this.nameValidator = new FormControl(p_sStartValue, [Validators.required]);
        return this.nameValidator;
    }

}
