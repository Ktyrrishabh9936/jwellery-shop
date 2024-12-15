import { ForbiddenError } from '@/lib/errors';
import authOptions from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
export  const UserAuth = async()=>{
  try{
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new ForbiddenError('Invalid Token');
    }
    console.log(session.user.id)
    return session.user.id;
}catch(error){
  throw new Error(error)
}
}