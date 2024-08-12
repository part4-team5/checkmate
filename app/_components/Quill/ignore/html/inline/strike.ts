import { AST } from "../../parser";

export class STRIKE extends AST
{
	override render()
	{
		return `<s>${this.body}</s>`;
	}
}
