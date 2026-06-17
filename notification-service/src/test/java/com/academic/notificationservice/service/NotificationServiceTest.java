package com.academic.notificationservice.service;

import com.academic.notificationservice.model.Notification;
import com.academic.notificationservice.repository.NotificationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    NotificationRepository repository;

    @InjectMocks
    NotificationService service;

    private Notification buildNotification(Long id, String recipient, boolean sent) {
        Notification n = new Notification();
        n.setId(id);
        n.setRecipient(recipient);
        n.setMessage("Mensaje de prueba");
        n.setType("PAGO");
        n.setSent(sent);
        return n;
    }

    @Test
    void findAll_returnsAllNotifications() {
        Notification n = buildNotification(1L, "test@test.com", false);
        when(repository.findAll()).thenReturn(List.of(n));

        List<Notification> result = service.findAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getRecipient()).isEqualTo("test@test.com");
    }

    @Test
    void findAll_empty_returnsEmptyList() {
        when(repository.findAll()).thenReturn(List.of());

        assertThat(service.findAll()).isEmpty();
    }

    @Test
    void findById_existingId_returnsNotification() {
        Notification n = buildNotification(1L, "a@b.com", true);
        when(repository.findById(1L)).thenReturn(Optional.of(n));

        Optional<Notification> result = service.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getRecipient()).isEqualTo("a@b.com");
    }

    @Test
    void findById_missingId_returnsEmpty() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThat(service.findById(99L)).isEmpty();
    }

    @Test
    void save_notSent_doesNotSetSentAt() {
        Notification n = buildNotification(null, "x@y.com", false);
        when(repository.save(n)).thenReturn(n);

        Notification result = service.save(n);

        assertThat(result.getSentAt()).isNull();
        verify(repository).save(n);
    }

    @Test
    void save_sent_setsSentAt() {
        Notification n = buildNotification(null, "x@y.com", true);
        when(repository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Notification result = service.save(n);

        assertThat(result.getSentAt()).isNotNull();
    }

    @Test
    void save_sentWithExistingSentAt_doesNotOverrideSentAt() {
        Notification n = buildNotification(null, "x@y.com", true);
        LocalDateTime existingTime = LocalDateTime.of(2026, 1, 1, 10, 0);
        n.setSentAt(existingTime);
        when(repository.save(n)).thenReturn(n);

        Notification result = service.save(n);

        assertThat(result.getSentAt()).isEqualTo(existingTime);
    }

    @Test
    void update_existingId_updatesFields() {
        Notification existing = buildNotification(1L, "old@old.com", false);
        Notification incoming = buildNotification(null, "new@new.com", true);
        incoming.setMessage("Nuevo mensaje");
        incoming.setType("INSCRIPCION");

        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(repository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Optional<Notification> result = service.update(1L, incoming);

        assertThat(result).isPresent();
        assertThat(result.get().getRecipient()).isEqualTo("new@new.com");
        assertThat(result.get().getType()).isEqualTo("INSCRIPCION");
        assertThat(result.get().isSent()).isTrue();
    }

    @Test
    void update_missingId_returnsEmpty() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThat(service.update(99L, new Notification())).isEmpty();
        verify(repository, never()).save(any());
    }

    @Test
    void delete_existingId_deletesAndReturnsTrue() {
        when(repository.existsById(1L)).thenReturn(true);

        boolean result = service.delete(1L);

        assertThat(result).isTrue();
        verify(repository).deleteById(1L);
    }

    @Test
    void delete_missingId_returnsFalse() {
        when(repository.existsById(99L)).thenReturn(false);

        assertThat(service.delete(99L)).isFalse();
        verify(repository, never()).deleteById(any());
    }
}
