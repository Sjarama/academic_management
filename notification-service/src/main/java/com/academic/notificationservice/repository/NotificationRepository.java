package com.academic.notificationservice.repository;

import com.academic.notificationservice.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findBySent(boolean sent);
    List<Notification> findByType(String type);
}
