interface InputField {
    kolom: string;
}

interface State {
    errors?: {
        [key: string]: string[];
    };
    message?: string | null;
}

export function buildInitialState(inputFields: InputField[]): State {
    const errors: { [key: string]: string[] } = {};

    inputFields.forEach((field) => {
        errors[field.kolom] = [];
    });

    return {
        errors,
        message: null,
    };
}