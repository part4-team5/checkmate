import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

const getQueryClient = cache(
	({ staleTime = 0 }: { staleTime: number }) =>
		new QueryClient({
			defaultOptions: {
				queries: {
					staleTime,
				},
			},
		}),
);
export default getQueryClient;
