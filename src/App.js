import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [customers, setCustomers] = useState([]);
    const [formData, setFormData] = useState({
        phoneNumber: '',
        firstName: '',
        lastName: '',
        email: '',
        address: {
            street: '',
            city: '',
            state: '',
            zip: ''
        },
        currentOrganization: ''
    });

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/customers');
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            address: {
                ...formData.address,
                [name]: value
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/customers', formData);
            fetchCustomers();
        } catch (error) {
            console.error('Error saving customer:', error);
        }
    };

    const handlePushToCRM = async (customer) => {
        try {
            await axios.post('http://localhost:3000/api/push-to-crm', customer);
            alert('Customer pushed to CRM successfully!');
        } catch (error) {
            console.error('Error pushing to CRM:', error);
        }
    };

    return (
        <div className="App">
            <h1>Customer Information</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleInputChange} required />
                <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} required />
                <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
                <input type="text" name="street" placeholder="Street" value={formData.address.street} onChange={handleAddressChange} />
                <input type="text" name="city" placeholder="City" value={formData.address.city} onChange={handleAddressChange} />
                <input type="text" name="state" placeholder="State" value={formData.address.state} onChange={handleAddressChange} />
                <input type="text" name="zip" placeholder="ZIP/Postal Code" value={formData.address.zip} onChange={handleAddressChange} />
                <input type="text" name="currentOrganization" placeholder="Current Organization" value={formData.currentOrganization} onChange={handleInputChange} />
                <button type="submit">Submit</button>
            </form>

            <h2>Customer List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Organization</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer, index) => (
                        <tr key={index}>
                            <td>{customer.firstName} {customer.lastName}</td>
                            <td>{customer.email}</td>
                            <td>{customer.phoneNumber}</td>
                            <td>{`${customer.address.street}, ${customer.address.city}, ${customer.address.state}, ${customer.address.zip}`}</td>
                            <td>{customer.currentOrganization}</td>
                            <td><button onClick={() => handlePushToCRM(customer)}>Push to CRM</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
