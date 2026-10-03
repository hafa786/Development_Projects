package com.darmisolutions.darmihire.department;

import com.darmisolutions.darmihire.department.dto.CreateDepartmentRequest;
import com.darmisolutions.darmihire.department.dto.DepartmentResponse;
import com.darmisolutions.darmihire.department.dto.UpdateDepartmentRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/departments")
@RequiredArgsConstructor
public class DepartmentController {

	private final DepartmentService departmentService;

	@GetMapping
	public List<DepartmentResponse> findAll() {
		return departmentService.findAll();
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public DepartmentResponse create(
			@Valid @RequestBody CreateDepartmentRequest request) {
		return departmentService.create(
				request);
	}

	@PatchMapping("/{id}")
	public DepartmentResponse update(
			@PathVariable UUID id,
			@Valid @RequestBody UpdateDepartmentRequest request) {
		return departmentService.update(
				id,
				request);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(
			@PathVariable UUID id) {
		departmentService.delete(
				id);
	}
}