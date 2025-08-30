import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/ApiService';
import { useError } from '../common/ErrorDisplay';


const AdminUserRegistration = () => {

    // Use the error hook
    const { ErrorDisplay, showError } = useError();
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        address: '',
        roles: []
    });

    const availableRoles = [
        { value: 'ADMIN', label: 'Administrator' },
        { value: 'CUSTOMER', label: 'Customer' },
        { value: 'DELIVERY', label: 'Delivery Personnel' }
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (roleValue) => {
        setFormData(prev => {
            if (prev.roles.includes(roleValue)) {
                return { ...prev, roles: prev.roles.filter(r => r !== roleValue) };
            } else {
                return { ...prev, roles: [...prev.roles, roleValue] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.password || 
            !formData.phoneNumber || !formData.address) {
            showError('All fields except roles are required');
            return;
        }

        if (formData.roles.length === 0) {
            showError('Please select at least one role');
            return;
        }

        try {
            const response = await ApiService.registerUser(formData);
            if (response.statusCode === 200) {
                setFormData({
                    name: '', email: '', password: '', 
                    phoneNumber: '', address: '', roles: []
                });
                navigate('/admin'); // Redirect to admin page
            } else {
                showError(response.message);
            }
        } catch (error) {
            showError(error.response?.data?.message || error.message || 'Registration failed');
        }
    };

    return (
        <div className="admin-register-page">
            <div className="admin-register-card">
                <div className="admin-register-header">
                    <h2 className="admin-register-title">Register New User</h2>
                    <p className="admin-register-description">Create a new user account with specific roles</p>
                </div>

                <div className="admin-register-content">
                    <form className="admin-register-form" onSubmit={handleSubmit}>
                        <div className="admin-form-group">
                            <label className="admin-label">Full Name</label>
                            <input
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="User's full name"
                                className="admin-input"
                            />
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-label">Email</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="User's email"
                                className="admin-input"
                            />
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-label">Password</label>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Create password"
                                className="admin-input"
                            />
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-label">Phone Number</label>
                            <input
                                name="phoneNumber"
                                type="text"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                placeholder="Phone number"
                                className="admin-input"
                            />
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-label">Address</label>
                            <input
                                name="address"
                                type="text"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                placeholder="Full address"
                                className="admin-input"
                            />
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-label">Roles</label>
                            <div className="admin-roles-container">
                                {availableRoles.map(role => (
                                    <div 
                                        key={role.value} 
                                        className={`admin-role-checkbox ${formData.roles.includes(role.value) ? 'selected' : ''}`}
                                        onClick={() => handleRoleChange(role.value)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.roles.includes(role.value)}
                                            readOnly
                                            className="admin-role-input"
                                        />
                                        <span>{role.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <ErrorDisplay />

                        <button type="submit" className="admin-register-button">
                            Register User
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminUserRegistration;