// eslint-disable-next-line import/no-extraneous-dependencies
import mongoose from "mongoose";

declare global {
	// eslint-disable-next-line vars-on-top, no-var
	var mongoose: any; // This must be a `var` and not a `let / const`
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
	throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = global.mongoose;

if (!cached) {
	// eslint-disable-next-line no-multi-assign
	cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
	if (cached.conn) {
		return cached.conn;
	}
	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
		};
		// eslint-disable-next-line @typescript-eslint/no-shadow
		cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose);
	}
	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null;
		throw e;
	}

	return cached.conn;
}

export default dbConnect;
