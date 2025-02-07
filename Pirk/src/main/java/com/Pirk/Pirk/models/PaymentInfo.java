package com.Pirk.Pirk.models;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import java.util.Date;
import java.math.BigDecimal;

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

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "payment_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date paymentDate;

    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "updated_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    @Column(name = "buyer_id", nullable = false)
    private Long buyerId;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @PrePersist
    protected void onCreate() {
        Date now = new Date();
        paymentDate = now;
        createdAt = now;
        updatedAt = now;
        if (paymentStatus == null) {
            paymentStatus = "PENDING";
        }
        if (status == null) {
            status = "PENDING";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }
}
