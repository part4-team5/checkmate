import API from "@/app/_api";
import { useMutation } from "@tanstack/react-query";

/**
 * 몽고 DB에 유저 정보를 업로드하는 뮤테이션
 * @returns userUploadMutation
 */
const UserUpload = () => {
	const userUploadMutation = useMutation({
		mutationFn: async ({ id, email }: { id: number; email: string }) => API["api/users"].POST({}, { id, email }),
	});

	return userUploadMutation;
};

export default UserUpload;
