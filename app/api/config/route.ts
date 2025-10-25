import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Helper function to get the file path
function getConfigPath() {
  // process.cwd() gives the root directory of the project
  return path.join(process.cwd(), "public", "game-config.json");
}

/**
 * Handles GET requests to /api/config
 * Reads and returns the current game configuration.
 */
export async function GET() {
  try {
    const filePath = getConfigPath();
    const fileContent = await fs.readFile(filePath, "utf-8");
    const config = JSON.parse(fileContent);
    return NextResponse.json(config);
  } catch (error) {
    console.error("Failed to read config file:", error);
    return NextResponse.json(
      { message: "Error reading configuration file." },
      { status: 500 }
    );
  }
}

/**
 * Handles POST requests to /api/config
 * Receives new config data and updates the file.
 */
export async function POST(request: Request) {
  try {
    const newConfig = await request.json();
    const filePath = getConfigPath();

    // Optional: You can add validation here to ensure the data is correct

    const fileContent = JSON.stringify(newConfig, null, 2); // Pretty print JSON
    await fs.writeFile(filePath, fileContent, "utf-8");

    return NextResponse.json({ message: "Configuration updated successfully." });
  } catch (error) {
    console.error("Failed to write config file:", error);
    return NextResponse.json(
      { message: "Error writing configuration file." },
      { status: 500 }
    );
  }
}