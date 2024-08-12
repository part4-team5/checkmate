import { AST } from "../../parser";

export class BQ extends AST
{
	override render()
	{
		return `<blockquote>${this.body}</blockquote>`;
	}
}
