// 1. THIS LINE IS MANDATORY FOR TESTING
import "dotenv/config";

import { enrollUserInTrainerCentral } from "./src/lib/trainer-central";

// Use the Course ID from your earlier screenshot
const COURSE_ID = "22926000000003010";

enrollUserInTrainerCentral("niteeshcsc123@gmail.com", "testing testing", COURSE_ID);