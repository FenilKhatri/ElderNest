import CaregiverAuthBG from "../../../assets/images/other/caregiverauthbg.avif";
import AuthBackground from "../../ui/AuthBackground";

const CaregiverAuthBackground = () => {
  return (
    <AuthBackground
      AuthBG={CaregiverAuthBG}
      Description="Joining ElderNest helped me connect with families who truly value care. It’s not just a job — it’s meaningful work with dignity and trust."
      PersonName="Anita Sharma"
      PersonDesignation="Professional Caregiver, Mumbai"
    />
  );
};

export default CaregiverAuthBackground;
