package com.example.employeemanagement.controller;

import com.example.employeemanagement.exception.ResourceNotFoundException;
import com.example.employeemanagement.model.Department;
import com.example.employeemanagement.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "http://localhost:3000")
public class DepartmentController {

  @Autowired
  private DepartmentService departmentService;

  // Both ADMIN and USER can view the list
  @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
  @GetMapping
  public List<Department> getAllDepartments() {
    return departmentService.getAllDepartments();
  }

  // Both ADMIN and USER can view department details
  @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
  @GetMapping("/{id}")
  public ResponseEntity<Department> getDepartmentById(@PathVariable Long id) {
    Department department = departmentService.getDepartmentById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
    return ResponseEntity.ok(department);
  }

  // Only ADMIN can create a new department
  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping
  public Department createDepartment(@RequestBody Department department) {
    return departmentService.saveDepartment(department);
  }

  // Only ADMIN can update department
  @PreAuthorize("hasRole('ADMIN')")
  @PutMapping("/{id}")
  public ResponseEntity<Department> updateDepartment(@PathVariable Long id,
                                                     @RequestBody Department departmentDetails) {
    Department department = departmentService.getDepartmentById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
    department.setName(departmentDetails.getName());
    Department updatedDepartment = departmentService.saveDepartment(department);
    return ResponseEntity.ok(updatedDepartment);
  }

  // Only ADMIN can delete department
  @PreAuthorize("hasRole('ADMIN')")
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) {
    Department department = departmentService.getDepartmentById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
    departmentService.deleteDepartment(id);
    return ResponseEntity.noContent().build();
  }
}
