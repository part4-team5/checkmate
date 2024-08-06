import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

const getQueryClient = cache(
	() =>
		new QueryClient({
			defaultOptions: {
				queries: {
					staleTime: 0, // 서버에서 캐시를 사용하지 않도록 설정
				},
			},
		}),
);
export default getQueryClient;
