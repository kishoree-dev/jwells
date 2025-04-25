import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import SummaryApi from '../common/apiConfig';
import Dashboard from '../components/admin/Dashboard';
import MyOrders from '../components/MyOrders';

const Profile = () => {
    const navigate = useNavigate();
    const { isAuthenticated, userRole } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        userId: ''
    });

    const [passwordChange, setPasswordChange] = useState({
        currentPassword: '',
        newPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [showAdminContent, setShowAdminContent] = useState(false);
    const [showOrders, setShowOrders] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchUserDetails();
    }, [isAuthenticated, navigate]);

    const fetchUserDetails = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                toast.error('User ID not found');
                return;
            }

            const response = await fetch(SummaryApi.userProfile.url, {
                method: SummaryApi.userProfile.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
                credentials: 'include'
            });
            const data = await response.json();

            if (data != null) {
                setUserDetails({
                    userId: data.user.id,
                    name: data.user.name,
                    email: data.user.email
                });
            }
            setLoading(false);

        } catch (error) {
            toast.error('Failed to fetch user details');
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordChange({
            ...passwordChange,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.updateProfile.url, {
                method: SummaryApi.updateProfile.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    userId: userDetails.userId,
                    currentPassword: passwordChange.currentPassword,
                    newPassword: passwordChange.newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Password updated successfully');
                setIsEditing(false);
                setPasswordChange({ currentPassword: '', newPassword: '' });
            } else {
                toast.error(data.message || 'Failed to update password');
            }
        } catch (error) {
            toast.error('Error connecting to server');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            {showAdminContent && userRole === 'admin' ? (
                <Dashboard onBackToProfile={() => setShowAdminContent(false)} />
            ) : (
                <div className="max-w-4xl mx-auto">
                    {!showOrders ? (
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl mb-6">
                            <div className="md:flex">
                                <div className="p-8 w-full relative">
                                    {isEditing && (
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="absolute top-4 right-4 px-3 py-1 rounded-md text-sm font-medium 
                                            text-red-600 hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <div className="mb-6">
                                        <div className="text-center mb-6">
                                            <div className="h-24 w-24 rounded-full bg-[#B4975A] mx-auto mb-4 flex items-center justify-center">
                                                <span className="text-3xl text-white font-bold">
                                                    {userDetails.name ? userDetails.name[0].toUpperCase() : '?'}
                                                </span>
                                            </div>
                                            <h2 className="text-xl font-semibold text-gray-800">{userDetails.name}</h2>
                                            <p className="text-gray-600">{userDetails.email}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            {!isEditing && (
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                                                    bg-[#41444B] hover:bg-[#FFD700] text-white shadow-md hover:shadow-lg"
                                                >
                                                    Change Password
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {isEditing ? (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                                                <input
                                                    type="password"
                                                    name="currentPassword"
                                                    value={passwordChange.currentPassword}
                                                    onChange={handlePasswordChange}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                                                    focus:border-[#B4975A] focus:ring-[#B4975A] sm:text-sm text-black"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">New Password</label>
                                                <input
                                                    type="password"
                                                    name="newPassword"
                                                    value={passwordChange.newPassword}
                                                    onChange={handlePasswordChange}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                                                    focus:border-[#B4975A] focus:ring-[#B4975A] sm:text-sm text-black"
                                                    required
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md
                                                shadow-sm text-sm font-medium text-white bg-[#B4975A] hover:bg-[#8B7355]
                                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B4975A]
                                                transition-colors duration-200 disabled:opacity-50"
                                            >
                                                {loading ? 'Updating Password...' : 'Update Password'}
                                            </button>
                                        </form>
                                    ) : null}

                                    {userRole === 'admin' && (
                                        <div className="mt-4">
                                            <button
                                                onClick={() => setShowAdminContent(!showAdminContent)}
                                                className="px-4 py-2 bg-[#41444B] text-white rounded-md hover:bg-black transition-colors"
                                            >
                                                {showAdminContent ? 'Back to Profile' : 'Open Admin Dashboard'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-4 border-t">
                                {/* <button
                                    onClick={() => setShowOrders(true)}
                                    className="px-4 py-2 bg-[#41444B] text-white rounded-md hover:bg-black transition-colors"
                                >
                                    View My Orders
                                </button> */}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <button
                                onClick={() => setShowOrders(false)}
                                className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Back to Profile
                            </button>
                            <MyOrders />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Profile;
