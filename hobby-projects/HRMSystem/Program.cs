using HRMSystem.Models;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllersWithViews();
builder.Services.AddSingleton<EmployeeStore>();
var app = builder.Build();
app.UseStaticFiles(); app.UseRouting();
app.MapControllerRoute(name:"default", pattern:"{controller=Home}/{action=Index}/{id?}");
app.Run();
