package com.academic.notificationservice.controller;

import com.academic.notificationservice.model.Notification;
import com.academic.notificationservice.service.NotificationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationControllerTest {

    @Mock
    NotificationService service;

    @InjectMocks
    NotificationController controller;

    private Notification buildNotification(Long id, String recipient, boolean sent) {
        Notification n = new Notification();
        n.setId(id);
        n.setRecipient(recipient);
        n.setMessage("Mensaje de prueba para " + recipient);
        n.setType("PAGO_PENDIENTE");
        n.setSent(sent);
        return n;
    }

    @Test
    void getAll_returnsList() {
        when(service.findAll()).thenReturn(List.of(
                buildNotification(1L, "a@test.com", true),
                buildNotification(2L, "b@test.com", false)
        ));

        List<Notification> result = controller.getAll();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getRecipient()).isEqualTo("a@test.com");
    }

    @Test
    void getAll_empty_returnsEmptyList() {
        when(service.findAll()).thenReturn(List.of());

        assertThat(controller.getAll()).isEmpty();
    }

    @Test
    void getById_existing_returnsOk() {
        Notification n = buildNotification(1L, "test@test.com", false);
        when(service.findById(1L)).thenReturn(Optional.of(n));

        var response = controller.getById(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().getRecipient()).isEqualTo("test@test.com");
    }

    @Test
    void getById_missing_returnsNotFound() {
        when(service.findById(99L)).thenReturn(Optional.empty());

        var response = controller.getById(99L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void create_returnsCreated() {
        Notification input = buildNotification(null, "nuevo@test.com", false);
        Notification saved = buildNotification(10L, "nuevo@test.com", false);
        when(service.save(any())).thenReturn(saved);

        var response = controller.create(input);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getId()).isEqualTo(10L);
    }

    @Test
    void update_existing_returnsOk() {
        Notification updated = buildNotification(1L, "updated@test.com", true);
        when(service.update(eq(1L), any())).thenReturn(Optional.of(updated));

        var response = controller.update(1L, buildNotification(null, "updated@test.com", true));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().isSent()).isTrue();
    }

    @Test
    void update_missing_returnsNotFound() {
        when(service.update(eq(99L), any())).thenReturn(Optional.empty());

        var response = controller.update(99L, new Notification());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void delete_existing_returnsNoContent() {
        when(service.delete(1L)).thenReturn(true);

        var response = controller.delete(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(service).delete(1L);
    }

    @Test
    void delete_missing_returnsNotFound() {
        when(service.delete(99L)).thenReturn(false);

        var response = controller.delete(99L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}
