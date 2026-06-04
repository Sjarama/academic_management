package com.academic.paymentservice.service;

import com.academic.paymentservice.model.Payment;
import com.academic.paymentservice.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository repository;

    public List<Payment> findAll() {
        return repository.findAll();
    }

    public Optional<Payment> findById(Long id) {
        return repository.findById(id);
    }

    public Payment save(Payment payment) {
        return repository.save(payment);
    }

    public Optional<Payment> update(Long id, Payment incoming) {
        return repository.findById(id).map(existing -> {
            existing.setStudentId(incoming.getStudentId());
            existing.setCourseId(incoming.getCourseId());
            existing.setAmount(incoming.getAmount());
            existing.setStatus(incoming.getStatus());
            existing.setDueDate(incoming.getDueDate());
            return repository.save(existing);
        });
    }

    public boolean delete(Long id) {
        if (!repository.existsById(id)) return false;
        repository.deleteById(id);
        return true;
    }
}
