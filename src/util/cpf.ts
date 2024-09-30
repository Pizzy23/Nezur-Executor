import { Injectable } from '@nestjs/common';

@Injectable()
export class CpfVeri {
  firstDigit: number;
  secondDigit: number;
  totalP: number;
  totalS: number;

  private cpfLength(cpf: string): boolean {
    if (cpf.length === 11) {
      return true;
    }
    return false;
  }

  private separator(cpf: string): Array<string> {
    return cpf.split('');
  }
  private digit(cpf: string): void {
    const separatedCpf = this.separator(cpf);
    this.firstDigit = parseInt(separatedCpf[9]);
    this.secondDigit = parseInt(separatedCpf[10]);
  }
  private Accumulator(cpf: string, index: number, finalIndex: number): number {
    const separatedCpf: Array<any> = this.separator(cpf);
    let accumulator: number = 0;
    for (let i = 0; i >= 0; i++) {
      accumulator += separatedCpf[i] * index;
      index--;
      if (i == finalIndex) {
        break;
      }
    }
    return accumulator;
  }

  private result(cpf: string): void {
    const accP: number = this.Accumulator(cpf, 10, 8);
    const calculationP: number = (accP * 10) % 11;
    this.totalP = calculationP === 10 ? 0 : calculationP;

    const accS: number = this.Accumulator(cpf, 11, 9);
    const calculationS: number = (accS * 10) % 11;
    this.totalS = calculationS === 10 ? 0 : calculationS;
  }
  verify(cpf: string): boolean {
    if (this.cpfLength(cpf)) {
      this.digit(cpf);
      this.result(cpf);
      if (
        this.totalP === this.firstDigit &&
        this.totalS === this.secondDigit
      ) {
        return true;
      }
    }
    return false;
  }
}
