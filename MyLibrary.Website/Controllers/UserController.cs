using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MyLibrary.Common.Requests;
using MyLibrary.Common.Responses;
using Newtonsoft.Json;

namespace MyLibrary.Website.Controllers.api
{
    /// <summary>
    /// Used to call user api
    /// </summary>
    [Authorize]
    [Route("api/User")]
    public class UserController : BaseApiController
    {
        public UserController(IHttpClientFactory clientFactory, IConfiguration configuration, IHttpContextAccessor httpContextAccessor) : base(clientFactory, configuration, httpContextAccessor)
        {
            _httpClient.BaseAddress = new Uri(_configuration.GetSection("BaseApiUrl").Value);
        }

        /// <summary>
        /// Used to register a user
        /// </summary>
        /// <param name="request">The registration information</param>
        /// <returns>The registration response</returns>
        [AllowAnonymous]
        [HttpPost("")]
        public async Task<IActionResult> Register([FromBody] RegisterUserRequest request)
        {
            var restResponse = new HttpResponseMessage();
            try
            {
                var restRequest = new HttpRequestMessage(HttpMethod.Post, "api/user");
                restResponse = await _httpClient.SendAsync(restRequest);

                if (restResponse.IsSuccessStatusCode)
                {
                    RegisterUserResponse response = JsonConvert.DeserializeObject<RegisterUserResponse>(await restResponse.Content.ReadAsStringAsync());

                    var claims = new List<Claim>
                    {
                        new Claim("Token", response.Token)
                    };

                    var claimsIdentity = new ClaimsIdentity(
                        claims, CookieAuthenticationDefaults.AuthenticationScheme);

                    var authProperties = new AuthenticationProperties
                    {
                        AllowRefresh = true,
                        ExpiresUtc = DateTimeOffset.UtcNow.AddYears(1),
                        IsPersistent = true,

                        IssuedUtc = DateTime.UtcNow,

                        RedirectUri = "/",
                    };

                    await HttpContext.SignInAsync(
                        CookieAuthenticationDefaults.AuthenticationScheme,
                        new ClaimsPrincipal(claimsIdentity),
                        authProperties);

                    return Ok(response);
                }
                else if (restResponse.StatusCode == HttpStatusCode.BadRequest)
                {
                    GetUsersResponse response = JsonConvert.DeserializeObject<GetUsersResponse>(await restResponse.Content.ReadAsStringAsync());
                    return BadRequest(BuildBadRequestMessage(response));
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Unable to register user");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
            return new StatusCodeResult((int)restResponse.StatusCode);
        }

        /// <summary>
        /// used to get a users inforamtion if they are logged in
        /// </summary>
        /// <returns>The response with the users information</returns>
        [AllowAnonymous]
        [HttpGet("userinfo")]
        public async Task<IActionResult> GetUserInfo()
        {
            HttpResponseMessage restResponse;
            try
            {
                if (_httpContextAccessor.HttpContext.User.Claims.Count() == 0)
                {
                    return Ok(null);
                }

                var restRequest = new HttpRequestMessage(HttpMethod.Get, "api/user/userinfo");
                restRequest.Headers.Add("Authorization", $"Bearer {GetToken()}");
                restResponse = await _httpClient.SendAsync(restRequest);

                if (restResponse.IsSuccessStatusCode)
                {
                    GetUserInfoResponse response = JsonConvert.DeserializeObject<GetUserInfoResponse>(await restResponse.Content.ReadAsStringAsync());
                    return Ok(response);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Unable to retreive users");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
            return new StatusCodeResult((int)restResponse.StatusCode);
        }

        /// <summary>
        /// Used to get all users
        /// </summary>
        /// <returns>The response with the users</returns>
        [HttpGet("")]
        public async Task<IActionResult> GetUsers()
        {
            var restResponse = new HttpResponseMessage();
            try
            {
                var restRequest = new HttpRequestMessage(HttpMethod.Get, "api/user");
                restRequest.Headers.Add("Authorization", $"Bearer {GetToken()}");
                restResponse = await _httpClient.SendAsync(restRequest);

                if (restResponse.IsSuccessStatusCode)
                {
                    GetUsersResponse response = JsonConvert.DeserializeObject<GetUsersResponse>(await restResponse.Content.ReadAsStringAsync());
                    return Ok(response);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Unable to retreive users");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
            return new StatusCodeResult((int)restResponse.StatusCode);
        }

        /// <summary>
        /// Used to check if user with username exists
        /// </summary>
        /// <returns>The response with the result</returns>
        [AllowAnonymous]
        [HttpGet("{username}")]
        public async Task<IActionResult> CheckUsernameTaken([FromRoute] string username)
        {
            var restResponse = new HttpResponseMessage();
            try
            {
                var restRequest = new HttpRequestMessage(HttpMethod.Get, $"api/user/{username}");
                restResponse = await _httpClient.SendAsync(restRequest);

                if (restResponse.IsSuccessStatusCode)
                {
                    UsernameCheckResponse response = JsonConvert.DeserializeObject<UsernameCheckResponse>(await restResponse.Content.ReadAsStringAsync());
                    return Ok(response);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Unable to check user");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
            return new StatusCodeResult((int)restResponse.StatusCode);
        }

        /// <summary>
        /// Used to login a user
        /// </summary>
        /// <param name="request">The request with the users login information</param>
        /// <returns>The response with the users token</returns>
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var restRequest = new HttpRequestMessage(HttpMethod.Post, "api/user/login");
                var content = new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, "application/json");
                restRequest.Content = content;
                var restResponse = await _httpClient.SendAsync(restRequest);
                LoginResponse response = JsonConvert.DeserializeObject<LoginResponse>(await restResponse.Content.ReadAsStringAsync());

                if (restResponse.StatusCode == HttpStatusCode.OK)
                {
                    var claims = new List<Claim>
                    {
                        new Claim("Token", response.Token)
                    };

                    var claimsIdentity = new ClaimsIdentity(
                        claims, CookieAuthenticationDefaults.AuthenticationScheme);

                    var authProperties = new AuthenticationProperties
                    {
                        AllowRefresh = true,
                        ExpiresUtc = DateTimeOffset.UtcNow.AddYears(1),
                        IsPersistent = true,

                        IssuedUtc = DateTime.UtcNow,

                        RedirectUri = "/",
                    };

                    await HttpContext.SignInAsync(
                        CookieAuthenticationDefaults.AuthenticationScheme,
                        new ClaimsPrincipal(claimsIdentity),
                        authProperties);

                    return Ok(response);
                }
                else if (restResponse.StatusCode == HttpStatusCode.Accepted)
                {
                    return Accepted();
                }
                else if (restResponse.StatusCode == HttpStatusCode.BadRequest)
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Unable to login user.");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
            return new StatusCodeResult(StatusCodes.Status500InternalServerError);
        }

        /// <summary>
        /// Used to log out a user
        /// </summary>
        /// <returns>The result</returns>
        [HttpPost("logout")]
        public async Task<IActionResult> LogOut()
        {
            try
            {
                await _httpContextAccessor.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Unable to retreive users");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }
    }
}