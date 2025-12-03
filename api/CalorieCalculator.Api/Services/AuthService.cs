using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CalorieCalculator.Api.Data;
using CalorieCalculator.Api.DTOs;
using CalorieCalculator.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace CalorieCalculator.Api.Services;

public interface IAuthService
{
    Task<AuthResponse?> RegisterAsync(RegisterRequest request);
    Task<AuthResponse?> LoginAsync(LoginRequest request);
    Task<UserDto?> GetUserByIdAsync(int userId);
    Task<UserGoalsDto?> GetUserGoalsAsync(int userId);
    Task<UserGoalsDto?> UpdateUserGoalsAsync(int userId, UpdateGoalsRequest request);
    Task<UserDto?> UpdateProfileAsync(int userId, UpdateProfileRequest request);
    Task<bool> ChangePasswordAsync(int userId, ChangePasswordRequest request);
    Task<bool> DeleteAccountAsync(int userId);
}

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<AuthResponse?> RegisterAsync(RegisterRequest request)
    {
        // Check if email already exists
        if (await _context.Users.AnyAsync(u => u.Email == request.Email.ToLower()))
        {
            return null;
        }

        var user = new User
        {
            FirstName = request.FirstName,
            MiddleName = request.MiddleName,
            LastName = request.LastName,
            Email = request.Email.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = GenerateJwtToken(user);
        return new AuthResponse
        {
            Token = token,
            User = MapToDto(user)
        };
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email.ToLower());

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return null;
        }

        var token = GenerateJwtToken(user);
        return new AuthResponse
        {
            Token = token,
            User = MapToDto(user)
        };
    }

    public async Task<UserDto?> GetUserByIdAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        return user == null ? null : MapToDto(user);
    }

    public async Task<UserGoalsDto?> GetUserGoalsAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return null;

        return new UserGoalsDto
        {
            CalorieGoal = user.CalorieGoal,
            ProteinGoal = user.ProteinGoal,
            CarbsGoal = user.CarbsGoal,
            FatGoal = user.FatGoal
        };
    }

    public async Task<UserGoalsDto?> UpdateUserGoalsAsync(int userId, UpdateGoalsRequest request)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return null;

        user.CalorieGoal = request.CalorieGoal;
        user.ProteinGoal = request.ProteinGoal;
        user.CarbsGoal = request.CarbsGoal;
        user.FatGoal = request.FatGoal;

        await _context.SaveChangesAsync();

        return new UserGoalsDto
        {
            CalorieGoal = user.CalorieGoal,
            ProteinGoal = user.ProteinGoal,
            CarbsGoal = user.CarbsGoal,
            FatGoal = user.FatGoal
        };
    }

    private string GenerateJwtToken(User user)
    {
        var key = _configuration["Jwt:Key"] ?? "YourSuperSecretKeyThatIsAtLeast32CharactersLong!";
        var issuer = _configuration["Jwt:Issuer"] ?? "CalorieCalculatorApi";
        var audience = _configuration["Jwt:Audience"] ?? "CalorieCalculatorApp";
        var expiresInMinutes = int.Parse(_configuration["Jwt:ExpiresInMinutes"] ?? "1440");

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim("userId", user.Id.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiresInMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<UserDto?> UpdateProfileAsync(int userId, UpdateProfileRequest request)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return null;

        user.FirstName = request.FirstName;
        user.MiddleName = request.MiddleName;
        user.LastName = request.LastName;

        await _context.SaveChangesAsync();

        return MapToDto(user);
    }

    public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordRequest request)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return false;

        // Verify current password
        if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
        {
            return false;
        }

        // Hash and save new password
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAccountAsync(int userId)
    {
        var user = await _context.Users
            .Include(u => u.Foods)
            .Include(u => u.EntryItems)
            .FirstOrDefaultAsync(u => u.Id == userId);
            
        if (user == null) return false;

        // Delete user's foods and entries (cascade should handle this, but being explicit)
        _context.EntryItems.RemoveRange(user.EntryItems);
        _context.Foods.RemoveRange(user.Foods.Where(f => f.UserId == userId));
        _context.Users.Remove(user);
        
        await _context.SaveChangesAsync();

        return true;
    }

    private static UserDto MapToDto(User user) => new()
    {
        Id = user.Id,
        FirstName = user.FirstName,
        MiddleName = user.MiddleName,
        LastName = user.LastName,
        FullName = user.FullName,
        Email = user.Email,
        CreatedAt = user.CreatedAt,
        CalorieGoal = user.CalorieGoal,
        ProteinGoal = user.ProteinGoal,
        CarbsGoal = user.CarbsGoal,
        FatGoal = user.FatGoal
    };
}

