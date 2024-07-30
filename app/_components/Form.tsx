"use client";

import { createContext, useContext, useEffect, useCallback, useMemo, useState, useRef } from "react";

interface FormProps extends React.PropsWithChildren {
	onSubmit: (data: FormData) => void;
}

interface FormContext {
	values: Record<string, string>;
	setValue: (id: string, value: string) => void;
	errors: Record<string, string>;
	setError: (id: string, value: string) => void;
	disabled: boolean;
}

const CTX = createContext<FormContext>({
	values: {},
	setValue: () => null,
	errors: {},
	setError: () => null,
	disabled: true,
});

export default function Form({ onSubmit, children }: Readonly<FormProps>) {
	const timeout = useRef<NodeJS.Timeout>();

	const [values, setValues] = useState<FormContext["values"]>({});
	const [errors, setErrors] = useState<FormContext["errors"]>({});
	const [disabled, setDisabled] = useState<FormContext["disabled"]>(true);

	useEffect(() => {
		if (timeout.current) {
			// bye bye
			clearTimeout(timeout.current);
		}
		// 1 frame later
		timeout.current = setTimeout(() => {
			// eslint-disable-next-line no-restricted-syntax
			for (const error of Object.values(errors)) {
				if (error !== "null") {
					return setDisabled(true);
				}
			}
			return setDisabled(false);
		}, 16);
	}, [errors]);

	const ctx = useMemo<FormContext>(
		() => ({
			values,
			setValue(id, value) {
				if (values[id] === value) return;
				// immediate update
				values[id] = value;
				// react lifecycle
				setValues({ ...values });
			},
			errors,
			setError(id, value) {
				if (errors[id] === value) return;
				// immediate update
				errors[id] = value;
				// react lifecycle
				setErrors({ ...errors });
			},
			disabled,
		}),
		[values, errors, disabled],
	);

	const handle = useCallback(
		(event: React.FormEvent) => {
			// :skull:
			event.preventDefault();

			const data = new FormData();

			// eslint-disable-next-line no-restricted-syntax
			for (const [key, value] of Object.values(values)) {
				data.set(key, value);
			}
			// bye bye
			onSubmit(data);
		},
		[onSubmit, values],
	);

	return (
		<CTX.Provider value={ctx}>
			<form onSubmit={handle}>{children}</form>
		</CTX.Provider>
	);
}

function useCTX() {
	const ctx = useContext(CTX);

	if (!ctx) throw new Error();

	return ctx;
}

Form.Error = function Error({ htmlFor }: Readonly<{ htmlFor: string }>) {
	const ctx = useCTX();

	if (["init", "null", null].includes(ctx.errors[htmlFor] ?? null)) {
		return null;
	}
	return <div className="text-md font-medium text-status-danger">{ctx.errors[htmlFor]}</div>;
};

type Verify<T> = { data: T; error: string };

type Validator =
	| ({ type: "sync" } & Verify<string>)
	| ({ type: "pattern" } & Verify<RegExp>)
	| ({ type: "require" } & Verify<boolean>)
	| ({ type: "minlength" } & Verify<number>)
	| ({ type: "maxlength" } & Verify<number>);

Form.Input = function Input({ id, type, tests = [], placeholder }: Readonly<{ id: string; type: string; tests?: Validator[]; placeholder?: string }>) {
	const ctx = useCTX();

	const [value, setValue] = useState("");
	const [focus, setFocus] = useState(false);

	useEffect(() => {
		ctx.setValue(id, value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, value]);

	useEffect(() => {
		// eslint-disable-next-line no-restricted-syntax
		for (const test of tests) {
			switch (test.type) {
				case "sync": {
					if (ctx.values[test.data] !== value) {
						ctx.setError(id, focus ? test.error : "init");
						return;
					}
					break;
				}
				case "pattern": {
					if (!test.data.test(value)) {
						ctx.setError(id, focus ? test.error : "init");
						return;
					}
					break;
				}
				case "require": {
					if (test.data && !value.length) {
						ctx.setError(id, focus ? test.error : "init");
						return;
					}
					break;
				}
				case "minlength": {
					if (value.length < test.data) {
						ctx.setError(id, focus ? test.error : "init");
						return;
					}
					break;
				}
				case "maxlength": {
					if (test.data < value.length) {
						ctx.setError(id, focus ? test.error : "init");
						return;
					}
					break;
				}
				default: {
					throw new Error();
				}
			}
		}
		// you've made all the way through here..! congrats
		ctx.setError(id, "null");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, value, focus, tests, ctx.values]);

	const self = useRef<HTMLInputElement>(null);

	useEffect(() => {
		switch (ctx.errors[id]) {
			case null:
			case "init": {
				self.current?.style.setProperty("border-color", "#F8FAFC1A");
				break;
			}
			case "null": {
				self.current?.style.setProperty("border-color", "#10B981FF");
				break;
			}
			default: {
				self.current?.style.setProperty("border-color", "#EF4444FF");
				break;
			}
		}
	}, [id, ctx.errors]);

	const onFocus = useCallback(() => {
		setFocus(true);
	}, []);
	const onPaste = useCallback((event: React.ClipboardEvent) => {
		setValue((event.target as HTMLInputElement).value);
	}, []);
	const onChange = useCallback((event: React.ChangeEvent) => {
		setValue((event.target as HTMLInputElement).value);
	}, []);

	return (
		<div className="flex w-full">
			<input
				id={id}
				ref={self}
				type={type}
				onFocus={onFocus}
				onPaste={onPaste}
				onChange={onChange}
				placeholder={placeholder}
				className="h-[48px] grow rounded-[12px] border bg-background-secondary px-[16px] text-lg font-normal placeholder:text-text-default focus:outline-none"
			/>
		</div>
	);
};

Form.Button = function Button({ children }: Readonly<React.PropsWithChildren>) {
	const ctx = useCTX();

	return (
		<button type="submit" disabled={ctx.disabled} className="h-[48px] rounded-[12px] bg-brand-primary text-white disabled:bg-interaction-inactive">
			{children}
		</button>
	);
};
