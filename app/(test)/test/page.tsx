"use client";

import DropDown from "@/app/_components/Dropdown";
import UserIcon from "@/public/icons/UserIcon";

export default function Page() {
	const teamDropdown = [
		{
			text: "사업기획팀sfdgsdfgsdfg",
			image: "/images/Frame.png",
		},
		{
			text: "사업기획팀sfdgsdfgsdfg",
			image: "/images/Frame.png",
		},
	];

	const TeamOptions1 = [
		{
			text: "사업기획팀sfdgsdfgsdfg",
			image: "/images/Frame.png",
		},
		{
			text: "프로덕트팀",
			image: "/images/Frame.png",
		},
		{
			text: "프로덕트팀",
			image: "/images/Frame.png",
		},
		{
			text: "프로덕트팀",
			image: "/images/Frame.png",
		},
		{
			text: "프로덕트팀",
			image: "/images/Frame.png",
		},
		{
			text: "프로덕트팀",
			image: "/images/Frame.png",
		},
		{
			text: "프로덕트팀",
			image: "/images/Frame.png",
		},
		{
			text: "프로덕트팀",
			image: "/images/Frame.png",
		},
		{
			text: "프로덕트팀",
			image: "/images/Frame.png",
		},
		{
			text: "프로덕트팀",
			image: "/images/Frame.png",
		},
		{
			text: "프로덕트팀",
			image: "/images/Frame.png",
		},
	];
	return (
		<div>
			<section className="ml-[500px]">
				<DropDown options={TeamOptions1} gapX={10} gapY={10} align="center">
					<button type="button" aria-label="User" className="flex gap-2">
						<div className="size-4 tablet:size-6">
							<UserIcon width="100%" height="100%" />
						</div>
						<span className="hidden desktop:block">유저 이름</span>
					</button>
				</DropDown>
			</section>
			<section className="ml-[500px] mt-[50px]">
				<DropDown options={teamDropdown} gapX={10} gapY={10} align="left">
					<button type="button" aria-label="User" className="flex gap-2">
						<div className="size-4 tablet:size-6">
							<UserIcon width="100%" height="100%" />
						</div>
						<span className="hidden desktop:block">유저 이름</span>
					</button>
				</DropDown>
			</section>
			<section className="ml-[500px] mt-[200px]">
				<DropDown options={teamDropdown} gapX={10} gapY={10} align="right">
					<button type="button" aria-label="User" className="flex gap-2">
						<div className="size-4 tablet:size-6">
							<UserIcon width="100%" height="100%" />
						</div>
						<span className="hidden desktop:block">유저 이름</span>
					</button>
				</DropDown>
			</section>
		</div>
	);
}
