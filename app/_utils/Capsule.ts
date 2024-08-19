export default function Capsule<T>(getter: () => T, setter: (value: T) => void) {
	// eslint-disable-next-line no-constructor-return
	return ((value?: T) => (value === undefined ? getter() : setter(value))) as { (): T; (value: T): void };
}
