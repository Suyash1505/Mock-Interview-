"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

// SESSION DURATION - 1 WEEK
const SESSION_DURATION = 60 * 60 * 24 * 7;

// SET SESSION COOKIES
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  // CREAT SESSION COOKIE
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000, // MILLI SECOND
  });
  
  // SET COOKIE IN THE BROWSER
  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

// SIGN UP USER
export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // CHECK IF USER EXIST IN DB
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists)
      return {
        success: false,
        message: "USER ALREADY EXIST. PLEASE SIGN-IN",
      };
    
    // SAVE USER IN DB
    await db.collection("users").doc(uid).set({
      name,
      email,
    });
    
    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("Error creating user:", error);

    // HANDLE FIREBASE SPECIFIC HANDLER
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }
    
    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

// SIGN IN USER
export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord)
      return {
        success: false,
        message: "User does not exist. Create an account.",
      };

    await setSessionCookie(idToken);

  } catch (error: any) {
    console.log("");

    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
}

// SIGN OUT USER BY CLEARING THE
export async function signOut() {
  const cookieStore = await cookies();

  cookieStore.delete("session");
}

// GET CURRENT USER FROM THE SESSION COOKIE
export async function getCurrentUser(): Promise<User |null> {

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if(!sessionCookie){
    return null;
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    const userRecord = await db
    .collection('users')
    .doc(decodedClaims.uid)
    .get();

    if(!userRecord.exists){
      return null;
    }

    return {
      ...userRecord.data(),
      id: userRecord.id,
    }as User;

  } 
  catch (error) {
    console.log(error);
    return null;
  }
}

// CHECK IF USER IS AUTHENTICATED
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

// GET INTERVIEW BY USER ID
export async function getInterviewByUserId(userId :string): Promise< Interview[] | null > {

  const interviews = await db
  .collection('interviews')
  .where('userId', '==', userId)
  .orderBy('createdAt', 'desc')
  .get();

  return interviews.docs.map( (doc) => ({
    id: doc.id,
    ...doc.data()
  })) as Interview[];
}

// GET INTERVIEW CREATED BY OTHER USERS
export async function getLatestInterviews(params :GetLatestInterviewsParams): Promise< Interview[] | null > {

  const { userId, limit = 20} = params;

  const interviews = await db
  .collection('interviews')
  .orderBy('createdAt', 'desc')
  .where('finalized', '==', true)
  .where('userId', '!=', userId)
  .limit(limit)
  .get();

  return interviews.docs.map( (doc) => ({
    id: doc.id,
    ...doc.data()
  })) as Interview[];
}