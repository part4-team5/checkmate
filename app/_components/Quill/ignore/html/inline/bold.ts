import { AST } from "../../parser";

export class BOLD extends AST
{
	override render()
	{
		return `<strong>${this.body}</strong>`;
	}
}
