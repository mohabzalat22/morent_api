import { User } from "lucide-react";

const Avatar = () => {
  return (
    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
      <User className="w-5 h-5 text-gray-500" />
    </div>
  );
};

export default Avatar;
