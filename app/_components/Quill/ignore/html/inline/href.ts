import { AST } from "../../parser";

export class HREF extends AST
{
	constructor(private readonly text: string, private readonly href: string)
	{
		super();
	}

	override render()
	{
		return `<a href="${this.href}">${this.text}</a>`;
	}
}
