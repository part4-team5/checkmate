"use client";

import Button from "@/app/_components/Button";
import HideIcon from "@/public/icons/HideIcon";
import ShowIcon from "@/public/icons/ShowIcon";

import { createContext, useContext, useEffect, useCallback, useMemo, useState, useRef, useLayoutEffect } from "react";

const [OK, NO] = [Symbol("ok"), Symbol("no")];

interface FormProps extends React.PropsWithChildren {
	onSubmit: (ctx: FormContext) => void;
}

interface FormContext {
	values: Record<string, FormDataEntryValue>;
	setValue: (id: string, value: FormDataEntryValue) => void;
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
				values[id] = value;
				setValues({ ...values });
			},
			errors,
			setError(id, value) {
				if (errors[id] === value) return;
				errors[id] = value;
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
			// bye bye
			onSubmit(ctx);
		},
		[onSubmit, ctx],
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
	| ({ type: "match" } & Verify<RegExp>)
	| ({ type: "unmatch" } & Verify<RegExp>)
	| ({ type: "require" } & Verify<boolean>)
	| ({ type: "minlength" } & Verify<number>)
	| ({ type: "maxlength" } & Verify<number>)
	| ({ type: "file_name" } & Verify<RegExp>)
	| ({ type: "file_size" } & Verify<number>);

Form.Input = function Input({
	id,
	type,
	init,
	tests,
	placeholder,
}: Readonly<{ id: string; type: string; init?: string; tests?: Validator[]; placeholder?: string }>) {
Form.Input = function Input({
	id,
	type,
	init,
	tests,
	placeholder,
}: Readonly<{ id: string; type: string; init?: string; tests?: Validator[]; placeholder?: string }>) {
	const ctx = useCTX();

	const [value, setValue] = useState("");
	const [focus, setFocus] = useState(false);

	useEffect(() => {
		ctx.setValue(id, value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	useEffect(() => {
		// eslint-disable-next-line no-restricted-syntax
		for (const test of tests ?? []) {
			switch (test.type) {
				case "sync": {
					if (ctx.values[test.data] !== value) {
						ctx.setError(id, focus ? test.error : NO);
						return;
					}
					break;
				}
				case "match": {
					if (!test.data.test(value)) {
						ctx.setError(id, focus ? test.error : NO);
						return;
					}
					break;
				}
				case "unmatch": {
					if (test.data.test(value)) {
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

	const self = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
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

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onFocus = useCallback((event: React.FocusEvent) => {
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
				defaultValue={init}
				defaultValue={init}
				className="h-[48px] grow bg-transparent text-lg font-normal text-text-primary placeholder:text-text-default focus:outline-none"
			/>
			{type === "password" && (
				<button type="button" onClick={() => setDisplay(!display)}>
					{display ? <ShowIcon width={24} height={24} /> : <HideIcon width={24} height={24} />}
				</button>
			)}
		</div>
	);
};

Form.TextArea = function TextArea({ id, init, tests, placeholder }: Readonly<{ id: string; init?: string; tests?: Validator[]; placeholder?: string }>) {
	const ctx = useCTX();

	const [value, setValue] = useState("");
	const [focus, setFocus] = useState(false);

	useEffect(() => {
		ctx.setValue(id, value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	useEffect(() => {
		// eslint-disable-next-line no-restricted-syntax
		for (const test of tests ?? []) {
			switch (test.type) {
				case "sync": {
					if (ctx.values[test.data] !== value) {
						ctx.setError(id, focus ? test.error : NO);
						return;
					}
					break;
				}
				case "match": {
					if (!test.data.test(value)) {
						ctx.setError(id, focus ? test.error : NO);
						return;
					}
					break;
				}
				case "unmatch": {
					if (test.data.test(value)) {
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

	const self = useRef<HTMLTextAreaElement>(null);

	useLayoutEffect(() => {
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

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onFocus = useCallback((event: React.FocusEvent) => {
		setFocus(true);
	}, []);
	const onPaste = useCallback((event: React.ClipboardEvent) => {
		setValue((event.target as HTMLTextAreaElement).value);
	}, []);
	const onChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setValue(event.target.value);
		// reset height
		self.current?.style.setProperty("height", "auto");
		// update height
		self.current?.style.setProperty("height", `${self.current.scrollHeight}px`);
	}, []);

	return (
		<textarea
			id={id}
			ref={self}
			cols={1}
			onFocus={onFocus}
			onPaste={onPaste}
			onChange={onChange}
			placeholder={placeholder}
			defaultValue={init}
			defaultValue={init}
			className="h-auto grow resize-none overflow-hidden rounded-[12px] border border-border-primary bg-background-secondary px-[16px] py-[16px] text-lg font-normal text-text-primary placeholder:text-text-default focus:outline-none"
		/>
	);
};

Form.ImageInput = function ImageInput({
	id,
	init,
	tests,
	children,
}: Readonly<{ id: string; init?: string; tests?: Validator[]; children: (file?: FileReader["result"]) => React.ReactNode }>) {
	const ctx = useCTX();

	const [file, setFile] = useState<File>();
	const [focus, setFocus] = useState(false);
	const [image, setImage] = useState<FileReader["result"]>();

	useEffect(() => {
		ctx.setValue(id, file ?? "init");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [file]);

	useEffect(() => {
		if (init) {
			fetch(init).then((response) => {
				response.blob().then((data) => {
					setFile(new File([data], `init.${data.type}`, { type: data.type }));
				});
			});
		}
	}, [init]);

	useEffect(() => {
		// eslint-disable-next-line no-restricted-syntax
		for (const test of tests ?? []) {
			switch (test.type) {
				case "require": {
					if (!file) {
						ctx.setError(id, focus ? test.error : NO);
						return;
					}
					break;
				}
				case "file_name": {
					if (file && !test.data.test(file.name)) {
						ctx.setError(id, focus ? test.error : NO);
						return;
					}
					break;
				}
				case "file_size": {
					if (file && test.data < file.size) {
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
		if (file) {
			const reader = new FileReader();
			// :3
			reader.onload = () => {
				setImage(reader.result);
			};
			reader.readAsDataURL(file);
		}
		// you've made all the way through here..! congrats
		ctx.setError(id, OK);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [file, focus, tests]);

	const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		// :<
		setFocus(true);
		// :3
		setFile(event.target.files![0]!);
	}, []);

	return (
		// eslint-disable-next-line jsx-a11y/label-has-associated-control
		<label htmlFor={id}>
			{children(image)}
			<input id={id} type="file" accept=".png,.jpg,.jpeg,.webp" multiple={false} style={{ display: "none" }} onChange={onChange} />
		</label>
	);
};

Form.Submit = function Submit({ children }: Readonly<React.PropsWithChildren & Omit<Parameters<typeof Button>[0], "type">>) {
	const ctx = useCTX();

	return (
		<Button type="submit" disabled={ctx.disabled}>
			{children}
		</Button>
	);
};
