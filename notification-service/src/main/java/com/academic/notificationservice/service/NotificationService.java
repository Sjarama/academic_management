package com.academic.notificationservice.service;

import com.academic.notificationservice.model.Notification;
import com.academic.notificationservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository repository;

    public List<Notification> findAll() {
        return repository.findAll();
    }

    public Optional<Notification> findById(Long id) {
        return repository.findById(id);
    }

    public Notification save(Notification notification) {
        return repository.save(notification);
    }

    public Optional<Notification> update(Long id, Notification incoming) {
        return repository.findById(id).map(existing -> {
            existing.setRecipient(incoming.getRecipient());
            existing.setMessage(incoming.getMessage());
            existing.setType(incoming.getType());
            existing.setSent(incoming.isSent());
            return repository.save(existing);
        });
    }

    public boolean delete(Long id) {
        if (!repository.existsById(id)) return false;
        repository.deleteById(id);
        return true;
    }
}
