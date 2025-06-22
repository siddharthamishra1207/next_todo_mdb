import { connect } from "@/dbConfig/dbConfig";
import Task from "@/models/tasks";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helper/getDataFromToken"; // adjust path if needed

connect();

export async function GET(request: NextRequest) {
  try {
    // 1. Get the user ID from the token stored in cookies
    const userId = getDataFromToken(request);

    // 2. Find all tasks belonging to this user
    const tasks = await Task.find({ user: userId });

    // 3. Return response
    return NextResponse.json({
      message: "Tasks fetched successfully",
      success: true,
      tasks,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 401 });
  }
}
