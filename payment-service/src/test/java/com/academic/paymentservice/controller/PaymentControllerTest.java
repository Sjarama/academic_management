package com.academic.paymentservice.controller;

import com.academic.paymentservice.model.Payment;
import com.academic.paymentservice.repository.PaymentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentControllerTest {

    @Mock
    PaymentRepository paymentRepository;

    @InjectMocks
    PaymentController controller;

    private Payment buildPayment(Long id, Long studentId, String status) {
        Payment p = new Payment();
        p.setId(id);
        p.setStudentId(studentId);
        p.setCourseId(1L);
        p.setAmount(BigDecimal.valueOf(50000));
        p.setStatus(status);
        p.setDueDate(LocalDate.now().plusDays(10));
        return p;
    }

    @Test
    void getAllPayments_returnsList() {
        Payment p = buildPayment(1L, 1L, "Pagado");
        when(paymentRepository.findAll()).thenReturn(List.of(p));

        List<Payment> result = controller.getAllPayments();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStatus()).isEqualTo("Pagado");
    }

    @Test
    void getAllPayments_empty_returnsEmptyList() {
        when(paymentRepository.findAll()).thenReturn(List.of());

        assertThat(controller.getAllPayments()).isEmpty();
    }

    @Test
    void getPaymentById_existing_returnsPayment() {
        Payment p = buildPayment(1L, 1L, "Pendiente");
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(p));

        Payment result = controller.getPaymentById(1L);

        assertThat(result.getStatus()).isEqualTo("Pendiente");
    }

    @Test
    void getPaymentById_missing_throwsNotFound() {
        when(paymentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> controller.getPaymentById(99L))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode())
                        .isEqualTo(HttpStatus.NOT_FOUND));
    }

    @Test
    void createPayment_setsNullIdAndSaves() {
        Payment toCreate = buildPayment(5L, 2L, "Pendiente");
        Payment saved = buildPayment(1L, 2L, "Pendiente");
        when(paymentRepository.save(any())).thenReturn(saved);

        Payment result = controller.createPayment(toCreate);

        verify(paymentRepository).save(argThat(p -> p.getId() == null));
        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    void updatePayment_existing_updatesAllFields() {
        Payment existing = buildPayment(1L, 1L, "Pendiente");
        Payment update = buildPayment(null, 2L, "Pagado");
        update.setCourseId(3L);
        update.setAmount(BigDecimal.valueOf(75000));
        update.setDueDate(LocalDate.now().plusDays(30));

        when(paymentRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(paymentRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Payment result = controller.updatePayment(1L, update);

        assertThat(result.getStatus()).isEqualTo("Pagado");
        assertThat(result.getStudentId()).isEqualTo(2L);
        assertThat(result.getAmount()).isEqualByComparingTo(BigDecimal.valueOf(75000));
    }

    @Test
    void updatePayment_missing_throwsNotFound() {
        when(paymentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> controller.updatePayment(99L, new Payment()))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode())
                        .isEqualTo(HttpStatus.NOT_FOUND));
    }

    @Test
    void deletePayment_existing_returnsNoContent() {
        when(paymentRepository.existsById(1L)).thenReturn(true);

        var response = controller.deletePayment(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(paymentRepository).deleteById(1L);
    }

    @Test
    void deletePayment_missing_throwsNotFound() {
        when(paymentRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> controller.deletePayment(99L))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode())
                        .isEqualTo(HttpStatus.NOT_FOUND));
    }
}
