"use client"
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "@/lib/reducers/userReducer";

const SessionManager = () => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const {user} = useSelector((store)=>store.user);
  useEffect(() => {
    if (!user && status === "authenticated" && session?.expires) {
      const expirationTime = session?.expires*1000 ;
      const currentTime = Date.now();
      console.log(currentTime,expirationTime)
      const timeUntilExpiration = expirationTime - currentTime;
      console.log(session)
      console.log(timeUntilExpiration);

      if (timeUntilExpiration > 0) {
        dispatch(getUserProfile());
        const timer = setTimeout(() => {
          alert("Your session has expired. Please log in again.");
          signOut(); // Redirect to the login page
        }, timeUntilExpiration);

        return () => clearTimeout(timer); // Cleanup on component unmount
      } else {
        // If already expired, sign out immediately
        console.log("process")
        alert("Your session has expired. Please log in again.");
        signOut();
      }
    }
  }, [session,status]);

  return null; // This component doesn't render anything visually
};

export default SessionManager;
