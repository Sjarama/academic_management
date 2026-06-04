package com.academic.paymentservice.config;

import com.academic.paymentservice.model.Payment;
import com.academic.paymentservice.repository.PaymentRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Random;

@Component
public class PaymentDataInitializer implements ApplicationRunner {

    private final PaymentRepository paymentRepository;
    private final Random random = new Random();

    public PaymentDataInitializer(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (paymentRepository.count() > 0) {
            return;
        }

        String[] statuses = {"PENDING", "PAID", "OVERDUE"};

        for (int i = 1; i <= 20; i++) {
            Long studentId = (long) (random.nextInt(70) + 1);
            Long courseId = (long) (random.nextInt(20) + 1);
            BigDecimal amount = BigDecimal.valueOf(50000 + random.nextInt(151000)).setScale(2, BigDecimal.ROUND_HALF_UP);
            String status = statuses[random.nextInt(statuses.length)];
            LocalDate dueDate = LocalDate.now().plusDays(random.nextInt(60) - 15);
            paymentRepository.save(createPayment(studentId, courseId, amount, status, dueDate));
        }
    }

    private Payment createPayment(Long studentId, Long courseId, BigDecimal amount, String status, LocalDate dueDate) {
        Payment payment = new Payment();
        payment.setStudentId(studentId);
        payment.setCourseId(courseId);
        payment.setAmount(amount);
        payment.setStatus(status);
        payment.setDueDate(dueDate);
        return payment;
    }
}
