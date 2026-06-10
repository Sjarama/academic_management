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

        for (long studentId = 1; studentId <= 400; studentId++) {
            Payment payment = createPayment(studentId);
            paymentRepository.save(payment);
        }
    }

    private Payment createPayment(long studentId) {
        Payment payment = new Payment();
        payment.setStudentId(studentId);
        payment.setCourseId((long) (random.nextInt(20) + 1));
        payment.setAmount(generateAmount());
        payment.setStatus(generateStatus());
        payment.setDueDate(generateDueDate(payment.getStatus()));
        return payment;
    }

    private BigDecimal generateAmount() {
        int baseAmount = 30000 + random.nextInt(170001);
        int cents = random.nextInt(100);
        return BigDecimal.valueOf(baseAmount).add(BigDecimal.valueOf(cents, 2));
    }

    private String generateStatus() {
        return random.nextInt(100) < 68 ? "Pagado" : "Pendiente";
    }

    private LocalDate generateDueDate(String status) {
        int offsetDays = random.nextInt(41) - 20;
        LocalDate dueDate = LocalDate.now().plusDays(offsetDays);

        if ("Pagado".equalsIgnoreCase(status) && dueDate.isBefore(LocalDate.now())) {
            dueDate = LocalDate.now().plusDays(random.nextInt(15) + 1);
        }
        return dueDate;
    }
}
