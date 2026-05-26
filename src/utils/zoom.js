// utils/zoom.js
import axios from "axios";

export async function createZoomMeeting({ topic, startTime, duration }) {
  const tokenRes = await axios.post(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
    {},
    {
      auth: {
        username: process.env.ZOOM_CLIENT_ID,
        password: process.env.ZOOM_CLIENT_SECRET,
      },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  const accessToken = tokenRes.data.access_token;
  if (!accessToken) {
    throw new Error("Failed to obtain access token");
  }

  const meetingRes = await axios.post(
  `https://api.zoom.us/v2/users/me/meetings`,
  {
    topic,
    type: 2, 
    start_time: startTime,
    duration,
    timezone: "Asia/Kolkata",
    password: "ABCD",
    agenda: "doctor-patient meeting",
    settings: {
      join_before_host: true,
      approval_type: 0,
      waiting_room: false,
    },
  },
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  }
);


  return meetingRes.data;
}
