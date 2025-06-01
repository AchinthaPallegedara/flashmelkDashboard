import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <Image
        src="https://img.flashmelk.com/Blacklogo.png"
        alt="Logo"
        width={180}
        height={64}
        draggable={false}
        className="flex dark:hidden"
      />
      <Image
        src="https://img.flashmelk.com/Whitelogo.png"
        alt="Logo"
        width={180}
        height={64}
        draggable={false}
        className="hidden dark:flex"
      />
    </Link>
  );
};

export default Logo;
