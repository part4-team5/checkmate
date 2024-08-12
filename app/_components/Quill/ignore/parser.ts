import Scanner, { Token } from "./scanner";

export abstract class AST
{
	public readonly children: (AST | string)[];

	constructor(...children: typeof this.children)
	{
		this.children = children;
	}

	public get body()
	{
		return this.children.map((child) => typeof child === "string" ? child : child.render()).join("");
	}

	public abstract render(): string;
}

export default class Parser
{
	private data: ReturnType<Scanner["scan"]> = []; private i: number = 0;

	constructor(private readonly handle: ({ peek, next, until }:
	{
		readonly peek: Parser["peek"],
		readonly next: Parser["next"],
		readonly until: Token[],
	}
	) => AST)
	{
		// TODO: none
	}

	public parse(data: typeof this.data)
	{
		this.data = data; this.i = 0; const root = new (class ROOT extends AST
		{
			override render()
			{
				return `<article class="md">${this.body}</article>`;
			}
		})
		();
		//
		// iterate
		//
		while (this.i in this.data)
		{
			try
			{
				root.children.push(this.handle(
				{
					peek: this.peek.bind(this),
					next: this.next.bind(this),
					until: [],
				}));
			}
			catch (error)
			{
				if (error === "EOF") continue;

				console.debug(error);

				break;
			}
		}
		return root;
	}

	private peek(type?: Token)
	{
		if (type && this.data[this.i] !== type)
		{
			throw new Error(`Unexpected token ${this.data[this.i].constructor.name} at position ${this.i}`);
		}
		return this.i in this.data ? this.data[this.i] : null;
	}

	private next(type?: Token)
	{
		if (type && this.data[this.i] !== type)
		{
			throw new Error(`Unexpected token ${this.data[this.i].constructor.name} at position ${this.i}`);
		}
		return this.i in this.data ? this.data[this.i++] : null;
	}
}
