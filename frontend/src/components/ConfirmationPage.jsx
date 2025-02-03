import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";

function ConfirmationPage() {
    const { confirmationCode } = useParams();  // Get confirmation code from URL
    const [confirmationData, setConfirmationData] = useState(null);
    const [error, setError] = useState(null);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        const fetchConfirmationData = async () => {
            try {
                const response = await fetch(`http://localhost:8081/confirmation/${confirmationCode}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.json();
                setConfirmationData(data);
            } catch (error) {
                console.error('Error fetching confirmation data:', error);
                setError('Failed to fetch confirmation data');
                setTimeout(() => setRedirect(true), 3000);  // Redirect after 3 seconds
            }
        };

        if (confirmationCode) {
            fetchConfirmationData();
        }
    }, [confirmationCode]);

    if (redirect) {
        return <Navigate to="/" />;  // Redirect after error
    }

    if (error) {
        return (
            <div className="error-message">
                <p>{error}</p>
            </div>
        );
    }

    if (!confirmationData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="confirmation-page p-6 bg-gradient-to-r from-[#8B0000] to-[#000000] text-white">
            <h1>Confirmation Page</h1>
            <p>Confirmation Code: {confirmationData.confirmationCode}</p>
            <p>Status: {confirmationData.confirmed ? "Confirmed" : "Not Confirmed"}</p>
        </div>
    );
}

export default ConfirmationPage;
