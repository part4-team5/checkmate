import { createContext, useContext, useState } from "react";

import Capsule from "@/app/_utils/Capsule";

interface SwitchContext {
	index: ReturnType<typeof Capsule<string>>;
}

interface SwitchProps extends React.PropsWithChildren {
	init: string;
}

const CTX = createContext<SwitchContext>({
	index: Capsule<string>(
		() => {
			throw new Error();
		},
		() => {
			throw new Error();
		},
	),
});

export default function Switch({ init, children }: SwitchProps) {
	const [index, setIndex] = useState(init);

	return (
		<CTX.Provider
			// eslint-disable-next-line react/jsx-no-constructed-context-values
			value={{
				index: Capsule(
					() => index,
					(_) => setIndex(_),
				),
			}}
		>
			{children}
		</CTX.Provider>
	);
}

function useCTX() {
	const ctx = useContext(CTX);

	if (!ctx) throw new Error();

	return ctx;
}

Switch.Jump = function Jump({ to, children }: React.PropsWithChildren & { to: string }) {
	const ctx = useCTX();

	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events
		<div role="button" tabIndex={0} onClick={() => ctx.index(to)}>
			{children}
		</div>
	);
};

Switch.Case = function Case({ of, children }: React.PropsWithChildren & { of: string }) {
	const ctx = useCTX();

	return (
		// @ts-expect-error stfu
		<div style={{ display: ctx.index() !== of && "none" }}>{children}</div>
	);
};
