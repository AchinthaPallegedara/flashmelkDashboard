import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <Image
        src="/logo.svg"
        alt="Logo"
        width={200}
        height={64}
        draggable={false}
        className="flex dark:hidden"
      />
      <Image
        src="/logowhite.svg"
        alt="Logo"
        width={200}
        height={64}
        draggable={false}
        className="hidden dark:flex"
      />
    </Link>
  );
};

export default Logo;
