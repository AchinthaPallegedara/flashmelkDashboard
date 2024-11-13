import Image from "next/image";

const Logo = () => {
  return (
    <>
      <Image
        src="/logo.svg"
        alt="Logo"
        width={200}
        height={64}
        draggable={false}
      />
    </>
  );
};

export default Logo;
