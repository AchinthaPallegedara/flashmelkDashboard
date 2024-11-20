import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  );
};

export default Loading;
