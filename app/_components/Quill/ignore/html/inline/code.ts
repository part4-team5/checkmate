import { AST } from "../../parser";

export class CODE extends AST
{
	override render()
	{
		return `<code>${this.body}</code>`;
	}
}
