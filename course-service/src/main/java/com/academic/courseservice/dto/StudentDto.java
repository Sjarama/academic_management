package com.academic.courseservice.dto;

public record StudentDto(Long id,
                         String firstName,
                         String lastName,
                         String email,
                         String phone,
                         String address) {
}
