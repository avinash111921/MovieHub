import React, { useState, useEffect, useContext, useRef } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';

const UserProfile = () => {
    const { user, fetchUserProfile, loading } = useContext(ShopContext);
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
        fetchUserProfile();
    }, []);

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
            const formDataToSend = new FormData();
            formDataToSend.append('fullname', formData.fullname);
            formDataToSend.append('email', formData.email);
            if (formData.username) {
                formDataToSend.append('username', formData.username);
            }

            const response = await axios.patch('/api/v1/users/update-account', formDataToSend);
            toast.success('Profile updated successfully');
            fetchUserProfile();
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

            const response = await axios.patch('/api/v1/users/avatar', formDataToSend);
            toast.success('Avatar updated successfully');
            fetchUserProfile();
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

            const response = await axios.patch('/api/v1/users/cover-image', formDataToSend);
            toast.success('Cover image updated successfully');
            fetchUserProfile();
            setCoverPreview(null);
            setFormData(prev => ({ ...prev, coverImage: null }));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update cover image');
        } finally {
            setUpdating(false);
        }
    };

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
                    
                    {/* Personal Info Form */}
                    <form onSubmit={handleUpdateProfile} className="mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="fullname"
                                    value={formData.fullname}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        
                        <div className="mt-4">
                            <button
                                type="submit"
                                disabled={updating}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {updating ? 'Updating...' : 'Update Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfile; 