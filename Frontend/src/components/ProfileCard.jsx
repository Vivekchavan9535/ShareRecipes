import { useContext, useState } from "react";
import UserContext from "../contexts/userContext";
import { useNavigate } from "react-router-dom";
import profileImg from "../assets/profileImg.png"

function ProfileCard({ user }) {
    const { handleDeleteAccount, handleUpdateProfile } = useContext(UserContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        username: user.username,
        email: user.email
    });

    const navigate = useNavigate()



    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await handleUpdateProfile(formData);
        if (success) {
            setIsModalOpen(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-xl shadow-sm p-6 mt-10">
            <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 border">
                    <img
                        src={profileImg}
                        alt="Profile"
                        className="h-full w-full object-cover"
                    />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">{user.username}</h2>
                    <p className="text-slate-500 font-medium">{user.email}</p>
                    <div className="mt-2 text-[10px] uppercase tracking-wider bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-black w-fit">
                        Member since {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>

            <div className="mt-8 border-t pt-6 flex justify-around text-center">
                <div
                    onClick={() => navigate("/myposts")}
                    className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors flex-1"
                >
                    <h3 className="text-lg font-bold text-gray-800">{user.posts?.length || 0}</h3>
                    <p className="text-sm text-gray-500">My Recipes</p>
                </div>
                <div className="border-l h-10 border-gray-200 self-center"></div>
                <div
                    onClick={() => navigate("/favorites")}
                    className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors flex-1"
                >
                    <h3 className="text-lg font-bold text-gray-800">{user.favorites?.length || 0}</h3>
                    <p className="text-sm text-gray-500">My Favorites</p>
                </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-md active:scale-95"
                >
                    Edit Profile
                </button>
                <button
                    onClick={handleDeleteAccount}
                    className="w-full py-2 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
                >
                    Delete Account
                </button>
            </div>

            {/* Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Username</label>
                                <input
                                    className="w-full mt-1 px-3 py-2 border rounded-lg outline-amber-500"
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <input
                                    className="w-full mt-1 px-3 py-2 border rounded-lg outline-amber-500"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-all shadow-lg"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfileCard;