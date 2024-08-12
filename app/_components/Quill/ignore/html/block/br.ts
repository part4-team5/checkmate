import { AST } from "../../parser";

export class BR extends AST
{
	override render()
	{
		return `<br/>`;
	}
}
