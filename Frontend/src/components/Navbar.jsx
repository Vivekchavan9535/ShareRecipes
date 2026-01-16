import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'
import SearchInput from '././SearchInput';
import { useContext } from 'react';
import UserContext from '../contexts/userContext';
import profileImg from "../assets/profileImg.png"

function Navbar() {
    const navigate = useNavigate()
    const { isLoggedIn, handleLogout } = useContext(UserContext);


    return (
        <nav className="bg-slate-900/95 backdrop-blur-md text-white z-20 w-full fixed shadow-lg border-b border-white/5">
            <ul className='flex items-center justify-between px-6 py-3'>
                <div onClick={() => navigate("/")} className='flex items-center gap-3 cursor-pointer'>
                    <li>
                        <img className='h-12  hover:opacity-80 transition-opacity' src={logo} alt="Logo" />
                    </li>
                    <li className='text-2xl font-bold italic'>
                        Recipio
                    </li>
                </div>
                <li className="flex-1 max-w-2xl mx-10">
                    <SearchInput />
                </li>

                <div className='flex items-center gap-6 '>
                    {isLoggedIn && (
                        <div onClick={() => navigate("/profile")} className='h-10 w-10 ring-2 ring-emerald-500/20 rounded-full overflow-hidden cursor-pointer hover:ring-emerald-500/50 transition-all'>
                            <img className='h-full w-full object-cover' src={profileImg} alt="Profile" />
                        </div>
                    )}
                    <li className=''>
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-full font-bold text-sm transition-all shadow-md active:scale-95"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate("/login")}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full font-bold text-sm transition-all shadow-md active:scale-95"
                            >
                                Login
                            </button>
                        )}
                    </li>
                </div>
            </ul>
        </nav>
    )
}

export default Navbar;