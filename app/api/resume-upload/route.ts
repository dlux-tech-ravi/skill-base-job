import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

export async function POST(req: NextRequest) {
  try {

    const data = await req.formData();
    const file = data.get("resume") as File;

    const buffer = Buffer.from(await file.arrayBuffer());

    const formData = new FormData();

    formData.append("file", buffer, {
      filename: file.name,
      contentType: file.type
    });

    const response = await axios.post(
      "https://api.affinda.com/v2/resumes",
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.AFFINDA_API_KEY}`,
          ...formData.getHeaders()
        }
      }
    );

    return NextResponse.json(response.data.data);

  } catch (error: any) {

    console.log(error.response?.data || error);

    return NextResponse.json({
      error: "Resume parsing failed"
    });
  }
}