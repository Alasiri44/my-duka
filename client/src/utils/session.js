import { setUser, clearUser } from "../redux/slices/authSlice";
import axios from "@/utils/axiosConfig";

async function CheckSession(dispatch) {
  try {
    const res = await axios.get("/check-session", {
      withCredentials: true,
    });

    if (res.status === 200) {
      dispatch(setUser(res.data));
    } else {
      dispatch(clearUser());
    }
  } catch (err) {
    console.error("User not logged in:", err);
    dispatch(clearUser());
  }
}

export default CheckSession;