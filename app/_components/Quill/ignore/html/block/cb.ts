import { AST } from "../../parser";

export class CB extends AST
{
	override render()
	{
		return `<pre><code>${this.body}</code></pre>`
	}
}
