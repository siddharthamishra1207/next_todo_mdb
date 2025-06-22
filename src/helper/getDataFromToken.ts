import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Define a custom interface for the decoded token
interface DecodedToken {
  id: string;  // assuming `id` is a string, adjust accordingly
}

export const getDataFromToken = (request: NextRequest): string | null => {
  try {
    const token = request.cookies.get("token")?.value;

    // If token doesn't exist in cookies, return null or handle accordingly
    if (!token) {
      throw new Error("Token not found");
    }

    // Verify and decode the token with the custom type
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as DecodedToken;

    // Ensure that the token contains the 'id' field
    if (!decodedToken.id) {
      throw new Error("Token does not contain a user ID");
    }

    return decodedToken.id; // Return the user ID
  } catch (error: unknown) {
    // Narrow down the type of error to an instance of Error
    if (error instanceof Error) {
      // Handle specific error messages for better debugging
      if (error.message === "Token not found") {
        throw new Error("Authentication token is missing from the request.");
      } else if (error.message === "jwt malformed" || error.message === "invalid token") {
        throw new Error("Invalid token. Please log in again.");
      } else if (error.message === "jwt expired") {
        throw new Error("Token has expired. Please log in again.");
      } else {
        throw new Error("An error occurred while processing the token.");
      }
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
};