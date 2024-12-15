// src/app/api/slides/route.js
import { connect } from "@/dbConfig/dbConfig";
import Home from "@/models/homePageModel";
import { NextResponse } from "next/server";

export async function GET() {
    await connect();
    try {
        const slides = await Home.find({});
        if (!slides.length) {
            return NextResponse.json({ message: "No slides found" }, { status: 404 });
        }
        return NextResponse.json({ slides }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
