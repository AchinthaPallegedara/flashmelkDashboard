import { Loader } from "lucide-react";

const loading = () => {
  return (
    <div className="flex w-full h-[80vh] items-center  justify-center animate-spin">
      <Loader />
    </div>
  );
};

export default loading;
