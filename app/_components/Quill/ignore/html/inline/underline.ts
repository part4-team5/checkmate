import { AST } from "../../parser";

export class UNDERLINE extends AST
{
	override render()
	{
		return `<u>${this.body}</u>`;
	}
}
