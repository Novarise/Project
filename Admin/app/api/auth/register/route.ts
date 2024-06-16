import { User } from '@/models/User';
import { mongooseConnect } from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 12);
};

const createUser = async (name: string, email: string, password: string, role: string) => {
  const hashedPassword = await hashPassword(password);
  const userDoc = await User.create({ name, email, password: hashedPassword, role });
  return {
    email: userDoc.email,
    name: userDoc.name,
    _id: userDoc._id,
    role: userDoc.role
  };
};

const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

export async function POST(request: NextRequest) {
  await mongooseConnect();

  try {
    const { name, email, password, role } = await request.json();
    const userExists = await findUserByEmail(email);

    if (userExists) {
      return NextResponse.json({ error: 'User Already exists' });
    } else {
      if (password.length < 6)
        return NextResponse.json({
          error: 'Password should be 6 characters long',
        });

      const user = await createUser(name, email, password, role);
      return NextResponse.json({ success: true, user });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error });
  }
}

export async function PUT(request: NextRequest) {
  await mongooseConnect();
  const {
    title,
    description,
    price,
    images,
    category,
    subcategory,
    publish,
    _id,
  } = await request.json();
  const productDoc = await User.findOneAndUpdate(
    { _id },
    { title, description, price, images, category, subcategory, publish },
    { new: true },
  );
  return NextResponse.json(productDoc);
}

export async function DELETE(request: NextRequest) {
  await mongooseConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  await User.deleteOne({ _id: id });
  return NextResponse.json(true);
}
