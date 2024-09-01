import { Button } from "@/components/ui/button";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div>
      <p>Landing</p>
      <div>
        <Link href="/sign-in">
          <Button>LogIn</Button>
        </Link>
        <Link href="/sign-up">
          <Button>SignUp</Button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
