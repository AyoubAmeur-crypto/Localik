import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json({ error: "Aucune image reçue." }, { status: 400 });
    }

    // If it's already a URL, return it
    if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("/")) {
      return NextResponse.json({ url: image });
    }

    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "rentcar",
    });

    return NextResponse.json({ url: uploadResponse.secure_url });
  } catch (error: any) {
    console.error("API Upload Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'upload vers Cloudinary." },
      { status: 500 }
    );
  }
}
