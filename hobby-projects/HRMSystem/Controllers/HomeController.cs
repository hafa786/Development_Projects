using Microsoft.AspNetCore.Mvc; using HRMSystem.Models;
namespace HRMSystem.Controllers;
public class HomeController(EmployeeStore store):Controller { public IActionResult Index()=>View(store.Employees); }
