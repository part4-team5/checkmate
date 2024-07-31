"use client";

import Icon from "@/app/_icons";
import { createContext, useContext, useEffect, useCallback, useMemo, useState, useRef } from "react";

const [OK, NO] = [Symbol("magic"), Symbol("magic")];

interface FormProps extends React.PropsWithChildren {
	onSubmit: (data: FormData) => void;
}

interface FormContext {
	values: Record<string, string>;
	setValue: (id: string, value: string) => void;
	errors: Record<string, string | typeof OK | typeof NO>;
	setError: (id: string, value: string | typeof OK | typeof NO) => void;
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
	const [values, setValues] = useState<FormContext["values"]>({});
	const [errors, setErrors] = useState<FormContext["errors"]>({});
	const [disabled, setDisabled] = useState<FormContext["disabled"]>(true);

	useEffect(() => {
		requestAnimationFrame(() => {
			// eslint-disable-next-line no-restricted-syntax
			for (const error of Object.values(errors)) {
				if (error !== OK) {
					return setDisabled(true);
				}
			}
			return setDisabled(false);
		});
	}, [errors]);

	const ctx = useMemo<FormContext>(
		() => ({
			values,
			setValue(id, value) {
				if (values[id] === value) return;
				setValues({ ...values, [id]: value });
			},
			errors,
			setError(id, value) {
				if (errors[id] === value) return;
				setErrors({ ...errors, [id]: value });
			},
			disabled,
		}),
		[values, errors, disabled],
	);

	const handle = useCallback(
		(event: React.FormEvent) => {
			// :skull:
			event.preventDefault();
			// bye bye
			onSubmit(
				(() => {
					const impl = new FormData();
					// eslint-disable-next-line no-restricted-syntax
					for (const [key, value] of Object.entries(values)) {
						impl.set(key, value);
					}
					return impl;
				})(),
			);
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

	if (typeof ctx.errors[htmlFor] !== "string") {
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
		if (id in ctx.values) {
			throw new Error();
		}
		if (id in ctx.errors) {
			throw new Error();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		ctx.setValue(id, value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	useEffect(() => {
		// eslint-disable-next-line no-restricted-syntax
		for (const test of tests) {
			switch (test.type) {
				case "sync": {
					if (ctx.values[test.data] !== value) {
						ctx.setError(id, focus ? test.error : NO);
						return;
					}
					break;
				}
				case "pattern": {
					if (!test.data.test(value)) {
						ctx.setError(id, focus ? test.error : NO);
						return;
					}
					break;
				}
				case "require": {
					if (test.data && !value.length) {
						ctx.setError(id, focus ? test.error : NO);
						return;
					}
					break;
				}
				case "minlength": {
					if (value.length < test.data) {
						ctx.setError(id, focus ? test.error : NO);
						return;
					}
					break;
				}
				case "maxlength": {
					if (test.data < value.length) {
						ctx.setError(id, focus ? test.error : NO);
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
		ctx.setError(id, OK);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, focus, tests, ctx.values]);

	const self = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (focus) {
			switch (ctx.errors[id]) {
				case NO: {
					self.current?.style.setProperty("border-color", null);
					break;
				}
				case OK: {
					self.current?.style.setProperty("border-color", "#10B981FF");
					break;
				}
				default: {
					self.current?.style.setProperty("border-color", "#EF4444FF");
					break;
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [focus, ctx.errors]);

	const onFocus = useCallback(() => {
		setFocus(true);
	}, []);
	const onPaste = useCallback((event: React.ClipboardEvent) => {
		setValue((event.target as HTMLInputElement).value);
	}, []);
	const onChange = useCallback((event: React.ChangeEvent) => {
		setValue((event.target as HTMLInputElement).value);
	}, []);

	const [display, setDisplay] = useState(false);

	return (
		<div ref={self} className="flex w-full gap-[16px] rounded-[12px] border border-border-primary bg-background-secondary px-[16px]">
			<input
				id={id}
				// eslint-disable-next-line no-nested-ternary
				type={type === "password" ? (display ? "text" : "password") : type}
				onFocus={onFocus}
				onPaste={onPaste}
				onChange={onChange}
				placeholder={placeholder}
				className="h-[48px] grow bg-transparent text-lg font-normal text-text-primary placeholder:text-text-default focus:outline-none"
			/>
			{type === "password" && (
				<button type="button" onClick={() => setDisplay(!display)}>
					{display ? <Icon.Show width={24} height={24} /> : <Icon.Hide width={24} height={24} />}
				</button>
			)}
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
