import { AST } from "../../parser";

export class ITALIC extends AST
{
	override render()
	{
		return `<i>${this.body}</i>`;
	}
}
