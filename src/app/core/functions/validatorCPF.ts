import { AbstractControl, ValidatorFn } from "@angular/forms";

export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const cpf = control.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (!cpf) {
      return null; // Não valida se o campo está vazio (já é tratado pelo Validators.required)
    }
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return { invalidCpf: true }; // CPF inválido se não tem 11 dígitos ou é uma sequência repetida
    }

    // Validação do dígito verificador do CPF
    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.charAt(i - 1)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cpf.charAt(9))) {
      return { invalidCpf: true };
    }

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.charAt(i - 1)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cpf.charAt(10))) {
      return { invalidCpf: true };
    }

    return null; // CPF válido
  };
}
