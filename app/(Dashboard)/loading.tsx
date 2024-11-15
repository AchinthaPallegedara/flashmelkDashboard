import { LoaderCircle } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <LoaderCircle className="animate-spin" />
    </div>
  );
};

export default Loading;
