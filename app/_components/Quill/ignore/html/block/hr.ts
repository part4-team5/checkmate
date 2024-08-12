import { AST } from "../../parser";

export class HR extends AST
{
	override render()
	{
		return `<hr/>`;
	}
}
