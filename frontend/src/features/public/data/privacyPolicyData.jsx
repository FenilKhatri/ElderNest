import {
  Database,
  MonitorSmartphone,
  Activity,
  Share2,
  Lock,
  UserCheck,
  Link,
  Baby,
  History,
  Mail
} from "lucide-react";
import { CONTACT_INFO } from "../../../constants/ui/contactInfo";

export const sections = [
  {
    id: "information-collected",
    title: "Information we collect",
    icon: Database,
    content: (
      <>
        <p>
          At ElderNest, we collect information that helps us provide safe,
          reliable, and personalized eldercare services. This includes
          information you provide directly and information collected
          automatically while using our platform.
        </p>

        <h3>Personal Information</h3>
        <p>
          We may collect your name, email address, phone number, profile
          details, and other information submitted during account registration
          or while using our services.
        </p>

        <h3>Caregiver Information</h3>
        <p>
          Caregivers are required to provide additional details including
          certifications, experience, identity verification documents, service
          preferences, and availability schedules.
        </p>

        <h3>Booking Information</h3>
        <p>
          When a booking is made, we collect patient details, service
          requirements, emergency contacts, and location information necessary
          to facilitate care services.
        </p>
      </>
    ),
  },

  {
    id: "automatic-collection",
    title: "Information collected automatically",
    icon: MonitorSmartphone,
    content: (
      <>
        <p>
          We automatically collect certain technical and usage-related
          information to improve platform performance, user experience, and
          security.
        </p>

        <h3>Device Information</h3>
        <p>
          This may include your device type, operating system, browser version,
          IP address, and device identifiers.
        </p>

        <h3>Usage Analytics</h3>
        <p>
          We collect information about how users interact with our platform,
          including visited pages, session duration, clicks, and browsing
          behavior.
        </p>

        <h3>Cookies & Tracking</h3>
        <p>
          ElderNest uses cookies and similar technologies to remember user
          preferences, improve authentication, and analyze platform usage.
        </p>
      </>
    ),
  },

  {
    id: "how-we-use",
    title: "How we use your information",
    icon: Activity,
    content: (
      <>
        <p>
          The information we collect is used to operate, improve, and secure
          our services.
        </p>

        <h3>Service Delivery</h3>
        <p>
          We use your information to process bookings, connect users with
          caregivers, and provide customer support.
        </p>

        <h3>Communication</h3>
        <p>
          We may send notifications, emails, updates, booking confirmations,
          password reset links, and important service announcements.
        </p>

        <h3>Security & Verification</h3>
        <p>
          Information is used to verify caregiver identities, prevent fraud,
          monitor suspicious activities, and maintain platform safety.
        </p>

        <h3>Platform Improvements</h3>
        <p>
          Analytics and feedback help us improve our features, optimize
          performance, and enhance user experience.
        </p>
      </>
    ),
  },

  {
    id: "information-sharing",
    title: "How we share information",
    icon: Share2,
    content: (
      <>
        <p>
          ElderNest does not sell personal information to third parties.
          However, we may share information under limited circumstances.
        </p>

        <h3>With Caregivers</h3>
        <p>
          Relevant patient and booking information may be shared with caregivers
          to fulfill requested services.
        </p>

        <h3>With Service Providers</h3>
        <p>
          We may share data with trusted third-party providers such as cloud
          hosting providers, email services, analytics platforms, and payment
          providers.
        </p>

        <h3>Legal Compliance</h3>
        <p>
          Information may be disclosed when required by applicable law,
          regulation, legal process, or governmental request.
        </p>
      </>
    ),
  },

  {
    id: "data-security",
    title: "Data security",
    icon: Lock,
    content: (
      <>
        <p>
          We implement industry-standard security measures to protect your
          personal data from unauthorized access, disclosure, or misuse.
        </p>

        <h3>Encryption</h3>
        <p>
          Sensitive information is encrypted using secure SSL/TLS protocols
          during transmission.
        </p>

        <h3>Password Protection</h3>
        <p>
          Passwords are securely hashed using modern encryption algorithms and
          are never stored in plain text.
        </p>

        <h3>Access Control</h3>
        <p>
          Access to user information is restricted to authorized personnel only
          and monitored regularly.
        </p>

        <h3>Security Limitations</h3>
        <p>
          Although we strive to use commercially acceptable security measures,
          no online platform can guarantee complete security.
        </p>
      </>
    ),
  },

  {
    id: "privacy-rights",
    title: "Your privacy rights",
    icon: UserCheck,
    content: (
      <>
        <p>
          Users have rights regarding their personal information and account
          preferences.
        </p>

        <h3>Account Updates</h3>
        <p>
          You may update your profile information at any time through your
          account settings.
        </p>

        <h3>Account Deletion</h3>
        <p>
          You may request account deletion by contacting our support team.
          Certain information may be retained for legal or security purposes.
        </p>

        <h3>Marketing Preferences</h3>
        <p>
          You may opt out of promotional emails while continuing to receive
          essential service-related communications.
        </p>

        <h3>Cookie Preferences</h3>
        <p>
          Most browsers allow users to control cookies through browser
          settings.
        </p>
      </>
    ),
  },

  {
    id: "third-party-services",
    title: "Third-party services",
    icon: Link,
    content: (
      <>
        <p>
          Our platform may contain links or integrations with third-party
          services and providers.
        </p>

        <h3>Google Authentication</h3>
        <p>
          ElderNest supports Google OAuth login. When you use Google Sign-In,
          we receive basic profile information such as your name, email, and
          profile picture.
        </p>

        <h3>External Links</h3>
        <p>
          We are not responsible for the privacy practices or content of
          external websites linked from our platform.
        </p>

        <h3>Third-Party Policies</h3>
        <p>
          Users are encouraged to review the privacy policies of third-party
          services before interacting with them.
        </p>
      </>
    ),
  },

  {
    id: "childrens-privacy",
    title: "Children's privacy",
    icon: Baby,
    content: (
      <>
        <p>
          ElderNest services are intended for individuals aged 18 years or
          older. We do not knowingly collect personal information from children
          under 18 years of age.
        </p>

        <p>
          If we become aware that personal information from a child has been
          collected without parental consent, we will take appropriate steps to
          delete such information promptly.
        </p>
      </>
    ),
  },

  {
    id: "policy-changes",
    title: "Changes to this privacy policy",
    icon: History,
    content: (
      <>
        <p>
          We may update this Privacy Policy periodically to reflect changes in
          our practices, services, or legal obligations.
        </p>

        <p>
          Significant updates will be communicated through email notifications
          or notices displayed on the ElderNest platform.
        </p>

        <p>
          Continued use of the platform after policy updates constitutes
          acceptance of the revised Privacy Policy.
        </p>
      </>
    ),
  },

  {
    id: "contact",
    title: "Contact information",
    icon: Mail,
    content: (
      <>
        <p>
          If you have questions or concerns regarding this Privacy Policy or
          our data practices, please contact us:
        </p>

        <h3>Privacy Team</h3>
        <p>
          Email: {CONTACT_INFO.EMAIL}
          <br />
          Phone: {CONTACT_INFO.PHONE}
          <br />
        </p>
      </>
    ),
  },
];