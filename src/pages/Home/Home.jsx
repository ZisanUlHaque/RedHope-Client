import React from 'react';
import Banner from './Banner';
import QuickSteps from './QuickSteps';
import ContactUs from './ContactUs';
import Divider from './Divider';
import HowItWorks from './HowItWorks';
import BloodDonationFeatures from './BloodDonationFeatures';


const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <QuickSteps></QuickSteps>
            <ContactUs></ContactUs>
            <Divider></Divider>
            <HowItWorks></HowItWorks>
            <BloodDonationFeatures></BloodDonationFeatures>
        </div>
    );
};

export default Home;