package com.academic.notificationservice.config;

import com.academic.notificationservice.model.Notification;
import com.academic.notificationservice.repository.NotificationRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class NotificationDataInitializer implements ApplicationRunner {

    private final NotificationRepository notificationRepository;

    public NotificationDataInitializer(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (notificationRepository.count() > 0) {
            return;
        }

        notificationRepository.save(createNotification("ana.perez@example.com", "Tu pago está pendiente.", "PAYMENT", false));
        notificationRepository.save(createNotification("carlos.lopez@example.com", "Curso Programación actualizado.", "COURSE", true));
        notificationRepository.save(createNotification("maria.gomez@example.com", "Inscripción en Historia confirmada.", "ENROLLMENT", true));
    }

    private Notification createNotification(String recipient, String message, String type, boolean sent) {
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setMessage(message);
        notification.setType(type);
        notification.setSent(sent);
        return notification;
    }
}
