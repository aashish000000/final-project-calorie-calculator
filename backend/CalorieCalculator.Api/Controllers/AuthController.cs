using CalorieCalculator.Api.DTOs;
using CalorieCalculator.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CalorieCalculator.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        var result = await _authService.RegisterAsync(request);

        if (result == null)
        {
            return BadRequest(new { message = "Email already exists" });
        }

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);

        if (result == null)
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        return Ok(result);
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var user = await _authService.GetUserByIdAsync(userId);
        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    [HttpGet("goals")]
    [Authorize]
    public async Task<ActionResult<UserGoalsDto>> GetGoals()
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var goals = await _authService.GetUserGoalsAsync(userId);
        if (goals == null)
        {
            return NotFound();
        }

        return Ok(goals);
    }

    [HttpPut("goals")]
    [Authorize]
    public async Task<ActionResult<UserGoalsDto>> UpdateGoals([FromBody] UpdateGoalsRequest request)
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var goals = await _authService.UpdateUserGoalsAsync(userId, request);
        if (goals == null)
        {
            return NotFound();
        }

        return Ok(goals);
    }

    [HttpPut("profile")]
    [Authorize]
    public async Task<ActionResult<UserDto>> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var user = await _authService.UpdateProfileAsync(userId, request);
        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    [HttpPut("change-password")]
    [Authorize]
    public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var result = await _authService.ChangePasswordAsync(userId, request);
        if (!result)
        {
            return BadRequest(new { message = "Current password is incorrect" });
        }

        return Ok(new { message = "Password changed successfully" });
    }

    [HttpDelete("account")]
    [Authorize]
    public async Task<ActionResult> DeleteAccount()
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var result = await _authService.DeleteAccountAsync(userId);
        if (!result)
        {
            return NotFound();
        }

        return Ok(new { message = "Account deleted successfully" });
    }

    [HttpPost("profile-picture")]
    [Authorize]
    public async Task<ActionResult<UserDto>> UploadProfilePicture([FromBody] UploadProfilePictureRequest request)
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var user = await _authService.UploadProfilePictureAsync(userId, request.ImageData);
        if (user == null)
        {
            return BadRequest(new { message = "Invalid image data" });
        }

        return Ok(user);
    }

    [HttpDelete("profile-picture")]
    [Authorize]
    public async Task<ActionResult> RemoveProfilePicture()
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var result = await _authService.RemoveProfilePictureAsync(userId);
        if (!result)
        {
            return NotFound();
        }

        return Ok(new { message = "Profile picture removed successfully" });
    }
}

