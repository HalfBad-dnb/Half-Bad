package com.Pirk.Pirk.Controllers;

import com.Pirk.Pirk.models.Confirmation;
import com.Pirk.Pirk.models.Checkout;
import com.Pirk.Pirk.services.ConfirmationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/confirmation")
public class ConfirmationController {

    @Autowired
    private ConfirmationService confirmationService;

    // Endpoint to create confirmation for a checkout
    @PostMapping("/create")
    public ResponseEntity<Confirmation> createConfirmation(@RequestBody Checkout checkout) {
        Confirmation confirmation = confirmationService.createConfirmation(checkout);
        return ResponseEntity.status(HttpStatus.CREATED).body(confirmation);
    }

    // Endpoint to confirm an order using the confirmation code
    @GetMapping("/confirm/{confirmationCode}")
    public ResponseEntity<String> confirmOrder(@PathVariable String confirmationCode) {
        Confirmation confirmation = confirmationService.confirmOrder(confirmationCode);
        
        if (confirmation != null) {
            return ResponseEntity.ok("Order confirmed successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Confirmation code not found.");
        }
    }

    // Endpoint to get confirmation by confirmation code
    @GetMapping("/{confirmationCode}")
    public ResponseEntity<Confirmation> getConfirmation(@PathVariable String confirmationCode) {
        return confirmationService.getConfirmationByCode(confirmationCode)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
