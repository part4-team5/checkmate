const tasksKey = {
	all: ["task"] as const,
	detail: (groupId: number, taskId: number, data: string) => [...tasksKey.all, { groupId, taskId, data }] as const,
};

export default tasksKey;
