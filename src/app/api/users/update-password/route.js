import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import User from '@/models/userModel';
import { connect } from '@/dbConfig/dbConfig';

export async function POST(request) {
    await connect();
    try {
       
        const { userId, newPassword } = await request.json();

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }


        user.password = await bcrypt.hash(newPassword, 10); 
        user.otp = undefined; 
        user.otpExpires = undefined; 
        await user.save(); 

        return NextResponse.json(
            { message: 'Password updated successfully. You can now log in.' }
        );
    } catch (error) {
        console.error('Error updating password:', error);
        return NextResponse.json(
            { message: 'Server error', error: error.message },
            { status: 500 }
        );
    }
}
