var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

var app = builder.Build();
bool isLocal = true;
// указать порт, на котором приложение слушает запросы
if (isLocal)
{
    app.Urls.Add("https://localhost:5013");
}
else
{
    app.Urls.Add("http://localhost:5013");
}

//builder.WebHost.UseUrls()
app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
