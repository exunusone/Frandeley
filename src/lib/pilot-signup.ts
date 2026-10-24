/** Registration remains closed unless the launch switch is explicitly enabled. */
export function isPilotSignupOpen() {
  return process.env.PILOT_SIGNUPS_OPEN?.trim().toLowerCase() === "true";
}
