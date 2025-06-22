import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/StoreProvider/store";
import { useNavigate } from "react-router-dom";
import { clearUser, logout, setSubscription } from "@/features/auth/model/authSlice";
import classes from "./ProfilePage.module.scss";

export const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      dispatch(clearUser()); 
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleUnsubscribe = () => {
    dispatch(setSubscription(false));
  };

  const handleSupportClick = () => {
    navigate("/support");
  };

  if (!user) {
    return null;
  }

  return (
    <div className={classes.profilePage}>
      <h2>Профиль</h2>
      <div className={classes.infoItem}>
        <b>Email:</b> {user.email}
      </div>
      <div className={classes.infoItem}>
        <b>Статус подписки:</b> <span className={classes.subscriptionStatus}>{user.isSubscribed ? "Подписка активна" : "Нет подписки"}</span>
      </div>
      {user.isSubscribed && (
        <button 
          onClick={handleUnsubscribe} 
          className={classes.unsubscribeButton}
        >
          Отменить подписку
        </button>
      )}
      
      <button 
        onClick={handleSupportClick} 
        className={classes.supportButton}
      >
        💬 Связаться с поддержкой
      </button>
      
      <button 
        onClick={handleLogout} 
        className={classes.logoutButton}
      >
        Выйти
      </button>
    </div>
  );
};

export default ProfilePage; 