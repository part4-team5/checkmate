import { AST } from "../../parser";

export class H3 extends AST
{
	override render()
	{
		return `<h3>${this.body}</h3>`;
	}
}
