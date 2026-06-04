package com.academic.userservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "students")
public class Student {

    public static final List<String> REGION_METROPOLITANA_COMUNAS = List.of(
            "Alhué", "Buin", "Calera de Tango", "Cerrillos", "Cerro Navia", "Colina",
            "Conchalí", "Curacaví", "El Bosque", "El Monte", "Estación Central", "Huechuraba",
            "Independencia", "Isla de Maipo", "La Cisterna", "La Florida", "La Granja",
            "La Pintana", "La Reina", "Lampa", "Las Condes", "Lo Barnechea", "Lo Espejo",
            "Lo Prado", "Macul", "Maipú", "María Pinto", "Melipilla", "Ñuñoa", "Padre Hurtado",
            "Paine", "Peñalolén", "Pedro Aguirre Cerda", "Peñaflor", "Providencia", "Pudahuel",
            "Puente Alto", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín",
            "San José de Maipo", "San Miguel", "San Pedro", "San Bernardo", "Santa María",
            "Santiago", "Vitacura", "Talagante", "Tiltil", "Pirque", "Puente Alto"
    );

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String firstName;

    @NotBlank
    @Column(nullable = false)
    private String lastName;

    @NotBlank
    @Email
    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    private String address;

    @NotBlank
    @Column(nullable = false)
    private String comuna;
}
