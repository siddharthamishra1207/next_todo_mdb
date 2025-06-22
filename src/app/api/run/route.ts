import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConfig";
connect();

export async function GET(request: NextRequest) {
  try {
    connect();
    return NextResponse.json({ message: "hello from backend" });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
