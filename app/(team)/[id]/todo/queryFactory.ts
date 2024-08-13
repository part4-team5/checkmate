const tasksKey = {
	all: ["tasks"] as const,
	detail: (groupId: number, taskId: number, date: string) => [...tasksKey.all, { groupId, taskId, date }] as const,
};

export default tasksKey;
