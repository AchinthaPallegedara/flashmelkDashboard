import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <Image
        src="https://img.flashme.lk/Blacklogo.png"
        alt="Logo"
        width={180}
        height={64}
        draggable={false}
        className="flex dark:hidden"
      />
      <Image
        src="https://img.flashme.lk/Whitelogo.png"
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
