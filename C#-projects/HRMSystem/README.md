# PeopleFlow HRM — ASP.NET Core MVC

A modern Human Resource Management UI built with C#, ASP.NET Core MVC, Razor Views and Bootstrap.

## Included
- Responsive HR dashboard
- Employee directory and search
- Create, edit and delete employees (in-memory demo store)
- Departments, Attendance, Leave, Payroll and Recruitment module shells
- Responsive sidebar/navigation
- Sample employee data

## Requirements
- .NET 8 SDK

## Run
```bash
dotnet restore
dotnet run
```
Open the localhost URL printed by ASP.NET Core.

## Next production steps
Replace `EmployeeStore` with Entity Framework Core + SQL Server/PostgreSQL, add ASP.NET Core Identity/RBAC, migrations, validation, audit logs, payroll/attendance domain models and automated tests.

## Screenshot

![HRM Dashboard](screenshots/screenshot.png)