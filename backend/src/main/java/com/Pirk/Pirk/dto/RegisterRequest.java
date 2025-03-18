package com.Pirk.Pirk.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

  @NotNull
  @Size(min = 3, max = 50)
  private String username;

  @NotNull
  @Email
  private String email;

  @NotNull
  @Size(min = 8)
  private String password;

  private String firstName;
  private String lastName;
  private String address;
  private String phoneNumber;
}
