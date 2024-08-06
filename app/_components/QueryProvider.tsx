"use client";

// QueryClientProvider는 내부적으로 useContext에 의존하기 때문에 'use client'를 최상단에 작성해야 합니다.
import { isServer, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				// SSR에서는 기본 staleTime을 0 이상으로 설정하여 클라이언트에서 즉시 다시 가져오지 않도록 하는 것이 일반적입니다.
				staleTime: 60 * 1000,
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
	if (isServer) {
		// 서버: 항상 새로운 query client를 만듭니다.
		return makeQueryClient();
	}
	// 브라우저: 이미 없는 경우 새로운 query client를 만듭니다.
	// eslint-disable-next-line no-return-assign
	return (browserQueryClient ??= makeQueryClient());
}

export default function Providers({ children }: Readonly<React.PropsWithChildren>) {
	// 참고: 일시 중단 경계가 없으면 React는 초기 렌더링 시 클라이언트를 버릴 것이기 때문에 query client를 초기화할 때 useState를 피해야 합니다.
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
