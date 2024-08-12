import { AST } from "../../parser";

export class H2 extends AST
{
	override render()
	{
		return `<h2>${this.body}</h2>`;
	}
}
