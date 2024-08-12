import { AST } from "../../parser";

export class PR extends AST
{
	override render()
	{
		return `<pr>${this.body}</pr>`;
	}
}
