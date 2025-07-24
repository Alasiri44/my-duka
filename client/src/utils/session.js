import { setUser, clearUser } from "../redux/slices/authSlice";

async function CheckSession(dispatch) {
  try {
    const res = await fetch("http://127.0.0.1:5000/check-session", {
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      dispatch(setUser(data));
    } else {
      dispatch(clearUser());
    }
  } catch (err) {
    console.error("User not logged in:", err);
    dispatch(clearUser());
  }
}

export default CheckSession;
