using System.Text;
using CalorieCalculator.Api.Data;
using CalorieCalculator.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add DbContext (using SQLite for simplicity)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// OpenAI configuration
var openAiApiKey = builder.Configuration["OpenAI:ApiKey"];
builder.Services.AddSingleton(new OpenAiSettings { ApiKey = openAiApiKey });

// Add Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IFoodService, FoodService>();
builder.Services.AddScoped<IEntryService, EntryService>();
builder.Services.AddScoped<IMetricsService, MetricsService>();
builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddScoped<IImageRecognitionService, ImageRecognitionService>();
builder.Services.AddScoped<IRecipeAnalyzerService, RecipeAnalyzerService>();
builder.Services.AddScoped<IWaterService, WaterService>();
builder.Services.AddScoped<IFavoriteMealService, FavoriteMealService>();
builder.Services.AddScoped<ISuggestionsService, SuggestionsService>();
builder.Services.AddHttpClient();

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "YourSuperSecretKeyThatIsAtLeast32CharactersLong!";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "CalorieCalculatorApi";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "CalorieCalculatorApp";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

// Add Controllers
builder.Services.AddControllers();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",
                "http://localhost:3001", 
                "http://localhost:3002", 
                "http://localhost:3003",
                "https://aashishthegreatcalorieproject.netlify.app"
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Calorie Calculator API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Configure pipeline - Enable Swagger in all environments for API testing
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Auto-create database in development
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.Run();

