// test-tc.ts
import "dotenv/config";
import { enrollUserInTrainerCentral } from "./src/lib/trainer-central";

const COURSE_ID = "22926000000003010";
const WORKSHOP_ID = "22926000000015002";


// 1. Test Course
enrollUserInTrainerCentral("RECORDED", "studendt.course@test.com", "Course User", COURSE_ID);

// 2. Test Workshop (Now uses the same working API)
enrollUserInTrainerCentral("LIVE", "stdudent.workshop@test.com", "Workshop User", WORKSHOP_ID);