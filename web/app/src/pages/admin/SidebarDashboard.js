// SidebarDashboard.jsx
import React from 'react';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom'; // ✅ import useNavigate
import UndoIcon from '@mui/icons-material/Undo';

const SidebarDashboard = ({ selectedTab, setSelectedTab }) => {
    const handleTabClick = (tab) => {
        setSelectedTab(tab);  // ✅ อัปเดตจาก props ไม่ใช่ local useState
    };

     const navigate = useNavigate(); // ✅ useNavigate สำหรับ back

    return (
        <div className="sidebar-dash">
            <div className="sidebar-header-dash">
                <h2 className='fw-bold text-white text-center'>MC TYPE</h2>
            </div>
            <ul className="sidebar-list-dash">
                {['CH', 'CS', 'SB', 'TN', 'TBM', 'TBS', 'TTC', 'TB', 'TCH'].map(tab => (
                    <li 
                        key={tab} 
                        className={selectedTab === tab ? 'active' : ''} 
                        onClick={() => handleTabClick(tab)}>
                        {tab}
                    </li>
                ))}
                <li>
                   <button
                        className='btn btn-danger mt-3'
                        onClick={() => navigate('/AdminDashboard')}
                    >
                        <UndoIcon/>BACK
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default SidebarDashboard;

