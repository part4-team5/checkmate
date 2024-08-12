import { AST } from "../../parser";

export class H1 extends AST
{
	override render()
	{
		return `<h1>${this.body}</h1>`;
	}
}
