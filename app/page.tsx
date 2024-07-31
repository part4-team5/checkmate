import Dropdown from "@/app/_components/Dropdown";
import GearIcon from "@/public/icons/GearIcon";
import KebabIcon from "@/public/icons/KebabIcon";

export default function Page() {
	return (
		<main className="h-[500] bg-background-primary">
			<p>hello world</p>
			<p>5팀 프로젝트</p>
			<Dropdown
				type="user"
				icon={<KebabIcon />}
				anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
				overlayOrigin={{ vertical: "top", horizontal: "left" }}
			/>
			<div className="mt-[500px]" />
			<Dropdown type="team" anchorOrigin={{ vertical: "bottom", horizontal: "left" }} overlayOrigin={{ vertical: "top", horizontal: "left" }} />
			<div className="mt-[500px]" />
			<Dropdown
				type="edit"
				icon={<GearIcon />}
				anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
				overlayOrigin={{ vertical: "top", horizontal: "left" }}
			/>{" "}
			<div className="mt-[500px]" />
		</main>
	);
}
