interface Route
{
	// @ts-expect-error [key: "default"] is used for fallback
	[key: string]: Route | Token; default?: Token;
}

export const enum Context
{
	// HTML,
	BLOCK,
	INLINE,
}

export abstract class Token
{
	constructor(public readonly ctx: "all" | Context, public readonly code: string)
	{
		// TODO: none
	}

	public abstract get next(): Context;
}

export default class Scanner
{
	private readonly __TABLE__: Record<Context, Route> = {
		// auto-generate
		[Context.BLOCK]: {},
		// auto-generate
		[Context.INLINE]: {},
	};

	constructor(data: Readonly<Token[]>)
	{
		/*
		e.g.
		// '<='
		{
			"<":
			{
				"=": <token> // less than or equal to, ≤
			}
		}

		// '<=='
		{
			"<":
			{
				"=":
				{
					"=": <token> // fat arrow left, ⇐
				}
			}
		}

		// <merge>
		{
			"<":
			{
				"=":
				{
					"=": <token> // fat arrow left, ⇐
					default: <token> // less than or equal to, ≤
				}
			}
		}
		*/
		function routes(ctx: Token["ctx"])
		{
			switch (ctx)
			{
				case "all":
				{
					return [Context.BLOCK, Context.INLINE];
				}
				case Context.BLOCK:
				{
					return [Context.BLOCK];
				}
				case Context.INLINE:
				{
					return [Context.BLOCK, Context.INLINE];
				}
			}
		}

		for (const token of data)
		{
			for (const ctx of routes(token.ctx))
			{
				let node = this.__TABLE__[ctx];
		
				for (let i = 0; i < token.code.length; i++)
				{
					const char = token.code[i];
			
					if (i + 1 < token.code.length)
					{
						if (char in node)
						{
							if (node[char] instanceof Token)
							{
								// merge branch
								node = (node[char] = { default: node[char] });
							}
							else
							{
								// pickup branch
								node = node[char];
							}
						}
						else
						{
							// create branch
							node = (node[char] = {});
						}
					}
					else
					{
						if (char in node)
						{
							if (node[char] instanceof Token)
							{
								throw new Error(`Token [${node[char]}] and [${token}] has exact code`)
							}
							else
							{
								// merge branch
								node[char].default = token;
							}
						}
						else
						{
							// create end-point
							node[char] = token;
						}
					}
				}
			}
		}
	}

	public scan(data: string)
	{
		const [main, buffer] = [[] as (string | Token)[], [] as string[]]; let [ctx, node, depth, escape] = [Context.BLOCK, this.__TABLE__[Context.BLOCK], 0, false];

		const handle = (char: string) =>
		{
			if (node === null) throw new Error();
			//
			// <into the deep>
			//
			depth++;
			//
			// <examine token>
			//
			if (node[char] instanceof Token)
			{
				const token = node[char];
				//
				// <buffer/flush>
				//
				if (depth < buffer.length)
				{
					main.push(buffer.join("").slice(0, - depth));
				}
				//
				// <token/build>
				//
				main.push(token);
				//
				// <state/reset>
				//
				[node, depth, buffer.length] = [this.__TABLE__[ctx = token.next], 0, 0];
			}
			else
			{
				//
				// <branch/delve>
				//
				node = node[char];
			}
		}

		main:
		for (const char of data.replace(/\r\n?/g, "\n"))
		{
			//
			// <escape>
			//
			if (!escape && char === "\\")
			{
				//
				// <state/reset>
				//
				[node, depth, escape] = [this.__TABLE__[ctx = Context.INLINE], 0, true];

				continue main;
			}
			//
			// <buffer/consume>
			//
			buffer.push(char);
			//
			// <unescape>
			//
			if (escape)
			{
				//
				// <state/reset>
				//
				[node, depth, escape] = [this.__TABLE__[ctx = Context.INLINE], 0, false];

				continue main;
			}
			//
			// <branch/delve>
			//
			if (char in node)
			{
				handle(char);
			}
			else
			{
				if (node.default)
				{
					const token = node.default;
					//
					// <ctx/switch>
					//
					ctx = token.next;
					//
					// <buffer/manipulate>
					//
					if (depth < buffer.length - 0)
					{
						//
						// <buffer/manipulate>
						//
						if (depth < buffer.length - 1)
						{
							/*
							e.g. token=<ITALIC { grammar: "*" }>, depth=1

							(from)
							buffer=["<char>", "<char>", "<char>", "*", "<CHARACTER>"]
							->
							(to)
							buffer=["*", "<CHARACTER>"]
							*/
							main.push(buffer.splice(0, buffer.length - depth - 1).join(""));
						}
						/*
						e.g. token=<ITALIC { grammar: "*" }>, depth=1
					
						(from)
						buffer=["*", "<CHARACTER>"]
						->
						(to)
						buffer=["<CHARACTER>"]
						*/
						buffer.splice(0, depth);
					}
					//
					// <token/build>
					//
					main.push(token);
				}
				else
				{
					//
					// <ctx/switch>
					//
					ctx = Context.INLINE;
				}
				//
				// <state/reset>
				//
				[node, depth] = [this.__TABLE__[ctx], 0];
				//
				// <branch/delve>
				//
				if (char in node)
				{
					handle(char);
				}
			}
		}
		//
		// <buffer/flush>
		//
		if (0 < buffer.length)
		{
			main.push(buffer.join(""));
		}
		
		return main;
	}
}
