import { useSelector } from "react-redux"   


const Profile = () => {
  const user = useSelector( state => state.authReducer.user)
  console.log(user) 
  return (
    <div>
      <h1> Profile Page </h1>
    </div>
  )
}

export default Profile