using Microsoft.AspNetCore.Mvc; using HRMSystem.Models;
namespace HRMSystem.Controllers;
public class EmployeesController(EmployeeStore store):Controller {
 public IActionResult Index(string? q){ var x=store.Employees.AsEnumerable(); if(!string.IsNullOrWhiteSpace(q)) x=x.Where(e=>e.Name.Contains(q,StringComparison.OrdinalIgnoreCase)||e.Department.Contains(q,StringComparison.OrdinalIgnoreCase)); return View(x.ToList()); }
 public IActionResult Create()=>View(new Employee());
 [HttpPost] public IActionResult Create(Employee e){ if(!ModelState.IsValid)return View(e); e.Id=store.Employees.Any()?store.Employees.Max(x=>x.Id)+1:1; store.Employees.Add(e); return RedirectToAction(nameof(Index)); }
 public IActionResult Edit(int id){var e=store.Employees.FirstOrDefault(x=>x.Id==id);return e==null?NotFound():View(e);}
 [HttpPost] public IActionResult Edit(Employee e){if(!ModelState.IsValid)return View(e);var old=store.Employees.FirstOrDefault(x=>x.Id==e.Id);if(old==null)return NotFound();old.Name=e.Name;old.Email=e.Email;old.Department=e.Department;old.Role=e.Role;old.Status=e.Status;old.Joined=e.Joined;return RedirectToAction(nameof(Index));}
 [HttpPost] public IActionResult Delete(int id){var e=store.Employees.FirstOrDefault(x=>x.Id==id);if(e!=null)store.Employees.Remove(e);return RedirectToAction(nameof(Index));}
}
