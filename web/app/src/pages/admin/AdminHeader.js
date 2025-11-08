import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './admin.css';
import UndoIcon from '@mui/icons-material/Undo';

const AdminHeader = ({ countdown = 0 }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

   

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60).toString().padStart(2, '0');
        const sec = (seconds % 60).toString().padStart(2, '0');
        return `${min}:${sec}`;
    };

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminName');
        navigate('/settings');
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    const isActive = (path) => {
        if (path === '/adminOtherData') {
            return location.pathname === path || location.pathname.startsWith('/manage/');
        }
        return location.pathname === path;
    };

    return (
        <>
            <div className="admin-header" id="admin-header">
                <h1 id="text-h1">
                    CHANGE TOOL DASHBOARD ⏱<span className='text-black'>{formatTime(countdown)}</span>
                </h1>
                <div className="admin-info">
                    <span>สวัสดี, {localStorage.getItem('adminName') || 'ผู้ดูแลระบบ'}</span>
                    <button
                      onClick={confirmLogout} 
                      className="btn btn-danger"> <UndoIcon/> Back</button>
                </div>
            </div>

            {showLogoutConfirm && (
                <div className="confirmation-overlay">
                    <div className="confirmation-box">
                        <h3>ยืนยันการออกจากระบบ</h3>
                        <p>คุณต้องการออกจากระบบใช่หรือไม่?</p>
                        <div className="confirmation-buttons">
                            <button onClick={confirmLogout} className="confirm-button">ใช่, ออกจากระบบ</button>
                            <button onClick={cancelLogout} className="cancel-button">ยกเลิก</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminHeader;
