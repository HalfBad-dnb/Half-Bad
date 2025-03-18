package com.Pirk.Pirk.models;

public class ConfirmationData {
    private String confirmationCode;
    private boolean confirmed;

    // Constructor
    public ConfirmationData(String confirmationCode, boolean confirmed) {
        this.confirmationCode = confirmationCode;
        this.confirmed = confirmed;
    }

    // Getters and Setters
    public String getConfirmationCode() {
        return confirmationCode;
    }

    public void setConfirmationCode(String confirmationCode) {
        this.confirmationCode = confirmationCode;
    }

    public boolean isConfirmed() {
        return confirmed;
    }

    public void setConfirmed(boolean confirmed) {
        this.confirmed = confirmed;
    }
}
