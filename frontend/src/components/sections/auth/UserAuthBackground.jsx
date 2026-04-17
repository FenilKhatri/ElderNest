import UserAuthBG from "../../../assets/images/other/userauthbg.avif";
import AuthBackground from "../../ui/AuthBackground";

const UserAuthBackground = () => {
  return (
    <AuthBackground
      AuthBG={UserAuthBG}
      Description="ElderNest found us the perfect caregiver for my father. The peace of mind knowing he's in safe, verified hands is truly priceless."
      PersonName="Sarah Jenkins"
      PersonDesignation="Family Caregiver, Portland"
    />
  );
};

export default UserAuthBackground;
