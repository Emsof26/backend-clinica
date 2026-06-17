import passport from "passport";

import localStrategy from "./localStrategy";
import jwtStrategy from "./jwtStrategy";

passport.use("local", localStrategy);

passport.use("jwt", jwtStrategy);

export default passport;
