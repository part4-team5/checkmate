import { AST } from "../../parser";

export class H6 extends AST
{
	override render()
	{
		return `<h6>${this.body}</h6>`;
	}
}
