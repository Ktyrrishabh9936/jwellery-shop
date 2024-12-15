import jwt from "jsonwebtoken";

export  const getDataFromToken = async(req)=>{
        try{
                const token = req.cookies.get("token")?.value || "";
                const decodedToken =await jwt.verify(token,process.env.JWT_SECRET)
                return decodedToken.userId;
}catch(error){
        throw new Error(error.message)
}
}

