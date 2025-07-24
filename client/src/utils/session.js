import { setUser, clearUser } from "../redux/slices/authSlice"

function CheckSession(dispatch){
    fetch('http://127.0.0.1:5000/check-session', {
        credentials: "include"
    })
    .then(res => res.json())
    .then(data => {
            console.log(data)
    })
    .catch(err => {
        console.error("User not logged in:" ,err)
        dispatch(clearUser())
    })
}

export default CheckSession