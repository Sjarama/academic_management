package com.academic.notificationservice.config;

import com.academic.notificationservice.model.Notification;
import com.academic.notificationservice.repository.NotificationRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class NotificationDataInitializer implements ApplicationRunner {

    private final NotificationRepository repository;

    public NotificationDataInitializer(NotificationRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (repository.count() > 0) return;

        repository.save(buildNotification("ana.perez@example.com",
                "Tu pago del mes de junio está pendiente. Monto: $50.000", "PAGO", false, null));

        repository.save(buildNotification("carlos.lopez@example.com",
                "Te has inscrito exitosamente en el curso de Programación", "INSCRIPCION", true, LocalDateTime.now().minusDays(3)));

        repository.save(buildNotification("maria.gomez@example.com",
                "Recordatorio: examen de Matemáticas el próximo lunes", "RECORDATORIO", true, LocalDateTime.now().minusDays(1)));

        repository.save(buildNotification("ana.perez@example.com",
                "Tu calificación en Historia ha sido registrada: 6.5", "CALIFICACION", true, LocalDateTime.now().minusHours(5)));

        repository.save(buildNotification("carlos.lopez@example.com",
                "El curso de Álgebra tiene cupos disponibles. ¡Inscríbete ahora!", "INFORMACION", false, null));
    }

    private Notification buildNotification(String recipient, String message, String type, boolean sent, LocalDateTime sentAt) {
        Notification n = new Notification();
        n.setRecipient(recipient);
        n.setMessage(message);
        n.setType(type);
        n.setSent(sent);
        n.setSentAt(sentAt);
        return n;
    }
}
