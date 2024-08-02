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
		options: [
			{
				text: "서브 옵션 1",
				onClick: () => alert("서브 옵션 1 클릭됨"),
			},
			{
				text: "서브 옵션 2",
				onClick: () => alert("서브 옵션 2 클릭됨"),
			},
		],
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
			<div className="w-32 py-2">드롭다운</div>
		</Button>
	</DropDown>
);

export const Default = Template.bind({});
Default.args = {
	options,
};

export const WithSubOptionsAndContent = Template.bind({});
WithSubOptionsAndContent.args = {
	options: [
		{
			text: "옵션 1",
			onClick: () => alert("옵션 1 클릭됨"),
			options: [
				{
					text: "서브 옵션 1",
					onClick: () => alert("서브 옵션 1 클릭됨"),
				},
				{
					text: "서브 옵션 2",
					onClick: () => alert("서브 옵션 2 클릭됨"),
				},
			],
		},
		{
			text: "옵션 2",
			onClick: () => alert("옵션 2 클릭됨"),
			options: [
				{
					text: "서브 옵션 1",
					onClick: () => alert("서브 옵션 1 클릭됨"),
				},
				{
					text: "서브 옵션 2",
					onClick: () => alert("서브 옵션 2 클릭됨"),
				},
			],
		},
	],
};

export const WithSubOptionsAndImage = Template.bind({});
WithSubOptionsAndImage.args = {
	options: [
		{
			text: "옵션 1",
			onClick: () => alert("옵션 1 클릭됨"),
			image: "https://via.placeholder.com/150",
			options: [
				{
					text: "서브 옵션 1",
					onClick: () => alert("서브 옵션 1 클릭됨"),
				},
				{
					text: "서브 옵션 2",
					onClick: () => alert("서브 옵션 2 클릭됨"),
				},
			],
		},
		{
			text: "옵션 2",
			onClick: () => alert("옵션 2 클릭됨"),
			image: "https://via.placeholder.com/150",
			options: [
				{
					text: "서브 옵션 1",
					onClick: () => alert("서브 옵션 1 클릭됨"),
				},
				{
					text: "서브 옵션 2",
					onClick: () => alert("서브 옵션 2 클릭됨"),
				},
			],
		},
	],
};

export const WithSubOptionsAndContentAndImage = Template.bind({});
WithSubOptionsAndContentAndImage.args = {
	options: [
		{
			text: "옵션 1",
			onClick: () => alert("옵션 1 클릭됨"),
			image: "https://via.placeholder.com/150",
			content: <div className="p-4">컨텐츠</div>,
			options: [
				{
					text: "서브 옵션 1",
					onClick: () => alert("서브 옵션 1 클릭됨"),
				},
				{
					text: "서브 옵션 2",
					onClick: () => alert("서브 옵션 2 클릭됨"),
				},
			],
		},
		{
			text: "옵션 2",
			onClick: () => alert("옵션 2 클릭됨"),
			image: "https://via.placeholder.com/150",
			content: <div className="">컨텐츠</div>,
			options: [
				{
					text: "서브 옵션 1",
					onClick: () => alert("서브 옵션 1 클릭됨"),
				},
				{
					text: "서브 옵션 2",
					onClick: () => alert("서브 옵션 2 클릭됨"),
				},
			],
		},
	],
};
