/* eslint-disable no-alert */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
import Button from "@/app/_components/Button";
import DropDown, { DropDownProps } from "@/app/_components/Dropdown";
import { Meta, StoryFn } from "@storybook/react";

const options = [
	{
		text: "옵션 1",
		onClick: () => alert("옵션 1 클릭됨"),
	},
	{
		text: "옵션 2",
		onClick: () => alert("옵션 2 클릭됨"),
	},
	{
		text: "옵션 3",
		onClick: () => alert("옵션 3 클릭됨"),
	},
];

export default {
	title: "DropDown",
	component: DropDown,
} as Meta;

const Template: StoryFn<DropDownProps> = (args) => (
	<DropDown {...args}>
		<Button>
			<div className="w-64 py-2">드롭다운</div>
		</Button>
	</DropDown>
);

export const Default = Template.bind({});
Default.args = {
	options,
	gapX: 0,
	gapY: 0,
	align: "RL",
};

export const WithImage = Template.bind({});
WithImage.args = {
	options: [
		{
			text: "안녕하세요",
			image: "https://via.placeholder.com/150",
			onClick: () => alert("안녕하세요 클릭됨"),
		},
		{
			text: "반갑습니다",
			image: "https://via.placeholder.com/150",
		},
		{
			text: "반가워요",
			image: "https://via.placeholder.com/150",
		},
		{
			content: (
				<button
					type="button"
					className="h-[46px] w-[186px] rounded-[12px] border border-[#F8FAFC] text-[#F8FAFC] hover:bg-[#63748D]"
					onClick={() => alert("팀 추가하기 클릭됨")}
				>
					팀 추가하기
				</button>
			),
		},
	],
	align: "RL",
	gapX: 0,
	gapY: 0,
};

export const WithSubOptionsAndImage = Template.bind({});
WithSubOptionsAndImage.args = {
	options: [
		{
			text: "안녕하세요",
			image: "https://via.placeholder.com/150",
			options: [
				{
					text: "수정하기",
					onClick: () => {
						alert("수정하기 클릭됨");
					},
				},
				{
					text: "삭제하기",
					onClick: () => {
						alert("삭제하기 클릭됨");
					},
				},
			],
		},
		{
			text: "반갑습니다",
			image: "https://via.placeholder.com/150",
			options: [
				{
					text: "수정하기",
					onClick: () => {
						alert("수정하기 클릭됨");
					},
				},
				{
					text: "삭제하기",
					onClick: () => {
						alert("삭제하기 클릭됨");
					},
				},
			],
		},
		{
			content: (
				<button
					type="button"
					className="h-[46px] w-[186px] rounded-[12px] border border-[#F8FAFC] text-[#F8FAFC] hover:bg-[#63748D]"
					onClick={() => alert("팀 추가하기 클릭됨")}
				>
					팀 추가하기
				</button>
			),
		},
	],
	align: "RL",
	gapX: 0,
	gapY: 0,
};
