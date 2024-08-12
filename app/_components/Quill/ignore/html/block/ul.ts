import { AST } from "../../parser";

export class UL extends AST
{
	override render()
	{
		return `<ul>${this.body}</ul>`;
	}
}
