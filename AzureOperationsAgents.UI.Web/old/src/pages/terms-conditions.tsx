import { Helmet } from 'react-helmet-async';
// sections
import {TermsAndConditionsView} from "../sections/terms-and-conditions/view";

// ----------------------------------------------------------------------

export default function TermsAndConditionsPage() {
  return (
    <>
      <Helmet>
        <title> Terms and Conditions</title>
      </Helmet>

      <TermsAndConditionsView />
    </>
  );
}
