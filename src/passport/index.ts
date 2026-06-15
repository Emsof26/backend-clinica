import passport from "passport";


import localStrategy from "./localStrategy";
import jwtStrategy from "./jwtStrategy";


// 🔐 login
passport.use("local", localStrategy);


// 🔒 protección
passport.use("jwt", jwtStrategy);


export default passport;
