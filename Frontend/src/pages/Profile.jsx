import { useContext } from "react";
import UserContext from "../contexts/userContext";
import ProfileCard from "../components/ProfileCard";
import { useDispatch, useSelector } from "react-redux";


function Profile() {
    const { user, loading, serverErrors } = useContext(UserContext)

    console.log(user);



    return (
        <>
            {loading && <p> loading...</p>}
            {user && (
                <ProfileCard user={user} />
            )}
        </>
    )
}

export default Profile;