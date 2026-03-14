import mongoose from "mongoose";

let cached = global._mongoose;

if (!cached) cached = global._mongoose = { conn: null, promise: null };

export function mongooseConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("Please define MONGODB_URI in .env.local");
    cached.promise = mongoose.connect(uri).then((m) => m);
  }
  cached.conn = cached.promise;
  return cached.conn;
}