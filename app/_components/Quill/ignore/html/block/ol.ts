import { AST } from "../../parser";

export class OL extends AST
{
	override render()
	{
		return `<ol>${this.body}</ol>`;
	}
}
