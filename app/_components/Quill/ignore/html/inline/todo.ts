import { AST } from "../../parser";

export class TODO extends AST
{
	constructor(private readonly complete: boolean)
	{
		super();
	}

	override render()
	{
		if (!this.complete)
		{
			return `<input type="checkbox" onClick="return false"/>`;
		}
		else
		{
			return `<input type="checkbox" checked onClick="return false"/>`;
		}
	}
}
