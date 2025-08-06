package com.example.employeemanagement.controller;

import com.example.employeemanagement.exception.ResourceNotFoundException;
import com.example.employeemanagement.model.Employee;
import com.example.employeemanagement.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:3000")
public class EmployeeController {

  @Autowired
  private EmployeeService employeeService;

  // Both ADMIN and USER can view the list
  @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
  @GetMapping
  public List<Employee> getAllEmployees() {
    return employeeService.getAllEmployees();
  }

  // Both ADMIN and USER can view individual employee
  @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
  @GetMapping("/{id}")
  public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
    Employee employee = employeeService.getEmployeeById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    return ResponseEntity.ok(employee);
  }

  // Only ADMIN can create a new employee
  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping
  public Employee createEmployee(@RequestBody Employee employee) {
    return employeeService.saveEmployee(employee);
  }

  // Only ADMIN can update employee
  @PreAuthorize("hasRole('ADMIN')")
  @PutMapping("/{id}")
  public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee employeeDetails) {
    Employee employee = employeeService.getEmployeeById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

    employee.setFirstName(employeeDetails.getFirstName());
    employee.setLastName(employeeDetails.getLastName());
    employee.setEmail(employeeDetails.getEmail());
    employee.setDepartment(employeeDetails.getDepartment());
    employee.setAge(employeeDetails.getAge());

    Employee updatedEmployee = employeeService.saveEmployee(employee);
    return ResponseEntity.ok(updatedEmployee);
  }



  // Only ADMIN can delete
  @PreAuthorize("hasRole('ADMIN')")
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
    Employee employee = employeeService.getEmployeeById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    employeeService.deleteEmployee(id);
    return ResponseEntity.noContent().build();
  }
}
