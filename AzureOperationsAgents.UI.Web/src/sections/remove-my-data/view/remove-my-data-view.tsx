import {useLocales} from "../../../locales";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import Divider from "@mui/material/Divider";

export default function RemoveMyDataView() {
  const {t} = useLocales();

  return (
    <Container maxWidth="md">
      <Box sx={{flexGrow: 1, mt: 4, mb: 4}}>
        <div id="remove-my-data">
          <h1>Remove My Data</h1>
          <p>
            At Colorea, we value your privacy and ensure that you have control over your personal data. If you wish to
            remove your data from our platform, follow the steps below. This process will permanently delete your
            personal information, associated content, and any related data.
          </p>

          <h2>What Data Will Be Removed?</h2>
          <p>When you request to remove your data, the following will be deleted:</p>
          <ul>
            <li>Your profile information (name, email, etc.).</li>
            <li>Any images or drawings stored in your account.</li>
            <li>Subscription details and associated metadata.</li>
            <li>Any other personal information related to your account.</li>
          </ul>

          <h2>How to Request Data Removal</h2>
          <p>To request the removal of your data:</p>
          <ol>
            <li><strong>Log in to Your Account:</strong> Ensure you are logged into your Colorea account.</li>
            <li>
              <strong>Go to Account Settings:</strong>
              <ul>
                <li>Navigate to the <strong>Account Settings</strong> section.</li>
                <li>Select <strong>Delete My Account</strong> or <strong>Remove My Data</strong>.</li>
              </ul>
            </li>
            <li>
              <strong>Confirm Deletion:</strong>
              <ul>
                <li>You will be asked to confirm your request.</li>
                <li>Follow the on-screen instructions to finalize the process.</li>
              </ul>
            </li>
          </ol>
          <p>
            Alternatively, you can contact us directly using the details provided below.
          </p>

          <h2>Contact Us for Data Removal</h2>
          <p>If you encounter any issues or prefer not to log in, you can request data removal by contacting us at:</p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:support@colorea.io">support@colorea.io</a></li>
            <li><strong>Phone:</strong> +353 87 1009671</li>
          </ul>
          <p>
            Please provide:
            <ul>
              <li>Your registered email address.</li>
              <li>A brief explanation of your request.</li>
            </ul>
            We will process your request within 30 days in compliance with applicable privacy regulations.
          </p>

          <h2>Important Notes</h2>
          <ul>
            <li><strong>Permanent Deletion:</strong> Once your data is removed, it cannot be recovered.</li>
            <li><strong>Legal Obligations:</strong> Certain data may be retained to comply with legal or regulatory
              requirements.
            </li>
            <li><strong>Third-Party Services:</strong> If you have shared your data with third-party integrations, you
              may need to contact those services separately.
            </li>
          </ul>

          <p>
            For more information, refer to our
            <a href="#">Privacy Policy</a> or <a href="#">Terms of Service</a>.
          </p>
        </div>
      </Box>
    </Container>
  );
}
