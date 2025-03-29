import React, { useState, useEffect, useContext, useRef } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import ChangePassword from './ChangePassword.jsx';

const UserProfile = () => {
    const token = localStorage.getItem('token');
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
    const { user, fetchUserProfile, loading } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        username: '',
        avatar: null,
        coverImage: null
    });
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [updating, setUpdating] = useState(false);
    
    // Refs for file inputs
    const avatarInputRef = useRef(null);
    const coverImageInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setFormData({
                fullname: user.fullname || '',
                email: user.email || '',
                username: user.username || '',
                avatar: null,
                coverImage: null
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
            
            // Create preview URL
            const previewUrl = URL.createObjectURL(files[0]);
            if (name === 'avatar') {
                setAvatarPreview(previewUrl);
                // Auto-submit avatar form when file is selected
                setTimeout(() => handleUpdateAvatar(e), 100);
            } else if (name === 'coverImage') {
                setCoverPreview(previewUrl);
                // Auto-submit cover image form when file is selected
                setTimeout(() => handleUpdateCoverImage(e), 100);
            }
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdating(true);

        try {
            const formDataToSend = new URLSearchParams();
            formDataToSend.append('fullname', formData.fullname);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('username', formData.username);
            
            await axios.patch(`${backendUrl}/api/v1/users/update-account`, formDataToSend, {
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success('Profile updated successfully');
            await fetchUserProfile();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    const handleUpdateAvatar = async (e) => {
        e.preventDefault();
        if (!formData.avatar) {
            return;
        }

        setUpdating(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('avatar', formData.avatar);

            await axios.patch(`${backendUrl}/api/v1/users/avatar`, formDataToSend, {
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success('Avatar updated successfully');
            await fetchUserProfile();
            setAvatarPreview(null);
            setFormData(prev => ({ ...prev, avatar: null }));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update avatar');
        } finally {
            setUpdating(false);
        }
    };

    const handleUpdateCoverImage = async (e) => {
        e.preventDefault();
        if (!formData.coverImage) {
            return;
        }

        setUpdating(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('coverImage', formData.coverImage);

            await axios.patch(`${backendUrl}/api/v1/users/cover-image`, formDataToSend,{
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success('Cover image updated successfully');
            await fetchUserProfile();
            setCoverPreview(null);
            setFormData(prev => ({ ...prev, coverImage: null }));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update cover image');
        } finally {
            setUpdating(false);
        }
    };
    
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
    if (!user) return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;

    return (
        <div className="min-h-[calc(100vh-200px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white rounded-lg shadow overflow-hidden">
                {/* Cover Image Section */}
                <div className="relative h-60 bg-gray-200">
                    {user.coverImage && (
                        <img 
                            src={coverPreview || user.coverImage} 
                            alt="Cover" 
                            className="w-full h-full object-cover"
                        />
                    )}
                    
                    {/* Cover Image Update Button */}
                    <div className="absolute top-4 right-4">
                        <button 
                            onClick={() => coverImageInputRef.current.click()}
                            className="bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 text-gray-700 hover:text-gray-900 shadow-lg transition-all transform hover:scale-105"
                            disabled={updating}
                            type="button"
                        >
                            {updating ? 'Updating...' : 'Update Cover'}
                        </button>
                    </div>
                    
                    {/* Avatar positioned on the cover image */}
                    <div className="absolute -bottom-16 left-6">
                        <div className="relative h-32 w-32 rounded-full ring-4 ring-white overflow-hidden bg-white">
                            <img 
                                src={avatarPreview || user.avatar} 
                                alt={user.fullname} 
                                className="h-full w-full object-cover"
                            />
                            {/* Avatar Update Button */}
                            <div className="absolute bottom-0 inset-x-0 bg-black bg-opacity-50 text-white text-xs text-center py-1 cursor-pointer" onClick={() => avatarInputRef.current.click()}>
                                {updating ? 'Updating...' : 'Update'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Info Section */}
                <div className="mt-16 px-6 py-5">
                    <h1 className="text-3xl font-bold text-gray-900">{user.fullname}</h1>
                    <p className="text-gray-600">@{user.username}</p>
                    <p className="text-gray-600">{user.email}</p>
                </div>

                <div className="px-6 pb-8">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-900">Profile Settings</h2>
                    
                    {/* Hidden file inputs for direct image updates */}
                    <input
                        type="file"
                        name="avatar"
                        ref={avatarInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <input
                        type="file"
                        name="coverImage"
                        ref={coverImageInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />

                    {/* Profile Update Form */}
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div>
                            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                name="fullname"
                                id="fullname"
                                value={formData.fullname}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            />
                        </div>
                        
                        <div>
                            <button
                                type="submit"
                                disabled={updating}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {updating ? 'Updating...' : 'Update Profile'}
                            </button>
                        </div>
                    </form>
                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Security</h2>
                        <ChangePassword />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;