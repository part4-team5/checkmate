import { AST } from "../../parser";

export class EM extends AST
{
	constructor(private readonly alt: string, private readonly src: string)
	{
		super();
	}

	override render()
	{
		// TODO: embed youtube, twitter, etc...
		return `<img alt="${this.alt}" src="${this.src}">`;
	}
}
