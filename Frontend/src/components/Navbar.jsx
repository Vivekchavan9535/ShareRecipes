import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'
import SearchInput from './SearchInput';
import { useContext } from 'react';
import UserContext from '../contexts/userContext';

function Navbar() {
    const navigate = useNavigate()
    const { isLoggedIn, handleLogout } = useContext(UserContext);


    return (
        <nav className="bg-black text-white  z-10 w-full fixed">
            <ul className='flex items-center justify-between px-5'>
                <li>
                    <img onClick={() => navigate("/")} className='h-15 cursor-pointer' src={logo} alt="" />
                </li>
                <li>
                    <SearchInput />
                </li>

                <div className='flex gap-5 '>
                    {isLoggedIn && (
                        <div onClick={() => navigate("/profile")} className='h-10 w-10 bg-white rounded-full overflow-hidden cursor-pointer'>
                            <img className='h-full w-full object-cover' src="https://tinyurl.com/yefpv6z9" alt="" />
                        </div>
                    )}
                    <li className='text-1xl bg-amber-300 px-4 rounded text-black font-semibold text-center py-2 cursor-pointer hover:bg-amber-400 transition-colors'>
                        {isLoggedIn ? (
                            <button onClick={handleLogout}>Logout</button>
                        ) : (
                            <button onClick={() => navigate("/login")}>Login</button>
                        )}
                    </li>
                </div>
            </ul>
        </nav>
    )
}

export default Navbar;