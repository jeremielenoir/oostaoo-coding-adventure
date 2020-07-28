import { FormControl, Validators } from '@angular/forms';

export class FormCampagneValidator {

    private static sMessageError = '';
    private roleValidator: FormControl;
    private technoValidator: FormControl;
    private ExperienceValidator: FormControl;

    public static get _sMessageError(): string {
        return this.sMessageError;
    }

    public static startVerificationFrom(): void {
        this.sMessageError = '';
    }

    public static validateRole(p_sRole: string): boolean {
        if (p_sRole && p_sRole.trim() !== '') {
            return true;
        } else {
            this.sMessageError = 'Merci de selectionner un rôle.';
            return false;
        }
    }

    public static validateExprience(p_sExperience: string): boolean {
        if (p_sExperience && p_sExperience.trim() !== '') {
            return true;
        } else {
            this.sMessageError = 'Merci de selectionner une expérience.';
            return false;
        }
    }
    public static validateTechno(p_sTabTechno: string[]): boolean {
        if (p_sTabTechno && p_sTabTechno.length > 0) {
            return true;
        } else {
            this.sMessageError = 'Merci de selectionner un rôle';
            return false;
        }
    }

    public getRoleValidator(p_sStartValue: string = ''): FormControl {
        this.roleValidator = new FormControl(p_sStartValue, [Validators.required]);
        return this.roleValidator;
    }

    public getTechnoValidator(p_sTabStartValue: string[] = []): FormControl {
        this.technoValidator = new FormControl(p_sTabStartValue, [Validators.required]);
        return this.technoValidator;
    }

    public getExperienceValidator(p_sStartValue: string = ''): FormControl {
        this.ExperienceValidator = new FormControl(p_sStartValue, [Validators.required]);
        return this.ExperienceValidator;
    }
}
