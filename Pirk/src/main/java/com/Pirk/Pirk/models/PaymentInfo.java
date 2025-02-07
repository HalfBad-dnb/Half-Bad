package com.Pirk.Pirk.models;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import java.util.Date;

@Data
@NoArgsConstructor
@ToString(exclude = "order") // Exclude order to prevent circular reference
@Entity
@Table(name = "payment_info")
public class PaymentInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cardholder_name", nullable = false)
    private String cardholderName;

    @Column(name = "last_four_digits", length = 4)
    private String lastFourDigits;

    @Column(name = "order_id", nullable = false, insertable = false, updatable = false)
    private Long orderId;

    @JsonBackReference
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "payment_status", nullable = false)
    private String paymentStatus;

    @Column(name = "payment_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date paymentDate;

    @Column(name = "buyer_id", nullable = false)
    private Long buyerId;

    @PrePersist
    protected void onCreate() {
        paymentDate = new Date();
        if (paymentStatus == null) {
            paymentStatus = "PENDING";
        }
    }
}
