// statebuilder.ts
export interface State {
  errors: Record<string, string[]>;
  message: string;
}

// Fungsi untuk membuat state produk
export const generateState = (inputs: { kolom: string }[]): State => {
  const errors: Record<string, string[]> = {};
  inputs.forEach((input) => {
    errors[input.kolom] = [];
  });
  return { errors, message: '' };
};
