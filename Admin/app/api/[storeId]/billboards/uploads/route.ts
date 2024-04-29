import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { mongooseConnect } from "@/lib/mongoose";
import { Billboard } from "@/models/Billboard";
import { PutObjectCommand, S3Client, S3 } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const s3Client = new S3Client({
    region:'us-west-2',
    credentials: {
        accessKeyId:process.env.S3_ACCESS_KEY as string,
        secretAccessKey:process.env.S3_SECRET_ACCESS_KEY as string
    }
  })
  try {
    const bucketName = process.env.BUCKET_NAME
  
    const formData = await request.formData();
    const file = formData.get("file") as Blob | null;
    if (!file) {
      return NextResponse.json(
        { error: "File blob is required." },
        { status: 400 }
      );
    }

    const name = encodeURIComponent(file.name)
    const buffer = Buffer.from(await file.arrayBuffer());

    await s3Client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: name,
            ACL: 'public-read',
            Body: buffer,
            ContentType: file.type,
        }));
      const link = `https://${bucketName}.s3.amazonaws.com/${name}`

 
      return Response.json({ link: link, success: true });
  } catch (err) {
      console.log(err);
      return Response.json({ message: err, success: false });
  }
}

