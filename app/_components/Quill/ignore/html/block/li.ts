import { AST } from "../../parser";

export class LI extends AST
{
	override render()
	{
		return `<li>${this.body}</li>`;
	}
}
