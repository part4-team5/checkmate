import { AST } from "../../parser";

export class H5 extends AST
{
	override render()
	{
		return `<h5>${this.body}</h5>`;
	}
}
