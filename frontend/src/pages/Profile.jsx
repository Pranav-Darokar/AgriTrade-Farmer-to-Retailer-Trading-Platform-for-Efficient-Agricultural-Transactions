import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Phone, Mail, Shield, Camera, Save, X, Edit2 } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                mobileNumber: user.mobileNumber || '',
                address: user.address || '',
                gender: user.gender || '',
                dateOfBirth: user.dateOfBirth || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const token = user.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            // Update Profile Details
            await axios.put(`http://localhost:8080/api/users/${user.id}`, formData, config);

            // Upload Photo if selected
            let photoUrl = user.profilePhoto;
            if (selectedFile) {
                const formDataImage = new FormData();
                formDataImage.append("file", selectedFile);

                const uploadResponse = await axios.post(
                    `http://localhost:8080/api/users/${user.id}/photo`,
                    formDataImage,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                photoUrl = uploadResponse.data.message; // Controller returns URL in message
            }

            // Update local user context
            const updatedUser = { ...user, ...formData, profilePhoto: photoUrl };
            updateUser(updatedUser);

            setIsEditing(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="bg-green-600 h-32 w-full relative">
                    <div className="absolute -bottom-16 left-8 group">
                        <div className="h-32 w-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden relative">
                            {previewUrl || user.profilePhoto ? (
                                <img
                                    src={previewUrl || `http://localhost:8080${user.profilePhoto}`}
                                    alt="Profile"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <User className="h-16 w-16 text-gray-400" />
                            )}

                            {isEditing && (
                                <label className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="h-8 w-8 text-white" />
                                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                </label>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-20 pb-8 px-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{isEditing ? 'Edit Profile' : (user.fullName || user.email)}</h1>
                            {!isEditing && user.fullName && (
                                <p className="text-sm text-gray-500">{user.email}</p>
                            )}
                        </div>

                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setSelectedFile(null);
                                        setPreviewUrl(null);
                                    }}
                                    className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                                >
                                    {loading ? 'Saving...' : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {message.text && (
                        <div className={`mb-4 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                                <input
                                    type="text"
                                    name="mobileNumber"
                                    value={formData.mobileNumber}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Display Mode - Same as before but cleaner */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Personal Information</h3>
                                <dl className="space-y-4">
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-500">Gender</dt>
                                        <dd className="text-sm font-medium text-gray-900">{user.gender || 'Not specified'}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-500">Date of Birth</dt>
                                        <dd className="text-sm font-medium text-gray-900">{user.dateOfBirth || 'Not specified'}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-500">Aadhaar Number</dt>
                                        <dd className="text-sm font-medium text-gray-900">{user.aadhaarNumber || 'N/A'}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-500">Licence No.</dt>
                                        <dd className="text-sm font-medium text-gray-900">{user.licenceNumber || 'N/A'}</dd>
                                    </div>
                                </dl>

                                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 pt-4">Contact Details</h3>
                                <dl className="space-y-4">
                                    <div className="flex items-center">
                                        <Phone className="h-5 w-5 mr-3 text-gray-400" />
                                        <div>
                                            <dt className="text-xs text-gray-400 uppercase">Mobile</dt>
                                            <dd className="text-sm font-medium text-gray-900">{user.mobileNumber || user.contactInfo || 'N/A'}</dd>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Mail className="h-5 w-5 mr-3 text-gray-400" />
                                        <div>
                                            <dt className="text-xs text-gray-400 uppercase">Email</dt>
                                            <dd className="text-sm font-medium text-gray-900">{user.email}</dd>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        {/* Placeholder for address icon */}
                                        <div className="mt-1 mr-3 h-5 w-5"></div>
                                        <div>
                                            <dt className="text-xs text-gray-400 uppercase">Address</dt>
                                            <dd className="text-sm font-medium text-gray-900">{user.address || 'Not specified'}</dd>
                                        </div>
                                    </div>
                                </dl>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg h-fit">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Stats</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded shadow-sm text-center">
                                        <p className="text-2xl font-bold text-green-600">Active</p>
                                        <p className="text-xs text-gray-500">Account Status</p>
                                    </div>
                                    <div className="bg-white p-4 rounded shadow-sm text-center">
                                        <p className="text-2xl font-bold text-green-600">
                                            <Shield className="h-6 w-6 mx-auto mb-1" />
                                        </p>
                                        <p className="text-xs text-gray-500 uppercase">{user.roles && user.roles.join(', ')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div >
            </div >
        </div >
    );
};

export default Profile;
