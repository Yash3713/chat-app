/* eslint-disable react-hooks/exhaustive-deps */
import { Camera, Mail, User, X } from "lucide-react";
import { useAuthError, useAuthStore, useAuthUser, useIsUpdatingProfile } from "../store/useAuthStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const ProfilePage = () => {
const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const navigate = useNavigate();

  const authUser = useAuthUser();
  const isUpdatingProfile = useIsUpdatingProfile()
  const updateProfile = useAuthStore((s)=>s.updateProfile)
  const clearError = useAuthStore((s) => s.clearError);
  const error = useAuthError();

  // Clear store error when user edits form
    useEffect(() => {
      if (error) clearError();
    }, [error]);
    
  function handleImageUpload(e:  React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = async () => {
      const base64Image = reader.result;
      if (typeof base64Image !== "string") return;
      setSelectedImg(base64Image);
      const result = await updateProfile({ profilePicture: base64Image });
       if (result.success) {
      toast.success("Profile Updated successfully!");
    } else {
      toast.error(result.error ?? "Sign up failed");
      setSelectedImg("")
    }
    };
  }
  

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8 relative">
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 right-4 hover:opacity-70 transition"
          >
            <X className="w-5 h-5 cursor-pointer " />
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser?.profilePicture || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser?.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage