using System.ComponentModel.DataAnnotations;
namespace HRMSystem.Models;
public class Employee { public int Id {get;set;} [Required] public string Name {get;set;}=""; [Required,EmailAddress] public string Email {get;set;}=""; public string Department {get;set;}=""; public string Role {get;set;}=""; public string Status {get;set;}="Active"; public DateTime Joined {get;set;}=DateTime.Today; }
public class EmployeeStore {
 public List<Employee> Employees {get;} = new(){
  new(){Id=1,Name="Emma Wilson",Email="emma@company.com",Department="Human Resources",Role="HR Manager",Status="Active",Joined=DateTime.Today.AddYears(-3)},
  new(){Id=2,Name="Daniel Lee",Email="daniel@company.com",Department="Engineering",Role="Software Engineer",Status="Active",Joined=DateTime.Today.AddYears(-2)},
  new(){Id=3,Name="Sophia Khan",Email="sophia@company.com",Department="Finance",Role="Financial Analyst",Status="On Leave",Joined=DateTime.Today.AddMonths(-16)},
  new(){Id=4,Name="James Brown",Email="james@company.com",Department="Marketing",Role="Marketing Lead",Status="Active",Joined=DateTime.Today.AddMonths(-9)} };
}
