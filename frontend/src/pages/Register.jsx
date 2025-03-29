import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext.jsx';

const Register = () => {
    const navigate = useNavigate();
    const { register: registerUser, loading } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        username: '',
        password: '',
        avatar: null,
        coverImage: null
    });
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);

    const handleChange = (e) => {
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
            } else if (name === 'coverImage') {
                setCoverPreview(previewUrl);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!formData.fullname || !formData.email || !formData.username || !formData.password) {
            toast.error('All fields are required');
            return;
        }

        if (!formData.avatar) {
            toast.error('Profile picture is required');
            return;
        }

        // Create FormData for file upload
        const formDataToSend = new FormData();
        formDataToSend.append('fullname', formData.fullname);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('username', formData.username);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('avatar', formData.avatar);
        if (formData.coverImage) {
            formDataToSend.append('coverImage', formData.coverImage);
        }

        const result = await registerUser(formDataToSend);
        
        if (result && result.success) {
            toast.success('Registration successful');
            navigate('/login');
        } else if (result && result.error) {
            toast.error(result.error);
        }
    };

    return (
        <div className="min-h-[calc(100vh-200px)] py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
                        Create your account
                    </h2>
                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign in
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6 col-span-full md:col-span-1">
                            <div>
                                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    id="fullname"
                                    name="fullname"
                                    type="text"
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-6 col-span-full md:col-span-1">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Profile Picture (Required)
                                </label>
                                <div className="mt-1 flex items-center space-x-4">
                                    {avatarPreview && (
                                        <img 
                                            src={avatarPreview} 
                                            alt="Avatar preview" 
                                            className="w-24 h-24 rounded-full object-cover"
                                        />
                                    )}
                                    <input
                                        type="file"
                                        name="avatar"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="mt-1 block w-full"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Cover Image (Optional)
                                </label>
                                <div className="mt-1 flex items-center space-x-4">
                                    {coverPreview && (
                                        <img 
                                            src={coverPreview} 
                                            alt="Cover preview" 
                                            className="w-32 h-16 object-cover rounded"
                                        />
                                    )}
                                    <input
                                        type="file"
                                        name="coverImage"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="mt-1 block w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register; 