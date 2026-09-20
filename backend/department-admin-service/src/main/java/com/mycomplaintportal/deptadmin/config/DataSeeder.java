package com.mycomplaintportal.deptadmin.config;

import com.mycomplaintportal.deptadmin.entity.Department;
import com.mycomplaintportal.deptadmin.repository.DepartmentRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder {

    private final DepartmentRepository departmentRepository;

    private static final String OFFICER_EMAIL = "b.karthikeyan1000@gmail.com";

    @PostConstruct
    public void seedDepartments() {
        if (departmentRepository.count() > 0) {
            log.info("Departments already seeded ({} found). Skipping.", departmentRepository.count());
            return;
        }

        List<Department> departments = List.of(
            Department.builder()
                .id("dept-roads")
                .name("Roads & Transport")
                .code("ROADS")
                .officialEmail(OFFICER_EMAIL)
                .description("Handles road maintenance, potholes, traffic signals, street lights, footpaths, and public transport infrastructure.")
                .active(true)
                .totalCount(0).solvedCount(0).pendingCount(0)
                .build(),

            Department.builder()
                .id("dept-water")
                .name("Water Supply & Sewerage")
                .code("WATER")
                .officialEmail(OFFICER_EMAIL)
                .description("Manages drinking water supply, pipeline leaks, sewage overflow, drainage blockages, and water quality complaints.")
                .active(true)
                .totalCount(0).solvedCount(0).pendingCount(0)
                .build(),

            Department.builder()
                .id("dept-sanitation")
                .name("Sanitation & Waste Management")
                .code("SANITATION")
                .officialEmail(OFFICER_EMAIL)
                .description("Oversees garbage collection, street sweeping, solid waste disposal, open dumping complaints, and public toilet maintenance.")
                .active(true)
                .totalCount(0).solvedCount(0).pendingCount(0)
                .build(),

            Department.builder()
                .id("dept-electricity")
                .name("Electricity & Street Lighting")
                .code("ELECTRICITY")
                .officialEmail(OFFICER_EMAIL)
                .description("Covers power outages, faulty transformers, broken street lights, illegal wiring, and electrical hazard complaints.")
                .active(true)
                .totalCount(0).solvedCount(0).pendingCount(0)
                .build(),

            Department.builder()
                .id("dept-health")
                .name("Public Health & Hospitals")
                .code("HEALTH")
                .officialEmail(OFFICER_EMAIL)
                .description("Handles public health concerns, hospital service complaints, epidemic alerts, mosquito breeding, and food safety issues.")
                .active(true)
                .totalCount(0).solvedCount(0).pendingCount(0)
                .build(),

            Department.builder()
                .id("dept-parks")
                .name("Parks & Recreation")
                .code("PARKS")
                .officialEmail(OFFICER_EMAIL)
                .description("Manages public parks, playgrounds, community halls, garden maintenance, and recreational facility complaints.")
                .active(true)
                .totalCount(0).solvedCount(0).pendingCount(0)
                .build(),

            Department.builder()
                .id("dept-building")
                .name("Town Planning & Building Permits")
                .code("BUILDING")
                .officialEmail(OFFICER_EMAIL)
                .description("Handles unauthorized construction, building permit issues, zoning violations, encroachments, and structural safety complaints.")
                .active(true)
                .totalCount(0).solvedCount(0).pendingCount(0)
                .build(),

            Department.builder()
                .id("dept-tax")
                .name("Revenue & Property Tax")
                .code("TAX")
                .officialEmail(OFFICER_EMAIL)
                .description("Manages property tax disputes, assessment errors, billing complaints, land revenue issues, and tax collection grievances.")
                .active(true)
                .totalCount(0).solvedCount(0).pendingCount(0)
                .build(),

            Department.builder()
                .id("dept-education")
                .name("Education & Schools")
                .code("EDUCATION")
                .officialEmail(OFFICER_EMAIL)
                .description("Covers government school complaints, teacher shortages, infrastructure issues, midday meal concerns, and scholarship grievances.")
                .active(true)
                .totalCount(0).solvedCount(0).pendingCount(0)
                .build(),

            Department.builder()
                .id("dept-environment")
                .name("Environment & Pollution Control")
                .code("ENVIRONMENT")
                .officialEmail(OFFICER_EMAIL)
                .description("Handles air and noise pollution, illegal industrial emissions, tree cutting, deforestation, and environmental hazard complaints.")
                .active(true)
                .totalCount(0).solvedCount(0).pendingCount(0)
                .build()
        );

        departmentRepository.saveAll(departments);
        log.info("✅ Seeded {} departments into MUNICIPAL_DEPARTMENTS table with officer email: {}", departments.size(), OFFICER_EMAIL);
    }
}
