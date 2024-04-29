import {User} from "@/models/User";
import {mongooseConnect} from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
    await mongooseConnect();
    // const {name, email, password} = await request.json();
    // const hashPassword = await bcrypt.hash(password, 12);
    // const userDoc = await User.create({
    //     name, email, password:hashPassword
    // })
    // return NextResponse.json({"Success": true, userDoc});

    try {
        const { name, email, password, role } = await request.json();
        const userExists = await User.findOne({ email })

        if (userExists) {
            return NextResponse.json({ error: "User Already exists" })
        } else {
            if (password.length < 6)
                return NextResponse.json({ error: "Password should be 6 characters long" })

            const hashPassword = await bcrypt.hash(password, 12)
            const userDoc = await User.create({
                name, email, password: hashPassword, role
            })
            const user = {
                email: userDoc.email,
                name: userDoc.name,
                _id: userDoc._id,
                role: userDoc.role
            }
            return NextResponse.json({ success: true, user })
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, error })
    }

}



export async function PUT(request: NextRequest) {
    await mongooseConnect();
    const {title,description,price,images,category,subcategory,publish,_id} = await request.json();
    const productDoc = await User.findOneAndUpdate({_id}, {title,description,price,images,category,subcategory,publish}, {new:true});
    return NextResponse.json(productDoc)
}

export async function DELETE(request: NextRequest) {
    await mongooseConnect();
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    await User.deleteOne({_id:id});
    return NextResponse.json(true)
}
