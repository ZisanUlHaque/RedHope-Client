import React from 'react';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';


const MydDnationRequests = () => {
    const {user} = useAuth();
    const axiosSecure = useAxiosSecure();

    const {data: request = [] } = useQuery({
        queryKey:['myRequest', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/donation-requests?email=${user.email}`)
            return res.data;
        }
    })
    return (
        <div>
            <h1>my-donation-requests: {request.length}</h1>
        </div>
    );
};

export default MydDnationRequests;