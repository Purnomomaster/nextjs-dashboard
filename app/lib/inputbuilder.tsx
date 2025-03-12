export function generateInputs(
  input: any,
  state: any,
  item: any,
  dropdownOptions: { [key: string]: string[] },
) {
  interface Input {
    kolom: string;
    label: string;
    jns: string;
    maxlength?: number;
    readonly?: boolean;
    required?: string;
  }

  interface State {
    errors?: {
      [key: string]: string[];
    };
  }

  interface Item {
    [key: string]: any;
  }

  return input.map((input: Input) => (
    <div className="mb-4" key={input.kolom}>
      <label htmlFor={input.kolom} className="mb-2 block text-sm font-medium">
        {input.label}
      </label>
      {input.jns === 'dd' ? (
        <select
          id={input.kolom}
          name={input.kolom}
          defaultValue={item ? item[input.kolom] : ''}
          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          aria-describedby={`${input.kolom}-error`}
        >
          {dropdownOptions[input.kolom]?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : input.jns === 'file' ? (
        <input
          id={input.kolom}
          name={input.kolom}
          type="file"
          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          aria-describedby={`${input.kolom}-error`}
        />
      ) : input.jns === 'img' ? (
        <input
          id={input.kolom}
          name={input.kolom}
          type="file"
          accept="image/*"
          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          aria-describedby={`${input.kolom}-error`}
        />
      ) : input.jns === 'radio' ? (
        <div>
          {dropdownOptions[input.kolom]?.map((option) => (
            <label key={option} className="inline-flex items-center">
              <input
                type="radio"
                name={input.kolom}
                value={option}
                defaultChecked={item ? item[input.kolom] === option : false}
                className="peer mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      ) : (
        <input
          id={input.kolom}
          name={input.kolom}
          type={input.jns}
          maxLength={input.maxlength}
          readOnly={input.readonly}
          required={input.required === 'Y'}
          defaultValue={item ? item[input.kolom] : ''}
          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          aria-describedby={`${input.kolom}-error`}
        />
      )}
      <div id={`${input.kolom}-error`} aria-live="polite" aria-atomic="true">
        {state.errors?.[input.kolom as keyof typeof state.errors] &&
          state.errors[input.kolom as keyof typeof state.errors]?.map(
            (error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ),
          )}
      </div>
    </div>
  ));
}
